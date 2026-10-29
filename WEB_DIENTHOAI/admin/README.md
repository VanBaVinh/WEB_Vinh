# VinhBaPhone — Admin Panel & Dashboard

Hệ thống quản trị tập trung (Admin Dashboard) chuyên nghiệp được xây dựng bằng **FastAPI**, **SQLite (SQLAlchemy v2.0)** và **Tailwind CSS + Glassmorphism**.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt thư viện cần thiết
Mở terminal tại thư mục `admin`:
```bash
pip install -r requirements.txt
```

### 2. Khởi chạy Server
```bash
python run.py
```
> Server sẽ chạy tại địa chỉ: `http://localhost:8000` (hỗ trợ Auto-reload khi sửa code).

---

## 🔑 Thông Tin Đăng Nhập Mặc Định

Hệ thống tự động khởi tạo cơ sở dữ liệu SQLite (`admin.db`) và tạo sẵn tài khoản quản trị tối cao ngay khi khởi động lần đầu:

| Thông tin | Giá trị |
| :--- | :--- |
| **URL Đăng nhập** | [http://localhost:8000/admin/login](http://localhost:8000/admin/login) |
| **Username** | `admin` |
| **Password** | `Admin@2024` |
| **Quyền hạn (Role)** | `admin` |

*(Trên trang đăng nhập có sẵn nút **"Điền nhanh"** để đăng nhập bằng 1 click).*

---

## 📌 Các Đường Dẫn Chính

- **Dashboard Quản Trị**: [http://localhost:8000/admin](http://localhost:8000/admin)
- **Tài liệu API Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Tài liệu ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check Endpoint**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🛡️ Kiến Trúc & Tính Năng Nổi Bật

1. **Authentication & Authorization (RBAC)**:
   - Mã hóa mật khẩu bằng **Passlib (Bcrypt)** với salt an toàn.
   - Quản lý phiên bằng **JSON Web Token (JWT HS256)** có thời hạn 24 giờ.
   - Hỗ trợ phân quyền chặt chẽ (`admin`, `staff`, `user`) qua **FastAPI Dependency Injection**.

2. **Cơ sở dữ liệu SQLite tối ưu**:
   - Tự động bật chế độ **WAL (Write-Ahead Logging)** và Foreign Keys để tối ưu hóa đọc/ghi đồng thời.
   - Tự động seed tài khoản admin và danh mục sản phẩm mẫu nếu DB còn trống.

3. **Frontend Cyber Glassmorphism**:
   - Giao diện đồng bộ với phong cách Dark Mode & Neon Gradient của VinhBaPhone.
   - Quản trị toàn diện:
     - 📊 **Tổng quan**: Chỉ số người dùng, kho hàng, cảnh báo sắp hết hàng.
     - 👥 **Quản lý người dùng**: Thêm, Sửa, Đổi mật khẩu, Khóa/Mở tài khoản, Xóa.
     - 📱 **Quản lý sản phẩm**: Thêm, Sửa thông tin/giá bán/tồn kho, bật/tắt Flash Sale, Xóa.
     - 🖥️ **Giám sát hệ thống**: Trạng thái máy chủ, RAM, CPU, dung lượng file Database.
