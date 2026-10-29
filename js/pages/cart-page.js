// Giao diện trang giỏ hàng (pages/shop/cart.html): nút tiếp tục mua sắm, danh sách dòng sản phẩm, chọn tất cả, thanh toán.
// Dữ liệu và thao tác nằm ở js/features/cart.js; file này chỉ vẽ lại màn hình mỗi khi giỏ hoặc đăng nhập thay đổi.

class CartPage {
    // Các size cho phép chọn ở ô "Size" của từng dòng.
    constructor() { this.sizes = ["S", "M", "L", "XL"]; }

    // Tên màu suy ra từ tên sản phẩm (dùng lại bảng màu của trang chi tiết).
    colorOf(product) { return productDetailColor(product); }

    // Biểu tượng tick tròn: có dấu ✓ bên trong khi đã chọn.
    checkIcon(checked) {
        return `<span class="check-circle ${checked ? "checked" : ""}">${checked ? Icons.get("check") : ""}</span>`;
    }

    // HTML một dòng sản phẩm trong giỏ: tick, ảnh, tên, màu, size, số lượng, thành tiền, nút xóa.
    rowHTML(l) {
        const p = l.product;
        const key = cart.lineKey(p.id, l.size);
        const checked = cart.selectedKeys().includes(key);
        const sizeOptions = this.sizes.map(s => `<option ${s === l.size ? "selected" : ""}>${s}</option>`).join("");
        return `
            <div class="cart-item">
                <button type="button" class="cart-tick" onclick="cartPage.toggle(${p.id}, '${l.size}')" aria-label="Chọn sản phẩm">${this.checkIcon(checked)}</button>
                <a class="cart-thumb" href="pages/shop/product.html?id=${p.id}"><img src="${p.image}" alt=""></a>
                <div class="cart-info">
                    <a class="cart-name" href="pages/shop/product.html?id=${p.id}">${Utils.prettyName(p.name)}</a>
                    <div class="cart-options">
                        <label>MÀU: <span class="pill-select pill-static">${this.colorOf(p)}</span></label>
                        <label>Size:
                            <span class="pill-select"><select onchange="cartPage.changeSize(${p.id}, '${l.size}', this.value)">${sizeOptions}</select></span>
                        </label>
                    </div>
                </div>
                <div class="cart-side">
                    <div class="cart-qty">
                        <button type="button" onclick="cartPage.step(${p.id}, '${l.size}', -1)" aria-label="Giảm">${Icons.get("minus")}</button>
                        <input type="number" min="1" value="${l.qty}" onchange="cartPage.setQty(${p.id}, '${l.size}', this.value)">
                        <button type="button" onclick="cartPage.step(${p.id}, '${l.size}', 1)" aria-label="Tăng">${Icons.get("plus")}</button>
                    </div>
                    <span class="cart-price">${Utils.formatPrice(p.price * l.qty)}</span>
                </div>
                <button type="button" class="cart-remove" onclick="cart.remove(${p.id}, '${l.size}')" aria-label="Xóa">${Icons.get("close")}</button>
            </div>`;
    }

    // Trạng thái trống: hình giỏ hàng, lời nhắn và nút về trang chủ.
    emptyHTML(message) {
        return `
            <div class="cart-empty">
                <div class="cart-empty-art">
                    <svg viewBox="0 0 240 240" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M70 120 130 92l58 30v62l-58 30-60-30z" fill="#fff"/>
                        <path d="M70 120l60 30 58-28M130 150v64"/>
                        <path d="M92 112c-8-22 4-44 30-44 14 0 26 8 32 22" stroke-width="6"/>
                        <path d="M118 34l4 18M150 40l-8 14M96 46l10 12" stroke-width="2"/>
                    </svg>
                </div>
                <h4>${message}</h4>
                <p>Quay về Trang chủ và bỏ túi ngay các món đồ theo sở thích riêng của bạn nhé!</p>
                <a class="btn btn-gray btn-home" href="index.html">Quay về trang chủ</a>
            </div>`;
    }

    // Vẽ cả trang giỏ hàng. Chưa đăng nhập: mời đăng nhập; giỏ trống: trạng thái trống; có hàng: danh sách + nút thanh toán.
    render() {
        const root = Utils.$("cart-page");
        if (!root) return;
        const lines = cart.lines();
        const count = cart.count();
        let body;
        if (!auth.isLoggedIn()) {
            body = `
                <div class="cart-empty">
                    <h4>Bạn cần đăng nhập để xem giỏ hàng</h4>
                    <p>Đăng nhập để thêm sản phẩm vào giỏ và đặt hàng nhanh chóng.</p>
                    <a class="btn btn-gray btn-home" href="javascript:void(0)" onclick="accountModal.open('login')">Đăng nhập</a>
                </div>`;
        } else if (!lines.length) {
            body = this.emptyHTML("Giỏ hàng của bạn đang trống");
        } else {
            const selected = cart.selectedKeys().length;
            const allChecked = selected === lines.length;
            body = `
                <div class="cart-list">${lines.map(l => this.rowHTML(l)).join("")}</div>
                <button type="button" class="cart-select-all" onclick="cartPage.toggleAll()">${this.checkIcon(allChecked)}<span>Chọn tất cả</span></button>
                <hr class="cart-rule">
                <div class="cart-footer">
                    <a class="btn btn-outline btn-more-items" href="pages/shop/products.html">Chọn thêm sản phẩm</a>
                    <button type="button" class="btn btn-gray btn-pay" onclick="cart.checkout()">Thanh toán${selected ? ` (${Utils.formatPrice(cart.subtotal())})` : ""}</button>
                </div>`;
        }
        root.innerHTML = `
            <div class="cart-head">
                <h3>Giỏ hàng</h3>
                <p>Có <strong>${count}</strong> sản phẩm trong giỏ hàng</p>
            </div>
            <hr class="cart-rule">
            ${body}`;
    }

    // Tick / bỏ tick một dòng rồi vẽ lại.
    toggle(id, size) { cart.toggleSelected(id, size); this.render(); }

    // Tick tất cả nếu đang chưa đủ, bỏ tick tất cả nếu đã tick hết.
    toggleAll() {
        cart.selectAll(cart.selectedKeys().length !== cart.lines().length);
        this.render();
    }

    // Nút − / +: đổi số lượng một dòng đi delta.
    step(id, size, delta) {
        const item = cart.get().find(i => cart.same(i, id, size));
        if (item) cart.setQty(id, size, item.qty + delta);
    }

    // Gõ số lượng trực tiếp vào ô.
    setQty(id, size, value) { cart.setQty(id, size, value); }

    // Đổi size của một dòng (gộp nếu đã có cùng size).
    changeSize(id, oldSize, newSize) { cart.setSize(id, oldSize, newSize); }
}

// Màu của sản phẩm suy ra từ tên: dùng lại hàm của trang chi tiết nếu đã nạp, ngược lại tự tra bảng màu.
function productDetailColor(product) {
    const colors = [["ĐEN", "Đen"], ["TRẮNG", "Trắng"], ["HỒNG", "Hồng"], ["BE", "Be"], ["KEM", "Kem"], ["NÂU", "Nâu"], ["XANH", "Xanh"],
        ["ĐỎ", "Đỏ"], ["TÍM", "Tím"], ["VÀNG", "Vàng"], ["CAM", "Cam"], ["GHI", "Ghi"], ["OLIVE", "Olive"], ["BURGUNDY", "Burgundy"]];
    const words = product.name.split(" ");
    const hit = colors.find(([key]) => words.includes(key));
    return hit ? hit[1] : "Đa sắc";
}

const cartPage = new CartPage();
cartPage.render();
