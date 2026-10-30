// Trang danh sách sản phẩm (pages/shop/products.html) theo bố cục owen.vn:
// banner danh mục + thẻ kính mờ, hàng nút pill nhóm, cột lọc (nổi bật, khoảng giá), thanh công cụ (số sản phẩm, sắp xếp, lưới 3/4 cột), phân trang.
// Trạng thái nằm trên địa chỉ: ?c=nhóm &q=từ khoá &tag=new|hot|sale &price=khoảng &sort=cách xếp &page=số trang
// (đổi trạng thái thì cập nhật địa chỉ, không tải lại trang).

// Banner + mô tả cho từng nhóm sản phẩm ("" = tất cả).
const LISTING_HEROES = {
    "": { img: "image/lookbook/for-her.webp", desc: "Thời trang nữ Urban Vibe: thiết kế thanh lịch, chất liệu dễ chịu, phù hợp đi làm lẫn dạo phố." },
    "ao": { img: "image/lookbook/the-monochromes.webp", desc: "Áo nữ Urban Vibe với phom dáng tinh gọn, chất liệu mềm mại, dễ phối cùng chân váy hay quần âu." },
    "ao-khoac": { img: "image/lookbook/modern-living.webp", desc: "Vest, blazer và áo gile giúp set đồ công sở thêm chỉn chu mà vẫn trẻ trung." },
    "bo": { img: "image/lookbook/autumn-breeze.webp", desc: "Set đồ phối sẵn đồng bộ, tiết kiệm thời gian mà vẫn nổi bật." },
    "chan-vay": { img: "image/lookbook/polka-dot-charm.webp", desc: "Chân váy chữ A, đuôi cá, xếp ly: tôn dáng và dễ mặc mỗi ngày." },
    "dam": { img: "image/lookbook/romanza-a-como.webp", desc: "Đầm nữ tính cho mọi dịp: dạo phố, đi tiệc hay hẹn hò cuối tuần." },
    "quan": { img: "image/lookbook/just-move-on.webp", desc: "Quần suông, quần ống loe, quần short: thoải mái vận động, giữ phom chuẩn." }
};

// Bộ lọc "Nổi bật" (theo nhóm của sản phẩm) và "Khoảng giá" ([min, max], max = 0 là không giới hạn).
const LISTING_TAGS = [["new", "Hàng mới về"], ["hot", "Bán chạy"], ["sale", "Đang giảm giá"]];
const LISTING_PRICES = [
    ["0-500", "Dưới 500.000₫", 0, 500000],
    ["500-1000", "500.000₫ - 1.000.000₫", 500000, 1000000],
    ["1000-2000", "1.000.000₫ - 2.000.000₫", 1000000, 2000000],
    ["2000-", "Trên 2.000.000₫", 2000000, 0]
];

class ProductsPage {
    constructor() {
        this.perPage = 24;
        const q = new URLSearchParams(location.search);
        this.category = q.get("c") || "";
        this.keyword = q.get("q") || "";
        this.tag = q.get("tag") || "";
        this.price = q.get("price") || "";
        this.sort = q.get("sort") || "default";
        this.page = Math.max(1, parseInt(q.get("page"), 10) || 1);
        if (!CATALOG_CATEGORIES.some(c => c.key === this.category)) this.category = "";
        if (!LISTING_TAGS.some(t => t[0] === this.tag)) this.tag = "";
        if (!LISTING_PRICES.some(r => r[0] === this.price)) this.price = "";
        if (!CATALOG_SORTS.some(s => s.key === this.sort)) this.sort = "default";
        this.cols = 3;
        try { if (localStorage.getItem("listingCols") === "4") this.cols = 4; } catch { /* không đọc được thì dùng 3 cột */ }
    }

    // Danh sách sau khi lọc (tìm kiếm hoặc theo nhóm → nổi bật → khoảng giá) và sắp xếp.
    list() {
        let list = this.keyword ? Catalog.search(this.keyword) : Catalog.byCategory(this.category);
        if (this.tag === "sale") list = list.filter(p => Utils.getOriginalPrice(p) > p.price);
        else if (this.tag) list = list.filter(p => p.category === this.tag);
        const range = LISTING_PRICES.find(r => r[0] === this.price);
        if (range) list = list.filter(p => p.price >= range[2] && (!range[3] || p.price < range[3]));
        return Catalog.sort(list, this.sort);
    }

    // Ghi trạng thái hiện tại lên địa chỉ trang (bỏ các giá trị mặc định cho địa chỉ gọn).
    syncUrl() {
        const q = new URLSearchParams();
        if (this.keyword) q.set("q", this.keyword);
        if (this.category) q.set("c", this.category);
        if (this.tag) q.set("tag", this.tag);
        if (this.price) q.set("price", this.price);
        if (this.sort !== "default") q.set("sort", this.sort);
        if (this.page > 1) q.set("page", this.page);
        const text = q.toString();
        history.replaceState(null, "", location.pathname + (text ? "?" + text : ""));
    }

    // Hàng nút pill: "Tất cả" + từng nhóm; nhóm đang chọn nền đen chữ trắng.
    renderPills() {
        const tabs = [{ key: "", label: "Tất cả" }].concat(CATALOG_CATEGORIES);
        Utils.$("category-tabs").innerHTML = tabs.map(t =>
            `<button type="button" class="cat-pill ${t.key === this.category && !this.keyword ? "active" : ""}" onclick="productsPage.setCategory('${t.key}')">${t.label}</button>`).join("");
    }

