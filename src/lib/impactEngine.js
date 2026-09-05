import { db } from './db.js';

export class ImpactCalculatorService {
  static getImpactDashboardMetrics() {
    const logs = db.impact_logs.find();

    let totalReused = 0.0;
    let totalCo2 = 0.0;
    let totalSupplierRev = 0.0;
    let totalBuyerSaved = 0.0;

    for (const log of logs) {
      totalReused += Number(log.total_material_reused || 0);
      totalCo2 += Number(log.co2_avoided_kg || 0);
      totalSupplierRev += Number(log.supplier_revenue_earned || 0);
      totalBuyerSaved += Number(log.buyer_cost_saved || 0);
    }

    const suppliersCount = db.companies.count((c) => c.company_type === 'umkm_supplier');
    const buyersCount = db.companies.count((c) =>
      ['umkm_buyer', 'enterprise_buyer'].includes(c.company_type)
    );

    // Category Breakdown
    const categoryMap = new Map();
    const categories = db.categories.find();
    for (const cat of categories) {
      categoryMap.set(cat.id, {
        category_name: cat.name,
        unit: cat.default_unit || 'ton',
        total_reused_unit: 0.0,
        co2_avoided_kg: 0.0,
      });
    }

    for (const log of logs) {
      if (log.category_id && categoryMap.has(log.category_id)) {
        const item = categoryMap.get(log.category_id);
        item.total_reused_unit += Number(log.total_material_reused || 0);
        item.co2_avoided_kg += Number(log.co2_avoided_kg || 0);
      }
    }

    const categoryBreakdown = Array.from(categoryMap.values()).map((c) => ({
      ...c,
      total_reused_unit: Math.round(c.total_reused_unit * 100) / 100,
      co2_avoided_kg: Math.round(c.co2_avoided_kg * 100) / 100,
    }));

    return {
      total_material_reused_tons: Math.round(totalReused * 100) / 100,
      total_co2_avoided_kg: Math.round(totalCo2 * 100) / 100,
      total_supplier_revenue_idr: Math.round(totalSupplierRev * 100) / 100,
      total_buyer_savings_idr: Math.round(totalBuyerSaved * 100) / 100,
      total_completed_orders: logs.length,
      active_suppliers_count: suppliersCount,
      active_buyers_count: buyersCount,
      category_breakdown: categoryBreakdown,
    };
  }
}
