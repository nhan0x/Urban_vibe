// Khởi động ứng dụng khi trang tải xong - phải nạp cuối cùng.
// Mỗi trang tự vẽ nội dung bằng script riêng (js/pages/*.js); file này chỉ lo phần chung: đồng bộ header theo trạng thái đăng nhập.

class App {
    // Điểm vào: chạy một lần khi trang nạp xong.
    init() {
        this.renderFirstTime();
        this.revealOnScroll();
    }

    // Các khối có class "reveal" hiện dần khi cuộn tới (thêm class "in"). Trình duyệt không hỗ trợ thì hiện luôn.
    revealOnScroll() {
        const items = document.querySelectorAll(".reveal");
        if (!("IntersectionObserver" in window)) { items.forEach(el => el.classList.add("in")); return; }
        const io = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                en.target.classList.add("in");
                io.unobserve(en.target);
            });
        }, { rootMargin: "0px 0px -10% 0px" });
        items.forEach(el => io.observe(el));
    }

    // Cập nhật header theo trạng thái đăng nhập (tên tài khoản, số giỏ hàng, số yêu thích...).
    renderFirstTime() {
        auth.refreshUI();
    }
}

new App().init();
