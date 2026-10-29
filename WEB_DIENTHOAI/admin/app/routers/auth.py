"""
VinhBaPhone Admin — Auth Router
API xử lý Đăng nhập, Đăng xuất và Lấy thông tin tài khoản hiện tại.
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import settings
from app.core.exceptions import BadRequestException, UnauthorizedException
from app.core.security import create_access_token, verify_password
from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
def login(
    login_data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Đăng nhập bằng JSON (username và password).
    Trả về JWT Token và thiết lập HTTP-Only Cookie cho Frontend.
    """
    # Hỗ trợ đăng nhập bằng cả username hoặc email
    user = db.query(User).filter(
        (User.username == login_data.username) | (User.email == login_data.username)
    ).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise UnauthorizedException("Email/Tên đăng nhập hoặc mật khẩu không chính xác")

    if not user.is_active:
        raise UnauthorizedException("Tài khoản này đã bị khóa. Vui lòng liên hệ quản trị viên")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires
    )

    # Đặt cookie để hỗ trợ browser navigation
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax"
    )

    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        username=user.username,
        full_name=user.full_name
    )


@router.post("/token", response_model=Token)
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Endpoint tương thích OAuth2 form-data dành cho Swagger UI (/docs)."""
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng")

    if not user.is_active:
        raise UnauthorizedException("Tài khoản đã bị khóa")

    token = create_access_token(
        data={"sub": user.username, "role": user.role}
    )

    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        username=user.username,
        full_name=user.full_name
    )


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Lấy thông tin tài khoản đang đăng nhập."""
    return current_user


@router.post("/logout")
def logout(response: Response):
    """Đăng xuất và xóa Cookie phiên làm việc."""
    response.delete_cookie(key="access_token")
    return {"success": True, "message": "Đăng xuất thành công"}
