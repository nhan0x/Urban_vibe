// Khung giao diện dùng chung cho mọi trang: header + mega menu, menu trượt (mobile), ngăn kéo tìm kiếm, footer, nút nổi và toast.
// Bố cục theo owen.vn: header đen dính trên cùng, menu ngang có mega menu kèm ảnh, footer nền ảnh mờ tối.
// Mỗi trang chỉ đặt 2 chỗ trống <div id="site-header"></div> và <div id="site-footer"></div>, thêm data-nav vào <body>
// (home | collection | product | blackfriday | about) để mục menu tương ứng được tô đậm.
// File này phải nạp SAU icons.js, products.js, collections.js, stores.js, catalog.js, utils.js và TRƯỚC auth.js / header.js
// (các file đó cần tìm thấy phần tử do nó tạo ra). Mọi đường dẫn viết theo gốc dự án (trang con khai báo <base href="../../">).

// Thông tin liên hệ hiển thị ở footer và menu liên hệ.
const SITE_CONTACT = {
    address: "64 Tân Canh, Phường Tân Sơn Hòa, Thành Phố Hồ Chí Minh",
    email: "cskh@urbanvibe.vn",
    hours: "8:30 - 21:30 tất cả các ngày trong tuần",
    care: { label: "Chăm sóc khách hàng", text: "0775 665 912", tel: "0775665912" },
    sales: { label: "Tư vấn bán hàng", text: "0902 600 912", tel: "0902600912" }
};

// Các trang chính sách: [nhãn, địa chỉ]. Dùng cho menu "Giới thiệu" và cột "Hỗ trợ khách hàng" ở footer.
const POLICY_LINKS = [
    ["Chính sách bán hàng", "pages/info/policy.html?p=sale"],
    ["Chính sách bảo mật", "pages/info/policy.html?p=privacy"],
    ["Chính sách Membership", "pages/info/membership.html"],
    ["Chính sách quốc tế", "pages/info/policy.html?p=international"],
    ["Chính sách hoàn tiền", "pages/info/policy.html?p=refund"],
    ["Chính sách vận chuyển và giao nhận", "pages/info/policy.html?p=shipping"],
    ["Phương thức thanh toán", "pages/info/policy.html?p=payment"]
];

// Các trang giới thiệu: [nhãn, địa chỉ].
const ABOUT_LINKS = [
    ["Về Urban Vibe", "pages/info/about.html"],
    ["Membership", "pages/info/membership.html"],
    ["Hệ thống cửa hàng", "pages/info/branch.html"],
    ["Tuyển dụng", "pages/info/recruitment.html"],
    ["Blog", "pages/blog/blog.html"],
    ["Hỏi đáp (FAQ)", "pages/info/faq.html"]
];

class Layout {
    // Danh sách [nhãn, địa chỉ] → các thẻ <li><a>.
    static linksHTML(items) {
        return items.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("");
    }

    // Mục "Collections": "Tất cả" rồi lần lượt từng bộ sưu tập.
    static collectionLinks() {
        return [["Tất cả bộ sưu tập", "pages/collection/collection.html"]]
            .concat(collections.map(c => [Utils.prettyName(c.title),"pages/collection/collection-detail.html?slug=" + c.slug]));
    }

    // Mục "Sản phẩm": "Tất cả" rồi từng nhóm sản phẩm trong CATALOG_CATEGORIES.
    static productLinks() {
        return [["Tất cả sản phẩm", "pages/shop/products.html"]]
            .concat(CATALOG_CATEGORIES.map(c => [c.label, "pages/shop/products.html?c=" + c.key]));
    }

    // Logo: bông hoa 5 cánh + chữ "urban vibe" nghiêng. cls thêm class riêng cho từng chỗ đặt (ví dụ "footer-logo").
    static logoHTML(cls = "") {
        return `<a class="site-logo ${cls}" href="index.html" aria-label="Urban Vibe - Trang chủ">${Icons.get("bloom", "logo-mark")}<span class="logo-text">urban vibe</span></a>`;
    }

    // Một mục menu ngang có mega menu: cột link bên trái (tự chia 2 cột) + ảnh banner bên phải.
    static megaItemHTML(key, label, href, links, banner) {
        return `
            <li class="nav-item has-mega" data-nav-key="${key}">
                <a class="nav-link" href="${href}">${label}${Icons.get("chevronDown")}</a>
                <div class="mega">
                    <div class="mega-inner container">
                        <ul class="mega-links">${Layout.linksHTML(links)}</ul>
                        <a class="mega-banner" href="${href}"><img src="${banner}" alt="${label}" loading="lazy" decoding="async"></a>
                    </div>
                </div>
            </li>`;
    }

