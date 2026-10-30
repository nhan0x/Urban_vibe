// Trang chủ (bố cục owen.vn): slider chính, slider cam kết, khối Blog nền tối, form đăng ký nhận khuyến mãi.
// Các ô danh mục và banner lớn là HTML tĩnh trong index.html.

class HomePage {
    // Ngày "dd/mm/yyyy" → "dd tháng mm, yyyy" (như owen.vn).
    static longDate(ddmmyyyy) {
        const [d, m, y] = ddmmyyyy.split("/");
        return `${Number(d)} tháng ${Number(m)}, ${y}`;
    }

    // Thẻ blog: ảnh trên, tiêu đề in hoa một dòng, ngày, "Xem chi tiết →".
    static blogCardHTML(post) {
        const url = Blog.url(post);
        return `
            <a class="hb-card" href="${url}">
                <span class="hb-card-img"><img src="${post.image}" alt="${Utils.escapeHTML(post.title)}" loading="lazy" decoding="async"></span>
                <span class="hb-card-body">
                    <span class="hb-card-title">${Utils.escapeHTML(post.title)}</span>
                    <span class="hb-card-date">${HomePage.longDate(post.date)}</span>
                    <span class="hb-card-more">Xem chi tiết →</span>
                </span>
            </a>`;
    }

    // Vẽ 3 bài blog mới nhất.
    renderBlog() {
        Utils.$("home-blog-grid").innerHTML = BLOG_POSTS.slice(0, 3).map(HomePage.blogCardHTML).join("");
    }

    // Gắn icon cho nút mũi tên slider và các vòng tròn cam kết (icon lấy từ icons.js).
    fillIcons() {
        document.querySelectorAll(".slider-arrow.prev").forEach(b => { b.innerHTML = Icons.get("arrowLeft"); });
        document.querySelectorAll(".slider-arrow.next").forEach(b => { b.innerHTML = Icons.get("arrowRight"); });
        document.querySelectorAll(".promise-ico").forEach(s => { s.innerHTML = Icons.get(s.dataset.icon); });
    }


    // Form đăng ký nhận khuyến mãi: kiểm tra email rồi báo thành công (không có máy chủ nên chỉ hiện thông báo).
    subscribe(e) {
        e.preventDefault();
        const input = Utils.$("subscribe-email");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
            Utils.showToast("Vui lòng nhập email hợp lệ");
            input.focus();
            return;
        }
        input.value = "";
        Utils.showToast("Đăng ký nhận khuyến mãi thành công!");
    }

    init() {
        this.fillIcons();
        this.renderBlog();
        Slider.mountAll();
    }
}

const homePage = new HomePage();
homePage.init();
