# Hướng Dẫn Sử Dụng & Triển Khai Website VinhBaPhone Replica (Kèm Trợ Lý AI S-Bot)

Dự án này là phiên bản tái hiện giao diện và các tính năng thương mại điện tử chuyên nghiệp của hệ thống bán lẻ công nghệ **VinhBaPhone** (https://vinhbaphone.com.vn/), tích hợp **Trợ Lý Trí Tuệ Nhân Tạo Thông Minh (S-Bot AI)** phục vụ tư vấn công nghệ 24/7.

---

## 📁 Cấu Trúc Mã Nguồn

```text
Antigravity/
├── index.html            # File giao diện chính chuẩn SEO, ngữ nghĩa HTML5 & nhận diện VinhBaPhone
├── css/
│   ├── variables.css     # Thiết lập màu sắc đỏ VinhBaPhone (#d70018), typography Be Vietnam Pro
│   ├── style.css         # Toàn bộ CSS VinhBaPhone: Header, Carousel Tabs, Flash sale, Cards, Modals
│   ├── ai-assistant.css  # CSS cho Trợ lý AI: Nút launcher phát sáng, cửa sổ chat, thẻ so sánh
│   └── responsive.css    # Giao diện co giãn thông minh cho Desktop, Tablet và Mobile
├── js/
│   ├── data.js           # Database mẫu: Điện thoại, Laptop, Phụ kiện, Cửa hàng, Voucher
│   ├── cart.js           # Xử lý giỏ hàng: Thêm, sửa số lượng, áp mã giảm giá, lưu LocalStorage
│   ├── app.js            # Slider tự chạy kèm Tabs, Flash Sale lọc tab, Tìm kiếm, Quick View
│   └── ai-assistant.js   # Động cơ AI S-Bot: Tư vấn sản phẩm, so sánh thông số, săn voucher, âm thanh
└── README.md             # Hướng dẫn chi tiết
```

---

## 🚀 Cách Mở Website Để Trải Nghiệm Ngay

Bạn **không cần cài đặt thêm phần mềm phức tạp**, chỉ cần:
1. Mở thư mục `c:\Users\ADMIN\Downloads\Antigravity` trên máy tính của bạn.
2. Nhấp đúp chuột vào file **`index.html`** để mở trực tiếp trên Google Chrome, Cốc Cốc, Microsoft Edge hoặc bất kỳ trình duyệt nào.
3. Hoặc nếu bạn dùng VS Code / Antigravity IDE, có thể nhấp chuột phải vào `index.html` và chọn **Open with Live Server**.

---

## ✨ Điểm Cải Tiến & Độ Giống VinhBaPhone Cao Nhất

### 1. Nhận Diện Thương Hiệu Chuẩn VinhBaPhone:
- **Logo chuẩn**: Dòng chữ `cellphone` màu trắng đậm nét kèm khối biểu tượng vuông bo góc màu trắng chứa chữ `S` đỏ rực rỡ đặc trưng của VinhBaPhone.
- **Thanh tìm kiếm**: Dòng chữ gợi ý chuẩn `Bạn cần tìm gì hôm nay?` cùng gợi ý tìm kiếm tức thì.
- **Thanh Header màu đỏ (#d70018)**: Tích hợp đầy đủ nút *Danh mục*, *Xem giá tại: Hồ Chí Minh*, *Gọi mua hàng: 1800.2097*, *Cửa hàng gần bạn*, *Tra cứu đơn hàng*, *Giỏ hàng*, *Smember*, và nút nhanh **Hỏi AI S-Bot**.
- **Dải từ khóa Hot**: Gợi ý các sản phẩm xu hướng hàng đầu: *iPhone 16 Pro Max*, *Galaxy S25 Ultra*, *MacBook Air M3*, *Sony WH-1000XM5*, *Robot hút bụi*...

### 2. Carousel Slider Kèm Thanh Tabs Điều Hướng (Signature VinhBaPhone):
- Dưới banner chính là **thanh 4 Tab điều hướng sản phẩm**:
  - `iPhone 16 Pro Max | Titan Sa Mạc cực phẩm`
  - `Galaxy S25 Ultra AI | Quyền năng Galaxy AI thế hệ mới`
  - `MacBook Air M3 Series | Mỏng nhẹ đỉnh cao`
  - `Marshall Stanmore III | Âm thanh huyền thoại`
- Khi banner chạy tự động hoặc người dùng bấm chọn, tab tương ứng được gạch chân đỏ nổi bật và tô nền đồng bộ 100% như trên vinhbaphone.com.vn.

### 3. Hot Sale Cuối Tuần & Bộ Lọc Tab Nhanh:
- Đồng hồ đếm ngược giờ:phút:giây thời gian thực với hiệu ứng tia sét và ngọn lửa.
- **Hàng nút lọc danh mục Flash Sale tức thì**: `🔥 Tất cả`, `📱 Điện thoại`, `💻 Laptop`, `🎧 Âm thanh`, `🔌 Phụ kiện`.
- Thẻ Flash Sale có thanh tiến độ bán hàng `🔥 Đã bán 42/50` kèm nhãn giảm giá và trả góp 0%.

### 4. Thẻ Sản Phẩm Tinh Tế & Tính Năng Tư Vấn AI:
- Khung quà tặng / ưu đãi: `Thu cũ đổi mới trợ giá 4 triệu • Trả góp 0%`.
- Nhãn đặc quyền Smember giảm thêm đến 500k.
- Nút **🛒 Thêm giỏ** và nút **🤖 Hỏi AI** ngay trên từng sản phẩm để giải đáp thắc mắc hoặc so sánh trong 1 chạm.

---

## 🤖 Tính Năng Trợ Lý Trí Tuệ Nhân Tạo (S-Bot AI)

Hệ thống AI Assistant được tích hợp toàn diện:

1. **Khung Chat AI Trực Tuyến 24/7 (S-Bot)**:
   - Nút tròn nổi ở góc dưới bên phải với hiệu ứng sóng lan tỏa (Pulsing rings) và huy hiệu robot công nghệ.
   - Bóng thoại gợi ý thông minh (Teaser bubble) tự động chào hỏi sau 2.8 giây.
   - Nút gọi AI nhanh trên thanh Header và menu dưới cùng trên Mobile.

2. **Khả Năng Giao Tiếp & Tư Vấn Thông Minh**:
   - **Tư vấn theo tầm giá**: Hiểu các câu hỏi tự nhiên như *"Tư vấn điện thoại dưới 15 triệu"*, *"Laptop sinh viên dưới 20tr"*, *"Tai nghe chống ồn dưới 2 triệu"*... và hiển thị ngay các thẻ sản phẩm kèm nút *Chi tiết* và *Thêm vào giỏ*.
   - **So sánh 2 sản phẩm (Side-by-side Table)**: Gõ *"So sánh iPhone 16 Pro Max và Galaxy S24 Ultra"* -> AI tự động lập bảng so sánh đầy đủ (Màn hình, Chip CPU, RAM/Bộ nhớ, Camera, Pin/Sạc, Giá bán) và đưa ra lời khuyên khách quan nên chọn máy nào.
   - **Tư vấn theo mục đích**: Nhận diện nhu cầu *"Chụp ảnh đẹp, quay vlog"*, *"Chơi game max setting"*, *"Học tập văn phòng mỏng nhẹ pin trâu"*.
   - **Săn Flash Sale & Quản lý Voucher**: Bấm hoặc hỏi *"Mã giảm giá hôm nay"* -> AI hiển thị ngay các mã `CELLPHONES50`, `SMEMBER100`, `TECH500` kèm nút bấm tự động áp mã vào giỏ hàng.
   - **Tra cứu đơn hàng trực tiếp**: Nhập mã đơn (VD: `CPS123456`) hoặc số điện thoại vào chat -> AI kiểm tra và báo tiến độ giao hàng.
   - **Chính sách & Cửa hàng**: Cung cấp thông tin thu cũ đổi mới trợ giá 4 triệu, chính sách bảo hành 1 đổi 1 trong 30 ngày, hệ thống 115+ cửa hàng và hotline 1800.2097.

3. **Trải Nghiệm Đa Giác Quan**:
   - Âm thanh thông báo nhẹ nhàng sinh động bằng Web Audio API (không cần tải thêm file mp3, chạy mượt cả khi offline).
   - Hỗ trợ giọng đọc tin nhắn tiếng Việt (Speech Synthesis).
   - Nút chuyển đổi Toàn màn hình (Fullscreen) và nút Làm mới cuộc trò chuyện.
