from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class CompanyBase(BaseModel):
    name: str
    company_type: str
    nib_npwp: Optional[str] = None
    address: str
    city: str
    province: str
    postal_code: Optional[str] = None
    latitude: float
    longitude: float


class CompanyCreate(CompanyBase):
    pass


class CompanyResponse(CompanyBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
