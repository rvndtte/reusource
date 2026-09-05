from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.company import Company
from app.schemas.company import CompanyResponse, CompanyCreate

router = APIRouter()


@router.get("/", response_model=List[CompanyResponse])
async def list_companies(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Company))
    return result.scalars().all()


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
