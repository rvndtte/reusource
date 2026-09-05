import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createAccessToken, verifyPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    const user = db.users.findOne((u) => (u.email || '').toLowerCase() === email);
    if (!user) {
      return NextResponse.json(
        { detail: 'Email atau kata sandi tidak valid.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { detail: 'Email atau kata sandi tidak valid.' },
        { status: 401 }
      );
    }

    const company = user.company_id ? db.companies.findById(user.company_id) : null;
    const token = await createAccessToken(user.id);

    return NextResponse.json({
      access_token: token,
      token_type: 'bearer',
      user_id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      company_id: user.company_id,
      company_name: company?.name || '',
      verification_status: company?.verification_status || 'approved',
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
