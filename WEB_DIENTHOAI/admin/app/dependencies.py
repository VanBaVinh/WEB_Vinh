"""
VinhBaPhone Admin — Dependencies & Role-Based Access Control (RBAC)
Dependency Injection cho Database Session và Security Checks.
"""
from typing import Generator, List, Optional
from fastapi import Cookie, Depends, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_access_token
from app.database import SessionLocal
from app.models.user import User

# OAuth2 scheme cho Swagger UI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token", auto_error=False)


def get_db() -> Generator[Session, None, None]:
    """Dependency cung cấp Session kết nối SQLite và đảm bảo đóng session sau khi hoàn thành."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_token_from_header_or_cookie(
    auth_header: Optional[str] = Header(None, alias="Authorization"),
    token_bearer: Optional[str] = Depends(oauth2_scheme),
    access_token_cookie: Optional[str] = Cookie(None, alias="access_token")
) -> Optional[str]:
    """Hỗ trợ lấy Token từ cả Bearer Header lẫn Cookie để Frontend linh hoạt."""
    if token_bearer:
        return token_bearer
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.replace("Bearer ", "").strip()
    if access_token_cookie:
        return access_token_cookie
    return None


def get_current_user(
    token: Optional[str] = Depends(get_token_from_header_or_cookie),
    db: Session = Depends(get_db)
) -> User:
    """Xác thực Token JWT và trả về User tương ứng."""
    if not token:
        raise UnauthorizedException("Vui lòng đăng nhập để tiếp tục truy cập")

    payload = decode_access_token(token)
    if not payload:
        raise UnauthorizedException("Phiên đăng nhập đã hết hạn hoặc token không hợp lệ")

    username: Optional[str] = payload.get("sub")
    if not username:
        raise UnauthorizedException("Token thiếu thông tin nhận diện người dùng")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise UnauthorizedException("Tài khoản không tồn tại trên hệ thống")

    if not user.is_active:
        raise UnauthorizedException("Tài khoản của bạn đã bị vô hiệu hóa")

    return user


def require_roles(allowed_roles: List[str]):
    """Role-Based Access Control (RBAC) Dependency Factory."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise ForbiddenException(
                f"Yêu cầu quyền truy cập: {', '.join(allowed_roles)}. Bạn hiện là: '{current_user.role}'"
            )
        return current_user
    return role_checker


# Dependency tiện lợi: Chỉ cho phép tài khoản có role='admin'
require_admin = require_roles(["admin"])

# Dependency cho phép cả admin lẫn staff
require_staff_or_admin = require_roles(["admin", "staff"])
