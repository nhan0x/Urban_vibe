// Trang chi tiết sản phẩm (pages/shop/product.html?id=...): thư viện ảnh, giá, màu, size, số lượng,
// thêm giỏ / mua ngay / yêu thích, tab mô tả, tồn kho theo cửa hàng và sản phẩm liên quan.

// Từ khoá màu và chất liệu trong tên sản phẩm (dữ liệu không có trường riêng nên suy ra từ tên): [từ khoá viết hoa, tên hiển thị].
const PD_COLORS = [["ĐEN", "Đen"], ["TRẮNG", "Trắng"], ["HỒNG", "Hồng"], ["BE", "Be"], ["KEM", "Kem"], ["NÂU", "Nâu"], ["XANH", "Xanh"],
    ["ĐỎ", "Đỏ"], ["TÍM", "Tím"], ["VÀNG", "Vàng"], ["CAM", "Cam"], ["GHI", "Ghi"], ["OLIVE", "Olive"], ["BURGUNDY", "Burgundy"]];
const PD_MATERIALS = [["TƠ", "Tơ"], ["LỤA", "Lụa"], ["REN", "Ren"], ["LEN", "Len"], ["THÔ", "Thô"], ["DENIM", "Denim"], ["CHIFFON", "Chiffon"],
    ["VOAN", "Voan"], ["TAFTA", "Tafta"], ["TUYTSY", "Tuytsy"], ["JEANS", "Jeans"], ["XỐP", "Xốp"]];

class ProductDetail {
    // current: sản phẩm đang xem; size: size đang chọn; photoIndex: ảnh lớn đang hiện; thumbStart: ảnh nhỏ đầu tiên đang hiện (cuộn dọc).
    constructor(allProducts) {
        this.products = allProducts;
        this.current = null;
        this.size = "S";
        this.photoIndex = 0;
        this.thumbStart = 0;
        this.visibleThumbs = 4;
    }

    // Tìm từ khoá đầu tiên có trong tên sản phẩm; không có thì trả giá trị mặc định.
    pick(list, name, fallback) {
        const words = name.split(" ");
        const hit = list.find(([key]) => words.includes(key));
        return hit ? hit[1] : fallback;
    }

    // Số tồn kho giả lập nhưng cố định cho mỗi sản phẩm (từ 3 đến 22).
    stock(p) { return 3 + (p.id * 7) % 20; }

    // Cửa hàng còn / hết hàng: giả lập cố định theo id sản phẩm và id cửa hàng.
    inStock(p, store) { return (p.id + store.id) % 5 !== 0; }

    // Danh sách ảnh của sản phẩm: bộ ảnh chi tiết nếu có, ngược lại dùng ảnh chính và ảnh thứ 2.
    photos(p) {
        if (p.gallery && p.gallery.length) return p.gallery;
        const list = [p.image];
        if (p.image2 && p.image2 !== p.image) list.push(p.image2);
        return list;
    }

    // Các sản phẩm liên quan: cùng nhóm với sản phẩm hiện tại (bỏ chính nó), lấy tối đa 4; thiếu thì bổ sung từ sản phẩm khác.
    related(p) {
        const cat = CATALOG_CATEGORIES.find(c => c.test(p.name));
        let list = this.products.filter(x => x.id !== p.id && cat && cat.test(x.name));
        if (list.length < 4) list = list.concat(this.products.filter(x => x.id !== p.id && !list.includes(x)));
        return list.slice(0, 4);
    }

    // Đoạn mô tả sản phẩm (3 đoạn) soạn từ tên, màu và chất liệu.
    description(p, color, material) {
        const name = Utils.prettyName(p.name);
        return [
            `${name} - sản phẩm mới của Urban Vibe.`,
            `Thiết kế hướng đến những cô nàng yêu thích vẻ đẹp tinh tế, nữ tính nhưng vẫn năng động. Phom dáng được cắt may chỉn chu, tôn dáng và dễ dàng phối cùng nhiều kiểu trang phục khác nhau cho cả đi học, đi làm lẫn dạo phố.`,
            `Sản phẩm sử dụng chất liệu ${material.toLowerCase()} cao cấp, mềm mại, thoáng mát và bền màu sau nhiều lần giặt. Tông màu ${color.toLowerCase()} dễ kết hợp cùng chân váy, quần jean hoặc quần tây để tạo nên diện mạo hài hòa.`
        ];
    }

