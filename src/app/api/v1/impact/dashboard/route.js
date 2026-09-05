import { NextResponse } from 'next/server';
import { ImpactCalculatorService } from '@/lib/impactEngine';

export async function GET() {
  try {
    const metrics = ImpactCalculatorService.getImpactDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
