from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class ImpactLog(Base, TimestampMixin):
    __tablename__ = "impact_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, unique=True)
    buyer_company_id = Column(String, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(String, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    
    total_material_reused = Column(Float, nullable=False) # In units (e.g. tons)
    co2_avoided_kg = Column(Float, nullable=False)        # Estimated CO2e reduction in kg
    supplier_revenue_earned = Column(Float, nullable=False) # Financial gain for UMKM suppliers
    buyer_cost_saved = Column(Float, nullable=False)        # Financial savings vs virgin raw material

    order = relationship("Order", back_populates="impact_log")
