/**
 * Phone Number Normalization Utility
 * Converts Indonesian phone numbers into standardized format (e.g., 08123456789)
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  let cleaned = String(phone).trim().replace(/[\s\-\+\(\)]/g, '');
  
  // Replace leading international 62 with standard 0
  if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.slice(2);
  } else if (cleaned.startsWith('+62')) {
    cleaned = '0' + cleaned.slice(3);
  }
  
  return cleaned;
}

export function isValidIndonesianPhone(phone) {
  const norm = normalizePhone(phone);
  return norm.startsWith('08') && norm.length >= 10 && norm.length <= 15;
}
