from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole
from app.models.company import CompanyType


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: UserRole = UserRole.SUPPLIER_ADMIN
    company_name: str
    company_type: CompanyType = CompanyType.UMKM_SUPPLIER
    address: str
    city: str
    province: str
    latitude: Optional[float] = -6.2088
    longitude: Optional[float] = 106.8456


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: Optional[str] = None
    role: str
    company_id: str
    company_name: str
    verification_status: Optional[str] = "pending_verification"


class OtpSendRequest(BaseModel):
    phone: str


class OtpSendResponse(BaseModel):
    status: str = "success"
    message: str
    phone: str
    demo_otp_code: Optional[str] = None  # For development testing only


class OtpVerifyRegisterRequest(BaseModel):
    phone: str
    otp_code: str
    role: str = "supplier_admin" # supplier_admin or buyer_admin
    business_name: str
    contact_name: Optional[str] = None
    address: str
    city: Optional[str] = "Indonesia"
    province: Optional[str] = "Indonesia"
    latitude: Optional[float] = -6.2088
    longitude: Optional[float] = 106.8456
    waste_types: Optional[list] = None
    demand_needs: Optional[str] = None
    capacity: Optional[str] = None


class OtpVerifyLoginRequest(BaseModel):
    phone: str
    otp_code: str


class UserMeResponse(BaseModel):
    user_id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    company_id: str
    company_name: str
    company_type: str
    address: str
    city: str
    province: str
    latitude: float
    longitude: float
    verification_status: str
    verification_notes: Optional[str] = None
