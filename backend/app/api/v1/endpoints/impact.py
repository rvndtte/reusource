from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.impact_calculator import ImpactCalculatorService
from app.schemas.impact import ImpactDashboardResponse

router = APIRouter()


@router.get("/dashboard", response_model=ImpactDashboardResponse)
async def get_impact_dashboard(
    db: AsyncSession = Depends(get_db)
):
    """
    Get aggregated Impact Dashboard statistics.
    Returns material diverted, CO2 saved, supplier earnings, buyer savings, and category breakdown.
    """
    return await ImpactCalculatorService.get_impact_dashboard_metrics(db)
