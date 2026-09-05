import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { normalizePhone } from '@/lib/phone';

export async function GET(request) {
  try {
    const user = await requireUser(request);
    let comp = user.company;

    // Check if client header has an approved status update for this company
    const regAccountsHeader = request.headers.get('X-Registered-Accounts') || request.headers.get('x-registered-accounts');
    if (regAccountsHeader) {
      try {
        const registeredList = JSON.parse(regAccountsHeader);
        const matched = (registeredList || []).find((a) => 
          (a.phone && normalizePhone(a.phone) === normalizePhone(user.phone)) || 
          (a.email && a.email.toLowerCase() === user.email.toLowerCase()) ||
          (comp && a.company_id === comp.id)
        );

        if (matched && matched.verification_status) {
          if (comp && comp.verification_status !== matched.verification_status) {
            comp = db.companies.update(comp.id, { verification_status: matched.verification_status }) || comp;
          }
        }
      } catch (e) {
        console.warn('Failed to parse X-Registered-Accounts in auth/me:', e);
      }
    }

    return NextResponse.json({
      user_id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      company_id: user.company_id,
      company_name: comp?.name || '',
      company_type: comp?.company_type || 'umkm_supplier',
      address: comp?.address || '',
      city: comp?.city || '',
      province: comp?.province || '',
      latitude: comp?.latitude || -6.2088,
      longitude: comp?.longitude || 106.8456,
      nib: comp?.nib || '',
      npwp: comp?.npwp || '',
      verification_status: comp?.verification_status || 'approved',
      verification_notes: comp?.verification_notes || null,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Unauthorized' },
      { status: error.status || 401 }
    );
  }
}

export async function PUT(request) {
  try {
    const user = await requireUser(request);
    const body = await request.json();

    const {
      full_name,
      phone,
      company_name,
      address,
      city,
      province,
      latitude,
      longitude,
      nib,
      npwp,
    } = body;

    // 1. Update user fields
    const userUpdates = {};
    if (full_name !== undefined) userUpdates.full_name = full_name;
    if (phone !== undefined) userUpdates.phone = phone;
    if (Object.keys(userUpdates).length > 0) {
      db.users.update(user.id, userUpdates);
    }

    // 2. Update company fields
    if (user.company_id) {
      const compUpdates = {};
      if (company_name !== undefined) compUpdates.name = company_name;
      if (phone !== undefined) compUpdates.phone = phone;
      if (address !== undefined) compUpdates.address = address;
      if (city !== undefined) compUpdates.city = city;
      if (province !== undefined) compUpdates.province = province;
      if (latitude !== undefined) compUpdates.latitude = parseFloat(latitude) || 0;
      if (longitude !== undefined) compUpdates.longitude = parseFloat(longitude) || 0;
      if (nib !== undefined) compUpdates.nib = nib;
      if (npwp !== undefined) compUpdates.npwp = npwp;

      if (Object.keys(compUpdates).length > 0) {
        db.companies.update(user.company_id, compUpdates);
      }
    }

    // 3. Return updated profile
    const updatedUser = db.users.findById(user.id);
    const updatedComp = user.company_id ? db.companies.findById(user.company_id) : null;

    return NextResponse.json({
      user_id: updatedUser.id,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      company_id: updatedUser.company_id,
      company_name: updatedComp?.name || '',
      company_type: updatedComp?.company_type || 'umkm_supplier',
      address: updatedComp?.address || '',
      city: updatedComp?.city || '',
      province: updatedComp?.province || '',
      latitude: updatedComp?.latitude || -6.2088,
      longitude: updatedComp?.longitude || 106.8456,
      nib: updatedComp?.nib || '',
      npwp: updatedComp?.npwp || '',
      verification_status: updatedComp?.verification_status || 'approved',
      verification_notes: updatedComp?.verification_notes || null,
      message: 'Profil dan data perusahaan berhasil diperbarui.',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { detail: error.message || 'Gagal memperbarui profil' },
      { status: error.status || 500 }
    );
  }
}
