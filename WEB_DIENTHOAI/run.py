"""
VinhBaPhone — Root Entry Point
Khởi chạy toàn bộ hệ thống từ thư mục gốc: python run.py
"""
import sys
import os
from pathlib import Path

# Chuyển vào thư mục admin và thực thi run.py
admin_dir = Path(__file__).resolve().parent / "admin"
if str(admin_dir) not in sys.path:
    sys.path.insert(0, str(admin_dir))

os.chdir(admin_dir)

from run import main

if __name__ == "__main__":
    main()
