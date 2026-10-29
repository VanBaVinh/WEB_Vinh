"""
VinhBaPhone Admin — Chatbot Schemas
Định nghĩa cấu trúc dữ liệu cho Smart E-Commerce AI Assistant (S-Bot).
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ChatMessageItem(BaseModel):
    """Một tin nhắn trong lịch sử hội thoại."""
    role: str = Field(..., description="'user' hoặc 'assistant'")
    content: str = Field(..., description="Nội dung tin nhắn")


class ChatRequest(BaseModel):
    """Yêu cầu chat gửi lên từ Storefront."""
    message: str = Field(..., min_length=1, max_length=2000, description="Câu hỏi hoặc tin nhắn của người dùng")
    conversation_history: Optional[List[ChatMessageItem]] = Field(
        default_factory=list,
        description="Lịch sử các lượt chat gần nhất để AI ghi nhớ ngữ cảnh"
    )


class RecommendedProduct(BaseModel):
    """Thẻ sản phẩm thu gọn đính kèm trong tin nhắn của AI."""
    id: int
    name: str
    category: str
    brand: str
    price: float
    original_price: Optional[float] = None
    discount_percent: Optional[int] = None
    image_url: Optional[str] = None
    stock: int = 10
    badge: Optional[str] = None
    specs_summary: Optional[str] = None


class OrderItemSummary(BaseModel):
    """Chi tiết sản phẩm trong đơn hàng tra cứu."""
    product_name: str
    quantity: int
    price: float
    color: Optional[str] = None
    storage: Optional[str] = None


class OrderLookupResult(BaseModel):
    """Kết quả tra cứu đơn hàng thực tế từ bảng Orders."""
    order_id: int
    order_code: str
    customer_name: str
    customer_phone: str
    customer_address: str
    total_price: float
    status: str
    status_label: str
    created_at: str
    items: List[OrderItemSummary] = Field(default_factory=list)


class ChatResponse(BaseModel):
    """Phản hồi JSON có cấu trúc từ AI Assistant."""
    success: bool = True
    reply: str = Field(..., description="Nội dung phản hồi định dạng Markdown")
    intent: Optional[str] = Field(None, description="Ý định phát hiện được")
    recommended_products: List[RecommendedProduct] = Field(
        default_factory=list,
        description="Danh sách sản phẩm liên quan thực tế từ Database"
    )
    order_info: Optional[OrderLookupResult] = Field(
        None,
        description="Thông tin đơn hàng nếu là tra cứu đơn"
    )
    suggested_chips: List[str] = Field(
        default_factory=list,
        description="Gợi ý câu hỏi tiếp theo dựa trên ngữ cảnh"
    )
