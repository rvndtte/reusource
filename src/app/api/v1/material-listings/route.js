import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CLUSTER_THRESHOLD_VOLUME_KG = 500.0;
// Max distance (km) between two listings for them to be merged into the same geo-cluster
const CLUSTER_GEO_RADIUS_KM = 75;

/**
 * Haversine formula — returns distance in km between two lat/lon points.
 */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Given a list of listings (all same category + grade), perform geographic
 * single-linkage clustering. Any listing within CLUSTER_GEO_RADIUS_KM of
 * ANY existing cluster centroid is merged into that cluster.
 *
 * Returns an array of clusters, each being { centroidLat, centroidLon, items[] }.
 */
function geoClusters(listings) {
  const clusters = [];

  for (const l of listings) {
    const lat = Number(l.latitude ?? -6.2088);
    const lon = Number(l.longitude ?? 106.8456);

    let merged = false;
    for (const cluster of clusters) {
      const dist = haversineKm(cluster.centroidLat, cluster.centroidLon, lat, lon);
      if (dist <= CLUSTER_GEO_RADIUS_KM) {
        cluster.items.push(l);
        // Update centroid (running average of all members)
        const n = cluster.items.length;
        cluster.centroidLat = cluster.items.reduce((s, x) => s + Number(x.latitude ?? -6.2088), 0) / n;
        cluster.centroidLon = cluster.items.reduce((s, x) => s + Number(x.longitude ?? 106.8456), 0) / n;
        merged = true;
        break;
      }
    }

    if (!merged) {
      clusters.push({ centroidLat: lat, centroidLon: lon, items: [l] });
    }
  }

  return clusters;
}

