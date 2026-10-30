// Trang chi tiết sản phẩm (pages/shop/product.html?id=...) theo bố cục owen.vn: ảnh lớn + cột ảnh nhỏ dọc, tên, mã, giá, tích điểm,
// màu, size, ưu đãi, số lượng, thêm giỏ / mua ngay / yêu thích, accordion (mô tả, giao hàng, cửa hàng còn hàng), carousel sản phẩm liên quan.

// Từ khoá màu và chất liệu trong tên sản phẩm (dữ liệu không có trường riêng nên suy ra từ tên): [từ khoá viết hoa, tên hiển thị].
const PD_COLORS = [["ĐEN", "Đen"], ["TRẮNG", "Trắng"], ["HỒNG", "Hồng"], ["BE", "Be"], ["KEM", "Kem"], ["NÂU", "Nâu"], ["XANH", "Xanh"],
    ["ĐỎ", "Đỏ"], ["TÍM", "Tím"], ["VÀNG", "Vàng"], ["CAM", "Cam"], ["GHI", "Ghi"], ["OLIVE", "Olive"], ["BURGUNDY", "Burgundy"]];
const PD_MATERIALS = [["TƠ", "Tơ"], ["LỤA", "Lụa"], ["REN", "Ren"], ["LEN", "Len"], ["THÔ", "Thô"], ["DENIM", "Denim"], ["CHIFFON", "Chiffon"],
    ["VOAN", "Voan"], ["TAFTA", "Tafta"], ["TUYTSY", "Tuytsy"], ["JEANS", "Jeans"], ["XỐP", "Xốp"]];

