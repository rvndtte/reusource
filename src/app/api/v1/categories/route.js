import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await db.ready();
    const categories = await db.categories.find();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await db.ready();
    const body = await request.json().catch(() => ({}));
    const category = await db.categories.create({
      name: body.name,
      description: body.description || '',
      default_unit: body.default_unit || 'ton',
      co2_saved_factor_per_unit: Number(body.co2_saved_factor_per_unit || 1.0),
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
