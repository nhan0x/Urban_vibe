// Popup khuyến mãi hiện khi vào trang chủ (mỗi phiên trình duyệt chỉ hiện một lần).
// Đóng bằng nút ×, bấm vào nền tối hoặc phím Esc.

class PromoPopup {
    // Ảnh popup, đích khi bấm "SHOP NOW" và khoá sessionStorage để nhớ đã hiện rồi.
    constructor() {
        this.image = "image/slider/slide-2-mb.jpg";
        this.link = "pages/shop/products.html";
        this.key = "promoShown";
        this.build();
        if (!sessionStorage.getItem(this.key)) setTimeout(() => this.open(), 500);
    }

    // Dựng HTML popup và gắn sự kiện đóng.
    build() {
        const wrap = document.createElement("div");
        wrap.className = "promo-overlay";
        wrap.id = "promo-overlay";
        wrap.innerHTML = `
            <div class="promo-box" role="dialog" aria-label="Khuyến mãi">
                <button type="button" class="promo-close" aria-label="Đóng">${Icons.get("close")}</button>
                <a class="promo-image" href="${this.link}">
                    <img src="${this.image}" alt="Bộ sưu tập mới Urban Vibe">
                    <span class="promo-cta">Shop now</span>
                </a>
            </div>`;
        document.body.appendChild(wrap);
        this.el = wrap;
        wrap.querySelector(".promo-close").addEventListener("click", () => this.close());
        wrap.addEventListener("click", e => { if (e.target === wrap) this.close(); });
        document.addEventListener("keydown", e => { if (e.key === "Escape") this.close(); });
    }

    // Mở popup và khoá cuộn trang phía sau.
    open() {
        this.el.classList.add("open");
        document.body.style.overflow = "hidden";
        sessionStorage.setItem(this.key, "1");
    }

    // Đóng popup và mở lại cuộn trang (trừ khi ngăn kéo tìm kiếm đang mở).
    close() {
        if (!this.el.classList.contains("open")) return;
        this.el.classList.remove("open");
        if (!Utils.$("search-drawer").classList.contains("open")) document.body.style.overflow = "";
    }
}

const promoPopup = new PromoPopup();
