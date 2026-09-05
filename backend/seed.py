import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal, async_engine, Base
from app.core.security import get_password_hash
from app.models.category import Category
from app.models.company import Company, CompanyType
from app.models.user import User, UserRole
from app.models.material_listing import MaterialListing, ListingStatus, FrequencyType
from app.models.buying_request import BuyingRequest, RequestStatus
from app.models.aggregated_supply import AggregatedSupply, AggregatedSupplyItem, AggregationStatus
from app.models.order import Order, OrderItem, OrderStatus
from app.models.verification import Verification, VerificationStatus
from app.models.impact_log import ImpactLog


async def seed_data():
    print("[+] Starting ReuSource Database Seeding...")

    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # 1. Categories
        cat_pet = Category(
            name="Limbah Plastik PET Flakes",
            description="Cacahan plastik botol PET bersih siap daur ulang",
            default_unit="ton",
            co2_saved_factor_per_unit=1.8 # 1.8 kg CO2 saved per kg plastik PET recycled
        )
        cat_flyash = Category(
            name="Fly Ash & Bottom Ash (FABA)",
            description="Limbah abu batu bara non-B3 untuk bahan substitusi semen/paving block",
            default_unit="ton",
            co2_saved_factor_per_unit=0.9
        )
        cat_textile = Category(
            name="Sisa Kain Tekstil (Perca)",
            description="Potongan kain katun & polyester sisa produksi konveksi",
            default_unit="ton",
            co2_saved_factor_per_unit=2.5
        )
        db.add_all([cat_pet, cat_flyash, cat_textile])
        await db.flush()

        # 2. Companies (Suppliers & Buyer)
        # Supplier 1: UMKM Daur Ulang Mandiri (Cimahi)
        sup1 = Company(
            name="CV Cimahi Daur Ulang Mandiri",
            company_type=CompanyType.UMKM_SUPPLIER.value,
            nib_npwp="9120001234567",
            address="Jl. Raya Cimahi No. 45",
            city="Cimahi",
            province="Jawa Barat",
            latitude=-6.8722,
            longitude=107.5422
        )
        # Supplier 2: UMKM Plastik Sumedang
        sup2 = Company(
            name="UD Barokah Plastik Sumedang",
            company_type=CompanyType.UMKM_SUPPLIER.value,
            nib_npwp="9120007654321",
            address="Jl. Raya Jatinangor No. 12",
            city="Sumedang",
            province="Jawa Barat",
            latitude=-6.9311,
            longitude=107.7719
        )
        # Supplier 3: Koperasi Pengolah Limbah Bandung
        sup3 = Company(
            name="Koperasi Resik Bandung",
            company_type=CompanyType.UMKM_SUPPLIER.value,
            nib_npwp="9120009988776",
            address="Jl. Soekarno-Hatta No. 210",
            city="Bandung",
            province="Jawa Barat",
            latitude=-6.9450,
            longitude=107.6400
        )
        # Buyer: PT EcoPolymer Indonesia (Cikarang / Bekasi)
        buyer1 = Company(
            name="PT EcoPolymer Manufacturing Indonesia",
            company_type=CompanyType.ENTERPRISE_BUYER.value,
            nib_npwp="013456789012000",
            address="Kawasan Industri Jababeka 5, Cikarang",
            city="Bekasi",
            province="Jawa Barat",
            latitude=-6.3005,
            longitude=107.1690
        )
        db.add_all([sup1, sup2, sup3, buyer1])
        await db.flush()

        # 3. Users
        user_sup1 = User(
            email="supplier1@cimahi.com",
            password_hash=get_password_hash("password123"),
            full_name="Budi Santoso",
            phone="081234567890",
            role=UserRole.SUPPLIER_ADMIN.value,
            company_id=sup1.id
        )
        user_buyer1 = User(
            email="buyer@ecopolymer.co.id",
            password_hash=get_password_hash("password123"),
            full_name="Sarah Wijaya",
            phone="081987654321",
            role=UserRole.BUYER_ADMIN.value,
            company_id=buyer1.id
        )
        user_verifier = User(
            email="verifier@reusource.id",
            password_hash=get_password_hash("password123"),
            full_name="Ahmad Field Verifier",
            phone="081122334455",
            role=UserRole.VERIFIER.value,
            company_id=sup1.id
        )
        
        # Additional demo users for quick email login
        user_demo_supplier = User(
            email="test@supplier.com",
            password_hash=get_password_hash("password123"),
            full_name="Demo Supplier User",
            phone="081234567891",
            role=UserRole.SUPPLIER_ADMIN.value,
            company_id=sup1.id
        )
        
        user_demo_buyer = User(
            email="test@buyer.com",
            password_hash=get_password_hash("password123"),
            full_name="Demo Buyer User",
            phone="081234567892",
            role=UserRole.BUYER_ADMIN.value,
            company_id=buyer1.id
        )
        
        db.add_all([user_sup1, user_buyer1, user_verifier, user_demo_supplier, user_demo_buyer])
        await db.flush()

        # 4. Material Listings (Suppliers)
        listing1 = MaterialListing(
            company_id=sup1.id,
            category_id=cat_pet.id,
            title="Cacahan Plastik Botol PET Bening Grade A",
            description="Kondisi bersih, cuci panas, kadar air < 1%, kadar PVC < 50 ppm",
            grade_spec={"purity": "99%", "moisture": "0.8%", "color": "transparent"},
            available_quantity=3.5,
            initial_quantity=3.5,
            unit="ton",
            price_per_unit=11500000.0, # Rp 11.500.000 / ton
            frequency=FrequencyType.WEEKLY.value,
            latitude=sup1.latitude,
            longitude=sup1.longitude,
            city=sup1.city,
            status=ListingStatus.ACTIVE.value
        )
        listing2 = MaterialListing(
            company_id=sup2.id,
            category_id=cat_pet.id,
            title="Flakes PET Bening Press",
            description="Cacahan botol bekas bening siap masuk mesin extruder pellet",
            grade_spec={"purity": "97%", "moisture": "1.2%", "color": "transparent"},
            available_quantity=4.5,
            initial_quantity=4.5,
            unit="ton",
            price_per_unit=11000000.0, # Rp 11.000.000 / ton
            frequency=FrequencyType.WEEKLY.value,
            latitude=sup2.latitude,
            longitude=sup2.longitude,
            city=sup2.city,
            status=ListingStatus.ACTIVE.value
        )
        listing3 = MaterialListing(
            company_id=sup3.id,
            category_id=cat_pet.id,
            title="Limbah Cacahan PET Biru Muda",
            description="Hasil gilingan galon & botol air mineral warna biru muda",
            grade_spec={"purity": "98%", "moisture": "1.0%", "color": "light_blue"},
            available_quantity=5.0,
            initial_quantity=5.0,
            unit="ton",
            price_per_unit=10500000.0,
            frequency=FrequencyType.MONTHLY.value,
            latitude=sup3.latitude,
            longitude=sup3.longitude,
            city=sup3.city,
            status=ListingStatus.ACTIVE.value
        )
        db.add_all([listing1, listing2, listing3])
        await db.flush()

        # 5. Buying Request (Buyer looking for 10 Tons PET)
        buying_req = BuyingRequest(
            buyer_company_id=buyer1.id,
            category_id=cat_pet.id,
            title="Dibutuhkan 10 Ton Cacahan PET Bening / Light Color",
            target_quantity=10.0,
            unit="ton",
            max_price_per_unit=12000000.0,
            min_grade_spec={"purity": "95%", "max_moisture": "2.0%"},
            delivery_address=buyer1.address,
            delivery_city=buyer1.city,
            latitude=buyer1.latitude,
            longitude=buyer1.longitude,
            status=RequestStatus.OPEN.value
        )
        db.add(buying_req)
        await db.flush()

        # 6. Seed a completed historical order & impact log for instant dashboard demo
        demo_agg = AggregatedSupply(
            buying_request_id=buying_req.id,
            total_matched_quantity=8.0,
            total_material_cost=91000000.0,
            platform_fee=2730000.0,
            total_estimated_price=93730000.0,
            supplier_count=2,
            average_distance_km=42.5,
            status=AggregationStatus.CONVERTED_TO_ORDER.value
        )
        db.add(demo_agg)
        await db.flush()

        demo_order = Order(
            aggregated_supply_id=demo_agg.id,
            buying_request_id=buying_req.id,
            buyer_company_id=buyer1.id,
            total_amount=93730000.0,
            platform_fee=2730000.0,
            order_status=OrderStatus.COMPLETED.value
        )
        db.add(demo_order)
        await db.flush()

        demo_impact = ImpactLog(
            order_id=demo_order.id,
            buyer_company_id=buyer1.id,
            category_id=cat_pet.id,
            total_material_reused=8.0, # 8 Tons
            co2_avoided_kg=14400.0,   # 14,400 kg CO2e
            supplier_revenue_earned=91000000.0,
            buyer_cost_saved=13650000.0
        )
        db.add(demo_impact)

        await db.commit()

    print("[SUCCESS] Database seeding completed successfully!")
    print("[INFO] Demo Credentials:")
    print("   Supplier Admin: supplier1@cimahi.com / password123")
    print("   Buyer Admin:    buyer@ecopolymer.co.id / password123")
    print("   Verifier:       verifier@reusource.id / password123")
    print("   Quick Supplier: test@supplier.com / password123")
    print("   Quick Buyer:    test@buyer.com / password123")


if __name__ == "__main__":
    asyncio.run(seed_data())