    // Vẽ trang: đọc id từ địa chỉ, tìm sản phẩm; không thấy thì báo. Thấy thì dựng toàn bộ nội dung.
    render() {
        const root = Utils.$("pd-page");
        const id = parseInt(new URLSearchParams(location.search).get("id"), 10);
        const p = this.products.find(x => x.id === id);
        if (!p) {
            root.innerHTML = '<div class="pd-notfound"><p>Không tìm thấy sản phẩm.</p><a class="btn btn-gray" href="pages/shop/products.html">Xem tất cả sản phẩm</a></div>';
            return;
        }
        this.current = p;
        const name = Utils.prettyName(p.name);
        document.title = `${name} - Urban Vibe`;
        const color = this.pick(PD_COLORS, p.name, "Đa sắc");
        const material = this.pick(PD_MATERIALS, p.name, "Cotton");
        const oldPrice = Utils.getOriginalPrice(p);
        const oldPriceHTML = oldPrice ? `<s class="pd-old-price">${Utils.formatPrice(oldPrice)}</s>` : "";
        const sizes = ["S", "M", "L", "XL"].map(s => `<button type="button" class="size-pill ${s === this.size ? "active" : ""}" onclick="productDetail.selectSize('${s}')">${s}</button>`).join("");
        const photos = this.photos(p);
        const stores = STORES.slice(0, 6).map(s => {
            const ok = this.inStock(p, s);
            return `<div class="pd-store"><h4>${s.name}</h4><span class="stock-pill ${ok ? "" : "out"}">${ok ? "Còn hàng" : "Hết hàng"}</span></div>`;
        }).join("");
        const desc = this.description(p, color, material).map(t => `<p>${t}</p>`).join("");
        const liked = wishlist.has(p.id);

        root.innerHTML = `
            <section class="pd-hero">
                <div class="page-container pd-inner">
                    <nav class="breadcrumb" aria-label="Đường dẫn">
                        <a href="index.html">Trang chủ</a><span class="breadcrumb-sep"></span>
                        <a href="pages/shop/products.html">Sản phẩm</a><span class="breadcrumb-sep"></span>
                        <a href="pages/shop/product.html?id=${p.id}">${name}</a>
                    </nav>
                    <div class="pd-top">
                        <div class="pd-gallery">
                            <div class="pd-main-img" onclick="productDetail.openLightbox()">
                                <img id="pd-main-photo" src="${photos[0]}" alt="${Utils.escapeHTML(name)}">
                                <button type="button" class="pd-zoom" aria-label="Phóng to">${Icons.get("search")}</button>
                            </div>
                            <div class="pd-thumbs" id="pd-thumbs"></div>
                        </div>
                        <div class="pd-info">
                            <h1 class="pd-name">${name}</h1>
                            <dl class="pd-facts"><div><dt>Chất liệu</dt><dd>${material}</dd></div></dl>
                            <div class="pd-price">${Utils.formatPrice(p.price)}${oldPriceHTML}</div>
                            <div class="pd-block">
                                <p class="pd-label"><strong>MÀU:</strong> ${color}</p>
                                <button type="button" class="pd-color" style="background-image:url('${p.image}')" aria-label="${color}"></button>
                            </div>
                            <div class="pd-block">
                                <p class="pd-label"><strong>Size</strong></p>
                                <div class="size-pills">${sizes}</div>
                                <a class="pd-size-link" href="javascript:void(0)" onclick="productDetail.openSizeGuide()">Hướng dẫn chọn size ${Icons.get("chevronRight")}</a>
                            </div>
                            <p class="pd-stock">Tồn kho: ${this.stock(p)}</p>
                            <div class="pd-qty-row">
                                <span>Số lượng</span>
                                <div class="pd-qty">
                                    <button type="button" onclick="productDetail.changeQty(-1)" aria-label="Giảm">${Icons.get("minus")}</button>
                                    <input type="number" id="pd-qty-input" value="1" min="1" onchange="productDetail.changeQty(0)">
                                    <button type="button" onclick="productDetail.changeQty(1)" aria-label="Tăng">${Icons.get("plus")}</button>
                                </div>
                            </div>
                            <div class="pd-actions">
                                <button type="button" class="btn btn-outline btn-action" onclick="productDetail.addToCart()">Thêm vào giỏ</button>
                                <button type="button" class="btn btn-gray btn-action btn-buy" onclick="productDetail.buyNow()">Mua ngay</button>
                            </div>
                            <a class="pd-where" href="${location.pathname}#branch_stock">${Icons.get("pin")}<span>Địa chỉ còn hàng</span></a>
                        </div>
                    </div>
                    <div class="pd-wish-row">
                        <button type="button" class="pd-wish-btn ${liked ? "active" : ""}" id="pd-wish-btn" onclick="productDetail.toggleWish(event)" aria-label="Yêu thích">${liked ? Icons.heartFilled() : Icons.get("heart")}</button>
                        <span>Thêm vào danh sách yêu thích</span>
                    </div>
                </div>
            </section>

            <section class="pd-more">
                <div class="page-container pd-more-inner">
                    <div class="pd-tabs">
                        <button type="button" class="pd-tab active" data-tab="detail" onclick="productDetail.setTab('detail')">Chi tiết sản phẩm</button>
                        <button type="button" class="pd-tab" data-tab="extra" onclick="productDetail.setTab('extra')">Thông tin bổ sung</button>
                    </div>
                    <div class="pd-tab-panel active" data-panel="detail">${desc}</div>
                    <div class="pd-tab-panel" data-panel="extra">
                        <table class="pd-table">
                            <tr><th>Mã sản phẩm</th><td>${p.sku || "-"}</td></tr>
                            <tr><th>Chất liệu</th><td>${material}</td></tr>
                            <tr><th>Màu sắc</th><td>${color}</td></tr>
                            <tr><th>Kích cỡ</th><td>S, M, L, XL</td></tr>
                            <tr><th>Bảo quản</th><td>Giặt tay hoặc giặt máy chế độ nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.</td></tr>
                        </table>
                    </div>

                    <div id="branch_stock">
                        <h3 class="pd-heading">Cửa hàng Urban Vibe</h3>
                        <div class="pd-stores">${stores}</div>
                    </div>

                    <div class="pd-rule"></div>
                    <h3 class="pd-related-title">Có thể bạn cũng thích</h3>
                    <div class="pd-related" id="pd-related"></div>
                    <div class="pd-related-more"><a class="btn btn-outline btn-md btn-more" href="pages/shop/products.html"><span>Xem thêm</span>${Icons.get("arrowRight")}</a></div>
                </div>
            </section>`;
        this.renderThumbs();
        this.renderRelated();
    }

