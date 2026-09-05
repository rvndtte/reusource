from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.user import User, UserRole
from app.models.material_listing import MaterialListing, ListingStatus
from app.models.company import Company
from app.models.category import Category
from app.schemas.material_listing import (
    MaterialListingCreate,
    MaterialListingResponse,
    PublicCatalogListingResponse,
    SetorStokRequest,
    SetorStokResponse,
    ClusterProgressResponse
)

router = APIRouter()

# Central Business Rules Constants
WEIGHT_THRESHOLD_GRADE_A = 100.0
WEIGHT_THRESHOLD_GRADE_B = 30.0
CLUSTER_THRESHOLD_VOLUME_KG = 500.0

PRICE_PER_KG_TABLE = {
    "Serbuk Serutan Kayu Jati": {"A": 800.0, "B": 450.0, "C": 250.0},
    "Wood Chips / Serpihan Kayu": {"A": 750.0, "B": 400.0, "C": 220.0},
    "Potongan Kayu Padat (Offcuts)": {"A": 900.0, "B": 500.0, "C": 300.0},
    "Kulit Kayu & Sisa Sawmill": {"A": 600.0, "B": 350.0, "C": 180.0},
    "DEFAULT": {"A": 700.0, "B": 400.0, "C": 200.0}
}

CO2E_FACTOR_TABLE = {
    "Serbuk Serutan Kayu Jati": 1.25,
    "Wood Chips / Serpihan Kayu": 1.15,
    "Potongan Kayu Padat (Offcuts)": 1.05,
    "Kulit Kayu & Sisa Sawmill": 0.95,
    "DEFAULT": 1.10
}


def server_calculate_grade(is_dry: bool, is_clean: bool, weight: float):
    """
    Strict server-side business rules grading engine
    """
    kontaminasi = not is_clean

    if is_dry is True and kontaminasi is False and weight >= WEIGHT_THRESHOLD_GRADE_A:
        return "A", "Kering sempurna, bebas kontaminasi, volume >= 100 kg"
    elif (is_dry is True or kontaminasi is False) and weight >= WEIGHT_THRESHOLD_GRADE_B:
        return "B", "Memenuhi standar kering/kebersihan dasar dengan volume >= 30 kg"
    elif weight < WEIGHT_THRESHOLD_GRADE_B or (is_dry is False and kontaminasi is True):
        reasons = []
        if weight < WEIGHT_THRESHOLD_GRADE_B:
            reasons.append(f"Berat ({weight} kg) di bawah batas minimum agregasi 30 kg")
        if is_dry is False and kontaminasi is True:
            reasons.append("Material basah dan terakumulasi kontaminasi")
        return "ditolak", ". ".join(reasons) if reasons else "Material ditolak"
    else:
        return "C", "Limbah kategori lembap/standar dasar (Grade C)"


