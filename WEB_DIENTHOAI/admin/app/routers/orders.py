"""
VinhBaPhone — Orders Router (Customer & API)
API đặt hàng cho khách hàng và các endpoints quản lý đơn hàng.
"""
import re
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.exceptions import BadRequestException, NotFoundException
from app.dependencies import get_db, require_staff_or_admin
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate

router = APIRouter(prefix="/api/orders", tags=["Orders & Checkout"])

VALID_STATUSES = ["pending", "confirmed", "shipping", "completed", "cancelled"]

STATUS_LABELS_VI = {
    "pending": "Chờ xác nhận",
    "confirmed": "Đã xác nhận & Đóng gói",
    "shipping": "Đang vận chuyển (Giao nhanh 2H)",
    "completed": "Giao hàng thành công (Đã kích hoạt BH)",
    "cancelled": "Đã hủy đơn hàng",
}

STATUS_STEP_MAP = {
    "pending": 1,
    "confirmed": 2,
    "shipping": 3,
    "completed": 4,
    "cancelled": 0,
}


def extract_payment_method_from_note(note: Optional[str]) -> str:
    if not note:
        return "Thanh toán tiền mặt khi nhận hàng (COD)"
    m = re.search(r"Thanh toán:\s*([^|•]+)", note)
    if m:
        return m.group(1).strip()
    return "Thanh toán tiền mặt khi nhận hàng (COD)"


def serialize_order_detail(order: Order) -> dict:
    items_list = []
    for it in order.items:
        prod = it.product
        unit_price = float(it.price or (prod.price if prod else 0))
        items_list.append({
            "id": it.id,
            "product_id": it.product_id,
            "name": prod.name if prod else f"Sản phẩm công nghệ #{it.product_id or it.id}",
            "image": prod.image_url if prod else None,
            "category": prod.category if prod else "phone",
            "brand": prod.brand if prod else "VinhBaPhone",
            "quantity": it.quantity,
            "price": unit_price,
            "color": it.color,
            "storage": it.storage,
            "subtotal": unit_price * (it.quantity or 1),
        })

    st = (order.status or "pending").lower()
    computed_total = float(order.total_price or 0)
    if computed_total <= 0 and items_list:
        computed_total = sum(x["subtotal"] for x in items_list)

    return {
        "id": order.id,
        "order_code": f"VBP{order.id:06d}",
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone,
        "customer_address": order.customer_address,
        "note": order.note,
        "payment_method": extract_payment_method_from_note(order.note),
        "total_price": computed_total,
        "status": st,
        "status_label": STATUS_LABELS_VI.get(st, st),
        "step_index": STATUS_STEP_MAP.get(st, 1),
        "created_at": order.created_at.strftime("%d/%m/%Y %H:%M") if order.created_at else "",
        "updated_at": order.updated_at.strftime("%d/%m/%Y %H:%M") if order.updated_at else "",
        "items": items_list,
    }


