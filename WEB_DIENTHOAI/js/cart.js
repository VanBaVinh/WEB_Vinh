// ==========================================================================
// VinhBaPhone Shopping Cart & State Management
// ==========================================================================

class CartManager {
  constructor() {
    this.storageKey = 'vinhbaphone_cart_items';
    this.wishlistKey = 'vinhbaphone_wishlist_items';
    this.appliedCoupon = null;
    this.items = this.loadCart();
    this.wishlist = this.loadWishlist();
    
    this.initEventListeners();
    this.updateCartBadge();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading cart:', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      this.updateCartBadge();
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }

  loadWishlist() {
    try {
      const data = localStorage.getItem(this.wishlistKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.wishlistKey, JSON.stringify(this.wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }

  toggleWishlist(productId) {
    const id = Number(productId);
    const index = this.wishlist.indexOf(id);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(id);
      added = true;
    }
    this.saveWishlist();
    return added;
  }

  isWishlisted(productId) {
    return this.wishlist.includes(Number(productId));
  }

  addItem(product, quantity = 1, options = {}) {
    // 1. Resolve genuine color matching product name
    let color = options.color;
    if (!color && product.colors && Array.isArray(product.colors)) {
      const nameLower = (product.name || '').toLowerCase();
      const matchedColor = product.colors.find(c => nameLower.includes(c.toLowerCase()));
      color = matchedColor || product.colors[0];
    }
    if (!color || color === 'Tiêu chuẩn' || color === 'Mặc định') color = '';

    // 2. Resolve genuine storage matching product name
    let storage = options.storage;
    if (!storage && product.storageOptions && Array.isArray(product.storageOptions)) {
      const nameLower = (product.name || '').toLowerCase();
      const matchedStorage = product.storageOptions.find(s => nameLower.includes(s.toLowerCase()));
      storage = matchedStorage || product.storageOptions[0];
    }
    if (!storage || storage === 'Tiêu chuẩn' || storage === 'Mặc định' || storage === 'Standard') storage = '';
    
    // Unique key per product variant
    const variantId = `${product.id}-${color || 'std'}-${storage || 'std'}`;
    const existingIndex = this.items.findIndex(item => item.variantId === variantId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        variantId,
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        color,
        storage,
        quantity: quantity
      });
    }

    this.saveCart();
    this.renderCartDrawer();
    this.showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  removeItem(variantId) {
    this.items = this.items.filter(item => item.variantId !== variantId);
    this.saveCart();
    this.renderCartDrawer();
    this.showToast("Đã xóa sản phẩm khỏi giỏ hàng.");
  }

  updateQuantity(variantId, change) {
    const item = this.items.find(i => i.variantId === variantId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      this.removeItem(variantId);
    } else {
      this.saveCart();
      this.renderCartDrawer();
    }
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getDiscount() {
    if (!this.appliedCoupon) return 0;
    const subtotal = this.getSubtotal();
    if (subtotal >= this.appliedCoupon.minOrder) {
      return this.appliedCoupon.discount;
    }
    return 0;
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    return Math.max(0, subtotal - discount);
  }

  applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    const found = APP_DATA.coupons.find(c => c.code === cleanCode);
    const subtotal = this.getSubtotal();

    if (!found) {
      return { success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn!' };
    }

    if (subtotal < found.minOrder) {
      return { 
        success: false, 
        message: `Mã ${found.code} yêu cầu đơn hàng tối thiểu ${this.formatPrice(found.minOrder)}!` 
      };
    }

    this.appliedCoupon = found;
    this.renderCartDrawer();
    return { success: true, message: `Áp dụng mã ${found.code} thành công! Giảm ${this.formatPrice(found.discount)}` };
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.renderCartDrawer();
  }

  clearCart() {
    this.items = [];
    this.appliedCoupon = null;
    this.saveCart();
    this.renderCartDrawer();
  }

  updateCartBadge() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge');
    const mobBadge = document.getElementById('mob-cart-badge');
    
    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }
    if (mobBadge) {
      mobBadge.textContent = totalCount;
      mobBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }
  }

