@echo off
chcp 65001 >nul
title Khởi Động VinhBaPhone Website & Admin

echo ======================================================================
echo          🚀 VINHBAPHONE — WEB STORE & ADMIN DASHBOARD
echo ======================================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [!] LỖI: Không tìm thấy Python trên máy tính của bạn!
    echo [!] Vui lòng tải và cài đặt Python từ: https://www.python.org/downloads/
    echo [!] Chú ý nhớ tích vào ô "Add python.exe to PATH" khi cài đặt.
    echo.
    pause
    exit /b 1
)

echo [*] Kiểm tra và cài đặt thư viện cần thiết...
python -m pip install -r requirements.txt

echo.
echo [*] Đang khởi động Server tại http://localhost:8000 ...
echo.

python run.py

if %ERRORLEVEL% neq 0 (
    echo.
    echo [!] Server đã dừng hoặc gặp sự cố.
    pause
)
