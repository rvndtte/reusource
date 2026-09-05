from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime


class MaterialListingBase(BaseModel):
    category_id: str
    title: str
    description: Optional[str] = None
    grade_spec: Optional[Dict[str, Any]] = None
    available_quantity: float
    unit: str = "kg"
    price_per_unit: float
    frequency: str = "weekly"
    city: str


class MaterialListingCreate(MaterialListingBase):
    latitude: Optional[float] = -6.5888
    longitude: Optional[float] = 110.6683
    photos: Optional[List[str]] = None


class MaterialListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    available_quantity: Optional[float] = None
    price_per_unit: Optional[float] = None
    status: Optional[str] = None


# Public / Buyer Catalog response — SANITIZED (No phone, no exact GPS coordinates, no private info)
class PublicCatalogListingResponse(BaseModel):
    id: str
    category_name: Optional[str] = None
    title: str
    description: Optional[str] = None
    grade_spec: Optional[Dict[str, Any]] = None
    available_quantity: float
    initial_quantity: float
    unit: str
    price_per_unit: float
    frequency: str
    city: str
    approx_radius_km: Optional[float] = 8.2
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Supplier Owned Detail response (Full Data for Owner)
class MaterialListingResponse(MaterialListingBase):
    id: str
    company_id: str
    company_name: Optional[str] = None
    category_name: Optional[str] = None
    latitude: float
    longitude: float
    initial_quantity: float
    status: str
    photos: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SetorStokRequest(BaseModel):
    waste_type: str = "Serbuk Serutan Kayu Jati"
    is_dry: bool = True
    is_clean: bool = True
    weight_kg: float = 120.0
    notes: Optional[str] = None


class SetorStokResponse(BaseModel):
    listing_id: str
    waste_type: str
    weight_kg: float
    calculated_grade: str
    status: str
    reason: str
    price_per_kg: float
    total_estimated_revenue: float
    co2e_avoided_kg: float
    created_at: datetime


class ClusterProgressResponse(BaseModel):
    cluster_id: str
    cluster_name: str
    target_volume_kg: float = 500.0
    current_volume_kg: float
    progress_percentage: float
    contributor_count: int
    radius_km: float = 10.0
    is_ready_for_sale: bool
    status_label: str
