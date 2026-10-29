"""
VinhBaPhone Admin — Product Model
Quản lý dữ liệu sản phẩm, danh mục, giá bán và kho hàng.
"""
from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from app.database import Base


class Product(Base):
    """Bảng sản phẩm của hệ thống cửa hàng VinhBaPhone."""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), index=True, nullable=False)
    category = Column(String(50), index=True, nullable=False)  # 'phone', 'laptop', 'tablet', 'audio', 'watch', ...
    brand = Column(String(50), index=True, nullable=False)     # 'Apple', 'Samsung', 'Sony', ...
    price = Column(Float, nullable=False)                      # Giá khuyến mãi / giá bán
    original_price = Column(Float, nullable=True)              # Giá niêm yết ban đầu
    stock = Column(Integer, default=10, nullable=False)        # Số lượng tồn kho
    image_url = Column(String(500), nullable=True)             # Link ảnh đại diện sản phẩm
    badge = Column(String(100), nullable=True)                 # Nhãn hiển thị ('Hot', 'Mới ra mắt', 'Sale sốc')
    is_flash_sale = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    description = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def __repr__(self):
        return f"<Product id={self.id} name='{self.name}' price={self.price}>"
