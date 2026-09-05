import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRoles } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    await requireRoles(request, ['admin', 'verifier']);
    const body = await request.json().catch(() => ({}));

    let company = db.companies.findById(id);

    // If not found by direct ID (due to serverless lambda split), search in companies list or client header
    if (!company) {
      const regAccountsHeader = request.headers.get('X-Registered-Accounts') || request.headers.get('x-registered-accounts');
      if (regAccountsHeader) {
        try {
          const registeredList = JSON.parse(regAccountsHeader);
          const matched = (registeredList || []).find((a) => a.company_id === id || a.company_name === id);
          if (matched) {
            company = db.companies.create({
              id: matched.company_id || id,
              name: matched.company_name || 'Usaha Terdaftar',
              company_type: matched.role === 'buyer_admin' ? 'enterprise_buyer' : 'umkm_supplier',
              phone: matched.phone || '',
              address: matched.address || 'Indonesia',
              city: matched.city || 'Indonesia',
              province: matched.province || '',
              latitude: matched.latitude || -6.2088,
              longitude: matched.longitude || 106.8456,
              verification_status: 'pending_verification',
            });
          }
        } catch (e) {
          console.warn('Failed to parse X-Registered-Accounts in verify route:', e);
        }
      }
    }

    if (!company) {
      return NextResponse.json(
        { detail: 'Data perusahaan tidak ditemukan' },
        { status: 404 }
      );
    }

    const decision = (body.decision || '').toLowerCase();
    const newStatus = decision === 'approve' ? 'approved' : 'rejected';
    const notes =
      body.admin_notes ||
      (newStatus === 'approved'
        ? 'Dokumen legalitas & verifikasi lokasi fisik valid (ISO 27001 Lolos).'
        : 'Ditolak: Data tidak memenuhi kriteria verifikasi.');

    const updated = db.companies.update(company.id, {
      verification_status: newStatus,
      verification_notes: notes,
    });

    return NextResponse.json({
      status: 'success',
      company_id: updated.id,
      company_name: updated.name,
      verification_status: updated.verification_status,
      verification_notes: updated.verification_notes,
      message: `Akun ${updated.name} berhasil disetujui (${newStatus.toUpperCase()}) oleh Admin.`,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
