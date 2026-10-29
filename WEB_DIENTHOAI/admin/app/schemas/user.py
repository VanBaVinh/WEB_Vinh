"""
VinhBaPhone Admin — User Schemas
Validate dữ liệu CRUD Người dùng.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None
    role: str = Field(default="user", pattern="^(admin|staff|user)$")
    is_active: bool = True
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = Field(default=None, pattern="^(admin|staff|user)$")
    is_active: Optional[bool] = None
    avatar_url: Optional[str] = None
    password: Optional[str] = Field(default=None, min_length=6, max_length=100)


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
