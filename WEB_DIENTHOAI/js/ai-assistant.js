// ==========================================================================
// VinhBaPhone Intelligent AI Assistant (S-Bot) - Advanced Smart Edition
// Tech Consultant, NLP Intent Engine, Dynamic Comparison & Shopping Assistant
// ==========================================================================

class CellphonesAIAssistant {
  constructor() {
    this.isOpen = false;
    this.isFullscreen = false;
    this.soundEnabled = true;
    this.audioCtx = null;
    this.history = [];

    // Conversational Context Memory
    this.context = {
      lastCategory: null,
      lastBrand: null,
      lastProducts: [],
      lastActiveProduct: null,
      lastBudget: null,
      lastIntent: null
    };

    // Default Quick Suggestion Prompts (CellphoneS Style Quick Action Chips)
    this.quickPrompts = [
      { label: "🔥 Top máy giảm giá sâu", query: "Các sản phẩm đang Flash Sale giảm sâu nhất hôm nay" },
      { label: "📱 Tư vấn chọn điện thoại", query: "Tư vấn điện thoại tốt nhất tầm 10 đến 15 triệu chơi game mượt pin trâu" },
      { label: "⚖️ So sánh 2 dòng máy", query: "So sánh iPhone 16 Pro Max và Galaxy S24 Ultra" },
      { label: "📦 Tra cứu đơn hàng của tôi", query: "Tôi muốn tra cứu tình trạng đơn hàng của mình" },
      { label: "💳 Chính sách bảo hành & Trả góp", query: "Thủ tục mua hàng trả góp 0% và chính sách bảo hành 1 đổi 1" }
    ];

    this.lastRecommendedProducts = {};
    this.isProcessing = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderQuickTopics();
    this.initWelcomeMessage();
    this.setupTeaserTimer();
  }

  // ──────── Sound Chimes using Web Audio API ────────
  playTone(type = 'receive') {
    if (!this.soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioCtx) this.audioCtx = new AudioContext();

      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'send') {
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else {
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio context permission handled silently
    }
  }

  // ──────── UI Event Handlers ────────
  bindEvents() {
    const launcherBtn = document.getElementById('ai-launcher-btn');
    const headerAiBtn = document.getElementById('btn-header-ai');
    const closeBtn = document.getElementById('ai-close-btn');
    const fullscreenBtn = document.getElementById('ai-fullscreen-btn');
    const soundBtn = document.getElementById('ai-sound-btn');
    const resetBtn = document.getElementById('ai-reset-btn');
    const form = document.getElementById('ai-input-form');
    const input = document.getElementById('ai-input-field');
    const teaserClose = document.getElementById('ai-teaser-close');
    const teaserBubble = document.getElementById('ai-teaser-bubble');

    if (launcherBtn) launcherBtn.addEventListener('click', () => this.toggleChat());
    if (headerAiBtn) headerAiBtn.addEventListener('click', () => this.openChat());
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeChat());
    
