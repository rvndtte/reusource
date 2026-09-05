from typing import List, Optional
from pydantic import BaseModel


class CategoryImpactSummary(BaseModel):
    category_name: str
    total_reused_unit: float
    unit: str
    co2_avoided_kg: float


class ImpactDashboardResponse(BaseModel):
    total_material_reused_tons: float
    total_co2_avoided_kg: float
    total_supplier_revenue_idr: float
    total_buyer_savings_idr: float
    total_completed_orders: int
    active_suppliers_count: int
    active_buyers_count: int
    category_breakdown: List[CategoryImpactSummary]
