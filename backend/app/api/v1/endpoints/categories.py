from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryResponse, CategoryCreate

router = APIRouter()


@router.get("/", response_model=List[CategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Category).order_by(Category.name))
    return result.scalars().all()


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    req: CategoryCreate,
    db: AsyncSession = Depends(get_db)
):
    cat = Category(
        name=req.name,
        description=req.description,
        default_unit=req.default_unit,
        co2_saved_factor_per_unit=req.co2_saved_factor_per_unit
    )
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return cat