@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db)
):
    """
    Tạo đơn hàng mới từ Store (Khách hàng checkout).
    Tính lại toàn bộ total_price trực tiếp từ cơ sở dữ liệu để bảo mật,
    sau đó lưu Order và OrderItems trong cùng 1 Transaction.
    """
    if not order_in.items:
        raise BadRequestException("Đơn hàng phải chứa ít nhất một sản phẩm.")

    total_price = 0.0
    order_items_to_create = []

    for item_in in order_in.items:
        # Tìm sản phẩm trong DB
        product = db.query(Product).filter(Product.id == item_in.product_id).first()
        if not product:
            raise BadRequestException(
                f"Sản phẩm có mã ID #{item_in.product_id} không tồn tại trên hệ thống."
            )

        # Lấy giá thực tế từ Database
        unit_price = float(product.price)
        subtotal = unit_price * item_in.quantity
        total_price += subtotal

        # Trừ tồn kho nếu sản phẩm còn hàng
        if product.stock is not None and product.stock >= item_in.quantity:
            product.stock -= item_in.quantity

        order_item = OrderItem(
            product_id=product.id,
            quantity=item_in.quantity,
            price=unit_price,
            color=item_in.color,
            storage=item_in.storage
        )
        order_items_to_create.append(order_item)

    # Tổng hợp ghi chú và phương thức thanh toán
    note_content = order_in.note.strip() if order_in.note else ""
    if hasattr(order_in, "payment_method") and order_in.payment_method:
        pm_str = f"Thanh toán: {order_in.payment_method.strip()}"
        if pm_str not in note_content:
            note_content = f"{note_content} | {pm_str}".strip(" |")

    # Khởi tạo bản ghi Order
    new_order = Order(
        user_id=order_in.user_id,
        customer_name=order_in.customer_name.strip(),
        customer_phone=order_in.customer_phone.strip(),
        customer_address=order_in.customer_address.strip(),
        note=note_content if note_content else None,
        total_price=total_price,
        status="pending"
    )

    # Gán các items vào order
    new_order.items = order_items_to_create

    # Lưu trong 1 Transaction
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return {
        "success": True,
        "message": "Đặt hàng thành công! VinhBaPhone sẽ sớm liên hệ xác nhận đơn hàng với bạn.",
        "order_id": new_order.id,
        "order_code": f"VBP{new_order.id:06d}",
        "customer_name": new_order.customer_name,
        "customer_phone": new_order.customer_phone,
        "total_price": new_order.total_price,
        "status": new_order.status,
        "created_at": new_order.created_at.strftime("%d/%m/%Y %H:%M") if new_order.created_at else ""
    }


@router.get("", response_model=List[OrderResponse])
def list_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None, description="Tìm theo tên hoặc số điện thoại"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """Lấy danh sách đơn hàng cho Admin/Staff."""
    query = db.query(Order)

    if status_filter and status_filter in VALID_STATUSES:
        query = query.filter(Order.status == status_filter)

    if search:
        raw_s = search.strip()
        search_pattern = f"%{raw_s}%"
        code_match = re.match(r"^(?:VBP|CPS|DH|#)?0*(\d+)$", raw_s, re.IGNORECASE)
        if code_match and len(raw_s) <= 9 and not raw_s.startswith("0"):
            oid = int(code_match.group(1))
            query = query.filter(
                or_(
                    Order.id == oid,
                    Order.customer_name.ilike(search_pattern),
                    Order.customer_phone.ilike(search_pattern),
                    Order.customer_address.ilike(search_pattern),
                )
            )
        elif re.match(r"^(?:VBP|CPS|DH|#)\d+$", raw_s, re.IGNORECASE):
            oid = int(re.sub(r"\D", "", raw_s) or "0")
            query = query.filter(Order.id == oid)
        else:
            query = query.filter(
                or_(
                    Order.customer_name.ilike(search_pattern),
                    Order.customer_phone.ilike(search_pattern),
                    Order.customer_address.ilike(search_pattern),
                )
            )

    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

    # Enrich product names and images for response
    result = []
    for o in orders:
        items_res = []
        for it in o.items:
            items_res.append({
                "id": it.id,
                "order_id": it.order_id,
                "product_id": it.product_id,
                "quantity": it.quantity,
                "price": it.price,
                "color": it.color,
                "storage": it.storage,
                "product_name": it.product.name if it.product else f"Sản phẩm #{it.product_id}",
                "product_image": it.product.image_url if it.product else None
            })
        result.append({
            "id": o.id,
            "user_id": o.user_id,
            "customer_name": o.customer_name,
            "customer_phone": o.customer_phone,
            "customer_address": o.customer_address,
            "note": o.note,
            "total_price": o.total_price,
            "status": o.status,
            "created_at": o.created_at,
            "updated_at": o.updated_at,
            "items": items_res
        })

    return result


