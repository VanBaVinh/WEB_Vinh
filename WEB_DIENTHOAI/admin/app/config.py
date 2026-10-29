"""
VinhBaPhone Admin — Application Configuration
Quản lý tập trung tất cả settings, bảo mật và kết nối cơ sở dữ liệu.
"""
import os
from pathlib import Path


class Settings:
    """Central configuration class."""

    # ── Paths ──
    APP_DIR: Path = Path(__file__).resolve().parent
    BASE_DIR: Path = APP_DIR.parent
    ROOT_DIR: Path = BASE_DIR.parent  # Thư mục gốc website (chứa index.html, css, js)
    TEMPLATES_DIR: Path = APP_DIR / "templates"
    STATIC_DIR: Path = APP_DIR / "static"
    DATABASE_URL: str = os.getenv("ADMIN_DATABASE_URL", f"sqlite:///{(BASE_DIR / 'admin.db').as_posix()}")

    # ── JWT Security ──
    SECRET_KEY: str = os.getenv(
        "ADMIN_SECRET_KEY",
        "vinhbaphone_super_secret_jwt_key_2026_antigravity_secure_token"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 giờ

    # ── App Info ──
    APP_TITLE: str = "VinhBaPhone Store & Admin Portal"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # ── CORS ──
    CORS_ORIGINS: list = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "*"
    ]

    # ── Default Admin Account ──
    DEFAULT_ADMIN_USERNAME: str = "admin"
    DEFAULT_ADMIN_EMAIL: str = "admin@vinhbaphone.vn"
    DEFAULT_ADMIN_PASSWORD: str = "Admin@2024"
    DEFAULT_ADMIN_FULLNAME: str = "Quản Trị Viên Tối Cao"


settings = Settings()
