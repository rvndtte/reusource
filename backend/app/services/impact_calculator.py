from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.models.impact_log import ImpactLog
from app.models.order import Order, OrderStatus
from app.models.company import Company, CompanyType
from app.models.category import Category
from app.schemas.impact import ImpactDashboardResponse, CategoryImpactSummary


class ImpactCalculatorService:

    @staticmethod
    async def get_impact_dashboard_metrics(db: AsyncSession) -> ImpactDashboardResponse:
        """
        Aggregate total material diverted, CO2 avoided, supplier revenue, and buyer savings.
        """
        # Aggregate sums from impact_logs
        impact_query = await db.execute(
            select(
                func.coalesce(func.sum(ImpactLog.total_material_reused), 0.0).label("total_reused"),
                func.coalesce(func.sum(ImpactLog.co2_avoided_kg), 0.0).label("total_co2"),
                func.coalesce(func.sum(ImpactLog.supplier_revenue_earned), 0.0).label("total_supplier_rev"),
                func.coalesce(func.sum(ImpactLog.buyer_cost_saved), 0.0).label("total_buyer_saved"),
                func.count(ImpactLog.id).label("completed_orders_count")
            )
        )
        impact_row = impact_query.one()

        # Count active companies
        suppliers_count_res = await db.execute(
            select(func.count(Company.id)).where(Company.company_type == CompanyType.UMKM_SUPPLIER.value)
        )
        suppliers_count = suppliers_count_res.scalar() or 0

        buyers_count_res = await db.execute(
            select(func.count(Company.id)).where(
                Company.company_type.in_([CompanyType.UMKM_BUYER.value, CompanyType.ENTERPRISE_BUYER.value])
            )
        )
        buyers_count = buyers_count_res.scalar() or 0

        # Category Breakdown
        cat_query = await db.execute(
            select(
                Category.name.label("category_name"),
                Category.default_unit.label("unit"),
                func.coalesce(func.sum(ImpactLog.total_material_reused), 0.0).label("category_reused"),
                func.coalesce(func.sum(ImpactLog.co2_avoided_kg), 0.0).label("category_co2")
            )
            .join(ImpactLog, Category.id == ImpactLog.category_id)
            .group_by(Category.id, Category.name, Category.default_unit)
        )
        cat_rows = cat_query.all()

        category_breakdown = [
            CategoryImpactSummary(
                category_name=row.category_name,
                unit=row.unit,
                total_reused_unit=round(float(row.category_reused), 2),
                co2_avoided_kg=round(float(row.category_co2), 2)
            )
            for row in cat_rows
        ]

        return ImpactDashboardResponse(
            total_material_reused_tons=round(float(impact_row.total_reused), 2),
            total_co2_avoided_kg=round(float(impact_row.total_co2), 2),
            total_supplier_revenue_idr=round(float(impact_row.total_supplier_rev), 2),
            total_buyer_savings_idr=round(float(impact_row.total_buyer_saved), 2),
            total_completed_orders=int(impact_row.completed_orders_count),
            active_suppliers_count=int(suppliers_count),
            active_buyers_count=int(buyers_count),
            category_breakdown=category_breakdown
        )
