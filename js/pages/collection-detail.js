// Trang chi tiết bộ sưu tập (pages/collection/collection-detail.html?slug=...): ảnh bìa, tên, chia sẻ, giới thiệu và các sản phẩm.

class CollectionDetail {
    // Vẽ trang: đọc slug từ địa chỉ, tìm bộ sưu tập; không thấy thì dùng bộ đầu tiên.
    render() {
        const slug = new URLSearchParams(location.search).get("slug");
        const c = collections.find(x => x.slug === slug) || collections[0];
        document.title = `${c.title} - Urban Vibe`;
        this.collection = c;
        const items = c.items.map(([id]) => products.find(p => p.id === id)).filter(Boolean);

        Utils.$("collection-detail").innerHTML = `
            <div class="cd-wrap">
                <nav class="breadcrumb cd-crumb" aria-label="Đường dẫn">
                    <a href="index.html">Trang chủ</a><span class="breadcrumb-sep"></span>
                    <a href="pages/collection/collection.html">Collections</a><span class="breadcrumb-sep"></span>
                    <a href="pages/collection/collection-detail.html?slug=${c.slug}">${c.title}</a>
                </nav>
                <div class="cd-banner">
                    <picture><source srcset="${c.heroMobile}" media="(max-width: 767px)"><img src="${c.hero}" alt="${Utils.escapeHTML(c.title)}"></picture>
                </div>
                <div class="cd-body">
                    <h1 class="cd-title">${c.title}</h1>
                    <div class="cd-share">
                        <button type="button" class="btn btn-outline btn-md cd-copy" onclick="collectionDetail.copyLink()">${Icons.get("share")}<span>Copy link</span></button>
                        <div class="cd-like"><button type="button" class="blog-like" onclick="Blog.like(this)" aria-label="Thích">${Icons.get("heart")}</button><span class="blog-like-count">0</span></div>
                    </div>
                    <h2 class="cd-heading">Giới thiệu</h2>
                    <p class="cd-intro">Bộ sưu tập <strong>${c.title}</strong> thuộc dòng ${c.sub}, ra mắt vào ${c.date}. Những thiết kế mang tinh thần nữ tính, hiện đại và dễ phối, ${c.tag.replace(/#/g, " #").trim()}.</p>
                    <h2 class="cd-heading cd-heading-sm">Sản phẩm trong bộ sưu tập:</h2>
                    <div class="product-grid cd-grid" id="cd-products"></div>
                </div>
            </div>`;
        this.renderProducts(items);
        window.addEventListener("wishlistchange", () => this.renderProducts(items));
        window.addEventListener("authchange", () => this.renderProducts(items));
    }

    // Vẽ lưới sản phẩm của bộ sưu tập.
    renderProducts(items) {
        ProductCard.renderInto("cd-products", items, "Bộ sưu tập này chưa có sản phẩm.");
    }

    // Sao chép địa chỉ trang vào bộ nhớ tạm (không được thì hiện hộp thoại để tự sao chép).
    copyLink() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(location.href).then(() => Utils.showToast("Đã sao chép liên kết"), () => prompt("Sao chép liên kết:", location.href));
        } else {
            prompt("Sao chép liên kết:", location.href);
        }
    }
}

const collectionDetail = new CollectionDetail();
collectionDetail.render();
