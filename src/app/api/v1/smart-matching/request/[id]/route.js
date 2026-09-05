import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const aggregations = db.aggregated_supplies.find(
      (agg) => agg.buying_request_id === id
    );

    const result = aggregations.map((agg) => {
      const buyingReq = db.buying_requests.findById(agg.buying_request_id);
      const supplyItems = db.aggregated_supply_items.find(
        (item) => item.aggregated_supply_id === agg.id
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

      return {
        id: agg.id,
        buying_request_id: agg.buying_request_id,
        total_matched_quantity: agg.total_matched_quantity,
        target_quantity: buyingReq ? buyingReq.target_quantity : agg.total_matched_quantity,
        total_material_cost: agg.total_material_cost,
        platform_fee: agg.platform_fee,
        total_estimated_price: agg.total_estimated_price,
        supplier_count: agg.supplier_count,
        average_distance_km: agg.average_distance_km || 0.0,
        status: agg.status,
        items: itemsRes,
        created_at: agg.created_at,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
