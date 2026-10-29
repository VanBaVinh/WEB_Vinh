"""
VinhBaPhone Admin — Core Exceptions
Xử lý ngoại lệ chuẩn hóa và định dạng phản hồi lỗi thống nhất.
"""
from typing import Any, Optional
from fastapi import HTTPException, status


class AppException(HTTPException):
    """Lớp ngoại lệ cơ sở cho toàn bộ ứng dụng."""
    def __init__(
        self,
        status_code: int,
        message: str,
        code: str = "ERROR",
        details: Optional[Any] = None
    ):
        super().__init__(
            status_code=status_code,
            detail={
                "success": False,
                "error": {
                    "code": code,
                    "message": message,
                    "details": details
                }
            }
        )


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Xác thực thất bại hoặc phiên đăng nhập đã hết hạn"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=message,
            code="UNAUTHORIZED"
        )


class ForbiddenException(AppException):
    def __init__(self, message: str = "Bạn không có quyền thực hiện thao tác này (Yêu cầu quyền Admin)"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            message=message,
            code="FORBIDDEN"
        )


class NotFoundException(AppException):
    def __init__(self, message: str = "Không tìm thấy tài nguyên yêu cầu"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            message=message,
            code="NOT_FOUND"
        )


class BadRequestException(AppException):
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=message,
            code="BAD_REQUEST",
            details=details
        )
