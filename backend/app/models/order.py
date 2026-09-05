from sqlalchemy import Column, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class OrderStatus(str, enum.Enum):
    PENDING_PAYMENT = "pending_payment"
    PAID_ESCROW = "paid_escrow"
    IN_TRANSIT = "in_transit"
    INSPECTING = "inspecting"
    COMPLETED = "completed"
    DISPUTED = "disputed"
    CANCELLED = "cancelled"


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=generate_uuid)
    aggregated_supply_id = Column(String, ForeignKey("aggregated_supplies.id", ondelete="RESTRICT"), nullable=False, unique=True)
    buying_request_id = Column(String, ForeignKey("buying_requests.id", ondelete="RESTRICT"), nullable=False)
    buyer_company_id = Column(String, ForeignKey("companies.id", ondelete="RESTRICT"), nullable=False)
    
    total_amount = Column(Float, nullable=False)
    platform_fee = Column(Float, nullable=False)
    
    order_status = Column(String, default=OrderStatus.PENDING_PAYMENT.value, nullable=False)
    payment_reference = Column(String, nullable=True)

    aggregated_supply = relationship("AggregatedSupply", back_populates="order")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    verification = relationship("Verification", back_populates="order", uselist=False)
    impact_log = relationship("ImpactLog", back_populates="order", uselist=False)


class OrderItem(Base, TimestampMixin):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    supplier_company_id = Column(String, ForeignKey("companies.id", ondelete="RESTRICT"), nullable=False)
    material_listing_id = Column(String, ForeignKey("material_listings.id", ondelete="RESTRICT"), nullable=False)
    
    quantity = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
