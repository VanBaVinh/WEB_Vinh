"""
VinhBaPhone Admin — FastAPI Main Application
Điểm hội tụ cấu hình, định tuyến API, Middleware và phục vụ giao diện Store & Dashboard.
"""
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.config import settings
from app.database import init_db
from app.dependencies import get_db
from app.schemas.order import OrderCreate
from app.routers.orders import create_order
from app.routers import (
    auth_router,
    products_router,
    stats_router,
    users_router,
    orders_router,
    admin_router,
    chat_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Quản lý vòng đời ứng dụng: Khởi tạo DB và seed dữ liệu khi khởi động."""
    init_db()
    yield


app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description="Hệ thống bán hàng và quản trị tập trung chuyên nghiệp cho VinhBaPhone",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# ── Middleware: CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount Static Files ──
settings.STATIC_DIR.mkdir(parents=True, exist_ok=True)
settings.TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(settings.STATIC_DIR)), name="static")

# Mount CSS & JS của website chính
css_dir = settings.ROOT_DIR / "css"
js_dir = settings.ROOT_DIR / "js"
if css_dir.exists():
    app.mount("/css", StaticFiles(directory=str(css_dir)), name="css")
if js_dir.exists():
    app.mount("/js", StaticFiles(directory=str(js_dir)), name="js")


# ── Centralized Exception Handlers ──
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Chuẩn hóa mọi lỗi HTTP trả về định dạng JSON nhất quán."""
    detail = exc.detail
    if isinstance(detail, dict):
        return JSONResponse(status_code=exc.status_code, content=detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": "HTTP_ERROR",
                "message": str(detail)
            }
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Xử lý lỗi validate dữ liệu đầu vào của Pydantic."""
    errors = []
    for err in exc.errors():
        loc = " -> ".join([str(x) for x in err.get("loc", [])])
        errors.append(f"{loc}: {err.get('msg')}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Dữ liệu đầu vào không hợp lệ",
                "details": errors
            }
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Bắt các lỗi ngoại lệ không lường trước để tránh sập server."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": f"Đã xảy ra lỗi máy chủ nội bộ: {str(exc)}"
            }
        }
    )


# ── Đăng ký API Routers ──
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(products_router)
app.include_router(stats_router)
app.include_router(orders_router)
app.include_router(admin_router)
app.include_router(chat_router)


# ── HTML Views Routing ──

# 1. Trang chủ Website VinhBaPhone (Store)
@app.get("/", include_in_schema=False)
@app.get("/index.html", include_in_schema=False)
async def serve_store():
    """Phục vụ trang chủ cửa hàng bán lẻ VinhBaPhone."""
    store_file = settings.ROOT_DIR / "index.html"
    if store_file.exists():
        return FileResponse(store_file)
    return JSONResponse({"message": "VinhBaPhone store index.html not found"})


# 1b. Direct Checkout Endpoint
@app.post("/checkout", status_code=status.HTTP_201_CREATED, tags=["Orders & Checkout"])
def direct_checkout(
    order_in: OrderCreate,
    db: Session = Depends(get_db)
):
    """Alias tạo đơn hàng trực tiếp qua /checkout."""
    return create_order(order_in=order_in, db=db)


# 2. Trang Quản Trị (Admin Dashboard)
@app.get("/admin", include_in_schema=False)
@app.get("/admin/dashboard.html", include_in_schema=False)
async def serve_dashboard():
    """Phục vụ trang chủ Admin Dashboard."""
    dashboard_file = settings.TEMPLATES_DIR / "dashboard.html"
    if dashboard_file.exists():
        return FileResponse(dashboard_file)
    return JSONResponse({"message": "Dashboard UI is loading..."})


# 3. Trang Đăng Nhập Quản Trị (Login SaaS UI)
@app.get("/login", include_in_schema=False)
@app.get("/login.html", include_in_schema=False)
@app.get("/admin/login", include_in_schema=False)
@app.get("/admin/login.html", include_in_schema=False)
async def serve_login():
    """Phục vụ giao diện đăng nhập."""
    login_file = settings.TEMPLATES_DIR / "login.html"
    if login_file.exists():
        return FileResponse(login_file)
    return JSONResponse({"message": "Login UI is loading..."})


# 4. Health Check
@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint cho Docker / Reverse Proxy."""
    return {"status": "healthy", "app": settings.APP_TITLE, "version": settings.APP_VERSION}
