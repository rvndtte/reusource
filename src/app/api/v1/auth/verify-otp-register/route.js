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
    const businessName = (body.business_name || '').trim();
    const otpCode = (body.otp_code || '').trim();

    if (!businessName || businessName.length < 2) {
      return NextResponse.json(
        { detail: 'Nama usaha wajib diisi dengan benar.' },
        { status: 400 }
      );
    }

    try {
      verifyStoredOtp(phone, otpCode);
    } catch (err) {
      return NextResponse.json(
        { detail: err.message },
        { status: err.status || 400 }
      );
    }

    // Check if user with this phone already exists
    const existingUser = db.users.findOne((u) => normalizePhone(u.phone) === phone);
    if (existingUser) {
      const company = existingUser.company_id ? db.companies.findById(existingUser.company_id) : null;
      const token = await createAccessToken(existingUser.id);
      return NextResponse.json({
        access_token: token,
        token_type: 'bearer',
        user_id: existingUser.id,
        email: existingUser.email,
        full_name: existingUser.full_name,
        phone: existingUser.phone,
        role: existingUser.role,
        company_id: existingUser.company_id,
        company_name: company?.name || '',
        verification_status: company?.verification_status || 'pending_verification',
      });
    }

    // Map role & company type
    const assignedRole = ['supplier', 'supplier_admin'].includes(body.role)
      ? 'supplier_admin'
      : 'buyer_admin';
    const compType = assignedRole === 'supplier_admin' ? 'umkm_supplier' : 'enterprise_buyer';

    const addressStr = (body.address || 'Indonesia').trim();
    const cityStr = (body.city && body.city !== 'Indonesia')
      ? body.city.trim()
      : (addressStr.includes(',') ? addressStr.split(',').slice(-2, -1)[0].trim() : 'Indonesia');
    const provinceStr = (body.province && body.province !== 'Indonesia')
      ? body.province.trim()
      : (addressStr.includes(',') ? addressStr.split(',').slice(-1)[0].trim() : 'Indonesia');

    // Create Company
    const company = db.companies.create({
      name: businessName,
      company_type: compType,
      address: addressStr,
      city: cityStr,
      province: provinceStr,
      latitude: body.latitude || -6.2088,
      longitude: body.longitude || 106.8456,
      verification_status: 'pending_verification',
      is_micro_business: 'true',
      is_first_time_seller: 'true',
    });

    const syntheticEmail = `wa_${phone}@reusource.id`;
    const contactPerson = body.contact_name?.trim() || businessName;
    const pwdHash = await hashPassword('wa_otp_secure_login');

    // Create User
    const user = db.users.create({
      email: syntheticEmail,
      password_hash: pwdHash,
      full_name: contactPerson,
      phone: phone,
      role: assignedRole,
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
        phone: user.phone,
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
