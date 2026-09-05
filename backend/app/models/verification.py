from sqlalchemy import Column, String, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class VerificationStatus(str, enum.Enum):
    PASSED = "passed"
    PARTIAL_REJECT = "partial_reject"
    FAILED = "failed"


class Verification(Base, TimestampMixin):
    __tablename__ = "verifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, unique=True)
    verifier_user_id = Column(String, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    
    status = Column(String, default=VerificationStatus.PASSED.value, nullable=False)
    actual_received_quantity = Column(Float, nullable=False)
    quality_notes = Column(Text, nullable=True)
    inspection_photos = Column(JSON, nullable=True)

    order = relationship("Order", back_populates="verification")
