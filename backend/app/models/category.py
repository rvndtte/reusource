from sqlalchemy import Column, String, Float, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class Category(Base, TimestampMixin):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    default_unit = Column(String, default="ton", nullable=False)
    co2_saved_factor_per_unit = Column(Float, default=1.5, nullable=False)  # kg CO2e saved per unit material reused

    listings = relationship("MaterialListing", back_populates="category")
    buying_requests = relationship("BuyingRequest", back_populates="category")
