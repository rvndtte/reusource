import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await requireUser(request);
    const comp = user.company;

    return NextResponse.json({
      user_id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      company_id: user.company_id,
      company_name: comp?.name || '',
      company_type: comp?.company_type || 'umkm_supplier',
      address: comp?.address || '',
      city: comp?.city || '',
      province: comp?.province || '',
      latitude: comp?.latitude || -6.2088,
      longitude: comp?.longitude || 106.8456,
      verification_status: comp?.verification_status || 'approved',
      verification_notes: comp?.verification_notes || null,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Unauthorized' },
      { status: error.status || 401 }
    );
  }
}
