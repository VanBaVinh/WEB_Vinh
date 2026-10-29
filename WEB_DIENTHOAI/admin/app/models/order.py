"""
VinhBaPhone Admin — Order & OrderItem Models
Quản lý dữ liệu đơn hàng và chi tiết sản phẩm khách mua.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Order(Base):
    """Bảng lưu trữ thông tin đơn đặt hàng từ khách hàng."""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=False, index=True)
    customer_address = Column(Text, nullable=False)
    note = Column(Text, nullable=True)
    total_price = Column(Float, nullable=False, default=0.0)
    status = Column(
        String(50),
        default="pending",
        nullable=False,
        index=True
    )  # Trạng thái: "pending", "confirmed", "shipping", "completed", "cancelled"

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

    # Relationships
    user = relationship("User", back_populates="orders", lazy="joined")
    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="joined"
    )

    def __repr__(self):
        return f"<Order id={self.id} customer='{self.customer_name}' total={self.total_price} status='{self.status}'>"


class OrderItem(Base):
    """Bảng lưu trữ từng mục sản phẩm trong đơn hàng."""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Float, nullable=False)  # Giá tại thời điểm mua (Snapshot price)

    # Thông tin tùy chọn biến thể để hiển thị rõ ràng trên dashboard
    color = Column(String(100), nullable=True)
    storage = Column(String(100), nullable=True)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", lazy="joined")

    def __repr__(self):
        return f"<OrderItem id={self.id} order_id={self.order_id} product_id={self.product_id} qty={self.quantity} price={self.price}>"
