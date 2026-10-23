// Header thu gọn khi cuộn và menu trượt bên trái.

class Header {
    // Lưu phần tử header, vị trí cuộn lần trước, rồi bắt đầu theo dõi việc cuộn trang.
    constructor() {
        this.el = Utils.$("main-header");
        this.lastScrollY = window.scrollY;
        this.scrollTicking = false;
        this.bindScroll();
        this.bindMenuHover();
    }

    // Theo dõi cuộn trang: cuộn xuống thì thu gọn header, cuộn lên hoặc ở sát đầu trang thì mở lại.
    // - scrollTicking + requestAnimationFrame: sự kiện scroll bắn rất dày, nên chỉ xử lý tối đa 1 lần mỗi khung hình cho mượt.
    // - delta = quãng vừa cuộn so với lần trước; chỉ phản ứng khi cuộn quá 6px để tránh giật khi cuộn nhẹ.
    bindScroll() {
        window.addEventListener("scroll", () => {
            if (this.scrollTicking) return;
            this.scrollTicking = true;
            requestAnimationFrame(() => {
                const y = Math.max(window.scrollY, 0);
                const delta = y - this.lastScrollY;
                if (y <= 40 || delta < -6) {
                    this.el.classList.remove("header-compact");
                    this.lastScrollY = y;
                } else if (delta > 6) {
                    this.el.classList.add("header-compact");
                    this.lastScrollY = y;
                }
                this.scrollTicking = false;
            });
        }, { passive: true });
    }

    // Mở menu trượt bên trái (chỉ thêm class "active" cho menu và lớp nền trong suốt bắt bấm ra ngoài).
    openMenu() {
        clearTimeout(this.closeTimer);
        Utils.$("menu-drawer").classList.add("active");
        Utils.$("drawer-overlay").classList.add("active");
    }

    // Đóng menu trượt.
    closeMenu() {
        clearTimeout(this.closeTimer);
        Utils.$("menu-drawer").classList.remove("active");
        Utils.$("drawer-overlay").classList.remove("active");
    }

    // Mở nếu đang đóng, đóng nếu đang mở (dùng cho lớp nền và các mục trong menu).
    toggleMenu() {
        if (Utils.$("menu-drawer").classList.contains("active")) this.closeMenu();
        else this.openMenu();
    }

    // Giống elise.vn: rê chuột vào nút ☰ thì menu trượt ra; rê chuột ra khỏi menu (hoặc rời nút ☰ mà không vào menu) thì tự đóng.
    // Màn hình cảm ứng không có rê chuột nên vẫn mở bằng cách bấm nút ☰.
    bindMenuHover() {
        const btn = document.querySelector(".hamburger-btn");
        const drawer = Utils.$("menu-drawer");
        if (!btn || !drawer) return;
        const closeSoon = ms => { clearTimeout(this.closeTimer); this.closeTimer = setTimeout(() => this.closeMenu(), ms); };
        // Con trỏ đổi sang bàn tay (cursor: pointer trong CSS) trước, giữ chuột ~0.35s trên nút rồi menu mới trượt ra;
        // rê qua nhanh rồi rời đi thì menu không mở.
        btn.addEventListener("mouseenter", () => {
            clearTimeout(this.openTimer);
            this.openTimer = setTimeout(() => this.openMenu(), 350);
        });
        btn.addEventListener("mouseleave", () => {
            clearTimeout(this.openTimer);
            closeSoon(900);
        });
        drawer.addEventListener("mouseenter", () => clearTimeout(this.closeTimer));
        drawer.addEventListener("mouseleave", () => closeSoon(200));
    }
    // Mở / đóng một mục con trong menu theo id.
    toggleSub(id) {
        const el = Utils.$(id);
        if (el) el.classList.toggle("open");
    }
}

const header = new Header();
