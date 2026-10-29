// Hành vi của header và các nút nổi: ngăn kéo menu, ngăn kéo tìm kiếm (mở từ nút nổi góc phải), nút liên hệ.

class Header {
    // Lắng nghe bấm ra ngoài để đóng các menu nhỏ đang mở (ngôn ngữ, liên hệ) và khôi phục trạng thái ẩn nút nổi.
    constructor() {
        document.addEventListener("click", e => {
            if (!e.target.closest(".float-contact-wrap")) this.closeContact();
        });
        document.addEventListener("keydown", e => {
            if (e.key !== "Escape") return;
            this.closeContact();
            searchDrawer.close();
            this.closeMobile();
        });
        if (localStorage.getItem("floatHidden") === "1") this.setFloatHidden(true);
    }

    // Mở / đóng ngăn kéo menu bên trái (nút hamburger).
    openMobile() {
        Utils.$("mobile-menu").classList.add("open");
        Utils.$("mobile-overlay").classList.add("open");
        document.body.style.overflow = "hidden";
    }
    closeMobile() {
        const menu = Utils.$("mobile-menu");
        if (!menu || !menu.classList.contains("open")) return;
        menu.classList.remove("open");
        Utils.$("mobile-overlay").classList.remove("open");
        document.body.style.overflow = "";
    }

    // Xổ / thu gọn một mục có danh sách con trong ngăn kéo menu (chỉ mở một mục một lúc).
    toggleMobileSub(btn) {
        const item = btn.closest(".mm-item");
        const open = !item.classList.contains("open");
        document.querySelectorAll(".mm-item.open").forEach(i => i.classList.remove("open"));
        item.classList.toggle("open", open);
    }

    // Mở / đóng một nhóm con trong menu xổ xuống (ví dụ "Chính sách & điều khoản").
    toggleSub(btn) {
        btn.closest(".nav-sub").classList.toggle("open");
    }

    // Mở / đóng bảng "Liên hệ" (Zalo, Messenger, Gọi điện, Chi nhánh); nút tròn đổi thành dấu × khi đang mở.
    toggleContact() {
        const open = Utils.$("contact-panel").classList.toggle("open");
        Utils.$("float-fab").classList.toggle("is-open", open);
    }
    closeContact() {
        const p = Utils.$("contact-panel");
        if (!p) return;
        p.classList.remove("open");
        Utils.$("float-fab").classList.remove("is-open");
    }

    // Ẩn / hiện cụm nút nổi góc phải (nhớ lựa chọn trong localStorage để lần sau vẫn giữ).
    toggleFloat() {
        const hidden = !Utils.$("float-widget").classList.contains("hidden");
        this.setFloatHidden(hidden);
        localStorage.setItem("floatHidden", hidden ? "1" : "0");
    }
    setFloatHidden(hidden) {
        Utils.$("float-widget").classList.toggle("hidden", hidden);
        Utils.$("float-show").classList.toggle("show", hidden);
        if (hidden) this.closeContact();
    }
}

// Ngăn kéo tìm kiếm bên phải: gõ chữ thì gợi ý tối đa 5 sản phẩm, Enter hoặc "Xem thêm" sang trang kết quả.
class SearchDrawer {
    constructor() {
        this.maxSuggest = 5;
        this.keywords = ["Áo", "Đầm", "Chân váy", "Quần", "Vest", "Set"];
        this.renderBody("");
    }

    // Mở ngăn kéo, khoá cuộn trang phía sau và đưa con trỏ vào ô tìm kiếm.
    open() {
        Utils.$("search-overlay").classList.add("open");
        Utils.$("search-drawer").classList.add("open");
        document.body.style.overflow = "hidden";
        setTimeout(() => Utils.$("search-input").focus(), 250);
    }

    // Đóng ngăn kéo và mở lại cuộn trang.
    close() {
        const drawer = Utils.$("search-drawer");
        if (!drawer || !drawer.classList.contains("open")) return;
        drawer.classList.remove("open");
        Utils.$("search-overlay").classList.remove("open");
        document.body.style.overflow = "";
    }

    // Xóa nội dung ô tìm kiếm.
    clear() {
        const input = Utils.$("search-input");
        input.value = "";
        input.focus();
        this.suggest("");
    }

    // Gõ chữ: hiện / ẩn nút xóa rồi vẽ lại phần gợi ý.
    suggest(text) {
        Utils.$("search-clear").style.display = text ? "flex" : "none";
        this.renderBody(text);
    }

    // Danh sách sản phẩm khớp từ khoá (so không phân biệt hoa thường và dấu), chỉ lấy nhóm hiển thị ở cửa hàng.
    match(text) {
        const kw = Utils.normalize(text.trim());
        if (!kw) return [];
        return products.filter(p => p.category !== "lookbook" && Utils.normalize(p.name).includes(kw));
    }

    // Vẽ phần thân ngăn kéo: chưa gõ gì thì hiện "Từ khóa được đề xuất"; có kết quả thì hiện danh sách + nút "Xem thêm".
    renderBody(text) {
        const body = Utils.$("search-body");
        if (!body) return;
        if (!text.trim()) {
            body.innerHTML = `
                <p class="search-heading">Từ khóa được đề xuất</p>
                <div class="search-keywords">${this.keywords.map(k => `<button type="button" onclick="searchDrawer.pick('${k}')">${k}</button>`).join("")}</div>`;
            return;
        }
        const found = this.match(text);
        if (!found.length) {
            body.innerHTML = `<p class="search-empty">Không tìm thấy sản phẩm cho "${Utils.escapeHTML(text)}"</p>`;
            return;
        }
        const items = found.slice(0, this.maxSuggest).map(p => `
            <a class="search-item" href="pages/shop/product.html?id=${p.id}">
                <img src="${p.image}" alt="" loading="lazy">
                <div><p class="search-item-name">${Utils.prettyName(p.name)}</p><p class="search-item-price">${Utils.formatPrice(p.price)}</p></div>
            </a>`).join("");
        body.innerHTML = `
            <div class="search-list">${items}</div>
            <a class="btn btn-outline search-more" href="pages/shop/products.html?q=${encodeURIComponent(text.trim())}">Xem thêm</a>`;
    }

    // Bấm một từ khoá gợi ý: điền vào ô và tìm luôn.
    pick(keyword) {
        const input = Utils.$("search-input");
        input.value = keyword;
        this.suggest(keyword);
    }

    // Nhấn Enter: sang trang sản phẩm kèm từ khoá.
    submit(e) {
        e.preventDefault();
        const text = Utils.$("search-input").value.trim();
        if (text) location.href = "pages/shop/products.html?q=" + encodeURIComponent(text);
    }
}

const header = new Header();
const searchDrawer = new SearchDrawer();
