/**
 * VinhBaPhone SaaS Portal — Auth Controller
 * Xử lý xác thực, hiển thị/ẩn mật khẩu, đăng nhập mạng xã hội và ghi nhớ phiên.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Kiểm tra nếu đã có token hợp lệ -> Chuyển thẳng vào dashboard
  const token = api.getToken();
  if (token) {
    try {
      const user = await api.get("/api/auth/me");
      if (user && user.is_active) {
        window.location.href = api.baseUrl ? `${api.baseUrl}/admin` : "/admin";
        return;
      }
    } catch {
      api.clearAuth();
    }
  }

  // 2. Kiểm tra thông báo hết hạn phiên
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("reason") === "session_expired") {
    showToast("Session expired. Please sign in again.", "error");
  }

  // 3. Khởi tạo các phần tử DOM
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const rememberCheckbox = document.getElementById("remember-me");
  const submitBtn = document.getElementById("submit-btn");
  const errorAlert = document.getElementById("error-alert");
  const errorText = document.getElementById("error-text");

  // Load saved email if Remember Me was previously checked
  const savedUsername = localStorage.getItem("vinhba_remember_username");
  if (savedUsername) {
    usernameInput.value = savedUsername;
    if (rememberCheckbox) rememberCheckbox.checked = true;
  }

  // 4. Toggle Show / Hide Password
  const togglePasswordBtn = document.getElementById("toggle-password");
  const eyeIcon = document.getElementById("eye-icon");
  const eyeOffIcon = document.getElementById("eye-off-icon");

  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";

      if (isPassword) {
        eyeIcon.classList.add("hidden");
        eyeOffIcon.classList.remove("hidden");
      } else {
        eyeIcon.classList.remove("hidden");
        eyeOffIcon.classList.add("hidden");
      }
    });
  }

  // 5. Nút điền nhanh tài khoản Admin Demo
  const quickFillBtn = document.getElementById("quick-fill-btn");
  if (quickFillBtn) {
    quickFillBtn.addEventListener("click", () => {
      usernameInput.value = "admin";
      passwordInput.value = "Admin@2024";
      usernameInput.focus();
      showToast("Demo credentials loaded (admin / Admin@2024)", "info");
    });
  }

  // 6. Xử lý Social Logins (Google / GitHub)
  document.querySelectorAll(".social-login-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const provider = btn.getAttribute("data-provider");
      showToast(`${provider} authentication is ready for OAuth2 integration.`, "info");
    });
  });

  // 7. Forgot Password & Sign Up Placeholders
  const forgotPasswordLink = document.getElementById("forgot-password-link");
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Password reset link sent to registered email.", "info");
    });
  }

  const signupLink = document.getElementById("signup-link");
  if (signupLink) {
    signupLink.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("User registration is currently managed by System Admin.", "info");
    });
  }

  // 8. Xử lý gửi Form Đăng Nhập
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorAlert.classList.add("hidden");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      errorText.textContent = "Please enter both email and password.";
      errorAlert.classList.remove("hidden");
      return;
    }

    // Trạng thái Loading trên nút Submit
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Signing in...
    `;

    try {
      const data = await api.post("/api/auth/login", { username, password });

      api.setToken(data.access_token);
      api.setUser({
        username: data.username,
        role: data.role,
        full_name: data.full_name
      });

      // Lưu trạng thái Remember me
      if (rememberCheckbox && rememberCheckbox.checked) {
        localStorage.setItem("vinhba_remember_username", username);
      } else {
        localStorage.removeItem("vinhba_remember_username");
      }

      showToast("Sign in successful! Redirecting...", "success");

      setTimeout(() => {
        window.location.href = api.baseUrl ? `${api.baseUrl}/admin` : "/admin";
      }, 600);

    } catch (err) {
      errorText.textContent = err.message || "Invalid email or password.";
      errorAlert.classList.remove("hidden");
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
