from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class AggregationStatus(str, enum.Enum):
    PROPOSED = "proposed"
    BUYER_ACCEPTED = "buyer_accepted"
    CONVERTED_TO_ORDER = "converted_to_order"
    REJECTED = "rejected"


class AggregatedSupply(Base, TimestampMixin):
    __tablename__ = "aggregated_supplies"

    id = Column(String, primary_key=True, default=generate_uuid)
    buying_request_id = Column(String, ForeignKey("buying_requests.id", ondelete="CASCADE"), nullable=False)
    
    total_matched_quantity = Column(Float, nullable=False)
    total_material_cost = Column(Float, nullable=False)
    platform_fee = Column(Float, default=0.0, nullable=False)
    total_estimated_price = Column(Float, nullable=False)
    
    supplier_count = Column(Float, default=1, nullable=False)
    average_distance_km = Column(Float, nullable=True)
    status = Column(String, default=AggregationStatus.PROPOSED.value, nullable=False)

    buying_request = relationship("BuyingRequest", back_populates="aggregated_supplies")
    items = relationship("AggregatedSupplyItem", back_populates="aggregated_supply", cascade="all, delete-orphan")
    order = relationship("Order", back_populates="aggregated_supply", uselist=False)


class AggregatedSupplyItem(Base, TimestampMixin):
    __tablename__ = "aggregated_supply_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    aggregated_supply_id = Column(String, ForeignKey("aggregated_supplies.id", ondelete="CASCADE"), nullable=False)
    material_listing_id = Column(String, ForeignKey("material_listings.id", ondelete="RESTRICT"), nullable=False)
    
    allocated_quantity = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=False)

    aggregated_supply = relationship("AggregatedSupply", back_populates="items")
    material_listing = relationship("MaterialListing", back_populates="aggregated_items")
