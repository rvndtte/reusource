from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.aggregated_supply import AggregatedSupply, AggregatedSupplyItem
from app.models.buying_request import BuyingRequest
from app.services.matching_engine import SmartMatchingEngine
from app.schemas.smart_matching import AggregatedSupplyResponse, TriggerMatchingRequest, AggregatedSupplyItemResponse

router = APIRouter()


@router.post("/trigger", response_model=AggregatedSupplyResponse, status_code=status.HTTP_201_CREATED)
async def trigger_smart_matching(
    req: TriggerMatchingRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Trigger Smart Matching Algorithm to find and aggregate suppliers for a buying request.
    """
    aggregated_supply = await SmartMatchingEngine.find_and_aggregate_suppliers(
        db=db,
        buying_request_id=req.buying_request_id,
        max_radius_km=req.max_radius_km or 150.0
    )

    if not aggregated_supply:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No matching active suppliers found within target criteria and price limit."
        )

    # Fetch with relations for schema response
    stmt = select(AggregatedSupply).options(
        selectinload(AggregatedSupply.items).selectinload(AggregatedSupplyItem.material_listing).selectinload(
            AggregatedSupplyItem.material_listing.property.mapper.class_.company
        ),
        selectinload(AggregatedSupply.buying_request)
    ).where(AggregatedSupply.id == aggregated_supply.id)

    res = await db.execute(stmt)
    agg = res.scalar_one()

    items_res = []
    for item in agg.items:
        items_res.append(
            AggregatedSupplyItemResponse(
                id=item.id,
                material_listing_id=item.material_listing_id,
                listing_title=item.material_listing.title if item.material_listing else "",
                supplier_company_id=item.material_listing.company_id if item.material_listing else "",
                supplier_company_name=item.material_listing.company.name if item.material_listing and item.material_listing.company else "",
                allocated_quantity=item.allocated_quantity,
                unit_price=item.unit_price,
                subtotal=item.subtotal,
                distance_km=item.distance_km
            )
        )

    return AggregatedSupplyResponse(
        id=agg.id,
        buying_request_id=agg.buying_request_id,
        total_matched_quantity=agg.total_matched_quantity,
        target_quantity=agg.buying_request.target_quantity if agg.buying_request else agg.total_matched_quantity,
        total_material_cost=agg.total_material_cost,
        platform_fee=agg.platform_fee,
        total_estimated_price=agg.total_estimated_price,
        supplier_count=int(agg.supplier_count),
        average_distance_km=agg.average_distance_km or 0.0,
        status=agg.status,
        items=items_res,
        created_at=agg.created_at
    )


@router.get("/request/{buying_request_id}", response_model=List[AggregatedSupplyResponse])
async def get_aggregations_for_request(
    buying_request_id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(AggregatedSupply).options(
        selectinload(AggregatedSupply.items).selectinload(AggregatedSupplyItem.material_listing).selectinload(
            AggregatedSupplyItem.material_listing.property.mapper.class_.company
        ),
        selectinload(AggregatedSupply.buying_request)
    ).where(AggregatedSupply.buying_request_id == buying_request_id).order_by(AggregatedSupply.created_at.desc())

    res = await db.execute(stmt)
    aggregations = res.scalars().all()

    result = []
    for agg in aggregations:
        items_res = []
        for item in agg.items:
            items_res.append(
                AggregatedSupplyItemResponse(
                    id=item.id,
                    material_listing_id=item.material_listing_id,
                    listing_title=item.material_listing.title if item.material_listing else "",
                    supplier_company_id=item.material_listing.company_id if item.material_listing else "",
                    supplier_company_name=item.material_listing.company.name if item.material_listing and item.material_listing.company else "",
                    allocated_quantity=item.allocated_quantity,
                    unit_price=item.unit_price,
                    subtotal=item.subtotal,
                    distance_km=item.distance_km
                )
            )

        result.append(
            AggregatedSupplyResponse(
                id=agg.id,
                buying_request_id=agg.buying_request_id,
                total_matched_quantity=agg.total_matched_quantity,
                target_quantity=agg.buying_request.target_quantity if agg.buying_request else agg.total_matched_quantity,
                total_material_cost=agg.total_material_cost,
                platform_fee=agg.platform_fee,
                total_estimated_price=agg.total_estimated_price,
                supplier_count=int(agg.supplier_count),
                average_distance_km=agg.average_distance_km or 0.0,
                status=agg.status,
                items=items_res,
                created_at=agg.created_at
            )
        )

    return result
