import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const verification = db.verifications.findOne((v) => v.order_id === id);

    if (!verification) {
      return NextResponse.json(
        { detail: 'Verification report not found for this order' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: verification.id,
      order_id: verification.order_id,
      verifier_user_id: verification.verifier_user_id,
      status: verification.status,
      actual_received_quantity: verification.actual_received_quantity,
      quality_notes: verification.quality_notes,
      inspection_photos: verification.inspection_photos || [],
      created_at: verification.created_at,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const targetStatus = body.target_status || 'field_verified';

    const order = db.orders.findById(id);
    if (!order) {
      return NextResponse.json(
        { detail: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update order lifecycle status
    db.orders.update(order.id, {
      order_status: targetStatus,
    });

    let verification = db.verifications.findOne((v) => v.order_id === id);
    if (!verification) {
      verification = db.verifications.create({
        order_id: order.id,
        verifier_user_id: 'usr-demo-verifier',
        status: targetStatus === 'completed' ? 'approved' : 'in_review',
        actual_received_quantity: order.total_amount ? Math.round(order.total_amount / 800) : 120,
        quality_notes: body.notes || 'Verifikasi mutu kadar air dan spesifikasi fisik lolos standar ISO 27001',
        inspection_photos: [],
      });
    } else {
      verification = db.verifications.update(verification.id, {
        status: targetStatus === 'completed' ? 'approved' : 'in_review',
        quality_notes: body.notes || verification.quality_notes,
      });
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      new_status: targetStatus,
      verification_id: verification.id,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
