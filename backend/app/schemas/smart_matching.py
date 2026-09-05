from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class AggregatedSupplyItemResponse(BaseModel):
    id: str
    material_listing_id: str
    listing_title: str
    supplier_company_id: str
    supplier_company_name: str
    allocated_quantity: float
    unit_price: float
    subtotal: float
    distance_km: float

    class Config:
        from_attributes = True


class AggregatedSupplyResponse(BaseModel):
    id: str
    buying_request_id: str
    total_matched_quantity: float
    target_quantity: float
    total_material_cost: float
    platform_fee: float
    total_estimated_price: float
    supplier_count: int
    average_distance_km: float
    status: str
    items: List[AggregatedSupplyItemResponse]
    created_at: datetime

    class Config:
        from_attributes = True


class TriggerMatchingRequest(BaseModel):
    buying_request_id: str
    max_radius_km: Optional[float] = 100.0
