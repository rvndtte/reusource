from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.user import User, UserRole
from app.models.company import Company
from app.models.verification import Verification, VerificationStatus
from app.models.order import Order, OrderStatus
from app.models.buying_request import BuyingRequest
from app.models.category import Category
from app.models.impact_log import ImpactLog
from app.schemas.verification import (
    VerificationCreateRequest,
    VerificationResponse,
    AccountVerifyActionRequest,
    PendingAccountResponse
)

router = APIRouter()


@router.get("/pending-accounts", response_model=List[PendingAccountResponse])
async def get_pending_accounts(
    current_user: User = Depends(require_roles([UserRole.ADMIN.value, UserRole.VERIFIER.value])),
    db: AsyncSession = Depends(get_db)
):
    """
    Prioritas 7: Admin retrieves list of newly registered accounts with status 'pending_verification'.
    """
    stmt = select(Company).options(selectinload(Company.users)).where(
        Company.verification_status == "pending_verification"
    ).order_by(Company.created_at.desc())

    res = await db.execute(stmt)
    companies = res.scalars().all()

    # If database is clean, also fetch approved ones for listing if none pending
    if not companies:
        stmt_all = select(Company).options(selectinload(Company.users)).order_by(Company.created_at.desc())
        res_all = await db.execute(stmt_all)
        companies = res_all.scalars().all()

    results = []
    for c in companies:
        primary_user = c.users[0] if c.users else None
        results.append(
            PendingAccountResponse(
                company_id=c.id,
                company_name=c.name,
                company_type=c.company_type,
                contact_name=primary_user.full_name if primary_user else "Mitra Penanggung Jawab",
                email=primary_user.email if primary_user else "-",
                phone=primary_user.phone if primary_user else "-",
                address=c.address,
                city=c.city,
                province=c.province,
                latitude=c.latitude,
                longitude=c.longitude,
                verification_status=c.verification_status or "pending_verification",
                is_micro_business=c.is_micro_business == "true" if hasattr(c, "is_micro_business") else True,
                is_first_time_seller=c.is_first_time_seller == "true" if hasattr(c, "is_first_time_seller") else True,
                verification_notes=c.verification_notes if hasattr(c, "verification_notes") else None,
                created_at=c.created_at or datetime.utcnow()
            )
        )
    return results


@router.post("/accounts/{company_id}/verify")
async def verify_account(
    company_id: str,
    req: AccountVerifyActionRequest,
    current_user: User = Depends(require_roles([UserRole.ADMIN.value, UserRole.VERIFIER.value])),
    db: AsyncSession = Depends(get_db)
):
    """
    Prioritas 7: Admin approves or rejects registered company account with review notes.
    """
    stmt = select(Company).where(Company.id == company_id)
    res = await db.execute(stmt)
    company = res.scalar_one_or_none()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    new_status = "approved" if req.decision.lower() == "approve" else "rejected"
    company.verification_status = new_status
    company.verification_notes = req.admin_notes or (
        "Dokumen legalitas & verifikasi lokasi fisik valid." if new_status == "approved" else "Ditolak: Data tidak memenuhi kriteria verifikasi."
    )

    await db.commit()
    await db.refresh(company)

    return {
        "status": "success",
        "company_id": company.id,
        "company_name": company.name,
        "verification_status": company.verification_status,
        "verification_notes": company.verification_notes,
        "message": f"Akun {company.name} berhasil di-{new_status.upper()} oleh Admin."
    }


@router.post("/", response_model=VerificationResponse, status_code=status.HTTP_201_CREATED)
async def submit_verification_report(
    verifier_user_id: str,
    req: VerificationCreateRequest,
    db: AsyncSession = Depends(get_db)
):
    # Fetch Order
    stmt = select(Order).options(
        selectinload(Order.buying_request).selectinload(BuyingRequest.category)
    ).where(Order.id == req.order_id)
    
    res = await db.execute(stmt)
    order: Order = res.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Create Verification
    verification = Verification(
        order_id=order.id,
        verifier_user_id=verifier_user_id,
        status=req.status,
        actual_received_quantity=req.actual_received_quantity,
        quality_notes=req.quality_notes,
        inspection_photos=req.inspection_photos
    )
    db.add(verification)

    # If verification passed or partial passed, update order to COMPLETED and log IMPACT!
    if req.status in [VerificationStatus.PASSED.value, VerificationStatus.PARTIAL_REJECT.value]:
        order.order_status = OrderStatus.COMPLETED.value
        
        category: Category = order.buying_request.category
        co2_factor = category.co2_saved_factor_per_unit if category else 1.5
        
        co2_avoided = req.actual_received_quantity * co2_factor * 1000.0 # kg
        supplier_revenue = order.total_amount - order.platform_fee
        buyer_savings = order.total_amount * 0.15 # Estimated 15% savings vs market virgin material

        impact_log = ImpactLog(
            order_id=order.id,
            buyer_company_id=order.buyer_company_id,
            category_id=order.buying_request.category_id,
            total_material_reused=req.actual_received_quantity,
            co2_avoided_kg=co2_avoided,
            supplier_revenue_earned=supplier_revenue,
            buyer_cost_saved=buyer_savings
        )
        db.add(impact_log)

    await db.commit()
    await db.refresh(verification)

    return VerificationResponse(
        id=verification.id,
        order_id=verification.order_id,
        verifier_user_id=verification.verifier_user_id,
        status=verification.status,
        actual_received_quantity=verification.actual_received_quantity,
        quality_notes=verification.quality_notes,
        inspection_photos=verification.inspection_photos,
        created_at=verification.created_at
    )


@router.get("/order/{order_id}", response_model=VerificationResponse)
async def get_verification_by_order(
    order_id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Verification).where(Verification.order_id == order_id)
    res = await db.execute(stmt)
    v = res.scalar_one_or_none()
    if not v:
        raise HTTPException(status_code=404, detail="Verification report not found for this order")

    return VerificationResponse(
        id=v.id,
        order_id=v.order_id,
        verifier_user_id=v.verifier_user_id,
        status=v.status,
        actual_received_quantity=v.actual_received_quantity,
        quality_notes=v.quality_notes,
        inspection_photos=v.inspection_photos,
        created_at=v.created_at
    )
