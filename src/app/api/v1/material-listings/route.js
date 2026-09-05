import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const city = searchParams.get('city');
    const statusFilter = searchParams.get('status_filter') || 'active';

    const listings = db.material_listings.find((l) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (categoryId && l.category_id !== categoryId) return false;
      if (city && !l.city?.toLowerCase().includes(city.toLowerCase())) return false;
      return true;
    });

    // Sanitized Public Catalog: hides sensitive supplier contact/exact coordinates
    const sanitized = listings.map((l) => {
      const category = db.categories.findById(l.category_id);
      return {
        id: l.id,
        category_name: category?.name || 'Biomassa Kayu',
        title: l.title,
        description: l.description,
        grade_spec: l.grade_spec,
        available_quantity: l.available_quantity,
        initial_quantity: l.initial_quantity,
        unit: l.unit,
        price_per_unit: l.price_per_unit,
        frequency: l.frequency,
        city: l.city,
        approx_radius_km: 0,
        status: l.status,
        created_at: l.created_at,
      };
    });

    return NextResponse.json(sanitized);
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
