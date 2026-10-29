"""
VinhBaPhone Admin — Users Router
Quản lý người dùng (CRUD) — Yêu cầu quyền Admin tối cao.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.exceptions import BadRequestException, NotFoundException
from app.core.security import get_password_hash
from app.dependencies import get_db, require_admin
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate

router = APIRouter(prefix="/api/users", tags=["Users Management"])


@router.get("", response_model=List[UserResponse])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None, description="Tìm theo username, email hoặc tên"),
    role: Optional[str] = Query(None, description="Lọc theo role (admin, staff, user)"),
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """Danh sách người dùng có phân trang và bộ lọc tìm kiếm (Chỉ Admin)."""
    query = db.query(User)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.username.ilike(search_pattern),
                User.email.ilike(search_pattern),
                User.full_name.ilike(search_pattern)
            )
        )
    if role:
        query = query.filter(User.role == role)

    return query.order_by(User.id.desc()).offset(skip).limit(limit).all()


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """Tạo người dùng mới (Chỉ Admin)."""
    # Kiểm tra trùng username
    if db.query(User).filter(User.username == user_in.username).first():
        raise BadRequestException(f"Tên đăng nhập '{user_in.username}' đã tồn tại")

    # Kiểm tra trùng email
    if db.query(User).filter(User.email == user_in.email).first():
        raise BadRequestException(f"Email '{user_in.email}' đã được sử dụng")

    new_user = User(
        username=user_in.username,
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        is_active=user_in.is_active,
        avatar_url=user_in.avatar_url
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """Xem chi tiết một người dùng."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException(f"Không tìm thấy người dùng có ID #{user_id}")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """Cập nhật thông tin hoặc đổi mật khẩu người dùng (Chỉ Admin)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException(f"Không tìm thấy người dùng có ID #{user_id}")

    # Kiểm tra email trùng với người dùng khác
    if user_in.email and user_in.email != user.email:
        existing = db.query(User).filter(User.email == user_in.email).first()
        if existing:
            raise BadRequestException(f"Email '{user_in.email}' đã thuộc về tài khoản khác")
        user.email = user_in.email

    if user_in.full_name is not None:
        user.full_name = user_in.full_name
    if user_in.role is not None:
        # Không cho phép tự hạ quyền của chính mình nếu là admin duy nhất
        if user.id == admin_user.id and user_in.role != "admin":
            raise BadRequestException("Bạn không thể tự hạ quyền Admin của chính mình")
        user.role = user_in.role
    if user_in.is_active is not None:
        if user.id == admin_user.id and not user_in.is_active:
            raise BadRequestException("Bạn không thể tự khóa tài khoản của chính mình")
        user.is_active = user_in.is_active
    if user_in.avatar_url is not None:
        user.avatar_url = user_in.avatar_url
    if user_in.password:
        user.hashed_password = get_password_hash(user_in.password)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """Xóa người dùng (Không thể tự xóa chính mình)."""
    if user_id == admin_user.id:
        raise BadRequestException("Không thể tự xóa tài khoản quản trị đang đăng nhập")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException(f"Không tìm thấy người dùng có ID #{user_id}")

    db.delete(user)
    db.commit()
    return {"success": True, "message": f"Đã xóa thành công người dùng '{user.username}'"}
