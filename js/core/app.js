// Khởi động ứng dụng khi trang tải xong - phải nạp cuối cùng.
// Mỗi trang tự vẽ nội dung bằng script riêng (js/pages/*.js); file này chỉ lo phần chung: đồng bộ header theo trạng thái đăng nhập.

class App {
    // Điểm vào: chạy một lần khi trang nạp xong.
    init() {
        this.renderFirstTime();
    }

    // Cập nhật header theo trạng thái đăng nhập (tên tài khoản, số giỏ hàng, số yêu thích...).
    renderFirstTime() {
        auth.refreshUI();
    }
}

new App().init();
