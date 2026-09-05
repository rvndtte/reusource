import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createAccessToken } from '@/lib/auth';
import { verifyStoredOtp } from '@/lib/otpStore';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const phone = (body.phone || '').trim().replace(/[\s-]/g, '');
    const otpCode = (body.otp_code || '').trim();

    try {
      verifyStoredOtp(phone, otpCode);
    } catch (err) {
      return NextResponse.json(
        { detail: err.message },
        { status: err.status || 400 }
      );
    }

    const user = db.users.findOne((u) => u.phone === phone);
    if (!user) {
      return NextResponse.json(
        { detail: 'Nomor WhatsApp ini belum terdaftar di sistem. Silakan lakukan pendaftaran terlebih dahulu.' },
        { status: 404 }
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
