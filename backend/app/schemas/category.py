from typing import Optional
from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    default_unit: str = "ton"
    co2_saved_factor_per_unit: float = 1.5


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: str

    class Config:
        from_attributes = True
