from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import date, datetime


class BuyingRequestBase(BaseModel):
    category_id: str
    title: str
    target_quantity: float
    unit: str = "ton"
    max_price_per_unit: float
    min_grade_spec: Optional[Dict[str, Any]] = None
    delivery_address: str
    delivery_city: str
    latitude: float
    longitude: float
    deadline: Optional[date] = None


class BuyingRequestCreate(BuyingRequestBase):
    pass


class BuyingRequestResponse(BuyingRequestBase):
    id: str
    buyer_company_id: str
    buyer_company_name: Optional[str] = None
    category_name: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
