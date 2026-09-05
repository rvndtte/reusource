from sqlalchemy import Column, String, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class ListingStatus(str, enum.Enum):
    ACTIVE = "active"
    PARTIALLY_AGGREGATED = "partially_aggregated"
    SOLD_OUT = "sold_out"
    INACTIVE = "inactive"


class FrequencyType(str, enum.Enum):
    ONE_TIME = "one_time"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class MaterialListing(Base, TimestampMixin):
    __tablename__ = "material_listings"

    id = Column(String, primary_key=True, default=generate_uuid)
    company_id = Column(String, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(String, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    grade_spec = Column(JSON, nullable=True) # e.g. {"purity": "95%", "moisture": "2%", "color": "transparent"}
    
    available_quantity = Column(Float, nullable=False)
    initial_quantity = Column(Float, nullable=False)
    unit = Column(String, default="ton", nullable=False)
    price_per_unit = Column(Float, nullable=False)
    
    frequency = Column(String, default=FrequencyType.WEEKLY.value, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    city = Column(String, nullable=False)
    
    status = Column(String, default=ListingStatus.ACTIVE.value, nullable=False)
    photos = Column(JSON, nullable=True) # List of image URLs

    company = relationship("Company", back_populates="listings")
    category = relationship("Category", back_populates="listings")
    aggregated_items = relationship("AggregatedSupplyItem", back_populates="material_listing")
