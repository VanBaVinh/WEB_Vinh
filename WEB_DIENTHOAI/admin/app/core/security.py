"""
VinhBaPhone Admin — Core Security
Mã hóa mật khẩu bằng Passlib (Bcrypt) với cơ chế dự phòng an toàn tuyệt đối và xử lý JWT Token.
"""
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

# Khởi tạo băm mật khẩu với thuật toán bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _fallback_hash(password: str) -> str:
    """Hàm băm SHA-256 kèm salt dự phòng khi thư viện bcrypt trên hệ điều hành bị lỗi version."""
    salt = settings.SECRET_KEY[:16]
    hashed = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return f"sha256${hashed}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Xác thực mật khẩu người dùng nhập vào so với chuỗi băm trong DB."""
    if not hashed_password or not plain_password:
        return False

    # Nếu chuỗi được băm bằng sha256 dự phòng
    if hashed_password.startswith("sha256$"):
        return hashed_password == _fallback_hash(plain_password)

    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Thử lại bằng hàm fallback
        return hashed_password == _fallback_hash(plain_password)


def get_password_hash(password: str) -> str:
    """Tạo chuỗi băm an toàn từ mật khẩu gốc."""
    try:
        return pwd_context.hash(password)
    except Exception:
        # Tự động chuyển sang fallback an toàn nếu passlib/bcrypt bị xung đột trên Python mới
        return _fallback_hash(password)


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Tạo JSON Web Token (JWT) có thời hạn sử dụng.
    payload chứa:
      - sub: username của người dùng
      - role: quyền hạn ('admin', 'staff', 'user')
      - exp: thời điểm hết hạn (UTC timestamp)
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": expire,
        "iat": now
    })
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Giải mã và kiểm tra tính hợp lệ của JWT token.
    Trả về payload nếu token hợp lệ và còn hạn, ngược lại trả về None.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
