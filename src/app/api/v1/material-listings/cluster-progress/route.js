import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CLUSTER_THRESHOLD_VOLUME_KG = 500.0;

export async function GET() {
  try {
    const listings = db.material_listings.find((l) => l.status === 'active');
    const totalKg = listings.reduce((acc, l) => acc + (Number(l.available_quantity) || 0), 0);
    const contributors = new Set(listings.map((l) => l.company_id));
    const contributorCount = contributors.size;

    const isReady = totalKg >= CLUSTER_THRESHOLD_VOLUME_KG;
    const progressPct = totalKg > 0
      ? Math.min(100.0, Math.round((totalKg / CLUSTER_THRESHOLD_VOLUME_KG) * 1000) / 10)
      : 0;

    let statusLabel = 'AGREGASI BERJALAN';
    if (isReady) statusLabel = 'KLUSTER SIAP DIJUAL';
    else if (totalKg === 0) statusLabel = 'MENUNGGU DATA PASOKAN';

    return NextResponse.json({
      cluster_id: 'KLS-REG-01',
      cluster_name: 'Kluster Wilayah Regional #01',
      target_volume_kg: CLUSTER_THRESHOLD_VOLUME_KG,
      current_volume_kg: totalKg,
      progress_percentage: progressPct,
      contributor_count: contributorCount,
      radius_km: 8.2,
      is_ready_for_sale: isReady,
      status_label: statusLabel,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
