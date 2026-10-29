"""
VinhBaPhone Admin — Database Engine & Session
SQLite + SQLAlchemy setup với tính năng tự động tạo bảng (migration/create_all)
và seed tài khoản admin, danh mục sản phẩm cùng các đơn hàng mẫu khi khởi động.
"""
from datetime import datetime, timezone
import json
import re
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

# ── Engine ──
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},  # Cho phép đa luồng trên SQLite
    echo=False,
)


# Bật WAL mode cho SQLite — tăng hiệu suất đọc ghi đồng thời
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


# ── Session Factory ──
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ── Declarative Base ──
Base = declarative_base()


def parse_and_sync_data_js_products(db):
    """
    Đọc file js/data.js và đồng bộ các ID sản phẩm vào bảng Product
    để đảm bảo mọi đơn hàng đặt từ client đều có product_id hợp lệ trong DB,
    đồng thời chuẩn hóa 100% đường dẫn hình ảnh thực tế khớp với model sản phẩm.
    """
    from app.models.product import Product

    data_js_path = settings.ROOT_DIR / "js" / "data.js"
    if not data_js_path.exists():
        return

    try:
        # Dọn dẹp các dòng dữ liệu lỗi/mẫu cũ (Sản phẩm #1..#4 hoặc ID 1..5 dùng ảnh Unsplash không khớp)
        from sqlalchemy import or_
        corrupt_rows = db.query(Product).filter(
            or_(
                Product.id.in_([1, 2, 3, 4, 5]),
                Product.name.like("Sản phẩm #%"),
                Product.image_url.like("%images.unsplash.com%")
            )
        ).all()
        for cr in corrupt_rows:
            db.delete(cr)
        if corrupt_rows:
            db.commit()

        content = data_js_path.read_text(encoding="utf-8")
        # Trích xuất mảng products trong js/data.js
        start = content.find("products: [")
        if start != -1:
            count = 0
            end = -1
            for i in range(start + len("products:"), len(content)):
                if content[i] == "[":
                    count += 1
                elif content[i] == "]":
                    count -= 1
                    if count == 0:
                        end = i + 1
                        break
            if end != -1:
                products_data = json.loads(content[start + len("products:"):end].strip())
                for p in products_data:
                    p_id = p.get("id")
                    p_name = p.get("name", f"Sản phẩm #{p_id}")
                    p_cat = p.get("category", "phone")
                    p_brand = p.get("brand", "Khác")
                    p_price = float(p.get("price", 0))
                    p_orig = float(p.get("originalPrice", p_price * 1.1))
                    img_url = p.get("image", "")
                    is_flash = bool(p.get("isFlashSale", False))
                    p_stock = int(p.get("totalStock", 35))
                    p_promo = p.get("promoText", "")
                    specs = p.get("specs", {})
                    specs_parts = [f"{k}: {v}" for k, v in specs.items()]
                    desc = " • ".join(specs_parts)
                    if p_promo:
                        desc = f"{desc} | {p_promo}" if desc else p_promo
                    existing = db.query(Product).filter(Product.id == p_id).first()
                    if existing:
                        existing.name = p_name
                        existing.category = p_cat
                        existing.brand = p_brand
                        existing.price = p_price
                        existing.original_price = p_orig
                        if img_url:
                            existing.image_url = img_url
                        if desc:
                            existing.description = desc
                        existing.is_flash_sale = is_flash
                    else:
                        new_p = Product(
                            id=p_id,
                            name=p_name,
                            category=p_cat,
                            brand=p_brand,
                            price=p_price,
                            original_price=p_orig,
                            stock=p_stock,
                            image_url=img_url,
                            is_flash_sale=is_flash,
                            is_active=True,
                            description=desc,
                            badge="HOT DEAL" if is_flash else "CHÍNH HÃNG"
                        )
                        db.add(new_p)
                db.commit()
    except Exception as e:
        print(f"[!] Ghi chú đồng bộ catalog từ data.js: {e}")
        db.rollback()


