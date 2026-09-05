from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    companies,
    categories,
    material_listings,
    buying_requests,
    smart_matching,
    orders,
    verifications,
    impact,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(categories.router, prefix="/categories", tags=["Material Categories"])
api_router.include_router(material_listings.router, prefix="/material-listings", tags=["Material Listings (Supplier)"])
api_router.include_router(buying_requests.router, prefix="/buying-requests", tags=["Buying Requests (Buyer)"])
api_router.include_router(smart_matching.router, prefix="/smart-matching", tags=["Smart Matching & Aggregation"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders & Escrow"])
api_router.include_router(verifications.router, prefix="/verifications", tags=["Verifications & QC"])
api_router.include_router(impact.router, prefix="/impact", tags=["Impact Dashboard"])