class ProductDetail {
    // current: sản phẩm đang xem; size: size đang chọn; photoIndex: ảnh lớn đang hiện.
    constructor(allProducts) {
        this.products = allProducts;
        this.current = null;
        this.size = "S";
        this.photoIndex = 0;
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

    // Ảnh bộ sưu tập (…-g0.webp) có sẵn bản nhỏ: "thumb" (180px) cho cột ảnh nhỏ, "md" (1000px) cho ảnh lớn; phóng to thì dùng bản gốc.
    sized(src, kind) { return /-g\d+\.webp$/.test(src) ? src.replace(/\.webp$/, "-" + kind + ".webp") : src; }

    // Danh sách ảnh của sản phẩm: bộ ảnh chi tiết nếu có, ngược lại dùng ảnh chính và ảnh thứ 2.
    photos(p) {
        if (p.gallery && p.gallery.length) return p.gallery;
        const list = [p.image];
        if (p.image2 && p.image2 !== p.image) list.push(p.image2);
        return list;
    }

    // Các sản phẩm liên quan: cùng nhóm với sản phẩm hiện tại (bỏ chính nó), lấy tối đa 8; thiếu thì bổ sung từ sản phẩm khác.
    related(p) {
        const cat = CATALOG_CATEGORIES.find(c => c.test(p.name));
        let list = this.products.filter(x => x.id !== p.id && cat && cat.test(x.name));
        if (list.length < 8) list = list.concat(this.products.filter(x => x.id !== p.id && !list.includes(x)));
        return list.slice(0, 8);
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

    // Vẽ trang: đọc id từ địa chỉ, tìm sản phẩm; không thấy thì báo. Thấy thì dựng toàn bộ nội dung (bố cục owen.vn).
    render() {
        const root = Utils.$("pd-page");
        const id = parseInt(new URLSearchParams(location.search).get("id"), 10);
        const p = this.products.find(x => x.id === id);
        if (!p) {
            root.innerHTML = '<div class="pd-notfound"><p>Không tìm thấy sản phẩm.</p><a class="btn btn-dark" href="pages/shop/products.html">Xem tất cả sản phẩm</a></div>';
            return;
        }
        this.current = p;
        this.photoIndex = 0;
        document.title = `${Utils.prettyName(p.name)} - Urban Vibe`;
        const name = Utils.escapeHTML(p.name);
        const color = this.pick(PD_COLORS, p.name, "Đa sắc");
        const material = this.pick(PD_MATERIALS, p.name, "Cotton");
        const oldPrice = Utils.getOriginalPrice(p);
        const oldPriceHTML = oldPrice > p.price ? `<s class="pd-old-price">${Utils.formatPrice(oldPrice)}</s>` : "";
        const sizes = ["S", "M", "L", "XL"].map(s => `<button type="button" class="size-pill ${s === this.size ? "active" : ""}" onclick="productDetail.selectSize('${s}')">${s}</button>`).join("");
        const photos = this.photos(p);
        const thumbs = photos.map((src, i) =>
            `<button type="button" class="pd-thumb ${i === 0 ? "active" : ""}" onclick="productDetail.showPhoto(${i})"><img src="${this.sized(src, "thumb")}" alt="" loading="lazy" decoding="async"></button>`).join("");
        const stores = STORES.slice(0, 6).map(s => {
            const ok = this.inStock(p, s);
            return `<li class="pd-store"><span>${s.name}</span><span class="stock-pill ${ok ? "" : "out"}">${ok ? "Còn hàng" : "Hết hàng"}</span></li>`;
        }).join("");
        const desc = this.description(p, color, material).map(t => `<p>${t}</p>`).join("");
        const liked = wishlist.has(p.id);

        root.innerHTML = `
            <div class="pd-wrap">
                <nav class="breadcrumb" aria-label="Đường dẫn">
                    <a href="index.html">Trang chủ</a><span class="breadcrumb-sep"></span>
                    <span class="breadcrumb-current">${name}</span>
                </nav>
                <div class="pd-top">
                    <div class="pd-gallery">
                        <div class="pd-main-img" onclick="productDetail.openLightbox()">
                            <img id="pd-main-photo" src="${this.sized(photos[0], "md")}" alt="${name}" fetchpriority="high" decoding="async">
                        </div>
                        <div class="pd-thumbs" id="pd-thumbs">${thumbs}</div>
                    </div>
                    <div class="pd-info">
                        <div class="pd-title-row">
                            <h1 class="pd-name">${name}</h1>
                            <button type="button" class="pd-wish-btn ${liked ? "active" : ""}" id="pd-wish-btn" onclick="productDetail.toggleWish(event)" aria-label="Yêu thích">${liked ? Icons.heartFilled() : Icons.get("heart")}</button>
                        </div>
                        <p class="pd-sku">MÃ SP: <span>${p.sku || "UV" + String(p.id).padStart(5, "0")}</span></p>
                        <div class="pd-price"><span>${Utils.formatPrice(p.price)}</span>${oldPriceHTML}</div>
                        <span class="pd-points">${Icons.get("gift")}Tích lũy ${ProductCard.points(p)} điểm</span>

                        <div class="pd-block">
                            <p class="pd-label">Màu sắc: <strong>${color}</strong></p>
                            <button type="button" class="pd-color active" style="background-image:url('${p.image}')" aria-label="${color}"></button>
                        </div>
                        <div class="pd-block">
                            <div class="pd-label-row">
                                <p class="pd-label">Kích cỡ:</p>
                                <a class="pd-size-link" href="javascript:void(0)" onclick="productDetail.openSizeGuide()">Hướng dẫn chọn size</a>
                            </div>
                            <div class="size-pills">${sizes}</div>
                        </div>

                        <div class="pd-coupon">
                            <div class="pd-coupon-left"><small>GIẢM</small><strong>10%</strong><small>Đơn đầu tiên khi đăng ký</small></div>
                            <div class="pd-coupon-right"><small>MIỄN SHIP ĐƠN TỪ</small><strong>500K</strong><span>MUA NGAY</span></div>
                        </div>

                        <div class="pd-buy-row">
                            <div class="pd-qty">
                                <button type="button" onclick="productDetail.changeQty(-1)" aria-label="Giảm">${Icons.get("minus")}</button>
                                <input type="number" id="pd-qty-input" value="1" min="1" onchange="productDetail.changeQty(0)" aria-label="Số lượng">
                                <button type="button" onclick="productDetail.changeQty(1)" aria-label="Tăng">${Icons.get("plus")}</button>
                            </div>
                            <button type="button" class="pd-add" onclick="productDetail.addToCart()">Thêm vào giỏ hàng</button>
                        </div>
                        <button type="button" class="pd-buy-now" onclick="productDetail.buyNow()">Mua ngay</button>
                        <p class="pd-stock">Còn ${this.stock(p)} sản phẩm</p>

                        <div class="pd-acc open">
                            <button type="button" class="pd-acc-title" onclick="productDetail.toggleAcc(this)">MÔ TẢ</button>
                            <div class="pd-acc-body">
                                ${desc}
                                <ul class="pd-specs">
                                    <li>- Chất liệu: ${material}</li>
                                    <li>- Màu sắc: ${color}</li>
                                    <li>- Kích cỡ: S, M, L, XL</li>
                                    <li>- Giặt tay hoặc giặt máy chế độ nhẹ, không dùng chất tẩy mạnh</li>
                                    <li>- Ủi ở nhiệt độ thấp, phơi nơi thoáng mát, tránh nắng gắt</li>
                                </ul>
                            </div>
                        </div>
                        <div class="pd-acc open">
                            <button type="button" class="pd-acc-title" onclick="productDetail.toggleAcc(this)">GIAO HÀNG / ĐỔI HÀNG</button>
                            <div class="pd-acc-body">
                                <ul class="pd-specs">
                                    <li>- Hình thức giao hàng: giao hàng nhanh toàn quốc, miễn phí cho đơn từ 500.000₫.</li>
                                    <li>- Đổi hàng trong vòng 30 ngày với sản phẩm còn nguyên tem mác, chưa qua sử dụng.</li>
                                    <li>- Không áp dụng đổi với sản phẩm giảm giá trên 50%.</li>
                                </ul>
                            </div>
                        </div>
                        <div class="pd-acc" id="branch_stock">
                            <button type="button" class="pd-acc-title" onclick="productDetail.toggleAcc(this)">CỬA HÀNG CÒN HÀNG</button>
                            <div class="pd-acc-body"><ul class="pd-stores">${stores}</ul></div>
                        </div>
                    </div>
                </div>

                <section class="pd-related-section">
                    <h2 class="pd-related-title">CÓ THỂ BẠN THÍCH</h2>
                    <div class="slider pd-related-slider" id="pd-related-slider" data-per-view="4" data-per-view-md="3" data-per-view-sm="2">
                        <div class="slider-track pd-related" id="pd-related"></div>
                        <button type="button" class="slider-arrow prev" aria-label="Trước">${Icons.get("arrowLeft")}</button>
                        <button type="button" class="slider-arrow next" aria-label="Sau">${Icons.get("arrowRight")}</button>
                    </div>
                </section>
            </div>`;
        this.renderRelated();
    }

    // Hiện ảnh thứ index ở khung lớn và tô viền ảnh nhỏ tương ứng.
    showPhoto(index) {
        this.photoIndex = index;
        Utils.$("pd-main-photo").src = this.sized(this.photos(this.current)[index], "md");
        document.querySelectorAll(".pd-thumb").forEach((b, i) => b.classList.toggle("active", i === index));
    }

    // Carousel sản phẩm liên quan (mỗi thẻ là một slide).
    renderRelated() {
        const box = Utils.$("pd-related");
        if (!box) return;
        box.innerHTML = this.related(this.current).map(p => `<div class="slide">${ProductCard.html(p)}</div>`).join("");
        // Vẽ lại (đổi yêu thích) thì dùng lại slider cũ, chỉ cập nhật danh sách slide, tránh gắn sự kiện hai lần.
        if (this.relatedSlider && this.relatedSlider.root === Utils.$("pd-related-slider")) {
            this.relatedSlider.slides = [...box.children];
            this.relatedSlider.layout();
        } else {
            this.relatedSlider = new Slider(Utils.$("pd-related-slider"));
        }
    }

    // Mở / thu gọn một mục accordion (Mô tả, Giao hàng / đổi hàng, Cửa hàng còn hàng).
    toggleAcc(btn) { btn.closest(".pd-acc").classList.toggle("open"); }

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
