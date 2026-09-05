import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const CLUSTER_THRESHOLD_VOLUME_KG = 500.0;

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    const userComp = user?.company;

    const allActiveListings = db.material_listings.find((l) => l.status === 'active');
    
    let filteredListings = allActiveListings;
    let clusterName = 'Kluster Wilayah Regional Hub #01';
    let clusterRadius = 25.0;

    if (userComp) {
      clusterName = `Kluster Wilayah ${userComp.city || 'Lokal'} Hub #01`;
      filteredListings = allActiveListings.filter((l) => {
        // If same company
        if (l.company_id === userComp.id) return true;
        // If same city
        if (l.city && userComp.city && l.city.toLowerCase() === userComp.city.toLowerCase()) return true;
        // If within 50 km distance
        if (userComp.latitude && userComp.longitude && l.latitude && l.longitude) {
          const dist = getDistanceFromLatLonInKm(userComp.latitude, userComp.longitude, l.latitude, l.longitude);
          return dist <= 50.0;
        }
        return false;
      });
    }

    const totalKg = filteredListings.reduce((acc, l) => acc + (Number(l.available_quantity) || 0), 0);
    const contributors = new Set(filteredListings.map((l) => l.company_id));
    const contributorCount = contributors.size;

    const isReady = totalKg >= CLUSTER_THRESHOLD_VOLUME_KG;
    const progressPct = totalKg > 0
      ? Math.min(100.0, Math.round((totalKg / CLUSTER_THRESHOLD_VOLUME_KG) * 1000) / 10)
      : 0;

    let statusLabel = 'AGREGASI BERJALAN';
    if (isReady) statusLabel = 'KLUSTER SIAP DIJUAL';
    else if (totalKg === 0) statusLabel = 'MENUNGGU DATA PASOKAN';

    return NextResponse.json({
      cluster_id: `KLS-${(userComp?.city || 'REG').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)}-01`,
      cluster_name: clusterName,
      target_volume_kg: CLUSTER_THRESHOLD_VOLUME_KG,
      current_volume_kg: totalKg,
      progress_percentage: progressPct,
      contributor_count: contributorCount,
      radius_km: clusterRadius,
      is_ready_for_sale: isReady,
      status_label: statusLabel,
    });
  } catch (error) {
    console.error('Cluster progress error:', error);
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
