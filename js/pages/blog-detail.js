// Trang chi tiết bài viết (pages/blog/blog-detail.html?slug=...): ảnh bìa, nội dung và các bài khác.

class BlogDetailPage {
    // Vẽ trang: đọc slug từ địa chỉ; không thấy bài thì dùng bài đầu tiên.
    render() {
        const slug = new URLSearchParams(location.search).get("slug");
        const post = Blog.bySlug(slug) || BLOG_POSTS[0];
        document.title = post.title + " - Urban Vibe";
        const others = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);
        Utils.$("blog-detail").innerHTML = `
            <article class="article-wrap">
                <nav class="breadcrumb article-crumb" aria-label="Đường dẫn">
                    <a href="index.html">Trang chủ</a><span class="breadcrumb-sep"></span>
                    <a href="pages/blog/blog.html">Blog</a><span class="breadcrumb-sep"></span>
                    <a href="${Blog.url(post)}">${post.title}</a>
                </nav>
                <h1 class="article-title">${post.title}</h1>
                <div class="article-meta">
                    ${Icons.get("clock")}<span>${post.date}</span><i class="blog-divider"></i>
                    <button type="button" class="blog-like" onclick="Blog.like(this)" aria-label="Thích">${Icons.get("heart")}</button><span class="blog-like-count">${post.likes}</span>
                    <span class="article-tag">#${post.category}</span>
                </div>
                <div class="article-cover"><img src="${post.image}" alt="${Utils.escapeHTML(post.title)}"></div>
                <div class="article-body">${post.body.map(t => `<p>${t}</p>`).join("")}</div>
            </article>
            <section class="home-sections">
                <div class="home-section is-narrow">
                    <div class="home-section-inner">
                        <h3 class="home-section-title">Bài viết khác</h3>
                        <div class="blog-grid">${others.map(Blog.cardHTML).join("")}</div>
                    </div>
                </div>
            </section>`;
    }
}

new BlogDetailPage().render();