export async function GET(request) {
  try {
    await db.ready();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const city = searchParams.get('city');
    const statusFilter = searchParams.get('status_filter'); // if not provided, default to active
    const shouldAggregate = searchParams.get('aggregate') !== 'false';

    const listings = await db.material_listings.find((l) => {
      if (statusFilter && statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (!statusFilter && l.status !== 'active') return false;
      if (categoryId && l.category_id !== categoryId) return false;
      if (city && !l.city?.toLowerCase().includes(city.toLowerCase())) return false;
      return true;
    });

    // If caller explicitly wants raw unaggregated listings (e.g. supplier's own raw records)
    if (!shouldAggregate) {
      const sanitized = await Promise.all(listings.map(async (l) => {
        const category = await db.categories.findById(l.category_id);
        const comp = l.company_id ? await db.companies.findById(l.company_id) : null;
        return {
          id: l.id,
          category_id: l.category_id,
          category_name: category?.name || 'Biomassa Kayu',
          title: l.title,
          description: l.description,
          grade_spec: l.grade_spec,
          available_quantity: l.available_quantity,
          initial_quantity: l.initial_quantity,
          unit: l.unit,
          price_per_unit: l.price_per_unit,
          frequency: l.frequency,
          city: l.city,
          latitude: l.latitude,
          longitude: l.longitude,
          approx_radius_km: 0,
          status: l.status,
          supplier_company_name: comp?.name || 'Mitra Pemasok',
          created_at: l.created_at,
        };
      }));
      return NextResponse.json(sanitized);
    }

    // --- AGGREGATION LOGIC (Katalog Kluster Teragregasi) ---
    // Step 1: Group listings by Category + Grade (exact match)
    const gradeGroupMap = new Map();
    for (const l of listings) {
      const grade = l.grade_spec?.grade || 'A';
      const catId = l.category_id || 'cat-wood-001';
      const key = `${catId}__${grade}`;
      if (!gradeGroupMap.has(key)) gradeGroupMap.set(key, []);
      gradeGroupMap.get(key).push(l);
    }

    // Step 2: Within each (category, grade) group, apply Haversine geo-radius clustering
    const aggregatedCatalog = [];

    for (const [gradeKey, groupListings] of gradeGroupMap.entries()) {
      const [catId, grade] = gradeKey.split('__');
      const category = await db.categories.findById(catId);

      const geoClustered = geoClusters(groupListings);

      for (const geoCluster of geoClustered) {
        const items = geoCluster.items;
        if (items.length === 0) continue;

        // Representative listing (first) for fallback metadata
        const rep = items[0];

        // Collect unique city names for the cluster label
        const uniqueCities = [...new Set(items.map((l) => (l.city || 'Indonesia').trim()))];
        const cityLabel =
          uniqueCities.length === 1
            ? uniqueCities[0]
            : `${uniqueCities[0]} & ${uniqueCities.length - 1} Kota Lainnya`;

        // Build stable cluster ID from the first representative city
        const cityPrefix =
          uniqueCities[0].replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'HUB';
        const clusterId = `KLS-${cityPrefix}-${grade}-${catId.slice(-3)}`;

        // Accumulate quantities and prices
        let availableQty = 0;
        let initialQty = 0;
        let totalPriceAcc = 0;
        let newestCreatedAt = rep.created_at;
        const uniqueSupplierIds = new Set();
        const contributions = [];

        for (const l of items) {
          const qty = Number(l.available_quantity) || 0;
          const iQty = Number(l.initial_quantity) || qty;
          const unitPrice = Number(l.price_per_unit) || 800;
          const supplierComp = l.company_id ? await db.companies.findById(l.company_id) : null;

          availableQty += qty;
          initialQty += iQty;
          totalPriceAcc += qty * unitPrice;
          if (l.company_id) uniqueSupplierIds.add(l.company_id);

          if (new Date(l.created_at) > new Date(newestCreatedAt)) {
            newestCreatedAt = l.created_at;
          }

          contributions.push({
            listing_id: l.id,
            supplier_company_id: l.company_id,
            supplier_company_name: supplierComp?.name || 'Mitra Pengrajin Terverifikasi',
            city: l.city || uniqueCities[0],
            weight_kg: qty,
            initial_weight_kg: iQty,
            price_per_kg: unitPrice,
            grade: grade,
            is_dry: l.grade_spec?.is_dry ?? true,
            is_clean: l.grade_spec?.is_clean ?? true,
            notes: l.description || 'Setoran stok pasokan terverifikasi',
            created_at: l.created_at,
          });
        }

        const avgPrice =
          availableQty > 0
            ? Math.round(totalPriceAcc / availableQty)
            : Number(rep.price_per_unit) || 800;

        const isReady = availableQty >= CLUSTER_THRESHOLD_VOLUME_KG;
        const contributorCount = Math.max(1, uniqueSupplierIds.size);
        const wasteName = (category?.name || rep.title || 'Serbuk Serutan Kayu Jati').split(
          ' (Grade'
        )[0];

        aggregatedCatalog.push({
          id: clusterId,
          realId: clusterId,
          is_aggregated_cluster: true,
          category_id: catId,
          category_name: category?.name || 'Serbuk Kayu Biomassa',
          waste_type: wasteName,
          title: `${wasteName} (Grade ${grade})`,
          cluster_name: `${wasteName} (Grade ${grade}) - Kluster ${cityLabel}`,
          description: `Kluster agregasi pasokan dari ${contributorCount} mitra UMKM di wilayah ${cityLabel} (radius ≤${CLUSTER_GEO_RADIUS_KM} km). Total terkumpul: ${availableQty} kg, siap kirim via rute logistik Milk-Run.`,
          grade: grade,
          grade_spec: {
            grade: grade,
            is_dry: rep.grade_spec?.is_dry ?? true,
            is_clean: rep.grade_spec?.is_clean ?? true,
            evaluated_reason: `Kluster Pasokan Teragregasi Mutu Grade ${grade} — Wilayah ${cityLabel}`,
          },
          available_quantity: availableQty,
          initial_quantity: initialQty,
          unit: rep.unit || 'kg',
          price_per_unit: avgPrice,
          city: cityLabel,
          latitude: geoCluster.centroidLat,
          longitude: geoCluster.centroidLon,
          approx_radius_km: CLUSTER_GEO_RADIUS_KM,
          status: availableQty > 0 ? 'active' : 'sold_out',
          is_ready_for_sale: isReady,
          contributor_count: contributorCount,
          submission_count: contributions.length,
          contributions: contributions,
          listing_ids: contributions.map((c) => c.listing_id),
          created_at: newestCreatedAt,
        });
      }
    }

    // Sort: newest first
    aggregatedCatalog.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json(aggregatedCatalog);
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
