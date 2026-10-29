"""
VinhBaPhone Admin — Chatbot Router (AI Assistant API)
Endpoint tiếp nhận tin nhắn từ người dùng, tương tác với ChatAIService
và trả về cấu trúc dữ liệu phong phú (Rich Media JSON Response).
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_ai_service import ChatAIService

router = APIRouter(prefix="/api/chat", tags=["AI Assistant (S-Bot)"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
@router.post("/", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def handle_chat_message(
    chat_in: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Tiếp nhận câu hỏi từ người dùng, phân tích ý định (Intent Detection),
    bơm ngữ cảnh dữ liệu thực từ Database (Products & Orders),
    và trả về câu trả lời định dạng Markdown kèm thẻ sản phẩm hoặc thông tin đơn hàng.
    """
    return ChatAIService.process_chat(
        message=chat_in.message,
        conversation_history=chat_in.conversation_history or [],
        db=db
    )


@router.get("/suggested", status_code=status.HTTP_200_OK)
def get_suggested_prompts():
    """Lấy danh sách các câu hỏi gợi ý nhanh ban đầu."""
    return {
        "success": True,
        "prompts": [
            {"label": "🔥 Top máy giảm giá sâu", "query": "Các sản phẩm đang Flash Sale giảm sâu nhất hôm nay"},
            {"label": "📱 Tư vấn chọn điện thoại", "query": "Tư vấn điện thoại tốt nhất tầm 10 đến 15 triệu chơi game mượt pin trâu"},
            {"label": "⚖️ So sánh 16 Pro Max & S24 Ultra", "query": "So sánh iPhone 16 Pro Max và Galaxy S24 Ultra"},
            {"label": "📦 Tra cứu đơn hàng của tôi", "query": "Tôi muốn tra cứu tình trạng đơn hàng của mình"},
            {"label": "💳 Chính sách bảo hành & Trả góp", "query": "Thủ tục mua hàng trả góp 0% và chính sách bảo hành 1 đổi 1 như thế nào?"}
        ]
    }
