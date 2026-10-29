"""
VinhBaPhone Admin — Admin Portal & Orders Management Router
Render giao diện Jinja2 cho quản trị viên và xử lý cập nhật trạng thái đơn hàng.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Form, Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.config import settings
from app.core.exceptions import BadRequestException, NotFoundException
from app.dependencies import get_db
from app.models.order import Order
from app.models.product import Product
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin Portal & UI"])

# Khởi tạo Jinja2 Templates engine
templates = Jinja2Templates(directory=str(settings.TEMPLATES_DIR))


# Đăng ký bộ lọc tiền tệ VNĐ cho Jinja2
def format_currency_filter(value):
    try:
        val = int(round(float(value)))
        return f"{val:,} ₫".replace(",", ".")
    except Exception:
        return f"{value} ₫"


def format_datetime_filter(dt):
    if not dt:
        return ""
    try:
        return dt.strftime("%d/%m/%Y %H:%M")
    except Exception:
        return str(dt)


templates.env.filters["currency"] = format_currency_filter
templates.env.filters["datetime_format"] = format_datetime_filter

VALID_STATUSES = ["pending", "confirmed", "shipping", "completed", "cancelled"]


@router.get("/orders", include_in_schema=False)
def get_admin_orders_page(
    request: Request,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Render giao diện danh sách tất cả đơn hàng từ DB (orders),
    sắp xếp mới nhất lên đầu (created_at DESC).
    """
    query = db.query(Order)

    if status and status.strip() and status.strip() in VALID_STATUSES:
        query = query.filter(Order.status == status.strip())

    if search and search.strip():
        raw_s = search.strip()
        term = f"%{raw_s}%"
        import re
        code_m = re.match(r"^(?:VBP|CPS|DH|#)+0*(\d+)$", raw_s, re.IGNORECASE)
        if code_m:
            oid = int(code_m.group(1))
            query = query.filter(Order.id == oid)
        elif raw_s.isdigit() and len(raw_s) <= 7 and not raw_s.startswith("0"):
            oid = int(raw_s)
            query = query.filter(
                or_(
                    Order.id == oid,
                    Order.customer_name.ilike(term),
                    Order.customer_phone.ilike(term),
                    Order.customer_address.ilike(term)
                )
            )
        else:
            query = query.filter(
                or_(
                    Order.customer_name.ilike(term),
                    Order.customer_phone.ilike(term),
                    Order.customer_address.ilike(term)
                )
            )

    orders = query.order_by(Order.created_at.desc()).all()

    # Thống kê tổng quan nhanh
    all_orders = db.query(Order).all()
    total_orders = len(all_orders)
    pending_count = sum(1 for o in all_orders if o.status == "pending")
    confirmed_count = sum(1 for o in all_orders if o.status == "confirmed")
    shipping_count = sum(1 for o in all_orders if o.status == "shipping")
    completed_count = sum(1 for o in all_orders if o.status == "completed")
    cancelled_count = sum(1 for o in all_orders if o.status == "cancelled")
    total_revenue = sum(o.total_price for o in all_orders if o.status in ["completed", "confirmed", "shipping"])

    context = {
        "request": request,
        "orders": orders,
        "total_orders": total_orders,
        "pending_count": pending_count,
        "confirmed_count": confirmed_count,
        "shipping_count": shipping_count,
        "completed_count": completed_count,
        "cancelled_count": cancelled_count,
        "total_revenue": total_revenue,
        "current_status": status or "",
        "current_search": search or "",
        "title": "Quản Lý Đơn Hàng — VinhBaPhone Admin"
    }

    return templates.TemplateResponse(
        request=request,
        name="admin/orders.html",
        context=context
    )


@router.post("/orders/{order_id}/status")
@router.post("/orders/{order_id}/update-status")
async def update_order_status_admin(
    order_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Cho phép admin đổi trạng thái đơn hàng (Chờ xử lý -> Đã xác nhận -> Đang giao -> Hoàn tất -> Hủy).
    Hỗ trợ cả Form Submit truyền thống lẫn AJAX fetch.
    """
    # Trích xuất dữ liệu từ JSON hoặc Form data
    new_status = None
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        try:
            body = await request.json()
            new_status = body.get("status")
        except Exception:
            new_status = None
    else:
        form = await request.form()
        new_status = form.get("status")

    if not new_status or new_status.strip().lower() not in VALID_STATUSES:
        raise BadRequestException(
            f"Trạng thái '{new_status}' không hợp lệ. Cho phép: {', '.join(VALID_STATUSES)}"
        )

    clean_status = new_status.strip().lower()

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise NotFoundException(f"Không tìm thấy đơn hàng #{order_id}")

    order.status = clean_status
    db.commit()
    db.refresh(order)

    # Nếu gửi từ AJAX Fetch -> trả JSON
    if "application/json" in content_type or request.headers.get("x-requested-with") == "XMLHttpRequest":
        return JSONResponse(
            content={
                "success": True,
                "message": f"Đã cập nhật trạng thái đơn hàng #{order.id} sang '{clean_status}' thành công!",
                "order_id": order.id,
                "status": order.status
            }
        )

    # Nếu gửi từ Form HTML truyền thống -> redirect lại trang đơn hàng
    return RedirectResponse(url="/admin/orders", status_code=status.HTTP_303_SEE_OTHER)