def _find_orders_by_query(q: str, db: Session) -> List[Order]:
    """Tìm kiếm danh sách đơn hàng theo Mã đơn (VBP000001 / #1 / 1), Số điện thoại hoặc Tên khách hàng."""
    clean = (q or "").strip()
    if not clean:
        return []

    compact = re.sub(r"[\s\-\.]", "", clean)
    # 1. Nếu có tiền tố mã đơn VBP / CPS / DH / #
    prefix_match = re.match(r"^(?:VBP|CPS|DH|#)+0*(\d+)$", compact, re.IGNORECASE)
    if prefix_match:
        oid = int(prefix_match.group(1))
        found = db.query(Order).filter(Order.id == oid).all()
        if found:
            return found

    # 2. Nếu là số điện thoại (bắt đầu bằng 0 hoặc +84, từ 8-12 chữ số)
    phone_norm = compact
    if phone_norm.startswith("+84"):
        phone_norm = "0" + phone_norm[3:]
    elif phone_norm.startswith("84") and len(phone_norm) == 11:
        phone_norm = "0" + phone_norm[2:]

    if re.match(r"^0\d{7,11}$", phone_norm):
        orders = (
            db.query(Order)
            .filter(
                or_(
                    Order.customer_phone == phone_norm,
                    Order.customer_phone == compact,
                    Order.customer_phone.ilike(f"%{phone_norm}%"),
                )
            )
            .order_by(Order.created_at.desc())
            .all()
        )
        if orders:
            return orders

    # 3. Nếu là số nguyên ngắn (ID đơn hàng: 1, 2, 3...)
    if compact.isdigit() and len(compact) <= 7:
        oid = int(compact)
        found = db.query(Order).filter(Order.id == oid).all()
        if found:
            return found

    # 4. Tìm theo tên khách hàng hoặc SĐT gần đúng
    pattern = f"%{clean}%"
    return (
        db.query(Order)
        .filter(
            or_(
                Order.customer_phone.ilike(pattern),
                Order.customer_name.ilike(pattern),
            )
        )
        .order_by(Order.created_at.desc())
        .limit(20)
        .all()
    )


@router.get("/track")
def track_orders_public(
    q: str = Query("", description="Mã đơn hàng (VD: VBP000001), Số điện thoại hoặc Tên khách hàng"),
    db: Session = Depends(get_db)
):
    """
    Endpoint công khai cho khách hàng tra cứu đơn hàng theo:
    - Mã đơn hàng: VBP000001, #1, 1
    - Số điện thoại: 0363620913, 0987654321...
    - Họ tên người nhận: Văn Bá Vinh...
    """
    clean_q = (q or "").strip()
    if not clean_q:
        raise BadRequestException("Vui lòng nhập Số điện thoại hoặc Mã đơn hàng để tra cứu.")

    matched_orders = _find_orders_by_query(clean_q, db)
    serialized = [serialize_order_detail(o) for o in matched_orders]

    return {
        "success": len(serialized) > 0,
        "query": clean_q,
        "count": len(serialized),
        "orders": serialized,
        "order": serialized[0] if serialized else None,
    }


@router.get("/{order_key}")
def get_order_detail(
    order_key: str,
    db: Session = Depends(get_db)
):
    """Xem chi tiết đơn hàng (hỗ trợ cả ID số nguyên, mã VBP000001 lẫn số điện thoại)."""
    clean_key = (order_key or "").strip()
    order = None

    if clean_key.isdigit():
        order = db.query(Order).filter(Order.id == int(clean_key)).first()

    if not order:
        matched = _find_orders_by_query(clean_key, db)
        if matched:
            order = matched[0]

    if not order:
        raise NotFoundException(f"Không tìm thấy đơn hàng khớp với '{order_key}'")

    detail = serialize_order_detail(order)
    detail["success"] = True
    detail["all_orders"] = [serialize_order_detail(o) for o in _find_orders_by_query(clean_key, db)]
    return detail


@router.post("/{order_id}/status")
@router.post("/{order_id}/update-status")
@router.patch("/{order_id}/status")
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """Cập nhật trạng thái đơn hàng (Chờ xử lý -> Đã xác nhận -> Đang giao -> Hoàn tất -> Hủy)."""
    new_status = status_update.status.strip().lower()
    if new_status not in VALID_STATUSES:
        raise BadRequestException(
            f"Trạng thái không hợp lệ. Các trạng thái hợp lệ là: {', '.join(VALID_STATUSES)}"
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise NotFoundException(f"Không tìm thấy đơn hàng #{order_id}")

    order.status = new_status
    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "message": f"Đã cập nhật trạng thái đơn #{order.id} sang '{new_status}'",
        "order_id": order.id,
        "status": order.status
    }
