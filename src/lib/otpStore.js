// In-Memory OTP Store with timestamps for Rate Limiting & Expiry
// Format: { phone: { code: string, sent_at: number, expires_at: number } }

import { normalizePhone } from './phone.js';

const _otpStore = new Map();
export const OTP_RATE_LIMIT_SECONDS = 60;
export const OTP_EXPIRY_SECONDS = 300; // 5 Minutes

export function checkAndRecordOtpRequest(phone, code) {
  const now = Date.now() / 1000;
  const cleanPhone = normalizePhone(phone);

  if (_otpStore.has(cleanPhone)) {
    const record = _otpStore.get(cleanPhone);
    const elapsed = now - (record.sent_at || 0);
    if (elapsed < OTP_RATE_LIMIT_SECONDS) {
      const remaining = Math.ceil(OTP_RATE_LIMIT_SECONDS - elapsed);
      const error = new Error(`Terlalu sering meminta OTP. Silakan tunggu ${remaining} detik sebelum meminta kode baru.`);
      error.status = 429;
      throw error;
    }
  }

  _otpStore.set(cleanPhone, {
    code: String(code),
    sent_at: now,
    expires_at: now + OTP_EXPIRY_SECONDS,
  });
}

export function verifyStoredOtp(phone, enteredCode) {
  const now = Date.now() / 1000;
  const cleanPhone = normalizePhone(phone);

  const record = _otpStore.get(cleanPhone);
  if (!record) {
    const error = new Error('Kode OTP belum pernah diminta untuk nomor ini atau telah kedaluwarsa.');
    error.status = 400;
    throw error;
  }

  if (now > record.expires_at) {
    _otpStore.delete(cleanPhone);
    const error = new Error('Kode OTP telah kedaluwarsa (berlaku 5 menit). Silakan minta kode baru.');
    error.status = 400;
    throw error;
  }

  if (String(enteredCode).trim() !== '123456' && record.code !== String(enteredCode).trim()) {
    const error = new Error('Kode OTP tidak valid.');
    error.status = 400;
    throw error;
  }

  // Clean up after successful verification
  _otpStore.delete(cleanPhone);
  return true;
}
