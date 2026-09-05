import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRoles } from '@/lib/auth';

export async function GET(request) {
  try {
    await requireRoles(request, ['admin', 'verifier']);

    let companies = db.companies.find(
      (c) => c.verification_status === 'pending_verification'
    );

    if (companies.length === 0) {
      companies = db.companies.find();
    }

    const results = companies.map((c) => {
      const primaryUser = db.users.findOne((u) => u.company_id === c.id);
      return {
        company_id: c.id,
        company_name: c.name,
        company_type: c.company_type,
        contact_name: primaryUser?.full_name || 'Mitra Penanggung Jawab',
        email: primaryUser?.email || '-',
        phone: primaryUser?.phone || '-',
        address: c.address,
        city: c.city,
        province: c.province,
        latitude: c.latitude,
        longitude: c.longitude,
        verification_status: c.verification_status || 'pending_verification',
        is_micro_business: c.is_micro_business === 'true' || c.is_micro_business === true,
        is_first_time_seller: c.is_first_time_seller === 'true' || c.is_first_time_seller === true,
        verification_notes: c.verification_notes || null,
        created_at: c.created_at || new Date().toISOString(),
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
