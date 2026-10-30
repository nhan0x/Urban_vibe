// Thẻ sản phẩm dùng chung (danh sách sản phẩm, yêu thích, bộ sưu tập, Black Friday, sản phẩm liên quan) theo kiểu owen.vn:
// ảnh nền xám bo góc, nhãn giảm giá đỏ góc trái, nút tim tròn góc phải, nút "Mua ngay" trượt lên khi rê chuột,
// dưới ảnh là chấm mẫu màu, tên in hoa, giá gốc gạch đỏ + giá bán, dòng tích điểm.

class ProductCard {
    // Nhãn góc trái ảnh: đang giảm giá thì "-x%", sản phẩm mới "NEW", bán chạy "HOT". Không thuộc nhóm nào thì không có nhãn.
    static badge(p) {
        const old = Utils.getOriginalPrice(p);
        if (old > p.price) return { text: "-" + Math.round((1 - p.price / old) * 100) + "%", cls: "sale" };
        if (p.category === "new") return { text: "NEW", cls: "new" };
        if (p.category === "hot") return { text: "HOT", cls: "hot" };
        return null;
    }

    // Các ảnh dùng làm "mẫu màu" (chấm tròn nhỏ): ảnh chính và ảnh thứ 2 nếu có.
    static swatches(p) {
        const list = [p.image];
        if (p.image2 && p.image2 !== p.image) list.push(p.image2);
        return list;
    }

    // Điểm tích luỹ: 1 điểm cho mỗi 1.000₫.
    static points(p) { return Math.floor(p.price / 1000); }

    // HTML của MỘT thẻ sản phẩm.
    // opts.overlay (tuỳ chọn): đoạn HTML đặt đè lên đáy ảnh (trang Black Friday: nhãn giảm giá và đếm ngược).
    // opts.eager: ảnh tải ngay (các thẻ đầu lưới, có thể là LCP).
    static html(p, opts = {}) {
        const loading = opts.eager ? "eager" : "lazy";
        const badge = ProductCard.badge(p);
        const badgeHTML = badge ? `<span class="product-badge ${badge.cls}">${badge.text}</span>` : "";
        const liked = wishlist.has(p.id);
        const heart = liked ? Icons.heartFilled() : Icons.get("heart");
        const oldPrice = Utils.getOriginalPrice(p);
        const oldPriceHTML = oldPrice > p.price ? `<s>${Utils.formatPrice(oldPrice)}</s>` : "";
        const url = "pages/shop/product.html?id=" + p.id;
        const name = Utils.escapeHTML(p.name);
        const hover = p.image2 && p.image2 !== p.image ? `<img class="img-hover" src="${p.image2}" alt="" loading="lazy" decoding="async">` : "";
        const swatches = ProductCard.swatches(p).map((src, i) =>
            `<button type="button" class="swatch ${i === 0 ? "active" : ""}" style="background-image:url('${src}')" onclick="ProductCard.pickSwatch(this, '${src}')" aria-label="Mẫu ${i + 1}"></button>`).join("");
        const online = p.category === "sale" ? `<span class="product-tag online">Chỉ có tại Online</span>` : "";

        return `
            <article class="product-card" data-id="${p.id}">
                <div class="product-media">
                    <a class="product-media-link" href="${url}" aria-label="${name}">
                        <img class="img-main" src="${p.image}" alt="${name}" loading="${loading}" decoding="async">
                        ${hover}
                    </a>
                    ${badgeHTML}
                    <button type="button" class="wish-btn ${liked ? "active" : ""}" onclick="wishlist.toggle(${p.id}, event)" aria-label="Yêu thích">${heart}</button>
                    <button type="button" class="quick-buy" onclick="cart.add(${p.id})">Mua ngay</button>
                    ${opts.overlay ? opts.overlay(p) : ""}
                </div>
                <div class="product-body">
                    <div class="product-swatches">${swatches}</div>
                    <a class="product-name" href="${url}">${name}</a>
                    <p class="product-price">${oldPriceHTML}<span>${Utils.formatPrice(p.price)}</span></p>
                    <div class="product-tags">${online}<span class="product-tag points">${Icons.get("gift")}Tích lũy ${ProductCard.points(p)} điểm</span></div>
                </div>
            </article>`;
    }

    // Vẽ danh sách sản phẩm vào phần tử chứa (theo id). Danh sách rỗng thì hiện câu thông báo; opts được chuyển cho từng thẻ.
    static renderInto(containerId, list, emptyText = "Chưa có sản phẩm nào phù hợp.", opts = {}) {
        const box = Utils.$(containerId);
        if (!box) return;
        if (!list.length) { box.innerHTML = `<p class="empty-hint">${emptyText}</p>`; return; }
        box.innerHTML = list.map((p, i) => ProductCard.html(p, { ...opts, eager: i < 4 })).join("");
    }

    // Bấm một mẫu màu: đổi ảnh chính của thẻ sang ảnh của mẫu đó và tô vòng cho mẫu đang chọn.
    static pickSwatch(btn, src) {
        const card = btn.closest(".product-card");
        card.querySelector(".img-main").src = src;
        card.querySelectorAll(".swatch").forEach(s => s.classList.toggle("active", s === btn));
    }
}
