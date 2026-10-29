"""
VinhBaPhone Admin — Stats Router
API cung cấp các chỉ số tổng quan cho Dashboard và giám sát hệ thống.
"""
import os
import platform
import sys
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.dependencies import get_db, require_staff_or_admin
from app.models.product import Product
from app.models.user import User
from app.models.order import Order, OrderItem

router = APIRouter(prefix="/api/stats", tags=["Dashboard Statistics"])


@router.get("")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """Lấy tổng hợp chỉ số người dùng, kho hàng, và tài nguyên máy chủ."""
    # ── Chỉ số Người dùng ──
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    admin_count = db.query(User).filter(User.role == "admin").count()
    staff_count = db.query(User).filter(User.role == "staff").count()

    # ── Chỉ số Sản phẩm / Kho hàng ──
    total_products = db.query(Product).count()
    flash_sale_count = db.query(Product).filter(Product.is_flash_sale == True).count()
    low_stock_count = db.query(Product).filter(Product.stock <= 5).count()

    from sqlalchemy import func
    cat_rows = db.query(Product.category, func.count(Product.id)).group_by(Product.category).all()
    category_counts = {cat or "other": cnt for cat, cnt in cat_rows}

    # ── Chỉ số Đơn hàng & Doanh thu (Động 100% từ Database) ──
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    completed_orders = db.query(Order).filter(Order.status == "completed").count()
    rev_val = db.query(func.sum(Order.total_price)).filter(Order.status.in_(["completed", "confirmed", "shipping"])).scalar()
    total_revenue = float(rev_val or 0.0)

    # ── Trạng thái Máy chủ & Hệ thống ──
    server_stats = {
        "status": "ONLINE",
        "platform": platform.platform(),
        "python_version": sys.version.split()[0],
        "database_type": "SQLite (WAL Mode)",
        "server_time": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    }

    # Đọc thông số CPU / RAM nếu psutil có sẵn
    try:
        import psutil
        server_stats.update({
            "cpu_percent": f"{psutil.cpu_percent(interval=None)}%",
            "ram_percent": f"{psutil.virtual_memory().percent}%",
            "ram_used_mb": round(psutil.virtual_memory().used / (1024 * 1024), 1),
            "ram_total_mb": round(psutil.virtual_memory().total / (1024 * 1024), 1)
        })
    except Exception:
        server_stats.update({
            "cpu_percent": "N/A",
            "ram_percent": "N/A",
            "ram_used_mb": 0,
            "ram_total_mb": 0
        })

    # Kích thước file database SQLite
    db_file_path = settings.BASE_DIR / "admin.db"
    if db_file_path.exists():
        size_kb = round(os.path.getsize(db_file_path) / 1024, 2)
        server_stats["db_size"] = f"{size_kb} KB"
    else:
        server_stats["db_size"] = "Chưa khởi tạo"

    # ── Hoạt động gần đây ──
    recent_users = [
        {
            "id": u.id,
            "username": u.username,
            "role": u.role,
            "created_at": u.created_at.strftime("%d/%m/%Y %H:%M") if u.created_at else ""
        }
        for u in db.query(User).order_by(User.id.desc()).limit(5).all()
    ]

    recent_products = [
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "price": p.price,
            "stock": p.stock,
            "is_flash_sale": p.is_flash_sale
        }
        for p in db.query(Product).order_by(Product.id.desc()).limit(5).all()
    ]

    recent_orders = [
        {
            "id": o.id,
            "customer_name": o.customer_name,
            "customer_phone": o.customer_phone,
            "total_price": o.total_price,
            "status": o.status,
            "items_count": len(o.items),
            "created_at": o.created_at.strftime("%d/%m/%Y %H:%M") if o.created_at else ""
        }
        for o in db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    ]

    return {
        "success": True,
        "metrics": {
            "total_users": total_users,
            "active_users": active_users,
            "admin_count": admin_count,
            "staff_count": staff_count,
            "total_products": total_products,
            "flash_sale_count": flash_sale_count,
            "low_stock_count": low_stock_count,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "completed_orders": completed_orders,
            "total_revenue": total_revenue,
        },
        "server": server_stats,
        "category_counts": category_counts,
        "recent_users": recent_users,
        "recent_products": recent_products,
        "recent_orders": recent_orders
    }
