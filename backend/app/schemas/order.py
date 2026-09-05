from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class OrderItemResponse(BaseModel):
    id: str
    supplier_company_id: str
    supplier_company_name: str
    material_listing_id: str
    listing_title: str
    quantity: float
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True


class OrderCreateRequest(BaseModel):
    aggregated_supply_id: str


class OrderResponse(BaseModel):
    id: str
    aggregated_supply_id: str
    buying_request_id: str
    buyer_company_id: str
    buyer_company_name: Optional[str] = None
    total_amount: float
    platform_fee: float
    order_status: str
    items: List[OrderItemResponse]
    created_at: datetime

    class Config:
        from_attributes = True


class UpdateOrderStatusRequest(BaseModel):
    order_status: str