def init_db():
    """Tạo bảng và khởi tạo dữ liệu mặc định (Admin + Dữ liệu mẫu)."""
    # Import để metadata nhận diện tất cả models
    from app.core.security import get_password_hash
    from app.models.product import Product
    from app.models.user import User
    from app.models.order import Order, OrderItem

    # Tự động tạo tất cả các bảng nếu chưa có (users, products, orders, order_items)
    Base.metadata.create_all(bind=engine)

    # Khởi tạo session để kiểm tra và seed dữ liệu ban đầu
    db = SessionLocal()
    try:
        # 1. Seed tài khoản Admin mặc định nếu chưa tồn tại
        admin_user = db.query(User).filter(User.username == settings.DEFAULT_ADMIN_USERNAME).first()
        if not admin_user:
            admin_user = User(
                username=settings.DEFAULT_ADMIN_USERNAME,
                email=settings.DEFAULT_ADMIN_EMAIL,
                full_name=settings.DEFAULT_ADMIN_FULLNAME,
                hashed_password=get_password_hash(settings.DEFAULT_ADMIN_PASSWORD),
                role="admin",
                is_active=True,
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            )
            db.add(admin_user)
            db.commit()

        # 2. Seed vài sản phẩm mẫu ban đầu nếu bảng còn trống
        product_count = db.query(Product).count()
        if product_count == 0:
            sample_products = [
                Product(
                    id=101,
                    name="iPhone 16 Pro Max 256GB - Titan Tự Nhiên",
                    category="phone",
                    brand="Apple",
                    price=33490000,
                    original_price=34990000,
                    stock=45,
                    image_url="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
                    badge="HOT SALE",
                    is_flash_sale=True,
                    is_active=True,
                    description="Chip A18 Pro mạnh mẽ, camera 48MP zoom quang 5x, khung viền titan siêu nhẹ."
                ),
                Product(
                    id=102,
                    name="Samsung Galaxy S24 Ultra 12GB 256GB",
                    category="phone",
                    brand="Samsung",
                    price=25490000,
                    original_price=31990000,
                    stock=38,
                    image_url="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png",
                    badge="MỚI RA MẮT",
                    is_flash_sale=True,
                    is_active=True,
                    description="Quyền năng Galaxy AI đỉnh cao, bút S-Pen tích hợp, camera 200MP zoom 100x."
                ),
                Product(
                    id=103,
                    name="MacBook Air M3 13.6 inch 8-Core CPU 8GB/256GB",
                    category="laptop",
                    brand="Apple",
                    price=24790000,
                    original_price=27990000,
                    stock=22,
                    image_url="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m3-13-inch-2024_1__3.png",
                    badge="BÁN CHẠY",
                    is_flash_sale=False,
                    is_active=True,
                    description="Apple M3 đột phá, thời lượng pin 18 giờ, màn hình Liquid Retina tuyệt đẹp."
                ),
                Product(
                    id=104,
                    name="Tai nghe Bluetooth Sony WH-1000XM5 Chống Ồn",
                    category="audio",
                    brand="Sony",
                    price=6490000,
                    original_price=8490000,
                    stock=30,
                    image_url="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/0/4/04_6_3.png",
                    badge="GIẢM 24%",
                    is_flash_sale=True,
                    is_active=True,
                    description="Chống ồn chủ động hàng đầu, âm thanh Hi-Res Audio, thời lượng pin 30 giờ."
                ),
                Product(
                    id=105,
                    name="Apple Watch Ultra 2 GPS + Cellular 49mm",
                    category="watch",
                    brand="Apple",
                    price=19690000,
                    original_price=21990000,
                    stock=15,
                    image_url="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-watch-ultra-2-49mm-vien-titan-day-alpine-loop-xanh-duong_1_.png",
                    badge="PREMIUM",
                    is_flash_sale=False,
                    is_active=True,
                    description="Thiết kế vỏ titan siêu bền, độ sáng màn hình 3000 nits, định vị GPS kép."
                )
            ]
            db.add_all(sample_products)
            db.commit()

        # 3. Đồng bộ bổ sung các sản phẩm từ data.js nếu có
        parse_and_sync_data_js_products(db)

        # 4. ZERO FAKE DATA POLICY: Xóa bỏ các đơn hàng mẫu thử nghiệm cũ nếu có
        # Chỉ giữ lại các đơn hàng thực tế do khách hàng đặt từ giao diện
        fake_phones = ["0987654321", "0912345678", "0908765432"]
        fake_orders = db.query(Order).filter(Order.customer_phone.in_(fake_phones)).all()
        for fo in fake_orders:
            db.delete(fo)
        if fake_orders:
            db.commit()

    finally:
        db.close()