    // HTML header: logo | menu ngang (mega menu) | nút tìm kiếm, tài khoản, yêu thích, giỏ hàng dạng ô vuông.
    static headerHTML() {
        return `
<div class="site-top-chrome">
<header class="site-header" id="main-header">
    <div class="site-header-bar container">
        <button type="button" class="nav-toggle" onclick="header.openMobile()" aria-label="Mở menu">${Icons.get("menu")}</button>
        ${Layout.logoHTML()}
        <nav class="main-nav" aria-label="Menu chính">
            <ul class="nav-list">
                <li class="nav-item" data-nav-key="new"><a class="nav-link" href="pages/shop/products.html">Hàng mới về</a></li>
                ${Layout.megaItemHTML("collection", "Collections", "pages/collection/collection.html", Layout.collectionLinks(), "image/lookbook/for-her.webp")}
                ${Layout.megaItemHTML("product", "Sản phẩm", "pages/shop/products.html", Layout.productLinks(), "image/lookbook/modern-living.webp")}
                <li class="nav-item" data-nav-key="blackfriday"><a class="nav-link" href="pages/shop/black-friday.html"><span class="bf-text">Black Friday</span></a></li>
                <li class="nav-item" data-nav-key="store"><a class="nav-link" href="pages/info/branch.html">Hệ thống cửa hàng</a></li>
                ${Layout.megaItemHTML("about", "Thông tin thương hiệu", "pages/info/about.html", ABOUT_LINKS.concat(POLICY_LINKS.slice(0, 4)), "image/lookbook/autumn-breeze.webp")}
            </ul>
        </nav>

        <div class="header-tools">
            <button type="button" class="hd-btn" onclick="searchDrawer.open()" aria-label="Tìm kiếm">${Icons.get("searchSolid")}</button>
            <div class="header-account">
                <span class="account-name" id="account-label">Tài Khoản</span>
                <button type="button" class="hd-btn btn-account" id="account-btn" onclick="auth.onAccountClick()" aria-label="Tài khoản">${Icons.get("userSolid")}<span class="account-initial" id="account-initial"></span></button>
                <div class="mini-menu account-menu">
                    <a href="pages/account/account.html" class="only-logged-in">${Icons.get("user")}Tài khoản của tôi</a>
                    <a href="pages/account/sign-in.html" class="only-guest">${Icons.get("lock")}Đăng nhập</a>
                    <a href="pages/account/tracking.html">${Icons.get("box")}Quản lý đơn hàng</a>
                    <a href="pages/shop/wishlist.html">${Icons.get("heart")}Danh sách yêu thích</a>
                    <button type="button" class="only-logged-in" onclick="auth.logout()">${Icons.get("power")}Đăng xuất</button>
                </div>
            </div>
            <a class="hd-btn wish-link" href="pages/shop/wishlist.html" title="Sản phẩm yêu thích" aria-label="Sản phẩm yêu thích">${Icons.get("heartSolid")}<span class="cart-badge" id="wishlist-count">0</span></a>
            <a class="hd-btn cart-link" href="pages/shop/cart.html" title="Giỏ hàng" aria-label="Giỏ hàng">${Icons.get("bagSolid")}<span class="cart-badge" id="cart-count">0</span></a>
        </div>
    </div>
</header>
</div>

<!-- Menu trượt bên trái trên điện thoại / máy tính bảng -->
<div class="drawer-overlay" id="mobile-overlay" onclick="header.closeMobile()"></div>
<aside class="mobile-menu" id="mobile-menu" aria-label="Menu">
    <div class="mm-head">${Layout.logoHTML()}<button type="button" class="mm-close" onclick="header.closeMobile()" aria-label="Đóng">${Icons.get("close")}</button></div>
    <ul class="mm-list">
        <li class="mm-item" data-nav-key="home"><a href="index.html" class="mm-link">Trang chủ</a></li>
        <li class="mm-item" data-nav-key="new"><a href="pages/shop/products.html" class="mm-link">Hàng mới về</a></li>
        <li class="mm-item" data-nav-key="collection"><button type="button" class="mm-link" onclick="header.toggleMobileSub(this)">Collections ${Icons.get("chevronDown")}</button><ul class="mm-sub">${Layout.linksHTML(Layout.collectionLinks())}</ul></li>
        <li class="mm-item" data-nav-key="product"><button type="button" class="mm-link" onclick="header.toggleMobileSub(this)">Sản phẩm ${Icons.get("chevronDown")}</button><ul class="mm-sub">${Layout.linksHTML(Layout.productLinks())}</ul></li>
        <li class="mm-item" data-nav-key="blackfriday"><a href="pages/shop/black-friday.html" class="mm-link"><span class="bf-text">Black Friday</span></a></li>
        <li class="mm-item" data-nav-key="store"><a href="pages/info/branch.html" class="mm-link">Hệ thống cửa hàng</a></li>
        <li class="mm-item" data-nav-key="about"><button type="button" class="mm-link" onclick="header.toggleMobileSub(this)">Thông tin thương hiệu ${Icons.get("chevronDown")}</button><ul class="mm-sub">${Layout.linksHTML(ABOUT_LINKS.concat(POLICY_LINKS))}</ul></li>
    </ul>
</aside>

<!-- Ngăn kéo tìm kiếm trượt từ bên phải -->
<div class="drawer-overlay" id="search-overlay" onclick="searchDrawer.close()"></div>
<aside class="search-drawer" id="search-drawer" aria-label="Tìm kiếm sản phẩm">
    <button type="button" class="search-back" onclick="searchDrawer.close()" aria-label="Đóng">${Icons.get("arrowLeft")}</button>
    <form class="search-form" onsubmit="searchDrawer.submit(event)">
        ${Icons.get("search", "search-form-icon")}
        <input type="text" id="search-input" placeholder="Tìm kiếm sản phẩm" autocomplete="off" oninput="searchDrawer.suggest(this.value)">
        <button type="button" class="search-clear" id="search-clear" onclick="searchDrawer.clear()" aria-label="Xóa">${Icons.get("close")}</button>
    </form>
    <div class="search-body" id="search-body"></div>
</aside>`;
    }

