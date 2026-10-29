// Trang đăng nhập / đăng ký (pages/account/sign-in.html?tab=login|register&return=địa chỉ quay lại).
// Dùng lại auth.login / auth.register (js/core/auth.js); file này lo giao diện: chuyển tab, ảnh trượt, bật nút khi nhập đủ, hiện / ẩn mật khẩu.

class SignInPage {
    // Khởi động: chọn tab theo địa chỉ, gắn icon vào các ô, dựng ảnh trượt, bật / tắt nút gửi theo dữ liệu nhập.
    constructor() {
        this.slideIndex = 0;
        this.slides = document.querySelectorAll("#auth-slides img");
        this.decorateInputs();
        this.buildDots();
        this.bindValidation("login-form", "login-submit");
        this.bindValidation("register-form", "register-submit");
        const tab = new URLSearchParams(location.search).get("tab");
        this.setTab(tab === "register" ? "register" : "login");
        setInterval(() => this.goTo(this.slideIndex + 1), 3500);
        if (auth.isLoggedIn()) accountModal.close();
    }

    // Gắn bông hoa vào logo, biểu tượng vào đầu mỗi ô nhập (người dùng cho ô tài khoản, ổ khoá cho ô mật khẩu) và biểu tượng mắt vào nút hiện mật khẩu.
    decorateInputs() {
        document.querySelector(".auth-logo").insertAdjacentHTML("afterbegin", Icons.get("bloom", "logo-mark"));
        document.querySelectorAll(".input-wrap").forEach(wrap => {
            const isPassword = wrap.querySelector("input[type=password]");
            wrap.insertAdjacentHTML("afterbegin", Icons.get(isPassword ? "lock" : "user"));
        });
        document.querySelectorAll(".eye-btn").forEach(b => { b.innerHTML = Icons.get("eyeOff"); });
    }

    // Chuyển giữa tab đăng nhập và đăng ký (cập nhật cả địa chỉ trang).
    setTab(tab) {
        document.querySelectorAll("[data-auth-pane]").forEach(p => p.classList.toggle("active", p.dataset.authPane === tab));
        const q = new URLSearchParams(location.search);
        q.set("tab", tab);
        history.replaceState(null, "", location.pathname + "?" + q.toString());
        document.title = (tab === "register" ? "Đăng ký" : "Đăng nhập") + " - Urban Vibe | Tài khoản của bạn";
    }

    // Dựng chấm tròn dưới ảnh và đổi ảnh khi bấm chấm.
    buildDots() {
        const box = document.getElementById("auth-dots");
        box.innerHTML = Array.from(this.slides, (_, i) => `<button type="button" aria-label="Ảnh ${i + 1}" onclick="signIn.goTo(${i})"></button>`).join("");
        this.goTo(0);
    }

    // Hiện ảnh thứ i (chạy vòng tròn) và tô chấm tương ứng.
    goTo(i) {
        this.slideIndex = (i + this.slides.length) % this.slides.length;
        this.slides.forEach((img, n) => img.classList.toggle("active", n === this.slideIndex));
        document.querySelectorAll("#auth-dots button").forEach((d, n) => d.classList.toggle("active", n === this.slideIndex));
    }

    // Nút gửi chỉ bật khi mọi ô bắt buộc đã có chữ.
    bindValidation(formId, buttonId) {
        const form = document.getElementById(formId);
        const btn = document.getElementById(buttonId);
        const check = () => { btn.disabled = [...form.querySelectorAll("input[required]")].some(i => !i.value.trim()); };
        form.addEventListener("input", check);
        check();
    }

    // Bấm biểu tượng mắt: đổi ô mật khẩu giữa dạng ẩn và hiện.
    toggleEye(btn) {
        const input = btn.parentNode.querySelector("input");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.innerHTML = Icons.get(show ? "eye" : "eyeOff");
    }

    // Đăng ký: ghép Họ + Tên thành họ tên đầy đủ rồi dùng auth.register.
    register(e) {
        const f = e.target.elements;
        f.name.value = (f.lastName.value.trim() + " " + f.firstName.value.trim()).trim();
        auth.register(e);
    }

    // Đăng nhập bằng mạng xã hội / OTP: chưa hỗ trợ trong đồ án.
    social(name) { Utils.showToast(`Đăng nhập bằng ${name} sắp ra mắt`); }
    otp() { Utils.showToast("Đăng nhập bằng OTP sắp ra mắt"); }
}

const signIn = new SignInPage();
