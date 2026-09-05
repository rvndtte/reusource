import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createAccessToken, hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || '').trim().toLowerCase();

    const existing = db.users.findOne((u) => (u.email || '').toLowerCase() === email);
    if (existing) {
      return NextResponse.json(
        { detail: 'Email sudah terdaftar.' },
        { status: 400 }
      );
    }

    const company = db.companies.create({
      name: (body.company_name || '').trim(),
      company_type: body.company_type || 'umkm_supplier',
      address: (body.address || '').trim(),
      city: (body.city || '').trim(),
      province: (body.province || '').trim(),
      latitude: body.latitude || -6.2088,
      longitude: body.longitude || 106.8456,
      verification_status: 'pending_verification',
    });

    const pwdHash = await hashPassword(body.password || 'password123');
    const user = db.users.create({
      email: email,
      password_hash: pwdHash,
      full_name: (body.full_name || '').trim(),
      phone: body.phone ? body.phone.trim() : null,
      role: body.role || 'supplier_admin',
      company_id: company.id,
      is_active: true,
    });

    const token = await createAccessToken(user.id);
    return NextResponse.json(
      {
        access_token: token,
        token_type: 'bearer',
        user_id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        company_id: company.id,
        company_name: company.name,
        verification_status: company.verification_status,
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
