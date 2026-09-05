import { db } from './db.js';

export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371.0; // Earth radius in km

  const toRad = (angle) => (angle * Math.PI) / 180.0;
  const dlat = toRad(lat2 - lat1);
  const dlon = toRad(lon2 - lon1);

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 100) / 100; // 2 decimal places
}

export class SmartMatchingEngine {
  static async findAndAggregateSuppliers(buyingRequestId, maxRadiusKm = 150.0) {
    const request = db.buying_requests.findById(buyingRequestId);
    if (!request || ['fulfilled', 'cancelled'].includes(request.status)) {
      return null;
    }

    // Candidate active listings in same category & within max price
    const candidateListings = db.material_listings.find(
      (l) =>
        l.category_id === request.category_id &&
        l.status === 'active' &&
        l.available_quantity > 0 &&
        l.price_per_unit <= request.max_price_per_unit &&
        l.company_id !== request.buyer_company_id
    );

    if (!candidateListings || candidateListings.length === 0) {
      return null;
    }

    // Calculate distance and composite score
    const scoredCandidates = [];
    for (const listing of candidateListings) {
      const distanceKm = calculateHaversineDistance(
        request.latitude || -6.2088,
        request.longitude || 106.8456,
        listing.latitude || -6.2088,
        listing.longitude || 106.8456
      );

      if (distanceKm <= maxRadiusKm) {
        // Score: 60% price weight + 40% distance weight (lower is better)
        const score = listing.price_per_unit * 0.6 + distanceKm * 0.4;
        scoredCandidates.push({ score, distanceKm, listing });
      }
    }

    // Sort by best score (ascending)
    scoredCandidates.sort((a, b) => a.score - b.score);

    if (scoredCandidates.length === 0) {
      return null;
    }

    // Greedy Multi-Supplier Allocation
    let remainingNeeded = request.target_quantity;
    let totalMatchedQty = 0.0;
    let totalMaterialCost = 0.0;
    let totalDistance = 0.0;
    const allocationItems = [];

    for (const { distanceKm, listing } of scoredCandidates) {
      if (remainingNeeded <= 0) break;

      const allocatedQty = Math.min(listing.available_quantity, remainingNeeded);
      const subtotal = allocatedQty * listing.price_per_unit;

      allocationItems.push({
        listing,
        allocated_quantity: allocatedQty,
        unit_price: listing.price_per_unit,
        subtotal,
        distance_km: distanceKm,
      });

      totalMatchedQty += allocatedQty;
      totalMaterialCost += subtotal;
      totalDistance += distanceKm;
      remainingNeeded -= allocatedQty;
    }

    if (allocationItems.length === 0) {
      return null;
    }

    // Platform fee 3%
    const platformFee = Math.round(totalMaterialCost * 0.03 * 100) / 100;
    const totalEstimatedPrice = totalMaterialCost + platformFee;
    const avgDistance = Math.round((totalDistance / allocationItems.length) * 100) / 100;

    const aggregatedSupply = db.aggregated_supplies.create({
      buying_request_id: request.id,
      total_matched_quantity: totalMatchedQty,
      total_material_cost: totalMaterialCost,
      platform_fee: platformFee,
      total_estimated_price: totalEstimatedPrice,
      supplier_count: allocationItems.length,
      average_distance_km: avgDistance,
      status: 'proposed',
    });

    for (const item of allocationItems) {
      db.aggregated_supply_items.create({
        aggregated_supply_id: aggregatedSupply.id,
        material_listing_id: item.listing.id,
        allocated_quantity: item.allocated_quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        distance_km: item.distance_km,
      });
    }

    db.buying_requests.update(request.id, { status: 'matched' });

    return aggregatedSupply;
  }
}
