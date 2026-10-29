from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.products import router as products_router
from app.routers.stats import router as stats_router
from app.routers.orders import router as orders_router
from app.routers.admin import router as admin_router
from app.routers.chat import router as chat_router

__all__ = [
    "auth_router",
    "users_router",
    "products_router",
    "stats_router",
    "orders_router",
    "admin_router",
    "chat_router",
]
