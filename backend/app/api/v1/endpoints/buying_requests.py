from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.buying_request import BuyingRequest, RequestStatus
from app.models.company import Company
from app.models.category import Category
from app.schemas.buying_request import BuyingRequestCreate, BuyingRequestResponse

router = APIRouter()


@router.get("/", response_model=List[BuyingRequestResponse])
async def list_buying_requests(
    category_id: Optional[str] = None,
    buyer_company_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(BuyingRequest).options(
        selectinload(BuyingRequest.buyer_company),
        selectinload(BuyingRequest.category)
    )
    if category_id:
        stmt = stmt.where(BuyingRequest.category_id == category_id)
    if buyer_company_id:
        stmt = stmt.where(BuyingRequest.buyer_company_id == buyer_company_id)

    stmt = stmt.order_by(BuyingRequest.created_at.desc())
    result = await db.execute(stmt)
    requests = result.scalars().all()

    return [
        BuyingRequestResponse(
            id=r.id,
            buyer_company_id=r.buyer_company_id,
            buyer_company_name=r.buyer_company.name if r.buyer_company else None,
            category_id=r.category_id,
            category_name=r.category.name if r.category else None,
            title=r.title,
            target_quantity=r.target_quantity,
            unit=r.unit,
            max_price_per_unit=r.max_price_per_unit,
            min_grade_spec=r.min_grade_spec,
            delivery_address=r.delivery_address,
            delivery_city=r.delivery_city,
            latitude=r.latitude,
            longitude=r.longitude,
            deadline=r.deadline,
            status=r.status,
            created_at=r.created_at
        )
        for r in requests
    ]


@router.post("/", response_model=BuyingRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_buying_request(
    buyer_company_id: str,
    req: BuyingRequestCreate,
    db: AsyncSession = Depends(get_db)
):
    comp_res = await db.execute(select(Company).where(Company.id == buyer_company_id))
    company = comp_res.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Buyer company not found")

    cat_res = await db.execute(select(Category).where(Category.id == req.category_id))
    category = cat_res.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    buying_req = BuyingRequest(
        buyer_company_id=buyer_company_id,
        category_id=req.category_id,
        title=req.title,
        target_quantity=req.target_quantity,
        unit=req.unit,
        max_price_per_unit=req.max_price_per_unit,
        min_grade_spec=req.min_grade_spec,
        delivery_address=req.delivery_address,
        delivery_city=req.delivery_city,
        latitude=req.latitude,
        longitude=req.longitude,
        deadline=req.deadline,
        status=RequestStatus.OPEN.value
    )
    db.add(buying_req)
    await db.commit()
    await db.refresh(buying_req)

    return BuyingRequestResponse(
        id=buying_req.id,
        buyer_company_id=company.id,
        buyer_company_name=company.name,
        category_id=category.id,
        category_name=category.name,
        title=buying_req.title,
        target_quantity=buying_req.target_quantity,
        unit=buying_req.unit,
        max_price_per_unit=buying_req.max_price_per_unit,
        min_grade_spec=buying_req.min_grade_spec,
        delivery_address=buying_req.delivery_address,
        delivery_city=buying_req.delivery_city,
        latitude=buying_req.latitude,
        longitude=buying_req.longitude,
        deadline=buying_req.deadline,
        status=buying_req.status,
        created_at=buying_req.created_at
    )
