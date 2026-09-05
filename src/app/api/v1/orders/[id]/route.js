import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const order = db.orders.findById(id);
    if (!order) {
      return NextResponse.json(
        { detail: 'Order not found' },
        { status: 404 }
      );
    }

    const items = db.order_items.find((item) => item.order_id === order.id);
    const buyerCompany = db.companies.findById(order.buyer_company_id);

    const itemsRes = items.map((item) => {
      const listing = db.material_listings.findById(item.material_listing_id);
      const supplierCompany = item.supplier_company_id ? db.companies.findById(item.supplier_company_id) : null;
      return {
        id: item.id,
        supplier_company_id: item.supplier_company_id,
        supplier_company_name: supplierCompany?.name || '',
        material_listing_id: item.material_listing_id,
        listing_title: listing?.title || '',
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      };
    });

    return NextResponse.json({
      id: order.id,
      aggregated_supply_id: order.aggregated_supply_id,
      buying_request_id: order.buying_request_id,
      buyer_company_id: order.buyer_company_id,
      buyer_company_name: buyerCompany?.name || '',
      total_amount: order.total_amount,
      platform_fee: order.platform_fee,
      order_status: order.order_status,
      items: itemsRes,
      created_at: order.created_at,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
