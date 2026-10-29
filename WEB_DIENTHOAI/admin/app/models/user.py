"""
VinhBaPhone Admin — User Model
Quản lý tài khoản người dùng và phân quyền (RBAC).
"""
from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    """Bảng lưu trữ thông tin tài khoản người dùng và quyền truy cập."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user", nullable=False)  # 'admin', 'staff', 'user'
    is_active = Column(Boolean, default=True, nullable=False)
    avatar_url = Column(String(255), nullable=True)

    # Relationship với đơn hàng
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")

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
        return f"<User id={self.id} username='{self.username}' role='{self.role}'>"
