import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    await db.ready();
    const { id } = await params;
    const company = await db.companies.findById(id);
    if (!company) {
      return NextResponse.json(
        { detail: 'Company not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
