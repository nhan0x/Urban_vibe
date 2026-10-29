// Khung giao diện dùng chung cho mọi trang: header + menu, ngăn kéo tìm kiếm, footer, nút nổi góc phải và toast.
// Mỗi trang chỉ đặt 2 chỗ trống <div id="site-header"></div> và <div id="site-footer"></div>, thêm data-nav vào <body>
// (home | collection | product | blackfriday | about) để mục menu tương ứng được tô đậm.
// File này phải nạp SAU icons.js, products.js, collections.js, stores.js, catalog.js, utils.js và TRƯỚC auth.js / header.js
// (các file đó cần tìm thấy phần tử do nó tạo ra). Mọi đường dẫn viết theo gốc dự án (trang con khai báo <base href="../../">).

// Thông tin liên hệ hiển thị ở footer và menu liên hệ.
const SITE_CONTACT = {
    address: "64 Tân Canh, Phường Tân Sơn Hòa, Thành Phố Hồ Chí Minh",
    email: "cskh@urbanvibe.vn",
    care: { label: "Chăm sóc khách hàng", text: "0775 665 912", tel: "0775665912" },
    sales: { label: "Tư vấn bán hàng", text: "0902 600 912", tel: "0902600912" }
};

// Các trang chính sách: [nhãn, địa chỉ]. Dùng cho menu "Giới thiệu" và cột "Chính sách khách hàng" ở footer.
const POLICY_LINKS = [
    ["Chính sách bán hàng", "pages/info/policy.html?p=sale"],
    ["Chính sách bảo mật", "pages/info/policy.html?p=privacy"],
    ["Chính sách Membership", "pages/info/membership.html"],
    ["Chính sách quốc tế", "pages/info/policy.html?p=international"],
    ["Chính sách hoàn tiền", "pages/info/policy.html?p=refund"],
    ["Chính sách vận chuyển và giao nhận", "pages/info/policy.html?p=shipping"],
    ["Phương thức thanh toán", "pages/info/policy.html?p=payment"]
];

class Layout {
    // Mục "Collections": "Tất cả" rồi lần lượt từng bộ sưu tập.
    static collectionsMenuHTML() {
        const items = [["Tất cả", "pages/collection/collection.html"]]
            .concat(collections.map(c => [c.title, "pages/collection/collection-detail.html?slug=" + c.slug]));
        return items.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("");
    }

    // Mục "Sản phẩm": "Tất cả" rồi từng nhóm sản phẩm trong CATALOG_CATEGORIES.
    static productsMenuHTML() {
        const items = [["Tất cả", "pages/shop/products.html"]]
            .concat(CATALOG_CATEGORIES.map(c => [c.label, "pages/shop/products.html?c=" + c.key]));
        return items.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("");
    }

    // Mục "Giới thiệu": các trang giới thiệu + nhóm "Chính sách & điều khoản" xổ xuống ngay trong menu.
    static aboutMenuHTML() {
        const policy = POLICY_LINKS.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("");
        return `
            <li><a href="pages/info/about.html">About us</a></li>
            <li class="nav-sub">
                <button type="button" class="nav-sub-toggle" onclick="header.toggleSub(this)">Chính sách &amp; điều khoản ${Icons.get("chevronDown")}</button>
                <ul class="nav-sub-list">${policy}</ul>
            </li>
            <li><a href="pages/info/membership.html">Membership</a></li>
            <li><a href="pages/info/branch.html">Chi nhánh</a></li>
            <li><a href="pages/info/recruitment.html">Tuyển dụng</a></li>
            <li><a href="pages/info/faq.html">FAQ</a></li>`;
    }

    // Logo: bông hoa 5 cánh + chữ "urban vibe" nghiêng. cls thêm class riêng cho từng chỗ đặt (ví dụ "footer-logo").
    static logoHTML(cls = "") {
        return `<a class="site-logo ${cls}" href="index.html" aria-label="Urban Vibe - Trang chủ">${Icons.get("bloom", "logo-mark")}<span class="logo-text">urban vibe</span></a>`;
    }

