// Trang danh sách Blog (pages/blog/blog.html): tìm kiếm bài viết, lọc theo chuyên mục, thẻ bài viết 2 cột.

class BlogPage {
    // category: chuyên mục đang chọn ("" = tất cả); keyword: từ khoá tìm kiếm.
    constructor() {
        const q = new URLSearchParams(location.search);
        this.category = BLOG_CATEGORIES.includes(q.get("c")) ? q.get("c") : "";
        this.keyword = q.get("q") || "";
    }

    // Danh sách bài sau khi lọc theo chuyên mục và từ khoá (tiêu đề hoặc tóm tắt, không phân biệt dấu).
    list() {
        const kw = Utils.normalize(this.keyword.trim());
        return BLOG_POSTS.filter(p => (!this.category || p.category === this.category)
            && (!kw || Utils.normalize(p.title + " " + p.excerpt).includes(kw)));
    }

    // HTML một thẻ bài viết: ảnh 16:9, tiêu đề, ngày, hashtag chuyên mục và nút tim.
    cardHTML(p) {
        const url = Blog.url(p);
        return `
            <article class="blog-item">
                <a class="blog-item-thumb" href="${url}"><img src="${p.image}" alt="${Utils.escapeHTML(p.title)}" loading="lazy"></a>
                <h3 class="blog-item-title"><a href="${url}">${p.title}</a></h3>
                <p class="blog-item-date">${p.date}</p>
                <div class="blog-item-meta">
                    <span class="blog-item-tag">#${p.category}</span>
                    <button type="button" class="blog-like" onclick="Blog.like(this)" aria-label="Thích">${Icons.get("heart")}</button>
                </div>
            </article>`;
    }

    // Vẽ dải chuyên mục: bấm một chuyên mục để lọc, bấm lại để bỏ lọc.
    renderCategories() {
        Utils.$("blog-cats").innerHTML = BLOG_CATEGORIES.map(c =>
            `<button type="button" class="${c === this.category ? "active" : ""}" onclick="blogPage.setCategory('${c}')">${c}</button>`).join("");
    }

    // Vẽ danh sách bài viết (hoặc câu thông báo khi không có bài nào).
    render() {
        const list = this.list();
        Utils.$("blog-list").innerHTML = list.length ? list.map(p => this.cardHTML(p)).join("") : '<p class="empty-hint">Không tìm thấy bài viết phù hợp.</p>';
        this.renderCategories();
    }

    // Chọn / bỏ chuyên mục.
    setCategory(c) {
        this.category = this.category === c ? "" : c;
        this.render();
    }

    // Gửi form tìm kiếm.
    search(e) {
        e.preventDefault();
        this.keyword = Utils.$("blog-keyword").value;
        this.render();
    }
}

const blogPage = new BlogPage();
Utils.$("blog-search-icon").innerHTML = Icons.get("search");
Utils.$("blog-keyword").value = blogPage.keyword;
blogPage.render();
