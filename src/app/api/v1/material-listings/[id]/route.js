import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const currentUser = await requireUser(request);

    const listing = db.material_listings.findById(id);
    if (!listing) {
      return NextResponse.json(
        { detail: 'Material listing not found' },
        { status: 404 }
      );
    }

    const isOwner = listing.company_id === currentUser.company_id;
    const isAdmin = ['admin', 'verifier'].includes(currentUser.role);

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { detail: 'Forbidden: Anda tidak memiliki hak akses untuk melihat data detail listing milik supplier lain.' },
        { status: 403 }
      );
    }

    const company = db.companies.findById(listing.company_id);
    const category = db.categories.findById(listing.category_id);

    return NextResponse.json({
      id: listing.id,
      company_id: listing.company_id,
      company_name: company?.name || null,
      category_id: listing.category_id,
      category_name: category?.name || null,
      title: listing.title,
      description: listing.description,
      grade_spec: listing.grade_spec,
      available_quantity: listing.available_quantity,
      initial_quantity: listing.initial_quantity,
      unit: listing.unit,
      price_per_unit: listing.price_per_unit,
      frequency: listing.frequency,
      latitude: listing.latitude,
      longitude: listing.longitude,
      city: listing.city,
      status: listing.status,
      photos: listing.photos || [],
      created_at: listing.created_at,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
