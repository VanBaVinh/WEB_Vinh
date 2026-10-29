"""
VinhBaPhone Admin — Products Router
Quản lý sản phẩm & dịch vụ (CRUD) cho cửa hàng VinhBaPhone.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.exceptions import BadRequestException, NotFoundException
from app.dependencies import get_db, require_admin, require_staff_or_admin
from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["Products Management"])


@router.get("/public", response_model=List[ProductResponse])
def list_public_products(
    db: Session = Depends(get_db)
):
    """Danh sách sản phẩm công khai để đồng bộ trực tiếp với giao diện trang chủ."""
    return db.query(Product).filter(Product.is_active == True).order_by(Product.id.asc()).limit(500).all()


@router.post("/sync")
def sync_catalog_from_data_js(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """Đồng bộ hóa lại toàn bộ kho sản phẩm từ js/data.js."""
    from app.database import parse_and_sync_data_js_products
    parse_and_sync_data_js_products(db)
    total = db.query(Product).count()
    return {"success": True, "message": f"Đã đồng bộ thành công {total} sản phẩm chính hãng vào kho!"}


@router.get("", response_model=List[ProductResponse])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(250, ge=1, le=500),
    search: Optional[str] = Query(None, description="Tìm theo tên sản phẩm hoặc thương hiệu"),
    category: Optional[str] = Query(None, description="Lọc theo danh mục (phone, laptop, audio,...)"),
    is_flash_sale: Optional[bool] = Query(None, description="Lọc sản phẩm Flash Sale"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """Danh sách sản phẩm có bộ lọc tìm kiếm và phân trang."""
    query = db.query(Product)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_pattern),
                Product.brand.ilike(search_pattern)
            )
        )
    if category:
        query = query.filter(Product.category == category)
    if is_flash_sale is not None:
        query = query.filter(Product.is_flash_sale == is_flash_sale)

    return query.order_by(Product.id.desc()).offset(skip).limit(limit).all()


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """Thêm mới sản phẩm vào hệ thống."""
    new_product = Product(
        name=product_in.name,
        category=product_in.category,
        brand=product_in.brand,
        price=product_in.price,
        original_price=product_in.original_price or product_in.price,
        stock=product_in.stock,
        image_url=product_in.image_url or "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
        badge=product_in.badge,
        is_flash_sale=product_in.is_flash_sale,
        is_active=product_in.is_active,
        description=product_in.description
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_detail(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """Chi tiết một sản phẩm."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise NotFoundException(f"Không tìm thấy sản phẩm có ID #{product_id}")
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """Cập nhật thông tin, giá bán hoặc tồn kho của sản phẩm."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise NotFoundException(f"Không tìm thấy sản phẩm có ID #{product_id}")

    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """Xóa sản phẩm (Chỉ Admin)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise NotFoundException(f"Không tìm thấy sản phẩm có ID #{product_id}")

    db.delete(product)
    db.commit()
    return {"success": True, "message": f"Đã xóa thành công sản phẩm '{product.name}'"}
