import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const buyerCompanyId = searchParams.get('buyer_company_id');

    const requests = db.buying_requests.find((r) => {
      if (categoryId && r.category_id !== categoryId) return false;
      if (buyerCompanyId && r.buyer_company_id !== buyerCompanyId) return false;
      return true;
    });

    const response = requests.map((r) => {
      const buyerCompany = db.companies.findById(r.buyer_company_id);
      const category = db.categories.findById(r.category_id);
      return {
        id: r.id,
        buyer_company_id: r.buyer_company_id,
        buyer_company_name: buyerCompany?.name || null,
        category_id: r.category_id,
        category_name: category?.name || null,
        title: r.title,
        target_quantity: r.target_quantity,
        unit: r.unit,
        max_price_per_unit: r.max_price_per_unit,
        min_grade_spec: r.min_grade_spec,
        delivery_address: r.delivery_address,
        delivery_city: r.delivery_city,
        latitude: r.latitude,
        longitude: r.longitude,
        deadline: r.deadline,
        status: r.status,
        created_at: r.created_at,
      };
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerCompanyId = searchParams.get('company_id') || searchParams.get('buyer_company_id');
    const body = await request.json().catch(() => ({}));

    const companyId = buyerCompanyId || body.buyer_company_id;
    if (!companyId) {
      return NextResponse.json(
        { detail: 'Buyer company ID is required' },
        { status: 400 }
      );
    }

    const company = db.companies.findById(companyId);
    if (!company) {
      return NextResponse.json(
        { detail: 'Buyer company not found' },
        { status: 404 }
      );
    }

    let category = body.category_id ? db.categories.findById(body.category_id) : null;
    if (!category) {
      const searchKey = (body.waste_type || body.title || '').toLowerCase();
      category = db.categories.findOne((c) =>
        searchKey.includes(c.name.toLowerCase().split(' ')[0]) ||
        c.name.toLowerCase().includes(searchKey.split(' ')[0])
      );
    }
    if (!category) {
      category = db.categories.findOne(() => true);
    }
    if (!category) {
      category = db.categories.create({
        id: 'cat-wood-001',
        name: 'Serbuk Serutan Kayu Jati',
        description: 'Biomassa serbuk gergaji dan serutan kayu jati industri',
        default_unit: 'kg',
        co2_saved_factor_per_unit: 1.25,
      });
    }

    const buyingReq = db.buying_requests.create({
      buyer_company_id: company.id,
      category_id: category.id,
      title: body.title || `Permintaan Pasokan ${category.name}`,
      target_quantity: Number(body.target_quantity || 0),
      unit: body.unit || category.default_unit || 'kg',
      max_price_per_unit: Number(body.max_price_per_unit || 0),
      min_grade_spec: body.min_grade_spec || {},
      delivery_address: body.delivery_address || company.address,
      delivery_city: body.delivery_city || company.city,
      latitude: body.latitude || company.latitude,
      longitude: body.longitude || company.longitude,
      deadline: body.deadline || null,
      status: 'open',
    });

    return NextResponse.json(
      {
        id: buyingReq.id,
        buyer_company_id: company.id,
        buyer_company_name: company.name,
        category_id: category.id,
        category_name: category.name,
        title: buyingReq.title,
        target_quantity: buyingReq.target_quantity,
        unit: buyingReq.unit,
        max_price_per_unit: buyingReq.max_price_per_unit,
        min_grade_spec: buyingReq.min_grade_spec,
        delivery_address: buyingReq.delivery_address,
        delivery_city: buyingReq.delivery_city,
        latitude: buyingReq.latitude,
        longitude: buyingReq.longitude,
        deadline: buyingReq.deadline,
        status: buyingReq.status,
        created_at: buyingReq.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
