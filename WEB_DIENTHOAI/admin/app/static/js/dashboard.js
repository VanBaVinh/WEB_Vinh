/**
 * VinhBaPhone Admin — Dashboard Controller v4.0
 * Điều hướng Tab (hỗ trợ URL hash), Thống kê trực quan theo danh mục,
 * Quản trị Sản phẩm / Đơn hàng / Người dùng nhanh chóng & chính xác 100%.
 */

let currentUser = null;
let activeTab = "overview";
let productQuickMode = "all"; // 'all' | 'flash' | 'low' | 'out'

// ── Metadata Danh Mục Tiếng Việt Chuẩn ──
const CATEGORY_META = {
  phone:       { name: "Điện thoại",       icon: "📱", badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  laptop:      { name: "Laptop & Mac",     icon: "💻", badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  tablet:      { name: "Máy tính bảng",    icon: "📟", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  pc:          { name: "PC & Màn hình",    icon: "🖥️", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  gaming:      { name: "Gaming & Console", icon: "🎮", badgeClass: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30" },
  audio:       { name: "Âm thanh Hi-Res",  icon: "🎧", badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  watch:       { name: "Đồng hồ TM",       icon: "⌚", badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  smarthome:   { name: "Nhà thông minh",   icon: "🏠", badgeClass: "bg-teal-500/15 text-teal-300 border-teal-500/30" },
  accessories: { name: "Phụ kiện Sạc",     icon: "🔌", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  storage:     { name: "Ổ cứng & Thẻ nhớ", icon: "💾", badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  used:        { name: "Máy cũ 99%",       icon: "💎", badgeClass: "bg-violet-500/15 text-violet-300 border-violet-500/30" },
  tradein:     { name: "Thu cũ đổi mới",   icon: "🔄", badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30" }
};

function getCategoryBadge(cat) {
  const key = (cat || "phone").toLowerCase();
  const meta = CATEGORY_META[key] || { name: cat || "Khác", icon: "📦", badgeClass: "bg-slate-700/40 text-slate-300 border-slate-600" };
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.badgeClass}"><span>${meta.icon}</span><span>${meta.name}</span></span>`;
}

// ── Smart Product Image Resolver (Không bao giờ hiển thị sai ảnh hoặc lỗi placeholder) ──
function getSmartStudioSvg(category = "phone", name = "Sản phẩm Công nghệ", brand = "VinhBaPhone") {
  if (typeof window.generateExactProductSvgDataUri === "function") {
    return window.generateExactProductSvgDataUri(category, name, brand);
  }
  const safeName = String(name || "Sản phẩm").replace(/[<>&"']/g, "").slice(0, 32);
  const safeBrand = String(brand || "CHÍNH HÃNG").replace(/[<>&"']/g, "").toUpperCase().slice(0, 18);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" rx="28" fill="#0f172a"/>
    <rect x="20" y="20" width="360" height="360" rx="22" fill="#1e293b" stroke="#38bdf8" stroke-opacity="0.35"/>
    <rect x="135" y="65" width="130" height="210" rx="20" fill="#020617" stroke="#38bdf8" stroke-width="3"/>
    <circle cx="200" cy="82" r="4" fill="#38bdf8"/>
    <text x="200" y="175" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-weight="800" font-size="14">${safeBrand}</text>
    <rect x="28" y="305" width="344" height="54" rx="12" fill="#020617"/>
    <text x="200" y="337" text-anchor="middle" fill="#f8fafc" font-family="sans-serif" font-weight="700" font-size="13">${safeName}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function resolveAdminProductImg(prod) {
  const url = (prod && prod.image_url) ? prod.image_url.trim() : "";
  if (!url || url.includes("via.placeholder.com") || url.includes("images.unsplash.com")) {
    return getSmartStudioSvg(prod?.category, prod?.name, prod?.brand);
  }
  return url;
}

window.handleAdminImgError = function (imgEl, category, name, brand) {
  if (!imgEl || imgEl.dataset.fallbackApplied) return;
  imgEl.dataset.fallbackApplied = "1";
  imgEl.src = getSmartStudioSvg(category, name, brand);
};

// ── Currency & Date Formatters ──
function formatVND(amount) {
  if (amount === null || amount === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// ── Role Badge ──
function getRoleBadge(role) {
  switch (role) {
    case "admin":
      return `<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Admin</span>`;
    case "staff":
      return `<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Nhân viên</span>`;
    default:
      return `<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">Khách hàng</span>`;
  }
}

// ── Order Status Badge ──
function getOrderStatusBadge(status) {
  switch (status) {
    case "pending":
      return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/40">● Chờ xử lý</span>`;
    case "confirmed":
      return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/40">✓ Đã xác nhận</span>`;
    case "shipping":
      return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/40">🚚 Đang giao</span>`;
    case "completed":
      return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40">★ Hoàn tất</span>`;
    case "cancelled":
      return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/40">✕ Đã hủy</span>`;
    default:
      return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">${status}</span>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Kiểm tra đăng nhập
  const token = api.getToken();
  if (!token) {
    window.location.href = "/admin/login";
    return;
  }

  try {
    currentUser = await api.get("/api/auth/me");
    if (!currentUser || !currentUser.is_active) {
      api.logout();
      return;
    }
    renderUserProfile(currentUser);
  } catch (err) {
    api.logout();
    return;
  }

  // 2. Gắn sự kiện chuyển tab & Modals
  setupTabs();
  setupModals();

  // 3. Khởi tạo Tab từ URL hash (#overview, #orders, #products, #users, #system)
  const initialHash = (window.location.hash || "").replace("#", "").trim();
  const validTabs = ["overview", "orders", "products", "users", "system"];
  if (validTabs.includes(initialHash)) {
    switchTab(initialHash);
  } else {
    loadTabContent("overview");
  }

  window.addEventListener("hashchange", () => {
    const h = (window.location.hash || "").replace("#", "").trim();
    if (validTabs.includes(h) && h !== activeTab) {
      switchTab(h);
    }
  });
});

// ── Render Header Profile ──
function renderUserProfile(user) {
  document.getElementById("header-user-name").textContent = user.full_name || user.username;
  document.getElementById("header-user-role").innerHTML = getRoleBadge(user.role);
  if (user.avatar_url) {
    const avatarImg = document.getElementById("header-user-avatar");
    if (avatarImg) avatarImg.src = user.avatar_url;
  }

  // Ẩn tab Quản lý Người dùng nếu không phải Admin tối cao
  if (user.role !== "admin") {
    const usersTabBtn = document.querySelector('[data-tab="users"]');
    if (usersTabBtn) usersTabBtn.classList.add("hidden");
  }
}

// ── Tab Navigation ──
function setupTabs() {
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  // Nút đăng xuất
  document.getElementById("logout-btn").addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?")) {
      api.logout();
    }
  });
}

function switchTab(tabName) {
  activeTab = tabName;
  if (window.location.hash !== `#${tabName}`) {
    history.replaceState(null, "", `#${tabName}`);
  }

  const tabTitles = {
    overview: "Tổng Quan Hệ Thống & Doanh Thu",
    orders:   "Quản Lý & Điều Phối Đơn Hàng",
    products: "Quản Lý Kho Sản Phẩm Đa Danh Mục",
    users:    "Quản Lý Tài Khoản & Phân Quyền",
    system:   "Giám Sát Máy Chủ & Cơ Sở Dữ Liệu"
  };
  const pageTitleEl = document.getElementById("page-title");
  if (pageTitleEl && tabTitles[tabName]) {
    pageTitleEl.textContent = tabTitles[tabName];
  }

  // Cập nhật giao diện button active
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    const isTarget = btn.getAttribute("data-tab") === tabName;
    if (isTarget) {
      btn.classList.add("bg-cyan-500/10", "text-cyan-400", "border-cyan-500/40");
      btn.classList.remove("text-slate-400", "hover:text-slate-200");
    } else {
      btn.classList.remove("bg-cyan-500/10", "text-cyan-400", "border-cyan-500/40");
      btn.classList.add("text-slate-400", "hover:text-slate-200");
    }
  });

  // Ẩn hiện tab contents
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.add("hidden");
  });
  const currentPanel = document.getElementById(`tab-${tabName}`);
  if (currentPanel) {
    currentPanel.classList.remove("hidden");
  }

  loadTabContent(tabName);
}

function loadTabContent(tabName) {
  switch (tabName) {
    case "overview":
      loadOverviewStats();
      break;
    case "orders":
      loadOrdersList();
      break;
    case "users":
      loadUsersList();
      break;
    case "products":
      loadProductsList();
      break;
    case "system":
      loadSystemStats();
      break;
  }
}

// ==========================================================================
// 1. OVERVIEW & STATS
// ==========================================================================
async function loadOverviewStats() {
  try {
    const data = await api.get("/api/stats");
    const m = data.metrics;

    document.getElementById("stat-total-users").textContent = m.total_users;
    document.getElementById("stat-active-users").textContent = `(${m.active_users} hoạt động)`;
    document.getElementById("stat-total-products").textContent = m.total_products;
    document.getElementById("stat-flash-sales").textContent = `${m.flash_sale_count} sản phẩm`;
    document.getElementById("stat-low-stock").textContent = `${m.low_stock_count} sản phẩm`;

    const prodBadge = document.getElementById("sidebar-products-badge");
    if (prodBadge) prodBadge.textContent = m.total_products;

    // Cập nhật thống kê Đơn hàng & Doanh thu
    const totalOrdersEl = document.getElementById("stat-total-orders");
    if (totalOrdersEl) totalOrdersEl.textContent = m.total_orders || 0;

    const pendingOrdersEl = document.getElementById("stat-pending-orders");
    if (pendingOrdersEl) pendingOrdersEl.textContent = m.pending_orders || 0;

    const totalRevenueEl = document.getElementById("stat-total-revenue");
    if (totalRevenueEl) totalRevenueEl.textContent = formatVND(m.total_revenue || 0);

    // Cập nhật badge chờ xử lý trên sidebar
    const sidebarBadge = document.getElementById("sidebar-pending-badge");
    if (sidebarBadge) {
      if (m.pending_orders > 0) {
        sidebarBadge.textContent = m.pending_orders;
        sidebarBadge.classList.remove("hidden");
      } else {
        sidebarBadge.classList.add("hidden");
      }
    }

    // Render Category Breakdown Grid
    renderCategoryBreakdown(data.category_counts || {}, m.total_products || 1);

    // Render Recent Orders (Highlight)
    const recentOrdersBody = document.getElementById("recent-orders-list");
    if (recentOrdersBody) {
      if (!data.recent_orders || data.recent_orders.length === 0) {
        recentOrdersBody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-500">Chưa có đơn đặt hàng nào gần đây</td></tr>`;
      } else {
        recentOrdersBody.innerHTML = data.recent_orders.map(o => `
          <tr class="border-b border-slate-800/60 hover:bg-slate-800/30">
            <td class="py-3 px-4 font-mono font-bold text-cyan-400 text-xs">#${o.id}</td>
            <td class="py-3 px-4 font-semibold text-slate-200 text-sm">${o.customer_name}</td>
            <td class="py-3 px-4 text-xs font-mono text-slate-400">${o.customer_phone}</td>
            <td class="py-3 px-4 text-xs text-slate-300">${o.items_count} món</td>
            <td class="py-3 px-4 font-bold text-cyan-300 text-xs">${formatVND(o.total_price)}</td>
            <td class="py-3 px-4">${getOrderStatusBadge(o.status)}</td>
            <td class="py-3 px-4 text-xs text-slate-400">${o.created_at || "-"}</td>
            <td class="py-3 px-4 text-right">
              <button
                onclick="viewOrderDetail(${o.id})"
                class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                Chi tiết
              </button>
            </td>
          </tr>
        `).join("");
      }
    }

    // Render Recent Users
    const recentUsersBody = document.getElementById("recent-users-list");
    if (recentUsersBody) {
      if (data.recent_users.length === 0) {
        recentUsersBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-slate-500">Chưa có người dùng</td></tr>`;
      } else {
        recentUsersBody.innerHTML = data.recent_users.map(u => `
          <tr class="border-b border-slate-800/60 hover:bg-slate-800/30">
            <td class="py-3 px-4 font-medium text-slate-200">${u.username}</td>
            <td class="py-3 px-4">${getRoleBadge(u.role)}</td>
            <td class="py-3 px-4 text-xs text-slate-400">${u.created_at || "-"}</td>
          </tr>
        `).join("");
      }
    }

    // Render Recent Products
    const recentProductsBody = document.getElementById("recent-products-list");
    if (recentProductsBody) {
      if (data.recent_products.length === 0) {
        recentProductsBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-slate-500">Chưa có sản phẩm</td></tr>`;
      } else {
        recentProductsBody.innerHTML = data.recent_products.map(p => `
          <tr class="border-b border-slate-800/60 hover:bg-slate-800/30 cursor-pointer" onclick="switchTab('products'); openEditProductModal(${p.id});">
            <td class="py-3 px-4 font-medium text-slate-200 truncate max-w-xs">${p.name}</td>
            <td class="py-3 px-4 text-cyan-400 font-semibold">${formatVND(p.price)}</td>
            <td class="py-3 px-4 text-xs font-bold">${p.stock} máy</td>
            <td class="py-3 px-4">
              ${p.is_flash_sale ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">⚡ Flash Sale</span>' : getCategoryBadge(p.category)}
            </td>
          </tr>
        `).join("");
      }
    }

  } catch (err) {
    showToast("Không thể tải chỉ số tổng quan: " + err.message, "error");
  }
}

function renderCategoryBreakdown(categoryCounts, totalProducts) {
  const container = document.getElementById("overview-category-breakdown");
  if (!container) return;

  const orderedCats = ["phone", "laptop", "tablet", "audio", "watch", "smarthome", "accessories", "pc", "gaming", "storage", "used"];
  container.innerHTML = orderedCats.map(catKey => {
    const count = categoryCounts[catKey] || 0;
    const meta = CATEGORY_META[catKey] || { name: catKey, icon: "📦", badgeClass: "" };
    const pct = Math.min(100, Math.round((count / Math.max(1, totalProducts)) * 100));
    return `
      <div
        onclick="jumpToCategoryProducts('${catKey}')"
        class="p-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all group"
      >
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-lg group-hover:scale-110 transition-transform">${meta.icon}</span>
          <span class="text-xs font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">${count} SP</span>
        </div>
        <div class="text-xs font-bold text-slate-200 truncate">${meta.name}</div>
        <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
          <div class="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style="width: ${Math.max(8, pct)}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function jumpToCategoryProducts(catKey) {
  const catSelect = document.getElementById("products-category-filter");
  if (catSelect) catSelect.value = catKey;
  switchTab("products");
}

// ==========================================================================
// 2. USERS MANAGEMENT (CRUD)
// ==========================================================================
let usersData = [];

async function loadUsersList() {
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-400">Đang tải dữ liệu...</td></tr>`;

  const search = document.getElementById("users-search-input").value;
  const role = document.getElementById("users-role-filter").value;

  try {
    usersData = await api.get("/api/users", { search, role });
    renderUsersTable(usersData);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-rose-400">${err.message}</td></tr>`;
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById("users-table-body");
  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-500">Không tìm thấy người dùng nào</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr class="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
      <td class="py-3.5 px-4 text-slate-400 font-mono text-xs">#${user.id}</td>
      <td class="py-3.5 px-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-cyan-400 text-xs">
            ${(user.username || "U")[0].toUpperCase()}
          </div>
          <div>
            <div class="font-medium text-slate-200">${user.username}</div>
            <div class="text-xs text-slate-400">${user.full_name || "Chưa đặt tên"}</div>
          </div>
        </div>
      </td>
      <td class="py-3.5 px-4 text-slate-300 text-sm">${user.email}</td>
      <td class="py-3.5 px-4">${getRoleBadge(user.role)}</td>
      <td class="py-3.5 px-4">
        ${user.is_active 
          ? '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Hoạt động</span>'
          : '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>Bị khóa</span>'
        }
      </td>
      <td class="py-3.5 px-4 text-right">
        <div class="flex items-center justify-end gap-2">
          <button onclick="openEditUserModal(${user.id})" class="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors cursor-pointer" title="Chỉnh sửa">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          ${user.id !== currentUser.id ? `
            <button onclick="confirmDeleteUser(${user.id}, '${user.username}')" class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer" title="Xóa">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join("");
}

// ==========================================================================
// 3. PRODUCTS MANAGEMENT (CRUD, QUICK FILTER, SORT, SYNC)
// ==========================================================================
let productsData = [];

async function loadProductsList() {
  const tbody = document.getElementById("products-table-body");
  tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">Đang tải danh sách sản phẩm...</td></tr>`;

  const search = document.getElementById("products-search-input").value.trim();
  const category = document.getElementById("products-category-filter").value;

  try {
    productsData = await api.get("/api/products", { search, category, limit: 250 });
    const badge = document.getElementById("sidebar-products-badge");
    if (badge && !search && !category) badge.textContent = productsData.length;
    applyProductsClientFilterAndSort();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-rose-400">${err.message}</td></tr>`;
  }
}

function setProductQuickMode(mode, btnEl) {
  productQuickMode = mode;
  document.querySelectorAll(".prod-quick-pill").forEach(btn => {
    btn.className = "prod-quick-pill px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer transition";
  });
  if (btnEl) {
    btnEl.className = "prod-quick-pill px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-pointer transition";
  }
  applyProductsClientFilterAndSort();
}

function applyProductsClientFilterAndSort() {
  let list = [...productsData];

  // Filter theo Quick Mode
  if (productQuickMode === "flash") {
    list = list.filter(p => Boolean(p.is_flash_sale));
  } else if (productQuickMode === "low") {
    list = list.filter(p => p.stock > 0 && p.stock <= 5);
  } else if (productQuickMode === "out") {
    list = list.filter(p => p.stock <= 0);
  }

  // Sort
  const sortMode = document.getElementById("products-sort-select")?.value || "id-desc";
  if (sortMode === "price-desc") list.sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sortMode === "price-asc") list.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sortMode === "stock-asc") list.sort((a, b) => (a.stock || 0) - (b.stock || 0));
  else if (sortMode === "name-asc") list.sort((a, b) => (a.name || "").localeCompare(b.name || "", "vi"));
  else list.sort((a, b) => (b.id || 0) - (a.id || 0));

  const countEl = document.getElementById("products-result-count");
  if (countEl) {
    countEl.innerHTML = `Hiển thị <strong class="text-cyan-400">${list.length}</strong> / ${productsData.length} sản phẩm`;
  }

  renderProductsTable(list);
}

function renderProductsTable(products) {
  const tbody = document.getElementById("products-table-body");
  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-500">Không tìm thấy sản phẩm nào khớp bộ lọc hiện tại</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(prod => {
    const safeName = (prod.name || "").replace(/'/g, "\\'");
    const safeBrand = (prod.brand || "").replace(/'/g, "\\'");
    const imgSrc = resolveAdminProductImg(prod);
    const discountPct = (prod.original_price && prod.original_price > prod.price)
      ? Math.round(((prod.original_price - prod.price) / prod.original_price) * 100)
      : 0;

    return `
      <tr class="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
        <td class="py-3 px-4 text-slate-400 font-mono text-xs font-bold">#${prod.id}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img
              src="${imgSrc}"
              alt="${prod.name}"
              class="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-700 shrink-0 shadow-sm"
              onerror="window.handleAdminImgError(this, '${prod.category}', '${safeName}', '${safeBrand}')"
            />
            <div class="min-w-0">
              <div class="font-bold text-slate-100 text-sm truncate max-w-md cursor-pointer hover:text-cyan-400 transition" onclick="openEditProductModal(${prod.id})" title="${prod.name}">
                ${prod.name}
              </div>
              <div class="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                <span class="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">${prod.brand}</span>
                ${prod.badge ? `<span class="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded text-[10px] font-semibold">${prod.badge}</span>` : ''}
                ${discountPct > 0 ? `<span class="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold">-${discountPct}%</span>` : ''}
              </div>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">${getCategoryBadge(prod.category)}</td>
        <td class="py-3 px-4">
          <div class="text-sm font-extrabold text-cyan-400">${formatVND(prod.price)}</div>
          ${prod.original_price && prod.original_price > prod.price ? `<div class="text-xs text-slate-500 line-through">${formatVND(prod.original_price)}</div>` : ''}
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-1.5">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${prod.stock === 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : prod.stock <= 5 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'}">
              ${prod.stock > 0 ? `${prod.stock} máy` : 'Hết hàng'}
            </span>
            <button onclick="quickToggleStock(${prod.id}, ${prod.stock})" class="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-cyan-300 border border-slate-700 transition cursor-pointer" title="Click để đổi nhanh Còn hàng / Hết hàng">
              ${prod.stock > 0 ? 'Đổi Hết' : '+Nhập 15'}
            </button>
          </div>
        </td>
        <td class="py-3 px-4 text-center">
          <button
            type="button"
            onclick="toggleProductFlashSale(${prod.id}, ${Boolean(prod.is_flash_sale)})"
            class="px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${prod.is_flash_sale ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30' : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200'}"
            title="Click để Bật / Tắt Flash Sale ngay lập tức"
          >
            ${prod.is_flash_sale ? '⚡ Đang Bật' : '○ Tắt'}
          </button>
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="quickEditPriceAndStock(${prod.id})" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition cursor-pointer" title="Sửa nhanh giá & tồn kho">
              ⚡ Giá/Kho
            </button>
            <button onclick="openEditProductModal(${prod.id})" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer" title="Chỉnh sửa chi tiết">
              Sửa
            </button>
            <button onclick="confirmDeleteProduct(${prod.id}, '${safeName}')" class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer" title="Xóa">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

async function toggleProductFlashSale(id, currentStatus) {
  try {
    await api.put(`/api/products/${id}`, { is_flash_sale: !currentStatus });
    const item = productsData.find(p => p.id === id);
    if (item) item.is_flash_sale = !currentStatus;
    showToast(`Đã ${!currentStatus ? 'BẬT ⚡ Flash Sale' : 'TẮT Flash Sale'} cho sản phẩm #${id}`, "success");
    applyProductsClientFilterAndSort();
  } catch (err) {
    showToast("Không thể đổi trạng thái Flash Sale: " + err.message, "error");
  }
}

async function syncCatalogNow() {
  try {
    const res = await api.post("/api/products/sync", {});
    showToast(res.message || "Đã đồng bộ kho hàng thành công!", "success");
    if (activeTab === "products") loadProductsList();
    else loadOverviewStats();
  } catch (err) {
    showToast("Lỗi đồng bộ kho: " + err.message, "error");
  }
}

// ==========================================================================
// 4. SYSTEM HEALTH MONITOR
// ==========================================================================
async function loadSystemStats() {
  try {
    const data = await api.get("/api/stats");
    const s = data.server;

    document.getElementById("sys-status").textContent = s.status;
    document.getElementById("sys-platform").textContent = s.platform;
    document.getElementById("sys-python").textContent = s.python_version;
    document.getElementById("sys-database").textContent = s.database_type;
    document.getElementById("sys-db-size").textContent = s.db_size;
    document.getElementById("sys-server-time").textContent = s.server_time;
    document.getElementById("sys-cpu").textContent = s.cpu_percent || "Bình thường";
    document.getElementById("sys-ram").textContent = s.ram_percent 
      ? `${s.ram_percent} (${s.ram_used_mb}MB / ${s.ram_total_mb}MB)` 
      : "Bình thường";

  } catch (err) {
    showToast("Không thể tải trạng thái hệ thống: " + err.message, "error");
  }
}

// ==========================================================================
// 5. MODAL HANDLERS & CRUD OPERATIONS
// ==========================================================================
function setupModals() {
  // Bộ lọc Users & Tìm kiếm
  document.getElementById("users-search-input").addEventListener("input", debounce(loadUsersList, 350));
  document.getElementById("users-role-filter").addEventListener("change", loadUsersList);
  document.getElementById("btn-add-user").addEventListener("click", openAddUserModal);

  // Bộ lọc Products & Tìm kiếm
  document.getElementById("products-search-input").addEventListener("input", debounce(loadProductsList, 350));
  document.getElementById("products-category-filter").addEventListener("change", loadProductsList);
  document.getElementById("btn-add-product").addEventListener("click", openAddProductModal);

  // Bộ lọc Orders & Tìm kiếm
  const orderSearchInput = document.getElementById("orders-search-input");
  if (orderSearchInput) orderSearchInput.addEventListener("input", debounce(loadOrdersList, 350));
  const orderStatusFilter = document.getElementById("orders-status-filter");
  if (orderStatusFilter) orderStatusFilter.addEventListener("change", loadOrdersList);

  // User Form Submit
  document.getElementById("user-form").addEventListener("submit", handleUserFormSubmit);

  // Product Form Submit & Live Image Preview
  const prodImgInput = document.getElementById("prod-image-input");
  const prodNameInput = document.getElementById("prod-name-input");
  const prodCatSelect = document.getElementById("prod-category-select");
  const prodBrandInput = document.getElementById("prod-brand-input");

  const refreshModalImagePreview = () => {
    const preview = document.getElementById("prod-image-preview");
    if (!preview) return;
    const rawUrl = prodImgInput ? prodImgInput.value.trim() : "";
    const cat = prodCatSelect ? prodCatSelect.value : "phone";
    const name = prodNameInput ? prodNameInput.value.trim() : "Sản phẩm mới";
    const brand = prodBrandInput ? prodBrandInput.value.trim() : "VinhBaPhone";
    preview.src = rawUrl || getSmartStudioSvg(cat, name, brand);
  };

  if (prodImgInput) prodImgInput.addEventListener("input", refreshModalImagePreview);
  if (prodNameInput) prodNameInput.addEventListener("input", () => { if (!prodImgInput.value.trim()) refreshModalImagePreview(); });
  if (prodCatSelect) prodCatSelect.addEventListener("change", () => { if (!prodImgInput.value.trim()) refreshModalImagePreview(); });
  if (prodBrandInput) prodBrandInput.addEventListener("input", () => { if (!prodImgInput.value.trim()) refreshModalImagePreview(); });

  document.getElementById("product-form").addEventListener("submit", handleProductFormSubmit);

  const quickEditForm = document.getElementById("quick-edit-form");
  if (quickEditForm) quickEditForm.addEventListener("submit", handleQuickEditFormSubmit);
}

// Tự động khớp ảnh chuẩn theo tên sản phẩm
function autoMatchProductImage() {
  const name = document.getElementById("prod-name-input")?.value.trim() || "Sản phẩm Công nghệ";
  const category = document.getElementById("prod-category-select")?.value || "phone";
  const brand = document.getElementById("prod-brand-input")?.value.trim() || "Chính hãng";

  let matchedUrl = "";
  if (window.APP_DATA && Array.isArray(window.APP_DATA.products)) {
    const q = name.toLowerCase();
    const found = window.APP_DATA.products.find(p =>
      p.name.toLowerCase() === q ||
      p.name.toLowerCase().includes(q) ||
      q.includes(p.name.toLowerCase())
    );
    if (found && found.image) {
      matchedUrl = found.image;
    }
  }

  if (!matchedUrl) {
    matchedUrl = getSmartStudioSvg(category, name, brand);
  }

  const imgInput = document.getElementById("prod-image-input");
  const preview = document.getElementById("prod-image-preview");
  if (imgInput) imgInput.value = matchedUrl;
  if (preview) preview.src = matchedUrl;
  showToast("Đã tự động khớp hình ảnh chuẩn theo tên sản phẩm!", "success");
}

// ── User Modal Functions ──
function openAddUserModal() {
  document.getElementById("user-modal-title").textContent = "Thêm Người Dùng Mới";
  document.getElementById("user-id-field").value = "";
  document.getElementById("user-form").reset();
  document.getElementById("user-password-container").classList.remove("hidden");
  document.getElementById("user-password-input").required = true;
  document.getElementById("user-username-input").disabled = false;
  document.getElementById("user-modal").classList.remove("hidden");
}

function openEditUserModal(id) {
  const user = usersData.find(u => u.id === id);
  if (!user) return;

  document.getElementById("user-modal-title").textContent = `Chỉnh Sửa Người Dùng #${user.id}`;
  document.getElementById("user-id-field").value = user.id;
  document.getElementById("user-username-input").value = user.username;
  document.getElementById("user-username-input").disabled = true;
  document.getElementById("user-email-input").value = user.email;
  document.getElementById("user-fullname-input").value = user.full_name || "";
  document.getElementById("user-role-select").value = user.role;
  document.getElementById("user-active-checkbox").checked = user.is_active;
  document.getElementById("user-password-input").value = "";
  document.getElementById("user-password-input").required = false;
  document.getElementById("user-password-container").classList.remove("hidden");
  document.getElementById("user-password-hint").textContent = "(Bỏ trống nếu không muốn đổi mật khẩu)";

  document.getElementById("user-modal").classList.remove("hidden");
}

function closeUserModal() {
  document.getElementById("user-modal").classList.add("hidden");
}

async function handleUserFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("user-id-field").value;
  const isEdit = Boolean(id);

  const payload = {
    email: document.getElementById("user-email-input").value.trim(),
    full_name: document.getElementById("user-fullname-input").value.trim(),
    role: document.getElementById("user-role-select").value,
    is_active: document.getElementById("user-active-checkbox").checked,
  };

  const passwordVal = document.getElementById("user-password-input").value;

  if (isEdit) {
    if (passwordVal) payload.password = passwordVal;
    try {
      await api.put(`/api/users/${id}`, payload);
      showToast("Cập nhật thông tin người dùng thành công!", "success");
      closeUserModal();
      loadUsersList();
    } catch (err) {
      showToast(err.message, "error");
    }
  } else {
    payload.username = document.getElementById("user-username-input").value.trim();
    payload.password = passwordVal;
    try {
      await api.post("/api/users", payload);
      showToast("Tạo người dùng mới thành công!", "success");
      closeUserModal();
      loadUsersList();
    } catch (err) {
      showToast(err.message, "error");
    }
  }
}

async function confirmDeleteUser(id, username) {
  if (confirm(`Bạn có chắc chắn muốn xóa tài khoản '${username}' (#${id})? Thao tác này không thể hoàn tác.`)) {
    try {
      await api.delete(`/api/users/${id}`);
      showToast(`Đã xóa người dùng '${username}'`, "success");
      loadUsersList();
    } catch (err) {
      showToast(err.message, "error");
    }
  }
}

// ── Product Modal Functions ──
function openAddProductModal() {
  document.getElementById("product-modal-title").textContent = "Thêm Sản Phẩm Mới";
  document.getElementById("product-id-field").value = "";
  document.getElementById("product-form").reset();
  document.getElementById("product-active-checkbox").checked = true;
  const preview = document.getElementById("prod-image-preview");
  if (preview) preview.src = getSmartStudioSvg("phone", "Sản phẩm mới", "VinhBaPhone");
  document.getElementById("product-modal").classList.remove("hidden");
}

function openEditProductModal(id) {
  const prod = productsData.find(p => p.id === id);
  if (!prod) return;

  document.getElementById("product-modal-title").textContent = `Chỉnh Sửa Sản Phẩm #${prod.id}`;
  document.getElementById("product-id-field").value = prod.id;
  document.getElementById("prod-name-input").value = prod.name;
  document.getElementById("prod-category-select").value = prod.category;
  document.getElementById("prod-brand-input").value = prod.brand;
  document.getElementById("prod-price-input").value = prod.price;
  document.getElementById("prod-original-price-input").value = prod.original_price || "";
  document.getElementById("prod-stock-input").value = prod.stock;
  document.getElementById("prod-image-input").value = prod.image_url || "";
  document.getElementById("prod-badge-input").value = prod.badge || "";
  document.getElementById("prod-flash-checkbox").checked = prod.is_flash_sale;
  document.getElementById("prod-desc-input").value = prod.description || "";
  document.getElementById("product-active-checkbox").checked = prod.is_active;

  const preview = document.getElementById("prod-image-preview");
  if (preview) {
    preview.src = resolveAdminProductImg(prod);
  }

  document.getElementById("product-modal").classList.remove("hidden");
}

function closeProductModal() {
  document.getElementById("product-modal").classList.add("hidden");
}

async function handleProductFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("product-id-field").value;
  const isEdit = Boolean(id);

  const name = document.getElementById("prod-name-input").value.trim();
  const category = document.getElementById("prod-category-select").value;
  const brand = document.getElementById("prod-brand-input").value.trim();
  let imageUrl = document.getElementById("prod-image-input").value.trim();
  if (!imageUrl) {
    imageUrl = getSmartStudioSvg(category, name, brand);
  }

  const payload = {
    name,
    category,
    brand,
    price: parseFloat(document.getElementById("prod-price-input").value),
    original_price: document.getElementById("prod-original-price-input").value ? parseFloat(document.getElementById("prod-original-price-input").value) : null,
    stock: parseInt(document.getElementById("prod-stock-input").value, 10),
    image_url: imageUrl,
    badge: document.getElementById("prod-badge-input").value.trim(),
    is_flash_sale: document.getElementById("prod-flash-checkbox").checked,
    is_active: document.getElementById("product-active-checkbox").checked,
    description: document.getElementById("prod-desc-input").value.trim()
  };

  try {
    if (isEdit) {
      await api.put(`/api/products/${id}`, payload);
      showToast("Cập nhật thông tin sản phẩm thành công!", "success");
    } else {
      await api.post("/api/products", payload);
      showToast("Thêm mới sản phẩm thành công!", "success");
    }
    closeProductModal();
    loadProductsList();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function confirmDeleteProduct(id, name) {
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm '${name}' (#${id})?`)) {
    try {
      await api.delete(`/api/products/${id}`);
      showToast(`Đã xóa sản phẩm '${name}'`, "success");
      loadProductsList();
    } catch (err) {
      showToast(err.message, "error");
    }
  }
}

// ── Quick Edit Price & Stock Modal ──
async function quickToggleStock(id, currentStock) {
  const newStock = currentStock > 0 ? 0 : 15;
  try {
    await api.put(`/api/products/${id}`, { stock: newStock });
    const prod = productsData.find(p => p.id === id);
    if (prod) prod.stock = newStock;
    showToast(`Đã cập nhật tồn kho: ${newStock > 0 ? 'Còn hàng (15 máy)' : 'Hết hàng'}`, 'success');
    applyProductsClientFilterAndSort();
  } catch (err) {
    showToast("Lỗi cập nhật tồn kho: " + err.message, "error");
  }
}

function quickEditPriceAndStock(id) {
  const prod = productsData.find(p => p.id === id);
  if (!prod) return;

  document.getElementById("qe-prod-id").value = prod.id;
  document.getElementById("qe-prod-name").textContent = `#${prod.id} • ${prod.name}`;
  document.getElementById("qe-price-input").value = prod.price;
  document.getElementById("qe-orig-price-input").value = prod.original_price || prod.price;
  document.getElementById("qe-stock-input").value = prod.stock;
  document.getElementById("qe-flash-checkbox").checked = Boolean(prod.is_flash_sale);

  document.getElementById("quick-edit-modal").classList.remove("hidden");
}

function closeQuickEditModal() {
  document.getElementById("quick-edit-modal").classList.add("hidden");
}

async function handleQuickEditFormSubmit(e) {
  e.preventDefault();
  const id = parseInt(document.getElementById("qe-prod-id").value, 10);
  const price = parseFloat(document.getElementById("qe-price-input").value);
  const origVal = document.getElementById("qe-orig-price-input").value;
  const stock = parseInt(document.getElementById("qe-stock-input").value, 10);
  const is_flash_sale = document.getElementById("qe-flash-checkbox").checked;

  const payload = { price, stock, is_flash_sale };
  if (origVal && !isNaN(parseFloat(origVal))) {
    payload.original_price = parseFloat(origVal);
  }

  try {
    await api.put(`/api/products/${id}`, payload);
    showToast(`Đã cập nhật nhanh sản phẩm #${id} thành công!`, "success");
    closeQuickEditModal();
    loadProductsList();
  } catch (err) {
    showToast("Lỗi cập nhật: " + err.message, "error");
  }
}

// ── Debounce Helper ──
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ==========================================================================
// 6. ORDERS MANAGEMENT (CRUD & STATUS UPDATES)
// ==========================================================================
let ordersData = [];

function setOrderQuickStatus(statusVal, btnEl) {
  const select = document.getElementById("orders-status-filter");
  if (select) select.value = statusVal;

  document.querySelectorAll(".order-quick-pill").forEach(btn => {
    btn.className = "order-quick-pill px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 cursor-pointer transition";
  });
  if (btnEl) {
    btnEl.className = "order-quick-pill px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-pointer transition";
  }
  loadOrdersList();
}

async function loadOrdersList() {
  const tbody = document.getElementById("orders-table-body");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">Đang tải danh sách đơn hàng...</td></tr>`;

  const searchInput = document.getElementById("orders-search-input");
  const statusFilter = document.getElementById("orders-status-filter");
  const search = searchInput ? searchInput.value.trim() : "";
  const status = statusFilter ? statusFilter.value : "";

  try {
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    ordersData = await api.get("/api/orders", params);
    renderOrdersTable(ordersData);
  } catch (err) {
    showToast("Không thể tải đơn hàng: " + err.message, "error");
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-rose-400">Lỗi khi tải danh sách đơn hàng.</td></tr>`;
  }
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById("orders-table-body");
  if (!tbody) return;
  if (!orders || orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-500 font-medium">Không tìm thấy đơn hàng nào phù hợp</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr class="hover:bg-slate-800/30 transition-colors border-b border-slate-800/60" id="order-row-${o.id}">
      <td class="py-3.5 px-4 font-mono font-bold text-cyan-400 text-xs">
        <div class="flex items-center gap-1">
          <span>#${o.id}</span>
          <span class="text-[10px] text-slate-500">VBP${String(o.id).padStart(6, '0')}</span>
        </div>
      </td>
      <td class="py-3.5 px-4">
        <div class="font-bold text-slate-100 text-sm">${o.customer_name}</div>
        <div class="text-xs text-slate-400 font-mono mt-0.5">📞 ${o.customer_phone}</div>
      </td>
      <td class="py-3.5 px-4 max-w-xs">
        <div class="text-xs text-slate-300 line-clamp-2" title="${o.customer_address}">${o.customer_address}</div>
        ${o.note ? `<div class="text-[11px] text-amber-400/90 italic mt-0.5 truncate">📝 ${o.note}</div>` : ''}
      </td>
      <td class="py-3.5 px-4 font-bold text-cyan-300 text-sm whitespace-nowrap">
        ${formatVND(o.total_price)}
      </td>
      <td class="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
        ${formatDate(o.created_at)}
      </td>
      <td class="py-3.5 px-4 text-center" id="dash-badge-cell-${o.id}">
        ${getOrderStatusBadge(o.status)}
      </td>
      <td class="py-3.5 px-4 text-center">
        <div class="flex items-center justify-center gap-1.5">
          ${o.status === 'pending' ? `
            <button
              type="button"
              onclick="quickUpdateOrderStatus(${o.id}, 'confirmed')"
              class="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer"
              title="Duyệt nhanh đơn hàng này"
            >
              ✓ Duyệt
            </button>
          ` : ''}
          <button
            type="button"
            onclick="viewOrderDetail(${o.id})"
            class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title="Xem chi tiết các sản phẩm đã đặt"
          >
            Chi tiết
          </button>
          <select
            onchange="quickUpdateOrderStatus(${o.id}, this.value)"
            class="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer font-medium"
            title="Đổi trạng thái đơn hàng"
          >
            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
            <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>Đã xác nhận</option>
            <option value="shipping" ${o.status === 'shipping' ? 'selected' : ''}>Đang giao</option>
            <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Hoàn tất</option>
            <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Hủy đơn</option>
          </select>
        </div>
      </td>
    </tr>
  `).join('');
}

async function quickUpdateOrderStatus(orderId, newStatus) {
  try {
    const res = await api.post(`/api/orders/${orderId}/update-status`, { status: newStatus });
    if (res && res.success) {
      showToast(res.message || `Đã cập nhật đơn #${orderId}`, "success");
      loadOrdersList();
      loadOverviewStats();
    }
  } catch (err) {
    showToast("Lỗi khi cập nhật trạng thái: " + err.message, "error");
  }
}

async function viewOrderDetail(orderId) {
  const modal = document.getElementById("order-detail-modal");
  const codeEl = document.getElementById("dash-modal-order-code");
  const metaEl = document.getElementById("dash-modal-order-meta");
  const totalEl = document.getElementById("dash-modal-order-total");
  const listEl = document.getElementById("dash-modal-items-list");

  if (!modal) return;
  listEl.innerHTML = `<div class="text-center py-6 text-slate-400 text-xs">Đang tải thông tin...</div>`;
  modal.classList.remove("hidden");

  try {
    const order = await api.get(`/api/orders/${orderId}`);
    codeEl.textContent = order.order_code || `#${order.id}`;
    metaEl.textContent = `Khách hàng: ${order.customer_name} • SĐT: ${order.customer_phone} • ${order.created_at}`;
    totalEl.textContent = formatVND(order.total_price);

    if (!order.items || order.items.length === 0) {
      listEl.innerHTML = `<div class="text-center py-6 text-slate-400 text-xs">Không có sản phẩm nào</div>`;
      return;
    }

    listEl.innerHTML = order.items.map(item => {
      const safeItemName = (item.name || "").replace(/'/g, "\\'");
      const itemImg = item.image || getSmartStudioSvg("phone", item.name, "VinhBaPhone");
      return `
        <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div class="flex items-center gap-3">
            <img
              src="${itemImg}"
              alt="${item.name}"
              class="w-12 h-12 rounded-lg object-contain bg-white p-1 border border-slate-700 shrink-0"
              onerror="window.handleAdminImgError(this, 'phone', '${safeItemName}', 'VinhBaPhone')"
            />
            <div>
              <h4 class="font-bold text-white text-xs">${item.name}</h4>
              <div class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                ${item.color ? `<span>Màu: <strong>${item.color}</strong></span>` : ''}
                ${item.storage ? `<span>• Bản: <strong>${item.storage}</strong></span>` : ''}
              </div>
              <div class="text-[11px] text-cyan-400 font-mono mt-0.5">
                Đơn giá: ${formatVND(item.price)}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-300 font-medium">SL: <strong class="text-white text-sm">×${item.quantity}</strong></div>
            <div class="text-xs font-bold text-cyan-300 mt-1">
              ${formatVND(item.subtotal || (item.price * item.quantity))}
            </div>
          </div>
        </div>
      `;
    }).join("");

    if (order.note) {
      listEl.innerHTML += `
        <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
          <strong>Ghi chú đơn hàng:</strong> ${order.note}
        </div>
      `;
    }
  } catch (err) {
    listEl.innerHTML = `<div class="text-center py-6 text-rose-400 text-xs">Không thể tải chi tiết đơn hàng: ${err.message}</div>`;
  }
}

function closeOrderDetailModal() {
  const modal = document.getElementById("order-detail-modal");
  if (modal) modal.classList.add("hidden");
}
