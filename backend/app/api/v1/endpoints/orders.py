from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.aggregated_supply import AggregatedSupply, AggregatedSupplyItem, AggregationStatus
from app.models.buying_request import BuyingRequest, RequestStatus
from app.models.material_listing import MaterialListing, ListingStatus
from app.models.company import Company
from app.schemas.order import OrderCreateRequest, OrderResponse, OrderItemResponse, UpdateOrderStatusRequest

router = APIRouter()


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order_from_aggregation(
    req: OrderCreateRequest,
    db: AsyncSession = Depends(get_db)
):
    # Fetch AggregatedSupply
    stmt = select(AggregatedSupply).options(
        selectinload(AggregatedSupply.items).selectinload(AggregatedSupplyItem.material_listing),
        selectinload(AggregatedSupply.buying_request)
    ).where(AggregatedSupply.id == req.aggregated_supply_id)

    res = await db.execute(stmt)
    agg: AggregatedSupply = res.scalar_one_or_none()

    if not agg:
        raise HTTPException(status_code=404, detail="Aggregated supply proposal not found")

    if agg.status == AggregationStatus.CONVERTED_TO_ORDER.value:
        raise HTTPException(status_code=400, detail="Order already created for this aggregation proposal")

    buying_req: BuyingRequest = agg.buying_request

    # Create Order
    order = Order(
        aggregated_supply_id=agg.id,
        buying_request_id=buying_req.id,
        buyer_company_id=buying_req.buyer_company_id,
        total_amount=agg.total_estimated_price,
        platform_fee=agg.platform_fee,
        order_status=OrderStatus.PENDING_PAYMENT.value
    )
    db.add(order)
    await db.flush()

    # Create Order Items and update listing available quantities
    for item in agg.items:
        listing: MaterialListing = item.material_listing
        order_item = OrderItem(
            order_id=order.id,
            supplier_company_id=listing.company_id,
            material_listing_id=listing.id,
            quantity=item.allocated_quantity,
            unit_price=item.unit_price,
            subtotal=item.subtotal
        )
        db.add(order_item)

        # Deduct listing available quantity
        listing.available_quantity = max(0.0, listing.available_quantity - item.allocated_quantity)
        if listing.available_quantity == 0:
            listing.status = ListingStatus.SOLD_OUT.value
        else:
            listing.status = ListingStatus.PARTIALLY_AGGREGATED.value

    # Update aggregation & buying request status
    agg.status = AggregationStatus.CONVERTED_TO_ORDER.value
    buying_req.status = RequestStatus.FULFILLED.value

    await db.commit()
    await db.refresh(order)

    # Fetch complete order for response
    order_stmt = select(Order).options(
        selectinload(Order.items).selectinload(OrderItem.material_listing),
        selectinload(Order.items).selectinload(OrderItem.supplier_company_id),
        selectinload(Order.buyer_company_id)
    ).where(Order.id == order.id)

    return await get_order_by_id(order.id, db)


@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    buyer_company_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Order).options(
        selectinload(Order.items).selectinload(OrderItem.material_listing)
    )
    if buyer_company_id:
        stmt = stmt.where(Order.buyer_company_id == buyer_company_id)

    stmt = stmt.order_by(Order.created_at.desc())
    res = await db.execute(stmt)
    orders = res.scalars().all()

    response_list = []
    for o in orders:
        items_res = []
        for item in o.items:
            items_res.append(
                OrderItemResponse(
                    id=item.id,
                    supplier_company_id=item.supplier_company_id,
                    supplier_company_name="",
                    material_listing_id=item.material_listing_id,
                    listing_title=item.material_listing.title if item.material_listing else "",
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    subtotal=item.subtotal
                )
            )

        response_list.append(
            OrderResponse(
                id=o.id,
                aggregated_supply_id=o.aggregated_supply_id,
                buying_request_id=o.buying_request_id,
                buyer_company_id=o.buyer_company_id,
                buyer_company_name="",
                total_amount=o.total_amount,
                platform_fee=o.platform_fee,
                order_status=o.order_status,
                items=items_res,
                created_at=o.created_at
            )
        )

    return response_list


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_by_id(
    order_id: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Order).options(
        selectinload(Order.items).selectinload(OrderItem.material_listing)
    ).where(Order.id == order_id)

    res = await db.execute(stmt)
    o = res.scalar_one_or_none()
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")

    items_res = []
    for item in o.items:
        items_res.append(
            OrderItemResponse(
                id=item.id,
                supplier_company_id=item.supplier_company_id,
                supplier_company_name="",
                material_listing_id=item.material_listing_id,
                listing_title=item.material_listing.title if item.material_listing else "",
                quantity=item.quantity,
                unit_price=item.unit_price,
                subtotal=item.subtotal
            )
        )

    return OrderResponse(
        id=o.id,
        aggregated_supply_id=o.aggregated_supply_id,
        buying_request_id=o.buying_request_id,
        buyer_company_id=o.buyer_company_id,
        buyer_company_name="",
        total_amount=o.total_amount,
        platform_fee=o.platform_fee,
        order_status=o.order_status,
        items=items_res,
        created_at=o.created_at
    )


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    req: UpdateOrderStatusRequest,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Order).where(Order.id == order_id)
    res = await db.execute(stmt)
    order = res.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.order_status = req.order_status
    await db.commit()

    return await get_order_by_id(order_id, db)
