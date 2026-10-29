// Thẻ sản phẩm dùng chung (trang chủ, danh sách sản phẩm, yêu thích, bộ sưu tập, Black Friday).
// Chỉ lo việc sinh HTML cho thẻ và xử lý các thao tác trên thẻ (tim, đổi mẫu màu, mua nhanh).

class ProductCard {
    // Nhãn góc trái ảnh theo nhóm sản phẩm: new -> "New", hot -> "Hot", sale hoặc có giá gốc -> "Sale". Không thuộc nhóm nào thì không có nhãn.
    static badge(p) {
        if (p.category === "new") return { text: "New", cls: "" };
        if (p.category === "hot") return { text: "Hot", cls: "hot" };
        if (p.category === "sale" || Utils.getOriginalPrice(p) > 0) return { text: "Sale", cls: "sale" };
        return null;
    }

    // Các ảnh dùng làm "mẫu màu" (vòng tròn nhỏ): ảnh chính và ảnh thứ 2 nếu có.
    static swatches(p) {
        const list = [p.image];
        if (p.image2 && p.image2 !== p.image) list.push(p.image2);
        return list;
    }

    // HTML của MỘT thẻ sản phẩm: nhãn, nút tim, ảnh (có ảnh thứ 2 hiện khi rê chuột), tên, giá, mẫu màu, nút "Mua ngay".
    // opts.overlay (tuỳ chọn): đoạn HTML đặt đè lên đáy ảnh (dùng ở trang Black Friday cho nhãn giảm giá và đếm ngược).
    static html(p, opts = {}) {
        const badge = ProductCard.badge(p);
        const badgeHTML = badge ? `<span class="product-badge ${badge.cls}">${badge.text}</span>` : "";
        const liked = wishlist.has(p.id);
        const heart = liked ? Icons.heartFilled() : Icons.get("heart");
        const oldPrice = Utils.getOriginalPrice(p);
        const oldPriceHTML = oldPrice ? `<s>${Utils.formatPrice(oldPrice)}</s>` : "";
        const url = "pages/shop/product.html?id=" + p.id;
        const hover = p.image2 && p.image2 !== p.image ? `<img class="img-hover" src="${p.image2}" alt="" loading="lazy">` : "";
        const swatches = ProductCard.swatches(p).map((src, i) =>
            `<button type="button" class="swatch ${i === 0 ? "active" : ""}" style="background-image:url('${src}')" onclick="ProductCard.pickSwatch(this, '${src}')" aria-label="Mẫu ${i + 1}"></button>`).join("");

        return `
            <article class="product-card" data-id="${p.id}">
                ${badgeHTML}
                <button type="button" class="btn-circle wish-btn ${liked ? "active" : ""}" onclick="wishlist.toggle(${p.id}, event)" aria-label="Yêu thích">${heart}</button>
                <a class="product-media" href="${url}">
                    <img class="img-main" src="${p.image}" alt="${Utils.escapeHTML(Utils.prettyName(p.name))}" loading="lazy">
                    ${hover}
                    ${opts.overlay ? opts.overlay(p) : ""}
                </a>
                <div class="product-body">
                    <a class="product-name" href="${url}">${Utils.prettyName(p.name)}</a>
                    <p class="product-price">${Utils.formatPrice(p.price)}${oldPriceHTML}</p>
                    <div class="product-swatches">${swatches}</div>
                    <div class="product-actions">
                        <button type="button" class="btn btn-dark" onclick="cart.add(${p.id})"><span>Mua ngay</span>${Icons.get("cart")}</button>
                    </div>
                </div>
            </article>`;
    }

    // Vẽ danh sách sản phẩm vào phần tử chứa (theo id). Danh sách rỗng thì hiện câu thông báo; opts được chuyển cho từng thẻ.
    static renderInto(containerId, list, emptyText = "Chưa có sản phẩm nào phù hợp.", opts = {}) {
        const box = Utils.$(containerId);
        if (!box) return;
        if (!list.length) { box.innerHTML = `<p class="empty-hint">${emptyText}</p>`; return; }
        box.innerHTML = list.map(p => ProductCard.html(p, opts)).join("");
    }

    // Bấm một mẫu màu: đổi ảnh chính của thẻ sang ảnh của mẫu đó và tô vòng cho mẫu đang chọn.
    static pickSwatch(btn, src) {
        const card = btn.closest(".product-card");
        card.querySelector(".img-main").src = src;
        card.querySelectorAll(".swatch").forEach(s => s.classList.toggle("active", s === btn));
    }
}
