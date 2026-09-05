import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SmartMatchingEngine } from '@/lib/matchingEngine';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const buyingRequestId = body.buying_request_id;
    const maxRadiusKm = Number(body.max_radius_km) || 150.0;

    if (!buyingRequestId) {
      return NextResponse.json(
        { detail: 'buying_request_id is required' },
        { status: 400 }
      );
    }

    const aggregatedSupply = await SmartMatchingEngine.findAndAggregateSuppliers(
      buyingRequestId,
      maxRadiusKm
    );

    if (!aggregatedSupply) {
      return NextResponse.json(
        { detail: 'No matching active suppliers found within target criteria and price limit.' },
        { status: 404 }
      );
    }

    const buyingReq = db.buying_requests.findById(aggregatedSupply.buying_request_id);
    const supplyItems = db.aggregated_supply_items.find(
      (item) => item.aggregated_supply_id === aggregatedSupply.id
    );

    const itemsRes = supplyItems.map((item) => {
      const listing = db.material_listings.findById(item.material_listing_id);
      const supplierCompany = listing ? db.companies.findById(listing.company_id) : null;
      return {
        id: item.id,
        material_listing_id: item.material_listing_id,
        listing_title: listing?.title || '',
        supplier_company_id: listing?.company_id || '',
        supplier_company_name: supplierCompany?.name || '',
        allocated_quantity: item.allocated_quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        distance_km: item.distance_km,
      };
    });

    return NextResponse.json(
      {
        id: aggregatedSupply.id,
        buying_request_id: aggregatedSupply.buying_request_id,
        total_matched_quantity: aggregatedSupply.total_matched_quantity,
        target_quantity: buyingReq ? buyingReq.target_quantity : aggregatedSupply.total_matched_quantity,
        total_material_cost: aggregatedSupply.total_material_cost,
        platform_fee: aggregatedSupply.platform_fee,
        total_estimated_price: aggregatedSupply.total_estimated_price,
        supplier_count: aggregatedSupply.supplier_count,
        average_distance_km: aggregatedSupply.average_distance_km || 0.0,
        status: aggregatedSupply.status,
        items: itemsRes,
        created_at: aggregatedSupply.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
