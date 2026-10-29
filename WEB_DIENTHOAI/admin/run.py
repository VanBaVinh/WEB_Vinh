"""
VinhBaPhone — Application Entry Point
Khởi chạy: python run.py
Tự động kiểm tra thư viện còn thiếu, cài đặt nếu cần và khởi động máy chủ.
"""
import sys
import os
import subprocess
from pathlib import Path

# Đảm bảo thư mục admin luôn nằm đầu tiên trong sys.path
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))


def check_and_install_dependencies():
    """Tự động kiểm tra và cài đặt thư viện cần thiết nếu người dùng chưa cài."""
    required_packages = [
        ("fastapi", "fastapi"),
        ("uvicorn", "uvicorn"),
        ("sqlalchemy", "sqlalchemy"),
        ("pydantic", "pydantic"),
        ("jose", "python-jose[cryptography]"),
        ("passlib", "passlib[bcrypt]"),
        ("bcrypt", "bcrypt==4.0.1"),
        ("multipart", "python-multipart"),
        ("jinja2", "jinja2"),
    ]

    missing = []
    for module_name, pip_name in required_packages:
        try:
            __import__(module_name)
        except ImportError:
            missing.append(pip_name)

    if missing:
        print("=" * 60)
        print(f"[*] Phát hiện chưa cài đặt một số thư viện: {len(missing)} gói.")
        print("[*] Đang tự động tải và cài đặt qua pip...")
        print("=" * 60)
        req_file = CURRENT_DIR / "requirements.txt"
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "-r", str(req_file)
            ])
            print("[+] Đã cài đặt xong tất cả thư viện cần thiết!")
        except Exception as e:
            print(f"[!] Cảnh báo: Không thể tự động chạy pip ({e}).")
            print(f"[!] Vui lòng tự chạy lệnh: pip install -r {req_file}")


def main():
    try:
        check_and_install_dependencies()
        import uvicorn

        print("=" * 65)
        print("  🎉 VINHBAPHONE — STORE & ADMIN PORTAL ĐANG KHỞI CHẠY!")
        print("=" * 65)
        print("  👉 Website Cửa Hàng:       http://localhost:8000")
        print("  👉 Đăng Nhập Quản Trị:     http://localhost:8000/login")
        print("  👉 Bảng Điều Khiển:        http://localhost:8000/admin")
        print("  👉 Quản Lý Đơn Hàng (Mới): http://localhost:8000/admin/orders")
        print("  👉 Tài Liệu API Swagger:   http://localhost:8000/docs")
        print("=" * 65)
        print("  Tài khoản Admin mặc định: admin  /  Mật khẩu: Admin@2024")
        print("=" * 65)

        # Mở trình duyệt sau khi chạy
        try:
            import webbrowser
            webbrowser.open("http://localhost:8000")
        except Exception:
            pass

        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as exc:
        print("\n" + "!" * 65)
        print(f"[!] Đã xảy ra lỗi khi khởi động máy chủ:")
        print(f"    {exc}")
        print("!" * 65)
        input("\nNhấn phím Enter để đóng cửa sổ...")


if __name__ == "__main__":
    main()
