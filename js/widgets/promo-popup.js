// Banner khuyến mãi dưới đáy màn hình trang chủ: hiện sau khi trang tải xong, không che nội dung.
// Đóng bằng nút ×; đã đóng trong phiên trình duyệt thì không hiện lại.

class PromoPopup {
    constructor() {
        this.link = "pages/shop/products.html";
        this.key = "promoShown";
        this.build();
        if (!this.isDismissed()) {
            const show = () => setTimeout(() => this.open(), 3000);
            if (document.readyState === "complete") show();
            else window.addEventListener("load", show, { once: true });
        }
    }

    // Đọc sessionStorage trong try/catch: trình duyệt có thể chặn truy cập.
    isDismissed() {
        try { return sessionStorage.getItem(this.key) === "1"; } catch { return false; }
    }

    // Dựng HTML banner và gắn sự kiện đóng.
    build() {
        const wrap = document.createElement("div");
        wrap.className = "promo-banner";
        wrap.id = "promo-overlay";
        wrap.setAttribute("role", "region");
        wrap.setAttribute("aria-label", "Khuyến mãi");
        wrap.innerHTML = `
            <span class="promo-text">Bộ sưu tập mới Urban Vibe đã lên kệ</span>
            <a class="promo-link" href="${this.link}">Shop now</a>
            <button type="button" class="promo-close" aria-label="Đóng">${Icons.get("close")}</button>`;
        document.body.appendChild(wrap);
        this.el = wrap;
        wrap.querySelector(".promo-close").addEventListener("click", () => this.close());
    }

    // Hiện banner và ghi nhớ để phiên này không hiện lại.
    open() {
        this.el.classList.add("open");
        try { sessionStorage.setItem(this.key, "1"); } catch { /* bỏ qua: chỉ mất ghi nhớ */ }
    }

    // Ẩn banner.
    close() {
        this.el.classList.remove("open");
    }
}

const promoPopup = new PromoPopup();