    if (teaserClose) {
      teaserClose.addEventListener('click', (e) => {
        e.stopPropagation();
        if (teaserBubble) teaserBubble.style.display = 'none';
      });
    }
    if (teaserBubble) {
      teaserBubble.addEventListener('click', () => {
        teaserBubble.style.display = 'none';
        this.openChat();
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.isFullscreen = !this.isFullscreen;
        const chatWindow = document.getElementById('ai-chat-window');
        if (chatWindow) {
          chatWindow.classList.toggle('fullscreen', this.isFullscreen);
          fullscreenBtn.title = this.isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình';
          fullscreenBtn.innerHTML = this.isFullscreen ? '🗗' : '🗖';
        }
      });
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        soundBtn.classList.toggle('active', this.soundEnabled);
        soundBtn.innerHTML = this.soundEnabled ? '🔔' : '🔕';
        soundBtn.title = this.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh';
        if (typeof cart !== 'undefined') {
          cart.showToast(this.soundEnabled ? 'Đã bật âm thông báo AI 🔔' : 'Đã tắt âm thông báo AI 🔕');
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Bạn có muốn làm mới cuộc trò chuyện với S-Bot không?')) {
          this.resetChat();
        }
      });
    }

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          this.handleUserSubmit(query);
          input.value = '';
        }
      });
    }

    this.renderQuickTopics();
  }

  setupTeaserTimer() {
    setTimeout(() => {
      const teaser = document.getElementById('ai-teaser-bubble');
      if (teaser && !this.isOpen) {
        teaser.style.display = 'flex';
      }
    }, 2800);
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    this.isOpen = true;
    const chatWindow = document.getElementById('ai-chat-window');
    const teaser = document.getElementById('ai-teaser-bubble');
    if (chatWindow) chatWindow.classList.add('active');
    if (teaser) teaser.style.display = 'none';

    setTimeout(() => {
      const input = document.getElementById('ai-input-field');
      if (input && window.innerWidth > 768) input.focus();
      this.scrollToBottom();
    }, 200);
  }

  closeChat() {
    this.isOpen = false;
    const chatWindow = document.getElementById('ai-chat-window');
    if (chatWindow) chatWindow.classList.remove('active');
  }

  renderQuickTopics() {
    const strip = document.getElementById('ai-quick-topics-strip');
    if (!strip) return;

    strip.innerHTML = this.quickPrompts.map(p => `
      <button class="ai-topic-chip" onclick="window.aiAssistant.handleUserSubmit('${p.query.replace(/'/g, "\\'")}')">
        <span>${p.label}</span>
      </button>
    `).join('');
  }

  updateQuickTopics(chips) {
    const strip = document.getElementById('ai-quick-topics-strip');
    if (!strip || !chips || !chips.length) return;

    strip.innerHTML = chips.map(chip => `
      <button class="ai-topic-chip" onclick="window.aiAssistant.handleUserSubmit('${chip.replace(/'/g, "\\'")}')">
        <span>👉 ${chip}</span>
      </button>
    `).join('');
  }

  initWelcomeMessage() {
    const container = document.getElementById('ai-messages-container');
    if (!container) return;

    const welcomeHtml = `
      Xin chào quý khách! 👋 Em là <strong>S-Bot AI</strong> – Trợ lý công nghệ cao cấp tại Hệ thống Bán lẻ Ủy Quyền <strong>VinhBaPhone</strong>.<br/><br/>
      🛡️ <strong>Cam kết vàng tại VinhBaPhone:</strong><br/>
      • <strong>100% Hàng chính hãng VN/A</strong> – Bảo hành điện tử toàn quốc, 1 đổi 1 trong 30 ngày.<br/>
      • ⚡ <strong>Giao hàng siêu tốc 2 giờ</strong> nội thành, đồng kiểm khi nhận & miễn phí vận chuyển.<br/>
      • 💳 <strong>Trả góp 0% lãi suất</strong> qua thẻ tín dụng hoặc CCCD, duyệt nhanh 5 phút.<br/><br/>
      Em có thể hỗ trợ quý khách ngay lập tức:<br/>
      • 📱 <strong>Tư vấn chọn mua</strong> điện thoại, laptop, tablet phù hợp nhất.<br/>
      • ⚖️ <strong>So sánh chi tiết</strong> thông số (Chip, Camera, Màn hình, Pin, Giá bán).<br/>
      • 📦 <strong>Tra cứu vận đơn</strong> & tiến độ xử lý đơn hàng theo mã đơn.<br/>
      • 🔥 <strong>Săn Flash Sale hôm nay</strong> kèm voucher độc quyền đến 500.000₫.<br/><br/>
      <em>Quý khách có thể bấm gợi ý nhanh bên trên hoặc nhập yêu cầu trực tiếp nhé!</em>
    `;

    this.appendBotMessage(welcomeHtml, {
      followups: [
        "Điện thoại nào chụp ảnh đẹp nhất?",
        "Tư vấn laptop sinh viên dưới 20 triệu",
        "Có mã giảm giá nào hôm nay không?",
        "So sánh iPhone 16 Pro Max và Galaxy S24 Ultra"
      ]
    });
  }

  resetChat() {
    const container = document.getElementById('ai-messages-container');
    if (container) container.innerHTML = '';
    this.history = [];
    this.context = {
      lastCategory: null,
      lastBrand: null,
      lastProducts: [],
      lastActiveProduct: null,
      lastBudget: null,
      lastIntent: null
    };
    this.initWelcomeMessage();
  }

  scrollToBottom() {
    const container = document.getElementById('ai-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  // ──────── Markdown & HTML Sanitization Engine ────────
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  formatInlineMarkdown(str) {
    if (!str) return '';
    return str
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/~~(.+?)~~/g, '<del class="text-slate-400">$1</del>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-slate-800 text-cyan-400 rounded text-xs font-mono">$1</code>');
  }

  renderMarkdown(text) {
    if (!text) return '';
    let html = text;

    // 1. Markdown Tables: | col1 | col2 |
    const tableRegex = /((?:\|[^\n]+\|\r?\n?)+)/g;
    html = html.replace(tableRegex, (match) => {
      const lines = match.trim().split(/\r?\n/).filter(l => l.trim().startsWith('|'));
      if (lines.length < 2) return match;

      let tableHtml = '<table class="ai-compare-table"><thead><tr>';
      const headerCells = lines[0].split('|').slice(1, -1);
      headerCells.forEach(cell => {
        tableHtml += `<th>${this.formatInlineMarkdown(cell.trim())}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';

      // Bỏ qua dòng kẻ ngang (|:---|:---|)
      const dataLines = (lines[1].includes('---') || lines[1].includes(':--')) ? lines.slice(2) : lines.slice(1);
      dataLines.forEach(line => {
        const cells = line.split('|').slice(1, -1);
        tableHtml += '<tr>';
        cells.forEach(cell => {
          tableHtml += `<td>${this.formatInlineMarkdown(cell.trim())}</td>`;
        });
        tableHtml += '</tr>';
      });

      tableHtml += '</tbody></table>';
      return tableHtml;
    });

    // 2. Format inline markdown
    html = this.formatInlineMarkdown(html);

    // 3. Bullet lists
    html = html.replace(/^[\s]*[•\-\*]\s+(.+)$/gm, '<li class="ai-msg-li">$1</li>');
    html = html.replace(/(<li[\s\S]+?<\/li>)/g, '<ul class="ai-msg-ul">$1</ul>');
    html = html.replace(/<\/ul>\s*<ul class="ai-msg-ul">/g, '');

    // 4. Line breaks
    html = html.replace(/\n\n/g, '<br/><br/>');
    html = html.replace(/\n/g, '<br/>');
    html = html.replace(/<\/table><br\/>/g, '</table>');
    html = html.replace(/<\/ul><br\/>/g, '</ul>');

    return html;
  }

  // ──────── Message Rendering ────────
  appendUserMessage(text) {
    const container = document.getElementById('ai-messages-container');
    if (!container) return;

    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const row = document.createElement('div');
    row.className = 'ai-msg-row ai-user-msg';
    row.innerHTML = `
      <div class="ai-msg-bubble">
        <div>${this.escapeHtml(text)}</div>
        <span class="ai-msg-time">${timeStr}</span>
      </div>
    `;

    container.appendChild(row);
    this.playTone('send');
    this.scrollToBottom();
  }

  appendBotMessage(contentHtml, options = {}) {
    const container = document.getElementById('ai-messages-container');
    if (!container) return;

    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const row = document.createElement('div');
    row.className = 'ai-msg-row ai-bot-msg';

    let extraHtml = '';

    // Render Order Tracking Card if available
    if (options.orderInfo) {
      extraHtml += this.renderOrderCard(options.orderInfo);
    }

    // Render Product Cards if available
    if (options.products && options.products.length > 0) {
      extraHtml += `
        <div class="ai-chat-products-grid">
          ${options.products.map(p => this.renderChatProductCard(p)).join('')}
        </div>
      `;
    }

    // Render Comparison Table if available
    if (options.comparison) {
      extraHtml += this.renderComparisonBox(options.comparison);
    }

    // Render Coupons if available
    if (options.coupons) {
      extraHtml += options.coupons.map(c => this.renderCouponCard(c)).join('');
    }

    // Render Follow-up Chips
    if (options.followups && options.followups.length > 0) {
      extraHtml += `
        <div class="ai-followup-chips">
          ${options.followups.map(f => `
            <button class="ai-followup-btn" onclick="window.aiAssistant.handleUserSubmit('${f.replace(/'/g, "\\'")}')">
              <span>👉 ${f}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    row.innerHTML = `
      <div class="ai-msg-avatar">🤖</div>
      <div class="ai-msg-bubble">
        <div class="ai-msg-text">${contentHtml}</div>
        ${extraHtml}
        <span class="ai-msg-time">${timeStr} • S-Bot AI Assistant</span>
      </div>
    `;

    container.appendChild(row);
    this.playTone('receive');
    this.scrollToBottom();
  }

  // ──────── Mini Product Card Renderer ────────
  renderChatProductCard(p) {
    if (!this.lastRecommendedProducts) this.lastRecommendedProducts = {};
    this.lastRecommendedProducts[p.id] = p;

    const priceVal = p.price || 0;
    const origVal = p.original_price || p.originalPrice || (priceVal * 1.1);
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceVal);
    const oldPriceHtml = (origVal && origVal > priceVal)
      ? `<span class="ai-chat-prod-old-price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(origVal)}</span>`
      : '';
    const badgeText = p.badge || (p.discount_percent ? `GIẢM ${p.discount_percent}%` : (p.is_flash_sale ? 'HOT DEAL' : 'CHÍNH HÃNG'));
    const imgUrl = p.image_url || p.image || 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png';

    return `
      <div class="ai-chat-prod-card" data-product-id="${p.id}">
        <div class="ai-chat-prod-thumb-wrap">
          <img src="${imgUrl}" alt="${p.name}" class="ai-chat-prod-thumb" loading="lazy" onerror="this.src='https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png'" />
        </div>
        <span class="ai-chat-prod-badge">${badgeText}</span>
        <div class="ai-chat-prod-title" title="${p.name}">${p.name}</div>
        <div class="ai-chat-prod-price-row">
          <span class="ai-chat-prod-price">${formattedPrice}</span>
          ${oldPriceHtml}
        </div>
        <div class="ai-chat-prod-actions">
          <button type="button" class="ai-btn-view-prod cursor-pointer" onclick="window.aiAssistant.viewProductDetail(${p.id}, event)">Xem chi tiết</button>
          <button type="button" class="ai-btn-add-prod cursor-pointer" onclick="window.aiAssistant.addProductToCart(${p.id}, event)">🛒 Thêm vào giỏ</button>
        </div>
      </div>
    `;
  }

  // ──────── Real Order Tracking Card Renderer ────────
  renderOrderCard(order) {
    if (!order) return '';
    const formattedTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_price);
    const itemsHtml = order.items && order.items.length 
      ? order.items.map(it => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11.5px; color: #cbd5e1;">
            <span>• <strong>${it.quantity}x</strong> ${it.product_name} ${it.color ? `(${it.color})` : ''}</span>
            <span style="color: #10b981; font-weight: 700;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(it.price)}</span>
          </div>
        `).join('')
      : '';

    return `
      <div class="ai-chat-order-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: 800; color: #10b981; font-size: 12px;">📦 MÃ ĐƠN: #${order.order_code}</span>
          <span style="background: #10b981; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 99px;">${order.status_label || order.status}</span>
        </div>
        <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px; line-height: 1.5;">
          <div>Khách hàng: <strong style="color: #fff;">${order.customer_name}</strong> (${order.customer_phone})</div>
          <div>Địa chỉ: ${order.customer_address}</div>
          <div>Thời gian: ${order.created_at}</div>
        </div>
        <div style="border-top: 1px dashed rgba(255,255,255,0.12); padding-top: 6px; margin-top: 6px;">
          ${itemsHtml}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; margin-top: 6px;">
          <span style="font-size: 11.5px; color: #cbd5e1;">Tổng thanh toán:</span>
          <span style="font-size: 14px; font-weight: 900; color: #ef4444;">${formattedTotal}</span>
        </div>
      </div>
    `;
  }

  // ──────── E-Commerce Quick Actions ────────
  addProductToCart(productId, e) {
    if (e && e.stopPropagation) e.stopPropagation();

    let product = (typeof APP_DATA !== 'undefined' && APP_DATA.products)
      ? APP_DATA.products.find(p => p.id === productId)
      : null;

    if (!product && this.lastRecommendedProducts && this.lastRecommendedProducts[productId]) {
      const rp = this.lastRecommendedProducts[productId];
      product = {
        id: rp.id,
        name: rp.name,
        price: rp.price,
        originalPrice: rp.original_price || rp.price,
        image: rp.image_url || rp.image,
        category: rp.category,
        brand: rp.brand
      };
    }

    if (product && typeof cart !== 'undefined' && cart.addItem) {
      cart.addItem(product, 1);
      this.playTone('send');
      if (typeof cart.openDrawer === 'function') {
        cart.openDrawer();
      }
    } else if (typeof App !== 'undefined' && App.handleQuickAddToCart) {
      App.handleQuickAddToCart(e || { stopPropagation: () => {} }, productId);
      this.playTone('send');
    }
  }

  viewProductDetail(productId, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof App !== 'undefined' && App.openQuickView) {
      App.openQuickView(productId);
    }
  }

  renderComparisonBox(comp) {
    const p1 = comp.product1;
    const p2 = comp.product2;
    const fPrice1 = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p1.price);
    const fPrice2 = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p2.price);

    return `
      <div class="ai-chat-compare-box">
        <div class="ai-compare-header">
          <span>⚖️ Bảng so sánh thông số kỹ thuật</span>
        </div>
        <table class="ai-compare-table">
          <thead>
            <tr>
              <th style="width: 25%;">Tiêu chí</th>
              <th style="width: 37.5%; color: #00f0ff;">${p1.name}</th>
              <th style="width: 37.5%; color: #bf00ff;">${p2.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Giá bán</strong></td>
              <td><strong style="color: #00f0ff;">${fPrice1}</strong></td>
              <td><strong style="color: #bf00ff;">${fPrice2}</strong></td>
            </tr>
            <tr>
              <td>Màn hình</td>
              <td>${p1.specs ? p1.specs.screen : 'Đang cập nhật'}</td>
              <td>${p2.specs ? p2.specs.screen : 'Đang cập nhật'}</td>
            </tr>
            <tr>
              <td>Vi xử lý (CPU)</td>
              <td>${p1.specs ? p1.specs.cpu : 'Đang cập nhật'}</td>
              <td>${p2.specs ? p2.specs.cpu : 'Đang cập nhật'}</td>
            </tr>
            <tr>
              <td>RAM / Bộ nhớ</td>
              <td>${p1.specs ? `${p1.specs.ram} / ${p1.specs.rom}` : 'Đang cập nhật'}</td>
              <td>${p2.specs ? `${p2.specs.ram} / ${p2.specs.rom}` : 'Đang cập nhật'}</td>
            </tr>
            <tr>
              <td>Camera</td>
              <td>${p1.specs ? p1.specs.camera : 'Đang cập nhật'}</td>
              <td>${p2.specs ? p2.specs.camera : 'Đang cập nhật'}</td>
            </tr>
            <tr>
              <td>Pin & Sạc</td>
              <td>${p1.specs ? p1.specs.battery : 'Đang cập nhật'}</td>
              <td>${p2.specs ? p2.specs.battery : 'Đang cập nhật'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  renderCouponCard(c) {
    return `
      <div class="ai-chat-coupon-card">
        <div class="ai-coupon-info">
          <span class="ai-coupon-code">${c.code}</span>
          <span class="ai-coupon-desc">${c.desc} (Đơn từ ${c.min})</span>
        </div>
        <button class="ai-btn-copy-coupon cursor-pointer" onclick="window.aiAssistant.applyCoupon('${c.code}')">Dùng mã</button>
      </div>
    `;
  }

  applyCoupon(code) {
    if (typeof cart !== 'undefined') {
      const input = document.getElementById('coupon-input');
      if (input) input.value = code;
      cart.applyCoupon(code);
      cart.openCart();
    }
  }

  showTypingIndicator() {
    const container = document.getElementById('ai-messages-container');
    if (!container) return;

    const typingEl = document.createElement('div');
    typingEl.id = 'ai-typing-indicator';
    typingEl.className = 'ai-msg-row ai-bot-msg';
    typingEl.innerHTML = `
      <div class="ai-msg-avatar">🤖</div>
      <div class="ai-typing-indicator">
        <div class="ai-typing-dot"></div>
        <div class="ai-typing-dot"></div>
        <div class="ai-typing-dot"></div>
        <span class="ai-typing-text">S-Bot đang phân tích dữ liệu sản phẩm...</span>
      </div>
    `;
    container.appendChild(typingEl);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const el = document.getElementById('ai-typing-indicator');
    if (el) el.remove();
  }

  // ──────── Natural Language Query Engine ────────
  async handleUserSubmit(rawQuery) {
    if (!rawQuery || !rawQuery.trim() || this.isProcessing) return;
    const query = rawQuery.trim();
    this.isProcessing = true;

    const input = document.getElementById('ai-input-field');
    if (input) input.value = '';

    this.appendUserMessage(query);
    this.history.push({ role: 'user', content: query });
    this.showTypingIndicator();

    // 1. Gửi request đến FastAPI Backend API: /api/chat
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversation_history: this.history.slice(-8)
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.removeTypingIndicator();

        const formattedHtml = this.renderMarkdown(data.reply);
        this.appendBotMessage(formattedHtml, {
          products: data.recommended_products || [],
          orderInfo: data.order_info || null,
          followups: data.suggested_chips || []
        });

        this.history.push({ role: 'assistant', content: data.reply });

        if (data.suggested_chips && data.suggested_chips.length > 0) {
          this.updateQuickTopics(data.suggested_chips);
        }
        this.isProcessing = false;
        return;
      }
    } catch (e) {
      console.warn('[S-Bot] Kết nối Backend /api/chat không khả dụng, kích hoạt Smart Local Engine fallback:', e);
    }

    // 2. Fallback sang Smart Local Search Engine nếu offline hoặc file://
    const delay = Math.floor(Math.random() * 200) + 350;
    setTimeout(() => {
      this.removeTypingIndicator();
      this.processQuery(query);
      this.isProcessing = false;
    }, delay);
  }

  processQuery(query) {
    const q = query.toLowerCase();
    const products = (typeof APP_DATA !== 'undefined' && APP_DATA.products) ? APP_DATA.products : [];

    // Check Multi-turn context intent first
    if (this.handleContextContinuation(q, products)) {
      return;
    }

    // 1. Comparison Intent (So sánh sản phẩm)
    if (q.includes('so sánh') || q.includes('vs') || q.includes('khác nhau') || (q.includes('nên mua') && (q.includes('hay') || q.includes('hoặc')))) {
      const compared = this.findProductsToCompare(q, products);
      if (compared.length >= 2) {
        const p1 = compared[0];
        const p2 = compared[1];
        const advice = this.generateComparisonAdvice(p1, p2);

        this.context.lastProducts = [p1, p2];
        this.context.lastActiveProduct = p1;
        this.context.lastCategory = p1.category;
        this.context.lastIntent = 'compare';

        this.appendBotMessage(`
          Dạ, đây là bảng so sánh chi tiết giữa <strong>${p1.name}</strong> và <strong>${p2.name}</strong> để bạn dễ dàng đưa ra quyết định:
          <br/><br/>
          💡 <strong>Nhận định chuyên môn từ S-Bot:</strong><br/>
          ${advice}
        `, {
          comparison: { product1: p1, product2: p2 },
          products: [p1, p2],
          followups: [
            `Xem màu sắc của ${p1.name}`,
            `Xem màu sắc của ${p2.name}`,
            "Chính sách bảo hành 1 đổi 1",
            "Mã giảm giá hôm nay"
          ]
        });
        return;
      }
    }

    // 2. Flash Sale / Hot Sale Intent
    if (q.includes('flash sale') || q.includes('hotsale') || q.includes('giảm giá sốc') || q.includes('sale') || q.includes('giảm sâu') || q.includes('cuối tuần') || q.includes('xả kho')) {
      const flashItems = products.filter(p => p.isFlashSale);
      this.context.lastProducts = flashItems;
      this.context.lastIntent = 'flash_sale';

      this.appendBotMessage(`
        🔥 <strong>HOT SALE CUỐI TUẦN - GIÁ SỐC ĐANG DIỄN RA TẠI VINHBAPHONE!</strong><br/><br/>
        Hiện tại đang có <strong>${flashItems.length} siêu phẩm</strong> được trợ giá cực mạnh lên đến <strong>20%</strong> kèm ưu đãi Trả góp 0% và quà tặng độc quyền. Dưới đây là các sản phẩm hot nhất:
      `, {
        products: flashItems.slice(0, 4),
        followups: [
          "Mã giảm giá áp dụng thêm",
          "Điện thoại nào pin trâu nhất?",
          "Chính sách Thu cũ đổi mới trợ giá 4 triệu"
        ]
      });
      return;
    }

    // 3. Voucher / Discount Code Intent
    if (q.includes('mã giảm') || q.includes('voucher') || q.includes('khuyến mãi') || q.includes('coupon') || q.includes('code') || q.includes('ưu đãi')) {
      const coupons = [
        { code: 'VINHBA50', desc: 'Giảm 50.000₫ cho đơn từ 500.000₫', min: '500.000₫' },
        { code: 'VINHMEMBER', desc: 'Giảm 100.000₫ đặc quyền hội viên VinhMember', min: '2.000.000₫' },
        { code: 'TECH500', desc: 'Giảm 500.000₫ cho đơn hàng flagship từ 10.000.000₫', min: '10.000.000₫' }
      ];

      this.appendBotMessage(`
        🎁 <strong>CÁC MÃ GIẢM GIÁ ĐANG ÁP DỤNG HÔM NAY TẠI VINHBAPHONE:</strong><br/><br/>
        Bạn có thể bấm <strong>"Dùng mã"</strong> để hệ thống tự động áp dụng trực tiếp vào Giỏ hàng của mình ngay lập tức:
      `, {
        coupons: coupons,
        followups: [
          "Các sản phẩm đang Flash Sale",
          "Đặc quyền thành viên VinhMember",
          "Tôi muốn tra cứu đơn hàng"
        ]
      });
      return;
    }

    // 4. Budget-based recommendations (Nhận diện giá tiếng Việt thông minh: "dưới 10 củ", "tầm 15tr", "từ 8 đến 12 triệu"...)
    const budgetMatch = this.extractBudget(q);
    if (budgetMatch) {
      let filtered = products;

      // Filter by category if specified
      if (q.includes('laptop') || q.includes('máy tính') || q.includes('macbook')) {
        filtered = filtered.filter(p => p.category === 'laptop');
        this.context.lastCategory = 'laptop';
      } else if (q.includes('tai nghe') || q.includes('loa') || q.includes('âm thanh')) {
        filtered = filtered.filter(p => p.category === 'audio');
        this.context.lastCategory = 'audio';
      } else if (q.includes('ipad') || q.includes('máy tính bảng') || q.includes('tablet')) {
        filtered = filtered.filter(p => p.category === 'tablet');
        this.context.lastCategory = 'tablet';
      } else if (q.includes('đồng hồ') || q.includes('watch')) {
        filtered = filtered.filter(p => p.category === 'watch');
        this.context.lastCategory = 'watch';
      } else {
        filtered = filtered.filter(p => p.category === 'phone');
        this.context.lastCategory = 'phone';
      }

      // Filter by brand if mentioned
      if (q.includes('apple') || q.includes('iphone')) filtered = filtered.filter(p => p.brand === 'Apple');
      if (q.includes('samsung')) filtered = filtered.filter(p => p.brand === 'Samsung');
      if (q.includes('xiaomi')) filtered = filtered.filter(p => p.brand === 'Xiaomi');

      // Filter by price range
      if (budgetMatch.max) filtered = filtered.filter(p => p.price <= budgetMatch.max);
      if (budgetMatch.min) filtered = filtered.filter(p => p.price >= budgetMatch.min);

      filtered.sort((a, b) => b.price - a.price);

      if (filtered.length > 0) {
        const top = filtered.slice(0, 4);
        this.context.lastProducts = top;
        this.context.lastActiveProduct = top[0];
        this.context.lastBudget = budgetMatch;

        this.appendBotMessage(`
          Dạ, với mức ngân sách <strong>${budgetMatch.label}</strong>, S-Bot xin gợi ý các sản phẩm xuất sắc và bán chạy nhất tại hệ thống:<br/><br/>
          ✨ Tất cả sản phẩm đều là <strong>hàng chính hãng VN/A, bảo hành 12-24 tháng</strong>, hỗ trợ <strong>Thu cũ trợ giá 4 triệu</strong> và <strong>Trả góp 0%</strong>:
        `, {
          products: top,
          followups: [
            `Đánh giá chi tiết ${top[0].name}`,
            "Có máy nào giảm giá sâu hơn không?",
            "Thủ tục mua trả góp 0%",
            "Mã giảm giá hôm nay"
          ]
        });
        return;
      }
    }

    // 5. Specific Feature & Use-case Intents
    // 5a. Chụp ảnh / Camera / Quay phim / TikTok
    if (q.includes('chụp ảnh') || q.includes('camera') || q.includes('quay phim') || q.includes('sống ảo') || q.includes('quay video') || q.includes('tiktok')) {
      const cameraPhones = products.filter(p =>
        p.id === 101 || p.id === 102 || p.id === 103 || (p.category === 'phone' && (p.brand === 'Apple' || p.brand === 'Samsung' || p.brand === 'Xiaomi'))
      ).slice(0, 3);

      this.context.lastProducts = cameraPhones;
      this.context.lastActiveProduct = cameraPhones[0];

      this.appendBotMessage(`
        📸 <strong>TOP ĐIỆN THOẠI CHỤP ẢNH & QUAY VIDEO ĐỈNH CAO NHẤT HIỆN NAY:</strong><br/><br/>
        • <strong>iPhone 16 Pro Max:</strong> Cảm biến Fusion 48MP thế hệ mới, phím bấm Camera Control chuyên nghiệp, quay phim 4K 120fps Dolby Vision chuẩn Hollywood.<br/>
        • <strong>Galaxy S24 Ultra:</strong> Camera chính 200MP siêu chi tiết, Zoom quang học 100x đỉnh nóc, bộ công cụ Galaxy AI xóa vật thể và nâng cấp ảnh trong 1 chạm.<br/>
        • <strong>Xiaomi 14:</strong> Hệ thống ống kính quang học Leica Summilux huyền thoại, cảm biến Light Fusion 900 tái hiện màu sắc và tương phản đậm chất nghệ thuật.
      `, {
        products: cameraPhones,
        followups: [
          "So sánh iPhone 16 Pro Max và Galaxy S24 Ultra",
          "Có máy chụp ảnh đẹp dưới 15 triệu không?",
          "Chính sách bảo hành 1 đổi 1"
        ]
      });
      return;
    }

    // 5b. Chơi game / Gaming / Cấu hình khủng / Pin trâu
    if (q.includes('chơi game') || q.includes('gaming') || q.includes('pin trâu') || q.includes('mạnh nhất') || q.includes('cấu hình cao') || q.includes('genshin') || q.includes('pubg') || q.includes('liên quân')) {
      const gamingDevices = products.filter(p =>
        (p.category === 'phone' && (p.brand === 'Samsung' || p.brand === 'Apple' || p.brand === 'Xiaomi')) ||
        (p.category === 'laptop' && (p.name.includes('Gaming') || p.name.includes('Legion') || p.name.includes('TUF')))
      ).slice(0, 3);

      this.context.lastProducts = gamingDevices;
      this.context.lastActiveProduct = gamingDevices[0];

      this.appendBotMessage(`
        ⚡ <strong>THIẾT BỊ CẤU HÌNH KHỦNG - MÀN HÌNH 120HZ - PIN TRÂU CHIẾN GAME:</strong><br/><br/>
        Nếu bạn cần thiết bị cân mượt mà các tựa game nặng như Genshin Impact, PUBG, Liên Quân max setting 120FPS thì đây là các lựa chọn hàng đầu:
      `, {
        products: gamingDevices,
        followups: [
          "So sánh ASUS TUF Gaming và Legion Pro",
          "Điện thoại pin trâu dưới 10 triệu",
          "Mã giảm giá áp dụng hôm nay"
        ]
      });
      return;
    }

    // 5c. Laptop sinh viên / Lập trình IT / Văn phòng / Mỏng nhẹ
    if (q.includes('laptop') || q.includes('macbook') || q.includes('máy tính xách tay') || q.includes('sinh viên') || q.includes('học tập') || q.includes('văn phòng') || q.includes('lập trình') || q.includes('it') || q.includes('đồ họa')) {
      const laptops = products.filter(p => p.category === 'laptop').slice(0, 4);
      this.context.lastProducts = laptops;
      this.context.lastActiveProduct = laptops[0];
      this.context.lastCategory = 'laptop';

      this.appendBotMessage(`
        💻 <strong>LAPTOP HỌC TẬP, LẬP TRÌNH & ĐỒ HỌA BÁN CHẠY NHẤT:</strong><br/><br/>
        Hệ thống đang có chương trình đặc quyền <strong>Học sinh - Sinh viên (S-Student)</strong> giảm thêm đến <strong>5%</strong> + Trả góp 0% duyệt hồ sơ nhanh qua CCCD:
      `, {
        products: laptops,
        followups: [
          "MacBook Pro M4 có tốt cho lập trình không?",
          "Laptop gaming dưới 25 triệu",
          "Mã giảm giá TECH500"
        ]
      });
      return;
    }

    // 5d. Tai nghe, Âm thanh, Loa
    if (q.includes('tai nghe') || q.includes('loa') || q.includes('marshall') || q.includes('airpods') || q.includes('âm thanh') || q.includes('chống ồn') || q.includes('sony')) {
      const audioList = products.filter(p => p.category === 'audio').slice(0, 3);
      this.context.lastProducts = audioList;
      this.context.lastActiveProduct = audioList[0];
      this.context.lastCategory = 'audio';

      this.appendBotMessage(`
        🎧 <strong>THIẾT BỊ ÂM THANH CHÍNH HÃNG UY TÍN TẠI VINHBAPHONE:</strong><br/><br/>
        Từ tai nghe chống ồn chủ động ANC hàng đầu (AirPods Pro 2, Sony WH-1000XM5) đến dòng loa Bluetooth phong cách Vintage đỉnh cao Marshall:
      `, {
        products: audioList,
        followups: [
          "AirPods Pro 2 có tính năng gì nổi bật?",
          "Loa Marshall Stanmore III chính hãng giá bao nhiêu?",
          "Flash sale âm thanh hôm nay"
        ]
      });
      return;
    }

    // 6. Thu cũ đổi mới
    if (q.includes('thu cũ') || q.includes('lên đời') || q.includes('đổi mới') || q.includes('trợ giá 4 triệu') || q.includes('trade in')) {
      this.appendBotMessage(`
        🔄 <strong>CHƯƠNG TRÌNH THU CŨ ĐỔI MỚI - LÊN ĐỜI SIÊU PHẨM TẠI VINHBAPHONE:</strong><br/><br/>
        • <strong>Trợ giá cực khủng:</strong> Hỗ trợ thêm lên đến <strong>4.000.000₫</strong> khi lên đời iPhone 16 Series hoặc Galaxy S24/S25 Ultra.<br/>
        • <strong>Định giá máy siêu tốc:</strong> Kiểm tra ngoại hình và chức năng máy chỉ trong <strong>5 phút</strong>.<br/>
        • <strong>Chấp nhận máy cũ đa dạng:</strong> Nhận cả máy xách tay, máy trầy xước, không còn hộp hay phụ kiện.<br/>
        • <strong>Quy trình đơn giản:</strong> Bù tiền chênh lệch hoặc chuyển đổi sang hình thức <strong>Trả góp 0%</strong> phần còn lại!<br/><br/>
        Bạn chỉ cần mang máy đến bất kỳ chi nhánh Showroom VinhBaPhone gần nhất để kỹ thuật viên kiểm tra và báo giá ngay nhé!
      `, {
        followups: [
          "Xem giá iPhone 16 Pro Max",
          "Xem giá Galaxy S25 Ultra AI",
          "Tìm cửa hàng gần nhất"
        ]
      });
      return;
    }

    // 7. Trả góp 0%
    if (q.includes('trả góp') || q.includes('hồ sơ trả góp') || q.includes('lãi suất') || q.includes('thẻ tín dụng') || q.includes('cccd')) {
      this.appendBotMessage(`
        💳 <strong>CHÍNH SÁCH MUA HÀNG TRẢ GÓP 0% LÃI SUẤT:</strong><br/><br/>
        • <strong>Qua Thẻ tín dụng (Visa, Master):</strong> Hỗ trợ hơn 25 ngân hàng, 0% lãi suất, kỳ hạn linh hoạt 3 - 6 - 9 - 12 tháng, không mất phí chuyển đổi.<br/>
        • <strong>Qua Công ty tài chính (CCCD):</strong> Hỗ trợ Home Credit, FE Credit, Kredivo, Shinhan... Chỉ cần <strong>CCCD gắn chip</strong> từ 18 tuổi, duyệt hồ sơ online trong <strong>5 phút</strong>, không cần chứng minh thu nhập!<br/>
        • <strong>Trả trước từ 0 đồng:</strong> Nhiều dòng sản phẩm hỗ trợ nhận máy ngay không cần trả trước.
      `, {
        followups: [
          "Tư vấn điện thoại trả góp 0%",
          "Xem sản phẩm Flash Sale",
          "Mã giảm giá hôm nay"
        ]
      });
      return;
    }

    // 8. Chính sách VinhMember
    if (q.includes('vinhmember') || q.includes('smember') || q.includes('hội viên') || q.includes('thành viên') || q.includes('tích điểm')) {
      this.appendBotMessage(`
        👑 <strong>ĐẶC QUYỀN HỘI VIÊN VINHMEMBER TẠI VINHBAPHONE:</strong><br/><br/>
        Chương trình khách hàng thân thiết với 3 hạng thẻ đẳng cấp:<br/>
        • 🥉 <strong>Vinh-Standard:</strong> Dành cho khách hàng mới, tích lũy 0.5% điểm thưởng, nhận quà chào mừng.<br/>
        • 🥈 <strong>Vinh-Gold (tích lũy từ 5 triệu):</strong> Giảm thêm đến <strong>300.000₫</strong>, quà sinh nhật đặc biệt, miễn phí vệ sinh máy trọn đời.<br/>
        • 👑 <strong>Vinh-Diamond (tích lũy từ 20 triệu):</strong> Giảm thêm đến <strong>1.000.000₫</strong>, trợ giá thu cũ thêm 5%, ưu tiên phục vụ và bảo hành VIP.<br/><br/>
        Điểm thưởng VinhMember có thể quy đổi trực tiếp thành tiền giảm giá cho mọi đơn hàng tiếp theo!
      `, {
        followups: [
          "Mã giảm giá VINHMEMBER",
          "Các sản phẩm Flash Sale hot nhất",
          "Tư vấn điện thoại tốt nhất"
        ]
      });
      return;
    }

    // 9. Bảo hành & Đổi trả
    if (q.includes('bảo hành') || q.includes('đổi trả') || q.includes('lỗi') || q.includes('sửa chữa') || q.includes('1 đổi 1')) {
      this.appendBotMessage(`
        🛡️ <strong>CHÍNH SÁCH BẢO HÀNH & ĐỔI TRẢ CHÍNH HÃNG:</strong><br/><br/>
        • <strong>1 ĐỔI 1 TRONG 30 NGÀY ĐẦU:</strong> Nếu sản phẩm phát sinh lỗi phần cứng từ nhà sản xuất.<br/>
        • <strong>BẢO HÀNH CHÍNH HÃNG 12 - 24 THÁNG:</strong> Tại các trung tâm bảo hành ủy quyền của Apple (CareS), Samsung, Xiaomi, ASUS... trên toàn quốc.<br/>
        • <strong>GÓI BẢO HÀNH MỞ RỘNG:</strong> Hỗ trợ bảo hành rơi vỡ, ngấm nước VIP và bảo hành 1 đổi 1 trong 12 tháng chỉ từ vài trăm nghìn đồng.
      `, {
        followups: [
          "Tìm trung tâm bảo hành gần bạn",
          "Hotline hỗ trợ kỹ thuật",
          "Xem giỏ hàng của tôi"
        ]
      });
      return;
    }

    // 10. Tra cứu đơn hàng
    if (q.includes('tra cứu đơn') || q.includes('đơn hàng') || q.includes('vận chuyển') || q.includes('ship') || q.includes('giao hàng') || q.match(/(?:vbp|cps)\d+/i) || q.match(/0\d{8,10}/)) {
      const savedOrders = JSON.parse(localStorage.getItem('vinhbaphone_orders') || '[]');
      let matchedOrder = null;

      const codeMatch = q.match(/(?:vbp|cps)\d+/i);
      const phoneMatch = q.match(/0\d{8,10}/);

      if (codeMatch) {
        matchedOrder = savedOrders.find(o => (o.orderId || '').toLowerCase() === codeMatch[0].toLowerCase());
      } else if (phoneMatch) {
        matchedOrder = savedOrders.find(o => o.customer && o.customer.phone === phoneMatch[0]);
      } else if (savedOrders.length > 0) {
        matchedOrder = savedOrders[0];
      }

      if (matchedOrder) {
        const fTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(matchedOrder.total);
        this.appendBotMessage(`
          🚚 <strong>THÔNG TIN ĐƠN HÀNG CỦA BẠN:</strong><br/><br/>
          • Mã đơn: <strong>${matchedOrder.orderId}</strong><br/>
          • Người nhận: <strong>${matchedOrder.customer ? matchedOrder.customer.name : 'Khách hàng'}</strong> (${matchedOrder.customer ? matchedOrder.customer.phone : ''})<br/>
          • Trạng thái: 🟢 <strong>${matchedOrder.status || 'Đang đóng gói & chuẩn bị giao hỏa tốc 2h'}</strong><br/>
          • Tổng tiền: <strong>${fTotal}</strong> (${matchedOrder.payment || matchedOrder.paymentMethod || 'COD'})<br/>
          • Địa chỉ: ${matchedOrder.customer ? matchedOrder.customer.address : 'Giao tận nơi'}<br/><br/>
          <button type="button" onclick="window.aiAssistant.closeChat(); App.openTrackModalWithCode('${matchedOrder.orderId}')" style="padding:6px 12px; background:#2563eb; color:#fff; border-radius:8px; font-weight:700; font-size:12px; border:none; cursor:pointer;">🔍 Xem tiến độ chi tiết đơn ${matchedOrder.orderId}</button>
        `, {
          followups: ["Cần hỗ trợ đổi địa chỉ nhận", "Tổng đài hỗ trợ 1800.2097", "Tiếp tục mua sắm"]
        });
        return;
      } else {
        const lookupTarget = codeMatch ? codeMatch[0].toUpperCase() : (phoneMatch ? phoneMatch[0] : '');
        this.appendBotMessage(`
          🚚 <strong>TRA CỨU HÀNH TRÌNH ĐƠN HÀNG:</strong><br/><br/>
          Bạn có thể nhập trực tiếp <strong>Mã đơn hàng</strong> (Ví dụ: <code>VBP000001</code>) hoặc <strong>Số điện thoại đặt hàng</strong> (Ví dụ: <code>0363620913</code>) để kiểm tra trạng thái thời gian thực!<br/><br/>
          <button type="button" onclick="window.aiAssistant.closeChat(); ${lookupTarget ? `App.openTrackModalWithCode('${lookupTarget}')` : 'App.openTrackModal()'}" style="padding:7px 14px; background:#2563eb; color:#fff; border-radius:8px; font-weight:700; font-size:12px; border:none; cursor:pointer;">🔍 Mở bảng Tra cứu đơn hàng ngay</button>
        `, {
          followups: ["Mã giảm giá hôm nay", "Cửa hàng gần bạn", "Hotline hỗ trợ miễn phí"]
        });
        return;
      }
    }

    // 11. Cửa hàng / Hotline / Địa chỉ
    if (q.includes('cửa hàng') || q.includes('địa chỉ') || q.includes('chi nhánh') || q.includes('hotline') || q.includes('số điện thoại') || q.includes('tổng đài')) {
      this.appendBotMessage(`
        📍 <strong>HỆ THỐNG 115+ SHOWROOM VINHBAPHONE TRÊN TOÀN QUỐC:</strong><br/><br/>
        • <strong>Hồ Chí Minh:</strong> Hơn 85 cửa hàng tại tất cả các quận huyện.<br/>
        • <strong>Hà Nội:</strong> Hơn 52 cửa hàng tại các tuyến phố công nghệ lớn.<br/>
        • <strong>Đà Nẵng, Bình Dương, Hải Phòng, Cần Thơ, Vũng Tàu...</strong><br/><br/>
        ⏰ <strong>Thời gian mở cửa:</strong> 8h00 - 22h00 tất cả các ngày trong tuần (kể cả Lễ, Tết).<br/>
        📞 <strong>Tổng đài hỗ trợ miễn cước cuộc gọi:</strong><br/>
        - Gọi mua hàng: <strong>1800.2097</strong> (7h30 - 22h00)<br/>
        - Khiếu nại dịch vụ: <strong>1800.2063</strong> (8h00 - 21h30)<br/>
        - Bảo hành kỹ thuật: <strong>1800.2064</strong> (8h00 - 21h00)
      `, {
        followups: ["Xem bảng giá iPhone 16", "Xem bảng giá Galaxy S25", "Chính sách bảo hành 1 đổi 1"]
      });
      return;
    }

    // 12. Greetings & Polite chat
    if (q.includes('chào') || q.includes('hello') || q.includes('hi') || q.includes('bạn là ai') || q.includes('alo')) {
      this.appendBotMessage(`
        Dạ chào bạn! Em là <strong>S-Bot AI</strong> – Trợ lý tư vấn công nghệ của hệ thống bán lẻ VinhBaPhone.<br/><br/>
        Bạn đang quan tâm đến sản phẩm nào (Điện thoại, Laptop, Tablet, Phụ kiện) hay cần tư vấn tầm giá bao nhiêu ạ? Em luôn sẵn sàng hỗ trợ 24/7! 😊
      `, {
        followups: [
          "Tư vấn điện thoại dưới 10 triệu",
          "Tư vấn iPhone mới nhất",
          "Sản phẩm Flash Sale hôm nay",
          "Mã giảm giá hôm nay"
        ]
      });
      return;
    }

    // 13. Thank you & Praise
    if (q.includes('cảm ơn') || q.includes('thanks') || q.includes('hay quá') || q.includes('tốt') || q.includes('oke') || q.includes('ok')) {
      this.appendBotMessage(`
        Dạ không có chi ạ! Rất vui được đồng hành và hỗ trợ bạn tại <strong>VinhBaPhone</strong>. Chúc bạn chọn được sản phẩm công nghệ ưng ý với giá tốt nhất! ❤️<br/><br/>
        Nếu có thêm bất kỳ thắc mắc nào, bạn cứ nhắn tin cho em bất cứ lúc nào nhé!
      `, {
        followups: [
          "Xem giỏ hàng của tôi",
          "Săn Flash Sale cuối tuần",
          "Đặc quyền thành viên Smember"
        ]
      });
      return;
    }

    // 14. Fallback Smart Product Search Match
    const matchedProducts = this.searchRelevantProducts(q, products);
    if (matchedProducts.length > 0) {
      this.context.lastProducts = matchedProducts;
      this.context.lastActiveProduct = matchedProducts[0];

      this.appendBotMessage(`
        Dạ, dựa trên tìm kiếm của bạn về <em>"${this.escapeHtml(query)}"</em>, S-Bot tìm thấy các sản phẩm phù hợp nhất dưới đây:
      `, {
        products: matchedProducts.slice(0, 4),
        followups: [
          `Xem chi tiết ${matchedProducts[0].name}`,
          "So sánh với các máy cùng tầm giá",
          "Chính sách bảo hành và trả góp",
          "Mã giảm giá hôm nay"
        ]
      });
      return;
    }

    // 15. General Conversational Fallback with Helpful Guidance
    this.appendBotMessage(`
      Dạ, em đã ghi nhận yêu cầu của bạn: <em>"${this.escapeHtml(query)}"</em>.<br/><br/>
      Tại <strong>VinhBaPhone</strong>, 100% sản phẩm điện thoại, laptop, phụ kiện đều là <strong>hàng chính hãng VN/A</strong>, bảo hành đầy đủ và hỗ trợ <strong>1 đổi 1 trong 30 ngày</strong> nếu có lỗi nhà sản xuất.<br/><br/>
      Bạn có thể chia sẻ thêm cho em về <strong>tầm giá mong muốn</strong> hoặc <strong>nhu cầu sử dụng (chụp ảnh, chơi game, học tập, văn phòng...)</strong> để em gợi ý máy chuẩn xác nhất nhé!
    `, {
      followups: [
        "Tư vấn điện thoại dưới 15 triệu",
        "Tư vấn laptop học tập sinh viên",
        "Xem sản phẩm Flash Sale hot nhất",
        "Các mã giảm giá hôm nay"
      ]
    });
  }

  // ──────── Multi-turn Context Follow-up Handler ────────
  handleContextContinuation(q, products) {
    const ctx = this.context;
    if (!ctx.lastActiveProduct && ctx.lastProducts.length === 0) return false;

    const activeProd = ctx.lastActiveProduct || ctx.lastProducts[0];

    // Follow-up: "có màu gì?", "màu sắc"
    if (q.includes('màu gì') || q.includes('màu sắc') || q.includes('màu')) {
      if (activeProd && activeProd.colors) {
        this.appendBotMessage(`
          🎨 <strong>TÙY CHỌN MÀU SẮC CHO ${activeProd.name}:</strong><br/><br/>
          Sản phẩm hiện đang có sẵn các phiên bản màu chính hãng:<br/>
          ${activeProd.colors.map(c => `• <strong>${c}</strong> (Sẵn hàng giao ngay)`).join('<br/>')}<br/><br/>
          Bạn có thể nhấn nút <strong>"Chi tiết"</strong> bên dưới để xem ảnh thực tế từng màu và đặt mua nhé!
        `, {
          products: [activeProd],
          followups: [
            `Xem các bản bộ nhớ của ${activeProd.name}`,
            "Mua trả góp 0%",
            "Mã giảm giá hôm nay"
          ]
        });
        return true;
      }
    }

    // Follow-up: "có bản bao nhiêu gb?", "dung lượng", "bộ nhớ"
    if (q.includes('dung lượng') || q.includes('bộ nhớ') || q.includes('bao nhiêu gb') || q.includes('ram')) {
      if (activeProd && activeProd.storageOptions) {
        this.appendBotMessage(`
          💾 <strong>CÁC PHIÊN BẢN BỘ NHỚ CỦA ${activeProd.name}:</strong><br/><br/>
          ${activeProd.storageOptions.map(s => `• Phiên bản <strong>${s}</strong>`).join('<br/>')}<br/><br/>
          • RAM: <strong>${activeProd.specs?.ram || 'Tối ưu siêu mượt'}</strong><br/>
          • Vi xử lý: <strong>${activeProd.specs?.cpu || 'Mạnh mẽ'}</strong>
        `, {
          products: [activeProd],
          followups: [
            `Đặt mua ${activeProd.name}`,
            "Chính sách Thu cũ đổi mới trợ giá 4 triệu",
            "Mã giảm giá áp dụng"
          ]
        });
        return true;
      }
    }

    // Follow-up: "có rẻ hơn không?", "máy rẻ hơn"
    if (q.includes('rẻ hơn') || q.includes('thấp hơn') || q.includes('ít tiền hơn')) {
      const currentCat = activeProd ? activeProd.category : (ctx.lastCategory || 'phone');
      const maxPrice = activeProd ? activeProd.price : 20000000;
      const cheaperList = products
        .filter(p => p.category === currentCat && p.price < maxPrice)
        .sort((a, b) => b.price - a.price)
        .slice(0, 3);

      if (cheaperList.length > 0) {
        this.context.lastProducts = cheaperList;
        this.context.lastActiveProduct = cheaperList[0];

        this.appendBotMessage(`
          Dạ, ở phân khúc giá mềm hơn nhưng vẫn sở hữu hiệu năng rất tốt, S-Bot xin gợi ý các model sau:
        `, {
          products: cheaperList,
          followups: [
            `Đánh giá chi tiết ${cheaperList[0].name}`,
            "Chính sách bảo hành 1 đổi 1",
            "Mã giảm giá hôm nay"
          ]
        });
        return true;
      }
    }

    // Follow-up: "chi tiết", "đánh giá", "có tốt không" cho sản phẩm vừa nói
    if (q.includes('đánh giá') || q.includes('có tốt không') || q.includes('chi tiết hơn') || q.includes('ưu điểm')) {
      if (activeProd) {
        this.appendBotMessage(`
          📱 <strong>ĐÁNH GIÁ CHUYÊN SÂU SẢN PHẨM ${activeProd.name}:</strong><br/><br/>
          • <strong>Điểm mạnh:</strong> ${activeProd.promoText || 'Hiệu năng cao, màn hình sắc nét, camera chuẩn chuyên nghiệp'}.<br/>
          • <strong>Màn hình:</strong> ${activeProd.specs?.screen || 'Hiển thị rực rỡ, độ sáng cao'}.<br/>
          • <strong>Chip xử lý:</strong> ${activeProd.specs?.cpu || 'Mạnh mẽ hàng đầu'}.<br/>
          • <strong>Thời lượng pin:</strong> ${activeProd.specs?.battery || 'Pin trâu dùng cả ngày kèm sạc nhanh'}.<br/>
          ${activeProd.rating ? `• <strong>Đánh giá thực tế:</strong> ⭐ <strong>${activeProd.rating}/5</strong> (${activeProd.reviewsCount || 0} lượt đánh giá thực tế).<br/>` : ''}
          • <strong>Chế độ bảo hành:</strong> Chính hãng 100% nguyên seal, bảo hành 12 tháng tại trung tâm ủy quyền.
        `, {
          products: [activeProd],
          followups: [
            `Đặt mua ${activeProd.name}`,
            "Thủ tục trả góp 0%",
            "Mã giảm giá hôm nay"
          ]
        });
        return true;
      }
    }

    return false;
  }

  // ──────── Natural Language Budget Parser ────────
  extractBudget(q) {
    // "dưới 5 củ", "dưới 5tr", "5 triệu"
    if (q.includes('dưới 5') || q.includes('5 củ') || q.includes('5tr') || q.includes('5 triệu')) {
      return { max: 5000000, label: 'dưới 5 triệu đồng' };
    }
    // "tầm 7 củ", "khoảng 7-8 triệu"
    if (q.includes('7 củ') || q.includes('7tr') || q.includes('7 triệu') || q.includes('8 củ') || q.includes('8tr') || q.includes('8 triệu')) {
      return { min: 6000000, max: 9000000, label: 'tầm 7 đến 8 triệu đồng' };
    }
    // "dưới 10 củ", "10 triệu", "10tr"
    if (q.includes('dưới 10') || q.includes('10 củ') || q.includes('10tr') || q.includes('10 triệu')) {
      return { max: 10000000, label: 'dưới 10 triệu đồng' };
    }
    // "từ 10 đến 15 triệu", "tầm 12-15 củ"
    if (q.includes('10 đến 15') || q.includes('10-15') || q.includes('dưới 15') || q.includes('15 củ') || q.includes('15tr') || q.includes('15 triệu') || q.includes('12tr') || q.includes('12 củ')) {
      return { min: 10000000, max: 15500000, label: 'khoảng 10 đến 15 triệu đồng' };
    }
    // "dưới 20 củ", "20 triệu"
    if (q.includes('dưới 20') || q.includes('20 củ') || q.includes('20tr') || q.includes('20 triệu')) {
      return { max: 20000000, label: 'dưới 20 triệu đồng' };
    }
    // "dưới 25 củ", "25 triệu"
    if (q.includes('dưới 25') || q.includes('25 củ') || q.includes('25tr') || q.includes('25 triệu')) {
      return { max: 25000000, label: 'dưới 25 triệu đồng' };
    }
    // "dưới 30 củ", "30 triệu"
    if (q.includes('dưới 30') || q.includes('30 củ') || q.includes('30tr') || q.includes('30 triệu')) {
      return { max: 30000000, label: 'dưới 30 triệu đồng' };
    }
    // Flagship cao cấp
    if (q.includes('trên 30') || q.includes('cao cấp') || q.includes('flagship') || q.includes('đắt nhất') || q.includes('xịn nhất')) {
      return { min: 25000000, label: 'phân khúc cao cấp Flagship trên 25 - 30 triệu' };
    }
    return null;
  }

  // ──────── Comparison Matching & Advice ────────
  findProductsToCompare(query, products) {
    const q = query.toLowerCase();
    const found = [];

    const keywords = [
      { key: '16 pro max', id: 101 },
      { key: '16 prm', id: 101 },
      { key: 'iphone 16', id: 101 },
      { key: 's25 ultra', id: 2 },
      { key: 's25u', id: 2 },
      { key: 's24 ultra', id: 102 },
      { key: 's24u', id: 102 },
      { key: 'xiaomi 14', id: 103 },
      { key: 'find n3', id: 104 },
      { key: 'galaxy a55', id: 105 },
      { key: 'a55', id: 105 },
      { key: 'macbook pro m4', id: 3 },
      { key: 'macbook m4', id: 3 },
      { key: 'air m3', id: 106 },
      { key: 'macbook air', id: 106 },
      { key: 'tuf gaming', id: 107 },
      { key: 'asus tuf', id: 107 },
      { key: 'legion pro', id: 108 },
      { key: 'lenovo legion', id: 108 },
      { key: 'rtx 5090', id: 4 },
      { key: 'airpods pro', id: 110 },
      { key: 'airpods', id: 110 },
      { key: 'wh-1000xm5', id: 112 },
      { key: 'sony', id: 112 },
      { key: 'marshall', id: 111 },
      { key: 'apple watch', id: 114 },
      { key: 'ultra 2', id: 114 },
      { key: 'garmin', id: 115 },
      { key: 'roborock', id: 116 }
    ];

    keywords.forEach(kw => {
      if (q.includes(kw.key)) {
        const prod = products.find(p => p.id === kw.id);
        if (prod && !found.some(p => p.id === prod.id)) {
          found.push(prod);
        }
      }
    });

    // Secondary match by Brand if needed
    if (found.length < 2) {
      if (q.includes('iphone') || q.includes('apple')) {
        const p = products.find(prod => prod.brand === 'Apple' && !found.some(f => f.id === prod.id));
        if (p) found.push(p);
      }
      if (q.includes('samsung')) {
        const p = products.find(prod => prod.brand === 'Samsung' && !found.some(f => f.id === prod.id));
        if (p) found.push(p);
      }
    }

    // Default top 2 flagships if general comparison
    if (found.length < 2 && (q.includes('iphone') || q.includes('samsung') || q.includes('flagship'))) {
      const p1 = products.find(p => p.id === 101);
      const p2 = products.find(p => p.id === 102);
      if (p1 && p2) return [p1, p2];
    }

    return found;
  }

  generateComparisonAdvice(p1, p2) {
    if ((p1.id === 101 && p2.id === 102) || (p1.id === 102 && p2.id === 101)) {
      const apple = p1.brand === 'Apple' ? p1 : p2;
      const samsung = p1.brand === 'Samsung' ? p1 : p2;
      return `
        • <strong>Chọn ${apple.name}:</strong> Nếu bạn yêu thích hệ điều hành iOS mượt mà, thời lượng pin cực khủng, khả năng quay video 4K120fps Dolby Vision chuẩn Hollywood và giữ giá cực tốt khi bán lại.<br/>
        • <strong>Chọn ${samsung.name}:</strong> Nếu bạn cần bút S-Pen ghi chú công việc, màn hình Dynamic AMOLED 2X chống chói đỉnh cao 2600 nits, camera Zoom quang 100x và hệ sinh thái Galaxy AI đa năng xử lý công việc siêu tốc.
      `;
    }

    return `
      • <strong>Ưu thế của ${p1.name}:</strong> Đại diện xuất sắc từ ${p1.brand}, sở hữu thiết kế cao cấp, hiệu năng bền bỉ và tối ưu hóa hệ thống tuyệt vời.<br/>
      • <strong>Ưu thế của ${p2.name}:</strong> Mang đến nhiều tính năng đột phá từ ${p2.brand}, màn hình ấn tượng và mức giá cực kỳ cạnh tranh trong cùng phân khúc.
    `;
  }

  // ──────── Smart Scoring Product Search ────────
  searchRelevantProducts(q, products) {
    const tokens = q.split(/\s+/).filter(t => t.length > 1);
    
    const scored = products.map(p => {
      let score = 0;
      const target = `${p.name} ${p.brand} ${p.category} ${p.promoText || ''} ${p.specs ? Object.values(p.specs).join(' ') : ''}`.toLowerCase();
      
      tokens.forEach(tok => {
        if (p.name.toLowerCase().includes(tok)) score += 5;
        if (p.brand.toLowerCase().includes(tok)) score += 3;
        if (target.includes(tok)) score += 1;
      });

      return { product: p, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
  }

  // ──────── Context-aware Consultation Trigger ────────
  consultProduct(productName) {
    this.openChat();
    setTimeout(() => {
      this.handleUserSubmit(`Tư vấn và đánh giá chi tiết sản phẩm ${productName}`);
    }, 300);
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.aiAssistant = new CellphonesAIAssistant();
});