    // HTML header gọn (giống elise.vn): hamburger + logo | Gọi Ngay, tài khoản, giỏ hàng, yêu thích (tìm kiếm nằm ở cụm nút nổi). Menu nằm trong ngăn kéo bên dưới.
    static headerHTML() {
        return `
<div class="site-top-chrome">
<header class="site-header" id="main-header">
    <div class="site-header-bar">
        <div class="header-left">
            <button type="button" class="nav-toggle" onclick="header.openMobile()" aria-label="Mở menu">${Icons.get("menu")}</button>
            ${Layout.logoHTML()}
        </div>

        <div class="header-tools">
            <a class="header-link header-call" href="tel:${SITE_CONTACT.sales.tel}">${Icons.get("phone")}<span>Gọi Ngay</span></a>
            <div class="header-account">
                <button type="button" class="header-link btn-account" id="account-btn" onclick="auth.onAccountClick()">${Icons.get("user")}<span id="account-label">Tài Khoản</span></button>
                <div class="mini-menu account-menu">
                    <a href="pages/account/account.html" class="only-logged-in">${Icons.get("user")}Tài khoản của tôi</a>
                    <a href="pages/account/tracking.html">${Icons.get("box")}Quản lý đơn hàng</a>
                    <a href="pages/account/sign-in.html" class="only-guest">${Icons.get("power")}Đăng nhập</a>
                    <button type="button" class="only-logged-in" onclick="auth.logout()">${Icons.get("power")}Đăng xuất</button>
                </div>
            </div>
            <a class="icon-btn cart-link" href="pages/shop/cart.html" title="Giỏ hàng">${Icons.get("bag")}<span class="cart-badge" id="cart-count">0</span></a>
            <a class="icon-btn wish-link" href="pages/shop/wishlist.html" title="Sản phẩm yêu thích">${Icons.get("heart")}<span class="cart-badge" id="wishlist-count">0</span></a>
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
        <li class="mm-item" data-nav-key="collection"><button type="button" class="mm-link" onclick="header.toggleMobileSub(this)">Collections ${Icons.get("chevronDown")}</button><ul class="mm-sub">${Layout.collectionsMenuHTML()}</ul></li>
        <li class="mm-item" data-nav-key="product"><button type="button" class="mm-link" onclick="header.toggleMobileSub(this)">Sản phẩm ${Icons.get("chevronDown")}</button><ul class="mm-sub">${Layout.productsMenuHTML()}</ul></li>
        <li class="mm-item" data-nav-key="blackfriday"><a href="pages/shop/black-friday.html" class="mm-link"><span class="bf-text">Black Friday</span></a></li>
        <li class="mm-item" data-nav-key="about"><button type="button" class="mm-link" onclick="header.toggleMobileSub(this)">Giới thiệu ${Icons.get("chevronDown")}</button><ul class="mm-sub">${Layout.aboutMenuHTML()}</ul></li>
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

    // HTML footer: logo + thông tin liên hệ + thanh toán | Về Urban Vibe | Chính sách khách hàng | Hệ thống chi nhánh | dòng pháp lý.
    static footerHTML() {
        const policy = POLICY_LINKS.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
        const branches = STORES.slice(0, 6).map(s => `<a href="pages/info/branch.html?id=${s.id}">${s.name}</a>`).join("");
        return `
<footer class="site-footer">
    <div class="footer-inner">
        <div class="footer-brand">
            ${Layout.logoHTML("footer-logo")}
            <div class="footer-info">
                <p>${SITE_CONTACT.address}</p>
                <p><strong>Email:</strong> <a href="mailto:${SITE_CONTACT.email}">${SITE_CONTACT.email}</a></p>
                <p><strong>${SITE_CONTACT.care.label}:</strong> <a href="tel:${SITE_CONTACT.care.tel}">${SITE_CONTACT.care.text}</a></p>
                <p><strong>${SITE_CONTACT.sales.label}:</strong> <a href="tel:${SITE_CONTACT.sales.tel}">${SITE_CONTACT.sales.text}</a></p>
            </div>
            <div class="footer-social">
                <a href="javascript:void(0)" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                <a href="javascript:void(0)" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="javascript:void(0)" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
                <a href="javascript:void(0)" aria-label="Shopee"><i class="fa-solid fa-bag-shopping"></i></a>
            </div>
            <div class="footer-pay">
                <p class="footer-pay-title">Phương thức thanh toán được chấp nhận</p>
                <div class="footer-pay-list">
                    <span class="pay-chip pay-atm"><i></i><i></i></span>
                    <span class="pay-chip pay-master"><i></i><i></i></span>
                    <span class="pay-chip pay-visa">VISA</span>
                </div>
            </div>
        </div>
        <div class="footer-cols">
        <div class="footer-col">
            <p class="footer-title">Về Urban Vibe</p>
            <div class="footer-links">
                <a href="pages/info/about.html">Giới thiệu</a>
                <a href="pages/info/recruitment.html">Tuyển dụng &amp; việc làm</a>
                <a href="pages/blog/blog.html">Blog</a>
                <a href="pages/info/faq.html">FAQ</a>
            </div>
        </div>
        <div class="footer-col">
            <p class="footer-title">Chính sách khách hàng</p>
            <div class="footer-links">${policy}</div>
        </div>
        <div class="footer-col">
            <p class="footer-title">Hệ thống chi nhánh</p>
            <div class="footer-links">${branches}</div>
        </div>
        </div>
    </div>
    <div class="footer-legal">
        <div class="legal-text">
            <p><strong>CÔNG TY TNHH THƯƠNG MẠI URBAN VIBE</strong></p>
            <p>Đồ án môn Lập trình cơ sở với JavaScript (Web1044) · <a href="javascript:void(0)" onclick="studentPopup.open()">Thông tin sinh viên</a></p>
        </div>
    </div>
</footer>

<!-- Nút nổi góc phải: ẩn/hiện, tiền tệ, liên hệ -->
<div class="float-widget" id="float-widget">
    <button type="button" class="float-hide" onclick="header.toggleFloat()"><span>Ẩn</span>${Icons.get("chevronRight")}</button>
    <div class="float-pill">
        <button type="button" class="float-btn float-search" onclick="searchDrawer.open()" aria-label="Tìm kiếm sản phẩm" title="Tìm kiếm">${Icons.get("search")}</button>
        <button type="button" class="float-btn" onclick="Utils.showToast('Giá hiển thị bằng VND')">VND</button>
        <div class="float-contact-wrap">
            <button type="button" class="float-btn float-fab" id="float-fab" onclick="header.toggleContact()" aria-label="Liên hệ">${Icons.get("chat")}</button>
            <div class="contact-panel" id="contact-panel">
                <div class="contact-head"><span>LIÊN HỆ</span><button type="button" onclick="header.toggleContact()" aria-label="Đóng">${Icons.get("close")}</button></div>
                <a href="https://zalo.me/${SITE_CONTACT.sales.tel}" target="_blank" rel="noopener"><span class="contact-ico zalo">Z</span>Zalo</a>
                <a href="javascript:void(0)" onclick="Utils.showToast('Mở Messenger của Urban Vibe')"><span class="contact-ico mess">${Icons.get("chat")}</span>Messenger</a>
                <a href="tel:${SITE_CONTACT.sales.tel}"><span class="contact-ico">${Icons.get("phone")}</span>Gọi điện</a>
                <a href="pages/info/branch.html"><span class="contact-ico">${Icons.get("pin")}</span>Chi nhánh</a>
            </div>
        </div>
    </div>
</div>
<button type="button" class="float-show" id="float-show" onclick="header.toggleFloat()" aria-label="Hiện nút liên hệ">${Icons.get("chevronLeft")}</button>

<div id="toast"></div>`;
    }

    // Thay 2 chỗ trống của trang bằng header và footer (nếu trang có đặt chỗ trống).
    static mount() {
        const top = document.getElementById("site-header");
        const bottom = document.getElementById("site-footer");
        if (top) top.outerHTML = Layout.headerHTML();
        if (bottom) bottom.outerHTML = Layout.footerHTML();
        // Tô đậm mục menu (trong ngăn kéo) của trang hiện tại theo <body data-nav="...">.
        const key = document.body.dataset.nav;
        const active = key && document.querySelector(`.mm-item[data-nav-key="${key}"]`);
        if (active) active.classList.add("active");
    }
}

Layout.mount();
