import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRoles } from '@/lib/auth';
import { normalizePhone } from '@/lib/phone';

export async function GET(request) {
  try {
    await requireRoles(request, ['admin', 'verifier']);

    // 1. Sync any client-persisted accounts from header into db.companies if missing
    const regAccountsHeader = request.headers.get('X-Registered-Accounts') || request.headers.get('x-registered-accounts');
    if (regAccountsHeader) {
      try {
        const registeredList = JSON.parse(regAccountsHeader);
        for (const item of (registeredList || [])) {
          if (item && item.company_name) {
            const existingComp = item.company_id ? db.companies.findById(item.company_id) : db.companies.findOne((c) => c.name.toLowerCase() === item.company_name.toLowerCase());
            if (!existingComp) {
              const newComp = db.companies.create({
                id: item.company_id || undefined,
                name: item.company_name,
                company_type: item.role === 'buyer_admin' ? 'enterprise_buyer' : 'umkm_supplier',
                phone: item.phone ? normalizePhone(item.phone) : '',
                address: item.address || 'Indonesia',
                city: item.city || 'Indonesia',
                province: item.province || '',
                latitude: item.latitude || -6.2088,
                longitude: item.longitude || 106.8456,
                verification_status: item.verification_status || 'pending_verification',
                is_micro_business: true,
                is_first_time_seller: true,
                created_at: item.created_at || new Date().toISOString(),
              });

              db.users.create({
                email: item.email || `wa_${item.phone}@reusource.id`,
                full_name: item.full_name || 'Mitra Penanggung Jawab',
                phone: item.phone ? normalizePhone(item.phone) : '',
                role: item.role || 'supplier_admin',
                company_id: newComp.id,
                is_active: true,
              });
            } else if (item.verification_status && existingComp.verification_status !== item.verification_status) {
              db.companies.update(existingComp.id, {
                verification_status: item.verification_status,
              });
            }
          }
        }
      } catch (e) {
        console.warn('Failed to parse X-Registered-Accounts in pending-accounts:', e);
      }
    }

    const companies = db.companies.find(
      (c) => c.verification_status === 'pending_verification'
    );

    const results = companies.map((c) => {
      const primaryUser = db.users.findOne((u) => u.company_id === c.id);
      return {
        company_id: c.id,
        company_name: c.name,
        company_type: c.company_type,
        contact_name: primaryUser?.full_name || 'Mitra Penanggung Jawab',
        email: primaryUser?.email || '-',
        phone: primaryUser?.phone || c.phone || '-',
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
