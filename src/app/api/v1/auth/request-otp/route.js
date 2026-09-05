import { NextResponse } from 'next/server';
import { checkAndRecordOtpRequest } from '@/lib/otpStore';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const phone = (body.phone || '').trim().replace(/[\s-]/g, '');

    if (phone.length < 8) {
      return NextResponse.json(
        { detail: 'Nomor WhatsApp tidak valid (minimal 8 digit).' },
        { status: 400 }
      );
    }

    // Generate real random 6-digit OTP
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));

    try {
      checkAndRecordOtpRequest(phone, otpCode);
    } catch (err) {
      return NextResponse.json(
        { detail: err.message },
        { status: err.status || 429 }
      );
    }

    console.log(`[AUTH GATEWAY] OTP sent to ${phone}: ${otpCode}`);

    return NextResponse.json({
      status: 'success',
      message: 'Kode OTP 6-digit berhasil dikirimkan ke nomor WhatsApp Anda.',
      phone: phone,
      demo_otp_code: otpCode, // Provided for easy demo & testing
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