  formatPrice(num) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  }

  openCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      this.renderCartDrawer();
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  renderCartDrawer() {
    const listEl = document.getElementById('cart-items-list');
    const emptyEl = document.getElementById('cart-empty-state');
    const footerEl = document.getElementById('cart-footer');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const discountRow = document.getElementById('cart-discount-row');
    const totalEl = document.getElementById('cart-total');
    const couponTagEl = document.getElementById('cart-coupon-tag');

    if (!listEl) return;

    if (this.items.length === 0) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'flex';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';

    // Render items list
    listEl.innerHTML = this.items.map(item => `
      <div class="cart-item" data-variant-id="${item.variantId}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="window.handleProductImgError(this, '${item.category || 'phone'}', '${(item.name || '').replace(/'/g, "\\'")}')" />
        <div class="cart-item-info">
          <div class="cart-item-top">
            <h4 class="cart-item-title" title="${item.name}">${item.name}</h4>
            <button type="button" class="btn-remove-item" onclick="cart.removeItem('${item.variantId}')" title="Xóa sản phẩm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
            </button>
          </div>
          ${(item.color || item.storage) ? `
            <div class="cart-item-variant">
              ${item.color ? `<span>Màu: <strong>${item.color}</strong></span>` : ''}
              ${item.storage ? `<span>${item.color ? ' • ' : ''}Bản: <strong>${item.storage}</strong></span>` : ''}
            </div>
          ` : ''}
          <div class="cart-item-bottom">
            <div class="cart-item-pricing">
              <span class="cart-item-price">${this.formatPrice(item.price)}</span>
              ${item.originalPrice && item.originalPrice > item.price ? `<span class="cart-item-original">${this.formatPrice(item.originalPrice)}</span>` : ''}
            </div>
            <div class="quantity-controller">
              <button type="button" class="qty-btn minus" onclick="cart.updateQuantity('${item.variantId}', -1)" title="Giảm số lượng">−</button>
              <span class="qty-value">${item.quantity}</span>
              <button type="button" class="qty-btn plus" onclick="cart.updateQuantity('${item.variantId}', 1)" title="Tăng số lượng">+</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Summary calculations
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const total = this.getTotal();

    if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal);
    if (totalEl) totalEl.textContent = this.formatPrice(total);

    if (discountRow) {
      if (discount > 0 && this.appliedCoupon) {
        discountRow.style.display = 'flex';
        if (discountEl) discountEl.textContent = `-${this.formatPrice(discount)}`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (couponTagEl) {
      if (this.appliedCoupon) {
        const isEligible = subtotal >= this.appliedCoupon.minOrder;
        couponTagEl.innerHTML = `
          <div class="applied-badge" style="${isEligible ? '' : 'background: #fffbeb; color: #b45309;'}">
            <span>${isEligible ? '🎟️' : '⚠️'} Mã: <strong>${this.appliedCoupon.code}</strong> ${isEligible ? `(-${this.formatPrice(this.appliedCoupon.discount)})` : `(Cần thêm ${this.formatPrice(this.appliedCoupon.minOrder - subtotal)})`}</span>
            <button onclick="cart.removeCoupon()" class="remove-coupon-btn">&times;</button>
          </div>
        `;
      } else {
        couponTagEl.innerHTML = '';
      }
    }
  }

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '✓' : '🛒'}</span>
        <span class="toast-msg">${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  initEventListeners() {
    // Open/close buttons
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('#btn-open-cart, .btn-cart-trigger');
      if (openBtn) {
        e.preventDefault();
        this.openCart();
      }

      const closeBtn = e.target.closest('#btn-close-cart, #cart-overlay');
      if (closeBtn) {
        this.closeCart();
      }
    });

    // Coupon form submit
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'coupon-form') {
        e.preventDefault();
        const input = document.getElementById('coupon-input');
        if (!input) return;
        const result = this.applyCoupon(input.value);
        if (result.success) {
          this.showToast(result.message, 'success');
          input.value = '';
        } else {
          this.showToast(result.message, 'error');
        }
      }
    });
  }
}

// Global cart instance
const cart = new CartManager();
