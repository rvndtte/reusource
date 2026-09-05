import math
from typing import List, Dict, Any, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models.buying_request import BuyingRequest, RequestStatus
from app.models.material_listing import MaterialListing, ListingStatus
from app.models.aggregated_supply import AggregatedSupply, AggregatedSupplyItem, AggregationStatus
from app.models.company import Company


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate Great Circle distance in km between two lat/lon points."""
    R = 6371.0 # Earth radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return round(R * c, 2)


class SmartMatchingEngine:

    @staticmethod
    async def find_and_aggregate_suppliers(
        db: AsyncSession,
        buying_request_id: str,
        max_radius_km: float = 150.0
    ) -> Optional[AggregatedSupply]:
        """
        Core Smart Matching & Aggregation Algorithm:
        1. Fetch buying request with buyer location and specs.
        2. Query active material listings in the same category & below max target price.
        3. Calculate distance to buyer delivery location.
        4. Sort candidate listings by best score (composite of proximity & price).
        5. Greedy allocation: aggregate multiple listings until target_quantity is satisfied.
        6. Persist AggregatedSupply & AggregatedSupplyItem records.
        """
        # 1. Fetch buying request
        request_query = await db.execute(
            select(BuyingRequest).where(BuyingRequest.id == buying_request_id)
        )
        request: BuyingRequest = request_query.scalar_one_or_none()
        if not request or request.status in [RequestStatus.FULFILLED.value, RequestStatus.CANCELLED.value]:
            return None

        # 2. Fetch candidate listings
        listings_query = await db.execute(
            select(MaterialListing)
            .options(selectinload(MaterialListing.company))
            .where(
                MaterialListing.category_id == request.category_id,
                MaterialListing.status == ListingStatus.ACTIVE.value,
                MaterialListing.available_quantity > 0,
                MaterialListing.price_per_unit <= request.max_price_per_unit,
                MaterialListing.company_id != request.buyer_company_id  # Buyer cannot buy from self
            )
        )
        candidate_listings: List[MaterialListing] = listings_query.scalars().all()

        if not candidate_listings:
            return None

        # 3. Calculate distance and score candidate listings
        scored_candidates: List[Tuple[float, float, MaterialListing]] = []
        for listing in candidate_listings:
            distance_km = calculate_haversine_distance(
                request.latitude, request.longitude,
                listing.latitude, listing.longitude
            )
            
            if distance_km <= max_radius_km:
                # Score formula: combination of price weight (60%) and distance weight (40%)
                # Lower score is better
                score = (listing.price_per_unit * 0.6) + (distance_km * 0.4)
                scored_candidates.append((score, distance_km, listing))

        # Sort candidates by best score (lowest score first)
        scored_candidates.sort(key=lambda x: x[0])

        if not scored_candidates:
            return None

        # 4. Aggregation Greedy Allocation
        remaining_needed = request.target_quantity
        total_matched_qty = 0.0
        total_material_cost = 0.0
        total_distance = 0.0
        
        allocation_items: List[Dict[str, Any]] = []

        for score, distance_km, listing in scored_candidates:
            if remaining_needed <= 0:
                break
                
            allocated_qty = min(listing.available_quantity, remaining_needed)
            subtotal = allocated_qty * listing.price_per_unit
            
            allocation_items.append({
                "listing": listing,
                "allocated_quantity": allocated_qty,
                "unit_price": listing.price_per_unit,
                "subtotal": subtotal,
                "distance_km": distance_km
            })

            total_matched_qty += allocated_qty
            total_material_cost += subtotal
            total_distance += distance_km
            remaining_needed -= allocated_qty

        if not allocation_items:
            return None

        # Platform service fee (e.g. 3% for aggregation & verification service)
        platform_fee = round(total_material_cost * 0.03, 2)
        total_estimated_price = total_material_cost + platform_fee
        avg_distance = round(total_distance / len(allocation_items), 2)

        # 5. Persist AggregatedSupply
        aggregated_supply = AggregatedSupply(
            buying_request_id=request.id,
            total_matched_quantity=total_matched_qty,
            total_material_cost=total_material_cost,
            platform_fee=platform_fee,
            total_estimated_price=total_estimated_price,
            supplier_count=len(allocation_items),
            average_distance_km=avg_distance,
            status=AggregationStatus.PROPOSED.value
        )
        db.add(aggregated_supply)
        await db.flush() # get ID

        for item_data in allocation_items:
            supply_item = AggregatedSupplyItem(
                aggregated_supply_id=aggregated_supply.id,
                material_listing_id=item_data["listing"].id,
                allocated_quantity=item_data["allocated_quantity"],
                unit_price=item_data["unit_price"],
                subtotal=item_data["subtotal"],
                distance_km=item_data["distance_km"]
            )
            db.add(supply_item)

        # Update buying request status
        request.status = RequestStatus.MATCHED.value
        await db.commit()
        await db.refresh(aggregated_supply)

        return aggregated_supply
