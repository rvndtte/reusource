import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    check_and_record_otp_request,
    verify_stored_otp
)
from app.models.user import User, UserRole
from app.models.company import Company, CompanyType
from app.schemas.auth import (
    UserRegisterRequest,
    LoginRequest,
    TokenResponse,
    OtpSendRequest,
    OtpSendResponse,
    OtpVerifyRegisterRequest,
    OtpVerifyLoginRequest,
    UserMeResponse
)

router = APIRouter()


@router.post("/request-otp", response_model=OtpSendResponse)
async def request_otp(req: OtpSendRequest):
    """
    Kirim kode OTP 6-digit ke nomor WhatsApp pengguna.
    Rate limit: Maksimal 1 permintaan per 60 detik per nomor.
    Masa berlaku: 5 menit.
    """
    clean_phone = req.phone.strip().replace(" ", "").replace("-", "")
    if len(clean_phone) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nomor WhatsApp tidak valid (minimal 8 digit)."
        )

    # Generate real random 6-digit OTP code
    otp_code = str(random.randint(100000, 999999))

    # Record OTP in security cache with rate limiter & expiry
    check_and_record_otp_request(clean_phone, otp_code)

    # Production log: in production with live gateway credentials, call WhatsApp gateway API here
    print(f"[AUTH GATEWAY] OTP sent to {clean_phone}: {otp_code}")

    # For development: include OTP in response (remove in production)
    return OtpSendResponse(
        status="success",
        message="Kode OTP 6-digit berhasil dikirimkan ke nomor WhatsApp Anda.",
        phone=clean_phone,
        demo_otp_code=otp_code  # For development testing only
    )


@router.post("/verify-otp-register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def verify_otp_register(
    req: OtpVerifyRegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Verifikasi OTP & Selesaikan Pendaftaran Usaha Baru ke Database.
    Data yang didaftarkan akan disimpan persisten di SQLite.
    """
    clean_phone = req.phone.strip().replace(" ", "").replace("-", "")

    if not req.business_name or len(req.business_name.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nama usaha wajib diisi dengan benar."
        )

    # Validate OTP matching & TTL expiry (5 minutes)
    verify_stored_otp(clean_phone, req.otp_code)

    # Check if user with this phone already exists
    existing = await db.execute(select(User).where(User.phone == clean_phone))
    existing_user = existing.scalar_one_or_none()
    if existing_user:
        stmt = select(User).options(selectinload(User.company)).where(User.id == existing_user.id)
        res = await db.execute(stmt)
        user = res.scalar_one()
        token = create_access_token(subject=user.id)
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            company_id=user.company_id,
            company_name=user.company.name if user.company else "",
            verification_status=user.company.verification_status if user.company else "pending_verification"
        )

    # Map role
    assigned_role = UserRole.SUPPLIER_ADMIN.value if req.role in ["supplier", "supplier_admin"] else UserRole.BUYER_ADMIN.value
    comp_type = CompanyType.UMKM_SUPPLIER.value if assigned_role == UserRole.SUPPLIER_ADMIN.value else CompanyType.ENTERPRISE_BUYER.value

    # Parse address & city
    address_str = req.address.strip() if req.address else "Indonesia"
    city_str = req.city.strip() if req.city and req.city != "Indonesia" else (address_str.split(",")[-2].strip() if "," in address_str else "Indonesia")
    province_str = req.province.strip() if req.province and req.province != "Indonesia" else (address_str.split(",")[-1].strip() if "," in address_str else "Indonesia")

    # Create Company with actual data submitted by user
    company = Company(
        name=req.business_name.strip(),
        company_type=comp_type,
        address=address_str,
        city=city_str,
        province=province_str,
        latitude=req.latitude or -6.2088,
        longitude=req.longitude or 106.8456,
        verification_status="pending_verification",
        is_micro_business="true",
        is_first_time_seller="true"
    )
    db.add(company)
    await db.flush()

    synthetic_email = f"wa_{clean_phone}@reusource.id"

    # Create User with actual contact name submitted by user
    contact_person = req.contact_name.strip() if req.contact_name and len(req.contact_name.strip()) > 0 else req.business_name.strip()

    user = User(
        email=synthetic_email,
        password_hash=get_password_hash("wa_otp_secure_login"),
        full_name=contact_person,
        phone=clean_phone,
        role=assigned_role,
        company_id=company.id
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        company_id=company.id,
        company_name=company.name,
        verification_status=company.verification_status
    )


@router.post("/verify-otp-login", response_model=TokenResponse)
async def verify_otp_login(
    req: OtpVerifyLoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Verifikasi OTP & Masuk dengan Nomor WhatsApp Terdaftar.
    """
    clean_phone = req.phone.strip().replace(" ", "").replace("-", "")

    # Validate OTP matching & TTL expiry (5 minutes)
    verify_stored_otp(clean_phone, req.otp_code)

    # Find registered user by phone in database
    stmt = select(User).options(selectinload(User.company)).where(User.phone == clean_phone)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nomor WhatsApp ini belum terdaftar di sistem. Silakan lakukan pendaftaran terlebih dahulu."
        )

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        company_id=user.company_id,
        company_name=user.company.name if user.company else "",
        verification_status=user.company.verification_status if user.company else "approved"
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    req: UserRegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(select(User).where(User.email == req.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar."
        )

    company = Company(
        name=req.company_name.strip(),
        company_type=req.company_type.value,
        address=req.address.strip(),
        city=req.city.strip(),
        province=req.province.strip(),
        latitude=req.latitude or -6.2088,
        longitude=req.longitude or 106.8456,
        verification_status="pending_verification"
    )
    db.add(company)
    await db.flush()

    user = User(
        email=req.email.strip(),
        password_hash=get_password_hash(req.password),
        full_name=req.full_name.strip(),
        phone=req.phone.strip() if req.phone else None,
        role=req.role.value,
        company_id=company.id
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        company_id=company.id,
        company_name=company.name,
        verification_status=company.verification_status
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    req: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User).options(selectinload(User.company)).where(User.email == req.email)
    )
    user: User = result.scalar_one_or_none()
    
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau kata sandi tidak valid."
        )

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        company_id=user.company_id,
        company_name=user.company.name if user.company else "",
        verification_status=user.company.verification_status if user.company else "approved"
    )


@router.get("/me", response_model=UserMeResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get current logged in user's profile, role, company, and verification status.
    """
    comp = current_user.company
    return UserMeResponse(
        user_id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        phone=current_user.phone,
        role=current_user.role,
        company_id=current_user.company_id,
        company_name=comp.name if comp else "",
        company_type=comp.company_type if comp else "umkm_supplier",
        address=comp.address if comp else "",
        city=comp.city if comp else "",
        province=comp.province if comp else "",
        latitude=comp.latitude if comp else -6.2088,
        longitude=comp.longitude if comp else 106.8456,
        verification_status=comp.verification_status if comp else "approved",
        verification_notes=comp.verification_notes if comp else None
    )
