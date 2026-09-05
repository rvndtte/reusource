from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class VerificationCreateRequest(BaseModel):
    order_id: str
    status: str = "passed"
    actual_received_quantity: float
    quality_notes: Optional[str] = None
    inspection_photos: Optional[List[str]] = None


class VerificationResponse(BaseModel):
    id: str
    order_id: str
    verifier_user_id: str
    status: str
    actual_received_quantity: float
    quality_notes: Optional[str] = None
    inspection_photos: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AccountVerifyActionRequest(BaseModel):
    decision: str = "approve" # "approve" or "reject"
    admin_notes: Optional[str] = None


class PendingAccountResponse(BaseModel):
    company_id: str
    company_name: str
    company_type: str
    contact_name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    address: str
    city: str
    province: str
    latitude: float
    longitude: float
    verification_status: str
    is_micro_business: bool
    is_first_time_seller: bool
    verification_notes: Optional[str] = None
    created_at: datetime
