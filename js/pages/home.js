// Trang chủ: khối sản phẩm có 3 tab (New Arrivals / Best Seller / Black Friday) và khối Blog.

class HomePage {
    // Số sản phẩm hiện ở mỗi tab (2 hàng x 4 cột).
    constructor() {
        this.perTab = 8;
        this.tab = "new";
    }

    // Danh sách sản phẩm của từng tab (lấy đủ perTab sản phẩm):
    //  new  : các sản phẩm mới nhất trong cửa hàng;
    //  best : nhóm bán chạy (hot) rồi bổ sung bằng sản phẩm bộ sưu tập;
    //  bf   : các sản phẩm đang giảm giá.
    list(tab) {
        const store = products.filter(p => p.category !== "lookbook");
        let list = store;
        if (tab === "best") list = store.filter(p => p.category === "hot").concat(products.filter(p => p.category === "lookbook"));
        if (tab === "bf") list = Catalog.onSale();
        return list.slice(0, this.perTab);
    }

    // Đổi tab: tô đậm nút tab, vẽ lại lưới và đổi đích của nút "Xem tất cả".
    setTab(tab) {
        this.tab = tab;
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
        const more = Utils.$("home-more-link");
        if (tab === "bf") more.href = "pages/shop/black-friday.html";
        else more.href = "pages/shop/products.html";
        this.render();
    }

    // Vẽ lưới sản phẩm của tab hiện tại.
    render() {
        ProductCard.renderInto("home-product-grid", this.list(this.tab));
    }

    // Vẽ khối Blog: 3 bài mới nhất.
    renderBlog() {
        const box = Utils.$("home-blog-grid");
        box.innerHTML = BLOG_POSTS.slice(0, 3).map(Blog.cardHTML).join("");
    }

    // Điểm vào: vẽ lần đầu rồi vẽ lại mỗi khi đăng nhập / yêu thích thay đổi (để trái tim đổi màu đúng).
    init() {
        this.render();
        this.renderBlog();
        window.addEventListener("authchange", () => this.render());
        window.addEventListener("wishlistchange", () => this.render());
    }
}

const homePage = new HomePage();
homePage.init();
