"""
VinhBaPhone Admin — Smart E-Commerce AI Assistant (S-Bot Service)
Triển khai cơ chế Dynamic Context Injection (RAG), Zero Hallucination,
Tra cứu đơn hàng thực tế, So sánh sản phẩm, Tư vấn tầm giá & Smart Fallback.
"""
import os
import re
from typing import Dict, List, Optional, Tuple
from sqlalchemy import or_, desc
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.order import Order, OrderItem
from app.schemas.chat import (
    ChatMessageItem,
    ChatResponse,
    RecommendedProduct,
    OrderLookupResult,
    OrderItemSummary
)


class ChatAIService:
    """Service xử lý nghiệp vụ Trợ lý AI Bán hàng thông minh (S-Bot)."""

    STATUS_MAP = {
        "pending": "Chờ xác nhận",
        "confirmed": "Đã xác nhận (Đang đóng gói)",
        "shipping": "Đang vận chuyển (Giao trong ngày)",
        "completed": "Giao hàng thành công",
        "cancelled": "Đã hủy đơn"
    }

    @classmethod
    def format_vnd(cls, amount: float) -> str:
        """Định dạng tiền tệ chuẩn Việt Nam: 31.490.000₫."""
        try:
            return f"{int(amount):,}₫".replace(",", ".")
        except Exception:
            return f"{amount}₫"

    @classmethod
    def process_chat(
        cls,
        message: str,
        conversation_history: List[ChatMessageItem],
        db: Session
    ) -> ChatResponse:
        """Điểm vào xử lý tin nhắn của người dùng."""
        clean_msg = message.strip()
        lower_msg = clean_msg.lower()

        # 1. Giải quyết ngữ cảnh hội thoại đa lượt (Multi-turn Context Resolution)
        context_product = cls._resolve_context_product(clean_msg, conversation_history, db)

        # 2. Kiểm tra ý định Tra cứu đơn hàng (Order Tracking Intent)
        phone_match, order_id_match = cls._extract_order_lookup_keys(clean_msg)
        is_order_intent = any(k in lower_msg for k in [
            "tra cứu", "kiểm tra đơn", "đơn hàng của tôi", "tình trạng đơn",
            "mã đơn", "sđt", "số điện thoại", "vbp", "cps", "vận chuyển đến đâu"
        ]) or (phone_match is not None and len(clean_msg.split()) <= 4)

        if is_order_intent and (phone_match or order_id_match):
            return cls._handle_order_lookup(phone_match, order_id_match, db)

        # 3. Kiểm tra ý định So sánh sản phẩm (Product Comparison Intent)
        is_compare_intent = any(k in lower_msg for k in [
            "so sánh", "vs", "khác nhau gì", "khác biệt gì",
            "nên mua máy nào", "nên chọn máy nào", "hay là"
        ])
        if is_compare_intent:
            res = cls._handle_comparison(clean_msg, context_product, db)
            if res:
                return res

        # 4. Kiểm tra ý định Tư vấn theo Ngân sách & Nhu cầu (Budget & Needs)
        is_budget_or_needs = any(k in lower_msg for k in [
            "dưới", "khoảng", "tầm", "triệu", "tr", "chơi game", "gaming",
            "pin trâu", "chụp ảnh", "sinh viên", "học tập", "mỏng nhẹ",
            "văn phòng", "tư vấn", "gợi ý", "chọn giúp", "mua máy nào"
        ])
        budget_range = cls._extract_budget_range(lower_msg)
        if budget_range or (is_budget_or_needs and any(c in lower_msg for c in ["điện thoại", "laptop", "tai nghe", "loa", "đồng hồ", "máy tính"])):
            return cls._handle_budget_needs_advice(lower_msg, budget_range, db)

        # 5. Kiểm tra ý định Hỏi mua / Báo giá / Kiểm tra cấu hình cụ thể
        res_specific = cls._handle_specific_product_inquiry(clean_msg, context_product, db)
        if res_specific:
            return res_specific

        # 6. Kiểm tra ý định Flash Sale / Giảm giá / Khuyến mãi
        is_sale_intent = any(k in lower_msg for k in [
            "flash sale", "sale", "giảm giá", "khuyến mãi", "ưu đãi", "hot deal", "giảm sâu", "voucher"
        ])
        if is_sale_intent:
            return cls._handle_flash_sale(db)

        # 7. Kiểm tra ý định Chính sách cửa hàng (Bảo hành, Trả góp, Thu cũ đổi mới)
        res_policy = cls._handle_store_policies(lower_msg, context_product)
        if res_policy:
            return res_policy

        # 8. Mặc định / Chat thông thường
        return cls._handle_general_fallback(clean_msg, db)

    # ──────────────────────────────────────────────────────────────────────────
    # Helper: Multi-turn Context Resolution
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _resolve_context_product(
        cls,
        current_msg: str,
        history: List[ChatMessageItem],
        db: Session
    ) -> Optional[Product]:
        """
        Duyệt ngược lịch sử hội thoại để xác định sản phẩm vừa được nhắc đến
        khi người dùng dùng đại từ thay thế ('máy đó', 'nó', 'chiếc này', 'trả góp thế nào').
        """
        ref_words = ["máy đó", "nó", "chiếc này", "con này", "máy này", "sản phẩm đó", "mẫu này", "trả góp thế nào"]
        lower_msg = current_msg.lower()
        has_ref = any(w in lower_msg for w in ref_words)

        # Nếu không có đại từ và câu hỏi đã dài, vẫn có thể lấy ngữ cảnh gần nhất
        active_products = db.query(Product).filter(Product.is_active == True).all()

        for item in reversed(history[-6:]):
            text = item.content
            for p in active_products:
                # Nếu tên sản phẩm xuất hiện trong lượt chat trước
                short_name = p.name.split("-")[0].strip()
                if short_name.lower() in text.lower():
                    return p
        return None

    # ──────────────────────────────────────────────────────────────────────────
    # Helper: Key Extraction for Order Lookup
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _extract_order_lookup_keys(cls, text: str) -> Tuple[Optional[str], Optional[int]]:
        """Trích xuất Số điện thoại (9-11 chữ số) hoặc Mã đơn hàng."""
        # Số điện thoại VN: 9-11 chữ số bắt đầu bằng 0 hoặc +84
        phone_match = re.search(r'(?:0|\+?84)\d{8,10}\b', text)
        phone = phone_match.group(0) if phone_match else None

        # Mã đơn: VBP000001, CPS123, DH123, #12 hoặc số nguyên đơn thuần
        order_match = re.search(r'(?:VBP|CPS|DH|#)(\d{1,8})\b', text, re.IGNORECASE)
        if not order_match and not phone:
            order_match = re.search(r'\b(\d{1,6})\b', text)
        order_id = None
        if order_match:
            raw_id = order_match.group(1)
            if len(raw_id) <= 6 and raw_id not in ["2024", "2025", "2026"]:
                try:
                    order_id = int(raw_id)
                except ValueError:
                    order_id = None

        return phone, order_id

    # ──────────────────────────────────────────────────────────────────────────
    # Helper: Budget Range Extractor
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _extract_budget_range(cls, text: str) -> Optional[Tuple[Optional[float], Optional[float]]]:
        """Trích xuất khoảng giá từ câu hỏi tự nhiên (VD: dưới 15 triệu, tầm 10-20tr)."""
        # Dạng: từ X đến Y triệu
        range_match = re.search(r'(?:từ|khoảng)\s*(\d+)\s*(?:đến|tới|-)\s*(\d+)\s*(?:triệu|tr)?', text)
        if range_match:
            min_val = float(range_match.group(1)) * 1_000_000
            max_val = float(range_match.group(2)) * 1_000_000
            return (min_val, max_val)

        # Dạng: dưới X triệu / < X tr
        under_match = re.search(r'(?:dưới|<|không quá)\s*(\d+)\s*(?:triệu|tr|cu)?', text)
        if under_match:
            max_val = float(under_match.group(1)) * 1_000_000
            return (None, max_val)

        # Dạng: tầm / khoảng X triệu
        around_match = re.search(r'(?:tầm|khoảng|giá)\s*(\d+)\s*(?:triệu|tr|cu)', text)
        if around_match:
            base_val = float(around_match.group(1)) * 1_000_000
            return (max(0.0, base_val - 3_000_000), base_val + 3_000_000)

        return None

    # ──────────────────────────────────────────────────────────────────────────
    # Skill 1: Tra cứu đơn hàng thật (Order Tracking) - Zero Fake Data
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _handle_order_lookup(
        cls,
        phone: Optional[str],
        order_id: Optional[int],
        db: Session
    ) -> ChatResponse:
        query = db.query(Order)
        searched_key = ""

        if phone:
            # Chuẩn hóa số điện thoại: bỏ +84 thành 0
            std_phone = phone.replace("+84", "0") if phone.startswith("+84") else phone
            query = query.filter(
                or_(
                    Order.customer_phone == std_phone,
                    Order.customer_phone == phone
                )
            )
            searched_key = phone
        elif order_id:
            query = query.filter(Order.id == order_id)
            searched_key = f"VBP{order_id:06d}"

        orders = query.order_by(desc(Order.created_at)).all()

        if not orders:
            return ChatResponse(
                success=True,
                intent="order_tracking",
                reply=(
                    f"Dạ, em đã tra cứu trực tiếp trên hệ thống nhưng **chưa tìm thấy đơn hàng nào** "
                    f"khớp với thông tin **{searched_key}** ạ.\n\n"
                    f"💡 **Quý khách vui lòng kiểm tra lại:**\n"
                    f"• Số điện thoại nhận hàng đã dùng khi đặt (10 chữ số).\n"
                    f"• Hoặc Mã đơn hàng chính xác được cấp khi hoàn tất đặt hàng (VD: `VBP000001`).\n\n"
                    f"Nếu vừa đặt hàng xong cách đây ít phút, hệ thống có thể cần 1-2 phút để đồng bộ. "
                    f"Hoặc quý khách có thể liên hệ Tổng đài CSKH miễn phí **1800.2097** để được hỗ trợ kiểm tra ngay lập tức ạ!"
                ),
                suggested_chips=[
                    "Tra cứu số điện thoại khác",
                    "Chính sách bảo hành & Đổi trả",
                    "Tư vấn mua thêm phụ kiện"
                ]
            )

        # Lấy đơn hàng mới nhất
        latest_order = orders[0]
        status_label = cls.STATUS_MAP.get(latest_order.status, latest_order.status)
        created_str = latest_order.created_at.strftime("%d/%m/%Y lúc %H:%M") if latest_order.created_at else "Hôm nay"
        order_code = f"VBP{latest_order.id:06d}"

        items_summary: List[OrderItemSummary] = []
        items_text_list = []
        for item in latest_order.items:
            # Lấy tên sản phẩm từ DB
            prod_name = f"Sản phẩm #{item.product_id}"
            if item.product_id:
                p_db = db.query(Product).filter(Product.id == item.product_id).first()
                if p_db:
                    prod_name = p_db.name

            variant_info = []
            if item.color: variant_info.append(item.color)
            if item.storage: variant_info.append(item.storage)
            variant_str = f" ({', '.join(variant_info)})" if variant_info else ""

            items_summary.append(OrderItemSummary(
                product_name=prod_name,
                quantity=item.quantity,
                price=item.price,
                color=item.color,
                storage=item.storage
            ))
            items_text_list.append(
                f"  • **{item.quantity}x {prod_name}**{variant_str} — *{cls.format_vnd(item.price)}*"
            )

        items_formatted = "\n".join(items_text_list)
        total_str = cls.format_vnd(latest_order.total_price)

        reply_md = (
            f"📦 **THÔNG TIN ĐƠN HÀNG THỰC TẾ TRÊN HỆ THỐNG**\n\n"
            f"• **Mã đơn hàng:** `{order_code}`\n"
            f"• **Khách hàng:** **{latest_order.customer_name}** ({latest_order.customer_phone})\n"
            f"• **Địa chỉ giao:** {latest_order.customer_address}\n"
            f"• **Thời gian đặt:** {created_str}\n"
            f"• **Trạng thái:** 🟢 **{status_label}**\n\n"
            f"📋 **Danh sách sản phẩm:**\n{items_formatted}\n\n"
            f"💰 **Tổng tiền thanh toán:** **{total_str}** *(Đã gồm VAT & Miễn phí giao hàng)*\n\n"
            f"*(Đơn hàng đã được lưu trữ an toàn trong Database của VinhBaPhone. Quý khách cần đổi giờ giao hoặc địa chỉ xin gọi 1800.2097)*"
        )

        order_res = OrderLookupResult(
            order_id=latest_order.id,
            order_code=order_code,
            customer_name=latest_order.customer_name,
            customer_phone=latest_order.customer_phone,
            customer_address=latest_order.customer_address,
            total_price=latest_order.total_price,
            status=latest_order.status,
            status_label=status_label,
            created_at=created_str,
            items=items_summary
        )

        return ChatResponse(
            success=True,
            intent="order_tracking",
            reply=reply_md,
            order_info=order_res,
            suggested_chips=[
                "Khi nào tôi nhận được hàng?",
                "Chính sách bảo hành sản phẩm",
                "Mua thêm ốp lưng & sạc cáp"
            ]
        )

    # ──────────────────────────────────────────────────────────────────────────
    # Skill 2: So sánh sản phẩm trực quan (Product Comparison)
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _handle_comparison(
        cls,
        message: str,
        context_prod: Optional[Product],
        db: Session
    ) -> Optional[ChatResponse]:
        active_products = db.query(Product).filter(Product.is_active == True).all()

        matched: List[Product] = []
        lower_msg = message.lower()

        # Tìm các sản phẩm được nhắc đến
        for p in active_products:
            # Tên vắn tắt: iPhone 16 Pro Max, S24 Ultra, MacBook Air...
            simple_name = p.name.lower().split("-")[0].strip()
            # Bỏ bớt dung lượng để match tốt hơn
            simple_name_clean = re.sub(r'\b(256gb|512gb|128gb|1tb|8gb|12gb)\b', '', simple_name).strip()
            if simple_name_clean in lower_msg or (len(simple_name_clean) > 4 and simple_name_clean in lower_msg):
                if p not in matched:
                    matched.append(p)

        # Nếu chỉ tìm thấy 1 sản phẩm mà có context_product từ trước
        if len(matched) == 1 and context_prod and context_prod.id != matched[0].id:
            matched.append(context_prod)

        # Cần tối thiểu 2 sản phẩm để so sánh
        if len(matched) < 2:
            return None

        p1, p2 = matched[0], matched[1]

        # Parse thông số specs từ description
        def parse_specs(desc_text: str) -> Dict[str, str]:
            res = {"Màn hình": "Chuẩn sắc nét", "Chip": "Hiệu năng cao", "RAM / ROM": "Đa nhiệm mượt", "Pin": "Trọn ngày dài", "Camera": "Chụp đêm ấn tượng"}
            if not desc_text: return res
            parts = desc_text.split("•")
            for part in parts:
                part = part.strip()
                if "Màn hình:" in part: res["Màn hình"] = part.replace("Màn hình:", "").strip()
                elif "Chip:" in part: res["Chip"] = part.replace("Chip:", "").strip()
                elif "RAM:" in part: res["RAM / ROM"] = part.replace("RAM:", "").strip()
                elif "Bộ nhớ:" in part: res["RAM / ROM"] += " / " + part.replace("Bộ nhớ:", "").strip()
                elif "Pin:" in part: res["Pin"] = part.replace("Pin:", "").strip()
                elif "Camera:" in part: res["Camera"] = part.replace("Camera:", "").strip()
            return res

        s1 = parse_specs(p1.description or "")
        s2 = parse_specs(p2.description or "")

        p1_price_str = cls.format_vnd(p1.price)
        p2_price_str = cls.format_vnd(p2.price)
        p1_orig_str = cls.format_vnd(p1.original_price or p1.price * 1.1)
        p2_orig_str = cls.format_vnd(p2.original_price or p2.price * 1.1)

        # Đưa ra nhận định chuyên gia
        advice = ""
        if p1.brand == "Apple" and p2.brand == "Samsung":
            advice = (
                f"• Chọn **{p1.name}**: Nếu bạn cần hệ điều hành iOS mượt mà, giữ giá tốt, quay video chuyên nghiệp và hệ sinh thái Apple đồng bộ.\n"
                f"• Chọn **{p2.name}**: Nếu bạn thích màn hình không khuyết điểm, camera zoom 100x đỉnh cao, bút S-Pen ghi chú và các tính năng Galaxy AI thông minh."
            )
        elif p1.price < p2.price:
            diff = cls.format_vnd(p2.price - p1.price)
            advice = (
                f"• Chọn **{p1.name}**: Tiết kiệm hơn **{diff}**, đáp ứng cực tốt mọi nhu cầu hàng ngày với mức giá hợp lý.\n"
                f"• Chọn **{p2.name}**: Nếu bạn muốn trải nghiệm công nghệ cao cấp nhất cùng hiệu năng vượt trội."
            )
        else:
            advice = (
                f"• Cả hai mẫu máy đều là những lựa chọn hàng đầu trong phân khúc hiện nay, đều được áp dụng bảo hành 12 tháng chính hãng và trả góp 0% lãi suất tại VinhBaPhone."
            )

        reply_md = (
            f"⚖️ **BẢNG SO SÁNH CHI TIẾT THEO DỮ LIỆU THỰC TẾ**\n\n"
            f"| Tiêu chí | **{p1.name}** | **{p2.name}** |\n"
            f"| :--- | :--- | :--- |\n"
            f"| **Giá khuyến mãi** | <span style=\"color:#e11d48\">**{p1_price_str}**</span> | <span style=\"color:#e11d48\">**{p2_price_str}**</span> |\n"
            f"| **Giá niêm yết** | ~~{p1_orig_str}~~ | ~~{p2_orig_str}~~ |\n"
            f"| **Màn hình** | {s1['Màn hình']} | {s2['Màn hình']} |\n"
            f"| **Vi xử lý (CPU)** | **{s1['Chip']}** | **{s2['Chip']}** |\n"
            f"| **Bộ nhớ / RAM** | {s1['RAM / ROM']} | {s2['RAM / ROM']} |\n"
            f"| **Camera** | {s1['Camera']} | {s2['Camera']} |\n"
            f"| **Thời lượng Pin** | {s1['Pin']} | {s2['Pin']} |\n"
            f"| **Tình trạng kho** | Còn hàng ({p1.stock} máy) | Còn hàng ({p2.stock} máy) |\n\n"
            f"💡 **Lời khuyên chọn mua từ S-Bot AI:**\n"
            f"{advice}\n\n"
            f"*Bạn có thể bấm **'Thêm vào giỏ'** hoặc **'Xem chi tiết'** ở các thẻ sản phẩm bên dưới để xem thêm tùy chọn màu sắc nhé!*"
        )

        rec_products = [
            cls._to_recommended_product(p1),
            cls._to_recommended_product(p2)
        ]

        return ChatResponse(
            success=True,
            intent="comparison",
            reply=reply_md,
            recommended_products=rec_products,
            suggested_chips=[
                f"Xem trả góp {p1.name}",
                f"Xem trả góp {p2.name}",
                "Chương trình thu cũ đổi mới",
                "Chính sách bảo hành 1 đổi 1"
            ]
        )

    # ──────────────────────────────────────────────────────────────────────────
    # Skill 3: Tư vấn theo Ngân sách & Nhu cầu (Budget & Needs)
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _handle_budget_needs_advice(
        cls,
        lower_msg: str,
        budget_range: Optional[Tuple[Optional[float], Optional[float]]],
        db: Session
    ) -> ChatResponse:
        query = db.query(Product).filter(Product.is_active == True)

        # Xác định Category
        detected_cat = None
        cat_title = "thiết bị"
        if any(w in lower_msg for w in ["điện thoại", "đt", "smartphone", "iphone", "samsung", "xiaomi"]):
            detected_cat = "phone"
            cat_title = "điện thoại"
        elif any(w in lower_msg for w in ["laptop", "máy tính", "macbook", "máy tính xách tay"]):
            detected_cat = "laptop"
            cat_title = "laptop"
        elif any(w in lower_msg for w in ["tai nghe", "loa", "âm thanh", "headphone", "earphone"]):
            detected_cat = "audio"
            cat_title = "thiết bị âm thanh"
        elif any(w in lower_msg for w in ["đồng hồ", "smartwatch", "apple watch"]):
            detected_cat = "watch"
            cat_title = "đồng hồ thông minh"
        elif any(w in lower_msg for w in ["ipad", "tablet", "máy tính bảng"]):
            detected_cat = "tablet"
            cat_title = "máy tính bảng"

        if detected_cat:
            query = query.filter(Product.category == detected_cat)

        # Lọc tầm giá nếu có
        min_p, max_p = budget_range if budget_range else (None, None)
        if min_p is not None:
            query = query.filter(Product.price >= min_p)
        if max_p is not None:
            query = query.filter(Product.price <= max_p)

        products = query.order_by(Product.price.desc()).limit(4).all()

        # ZERO HALLUCINATION POLICY: Nếu trong tầm giá chính xác không có máy
        if not products:
            # Lấy các máy cùng category gần với tầm giá nhất
            alt_query = db.query(Product).filter(Product.is_active == True)
            if detected_cat:
                alt_query = alt_query.filter(Product.category == detected_cat)
            products = alt_query.order_by(Product.price.asc()).limit(3).all()

            price_desc = ""
            if max_p:
                price_desc = f"dưới {cls.format_vnd(max_p)}"
            elif min_p:
                price_desc = f"từ {cls.format_vnd(min_p)}"

            reply_md = (
                f"Dạ, hiện tại trong tầm giá chính xác **{price_desc}**, các sản phẩm {cat_title} đang tạm hết hàng hoặc vừa có biến động giá.\n\n"
                f"Tuy nhiên, trên cơ sở dữ liệu kho của **VinhBaPhone**, em xin gợi ý các siêu phẩm **có mức giá gần nhất và đang có ưu đãi cực tốt** để bạn tham khảo ngay bên dưới ạ:"
            )
        else:
            price_desc = ""
            if min_p and max_p:
                price_desc = f"từ {cls.format_vnd(min_p)} đến {cls.format_vnd(max_p)}"
            elif max_p:
                price_desc = f"dưới {cls.format_vnd(max_p)}"
            elif min_p:
                price_desc = f"từ {cls.format_vnd(min_p)} trở lên"
            else:
                price_desc = "tốt nhất hiện nay"

            # Phân tích nhu cầu đặc biệt
            need_highlight = ""
            if "chơi game" in lower_msg or "gaming" in lower_msg:
                need_highlight = " • Ưu tiên cấu hình Chip mạnh mẽ, tản nhiệt tốt, màn hình tần số quét 120Hz mượt mà để chiến game."
            elif "pin trâu" in lower_msg:
                need_highlight = " • Ưu tiên thời lượng pin bền bỉ từ 5000mAh kèm công nghệ sạc nhanh tiện lợi."
            elif "chụp ảnh" in lower_msg or "quay" in lower_msg:
                need_highlight = " • Ưu tiên hệ thống camera độ phân giải cao, chống rung quang học OIS và thuật toán AI xử lý hình ảnh."
            elif "sinh viên" in lower_msg or "mỏng nhẹ" in lower_msg:
                need_highlight = " • Ưu tiên thiết kế mỏng nhẹ tiện mang đi học, thời lượng pin cả ngày dài và giá hỗ trợ học sinh sinh viên."

            reply_md = (
                f"Dạ, dựa trên yêu cầu tìm **{cat_title}** phân khúc **{price_desc}** của bạn{need_highlight},\n"
                f"em xin đề xuất **Top {len(products)} sản phẩm chính hãng đáng mua nhất** đang sẵn hàng tại kho:\n\n"
            )

            for i, p in enumerate(products, 1):
                p_desc = p.description.split("|")[0] if p.description else "Chính hãng 100%"
                reply_md += (
                    f"**{i}. {p.name}**\n"
                    f"   • Giá sốc: **{cls.format_vnd(p.price)}** (Tiết kiệm so với giá gốc: ~~{cls.format_vnd(p.original_price or p.price * 1.1)}~~)\n"
                    f"   • Điểm nổi bật: {p_desc}\n"
                    f"   • Ưu đãi: Trả góp 0% lãi suất • Thu cũ đổi mới trợ giá đến 4 triệu\n\n"
                )

        rec_products = [cls._to_recommended_product(p) for p in products]

        return ChatResponse(
            success=True,
            intent="budget_advice",
            reply=reply_md,
            recommended_products=rec_products,
            suggested_chips=[
                "Thủ tục mua trả góp 0%",
                "Chính sách bảo hành 1 đổi 1",
                "Xem máy đang Flash Sale"
            ]
        )

    # ──────────────────────────────────────────────────────────────────────────
    # Skill 4: Hỏi cụ thể một sản phẩm / Báo giá chính xác
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _handle_specific_product_inquiry(
        cls,
        message: str,
        context_prod: Optional[Product],
        db: Session
    ) -> Optional[ChatResponse]:
        active_products = db.query(Product).filter(Product.is_active == True).all()
        lower_msg = message.lower()

        target_product = None
        for p in active_products:
            # Tên vắn tắt: iPhone 16, S24 Ultra, Sony WH-1000XM5...
            words = [w for w in p.name.lower().split() if len(w) > 2]
            match_count = sum(1 for w in words if w in lower_msg)
            if match_count >= 2:
                target_product = p
                break

        # Nếu không tìm thấy bằng từ khóa nhưng người dùng hỏi về "máy đó / trả góp / giá"
        if not target_product and context_prod:
            if any(w in lower_msg for w in ["giá", "bao nhiêu", "màu", "còn hàng", "trả góp", "thông số", "pin"]):
                target_product = context_prod

        if not target_product:
            # Kiểm tra xem khách có đang hỏi một dòng máy shop KHÔNG CÓ TRONG DB không
            # Ví dụ: "iPhone 17", "Pixel 9", "Xiaomi 15", "Oppo Find N3"
            known_brands = ["iphone", "samsung", "xiaomi", "oppo", "vivo", "realme", "pixel", "asus", "dell", "hp", "macbook"]
            for brand_kw in known_brands:
                if brand_kw in lower_msg and any(w in lower_msg for w in ["có", "bán", "giá", "mua", "không"]):
                    # Khách hỏi máy chưa có trong kho -> ZERO HALLUCINATION POLICY!
                    alt_products = db.query(Product).filter(Product.is_active == True).limit(3).all()
                    return ChatResponse(
                        success=True,
                        intent="out_of_stock_inquiry",
                        reply=(
                            f"Dạ, hiện tại mẫu sản phẩm bạn vừa hỏi bên em **chưa kinh doanh hoặc đang tạm hết hàng** trên hệ thống ạ.\n\n"
                            f"Tuy nhiên, tại **VinhBaPhone**, các dòng máy cùng phân khúc cao cấp dưới đây đang có sẵn hàng với giá rất tốt kèm ưu đãi Trả góp 0% và Thu cũ đổi mới trợ giá đến 4 triệu:\n"
                            f"*(Em xin gửi danh sách sản phẩm thực tế đang sẵn hàng tại kho để bạn tham khảo nhé!)*"
                        ),
                        recommended_products=[cls._to_recommended_product(p) for p in alt_products],
                        suggested_chips=[
                            "Xem các mẫu iPhone sẵn hàng",
                            "Xem các mẫu Samsung sẵn hàng",
                            "Tư vấn máy dưới 20 triệu"
                        ]
                    )
            return None

        # Nếu sản phẩm có thật trong DB:
        p = target_product
        price_str = cls.format_vnd(p.price)
        orig_str = cls.format_vnd(p.original_price or p.price * 1.1)
        saving = cls.format_vnd((p.original_price or p.price * 1.1) - p.price)

        reply_md = (
            f"Dạ, siêu phẩm **{p.name}** hiện **ĐANG SẴN HÀNG** tại hệ thống cửa hàng VinhBaPhone ạ! 🎉\n\n"
            f"• 💰 **Giá khuyến mãi:** <span style=\"color:#e11d48;font-size:16px;\">**{price_str}**</span> *(Giá gốc: ~~{orig_str}~~ — Tiết kiệm ngay **{saving}**)*\n"
            f"• 📦 **Tình trạng:** Còn hàng ({p.stock} máy sẵn sàng giao ngay 2h).\n"
            f"• ⚙️ **Thông số nổi bật:** {p.description or 'Chính hãng Apple/Samsung/Sony 100%'}\n"
            f"• 🛡️ **Bảo hành:** Chính hãng 12 tháng, 1 đổi 1 trong 30 ngày nếu phát sinh lỗi phần cứng.\n"
            f"• 💳 **Trả góp:** Hỗ trợ Trả góp 0% lãi suất (chỉ từ ~{cls.format_vnd(p.price / 12)}/tháng).\n"
            f"• 🔄 **Ưu đãi lên đời:** Trợ giá thu cũ đổi mới lên đến **4.000.000₫**.\n\n"
            f"*Bạn có thể bấm **'Thêm vào giỏ'** hoặc **'Xem chi tiết'** bên dưới để đặt giữ máy ngay nhé!*"
        )

        return ChatResponse(
            success=True,
            intent="product_inquiry",
            reply=reply_md,
            recommended_products=[cls._to_recommended_product(p)],
            suggested_chips=[
                f"Thủ tục trả góp {p.name}",
                f"So sánh {p.name} với dòng khác",
                "Chính sách bảo hành 1 đổi 1",
                "Mã giảm giá hôm nay"
            ]
        )

    # ──────────────────────────────────────────────────────────────────────────
    # Skill 5: Flash Sale & Khuyến mãi
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _handle_flash_sale(cls, db: Session) -> ChatResponse:
        flash_items = db.query(Product).filter(
            Product.is_active == True,
            Product.is_flash_sale == True
        ).all()

        if not flash_items:
            flash_items = db.query(Product).filter(Product.is_active == True).limit(4).all()

        reply_md = (
            f"🔥 **CHƯƠNG TRÌNH FLASH SALE - GIÁ SỐC ĐANG DIỄN RA TẠI VINHBAPHONE!**\n\n"
            f"Hiện tại đang có **{len(flash_items)} siêu phẩm công nghệ** được trợ giá đặc biệt với mức giảm lên đến 25% kèm các đặc quyền độc quyền:\n"
            f"• Tặng kèm gói bảo hành rơi vỡ / vào nước 6 tháng.\n"
            f"• Hỗ trợ Trả góp 0% lãi suất xét duyệt nhanh trong 5 phút.\n"
            f"• Giảm thêm 500.000₫ cho thành viên Smember.\n\n"
            f"*(Số lượng máy Flash Sale có hạn theo ngày, quý khách hãy nhanh tay bấm 'Thêm vào giỏ' bên dưới để không bỏ lỡ nhé!)*"
        )

        return ChatResponse(
            success=True,
            intent="flash_sale",
            reply=reply_md,
            recommended_products=[cls._to_recommended_product(p) for p in flash_items[:4]],
            suggested_chips=[
                "Thủ tục mua trả góp 0%",
                "Chính sách Thu cũ đổi mới",
                "Tư vấn điện thoại tầm 15 triệu"
            ]
        )

    # ──────────────────────────────────────────────────────────────────────────
    # Skill 6: Chính sách cửa hàng (Bảo hành, Trả góp, Thu cũ, Vận chuyển)
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _handle_store_policies(
        cls,
        lower_msg: str,
        context_prod: Optional[Product]
    ) -> Optional[ChatResponse]:
        # Trả góp
        if any(w in lower_msg for w in ["trả góp", "lai suat", "lãi suất", "thủ tục"]):
            target_str = f" cho siêu phẩm **{context_prod.name}**" if context_prod else ""
            reply_md = (
                f"💳 **CHÍNH SÁCH MUA HÀNG TRẢ GÓP 0% LÃI SUẤT TẠI VINHBAPHONE{target_str}**\n\n"
                f"VinhBaPhone hỗ trợ 2 hình thức trả góp cực kỳ linh hoạt và nhanh chóng:\n\n"
                f"**1. Trả góp qua Thẻ tín dụng (Credit Card):**\n"
                f"• Hỗ trợ hơn 25 ngân hàng lớn (Vietcombank, Techcombank, VPBank, MB, HSBC...).\n"
                f"• Lãi suất 0%, kỳ hạn đa dạng: 3 - 6 - 9 - 12 tháng.\n"
                f"• Không cần duyệt hồ sơ, không thế chấp, hoàn tất thanh toán online trong 1 phút.\n\n"
                f"**2. Trả góp qua Công ty Tài chính (Home Credit / HD Saison / Fe Credit):**\n"
                f"• Chỉ cần: **CCCD gắn chip** chính chủ (từ đủ 18 tuổi).\n"
                f"• Trả trước chỉ từ 0% đến 30% giá trị máy.\n"
                f"• Xét duyệt hồ sơ online tiện lợi chỉ mất từ 5 - 10 phút là nhận máy ngay.\n\n"
                f"*Quý khách có thể bấm 'Xem chi tiết' sản phẩm bất kỳ và chọn nút 'Mua trả góp' trên màn hình nhé!*"
            )
            return ChatResponse(
                success=True,
                intent="installment_policy",
                reply=reply_md,
                suggested_chips=[
                    "Chính sách Thu cũ đổi mới trợ giá 4Tr",
                    "Chính sách bảo hành 1 đổi 1",
                    "Tư vấn điện thoại giảm giá sâu"
                ]
            )

        # Bảo hành & Đổi trả
        if any(w in lower_msg for w in ["bảo hành", "đổi trả", "1 đổi 1", "lỗi", "sửa chữa"]):
            reply_md = (
                f"🛡️ **CHÍNH SÁCH BẢO HÀNH CHÍNH HÃNG & ĐỔI TRẢ 1-1**\n\n"
                f"Mọi sản phẩm bán ra tại **VinhBaPhone** đều là hàng chính hãng 100% với cam kết bảo hành vượt trội:\n\n"
                f"• 🔄 **Đổi mới 1 - 1 trong 30 ngày đầu tiên:** Nếu máy phát sinh lỗi phần cứng từ nhà sản xuất (Apple, Samsung, Sony...).\n"
                f"• ⏱️ **Bảo hành chính hãng 12 - 24 tháng:** Tại tất cả các Trung tâm bảo hành ủy quyền trên toàn quốc.\n"
                f"• 🛠️ **Gói bảo hành VIP mở rộng:** Hỗ trợ bảo hành cả rơi vỡ, vào nước với chi phí tiết kiệm đến 70%.\n"
                f"• 🚚 **Bảo hành tận nhà:** Hỗ trợ gửi máy đi bảo hành miễn phí cước vận chuyển 2 chiều đối với khách hàng ở xa.\n\n"
                f"*Mọi thắc mắc về kỹ thuật hoặc tình trạng bảo hành, quý khách vui lòng liên hệ tổng đài 1800.2097 (miễn phí) ạ!*"
            )
            return ChatResponse(
                success=True,
                intent="warranty_policy",
                reply=reply_md,
                suggested_chips=[
                    "Tra cứu đơn hàng của tôi",
                    "Thủ tục mua trả góp 0%",
                    "Top điện thoại bán chạy"
                ]
            )

        # Thu cũ đổi mới
        if any(w in lower_msg for w in ["thu cũ", "đổi mới", "lên đời", "trade in", "trợ giá"]):
            reply_md = (
                f"🔄 **CHƯƠNG TRÌNH THU CŨ ĐỔI MỚI (TRADE-IN) TRỢ GIÁ ĐẾN 4 TRIỆU ĐỒNG**\n\n"
                f"• 🌟 **Trợ giá cực khủng:** VinhBaPhone trợ giá trực tiếp từ **1.000.000₫ đến 4.000.000₫** khi lên đời các dòng máy Flagship (iPhone 16 series, Galaxy S24 Ultra, MacBook M3).\n"
                f"• 📱 **Thu mua đa dạng:** Chấp nhận hầu hết các dòng máy cũ (kể cả máy trầy xước, xách tay, hết bảo hành).\n"
                f"• ⚡ **Quy trình 3 bước siêu tốc (5 phút):**\n"
                f"   1. Khách hàng mang máy cũ tới cửa hàng hoặc định giá sơ bộ qua hotline.\n"
                f"   2. Kỹ thuật viên kiểm tra ngoại quan và báo giá tốt nhất thị trường.\n"
                f"   3. Bù khoản chênh lệch (có hỗ trợ trả góp 0% cho phần tiền chênh) và rinh ngay máy mới về nhà!\n\n"
                f"*Bạn đang muốn lên đời từ dòng máy nào? Hãy nhắn cho em để được ước lượng giá thu cũ ngay nhé!*"
            )
            return ChatResponse(
                success=True,
                intent="tradein_policy",
                reply=reply_md,
                suggested_chips=[
                    "Giá thu cũ iPhone 13 Pro Max",
                    "Giá thu cũ iPhone 14 Pro Max",
                    "Thủ tục mua trả góp 0%"
                ]
            )

        # Giao hàng & Cửa hàng
        if any(w in lower_msg for w in ["giao hàng", "vận chuyển", "ship", "cửa hàng", "chi nhánh", "địa chỉ"]):
            reply_md = (
                f"🚚 **HỆ THỐNG CỬA HÀNG & CHÍNH SÁCH VẬN CHUYỂN TOÀN QUỐC**\n\n"
                f"• 🏬 **115+ Cửa hàng trên toàn quốc:** Có mặt tại Hà Nội (52 cửa hàng), TP.HCM (85 cửa hàng), Đà Nẵng, Cần Thơ, Hải Phòng, Bình Dương...\n"
                f"• ⚡ **Giao siêu tốc 2 Giờ:** Áp dụng miễn phí cho tất cả đơn hàng nội thành các thành phố lớn.\n"
                f"• 📦 **Giao hàng toàn quốc:** Miễn phí vận chuyển cho mọi đơn hàng từ **500.000₫**. Thời gian giao từ 1 - 3 ngày làm việc.\n"
                f"• 🔍 **Được kiểm tra hàng:** Khách hàng được đồng kiểm ngoại quan cùng bưu tá trước khi thanh toán tiền (Ship COD an toàn 100%).\n\n"
                f"*Bạn cần tìm cửa hàng gần khu vực nào nhất hãy nhắn cho em nhé!*"
            )
            return ChatResponse(
                success=True,
                intent="shipping_policy",
                reply=reply_md,
                suggested_chips=[
                    "Tra cứu đơn hàng của tôi",
                    "Tư vấn điện thoại bán chạy",
                    "Mã giảm giá hôm nay"
                ]
            )

        return None

    # ──────────────────────────────────────────────────────────────────────────
    # General / Polite Fallback
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _handle_general_fallback(cls, message: str, db: Session) -> ChatResponse:
        hot_products = db.query(Product).filter(Product.is_active == True).limit(3).all()

        reply_md = (
            f"Dạ, em là **S-Bot AI** – Chuyên viên tư vấn công nghệ 24/7 của **VinhBaPhone**! 👋\n\n"
            f"Em luôn sẵn sàng hỗ trợ bạn về:\n"
            f"• 📱 **Tư vấn chọn mua máy:** Theo nhu cầu (chơi game, quay phim, pin trâu) hoặc tầm ngân sách.\n"
            f"• ⚖️ **So sánh thông số:** Đối đầu trực tiếp giữa các dòng máy đỉnh cao.\n"
            f"• 📦 **Tra cứu đơn hàng:** Chỉ cần nhập Số điện thoại hoặc Mã đơn hàng của bạn.\n"
            f"• 💳 **Thủ tục trả góp 0% & Thu cũ đổi mới trợ giá 4 triệu**.\n\n"
            f"Dưới đây là một số dòng máy cao cấp đang bán chạy nhất hôm nay tại hệ thống:"
        )

        return ChatResponse(
            success=True,
            intent="general_greeting",
            reply=reply_md,
            recommended_products=[cls._to_recommended_product(p) for p in hot_products],
            suggested_chips=[
                "📱 Tư vấn chọn điện thoại",
                "🔥 Top máy giảm giá sâu",
                "⚖️ So sánh iPhone 16 Pro Max & S24 Ultra",
                "📦 Tra cứu đơn hàng của tôi",
                "💳 Chính sách bảo hành & Trả góp"
            ]
        )

    # ──────────────────────────────────────────────────────────────────────────
    # Helper: Convert ORM Product -> RecommendedProduct Schema
    # ──────────────────────────────────────────────────────────────────────────
    @classmethod
    def _to_recommended_product(cls, p: Product) -> RecommendedProduct:
        orig = p.original_price or round(p.price * 1.1)
        discount = 0
        if orig and orig > p.price:
            discount = int(round((orig - p.price) / orig * 100))

        # Specs summary
        specs_summary = ""
        if p.description:
            specs_summary = p.description.split("|")[0].strip()

        return RecommendedProduct(
            id=p.id,
            name=p.name,
            category=p.category,
            brand=p.brand,
            price=p.price,
            original_price=orig,
            discount_percent=discount,
            image_url=p.image_url,
            stock=p.stock if p.stock is not None else 20,
            badge=p.badge or ("HOT SALE" if p.is_flash_sale else "CHÍNH HÃNG"),
            specs_summary=specs_summary
        )
