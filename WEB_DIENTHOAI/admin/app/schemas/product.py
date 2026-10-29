"""
VinhBaPhone Admin — Product Schemas
Validate dữ liệu CRUD Sản phẩm.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., min_length=2, max_length=50)
    brand: str = Field(..., min_length=2, max_length=50)
    price: float = Field(..., ge=0)
    original_price: Optional[float] = Field(default=None, ge=0)
    stock: int = Field(default=0, ge=0)
    image_url: Optional[str] = None
    badge: Optional[str] = None
    is_flash_sale: bool = False
    is_active: bool = True
    description: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=200)
    category: Optional[str] = Field(default=None, min_length=2, max_length=50)
    brand: Optional[str] = Field(default=None, min_length=2, max_length=50)
    price: Optional[float] = Field(default=None, ge=0)
    original_price: Optional[float] = Field(default=None, ge=0)
    stock: Optional[int] = Field(default=None, ge=0)
    image_url: Optional[str] = None
    badge: Optional[str] = None
    is_flash_sale: Optional[bool] = None
    is_active: Optional[bool] = None
    description: Optional[str] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
