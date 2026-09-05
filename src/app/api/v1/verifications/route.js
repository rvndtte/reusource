import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const verifierUserId = searchParams.get('verifier_user_id') || 'usr-ver-001';
    const body = await request.json().catch(() => ({}));

    const order = db.orders.findById(body.order_id);
    if (!order) {
      return NextResponse.json(
        { detail: 'Order not found' },
        { status: 404 }
      );
    }

    const verification = db.verifications.create({
      order_id: order.id,
      verifier_user_id: verifierUserId,
      status: body.status || 'passed',
      actual_received_quantity: Number(body.actual_received_quantity || 0),
      quality_notes: body.quality_notes || '',
      inspection_photos: body.inspection_photos || [],
    });

    if (['passed', 'partial_reject'].includes(body.status)) {
      db.orders.update(order.id, { order_status: 'completed' });

      const buyingReq = db.buying_requests.findById(order.buying_request_id);
      const category = buyingReq ? db.categories.findById(buyingReq.category_id) : null;
      const co2Factor = category?.co2_saved_factor_per_unit || 1.5;

      const co2Avoided = Number(body.actual_received_quantity) * co2Factor * 1000.0;
      const supplierRevenue = Number(order.total_amount) - Number(order.platform_fee);
      const buyerSavings = Number(order.total_amount) * 0.15;

      db.impact_logs.create({
        order_id: order.id,
        buyer_company_id: order.buyer_company_id,
        category_id: buyingReq ? buyingReq.category_id : null,
        total_material_reused: Number(body.actual_received_quantity),
        co2_avoided_kg: co2Avoided,
        supplier_revenue_earned: supplierRevenue,
        buyer_cost_saved: buyerSavings,
      });
    }

    return NextResponse.json(
      {
        id: verification.id,
        order_id: verification.order_id,
        verifier_user_id: verification.verifier_user_id,
        status: verification.status,
        actual_received_quantity: verification.actual_received_quantity,
        quality_notes: verification.quality_notes,
        inspection_photos: verification.inspection_photos,
        created_at: verification.created_at,
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