    // Cột lọc: mỗi lựa chọn là ô vuông; bấm lại lựa chọn đang chọn thì bỏ chọn.
    renderFilters() {
        const option = (group, key, label, active) =>
            `<button type="button" class="filter-option ${active ? "active" : ""}" onclick="productsPage.setFilter('${group}', '${key}')"><span class="filter-check"></span>${label}</button>`;
        Utils.$("filter-tags").innerHTML = LISTING_TAGS.map(([k, l]) => option("tag", k, l, k === this.tag)).join("");
        Utils.$("filter-prices").innerHTML = LISTING_PRICES.map(([k, l]) => option("price", k, l, k === this.price)).join("");
    }

    // Danh sách sắp xếp và nhãn trên nút.
    renderSort() {
        Utils.$("sort-menu").innerHTML = CATALOG_SORTS.map(s =>
            `<li><button type="button" class="${s.key === this.sort ? "active" : ""}" onclick="productsPage.setSort('${s.key}')">${s.label}</button></li>`).join("");
        Utils.$("sort-label").textContent = CATALOG_SORTS.find(s => s.key === this.sort).label;
    }

    // Banner, tiêu đề, mô tả và đường dẫn theo nhóm / từ khoá đang xem.
    renderHead() {
        let title = "Sản phẩm";
        if (this.keyword) title = "Tìm kiếm";
        else if (this.category) title = CATALOG_CATEGORIES.find(c => c.key === this.category).label;
        const hero = LISTING_HEROES[this.keyword ? "" : this.category] || LISTING_HEROES[""];
        const img = Utils.$("cat-hero-img");
        if (!img.src.endsWith(hero.img)) img.src = hero.img;
        Utils.$("listing-title").textContent = this.keyword ? `Kết quả cho "${this.keyword}"` : title + " Urban Vibe";
        Utils.$("listing-desc").textContent = hero.desc;
        Utils.$("breadcrumb-current").textContent = this.keyword ? `Tìm kiếm "${this.keyword}"` : title;
        document.title = title + " - Urban Vibe | Thời trang nữ đa dạng";
    }

    // Lưới sản phẩm của trang hiện tại, số lượng kết quả và phân trang.
    render() {
        const all = this.list();
        const pages = Math.max(1, Math.ceil(all.length / this.perPage));
        if (this.page > pages) this.page = pages;
        const slice = all.slice((this.page - 1) * this.perPage, this.page * this.perPage);
        ProductCard.renderInto("listing-grid", slice, "Không tìm thấy sản phẩm phù hợp.");
        Utils.$("sort-count").textContent = all.length + " sản phẩm";
        this.renderPagination(pages);
        this.renderHead();
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

    // Nút trước / số trang / nút sau (ẩn hẳn khi chỉ có 1 trang).
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

    // Lưới 3 / 4 cột (nhớ lựa chọn trong localStorage).
    setCols(n) {
        this.cols = n;
        try { localStorage.setItem("listingCols", String(n)); } catch { /* bỏ qua: chỉ mất ghi nhớ */ }
        this.applyCols();
    }
    applyCols() {
        Utils.$("listing-grid").classList.toggle("cols-4", this.cols === 4);
        document.querySelectorAll(".view-btn").forEach(b => b.classList.toggle("active", Number(b.dataset.cols) === this.cols));
    }

    // Ẩn / hiện cột lọc (máy tính: thu gọn cột; điện thoại: mở / đóng khối lọc).
    toggleFilters() {
        const layout = Utils.$("listing-layout");
        if (window.innerWidth < 992) layout.classList.toggle("filters-open");
        else layout.classList.toggle("filters-hidden");
    }

    // Thu gọn / mở một nhóm lọc.
    toggleGroup(btn) { btn.closest(".filter-group").classList.toggle("open"); }

    // Chọn nhóm: về trang 1, bỏ từ khoá tìm kiếm.
    setCategory(key) {
        this.category = key;
        this.keyword = "";
        this.page = 1;
        this.refresh();
    }

    // Chọn / bỏ chọn một bộ lọc (group = "tag" | "price").
    setFilter(group, key) {
        this[group] = this[group] === key ? "" : key;
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

    toggleSort() { Utils.$("sort-select").classList.toggle("open"); }

    // Sang trang số n rồi cuộn lên đầu khu sản phẩm.
    goTo(n) {
        this.page = n;
        this.refresh();
        Utils.$("category-tabs").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Vẽ lại mọi thứ sau khi đổi trạng thái và cập nhật địa chỉ.
    refresh() {
        this.syncUrl();
        this.renderPills();
        this.renderFilters();
        this.renderSort();
        this.render();
    }

    // Điểm vào: vẽ lần đầu, gắn icon cho các nút công cụ, đóng menu sắp xếp khi bấm ra ngoài, vẽ lại khi đăng nhập / yêu thích thay đổi.
    init() {
        document.querySelector(".filter-toggle").innerHTML = Icons.get("filter");
        document.querySelector(".filter-close").innerHTML = Icons.get("chevronLeft");
        this.applyCols();
        this.renderPills();
        this.renderFilters();
        this.renderSort();
        this.render();
        document.addEventListener("click", e => { if (!e.target.closest("#sort-select")) Utils.$("sort-select").classList.remove("open"); });
        window.addEventListener("authchange", () => this.render());
        window.addEventListener("wishlistchange", () => this.render());
    }
}

const productsPage = new ProductsPage();
productsPage.init();
