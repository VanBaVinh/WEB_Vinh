"""
VinhBaPhone Admin — Authentication Schemas
Validate dữ liệu đăng nhập và phản hồi JWT Token.
"""
from typing import Optional
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """Yêu cầu đăng nhập bằng JSON."""
    username: str = Field(..., min_length=3, max_length=50, description="Tên đăng nhập")
    password: str = Field(..., min_length=4, max_length=100, description="Mật khẩu")


class Token(BaseModel):
    """Cấu trúc phản hồi Token khi đăng nhập thành công."""
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str
    full_name: Optional[str] = None


class TokenPayload(BaseModel):
    """Dữ liệu giải mã từ JWT token."""
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None