    // Vẽ cột ảnh nhỏ bên phải ảnh lớn: tối đa 4 ảnh một lúc, có nút mũi tên xuống / lên khi còn nhiều hơn.
    renderThumbs() {
        const photos = this.photos(this.current);
        const box = Utils.$("pd-thumbs");
        const slice = photos.slice(this.thumbStart, this.thumbStart + this.visibleThumbs);
        let html = slice.map((src, i) => {
            const index = this.thumbStart + i;
            return `<button type="button" class="pd-thumb ${index === this.photoIndex ? "active" : ""}" onclick="productDetail.showPhoto(${index})"><img src="${src}" alt="" loading="lazy" decoding="async"></button>`;
        }).join("");
        if (photos.length > this.visibleThumbs) {
            const more = this.thumbStart + this.visibleThumbs < photos.length;
            html += `<button type="button" class="pd-thumb-nav" onclick="productDetail.scrollThumbs(${more ? 1 : -1})" aria-label="Cuộn ảnh">${Icons.get(more ? "chevronDown" : "chevronUp")}</button>`;
        }
        box.innerHTML = html;
    }

    // Hiện ảnh thứ index ở khung lớn.
    showPhoto(index) {
        this.photoIndex = index;
        Utils.$("pd-main-photo").src = this.photos(this.current)[index];
        this.renderThumbs();
    }

    // Cuộn danh sách ảnh nhỏ lên / xuống một ảnh (dir = 1 xuống, -1 lên).
    scrollThumbs(dir) {
        const max = Math.max(0, this.photos(this.current).length - this.visibleThumbs);
        this.thumbStart = Math.min(max, Math.max(0, this.thumbStart + dir * this.visibleThumbs));
        this.renderThumbs();
    }

