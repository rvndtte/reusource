import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRoles } from '@/lib/auth';

export async function GET(request) {
  try {
    const currentUser = await requireRoles(request, ['supplier_admin', 'admin', 'supplier']);
    const listings = await db.material_listings.find(
      (l) => l.company_id === currentUser.company_id
    );

    const response = await Promise.all(listings.map(async (l) => {
      const company = await db.companies.findById(l.company_id);
      const category = await db.categories.findById(l.category_id);
      return {
        id: l.id,
        company_id: l.company_id,
        company_name: company?.name || null,
        category_id: l.category_id,
        category_name: category?.name || null,
        title: l.title,
        description: l.description,
        grade_spec: l.grade_spec,
        available_quantity: l.available_quantity,
        initial_quantity: l.initial_quantity,
        unit: l.unit,
        price_per_unit: l.price_per_unit,
        frequency: l.frequency,
        latitude: l.latitude,
        longitude: l.longitude,
        city: l.city,
        status: l.status,
        photos: l.photos || [],
        created_at: l.created_at,
      };
    }));

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
