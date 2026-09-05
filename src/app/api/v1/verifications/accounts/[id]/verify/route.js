import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRoles } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    await requireRoles(request, ['admin', 'verifier']);
    const body = await request.json().catch(() => ({}));

    const company = db.companies.findById(id);
    if (!company) {
      return NextResponse.json(
        { detail: 'Company not found' },
        { status: 404 }
      );
    }

    const decision = (body.decision || '').toLowerCase();
    const newStatus = decision === 'approve' ? 'approved' : 'rejected';
    const notes =
      body.admin_notes ||
      (newStatus === 'approved'
        ? 'Dokumen legalitas & verifikasi lokasi fisik valid.'
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
      message: `Akun ${updated.name} berhasil di-${newStatus.toUpperCase()} oleh Admin.`,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
