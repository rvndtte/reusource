import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createAccessToken, hashPassword } from '@/lib/auth';
import { verifyStoredOtp } from '@/lib/otpStore';
import { normalizePhone } from '@/lib/phone';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawPhone = body.phone || '';
    const phone = normalizePhone(rawPhone);
    const otpCode = (body.otp_code || '').trim();

    try {
      verifyStoredOtp(phone, otpCode);
    } catch (err) {
      return NextResponse.json(
        { detail: err.message },
        { status: err.status || 400 }
      );
    }

    // 1. Try to find user in database
    let user = db.users.findOne((u) => normalizePhone(u.phone) === phone);

    // 2. If not found in memory (e.g. serverless cold start), ingest from client registered accounts header
    if (!user) {
      const regAccountsHeader = request.headers.get('X-Registered-Accounts') || request.headers.get('x-registered-accounts');
      if (regAccountsHeader) {
        try {
          const registeredList = JSON.parse(regAccountsHeader);
          const matched = (registeredList || []).find((a) => normalizePhone(a.phone) === phone);
          if (matched) {
            // Re-hydrate company and user into database
            let comp = matched.company_id ? db.companies.findById(matched.company_id) : null;
            if (!comp) {
              comp = db.companies.create({
                id: matched.company_id || undefined,
                name: matched.company_name || 'Usaha Terdaftar',
                company_type: matched.role === 'buyer_admin' ? 'enterprise_buyer' : 'umkm_supplier',
                phone: phone,
                address: matched.address || 'Indonesia',
                city: matched.city || 'Indonesia',
                province: matched.province || '',
                latitude: matched.latitude || -6.2088,
                longitude: matched.longitude || 106.8456,
                verification_status: matched.verification_status || 'pending_verification',
              });
            }

            const pwdHash = await hashPassword('wa_otp_secure_login');
            user = db.users.create({
              email: matched.email || `wa_${phone}@reusource.id`,
              password_hash: pwdHash,
              full_name: matched.full_name || 'Pengguna Terdaftar',
              phone: phone,
              role: matched.role || 'supplier_admin',
              company_id: comp.id,
              is_active: true,
            });
          }
        } catch (e) {
          console.warn('Failed to parse X-Registered-Accounts in verify-otp-login:', e);
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { detail: `Nomor WhatsApp (${rawPhone}) ini belum terdaftar di sistem. Silakan lakukan pendaftaran terlebih dahulu.` },
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
      phone: user.phone,
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
