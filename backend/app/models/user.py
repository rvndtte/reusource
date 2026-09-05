from sqlalchemy import Column, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    SUPPLIER_ADMIN = "supplier_admin"
    BUYER_ADMIN = "buyer_admin"
    VERIFIER = "verifier"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default=UserRole.SUPPLIER_ADMIN.value, nullable=False)
    is_active = Column(Boolean, default=True)

    company_id = Column(String, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    company = relationship("Company", back_populates="users")
