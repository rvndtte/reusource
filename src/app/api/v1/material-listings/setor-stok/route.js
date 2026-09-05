import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRoles } from '@/lib/auth';

const WEIGHT_THRESHOLD_GRADE_A = 100.0;
const WEIGHT_THRESHOLD_GRADE_B = 30.0;

const PRICE_PER_KG_TABLE = {
  'Serbuk Serutan Kayu Jati': { A: 800.0, B: 450.0, C: 250.0 },
  'Wood Chips / Serpihan Kayu': { A: 750.0, B: 400.0, C: 220.0 },
  'Potongan Kayu Padat (Offcuts)': { A: 900.0, B: 500.0, C: 300.0 },
  'Kulit Kayu & Sisa Sawmill': { A: 600.0, B: 350.0, C: 180.0 },
  DEFAULT: { A: 700.0, B: 400.0, C: 200.0 },
};

const CO2E_FACTOR_TABLE = {
  'Serbuk Serutan Kayu Jati': 1.25,
  'Wood Chips / Serpihan Kayu': 1.15,
  'Potongan Kayu Padat (Offcuts)': 1.05,
  'Kulit Kayu & Sisa Sawmill': 0.95,
  DEFAULT: 1.1,
};

function serverCalculateGrade(isDry, isClean, weight) {
  const kontaminasi = !isClean;

  if (isDry === true && kontaminasi === false && weight >= WEIGHT_THRESHOLD_GRADE_A) {
    return { grade: 'A', reason: 'Kering sempurna, bebas kontaminasi, volume >= 100 kg' };
  } else if ((isDry === true || kontaminasi === false) && weight >= WEIGHT_THRESHOLD_GRADE_B) {
    return { grade: 'B', reason: 'Memenuhi standar kering/kebersihan dasar dengan volume >= 30 kg' };
  } else if (weight < WEIGHT_THRESHOLD_GRADE_B || (isDry === false && kontaminasi === true)) {
    const reasons = [];
    if (weight < WEIGHT_THRESHOLD_GRADE_B) {
      reasons.push(`Berat (${weight} kg) di bawah batas minimum agregasi 30 kg`);
    }
    if (isDry === false && kontaminasi === true) {
      reasons.push('Material basah dan terakumulasi kontaminasi');
    }
    return { grade: 'ditolak', reason: reasons.join('. ') || 'Material ditolak' };
  } else {
    return { grade: 'C', reason: 'Limbah kategori lembap/standar dasar (Grade C)' };
  }
}

export async function POST(request) {
  try {
    const currentUser = await requireRoles(request, ['supplier_admin', 'admin', 'supplier']);
    const body = await request.json().catch(() => ({}));

    const weightKg = Number(body.weight_kg || 0);
    if (weightKg <= 0) {
      return NextResponse.json(
        { detail: 'Berat material harus lebih dari 0 kg.' },
        { status: 400 }
      );
    }

    const { grade, reason } = serverCalculateGrade(body.is_dry, body.is_clean, weightKg);
    if (grade === 'ditolak') {
      return NextResponse.json(
        { detail: `Setor stok ditolak oleh aturan bisnis: ${reason}` },
        { status: 400 }
      );
    }

    // Category
    let category = db.categories.findOne((c) =>
      c.name.toLowerCase().includes((body.waste_type || '').split(' ')[0].toLowerCase())
    );
    if (!category) {
      category = db.categories.findOne(() => true);
    }
    if (!category) {
      category = db.categories.create({
        name: 'Limbah Kayu & Serbuk',
        description: 'Biomassa serbuk gergaji dan serutan kayu industri',
        default_unit: 'kg',
        co2_saved_factor_per_unit: 1.25,
      });
    }

    const priceMap = PRICE_PER_KG_TABLE[body.waste_type] || PRICE_PER_KG_TABLE.DEFAULT;
    const pricePerKg = priceMap[grade] || 300.0;
    const totalRev = weightKg * pricePerKg;
    const co2eFactor = CO2E_FACTOR_TABLE[body.waste_type] || 1.1;
    const co2eSaved = weightKg * co2eFactor;

    const comp = currentUser.company || db.companies.findById(currentUser.company_id);

    const listing = db.material_listings.create({
      company_id: comp ? comp.id : currentUser.company_id,
      category_id: category.id,
      title: `${body.waste_type} (Grade ${grade})`,
      description: `Setoran stok: Kering=${body.is_dry}, Bersih=${body.is_clean}. ${body.notes || ''}`,
      grade_spec: {
        grade: grade,
        is_dry: body.is_dry,
        is_clean: body.is_clean,
        evaluated_reason: reason,
        co2e_saved_kg: co2eSaved,
      },
      available_quantity: weightKg,
      initial_quantity: weightKg,
      unit: 'kg',
      price_per_unit: pricePerKg,
      frequency: 'weekly',
      latitude: comp ? comp.latitude : -6.2088,
      longitude: comp ? comp.longitude : 106.8456,
      city: comp ? comp.city : 'Indonesia',
      status: 'active',
      photos: [],
    });

    return NextResponse.json(
      {
        listing_id: listing.id,
        waste_type: body.waste_type,
        weight_kg: weightKg,
        calculated_grade: grade,
        status: 'Lolos Verifikasi Sistem',
        reason: reason,
        price_per_kg: pricePerKg,
        total_estimated_revenue: totalRev,
        co2e_avoided_kg: co2eSaved,
        created_at: listing.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