@router.post("/setor-stok", response_model=SetorStokResponse, status_code=status.HTTP_201_CREATED)
async def submit_setor_stok(
    req: SetorStokRequest,
    current_user: User = Depends(require_roles([UserRole.SUPPLIER_ADMIN.value, UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    """
    Prioritas 4: Supplier submits wood waste stock with server-side guided grading.
    Strictly protected: Only authenticated SUPPLIER role can submit.
    """
    if req.weight_kg <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Berat material harus lebih dari 0 kg."
        )

    grade, reason = server_calculate_grade(req.is_dry, req.is_clean, req.weight_kg)
    if grade == "ditolak":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Setor stok ditolak oleh aturan bisnis: {reason}"
        )

    # Get or create default category
    cat_res = await db.execute(select(Category).where(Category.name.ilike(f"%{req.waste_type.split()[0]}%")))
    category = cat_res.scalars().first()
    if not category:
        cat_all = await db.execute(select(Category))
        category = cat_all.scalars().first()
        if not category:
            category = Category(
                name="Limbah Kayu & Serbuk",
                description="Biomassa serbuk gergaji dan serutan kayu industri",
                default_unit="kg",
                co2_saved_factor_per_unit=1.25
            )
            db.add(category)
            await db.flush()

    price_map = PRICE_PER_KG_TABLE.get(req.waste_type, PRICE_PER_KG_TABLE["DEFAULT"])
    price_per_kg = price_map.get(grade, 300.0)
    total_rev = req.weight_kg * price_per_kg
    co2e_factor = CO2E_FACTOR_TABLE.get(req.waste_type, 1.1)
    co2e_saved = req.weight_kg * co2e_factor

    comp = current_user.company

    listing = MaterialListing(
        company_id=comp.id,
        category_id=category.id,
        title=f"{req.waste_type} (Grade {grade})",
        description=f"Setoran stok: Kering={req.is_dry}, Bersih={req.is_clean}. {req.notes or ''}",
        grade_spec={
            "grade": grade,
            "is_dry": req.is_dry,
            "is_clean": req.is_clean,
            "evaluated_reason": reason,
            "co2e_saved_kg": co2e_saved
        },
        available_quantity=req.weight_kg,
        initial_quantity=req.weight_kg,
        unit="kg",
        price_per_unit=price_per_kg,
        frequency="weekly",
        latitude=comp.latitude,
        longitude=comp.longitude,
        city=comp.city,
        status=ListingStatus.ACTIVE.value
    )
    db.add(listing)
    await db.commit()
    await db.refresh(listing)

    return SetorStokResponse(
        listing_id=listing.id,
        waste_type=req.waste_type,
        weight_kg=req.weight_kg,
        calculated_grade=grade,
        status="Lolos Verifikasi Sistem",
        reason=reason,
        price_per_kg=price_per_kg,
        total_estimated_revenue=total_rev,
        co2e_avoided_kg=co2e_saved,
        created_at=listing.created_at or datetime.utcnow()
    )


@router.get("/cluster-progress", response_model=ClusterProgressResponse)
async def get_cluster_progress(
    db: AsyncSession = Depends(get_db)
):
    """
    Calculates aggregation progress towards 500 kg cluster threshold in active area.
    """
    stmt = select(MaterialListing).where(MaterialListing.status == ListingStatus.ACTIVE.value)
    res = await db.execute(stmt)
    listings = res.scalars().all()

    total_kg = sum(l.available_quantity for l in listings) or 0.0
    contributor_count = len(set(l.company_id for l in listings)) or 0
    is_ready = total_kg >= CLUSTER_THRESHOLD_VOLUME_KG
    progress_pct = min(100.0, round((total_kg / CLUSTER_THRESHOLD_VOLUME_KG) * 100.0, 1)) if total_kg > 0 else 0

    return ClusterProgressResponse(
        cluster_id="KLS-REG-01",
        cluster_name="Kluster Wilayah Regional #01",
        target_volume_kg=CLUSTER_THRESHOLD_VOLUME_KG,
        current_volume_kg=total_kg,
        progress_percentage=progress_pct,
        contributor_count=contributor_count,
        radius_km=8.2,
        is_ready_for_sale=is_ready,
        status_label="KLUSTER SIAP DIJUAL" if is_ready else "MENUNGGU DATA PASOKAN" if total_kg == 0 else "AGREGASI BERJALAN"
    )


@router.get("/my-listings", response_model=List[MaterialListingResponse])
async def get_my_listings(
    current_user: User = Depends(require_roles([UserRole.SUPPLIER_ADMIN.value, UserRole.ADMIN.value])),
    db: AsyncSession = Depends(get_db)
):
    """
    Data Ownership Enforced: Supplier can ONLY fetch their own listings by company_id.
    """
    stmt = select(MaterialListing).options(
        selectinload(MaterialListing.company),
        selectinload(MaterialListing.category)
    ).where(MaterialListing.company_id == current_user.company_id).order_by(MaterialListing.created_at.desc())
    
    result = await db.execute(stmt)
    listings = result.scalars().all()

    res = []
    for l in listings:
        res.append(
            MaterialListingResponse(
                id=l.id,
                company_id=l.company_id,
                company_name=l.company.name if l.company else None,
                category_id=l.category_id,
                category_name=l.category.name if l.category else None,
                title=l.title,
                description=l.description,
                grade_spec=l.grade_spec,
                available_quantity=l.available_quantity,
                initial_quantity=l.initial_quantity,
                unit=l.unit,
                price_per_unit=l.price_per_unit,
                frequency=l.frequency,
                latitude=l.latitude,
                longitude=l.longitude,
                city=l.city,
                status=l.status,
                photos=l.photos,
                created_at=l.created_at
            )
        )
    return res


@router.get("/", response_model=List[PublicCatalogListingResponse])
async def list_public_material_listings(
    category_id: Optional[str] = None,
    city: Optional[str] = None,
    status_filter: Optional[str] = Query(default=ListingStatus.ACTIVE.value),
    db: AsyncSession = Depends(get_db)
):
    """
    Public / Buyer Catalog View:
    SANITIZED RESPONSE: Does NOT leak supplier's phone number, owner name, or exact GPS coordinates.
    Only returns city and approximate radius.
    """
    stmt = select(MaterialListing).options(
        selectinload(MaterialListing.category)
    )
    if category_id:
        stmt = stmt.where(MaterialListing.category_id == category_id)
    if city:
        stmt = stmt.where(MaterialListing.city.ilike(f"%{city}%"))
    if status_filter:
        stmt = stmt.where(MaterialListing.status == status_filter)

    stmt = stmt.order_by(MaterialListing.created_at.desc())
    result = await db.execute(stmt)
    listings = result.scalars().all()

    res = []
    for l in listings:
        res.append(
            PublicCatalogListingResponse(
                id=l.id,
                category_name=l.category.name if l.category else "Biomassa Kayu",
                title=l.title,
                description=l.description,
                grade_spec=l.grade_spec,
                available_quantity=l.available_quantity,
                initial_quantity=l.initial_quantity,
                unit=l.unit,
                price_per_unit=l.price_per_unit,
                frequency=l.frequency,
                city=l.city,
                approx_radius_km=0
                status=l.status,
                created_at=l.created_at
            )
        )
    return res


@router.get("/{listing_id}", response_model=MaterialListingResponse)
async def get_material_listing_detail(
    listing_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Data Ownership Enforced:
    Supplier A CANNOT inspect Supplier B's private listing details unless they own it or are Admin.
    """
    stmt = select(MaterialListing).options(
        selectinload(MaterialListing.company),
        selectinload(MaterialListing.category)
    ).where(MaterialListing.id == listing_id)
    
    result = await db.execute(stmt)
    l = result.scalar_one_or_none()
    if not l:
        raise HTTPException(status_code=404, detail="Material listing not found")

    # Strict Data Ownership Check
    is_owner = l.company_id == current_user.company_id
    is_admin = current_user.role in [UserRole.ADMIN.value, UserRole.VERIFIER.value]

    if not is_owner and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Anda tidak memiliki hak akses untuk melihat data detail listing milik supplier lain."
        )

    return MaterialListingResponse(
        id=l.id,
        company_id=l.company_id,
        company_name=l.company.name if l.company else None,
        category_id=l.category_id,
        category_name=l.category.name if l.category else None,
        title=l.title,
        description=l.description,
        grade_spec=l.grade_spec,
        available_quantity=l.available_quantity,
        initial_quantity=l.initial_quantity,
        unit=l.unit,
        price_per_unit=l.price_per_unit,
        frequency=l.frequency,
        latitude=l.latitude,
        longitude=l.longitude,
        city=l.city,
        status=l.status,
        photos=l.photos,
        created_at=l.created_at
    )
