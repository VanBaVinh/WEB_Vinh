/**
 * VinhBaPhone Admin — API Client Helper
 * Quản lý JWT Token, cấu hình fetch wrapper và thông báo Toast.
 */

const TOKEN_KEY = "vinhba_admin_token";
const USER_KEY = "vinhba_admin_user";

class ApiClient {
  constructor() {
    this.baseUrl = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '8000'))
      ? 'http://localhost:8000'
      : '';
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  logout() {
    this.clearAuth();
    const logoutUrl = this.baseUrl ? `${this.baseUrl}/api/auth/logout` : "/api/auth/logout";
    fetch(logoutUrl, { method: "POST" }).catch(() => {});
    window.location.href = this.baseUrl ? `${this.baseUrl}/admin/login` : "/admin/login";
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    const fullUrl = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(fullUrl, config);

      // Nếu 401 Unauthorized: token hết hạn hoặc không hợp lệ -> chuyển về login
      if (response.status === 401) {
        this.clearAuth();
        if (!window.location.pathname.includes("/admin/login")) {
          const loginTarget = this.baseUrl ? `${this.baseUrl}/admin/login?reason=session_expired` : "/admin/login?reason=session_expired";
          window.location.href = loginTarget;
        }
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg =
          data?.error?.message ||
          data?.detail?.error?.message ||
          data?.detail ||
          `Lỗi hệ thống (${response.status})`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`[API Error] ${endpoint}:`, err);
      throw err;
    }
  }

  get(endpoint, params = {}) {
    const origin = this.baseUrl || (window.location.origin !== "null" ? window.location.origin : "http://localhost:8000");
    const url = new URL(endpoint, origin);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
        url.searchParams.append(key, params[key]);
      }
    });
    return this.request(url.toString(), { method: "GET" });
  }

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

const api = new ApiClient();

// ── Toast Notification Helper ──
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icon =
    type === "success" ? "✓" :
    type === "error" ? "✕" : "ℹ";

  toast.innerHTML = `
    <span class="text-base font-bold">${icon}</span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px) scale(0.95)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
