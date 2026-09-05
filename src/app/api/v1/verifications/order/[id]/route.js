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
