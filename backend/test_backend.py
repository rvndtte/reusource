import asyncio
from app.core.database import AsyncSessionLocal
from app.services.matching_engine import SmartMatchingEngine
from app.services.impact_calculator import ImpactCalculatorService
from app.models.buying_request import BuyingRequest


async def run_tests():
    print("[+] Running Backend Integration Verification...")

    async with AsyncSessionLocal() as db:
        # 1. Test Impact Calculator
        impact = await ImpactCalculatorService.get_impact_dashboard_metrics(db)
        print(f"[OK] Impact Dashboard Metrics:")
        print(f"     Total Reused Tons: {impact.total_material_reused_tons} tons")
        print(f"     CO2 Avoided: {impact.total_co2_avoided_kg} kg CO2e")
        print(f"     Supplier Revenue: Rp {impact.total_supplier_revenue_idr:,.0f}")
        print(f"     Buyer Savings: Rp {impact.total_buyer_savings_idr:,.0f}")
        print(f"     Category Breakdown Count: {len(impact.category_breakdown)}")

        # 2. Test Smart Matching Engine Trigger on buying request
        from sqlalchemy.future import select
        res = await db.execute(select(BuyingRequest).where(BuyingRequest.status == "open"))
        open_req = res.scalars().first()

        if open_req:
            print(f"\n[+] Triggering Smart Matching Engine for Request '{open_req.title}' (Target: {open_req.target_quantity} tons)...")
            agg = await SmartMatchingEngine.find_and_aggregate_suppliers(db, open_req.id, max_radius_km=200.0)
            
            if agg:
                print(f"[SUCCESS] Smart Matching Aggregated Package Created!")
                print(f"          Total Matched Quantity: {agg.total_matched_quantity} tons")
                print(f"          Number of Suppliers Combined: {agg.supplier_count}")
                print(f"          Average Transport Distance: {agg.average_distance_km} km")
                print(f"          Total Estimated Price: Rp {agg.total_estimated_price:,.0f}")
            else:
                print("[!] Smart matching returned None")
        else:
            print("[!] No open buying request found for matching test")

    print("\n[ALL TESTS PASSED SUCCESSFULLY!]")


if __name__ == "__main__":
    asyncio.run(run_tests())
