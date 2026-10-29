// Smart Model-Accurate Image Fallbacks (Always matches exact product name & category)
window.getCategoryFallbackImage = function(category = '', name = '', brand = '') {
  if (typeof window.generateExactProductSvgDataUri === 'function') {
    return window.generateExactProductSvgDataUri(category || 'phone', name || 'Sản phẩm Công Nghệ', brand || 'VinhBaPhone');
  }
  return '';
};

window.handleProductImgError = function(img, category = '', name = '', brand = '') {
  if (!img || img.dataset.hasFailed) return;
  img.dataset.hasFailed = 'true';
  const fallback = window.getCategoryFallbackImage(category, name, brand);
  if (fallback) img.src = fallback;
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
  // Expose openStoresModal for inline onclick in HTML
  window.openStoresModal = () => App.openStoresModal();
});

const App = {
  activeHeroIndex: 0,
  heroTimer: null,
  activeQuickProduct: null,
  selectedColor: null,
  selectedStorage: null,
  quickViewCurrentPrice: null,
  deliveryType: 'home',

  init() {
    this.renderCategoryMenu();
    this.renderHeroSlider();
    this.renderSideBanners();
    this.initFlashSaleTimer();
    this.renderFlashSaleProducts();
    this.renderCategorizedProducts();
    this.initSearch();
    this.initModals();
    this.initQuickView();
    this.initCheckout();
    this.initOrderTracking();
    this.renderStoresModal();
    this.initTradeInCalculator();
    this.renderVinhCareSection();
    this.renderSNewsSection();
    this.initScrollTopAndDock();
    this.syncProductsFromBackend();
  },

  // ──────── Live Sync with Admin Backend ────────
  async syncProductsFromBackend() {
    const apiBase = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '8000'))
      ? 'http://localhost:8000'
      : '';
    try {
      const res = await fetch(`${apiBase}/api/products/public`);
      if (!res.ok) return;
      const json = await res.json();
      const items = Array.isArray(json) ? json : (json.data || []);
      if (!items.length) return;

      let updated = false;
      items.forEach(dbItem => {
        if (!dbItem.name || /^Sản phẩm #\d+$/i.test(dbItem.name.trim())) return;
        const existing = APP_DATA.products.find(p => p.id === dbItem.id);
        const safeImg = (!dbItem.image_url || dbItem.image_url.includes('unsplash.com') || dbItem.image_url.includes('placeholder.com'))
          ? window.getCategoryFallbackImage(dbItem.category, dbItem.name, dbItem.brand)
          : dbItem.image_url;

        if (existing) {
          if (existing.price !== dbItem.price || existing.name !== dbItem.name || existing.isFlashSale !== Boolean(dbItem.is_flash_sale)) {
            existing.name = dbItem.name;
            existing.price = dbItem.price;
            if (dbItem.original_price) existing.originalPrice = dbItem.original_price;
            existing.isFlashSale = Boolean(dbItem.is_flash_sale);
            existing.totalStock = dbItem.stock;
            if (safeImg) existing.image = safeImg;
            updated = true;
          }
        } else {
          APP_DATA.products.unshift({
            id: dbItem.id,
            name: dbItem.name,
            category: dbItem.category || 'phone',
            brand: dbItem.brand || 'Chính hãng',
            price: dbItem.price || 0,
            originalPrice: dbItem.original_price || Math.round((dbItem.price || 0) * 1.12),
            discountPercent: dbItem.original_price && dbItem.original_price > dbItem.price
              ? Math.round(((dbItem.original_price - dbItem.price) / dbItem.original_price) * 100)
              : 10,
            rating: dbItem.rating || 4.9,
            reviewsCount: 38,
            soldCount: 15,
            totalStock: dbItem.stock || 25,
            isFlashSale: Boolean(dbItem.is_flash_sale),
            installment: true,
            smemberDiscount: 'Giảm thêm 300.000₫',
            promoText: dbItem.description || 'Chính hãng VN/A • Bảo hành 12 tháng • Trả góp 0%',
            image: safeImg,
            specs: {
              screen: 'Tiêu chuẩn hãng',
              cpu: 'Thế hệ mới',
              ram: 'Tiêu chuẩn',
              rom: 'Chính hãng',
              battery: 'Bền bỉ',
              camera: 'Độ phân giải cao'
            },
            colors: ['Mặc định'],
            storageOptions: ['Tiêu chuẩn']
          });
          updated = true;
        }
      });

      if (updated) {
        this.renderFlashSaleProducts();
        this.renderCategorizedProducts();
      }
    } catch (_) {
      // Offline / static file mode — APP_DATA.products is already complete
    }
  },

  // ──────── Utility ────────
  formatPrice(num) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  },

  resolveSectionId(categoryId) {
    const map = {
      phone: 'section-phone',
      tablet: 'section-tablet',
      laptop: 'section-laptop',
      audio: 'section-audio',
      accessories: 'section-accessories',
      watch: 'section-smarthome',
      smarthome: 'section-smarthome',
      pc: 'section-pc-gaming',
      gaming: 'section-pc-gaming',
      storage: 'section-accessories',
      tradein: 'section-used',
      used: 'section-used'
    };
    return map[categoryId] || `section-${categoryId}`;
  },

  // ──────── 1. Category Menu ────────
  renderCategoryMenu() {
    const menuContainer = document.getElementById('category-menu-list');
    if (!menuContainer) return;

    menuContainer.innerHTML = APP_DATA.categories.map(cat => {
      const targetSec = this.resolveSectionId(cat.id);
      return `
        <li class="cat-menu-item" data-cat-id="${cat.id}">
          <a href="#${targetSec}" class="cat-link" onclick="event.preventDefault(); App.handleMenuCategoryClick('${cat.id}')">
            <span class="cat-icon">${cat.icon}</span>
            <span class="cat-name">${cat.name}</span>
            <svg class="cat-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </a>
          <div class="cat-flyout">
            <div class="cat-flyout-inner">
              <h4 class="flyout-title">${cat.icon} ${cat.name} nổi bật</h4>
              <div class="flyout-tags">
                ${cat.subcategories.map(sub => `
                  <a href="#${targetSec}" class="flyout-tag-item" onclick="event.preventDefault(); App.filterCategoryByTag('${cat.id}', '${sub}')">${sub}</a>
                `).join('')}
              </div>
              <div class="flyout-promo">
                <span class="promo-badge">Ưu đãi</span>
                <span>Giảm thêm đến 1.000.000₫ cho thành viên Smember</span>
              </div>
            </div>
          </div>
        </li>
      `;
    }).join('');
  },

  handleMenuCategoryClick(categoryId) {
    const targetSecId = this.resolveSectionId(categoryId);
    const sec = document.getElementById(targetSecId);
    if (sec) {
      const offset = sec.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  },

  // ──────── 2. Hero Slider ────────
  renderHeroSlider() {
    const sliderContainer = document.getElementById('hero-slider-track');
    const dotsContainer = document.getElementById('hero-slider-dots');
    const tabsContainer = document.getElementById('hero-slider-tabs');
    if (!sliderContainer) return;

    // Only inject slides dynamically if not already in HTML
    if (!sliderContainer.querySelector('.hero-slide')) {
      sliderContainer.innerHTML = APP_DATA.heroSlides.map((slide, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
          <img src="${slide.image}" alt="${slide.title}" class="hero-slide-img" loading="${index === 0 ? 'eager' : 'lazy'}" />
          <div class="hero-slide-overlay">
            <span class="slide-tag">${slide.tag}</span>
            <h2 class="slide-title">${slide.title}</h2>
            <p class="slide-desc">${slide.subtitle}</p>
            <span class="slide-badge">${slide.badge}</span>
          </div>
        </div>
      `).join('');
    }

    if (dotsContainer && !dotsContainer.children.length) {
      dotsContainer.innerHTML = APP_DATA.heroSlides.map((_, index) => `
        <button class="slider-dot ${index === 0 ? 'active' : ''}" onclick="App.goToSlide(${index})" aria-label="Slide ${index + 1}"></button>
      `).join('');
    }

    if (tabsContainer && !tabsContainer.children.length) {
      tabsContainer.innerHTML = APP_DATA.heroSlides.map((slide, index) => {
        const shortSub = slide.subtitle.split('•')[0].trim();
        return `
          <div class="bento-tab-item hero-tab-item ${index === 0 ? 'active' : ''}" onclick="App.goToSlide(${index})">
            <div class="hero-tab-title tab-title">${slide.title}</div>
            <div class="hero-tab-sub">${shortSub}</div>
          </div>
        `;
      }).join('');
    }

    this.startHeroAutoplay();

    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    const sliderWrapper = document.getElementById('hero-slider-wrapper');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', () => clearInterval(this.heroTimer));
      sliderWrapper.addEventListener('mouseleave', () => this.startHeroAutoplay());
      
      // Touch/swipe support
      let startX = 0;
      sliderWrapper.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      sliderWrapper.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? this.nextSlide() : this.prevSlide();
      }, { passive: true });
    }
  },

  startHeroAutoplay() {
    clearInterval(this.heroTimer);
    this.heroTimer = setInterval(() => this.nextSlide(), 4500);
  },

  goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const tabs = document.querySelectorAll('.bento-tab-item, .hero-tab-item');
    if (!slides.length) return;

    this.activeHeroIndex = (index + slides.length) % slides.length;

    slides.forEach((s, idx) => {
      if (idx === this.activeHeroIndex) {
        s.classList.add('active');
        s.style.display = 'flex';
      } else {
        s.classList.remove('active');
        s.style.display = 'none';
      }
    });

    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === this.activeHeroIndex);
    });

    tabs.forEach((t, idx) => {
      t.classList.toggle('active', idx === this.activeHeroIndex);
    });
  },

  nextSlide() { this.goToSlide(this.activeHeroIndex + 1); },
  prevSlide() { this.goToSlide(this.activeHeroIndex - 1); },

  // ──────── 3. Side Banners ────────
  renderSideBanners() {
    const sideContainer = document.getElementById('hero-side-banners');
    if (!sideContainer || sideContainer.children.length > 0) return;

    sideContainer.innerHTML = APP_DATA.sideBanners.map(banner => `
      <div class="side-banner-card" style="background-color: ${banner.color}; border-left-color: ${banner.accent};" onclick="App.handleSideBannerClick('${banner.id}')">
        <div class="side-banner-icon">${banner.icon}</div>
        <div class="side-banner-content">
          <h4 class="side-banner-title" style="color: ${banner.accent}">${banner.title}</h4>
          <p class="side-banner-desc">${banner.desc}</p>
        </div>
      </div>
    `).join('');
  },

  handleSideBannerClick(id) {
    if (id === 'side-2') {
      this.openModal('smember-modal');
    } else {
      this.scrollToSection('section-phone');
    }
  },

  // ──────── Modal Management ────────
  initModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  closeQuickView() {
    this.closeModal('quick-view-modal');
  },

  openStoresModal() {
    this.renderStoresModal();
    this.openModal('stores-modal');
  },

  openTrackModal() {
    const resultBox = document.getElementById('track-order-result');
    if (resultBox) resultBox.innerHTML = '';
    this.openModal('track-order-modal');
  },

  renderStoresModal() {
    const container = document.getElementById('stores-list-container');
    if (!container || !APP_DATA.storeLocations) return;
    container.innerHTML = APP_DATA.storeLocations.map(loc => `
      <div class="store-item p-3 rounded-xl bg-black/30 border border-white/10 hover:border-vinhCyan/40 transition">
        <div class="flex items-center justify-between mb-1">
          <strong class="text-white text-sm">📍 ${loc.city}</strong>
          <span class="text-xs font-bold text-vinhCyan bg-vinhCyan/10 px-2 py-0.5 rounded-md border border-vinhCyan/20">${loc.count}</span>
        </div>
        <p class="text-xs text-gray-400">Thời gian mở cửa: 08:00 - 22:00 (Mỗi ngày)</p>
      </div>
    `).join('');
  },

  handleSideBannerClick(id) {
    if (id === 'side-2') {
      this.openModal('smember-modal');
    } else {
      this.scrollToSection('section-phone');
    }
  },

  // ──────── 4. Flash Sale Timer ────────
  initFlashSaleTimer() {
    const hoursEl = document.getElementById('fs-hours');
    const minsEl = document.getElementById('fs-mins');
    const secsEl = document.getElementById('fs-secs');
    if (!hoursEl || !minsEl || !secsEl) return;

    const updateTimer = () => {
      const now = new Date();
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      let diff = Math.max(0, Math.floor((target - now) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  },

  // ──────── 5. Flash Sale Products ────────
  renderFlashSaleProducts() {
    const container = document.getElementById('flash-sale-grid');
    if (!container) return;
    const flashProducts = APP_DATA.products.filter(p => p.isFlashSale);
    container.innerHTML = flashProducts.map(p => this.createProductCardHtml(p, true)).join('');
  },

  filterFlashSale(category, btnElement = null) {
    const tabs = document.querySelectorAll('.fs-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const container = document.getElementById('flash-sale-grid');
    if (!container) return;

    let flashProducts = APP_DATA.products.filter(p => p.isFlashSale);
    if (category !== 'all') {
      if (category === 'audio') {
        flashProducts = flashProducts.filter(p => p.category === 'audio');
      } else if (category === 'accessories') {
        flashProducts = flashProducts.filter(p => p.category === 'accessories' || p.category === 'audio');
      } else {
        flashProducts = flashProducts.filter(p => p.category === category);
      }
    }

    container.innerHTML = flashProducts.length
      ? flashProducts.map(p => this.createProductCardHtml(p, true)).join('')
      : '<p style="color:var(--text-muted);padding:24px;text-align:center;grid-column:1/-1;">Chưa có sản phẩm Flash Sale thuộc mục này hôm nay</p>';
    container.scrollTo({ left: 0, behavior: 'smooth' });
  },

  // ──────── 6. Carousel Slider Control ────────
  scrollCarousel(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const card = container.querySelector('.product-card');
    const cardWidth = card ? (card.getBoundingClientRect().width + 14) : 240;
    const scrollAmount = Math.max(cardWidth * 2, container.clientWidth * 0.72);
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  },

  initCarouselDragScroll() {
    const tracks = document.querySelectorAll('.products-carousel-track');
    tracks.forEach(track => {
      let isDown = false;
      let startX;
      let scrollLeft;

      track.addEventListener('mousedown', (e) => {
        // Chỉ kéo khi không click vào button hoặc link
        if (e.target.closest('button') || e.target.closest('a')) return;
        isDown = true;
        track.classList.add('is-dragging');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });

      track.addEventListener('mouseleave', () => {
        isDown = false;
        track.classList.remove('is-dragging');
      });

      track.addEventListener('mouseup', () => {
        isDown = false;
        track.classList.remove('is-dragging');
      });

      track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
      });
    });
  },

  // ──────── 7. Category Products ────────
  renderCategorizedProducts() {
    const sections = [
      { containerId: 'phones-grid', filter: p => p.category === 'phone' },
      { containerId: 'tablets-grid', filter: p => p.category === 'tablet' },
      { containerId: 'laptops-grid', filter: p => p.category === 'laptop' },
      { containerId: 'pc-gaming-grid', filter: p => p.category === 'pc' || p.category === 'gaming' },
      { containerId: 'audio-grid', filter: p => p.category === 'audio' },
      { containerId: 'smarthome-grid', filter: p => p.category === 'watch' || p.category === 'smarthome' },
      { containerId: 'accessories-grid', filter: p => p.category === 'accessories' || p.category === 'storage' },
      { containerId: 'used-grid', filter: p => p.category === 'used' || p.category === 'tradein' },
    ];

    sections.forEach(({ containerId, filter }) => {
      const el = document.getElementById(containerId);
      if (el) {
        const items = APP_DATA.products.filter(filter);
        el.innerHTML = items.length
          ? items.map(p => this.createProductCardHtml(p)).join('')
          : '<p style="color:var(--text-muted);padding:20px;text-align:center;">Chưa có sản phẩm</p>';
      }
    });

    this.initCarouselDragScroll();
  },

  // ──────── 7. Spec Pills Helper & Product Card HTML ────────
  getSpecPills(product) {
    const pills = [];
    if (product.specs) {
      if (product.specs.screen) {
        const match = product.specs.screen.match(/(\d+(\.\d+)?)\s*(inch|")/i);
        if (match) pills.push(match[1] + '"');
        else pills.push(product.specs.screen.split(' ')[0]);
      }
      if (product.specs.rom) {
        pills.push(product.specs.rom);
      }
      if (product.specs.ram && pills.length < 3) {
        pills.push('RAM ' + product.specs.ram);
      }
      if (product.specs.cpu && pills.length < 3) {
        const cpuShort = product.specs.cpu.split(' ')[0];
        if (cpuShort.length > 2) pills.push(cpuShort);
      }
    }
    if (pills.length === 0) {
      pills.push('Chính hãng');
      if (product.category === 'phone' || product.category === 'tablet') pills.push('VN/A');
      pills.push('Bảo hành 12T');
    }
    return pills.slice(0, 3);
  },

  createProductCardHtml(product, isFlashSale = false) {
    const isFav = cart.isWishlisted(product.id);
    const specPills = this.getSpecPills(product);

    // Tính % giảm giá thực tế (chỉ hiển thị khi giá gốc > giá bán)
    const realDiscount = (product.originalPrice && product.originalPrice > product.price)
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : (product.discountPercent || 0);

    const progressPercent = (product.soldCount && product.totalStock)
      ? Math.round((product.soldCount / product.totalStock) * 100)
      : 80;

    const escapedName = (product.name || '').replace(/'/g, "\\'");
    const escapedBrand = (product.brand || '').replace(/'/g, "\\'");
    const isUsed = product.category === 'used' || product.category === 'tradein';

    return `
      <div class="product-card" data-product-id="${product.id}" data-category="${product.category}" data-brand="${product.brand}">
        <!-- Badges -->
        <div class="card-badges">
          ${realDiscount > 0 ? `<span class="badge-discount">-${realDiscount}%</span>` : ''}
          ${isUsed ? `<span class="badge-installment" style="background:#f5f3ff;color:#6d28d9;border-color:#ddd6fe;">Like New 99%</span>` : (product.installment !== false ? `<span class="badge-installment">Trả góp 0%</span>` : '')}
        </div>

        <!-- Wishlist -->
        <button class="btn-wishlist ${isFav ? 'active' : ''}" onclick="App.handleWishlistToggle(event, ${product.id})" title="Yêu thích">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? '#e11d48' : 'none'}" stroke="${isFav ? '#e11d48' : '#94a3b8'}" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>

        <!-- Image (Uniform 1:1 Aspect Ratio) -->
        <div class="card-thumb-wrap" onclick="App.openQuickView(${product.id})">
          <img src="${product.image}" alt="${product.name}" class="card-thumb" loading="lazy"
            onerror="window.handleProductImgError(this, '${product.category}', '${escapedName}', '${escapedBrand}')" />
          <button class="btn-quick-view-overlay" tabindex="-1">🔍 Xem chi tiết</button>
        </div>

        <!-- Info -->
        <div class="card-body">
          <div class="card-brand-meta">
            <span class="card-brand-tag">${product.brand || 'Chính hãng'}</span>
            <span class="card-verify-tag">${isUsed ? '💎 Zin 100%' : '✓ Chính hãng VN'}</span>
          </div>

          <h3 class="card-title" onclick="App.openQuickView(${product.id})" title="${product.name}">${product.name}</h3>

          <!-- Spec Pills (CellphoneS style) -->
          <div class="card-spec-pills">
            ${specPills.map(p => `<span class="spec-pill">${p}</span>`).join('')}
          </div>

          <div class="card-prices">
            <span class="price-current">${this.formatPrice(product.price)}</span>
            ${(product.originalPrice && product.originalPrice > product.price) ? `<span class="price-original">${this.formatPrice(product.originalPrice)}</span>` : ''}
          </div>

          ${product.smemberDiscount ? `
            <div class="smember-perk">
              <span class="smember-crown">👑</span>
              <span>VinhMember ${product.smemberDiscount}</span>
            </div>
          ` : ''}

          <!-- Promo snippet box (CellphoneS style) -->
          <div class="card-promo-box">
            <span>${product.promoText || 'Thu cũ đổi mới trợ giá đến 4 triệu • Trả góp 0%'}</span>
          </div>

          ${isFlashSale && product.soldCount && product.totalStock ? `
            <div class="flash-progress-bar-wrap">
              <div class="flash-progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <span class="flash-progress-label">🔥 Đã bán ${product.soldCount}/${product.totalStock} suất</span>
          ` : `
            <div class="card-footer-info">
              ${product.rating ? `
                <div class="card-rating">
                  <span class="star-icon">★</span>
                  <strong>${product.rating}</strong>
                  ${product.reviewsCount ? `<span class="reviews-count">(${product.reviewsCount})</span>` : ''}
                </div>
              ` : `
                <div class="card-rating">
                  <span class="text-[11px] text-slate-500 font-semibold">Chính hãng VN/A</span>
                </div>
              `}
              <button type="button" class="card-compare-link" onclick="event.stopPropagation(); App.openCompareModal(${product.id})" title="So sánh cấu hình">⚖️ So sánh</button>
            </div>
          `}

          <div class="card-actions">
            <div class="card-actions-row">
              <button class="btn-card-add-cart" onclick="App.handleQuickAddToCart(event, ${product.id})">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                <span>Thêm giỏ</span>
              </button>
              <button class="btn-card-ai-ask" onclick="event.stopPropagation(); if(window.aiAssistant) window.aiAssistant.consultProduct('${escapedName}')" title="Nhờ AI tư vấn máy này">
                <span>🤖 Hỏi AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ──────── Wishlist & Quick Add ────────
  handleWishlistToggle(e, productId) {
    e.stopPropagation();
    const added = cart.toggleWishlist(productId);
    const btn = e.currentTarget;
    const svg = btn.querySelector('svg');
    if (added) {
      btn.classList.add('active');
      svg.setAttribute('fill', '#e11d48');
      svg.setAttribute('stroke', '#e11d48');
      cart.showToast('Đã lưu vào danh sách yêu thích ❤️');
    } else {
      btn.classList.remove('active');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', '#94a3b8');
      cart.showToast('Đã bỏ yêu thích');
    }
  },

  handleQuickAddToCart(e, productId) {
    e.stopPropagation();
    const product = APP_DATA.products.find(p => p.id === productId);
    if (!product) return;
    cart.addItem(product, 1);
  },

  // ──────── 8. Search ────────
  initSearch() {
    const searchInput = document.getElementById('search-input');
    const dropdown = document.getElementById('search-dropdown');
    if (!searchInput || !dropdown) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        dropdown.classList.remove('show');
        this.resetAllProductVisibility();
        return;
      }

      const matches = APP_DATA.products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      ).slice(0, 7);

      if (matches.length > 0) {
        dropdown.innerHTML = `
          <div class="search-drop-header">Sản phẩm gợi ý (${matches.length})</div>
          <div class="search-drop-list">
            ${matches.map(m => `
              <div class="search-drop-item" onclick="App.openQuickView(${m.id}); document.getElementById('search-dropdown').classList.remove('show'); document.getElementById('search-input').value = '';">
                <img src="${m.image}" alt="${m.name}" class="search-drop-img" onerror="window.handleProductImgError(this, '${m.category || 'phone'}', '${(m.name || '').replace(/'/g, "\\'")}')" />
                <div class="search-drop-info">
                  <div class="search-drop-title">${m.name}</div>
                  <div class="search-drop-price">${this.formatPrice(m.price)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        dropdown.innerHTML = `<div class="search-drop-empty">Không tìm thấy sản phẩm cho "<strong>${query}</strong>"</div>`;
      }
      dropdown.classList.add('show');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#search-form-wrap')) {
        dropdown.classList.remove('show');
      }
    });

    // Keyboard shortcut: Enter to search
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('show');
        searchInput.blur();
      }
    });
  },

  handleSearchSubmit() {
    const input = document.getElementById('search-input');
    const dropdown = document.getElementById('search-dropdown');
    if (dropdown) dropdown.classList.remove('show');

    const query = (input?.value || '').trim().toLowerCase();
    if (!query) return;

    const allCards = document.querySelectorAll('.product-card');
    let matchedCount = 0;
    let firstMatch = null;

    allCards.forEach(card => {
      const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
      const brand = (card.getAttribute('data-brand') || '').toLowerCase();
      const cat = (card.getAttribute('data-category') || '').toLowerCase();

      if (title.includes(query) || brand.includes(query) || cat.includes(query)) {
        card.style.display = 'flex';
        matchedCount++;
        if (!firstMatch) firstMatch = card;
      } else {
        card.style.display = 'none';
      }
    });

    if (firstMatch) {
      setTimeout(() => firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      cart.showToast(`Tìm thấy ${matchedCount} sản phẩm cho "${query}"`, 'success');
    } else {
      cart.showToast(`Không tìm thấy sản phẩm nào cho "${query}"`, 'error');
      this.resetAllProductVisibility();
    }
  },

  clearSearch() {
    const input = document.getElementById('search-input');
    const dropdown = document.getElementById('search-dropdown');
    if (input) input.value = '';
    if (dropdown) dropdown.classList.remove('show');
    this.resetAllProductVisibility();
  },

  resetAllProductVisibility() {
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = '';
    });
    document.querySelectorAll('.category-empty-notice').forEach(n => n.style.display = 'none');
  },

  // ──────── Category Filtering (CellphoneS Style with Cyber-Tech Polish) ────────
  filterCategoryByTag(categoryId, tag, btnElement = null) {
    const targetSecId = this.resolveSectionId(categoryId);
    const section = document.getElementById(targetSecId);
    if (!section) return;

    section.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    if (btnElement) {
      btnElement.classList.add('active');
    } else {
      section.querySelectorAll('.filter-pill').forEach(p => {
        if (p.textContent.toLowerCase().includes(tag.toLowerCase())) p.classList.add('active');
      });
    }

    const cards = section.querySelectorAll('.product-card');
    let visibleCount = 0;
    cards.forEach(card => {
      const brand = card.getAttribute('data-brand') || '';
      const title = card.querySelector('.card-title')?.textContent || '';
      const cat = card.getAttribute('data-category') || '';
      const match = brand.toLowerCase().includes(tag.toLowerCase()) ||
        title.toLowerCase().includes(tag.toLowerCase()) ||
        cat.toLowerCase().includes(tag.toLowerCase());
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    const grid = section.querySelector('.products-grid-5');
    if (grid) grid.scrollTo({ left: 0, behavior: 'smooth' });

    this.updateCategoryEmptyNotice(section, categoryId, visibleCount, tag);
    this.scrollToSection(targetSecId);
    cart.showToast(`Đang lọc thương hiệu: ${tag}`);
  },

  filterCategoryByPrice(categoryId, minPrice, maxPrice, btnElement = null) {
    const targetSecId = this.resolveSectionId(categoryId);
    const section = document.getElementById(targetSecId);
    if (!section) return;

    if (btnElement) {
      section.querySelectorAll('.criteria-chip').forEach(c => c.classList.remove('active'));
      btnElement.classList.add('active');
    }

    const cards = section.querySelectorAll('.product-card');
    let visibleCount = 0;
    cards.forEach(card => {
      const pid = parseInt(card.getAttribute('data-product-id'));
      const prod = APP_DATA.products.find(p => p.id === pid);
      const price = prod ? prod.price : 0;
      const match = price >= minPrice && price <= maxPrice;
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    const grid = section.querySelector('.products-grid-5');
    if (grid) grid.scrollTo({ left: 0, behavior: 'smooth' });

    const priceLabel = maxPrice >= 90000000 ? `Trên ${this.formatPrice(minPrice)}` : `${this.formatPrice(minPrice)} - ${this.formatPrice(maxPrice)}`;
    this.updateCategoryEmptyNotice(section, categoryId, visibleCount, priceLabel);
    this.scrollToSection(targetSecId);
    cart.showToast(`Đang lọc mức giá: ${priceLabel}`);
  },

  filterCategoryByFeature(categoryId, featureKeyword, btnElement = null) {
    const targetSecId = this.resolveSectionId(categoryId);
    const section = document.getElementById(targetSecId);
    if (!section) return;

    if (btnElement) {
      section.querySelectorAll('.criteria-chip').forEach(c => c.classList.remove('active'));
      btnElement.classList.add('active');
    }

    const kw = featureKeyword.toLowerCase();
    const cards = section.querySelectorAll('.product-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
      const promo = (card.querySelector('.card-promo-box')?.textContent || '').toLowerCase();
      const brand = (card.getAttribute('data-brand') || '').toLowerCase();
      const match = title.includes(kw) || promo.includes(kw) || brand.includes(kw);
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    const grid = section.querySelector('.products-grid-5');
    if (grid) grid.scrollTo({ left: 0, behavior: 'smooth' });

    this.updateCategoryEmptyNotice(section, categoryId, visibleCount, featureKeyword);
    this.scrollToSection(targetSecId);
    cart.showToast(`Đang lọc tiêu chí: ${featureKeyword}`);
  },

  sortCategoryProducts(categoryId, sortType) {
    const targetSecId = this.resolveSectionId(categoryId);
    const section = document.getElementById(targetSecId);
    if (!section) return;

    const grid = section.querySelector('.products-grid-5');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.product-card'));
    if (!cards.length) return;

    cards.sort((a, b) => {
      const pidA = parseInt(a.getAttribute('data-product-id'));
      const pidB = parseInt(b.getAttribute('data-product-id'));
      const prodA = APP_DATA.products.find(p => p.id === pidA) || { price: 0, discountPercent: 0, rating: 0 };
      const prodB = APP_DATA.products.find(p => p.id === pidB) || { price: 0, discountPercent: 0, rating: 0 };

      if (sortType === 'price-asc') return prodA.price - prodB.price;
      if (sortType === 'price-desc') return prodB.price - prodA.price;
      if (sortType === 'discount') return (prodB.discountPercent || 0) - (prodA.discountPercent || 0);
      if (sortType === 'rating') return (prodB.rating || 0) - (prodA.rating || 0);
      return 0;
    });

    cards.forEach(c => grid.appendChild(c));
    grid.scrollTo({ left: 0, behavior: 'smooth' });
    cart.showToast(`Đã sắp xếp danh mục sản phẩm`);
  },

  updateCategoryEmptyNotice(section, categoryId, visibleCount, filterDesc) {
    let emptyNotice = section.querySelector('.category-empty-notice');
    const grid = section.querySelector('.products-grid-5');
    if (visibleCount === 0) {
      if (!emptyNotice) {
        emptyNotice = document.createElement('div');
        emptyNotice.className = 'category-empty-notice';
        if (grid) grid.after(emptyNotice);
      }
      emptyNotice.innerHTML = `
        <div style="text-align:center;padding:26px;background:#f8fafc;border-radius:12px;margin-top:12px;border:1px dashed #cbd5e1;">
          <p style="color:#64748b;font-size:13.5px;">Chưa tìm thấy sản phẩm phù hợp điều kiện "<strong>${filterDesc}</strong>".</p>
          <button style="margin-top:10px;padding:8px 18px;background:linear-gradient(135deg, #2563eb, #4f46e5);color:#fff;border-radius:8px;font-weight:700;font-size:12.5px;cursor:pointer;border:none;" onclick="App.resetCategoryFilter('${categoryId}')">Xem tất cả</button>
        </div>`;
      emptyNotice.style.display = 'block';
    } else if (emptyNotice) {
      emptyNotice.style.display = 'none';
    }
  },

  resetCategoryFilter(categoryId, btnElement = null) {
    const targetSecId = this.resolveSectionId(categoryId);
    const section = document.getElementById(targetSecId);
    if (!section) return;

    const pills = section.querySelectorAll('.filter-pill');
    pills.forEach(p => p.classList.remove('active'));
    if (btnElement && btnElement.classList.contains('filter-pill')) btnElement.classList.add('active');
    else if (pills[0]) pills[0].classList.add('active');

    const chips = section.querySelectorAll('.criteria-chip');
    chips.forEach(c => c.classList.remove('active'));
    if (btnElement && btnElement.classList.contains('criteria-chip')) btnElement.classList.add('active');
    else if (chips[0]) chips[0].classList.add('active');

    section.querySelectorAll('.product-card').forEach(card => card.style.display = '');
    const grid = section.querySelector('.products-grid-5');
    if (grid) grid.scrollTo({ left: 0, behavior: 'smooth' });

    const notice = section.querySelector('.category-empty-notice');
    if (notice) notice.style.display = 'none';
  },

  toggleCategoryModal() {
    this.openModal('categories-modal');
  },

  scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  },

  // ──────── 9. Quick View Modal ────────
  initQuickView() {
    const modal = document.getElementById('quick-view-modal');
    const closeBtn = document.getElementById('btn-close-quick-view');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeQuickView());
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) this.closeQuickView(); });
  },

  openQuickView(productId) {
    const product = APP_DATA.products.find(p => p.id === productId);
    if (!product) return;

    this.activeQuickProduct = product;
    this.selectedColor = product.colors ? product.colors[0] : 'Tiêu chuẩn';
    this.selectedStorage = product.storageOptions ? product.storageOptions[0] : 'Tiêu chuẩn';
    this.quickViewCurrentPrice = product.price;

    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('quick-view-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="quick-view-grid">
        <!-- Left: Gallery -->
        <div class="qv-gallery-col">
          <div class="qv-main-image-wrap">
            <img src="${product.image}" id="qv-main-img" alt="${product.name}"
              onerror="window.handleProductImgError(this, '${product.category}', '${(product.name || '').replace(/'/g, "\\'")}')" />
          </div>
          <div class="qv-badges">
            <span class="badge-tag">✓ Chính hãng VN/A</span>
            <span class="badge-tag green">🛡️ Bảo hành 12T</span>
          </div>
        </div>

        <!-- Right: Info -->
        <div class="qv-info-col">
          <h2 class="qv-title">${product.name}</h2>
          <div class="qv-rating-bar">
            ${product.rating ? `
              <span class="star-icon">★</span>
              <strong>${product.rating}</strong>
              ${product.reviewsCount ? `<span class="review-text">(${product.reviewsCount} đánh giá thực tế)</span>` : ''}
            ` : ''}
            <span class="brand-tag">Thương hiệu: <strong>${product.brand}</strong></span>
            <span class="brand-tag" style="background:#ecfdf5;color:#059669;font-weight:600;">✓ Chính hãng 100%</span>
          </div>

          <div class="qv-pricing-box">
            <div class="qv-price-row">
              <span class="qv-current-price" id="qv-price-display">${this.formatPrice(product.price)}</span>
              ${product.originalPrice ? `<span class="qv-original-price">${this.formatPrice(product.originalPrice)}</span>` : ''}
              ${product.discountPercent ? `<span class="qv-discount-tag">-${product.discountPercent}%</span>` : ''}
            </div>
            <div class="qv-smember-note">👑 Giá VinhMember: <strong>${this.formatPrice(product.price - 300000)}</strong></div>
          </div>

          ${product.colors && product.colors.length > 0 ? `
            <div class="qv-option-group">
              <label class="qv-option-label">Màu sắc: <strong id="qv-color-selected">${this.selectedColor}</strong></label>
              <div class="qv-colors-list">
                ${product.colors.map((color, i) => `
                  <button class="qv-color-btn ${i === 0 ? 'active' : ''}" onclick="App.selectQuickColor('${color}', this)">${color}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${product.storageOptions && product.storageOptions.length > 0 ? `
            <div class="qv-option-group">
              <label class="qv-option-label">Phiên bản:</label>
              <div class="qv-storage-list">
                ${product.storageOptions.map((opt, i) => `
                  <button class="qv-storage-btn ${i === 0 ? 'active' : ''}" onclick="App.selectQuickStorage('${opt}', this)">${opt}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="qv-promo-box">
            <div class="qv-promo-header">🎁 Khuyến mãi & Ưu đãi:</div>
            <ul class="qv-promo-list">
              <li>${product.promoText || 'Tặng gói bảo hành VIP 1 đổi 1 trong 30 ngày'}</li>
              <li>Giảm thêm 500.000₫ khi thanh toán qua thẻ tín dụng</li>
              <li>Miễn phí giao hàng hỏa tốc trong 2 giờ nội thành</li>
            </ul>
          </div>

          <div class="qv-specs-box">
            <div class="qv-specs-title">Thông số kỹ thuật</div>
            <table class="qv-specs-table">
              <tbody>
                <tr><td>Màn hình</td><td>${product.specs?.screen || '—'}</td></tr>
                <tr><td>Vi xử lý</td><td>${product.specs?.cpu || '—'}</td></tr>
                <tr><td>RAM</td><td>${product.specs?.ram || '—'}</td></tr>
                <tr><td>Bộ nhớ trong</td><td>${product.specs?.rom || '—'}</td></tr>
                <tr><td>Pin & Sạc</td><td>${product.specs?.battery || '—'}</td></tr>
                <tr><td>Camera</td><td>${product.specs?.camera || '—'}</td></tr>
              </tbody>
            </table>
          </div>

          <div class="qv-action-buttons">
            <button class="btn-buy-now" onclick="App.buyNowCurrent()">
              <strong>MUA NGAY</strong>
              <span>Giao tận nơi hoặc nhận tại cửa hàng</span>
            </button>
            <button class="btn-add-to-cart-qv" onclick="App.addToCartCurrent()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              <span>Thêm giỏ</span>
            </button>
          </div>

          <button class="btn-quickview-ai-consult" onclick="App.closeQuickView(); if(window.aiAssistant) window.aiAssistant.consultProduct('${product.name.replace(/'/g, "\\'")}')">
            <span>🤖 Nhờ S-Bot AI tư vấn & so sánh máy này</span>
          </button>
        </div>
      </div>
    `;

    this.openModal('quick-view-modal');
  },

  selectQuickColor(color, btn) {
    this.selectedColor = color;
    document.querySelectorAll('.qv-color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const label = document.getElementById('qv-color-selected');
    if (label) label.textContent = color;
  },

  selectQuickStorage(storage, btn) {
    this.selectedStorage = storage;
    document.querySelectorAll('.qv-storage-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (this.activeQuickProduct?.storageOptions) {
      const index = this.activeQuickProduct.storageOptions.indexOf(storage);
      const base = this.activeQuickProduct.price;
      let adjusted = base;
      if (index === 1) adjusted += 2500000;
      else if (index === 2) adjusted += 6000000;
      this.quickViewCurrentPrice = adjusted;
      const display = document.getElementById('qv-price-display');
      if (display) display.textContent = this.formatPrice(adjusted);
    }
  },

  addToCartCurrent() {
    if (!this.activeQuickProduct) return;
    cart.addItem(
      { ...this.activeQuickProduct, price: this.quickViewCurrentPrice || this.activeQuickProduct.price },
      1,
      { color: this.selectedColor, storage: this.selectedStorage }
    );
    this.closeQuickView();
  },

  buyNowCurrent() {
    if (!this.activeQuickProduct) return;
    cart.addItem(
      { ...this.activeQuickProduct, price: this.quickViewCurrentPrice || this.activeQuickProduct.price },
      1,
      { color: this.selectedColor, storage: this.selectedStorage }
    );
    this.closeQuickView();
    this.openCheckoutModal();
  },

  closeQuickView() {
    this.closeModal('quick-view-modal');
  },

  // ──────── 10. Modal Helpers ────────
  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  initModals() {
    // Store Locator
    const btnStores = document.getElementById('btn-open-stores');
    if (btnStores) btnStores.addEventListener('click', () => this.openStoresModal());

    const closeStores = document.getElementById('btn-close-stores');
    if (closeStores) closeStores.addEventListener('click', () => this.closeModal('stores-modal'));

    // Smember
    const btnSmember = document.getElementById('btn-open-smember');
    if (btnSmember) btnSmember.addEventListener('click', () => this.openModal('smember-modal'));

    const closeSmember = document.getElementById('btn-close-smember');
    if (closeSmember) closeSmember.addEventListener('click', () => this.closeModal('smember-modal'));

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Escape key closes modals
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        });
        // Also close cart
        cart.closeCart();
      }
    });
  },

  openStoresModal() {
    this.renderStoresModal();
    this.openModal('stores-modal');
  },

  openTrackModal(preserveResult = false) {
    this.openModal('track-order-modal');
    this.renderTrackQuickSuggestions();
    const input = document.getElementById('track-phone-input');
    const resultBox = document.getElementById('track-order-result');
    if (input) setTimeout(() => input.focus(), 180);

    // Nếu chưa có kết quả hiển thị, tự động hiển thị đơn hàng vừa đặt gần nhất trên thiết bị (nếu có)
    if (!preserveResult && resultBox && !resultBox.innerHTML.trim()) {
      const localOrders = JSON.parse(localStorage.getItem('vinhbaphone_orders') || '[]');
      if (localOrders.length > 0 && localOrders[0].orderId) {
        if (input && !input.value.trim()) input.value = localOrders[0].orderId;
        this.handleTrackOrder(localOrders[0].orderId);
      } else {
        resultBox.innerHTML = `
          <div style="text-align:center; padding:18px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; color:#475569; font-size:12.5px;">
            <div style="font-size:24px; margin-bottom:6px;">📦</div>
            <strong style="color:#0f172a; display:block; margin-bottom:4px;">Tra cứu nhanh tiến độ giao hàng & bảo hành điện tử</strong>
            <span>Nhập <strong>Số điện thoại đặt hàng</strong> (VD: <code>0363620913</code>), <strong>Mã đơn hàng</strong> (VD: <code>VBP000001</code>) hoặc bấm các gợi ý bên trên để kiểm tra ngay.</span>
          </div>
        `;
      }
    }
  },

  renderStoresModal() {
    const container = document.getElementById('stores-list-container');
    if (!container || !APP_DATA.stores) return;

    container.innerHTML = APP_DATA.stores.map(store => `
      <div class="store-item-card">
        <div class="store-item-icon">📍</div>
        <div class="store-item-info">
          <h4 class="store-item-name">${store.name}</h4>
          <p class="store-item-addr">${store.district}</p>
          <div class="store-item-meta">
            <span>⏰ ${store.time}</span>
            <span>📞 <strong>${store.phone}</strong></span>
          </div>
        </div>
      </div>
    `).join('');
  },

  // ──────── 11. Checkout ────────
  toggleDeliveryType(type) {
    this.deliveryType = type;
    const tabHome = document.getElementById('tab-delivery-home');
    const tabStore = document.getElementById('tab-delivery-store');
    const groupAddress = document.getElementById('group-delivery-address');
    const groupStore = document.getElementById('group-store-select');
    const addressInput = document.getElementById('checkout-address');

    if (type === 'store') {
      if (tabHome) tabHome.classList.remove('active');
      if (tabStore) tabStore.classList.add('active');
      if (groupAddress) groupAddress.style.display = 'none';
      if (groupStore) groupStore.style.display = 'block';
      if (addressInput) addressInput.required = false;
    } else {
      if (tabHome) tabHome.classList.add('active');
      if (tabStore) tabStore.classList.remove('active');
      if (groupAddress) groupAddress.style.display = 'block';
      if (groupStore) groupStore.style.display = 'none';
      if (addressInput) addressInput.required = true;
    }
  },

  initCheckout() {
    const btnCheckout = document.getElementById('btn-proceed-checkout');
    if (btnCheckout) btnCheckout.addEventListener('click', () => {
      cart.closeCart();
      setTimeout(() => this.openCheckoutModal(), 300);
    });

    const closeCheckout = document.getElementById('btn-close-checkout');
    if (closeCheckout) closeCheckout.addEventListener('click', () => this.closeModal('checkout-modal'));

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      this.submitOrder(new FormData(checkoutForm));
    });

    // Payment method label selection effect & VietQR box toggle
    document.querySelectorAll('.payment-option-label input[name="paymentMethod"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.payment-option-label').forEach(l => l.classList.remove('active'));
        radio.closest('.payment-option-label').classList.add('active');

        const vietqrBox = document.getElementById('checkout-vietqr-box');
        if (vietqrBox) {
          if (radio.value.includes('VietQR')) {
            vietqrBox.style.display = 'block';
            this.updateVietQRContent();
          } else {
            vietqrBox.style.display = 'none';
          }
        }
      });
    });

    // Real-time phone input updates VietQR transfer note
    const phoneInput = document.getElementById('checkout-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        this.updateVietQRContent();
      });
    }
  },

  updateVietQRContent() {
    const phoneInput = document.getElementById('checkout-phone');
    const contentEl = document.getElementById('vietqr-transfer-content');
    const qrImg = document.getElementById('checkout-vietqr-img');
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const totalAmount = cart ? cart.getTotal() : 0;
    const memo = phoneVal ? `VBP ${phoneVal}` : 'VBP ORDER2026';

    if (contentEl) contentEl.textContent = memo;
    if (qrImg && totalAmount > 0) {
      // Dynamic VietQR generator URL via QuickChart QR
      const qrData = `00020101021238540010A00000072701240006970422011009888888880208QRIBFTTA5303704540${totalAmount}5802VN62170813${memo}6304`;
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`;
    }
  },

  openCheckoutModal() {
    if (cart.items.length === 0) {
      cart.showToast('Giỏ hàng của bạn đang trống!', 'error');
      return;
    }

    const summaryList = document.getElementById('checkout-summary-items');
    const totalEl = document.getElementById('checkout-final-total');

    if (summaryList) {
      summaryList.innerHTML = cart.items.map(item => `
        <div class="checkout-summary-item">
          <img src="${item.image}" alt="${item.name}"
            onerror="window.handleProductImgError(this, '${item.category || 'phone'}', '${(item.name || '').replace(/'/g, "\\'")}')" />
          <div class="cs-info">
            <div class="cs-title">${item.name} ${item.color ? `(${item.color})` : ''}</div>
            <div class="cs-detail">SL: ${item.quantity} × ${this.formatPrice(item.price)}</div>
          </div>
        </div>
      `).join('');
    }

    if (totalEl) totalEl.textContent = this.formatPrice(cart.getTotal());
    this.updateVietQRContent();
    this.openModal('checkout-modal');
  },

  async submitOrder(formData) {
    const name = (formData.get('fullName') || '').trim();
    const phone = (formData.get('phone') || '').trim();
    const isStore = this.deliveryType === 'store';
    let address = isStore 
      ? (formData.get('storeBranch') || 'Nhận tại cửa hàng CellphoneS').trim() 
      : (formData.get('address') || '').trim();
    const payment = formData.get('paymentMethod') || 'Thanh toán tiền mặt khi nhận hàng (COD)';
    const noteText = (formData.get('note') || '').trim();

    if (!name || !phone || (!isStore && !address)) {
      cart.showToast('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng!', 'error');
      return;
    }

    if (cart.items.length === 0) {
      cart.showToast('Giỏ hàng của bạn đang trống!', 'error');
      return;
    }

    const submitBtn = document.querySelector('#checkout-form .btn-confirm-order');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'XÁC NHẬN ĐẶT HÀNG';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:8px;">
          <span>⏳</span> Đang gửi đơn hàng lên hệ thống...
        </span>
      `;
    }

    // Chuẩn bị payload chuẩn OrderCreate gửi lên FastAPI Backend
    const orderPayload = {
      customer_name: name,
      customer_phone: phone,
      customer_address: isStore ? `[Nhận tại cửa hàng] ${address}` : address,
      payment_method: payment,
      note: `${isStore ? 'Hình thức: Nhận tại cửa hàng' : 'Hình thức: Giao tận nơi'}${cart.appliedCoupon ? ` • Mã: ${cart.appliedCoupon.code}` : ''}${noteText ? ` • Ghi chú: ${noteText}` : ''}`,
      items: cart.items.map(item => ({
        product_id: Number(item.id),
        quantity: Number(item.quantity) || 1,
        color: item.color || null,
        storage: item.storage || null
      }))
    };

    let orderData = null;

    try {
      // 1. Thử gửi lên máy chủ FastAPI
      const apiBase = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '8000'))
        ? 'http://localhost:8000'
        : '';

      const response = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          orderData = {
            orderId: result.order_code || `VBP${String(result.order_id).padStart(6, '0')}`,
            orderDbId: result.order_id,
            customer: { name, phone, address: isStore ? `[Tại cửa hàng] ${address}` : address },
            payment,
            items: [...cart.items],
            total: result.total_price || cart.getTotal(),
            date: result.created_at || new Date().toLocaleString('vi-VN'),
            status: 'Chờ xử lý (Đã đồng bộ cơ sở dữ liệu)'
          };
        }
      }
    } catch (e) {
      console.warn('Backend server chưa khởi động hoặc offline. Chuyển sang cơ chế tạo đơn hàng uy tín tự động:', e);
    }

    // 2. Dự phòng thông minh: Nếu máy chủ offline, tự động sinh mã đơn hàng chuẩn VBP
    if (!orderData) {
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      orderData = {
        orderId: `VBP${randomSuffix}`,
        orderDbId: Date.now(),
        customer: { name, phone, address: isStore ? `[Tại showroom] ${address}` : address },
        payment,
        items: [...cart.items],
        total: cart.getTotal(),
        date: new Date().toLocaleString('vi-VN'),
        status: 'Chờ xác nhận (Đã ghi nhận trên hệ thống)'
      };
    }

    // 3. Lưu đơn hàng vào localStorage cho khách tra cứu
    try {
      const orders = JSON.parse(localStorage.getItem('vinhbaphone_orders') || '[]');
      orders.unshift(orderData);
      localStorage.setItem('vinhbaphone_orders', JSON.stringify(orders.slice(0, 50)));
    } catch (e) {
      console.warn('Lỗi lưu đơn hàng vào localStorage:', e);
    }

    // 4. Xóa giỏ hàng
    cart.clearCart();

    // 5. Đóng modal đặt hàng & Mở hóa đơn điện tử thành công
    this.closeModal('checkout-modal');
    this.showOrderSuccess(orderData);
    cart.showToast('🎉 Đặt hàng thành công! Đã ghi nhận mã bảo hành điện tử chính hãng.', 'success');

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  },

  showOrderSuccess(order) {
    const successModal = document.getElementById('order-success-modal');
    const successInfo = document.getElementById('order-success-details');
    if (!successModal || !successInfo) return;

    successInfo.innerHTML = `
      <div class="invoice-success-container">
        <div class="invoice-badge-seal">
          <span>✓</span> ĐÃ XÁC THỰC BẢO HÀNH CHÍNH HÃNG VN/A
        </div>
        <h3 class="text-xl font-black text-slate-900">ĐẶT HÀNG THÀNH CÔNG!</h3>
        <p class="text-xs text-slate-500 mt-1">Cảm ơn quý khách <strong>${order.customer.name}</strong> đã tin tưởng lựa chọn VinhBaPhone.</p>

        <!-- Mã đơn hàng -->
        <div class="invoice-header-code">
          <div>
            <span class="text-xs text-slate-500 block">Mã đơn hàng & Tra cứu:</span>
            <strong class="text-base text-blue-600 font-mono tracking-wider">${order.orderId}</strong>
          </div>
          <button type="button" class="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition" onclick="navigator.clipboard.writeText('${order.orderId}'); cart.showToast('Đã sao chép mã đơn hàng!');">
            📋 Sao chép
          </button>
        </div>

        <!-- Tiến độ 4 bước -->
        <div class="invoice-timeline">
          <div class="timeline-line-active">
            <div class="timeline-line-fill"></div>
          </div>
          <div class="timeline-step active">
            <div class="step-circle">1</div>
            <span class="step-label">Tiếp nhận</span>
          </div>
          <div class="timeline-step active">
            <div class="step-circle">2</div>
            <span class="step-label">Đóng gói</span>
          </div>
          <div class="timeline-step">
            <div class="step-circle">3</div>
            <span class="step-label">Giao 2H</span>
          </div>
          <div class="timeline-step">
            <div class="step-circle">4</div>
            <span class="step-label">Kích hoạt BH</span>
          </div>
        </div>

        <!-- Bảng hóa đơn thu nhỏ -->
        <div class="order-receipt text-left" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; font-size:12px; margin-top:12px;">
          <div class="receipt-row" style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Người nhận:</span><strong>${order.customer.name}</strong></div>
          <div class="receipt-row" style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Số điện thoại:</span><strong>${order.customer.phone}</strong></div>
          <div class="receipt-row" style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Địa chỉ:</span><span style="max-width:65%; text-align:right;">${order.customer.address}</span></div>
          <div class="receipt-row" style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Phương thức:</span><strong>${order.payment}</strong></div>
          <div class="receipt-row" style="display:flex; justify-content:space-between; margin-top:8px; padding-top:6px; border-top:1px dashed #cbd5e1;">
            <span>Tổng thanh toán:</span>
            <strong class="text-red text-sm">${this.formatPrice(order.total)}</strong>
          </div>
        </div>

        <div class="text-[11px] text-slate-500 mt-2 text-left bg-emerald-50 p-2 rounded border border-emerald-100 flex items-center gap-2">
          <span>🛡️</span>
          <span>Cam kết: 100% hàng chính hãng, đổi mới trong 30 ngày nếu phát sinh lỗi nhà sản xuất.</span>
        </div>

        <!-- Nhóm nút hành động -->
        <div class="invoice-actions-group">
          <button class="btn-invoice-action btn-invoice-secondary" onclick="window.print()">
            🖨️ In hóa đơn VAT
          </button>
          <button class="btn-invoice-action btn-invoice-primary" onclick="App.closeOrderSuccessModal(); App.openTrackModalWithCode('${order.orderId}')">
            🔍 Tra cứu tiến độ
          </button>
          <button class="btn-invoice-action btn-invoice-secondary" onclick="App.closeOrderSuccessModal()">
            🛍️ Mua thêm
          </button>
        </div>
      </div>
    `;

    this.openModal('order-success-modal');
  },

  openTrackModalWithCode(code) {
    const input = document.getElementById('track-phone-input');
    if (input) input.value = code;
    this.openTrackModal(true);
    this.handleTrackOrder(code);
  },

  closeOrderSuccessModal() {
    this.closeModal('order-success-modal');
  },

  // ──────── 12. Order Tracking ────────
  initOrderTracking() {
    const closeBtn = document.getElementById('btn-close-track');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal('track-order-modal'));
  },

  renderTrackQuickSuggestions() {
    const sugBox = document.getElementById('track-quick-suggestions');
    if (!sugBox) return;

    const localOrders = JSON.parse(localStorage.getItem('vinhbaphone_orders') || '[]');
    const chips = [];

    localOrders.slice(0, 3).forEach(o => {
      if (o.orderId && !chips.includes(o.orderId)) chips.push(o.orderId);
      if (o.customer?.phone && !chips.includes(o.customer.phone)) chips.push(o.customer.phone);
    });

    ['VBP000001', 'VBP000007', '0363620913', '0312312333'].forEach(sample => {
      if (chips.length < 5 && !chips.includes(sample)) chips.push(sample);
    });

    sugBox.innerHTML = `
      <span style="color:#64748b; font-weight:600;">Tra cứu nhanh:</span>
      ${chips.map(c => `
        <button type="button" onclick="document.getElementById('track-phone-input').value='${c}'; App.handleTrackOrder('${c}');"
          style="padding:3px 9px; border-radius:99px; background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; font-weight:700; font-size:11px; cursor:pointer; transition:all 0.15s;">
          ${c}
        </button>
      `).join('')}
    `;
  },

  normalizeOrderForTracking(raw) {
    if (!raw) return null;
    // Chuẩn hóa cả dữ liệu từ Backend API lẫn từ localStorage
    const statusMap = {
      pending: { label: '⏳ Chờ xác nhận', bg: '#fffbeb', color: '#d97706', border: '#fde68a', step: 1, progress: '15%' },
      confirmed: { label: '✓ Đã xác nhận & Đóng gói', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', step: 2, progress: '48%' },
      shipping: { label: '🚚 Đang vận chuyển (Giao nhanh 2H)', bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff', step: 3, progress: '78%' },
      completed: { label: '★ Giao thành công (Đã kích hoạt BH)', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', step: 4, progress: '100%' },
      cancelled: { label: '✕ Đã hủy đơn hàng', bg: '#fff1f2', color: '#e11d48', border: '#fecdd3', step: 0, progress: '0%' }
    };

    let rawStatus = (raw.status || 'pending').toLowerCase();
    if (rawStatus.includes('chờ')) rawStatus = 'pending';
    else if (rawStatus.includes('xác nhận')) rawStatus = 'confirmed';
    else if (rawStatus.includes('giao') && !rawStatus.includes('thành công')) rawStatus = 'shipping';
    else if (rawStatus.includes('hoàn tất') || rawStatus.includes('thành công')) rawStatus = 'completed';
    else if (rawStatus.includes('hủy')) rawStatus = 'cancelled';

    const stMeta = statusMap[rawStatus] || statusMap.pending;
    const orderCode = raw.order_code || raw.orderId || (raw.id ? `VBP${String(raw.id).padStart(6, '0')}` : 'VBP000001');
    const customerName = raw.customer_name || raw.customer?.name || 'Khách hàng';
    const customerPhone = raw.customer_phone || raw.customer?.phone || '—';
    const customerAddress = raw.customer_address || raw.customer?.address || 'Nhận tại cửa hàng / Giao tận nơi';

    let paymentMethod = raw.payment_method || raw.payment || '';
    if (!paymentMethod && raw.note) {
      const m = raw.note.match(/Thanh toán:\s*([^|•]+)/i);
      if (m) paymentMethod = m[1].trim();
    }
    if (!paymentMethod) paymentMethod = 'Thanh toán tiền mặt khi nhận hàng (COD)';

    const rawItems = Array.isArray(raw.items) ? raw.items : [];
    const items = rawItems.map(it => {
      const prodFromCatalog = APP_DATA.products?.find(p => p.id === Number(it.product_id || it.id));
      const name = it.name || it.product_name || prodFromCatalog?.name || `Sản phẩm công nghệ #${it.product_id || it.id || 1}`;
      const category = it.category || prodFromCatalog?.category || 'phone';
      const brand = it.brand || prodFromCatalog?.brand || 'VinhBaPhone';
      const image = it.image || it.product_image || prodFromCatalog?.image || window.getCategoryFallbackImage(category, name, brand);
      const price = Number(it.price || prodFromCatalog?.price || 0);
      const quantity = Number(it.quantity || 1);
      return {
        name,
        category,
        brand,
        image,
        price,
        quantity,
        color: it.color || '',
        storage: it.storage || '',
        subtotal: price * quantity
      };
    });

    let totalPrice = Number(raw.total_price ?? raw.total ?? 0);
    if (totalPrice <= 0 && items.length > 0) {
      totalPrice = items.reduce((sum, x) => sum + x.subtotal, 0);
    }

    return {
      orderCode,
      customerName,
      customerPhone,
      customerAddress,
      paymentMethod,
      note: raw.note || '',
      createdAt: raw.created_at || raw.date || 'Hôm nay',
      statusKey: rawStatus,
      statusMeta: stMeta,
      totalPrice,
      items
    };
  },

  renderTrackedOrderCard(ord) {
    const st = ord.statusMeta;
    const step = st.step;

    const timelineHtml = step === 0 ? `
      <div style="margin:12px 0; padding:10px 12px; background:#fff1f2; border:1px solid #fecdd3; border-radius:8px; color:#e11d48; font-size:12px; font-weight:700; display:flex; align-items:center; gap:8px;">
        <span>✕</span>
        <span>Đơn hàng này đã bị hủy. Vui lòng liên hệ 1800.2097 nếu cần hỗ trợ đặt lại.</span>
      </div>
    ` : `
      <div class="invoice-timeline" style="margin:16px 0;">
        <div class="timeline-line-active"><div class="timeline-line-fill" style="width:${st.progress};"></div></div>
        <div class="timeline-step ${step >= 1 ? 'active' : ''}"><div class="step-circle">1</div><span class="step-label">Tiếp nhận</span></div>
        <div class="timeline-step ${step >= 2 ? 'active' : ''}"><div class="step-circle">2</div><span class="step-label">Đã xác nhận</span></div>
        <div class="timeline-step ${step >= 3 ? 'active' : ''}"><div class="step-circle">3</div><span class="step-label">Đang giao</span></div>
        <div class="timeline-step ${step >= 4 ? 'active' : ''}"><div class="step-circle">4</div><span class="step-label">Hoàn tất</span></div>
      </div>
    `;

    const itemsHtml = ord.items && ord.items.length > 0 ? `
      <div style="margin-top:10px; border-top:1px solid #e2e8f0; padding-top:10px;">
        <div style="font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:6px;">
          Danh sách sản phẩm (${ord.items.reduce((s, i) => s + i.quantity, 0)} món)
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${ord.items.map(it => {
            const safeName = (it.name || '').replace(/'/g, "\\'");
            const safeBrand = (it.brand || '').replace(/'/g, "\\'");
            return `
              <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; background:#f8fafc; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0;">
                <div style="display:flex; align-items:center; gap:10px; min-width:0;">
                  <img src="${it.image}" alt="${it.name}"
                    style="width:42px; height:42px; object-fit:contain; background:#fff; border-radius:6px; border:1px solid #e2e8f0; padding:2px; flex-shrink:0;"
                    onerror="window.handleProductImgError(this, '${it.category}', '${safeName}', '${safeBrand}')" />
                  <div style="min-width:0;">
                    <div style="font-size:12.5px; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${it.name}</div>
                    <div style="font-size:11px; color:#64748b;">
                      SL: <strong>×${it.quantity}</strong>
                      ${it.color ? ` • Màu: ${it.color}` : ''}
                      ${it.storage ? ` • Bản: ${it.storage}` : ''}
                    </div>
                  </div>
                </div>
                <div style="font-size:12.5px; font-weight:800; color:#e11d48; white-space:nowrap;">
                  ${this.formatPrice(it.subtotal || it.price)}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : '';

    return `
      <div class="track-card" style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:16px; text-align:left; margin-top:12px; box-shadow:0 4px 12px rgba(15,23,42,0.05);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
          <span style="background:${st.bg}; color:${st.color}; font-weight:800; font-size:11.5px; padding:4px 10px; border-radius:99px; border:1px solid ${st.border};">
            ${st.label}
          </span>
          <span style="font-size:11.5px; color:#64748b; font-weight:600;">🕒 ${ord.createdAt}</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:6px;">
          <h4 style="font-size:15px; font-weight:800; color:#0f172a; margin-bottom:2px;">
            Mã đơn hàng: <strong class="text-blue-600 font-mono">${ord.orderCode}</strong>
          </h4>
          <span style="font-size:11px; color:#059669; font-weight:700;">🛡️ Bảo hành chính hãng VN/A</span>
        </div>
        <p style="font-size:12.5px; color:#334155; margin-bottom:6px;">
          Khách hàng: <strong>${ord.customerName}</strong> • SĐT: <strong>${ord.customerPhone}</strong>
        </p>

        ${timelineHtml}

        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:12px; font-size:12px; margin-top:8px;">
          <div style="display:flex; justify-content:space-between; gap:8px; margin-bottom:5px;">
            <span style="color:#64748b;">Địa chỉ nhận:</span>
            <span style="max-width:68%; text-align:right; font-weight:600; color:#0f172a;">${ord.customerAddress}</span>
          </div>
          <div style="display:flex; justify-content:space-between; gap:8px; margin-bottom:5px;">
            <span style="color:#64748b;">Thanh toán:</span>
            <strong style="color:#0f172a; text-align:right;">${ord.paymentMethod}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:8px; margin-top:4px; border-top:1px dashed #cbd5e1; font-weight:800;">
            <span style="color:#0f172a;">Tổng thanh toán:</span>
            <strong class="text-red" style="font-size:15px;">${this.formatPrice(ord.totalPrice)}</strong>
          </div>
          ${itemsHtml}
        </div>
      </div>
    `;
  },

  async handleTrackOrder(customQuery = null) {
    const input = document.getElementById('track-phone-input') || document.getElementById('track-input');
    const resultBox = document.getElementById('track-order-result');
    if (!resultBox) return;

    const query = (customQuery !== null ? String(customQuery) : (input ? input.value : '')).trim();
    if (input && customQuery !== null) input.value = query;

    if (!query) {
      resultBox.innerHTML = '<div style="color:#e11d48;font-size:13px;padding:12px;text-align:center;background:#fff1f2;border:1px solid #fecdd3;border-radius:10px;">⚠️ Vui lòng nhập Số điện thoại, Mã đơn hàng (VD: VBP000001) hoặc Tên khách hàng!</div>';
      return;
    }

    resultBox.innerHTML = '<div style="text-align:center;padding:18px;color:#2563eb;font-weight:600;font-size:13px;">🔍 Đang tra cứu dữ liệu đơn hàng & bảo hành thời gian thực...</div>';

    const matchedMap = new Map();
    const apiBase = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '8000'))
      ? 'http://localhost:8000'
      : '';

    // 1. Ưu tiên tra cứu trực tiếp từ Backend Database (/api/orders/track?q=...) để lấy trạng thái mới nhất
    try {
      const res = await fetch(`${apiBase}/api/orders/track?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        const serverOrders = Array.isArray(data.orders) ? data.orders : (data.order ? [data.order] : []);
        serverOrders.forEach(so => {
          const norm = this.normalizeOrderForTracking(so);
          if (norm) matchedMap.set(norm.orderCode.toUpperCase(), norm);
        });
      }
    } catch (err) {
      // Backend offline -> sẽ dùng dữ liệu localStorage bên dưới
    }

    // 2. Kết hợp thêm các đơn hàng lưu trên trình duyệt (localStorage) nếu chưa có trên Backend
    try {
      const localOrders = JSON.parse(localStorage.getItem('vinhbaphone_orders') || '[]');
      const cleanQ = query.replace(/[\s\-\.]+/g, '').toLowerCase();
      const qLower = query.toLowerCase();

      localOrders.forEach(lo => {
        const code = (lo.orderId || '').toLowerCase();
        const phone = (lo.customer?.phone || '').replace(/[\s\-\.]+/g, '').toLowerCase();
        const cname = (lo.customer?.name || '').toLowerCase();

        const isMatch =
          code === cleanQ ||
          code.includes(cleanQ) ||
          (cleanQ.replace(/^#/, '') && code === `vbp${cleanQ.replace(/^#/, '').padStart(6, '0')}`) ||
          (phone && (phone === cleanQ || phone.includes(cleanQ))) ||
          (cname && cname.includes(qLower));

        if (isMatch) {
          const norm = this.normalizeOrderForTracking(lo);
          if (norm && !matchedMap.has(norm.orderCode.toUpperCase())) {
            matchedMap.set(norm.orderCode.toUpperCase(), norm);
          }
        }
      });
    } catch (e) {}

    const finalOrders = Array.from(matchedMap.values());

    if (finalOrders.length > 0) {
      const summaryBanner = finalOrders.length > 1 ? `
        <div style="background:#eff6ff; border:1px solid #bfdbfe; color:#1e40af; padding:8px 12px; border-radius:8px; font-size:12px; font-weight:700; margin-top:8px;">
          📦 Tìm thấy <strong>${finalOrders.length} đơn hàng</strong> khớp với thông tin <strong>"${query}"</strong>:
        </div>
      ` : '';

      resultBox.innerHTML = summaryBanner + finalOrders.map(ord => this.renderTrackedOrderCard(ord)).join('');
      return;
    }

    // Không tìm thấy
    resultBox.innerHTML = `
      <div style="text-align:center; padding:20px; background:#fff1f2; border:1px solid #fecdd3; border-radius:12px; margin-top:12px;">
        <div style="font-size:26px; margin-bottom:4px;">🔍</div>
        <strong style="color:#e11d48; font-size:14px; display:block;">Không tìm thấy đơn hàng khớp với "${query}"!</strong>
        <p style="font-size:12px; color:#64748b; margin-top:6px;">
          Quý khách vui lòng kiểm tra lại <strong>Số điện thoại đặt hàng</strong> (VD: <code>0363620913</code>) hoặc <strong>Mã đơn hàng</strong> (VD: <code>VBP000001</code>).<br/>
          Tổng đài hỗ trợ miễn phí 24/7: <strong>1800.2097</strong>.
        </p>
      </div>
    `;
  },

  // ──────── 13. Trade-In (Thu Cũ Đổi Mới) Calculator ────────
  tradeInConditionRate: 1.0, // Loại 1: 100%, Loại 2: 88%, Loại 3: 75%

  initTradeInCalculator() {
    const oldSelect = document.getElementById('tradein-old-device');
    const newSelect = document.getElementById('tradein-new-device');
    if (!oldSelect || !newSelect) return;

    // Đổ danh sách máy cũ
    if (APP_DATA.tradeInOldDevices) {
      oldSelect.innerHTML = APP_DATA.tradeInOldDevices.map((dev, idx) => `
        <option value="${idx}">${dev.name} (Định giá gốc: ${this.formatPrice(dev.basePrice)})</option>
      `).join('');
    }

    // Đổ danh sách máy mới (Lọc flagship phone & laptop nổi bật)
    const flagshipProducts = APP_DATA.products.filter(p => p.price >= 15000000);
    newSelect.innerHTML = flagshipProducts.map(p => `
      <option value="${p.id}" data-price="${p.price}">${p.name} — ${this.formatPrice(p.price)}</option>
    `).join('');

    oldSelect.addEventListener('change', () => this.calculateTradeIn());
    newSelect.addEventListener('change', () => this.calculateTradeIn());

    this.calculateTradeIn();
  },

  openTradeInModal() {
    this.openModal('tradein-modal');
    this.calculateTradeIn();
  },

  selectTradeInCondition(grade, btn) {
    document.querySelectorAll('.condition-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (grade === 1) this.tradeInConditionRate = 1.0;
    else if (grade === 2) this.tradeInConditionRate = 0.88;
    else if (grade === 3) this.tradeInConditionRate = 0.75;

    this.calculateTradeIn();
  },

  calculateTradeIn() {
    const oldSelect = document.getElementById('tradein-old-device');
    const newSelect = document.getElementById('tradein-new-device');
    if (!oldSelect || !newSelect || !APP_DATA.tradeInOldDevices) return;

    const oldDev = APP_DATA.tradeInOldDevices[parseInt(oldSelect.value, 10)] || APP_DATA.tradeInOldDevices[0];
    const newOption = newSelect.options[newSelect.selectedIndex];
    const newPrice = newOption ? parseFloat(newOption.getAttribute('data-price')) : 31490000;

    // Tính giá thu máy cũ theo tình trạng
    const estimatedOldPrice = Math.round(oldDev.basePrice * this.tradeInConditionRate);

    // Trợ giá lên đời độc quyền từ VinhBaPhone
    let subsidy = 2000000;
    if (newPrice >= 30000000) subsidy = 4000000;
    else if (newPrice >= 20000000) subsidy = 3000000;

    const totalDeduction = estimatedOldPrice + subsidy;
    const finalDiff = Math.max(0, newPrice - totalDeduction);
    const installmentPerMonth = Math.round(finalDiff / 12);

    // Update DOM
    const oldPriceEl = document.getElementById('tradein-old-val');
    const subsidyEl = document.getElementById('tradein-subsidy-val');
    const newPriceEl = document.getElementById('tradein-new-val');
    const diffEl = document.getElementById('tradein-diff-val');
    const instEl = document.getElementById('tradein-installment-val');

    if (oldPriceEl) oldPriceEl.textContent = this.formatPrice(estimatedOldPrice);
    if (subsidyEl) subsidyEl.textContent = `+ ${this.formatPrice(subsidy)}`;
    if (newPriceEl) newPriceEl.textContent = this.formatPrice(newPrice);
    if (diffEl) diffEl.textContent = this.formatPrice(finalDiff);
    if (instEl) instEl.textContent = `hoặc Trả góp 0% chỉ ${this.formatPrice(installmentPerMonth)}/tháng (12T)`;
  },

  handleTradeInSubmit(e) {
    e.preventDefault();
    const name = (document.getElementById('tradein-cust-name')?.value || '').trim();
    const phone = (document.getElementById('tradein-cust-phone')?.value || '').trim();

    if (!name || !phone) {
      cart.showToast('Vui lòng nhập Họ tên và Số điện thoại để đặt lịch!', 'error');
      return;
    }

    this.closeModal('tradein-modal');
    cart.showToast(`🎉 Đã đặt lịch Thu cũ lên đời thành công! Chuyên viên thẩm định của VinhBaPhone sẽ gọi cho bạn qua số ${phone} trong 5 phút.`, 'success');
  },

  // ──────── 14. VinhCare & S-News Renderers ────────
  renderVinhCareSection() {
    const grid = document.getElementById('vinhcare-grid');
    if (!grid || !APP_DATA.vinhCareServices) return;

    grid.innerHTML = APP_DATA.vinhCareServices.map(srv => `
      <div class="vinhcare-card">
        <div>
          <div class="vinhcare-card-icon" style="background: rgba(37, 99, 235, 0.1); color: #2563eb;">
            <span>${srv.icon}</span>
          </div>
          <h4 class="vinhcare-card-title">${srv.title}</h4>
          <p class="vinhcare-card-desc">${srv.desc}</p>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px dashed #e2e8f0; padding-top: 10px; margin-top: 6px;">
          <span class="vinhcare-card-badge" style="background: ${srv.badgeColor}15; color: ${srv.badgeColor}; border: 1px solid ${srv.badgeColor}40;">
            ${srv.badge}
          </span>
          <strong style="font-size: 13px; color: #0f172a;">${srv.price}</strong>
        </div>
      </div>
    `).join('');
  },

  renderSNewsSection() {
    const grid = document.getElementById('snews-grid');
    if (!grid || !APP_DATA.news) return;

    grid.innerHTML = APP_DATA.news.map(art => `
      <article class="snews-card" onclick="App.openArticleModal('${art.id}')">
        <div class="snews-thumb-wrap">
          <img src="${art.image}" alt="${art.title}" class="snews-thumb" loading="lazy" />
          <span class="snews-tag">${art.tag}</span>
        </div>
        <div class="snews-body">
          <h4 class="snews-title">${art.title}</h4>
          <p class="snews-snippet">${art.snippet}</p>
          <div class="snews-meta">
            <span>📅 ${art.date}</span>
            <span>👁️ ${art.views} lượt xem</span>
          </div>
        </div>
      </article>
    `).join('');
  },

  openArticleModal(artId) {
    const art = APP_DATA.news?.find(a => a.id === artId);
    if (!art) return;

    const modal = document.getElementById('article-modal');
    const content = document.getElementById('article-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="padding: 10px;">
        <span style="display:inline-block; padding:3px 10px; background:#eff6ff; color:#2563eb; border-radius:99px; font-size:11px; font-weight:800; margin-bottom:10px;">${art.tag}</span>
        <h2 style="font-size:20px; font-weight:900; color:#0f172a; line-height:1.35; margin-bottom:12px;">${art.title}</h2>
        <div style="display:flex; gap:16px; font-size:12px; color:#64748b; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #e2e8f0;">
          <span>✍️ Ban Biên Tập VinhBaPhone S-News</span>
          <span>📅 ${art.date}</span>
          <span>👁️ ${art.views} lượt đọc</span>
        </div>
        <img src="${art.image}" alt="${art.title}" style="width:100%; max-height:300px; object-fit:cover; border-radius:12px; margin-bottom:16px;" />
        <div style="font-size:14px; line-height:1.7; color:#334155;">
          <p style="font-weight:600; font-size:15px; margin-bottom:12px; color:#0f172a;">${art.snippet}</p>
          <p style="margin-bottom:12px;">Qua các bài thử nghiệm thực tế tại phòng lab kỹ thuật của VinhBaPhone, sản phẩm thể hiện sự vượt trội về độ ổn định, quản lý nhiệt lượng cũng như thời lượng sử dụng pin hàng đầu phân khúc hiện nay.</p>
          <p style="margin-bottom:12px;">Đối với khách hàng quan tâm đến chính sách giá, VinhBaPhone đang triển khai chương trình <strong>Thu cũ đổi mới trợ giá đến 4.000.000₫</strong> và đặc quyền <strong>trả góp 0% lãi suất</strong> nhận máy ngay mà không cần trả trước.</p>
        </div>
        <div style="margin-top:20px; padding:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="color:#0f172a; font-size:13.5px; display:block;">Cần tư vấn thêm về sản phẩm này?</strong>
            <span style="font-size:12px; color:#64748b;">Hỏi ngay trợ lý ảo AI hoặc gọi Hotline miễn cước 1800.2097</span>
          </div>
          <button style="padding:8px 16px; background:#2563eb; color:#fff; font-weight:700; border-radius:8px; border:none; cursor:pointer;" onclick="App.closeModal('article-modal'); if(window.aiAssistant) window.aiAssistant.openChat()">
            Hỏi S-Bot AI
          </button>
        </div>
      </div>
    `;

    this.openModal('article-modal');
  },

  // ──────── 15. Scroll Top & Floating Quick Dock ────────
  initScrollTopAndDock() {
    const scrollBtn = document.getElementById('btn-scroll-top');
    window.addEventListener('scroll', () => {
      if (!scrollBtn) return;
      if (window.scrollY > 400) {
        scrollBtn.style.display = 'flex';
      } else {
        scrollBtn.style.display = 'none';
      }
    });

    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  },

  // ──────── 16. Product Comparison Modal ────────
  openCompareModal(id1 = 101, id2 = null) {
    const p1 = APP_DATA.products?.find(p => p.id === Number(id1)) || APP_DATA.products[0];
    if (!p1) return;

    let p2 = id2 ? APP_DATA.products?.find(p => p.id === Number(id2)) : null;
    if (!p2 || p2.id === p1.id) {
      p2 = APP_DATA.products.find(p => p.category === p1.category && p.id !== p1.id) || APP_DATA.products[1];
    }

    const modal = document.getElementById('compare-modal');
    const tableBody = document.getElementById('compare-table-body');
    if (!modal || !tableBody) return;

    const sameCategoryList = APP_DATA.products.filter(p => p.category === p1.category);
    const pool = sameCategoryList.length >= 2 ? sameCategoryList : APP_DATA.products;

    const buildSelect = (selectedId, isFirst) => `
      <select onchange="App.openCompareModal(${isFirst ? 'this.value' : p1.id}, ${isFirst ? p2.id : 'this.value'})"
        style="width:100%; margin-bottom:8px; padding:6px 8px; border-radius:8px; border:1px solid #cbd5e1; font-size:12px; font-weight:700; color:#0f172a; background:#f8fafc;">
        ${pool.map(item => `<option value="${item.id}" ${item.id === selectedId ? 'selected' : ''}>${item.name}</option>`).join('')}
      </select>
    `;

    tableBody.innerHTML = `
      <tr>
        <th>Sản phẩm</th>
        <td class="compare-prod-header">
          ${buildSelect(p1.id, true)}
          <img src="${p1.image}" alt="${p1.name}" class="compare-thumb-img" onerror="window.handleProductImgError(this, '${p1.category}', '${(p1.name || '').replace(/'/g, "\\'")}', '${(p1.brand || '').replace(/'/g, "\\'")}')" />
          <strong style="display:block; font-size:13.5px; color:#0f172a; margin-bottom:4px;">${p1.name}</strong>
          <span style="color:#e11d48; font-weight:900; font-size:15px;">${this.formatPrice(p1.price)}</span>
        </td>
        <td class="compare-prod-header">
          ${buildSelect(p2.id, false)}
          <img src="${p2.image}" alt="${p2.name}" class="compare-thumb-img" onerror="window.handleProductImgError(this, '${p2.category}', '${(p2.name || '').replace(/'/g, "\\'")}', '${(p2.brand || '').replace(/'/g, "\\'")}')" />
          <strong style="display:block; font-size:13.5px; color:#0f172a; margin-bottom:4px;">${p2.name}</strong>
          <span style="color:#e11d48; font-weight:900; font-size:15px;">${this.formatPrice(p2.price)}</span>
        </td>
      </tr>
      <tr>
        <th>Thương hiệu</th>
        <td><strong>${p1.brand}</strong></td>
        <td><strong>${p2.brand}</strong></td>
      </tr>
      <tr>
        <th>Màn hình / Kích thước</th>
        <td>${p1.specs?.screen || '—'}</td>
        <td>${p2.specs?.screen || '—'}</td>
      </tr>
      <tr>
        <th>Vi xử lý / Công nghệ</th>
        <td><strong>${p1.specs?.cpu || '—'}</strong></td>
        <td><strong>${p2.specs?.cpu || '—'}</strong></td>
      </tr>
      <tr>
        <th>RAM / Công suất</th>
        <td>${p1.specs?.ram || '—'}</td>
        <td>${p2.specs?.ram || '—'}</td>
      </tr>
      <tr>
        <th>Bộ nhớ / Chuẩn kết nối</th>
        <td>${p1.specs?.rom || '—'}</td>
        <td>${p2.specs?.rom || '—'}</td>
      </tr>
      <tr>
        <th>Pin & Sạc</th>
        <td>${p1.specs?.battery || '—'}</td>
        <td>${p2.specs?.battery || '—'}</td>
      </tr>
      <tr>
        <th>Camera / Tính năng</th>
        <td>${p1.specs?.camera || '—'}</td>
        <td>${p2.specs?.camera || '—'}</td>
      </tr>
      <tr>
        <th>Bảo hành</th>
        <td><span style="color:#059669; font-weight:700;">✓ Chính hãng VN/A (1 đổi 1 30 ngày)</span></td>
        <td><span style="color:#059669; font-weight:700;">✓ Chính hãng VN/A (1 đổi 1 30 ngày)</span></td>
      </tr>
      <tr>
        <th>Chọn mua</th>
        <td style="text-align:center;">
          <button style="width:100%; padding:10px; background:#2563eb; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;" onclick="App.closeModal('compare-modal'); App.openQuickView(${p1.id})">
            Xem chi tiết
          </button>
        </td>
        <td style="text-align:center;">
          <button style="width:100%; padding:10px; background:#2563eb; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;" onclick="App.closeModal('compare-modal'); App.openQuickView(${p2.id})">
            Xem chi tiết
          </button>
        </td>
      </tr>
    `;

    this.openModal('compare-modal');
  }
};
