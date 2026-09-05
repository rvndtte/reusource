from sqlalchemy import Column, String, Float, Text, ForeignKey, JSON, Date
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class RequestStatus(str, enum.Enum):
    OPEN = "open"
    MATCHING = "matching"
    MATCHED = "matched"
    FULFILLED = "fulfilled"
    CANCELLED = "cancelled"


class BuyingRequest(Base, TimestampMixin):
    __tablename__ = "buying_requests"

    id = Column(String, primary_key=True, default=generate_uuid)
    buyer_company_id = Column(String, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(String, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    
    title = Column(String, nullable=False)
    target_quantity = Column(Float, nullable=False)
    unit = Column(String, default="ton", nullable=False)
    max_price_per_unit = Column(Float, nullable=False)
    min_grade_spec = Column(JSON, nullable=True) # Required technical specs
    
    delivery_address = Column(Text, nullable=False)
    delivery_city = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    deadline = Column(Date, nullable=True)
    
    status = Column(String, default=RequestStatus.OPEN.value, nullable=False)

    buyer_company = relationship("Company", back_populates="buying_requests")
    category = relationship("Category", back_populates="buying_requests")
    aggregated_supplies = relationship("AggregatedSupply", back_populates="buying_request", cascade="all, delete-orphan")
