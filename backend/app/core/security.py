import bcrypt
import time
from datetime import datetime, timedelta, timezone
from typing import Any, Union, Dict
from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.database import get_db

ALGORITHM = "HS256"
security_scheme = HTTPBearer(auto_error=False)

# In-Memory OTP Store with timestamps for Rate Limiting & Expiry
# Format: { phone: {"code": str, "sent_at": float, "expires_at": float} }
_otp_store: Dict[str, Dict[str, Any]] = {}
OTP_RATE_LIMIT_SECONDS = 60
OTP_EXPIRY_SECONDS = 300 # 5 Minutes


def check_and_record_otp_request(phone: str, code: str) -> None:
    """
    Enforces strict rate limiting: max 1 OTP request per 60 seconds per phone number.
    Records OTP with 5-minute TTL.
    """
    now = time.time()
    clean_phone = phone.strip().replace(" ", "").replace("-", "")

    if clean_phone in _otp_store:
        last_sent = _otp_store[clean_phone].get("sent_at", 0)
        elapsed = now - last_sent
        if elapsed < OTP_RATE_LIMIT_SECONDS:
            remaining = int(OTP_RATE_LIMIT_SECONDS - elapsed)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Terlalu sering meminta OTP. Silakan tunggu {remaining} detik sebelum meminta kode baru."
            )

    _otp_store[clean_phone] = {
        "code": code,
        "sent_at": now,
        "expires_at": now + OTP_EXPIRY_SECONDS
    }


def verify_stored_otp(phone: str, entered_code: str) -> bool:
    """
    Validates OTP matching & checks that OTP has not expired (within 5 minutes).
    """
    now = time.time()
    clean_phone = phone.strip().replace(" ", "").replace("-", "")

    record = _otp_store.get(clean_phone)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kode OTP belum pernah diminta untuk nomor ini atau telah kedaluwarsa."
        )

    if now > record["expires_at"]:
        del _otp_store[clean_phone]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kode OTP telah kedaluwarsa (berlaku 5 menit). Silakan minta kode baru."
        )

    if record["code"] != entered_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kode OTP tidak valid."
        )

    # Clean up after successful verification
    del _otp_store[clean_phone]
    return True


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
):
    from app.models.user import User

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required"
        )
    
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

    stmt = select(User).options(selectinload(User.company)).where(User.id == user_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user


def require_roles(allowed_roles: list):
    async def role_checker(current_user = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Requires role in {allowed_roles}"
            )
        return current_user
    return role_checker
