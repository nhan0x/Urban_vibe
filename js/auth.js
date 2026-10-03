/* ===== ĐĂNG KÝ / ĐĂNG NHẬP =====
   Việc: tạo tài khoản, đăng nhập, đăng xuất, và chặn các thao tác tạo dữ liệu (thêm giỏ hàng, yêu thích,
         đặt đơn) khi chưa đăng nhập. Chưa đăng nhập thì chỉ được xem.
   Lưu localStorage: "users" (danh sách tài khoản), "currentUser" (email người đang đăng nhập).
   Dùng: Utils (utils.js); accountModal (account-modal.js); cart, wishlist, productList (chỉ gọi lúc người dùng bấm).
   Giao diện: id="login-form", "register-form", "account-label" trong index.html.
   Lưu ý: đây là bản demo không có server, mật khẩu lưu thẳng trong trình duyệt, không dùng cho hệ thống thật. */

class Auth {
    constructor() {
        this.usersKey = "users";
        this.sessionKey = "currentUser";
    }

    users() {
        try { return JSON.parse(localStorage.getItem(this.usersKey)) || []; }
        catch (e) { return []; }
    }

    // Người đang đăng nhập (object) hoặc null
    current() {
        const email = localStorage.getItem(this.sessionKey);
        return email ? this.users().find(u => u.email === email) || null : null;
    }

    isLoggedIn() { return this.current() !== null; }

    // Hậu tố khóa localStorage riêng cho từng người dùng (giỏ hàng, yêu thích)
    userKey(base) {
        const u = this.current();
        return u ? base + ":" + u.email : null;
    }

    // Gọi ở đầu mọi thao tác tạo dữ liệu. Chưa đăng nhập: báo và mở cửa sổ đăng nhập, trả về false.
    requireLogin(message = "Vui lòng đăng nhập để thực hiện thao tác này") {
        if (this.isLoggedIn()) return true;
        Utils.showToast(message);
        accountModal.open("login");
        return false;
    }

    static isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    static isPhone(v) { return /^(0|\+84)\d{9}$/.test(v); }

    register(e) {
        e.preventDefault();
        const d = new FormData(e.target);
        const name = d.get("name").trim();
        const email = d.get("email").trim().toLowerCase();
        const phone = d.get("phone").trim();
        const password = d.get("password");

        if (!name) return Utils.showToast("Vui lòng nhập họ và tên");
        if (!Auth.isEmail(email)) return Utils.showToast("Email không hợp lệ");
        if (!Auth.isPhone(phone)) return Utils.showToast("Số điện thoại gồm 10 số, bắt đầu bằng 0 hoặc +84");
        if (password.length < 6) return Utils.showToast("Mật khẩu tối thiểu 6 ký tự");
        if (password !== d.get("confirm")) return Utils.showToast("Mật khẩu nhập lại không khớp");

        const list = this.users();
        if (list.some(u => u.email === email)) return Utils.showToast("Email này đã được đăng ký");
        if (list.some(u => u.phone === phone)) return Utils.showToast("Số điện thoại này đã được đăng ký");

        list.push({ name, email, phone, password });
        localStorage.setItem(this.usersKey, JSON.stringify(list));
        e.target.reset();
        this.startSession(email, `Đăng ký thành công! Chào ${name}`);
    }

    login(e) {
        e.preventDefault();
        const d = new FormData(e.target);
        const id = d.get("identity").trim().toLowerCase();
        const user = this.users().find(u => u.email === id || u.phone === id);
        if (!user || user.password !== d.get("password")) return Utils.showToast("Sai tài khoản hoặc mật khẩu");
        e.target.reset();
        this.startSession(user.email, `Đăng nhập thành công! Chào ${user.name}`);
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        this.refreshUI();
        Utils.showToast("Đã đăng xuất");
    }

    startSession(email, message) {
        localStorage.setItem(this.sessionKey, email);
        accountModal.close();
        this.refreshUI();
        Utils.showToast(message);
    }

    // Bấm nút "Tài Khoản" trên header: chưa đăng nhập thì mở form, đã đăng nhập thì hỏi đăng xuất
    onAccountClick() {
        const u = this.current();
        if (!u) { accountModal.open("login"); return; }
        if (confirm(`Bạn đang đăng nhập là ${u.name} (${u.email}).\nĐăng xuất?`)) this.logout();
    }

    // Vẽ lại mọi thứ phụ thuộc vào người dùng: nhãn header, giỏ hàng, yêu thích, nút tim trên thẻ sản phẩm
    refreshUI() {
        const u = this.current();
        Utils.setText("account-label", u ? u.name.split(" ").pop() : "Tài Khoản");
        cart.render();
        wishlist.updateBadge();
        productList.render(productList.current);
        // Các trang khác (thanh toán, tra cứu đơn) tự vẽ lại khi đăng nhập / đăng xuất
        window.dispatchEvent(new Event("authchange"));
    }
}

const auth = new Auth();

// Đăng nhập / đăng xuất ở tab khác thì tab này cũng cập nhật theo
window.addEventListener("storage", e => {
    if (e.key === auth.sessionKey) auth.refreshUI();
});
