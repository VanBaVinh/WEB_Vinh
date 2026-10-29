"""
VinhBaPhone Admin — Order Schemas
Pydantic Schemas phục vụ validate dữ liệu đặt hàng và quản lý đơn hàng.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    """Schema tạo mới một mục sản phẩm trong đơn hàng."""
    product_id: int = Field(..., description="ID sản phẩm")
    quantity: int = Field(default=1, ge=1, description="Số lượng mua tối thiểu là 1")
    color: Optional[str] = Field(default=None, description="Màu sắc đã chọn")
    storage: Optional[str] = Field(default=None, description="Phiên bản bộ nhớ đã chọn")


class OrderItemResponse(BaseModel):
    """Schema trả về chi tiết mục sản phẩm đã đặt."""
    id: int
    order_id: int
    product_id: Optional[int] = None
    quantity: int
    price: float
    color: Optional[str] = None
    storage: Optional[str] = None
    product_name: Optional[str] = None
    product_image: Optional[str] = None

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    """Schema khách hàng gửi lên khi đặt hàng từ Store."""
    customer_name: str = Field(..., min_length=2, max_length=255, description="Họ và tên khách hàng")
    customer_phone: str = Field(..., min_length=8, max_length=20, description="Số điện thoại liên hệ")
    customer_address: str = Field(..., min_length=3, description="Địa chỉ nhận hàng chi tiết hoặc chi nhánh nhận")
    note: Optional[str] = Field(default=None, description="Ghi chú đơn hàng hoặc yêu cầu đặc biệt")
    payment_method: Optional[str] = Field(default=None, description="Phương thức thanh toán đã chọn")
    items: List[OrderItemCreate] = Field(..., min_length=1, description="Danh sách sản phẩm cần mua")
    user_id: Optional[int] = Field(default=None, description="ID người dùng nếu đã đăng nhập")


class OrderStatusUpdate(BaseModel):
    """Schema cập nhật trạng thái đơn hàng."""
    status: str = Field(
        ...,
        description="Trạng thái mới: 'pending', 'confirmed', 'shipping', 'completed', 'cancelled'"
    )


class OrderResponse(BaseModel):
    """Schema đầy đủ thông tin đơn hàng trả về cho Client & Admin."""
    id: int
    user_id: Optional[int] = None
    customer_name: str
    customer_phone: str
    customer_address: str
    note: Optional[str] = None
    total_price: float
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True
