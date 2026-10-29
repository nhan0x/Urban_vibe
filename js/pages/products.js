// Trang danh sách sản phẩm (pages/shop/products.html): tab nhóm, sắp xếp, tìm kiếm (?q=), phân trang 20 sản phẩm / trang.
// Trạng thái nằm trên địa chỉ: ?c=nhóm &q=từ khoá &sort=cách xếp &page=số trang (đổi trạng thái thì cập nhật địa chỉ, không tải lại trang).

class ProductsPage {
    // perPage: số sản phẩm mỗi trang; các trường còn lại đọc từ địa chỉ trang.
    constructor() {
        this.perPage = 20;
        const q = new URLSearchParams(location.search);
        this.category = q.get("c") || "";
        this.keyword = q.get("q") || "";
        this.sort = q.get("sort") || "default";
        this.page = Math.max(1, parseInt(q.get("page"), 10) || 1);
        if (!CATALOG_CATEGORIES.some(c => c.key === this.category)) this.category = "";
        if (!CATALOG_SORTS.some(s => s.key === this.sort)) this.sort = "default";
    }

    // Danh sách sau khi lọc (tìm kiếm hoặc theo nhóm) và sắp xếp.
    list() {
        let list;
        if (this.keyword) list = Catalog.search(this.keyword);
        else list = Catalog.byCategory(this.category);
        return Catalog.sort(list, this.sort);
    }

    // Ghi trạng thái hiện tại lên địa chỉ trang (bỏ các giá trị mặc định cho địa chỉ gọn).
    syncUrl() {
        const q = new URLSearchParams();
        if (this.keyword) q.set("q", this.keyword);
        if (this.category) q.set("c", this.category);
        if (this.sort !== "default") q.set("sort", this.sort);
        if (this.page > 1) q.set("page", this.page);
        const text = q.toString();
        history.replaceState(null, "", location.pathname + (text ? "?" + text : ""));
    }

    // Vẽ dải tab: "Tất cả" + từng nhóm; tab của nhóm đang chọn được tô đậm và gạch chân.
    renderTabs() {
        const tabs = [{ key: "", label: "Tất cả" }].concat(CATALOG_CATEGORIES);
        Utils.$("category-tabs").innerHTML = tabs.map(t =>
            `<button type="button" class="cat-tab ${t.key === this.category && !this.keyword ? "active" : ""}" onclick="productsPage.setCategory('${t.key}')">${t.label}</button>`).join("");
    }

    // Vẽ danh sách lựa chọn sắp xếp và nhãn trên nút.
    renderSort() {
        Utils.$("sort-menu").innerHTML = CATALOG_SORTS.map(s =>
            `<li><button type="button" class="${s.key === this.sort ? "active" : ""}" onclick="productsPage.setSort('${s.key}')">${s.label}</button></li>`).join("");
        Utils.$("sort-label").textContent = CATALOG_SORTS.find(s => s.key === this.sort).label;
    }

    // Tiêu đề trang: kết quả tìm kiếm, tên nhóm hoặc "Sản phẩm".
    renderTitle() {
        let title = "Sản phẩm";
        if (this.keyword) title = "Tìm kiếm";
        else if (this.category) title = CATALOG_CATEGORIES.find(c => c.key === this.category).label;
        Utils.$("listing-title").textContent = title;
        Utils.$("breadcrumb-current").textContent = this.keyword ? `Kết quả cho "${this.keyword}"` : title;
        document.title = title + " - Urban Vibe | Thời trang nữ đa dạng";
    }

    // Vẽ lưới sản phẩm của trang hiện tại, số lượng kết quả và phân trang.
    render() {
        const all = this.list();
        const pages = Math.max(1, Math.ceil(all.length / this.perPage));
        if (this.page > pages) this.page = pages;
        const slice = all.slice((this.page - 1) * this.perPage, this.page * this.perPage);
        ProductCard.renderInto("listing-grid", slice, "Không tìm thấy sản phẩm phù hợp.");
        Utils.$("sort-count").textContent = all.length + " sản phẩm";
        this.renderPagination(pages);
        this.renderTitle();
    }

    // Danh sách số trang hiển thị: luôn có trang đầu, trang cuối, các trang quanh trang hiện tại; chỗ bị bỏ qua là "...".
    pageNumbers(pages) {
        const set = new Set([1, pages, this.page - 1, this.page, this.page + 1]);
        if (this.page <= 3) [2, 3, 4, 5].forEach(n => set.add(n));
        if (this.page >= pages - 2) [pages - 1, pages - 2, pages - 3, pages - 4].forEach(n => set.add(n));
        const nums = [...set].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b);
        const out = [];
        nums.forEach((n, i) => {
            if (i && n - nums[i - 1] > 1) out.push("...");
            out.push(n);
        });
        return out;
    }

    // Vẽ nút trước / số trang / nút sau (ẩn hẳn khi chỉ có 1 trang).
    renderPagination(pages) {
        const box = Utils.$("listing-pagination");
        if (pages <= 1) { box.innerHTML = ""; return; }
        const items = this.pageNumbers(pages).map(n => {
            if (n === "...") return '<span class="page-dots">…</span>';
            return `<button type="button" class="page-btn ${n === this.page ? "active" : ""}" onclick="productsPage.goTo(${n})">${n}</button>`;
        }).join("");
        box.innerHTML = `
            <button type="button" class="page-btn" onclick="productsPage.goTo(${this.page - 1})" ${this.page === 1 ? "disabled" : ""} aria-label="Trang trước">${Icons.get("chevronLeft")}</button>
            ${items}
            <button type="button" class="page-btn" onclick="productsPage.goTo(${this.page + 1})" ${this.page === pages ? "disabled" : ""} aria-label="Trang sau">${Icons.get("chevronRight")}</button>`;
    }

    // Chọn nhóm: về trang 1, bỏ từ khoá tìm kiếm.
    setCategory(key) {
        this.category = key;
        this.keyword = "";
        this.page = 1;
        this.refresh();
    }

    // Chọn cách sắp xếp rồi đóng menu.
    setSort(key) {
        this.sort = key;
        this.page = 1;
        Utils.$("sort-select").classList.remove("open");
        this.refresh();
    }

    // Mở / đóng menu sắp xếp.
    toggleSort() { Utils.$("sort-select").classList.toggle("open"); }

    // Sang trang số n rồi cuộn lên đầu danh sách.
    goTo(n) {
        this.page = n;
        this.refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Vẽ lại mọi thứ sau khi đổi trạng thái và cập nhật địa chỉ.
    refresh() {
        this.syncUrl();
        this.renderTabs();
        this.renderSort();
        this.render();
    }

    // Điểm vào: vẽ lần đầu, đóng menu sắp xếp khi bấm ra ngoài, vẽ lại khi đăng nhập / yêu thích thay đổi.
    init() {
        this.renderTabs();
        this.renderSort();
        this.render();
        document.addEventListener("click", e => { if (!e.target.closest("#sort-select")) Utils.$("sort-select").classList.remove("open"); });
        window.addEventListener("authchange", () => this.render());
        window.addEventListener("wishlistchange", () => this.render());
    }
}

const productsPage = new ProductsPage();
productsPage.init();
