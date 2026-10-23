// Trang chi tiết bộ sưu tập (pages/collection/collection-detail.html?c=for-her): ảnh bìa tràn màn hình (phủ cả header) rồi tới lưới sản phẩm.

class CollectionDetail {
    // Nhận danh sách bộ sưu tập (collections.js) và danh sách sản phẩm (products.js) để tra thông tin theo id.
    constructor(allCollections, allProducts) {
        this.collections = allCollections;
        this.products = allProducts;
    }

    // Vẽ trang: đọc tên bộ sưu tập từ địa chỉ (?c=for-her), không thấy thì báo không tìm thấy.
    // Thấy thì đổi tiêu đề tab, dựng ảnh bìa + dòng hashtag / thời gian + các thẻ sản phẩm, rồi theo dõi cuộn trang để đổi nền header.
    render() {
        const root = Utils.$("collection-detail");
        if (!root) return;
        const slug = new URLSearchParams(location.search).get("c");
        const c = this.collections.find(x => x.slug === slug);
        if (!c) {
            root.innerHTML = '<div class="pd-notfound" style="padding-top:160px">Không tìm thấy bộ sưu tập. <a href="pages/collection/collection.html">Quay lại trang Bộ sưu tập</a></div>';
            document.body.classList.remove("lookbook-detail");
            return;
        }
        document.title = `${c.title} | Urban Vibe`;
        const cards = c.items.map(([id, wide]) => this.cardHTML(this.products.find(p => p.id === id), wide)).join("");

        root.innerHTML = `
            <div class="lookbook-image-detail">
                <picture>
                    <source media="(max-width: 767px)" srcset="${c.heroMobile}">
                    <img src="${c.hero}" alt="${Utils.escapeHTML(c.title)}">
                </picture>
            </div>
            <div class="lookbook-page-main">
                <div class="lookbook-content-detail">
                    <div class="row">
                        <div class="column-full">
                            <p class="lookbook-tag">${Utils.escapeHTML(c.tag)}</p>
                            <p class="lookbook-date"><em>${Utils.escapeHTML(c.date)}</em></p>
                        </div>
                        ${cards}
                    </div>
                </div>
            </div>`;
        this.bindHeader();
    }

    // Tạo HTML cho MỘT thẻ sản phẩm: ảnh (nền xám nhạt, tỉ lệ 2:3), nhãn SALE, nút thêm giỏ hiện khi rê chuột, tên, giá và giá gốc.
    // wide = true: thẻ rộng hết hàng, chữ căn giữa.
    cardHTML(p, wide) {
        if (!p) return "";
        let wideClass = "";
        if (wide) wideClass = " wide";
        let label = "";
        if (p.label) label = `<span class="product-label"><span>${Utils.escapeHTML(p.label)}</span></span>`;
        let oldPrice = "";
        if (p.oldPrice) oldPrice = `<span class="old-price">${Utils.formatPrice(p.oldPrice)}</span>`;
        const link = "pages/shop/product.html?id=" + p.id;

        return `
            <div class="column${wideClass}">
                <div class="item-content-wrapper">
                    <div class="product-top">
                        <a href="${link}" class="product-item-photo"><img src="${p.image}" alt="${Utils.escapeHTML(p.name)}" loading="lazy"></a>
                        ${label}
                        <div class="actions-link">
                            <button type="button" class="button-action-icon" onclick="cart.add(${p.id})" title="Thêm vào giỏ" aria-label="Thêm vào giỏ">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7.5h14l-1 13.5H6z"/><path d="M8.5 9.5V6.5a3.5 3.5 0 0 1 7 0v3"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="product-item-details">
                        <h5 class="product-item-name"><a href="${link}">${Utils.escapeHTML(p.name)}</a></h5>
                        <div class="price-box"><span class="price">${Utils.formatPrice(p.price)}</span>${oldPrice}</div>
                    </div>
                </div>
            </div>`;
    }

    // Header nằm trong suốt (chữ trắng) trên ảnh bìa; cuộn xuống quá 40px thì có nền trắng, chữ đen (class "header-solid").
    bindHeader() {
        const el = Utils.$("main-header");
        const update = () => el.classList.toggle("header-solid", window.scrollY > 40);
        window.addEventListener("scroll", update, { passive: true });
        update();
    }
}

const collectionDetail = new CollectionDetail(collections, products);
collectionDetail.render();