    // HTML footer: nền ảnh mờ tối | logo + thông tin công ty | Giới thiệu | Hỗ trợ khách hàng | Kết nối + thanh toán | dòng bản quyền.
    static footerHTML() {
        return `
<footer class="site-footer">
    <div class="footer-bg" aria-hidden="true"></div>
    <div class="footer-inner container">
        <div class="footer-brand">
            ${Layout.logoHTML("footer-logo")}
            <p class="footer-company">CÔNG TY TNHH THƯƠNG MẠI URBAN VIBE</p>
            <p class="footer-line">${Icons.get("phone")}<span>Hotline: <a href="tel:${SITE_CONTACT.sales.tel}">${SITE_CONTACT.sales.text}</a></span></p>
            <p class="footer-line">${Icons.get("clock")}<span>${SITE_CONTACT.hours}</span></p>
            <p class="footer-addr"><strong>Địa chỉ:</strong> ${SITE_CONTACT.address}</p>
            <p class="footer-addr"><strong>Email:</strong> <a href="mailto:${SITE_CONTACT.email}">${SITE_CONTACT.email}</a></p>
        </div>
        <div class="footer-col">
            <p class="footer-title">Giới thiệu Urban Vibe</p>
            <ul class="footer-links">${Layout.linksHTML(ABOUT_LINKS)}</ul>
        </div>
        <div class="footer-col">
            <p class="footer-title">Hỗ trợ khách hàng</p>
            <ul class="footer-links">${Layout.linksHTML(POLICY_LINKS)}</ul>
        </div>
        <div class="footer-col">
            <p class="footer-title">Kết nối</p>
            <div class="footer-social">
                <a href="javascript:void(0)" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                <a href="javascript:void(0)" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="javascript:void(0)" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
                <a href="javascript:void(0)" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            </div>
            <p class="footer-title footer-title-pay">Phương thức thanh toán</p>
            <div class="footer-pay-list">
                <span class="pay-chip pay-cash">TIỀN MẶT</span>
                <span class="pay-chip pay-bank">BANKING</span>
                <span class="pay-chip pay-visa">VISA</span>
                <span class="pay-chip pay-master"><i></i><i></i></span>
            </div>
        </div>
    </div>
    <div class="footer-legal">
        <div class="container">
            <p>© 2026 by Urban Vibe · Đồ án môn Lập trình cơ sở với JavaScript (Web1044) · <a href="javascript:void(0)" onclick="studentPopup.open()">Thông tin sinh viên</a></p>
        </div>
    </div>
</footer>

<!-- Nút nổi bên phải: Messenger, Zalo (ô vuông bo góc màu đen như owen.vn) -->
<div class="float-widget" id="float-widget">
    <a class="float-btn" href="javascript:void(0)" onclick="Utils.showToast('Mở Messenger của Urban Vibe')" aria-label="Messenger">${Icons.get("chat")}</a>
    <a class="float-btn float-zalo" href="https://zalo.me/${SITE_CONTACT.sales.tel}" target="_blank" rel="noopener" aria-label="Zalo">Zalo</a>
</div>

<div id="toast"></div>`;
    }

    // Thay 2 chỗ trống của trang bằng header và footer (nếu trang có đặt chỗ trống).
    static mount() {
        const top = document.getElementById("site-header");
        const bottom = document.getElementById("site-footer");
        if (top) top.outerHTML = Layout.headerHTML();
        if (bottom) bottom.outerHTML = Layout.footerHTML();
        // Tô đậm mục menu của trang hiện tại theo <body data-nav="...">.
        const key = document.body.dataset.nav;
        if (key) document.querySelectorAll(`[data-nav-key="${key}"]`).forEach(el => el.classList.add("active"));
    }
}

Layout.mount();
