from sqlalchemy import Column, String, Float, Enum
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class CompanyType(str, enum.Enum):
    UMKM_SUPPLIER = "umkm_supplier"
    UMKM_BUYER = "umkm_buyer"
    ENTERPRISE_BUYER = "enterprise_buyer"
    AGGREGATOR_VERIFIER = "aggregator_verifier"


class Company(Base, TimestampMixin):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, index=True)
    company_type = Column(String, default=CompanyType.UMKM_SUPPLIER.value, nullable=False)
    nib_npwp = Column(String, nullable=True)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    province = Column(String, nullable=False)
    postal_code = Column(String, nullable=True)
    latitude = Column(Float, nullable=False, default=-6.9175) # Default Bandung
    longitude = Column(Float, nullable=False, default=107.6191)
    
    # Verification & Inclusive Criteria Fields
    verification_status = Column(String, default="pending_verification", nullable=False) # pending_verification, approved, rejected
    is_micro_business = Column(String, default="true", nullable=False)
    is_first_time_seller = Column(String, default="true", nullable=False)
    verification_notes = Column(String, nullable=True)

    users = relationship("User", back_populates="company", cascade="all, delete-orphan")
    listings = relationship("MaterialListing", back_populates="company", cascade="all, delete-orphan")
    buying_requests = relationship("BuyingRequest", back_populates="buyer_company", cascade="all, delete-orphan")