    // Vẽ lưới sản phẩm liên quan.
    renderRelated() {
        ProductCard.renderInto("pd-related", this.related(this.current));
    }

    // Chọn size: chỉ nút vừa bấm được tô viền.
    selectSize(size) {
        this.size = size;
        document.querySelectorAll(".size-pill").forEach(b => b.classList.toggle("active", b.textContent.trim() === size));
    }

    // Tăng / giảm số lượng theo delta (-1, +1; 0 để chuẩn hoá giá trị gõ tay). Tối thiểu là 1.
    changeQty(delta) {
        const input = Utils.$("pd-qty-input");
        input.value = Math.max(1, (parseInt(input.value, 10) || 1) + delta);
    }

    // Số lượng đang nhập (luôn >= 1).
    qty() { return Math.max(1, parseInt(Utils.$("pd-qty-input").value, 10) || 1); }

    // "Thêm vào giỏ": thêm sản phẩm với size và số lượng đang chọn. Trả true nếu thêm được.
    addToCart() { return cart.add(this.current.id, this.qty(), this.size); }

    // "Mua ngay": thêm vào giỏ rồi sang trang giỏ hàng để thanh toán.
    buyNow() { if (this.addToCart()) location.href = "pages/shop/cart.html"; }

    // Bật / tắt yêu thích bằng trái tim dưới ảnh, rồi vẽ lại trái tim cho đúng trạng thái.
    toggleWish(event) {
        wishlist.toggle(this.current.id, event);
        const liked = wishlist.has(this.current.id);
        const btn = Utils.$("pd-wish-btn");
        btn.classList.toggle("active", liked);
        btn.innerHTML = liked ? Icons.heartFilled() : Icons.get("heart");
    }

    // Chuyển tab "Chi tiết sản phẩm" / "Thông tin bổ sung".
    setTab(tab) {
        document.querySelectorAll(".pd-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
        document.querySelectorAll(".pd-tab-panel").forEach(p => p.classList.toggle("active", p.dataset.panel === tab));
    }

    // Phóng to ảnh: mở lớp phủ toàn màn hình hiện ảnh lớn; bấm vào bất kỳ đâu hoặc Esc để đóng.
    openLightbox() {
        const box = document.createElement("div");
        box.className = "lightbox";
        box.innerHTML = `<img src="${this.photos(this.current)[this.photoIndex]}" alt=""><button type="button" class="lightbox-close" aria-label="Đóng">${Icons.get("close")}</button>`;
        const close = () => { box.remove(); document.removeEventListener("keydown", onKey); };
        const onKey = e => { if (e.key === "Escape") close(); };
        box.addEventListener("click", close);
        document.addEventListener("keydown", onKey);
        document.body.appendChild(box);
    }

    // Bảng hướng dẫn chọn size trong một hộp thoại giữa màn hình.
    openSizeGuide() {
        const box = document.createElement("div");
        box.className = "modal-overlay open";
        box.innerHTML = `
            <div class="modal-box" role="dialog" aria-label="Hướng dẫn chọn size">
                <button type="button" class="modal-close" aria-label="Đóng">${Icons.get("close")}</button>
                <h3>Hướng dẫn chọn size</h3>
                <table class="pd-table pd-size-table">
                    <tr><th>Size</th><th>Eo (cm)</th><th>Mông (cm)</th><th>Cân nặng (kg)</th></tr>
                    <tr><td>S</td><td>64 - 68</td><td>88 - 92</td><td>40 - 47</td></tr>
                    <tr><td>M</td><td>68 - 72</td><td>92 - 96</td><td>47 - 53</td></tr>
                    <tr><td>L</td><td>72 - 76</td><td>96 - 100</td><td>53 - 58</td></tr>
                    <tr><td>XL</td><td>76 - 80</td><td>100 - 104</td><td>58 - 64</td></tr>
                </table>
            </div>`;
        const close = () => box.remove();
        box.addEventListener("click", e => { if (e.target === box || e.target.closest(".modal-close")) close(); });
        document.body.appendChild(box);
    }
}

const productDetail = new ProductDetail(products);
productDetail.render();
window.addEventListener("wishlistchange", () => productDetail.renderRelated());
window.addEventListener("authchange", () => { if (productDetail.current) productDetail.render(); });
