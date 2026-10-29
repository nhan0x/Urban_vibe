// Giỏ hàng (phần xử lý dữ liệu): thêm / gỡ / đổi số lượng / đổi size theo từng dòng, chọn dòng để thanh toán, lưu theo tài khoản.
// Giao diện trang giỏ hàng nằm ở js/pages/cart-page.js.

class Cart {
    // Nhận danh sách sản phẩm (từ products.js) để tra thông tin theo id. Size mặc định là "S".
    // Giỏ hàng chỉ lưu { id, size, qty }, còn tên / giá / ảnh được tra lại từ danh sách sản phẩm khi vẽ.
    constructor(allProducts) {
        this.products = allProducts;
        this.defaultSize = "S";
    }

    // Key lưu giỏ trong localStorage, riêng cho từng tài khoản ("cart:email"). Chưa đăng nhập thì là null.
    key() { return auth.userKey("cart"); }

    // Key lưu danh sách các dòng đang được tick để thanh toán ("cart-selected:email").
    selectedKey() { return auth.userKey("cart-selected"); }

    // Đọc giỏ hàng của người đang đăng nhập (mảng các dòng). Chưa đăng nhập hoặc chưa có dữ liệu thì trả mảng rỗng.
    get() {
        if (!this.key()) return [];
        const items = JSON.parse(localStorage.getItem(this.key())) || [];
        return items.map(i => ({ ...i, size: i.size || this.defaultSize }));
    }

    // Ghi giỏ hàng xuống localStorage rồi vẽ lại (cập nhật số lượng trên header và trang giỏ).
    save(items) {
        if (!this.key()) return;
        localStorage.setItem(this.key(), JSON.stringify(items));
        this.render();
    }

    // Hai dòng giỏ là "cùng một món" khi cùng id sản phẩm VÀ cùng size (áo S và áo L là hai dòng khác nhau).
    same(a, id, size) { return a.id === id && a.size === size; }

    // Khoá nhận diện một dòng giỏ, ví dụ "5|S".
    lineKey(id, size) { return id + "|" + size; }

    // Thêm sản phẩm vào giỏ. Phải đăng nhập (requireLogin). Đã có đúng món đó (cùng id + size) thì cộng dồn số lượng,
    // chưa có thì thêm dòng mới. Trả true nếu thêm được, false nếu bị chặn do chưa đăng nhập.
    add(id, qty = 1, size = this.defaultSize) {
        if (!auth.requireLogin("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng")) return false;
        const items = this.get();
        const item = items.find(x => this.same(x, id, size));
        if (item) item.qty += qty;
        else items.push({ id, size, qty });
        this.save(items);
        Utils.showToast("Đã thêm vào giỏ hàng!");
        return true;
    }

    // Gỡ một dòng khỏi giỏ: giữ lại mọi dòng KHÁC với dòng (id, size) này, rồi lưu.
    remove(id, size) {
        if (!auth.requireLogin()) return;
        this.save(this.get().filter(x => !this.same(x, id, size)));
        this.setSelected(this.selectedKeys().filter(k => k !== this.lineKey(id, size)));
        Utils.showToast("Đã gỡ sản phẩm khỏi giỏ hàng");
    }

    // Đặt số lượng của một dòng (tối thiểu 1).
    setQty(id, size, qty) {
        const items = this.get();
        const item = items.find(x => this.same(x, id, size));
        if (!item) return;
        item.qty = Math.max(1, parseInt(qty, 10) || 1);
        this.save(items);
    }

    // Đổi size của một dòng. Nếu đã có dòng cùng sản phẩm với size mới thì gộp số lượng vào dòng đó.
    setSize(id, oldSize, newSize) {
        if (oldSize === newSize) return;
        const items = this.get();
        const item = items.find(x => this.same(x, id, oldSize));
        if (!item) return;
        const other = items.find(x => this.same(x, id, newSize));
        if (other) {
            other.qty += item.qty;
            items.splice(items.indexOf(item), 1);
        } else {
            item.size = newSize;
        }
        this.save(items);
    }

    // ---------- Chọn dòng để thanh toán ----------

    // Các khoá dòng đang được tick. Chưa từng chọn gì thì mặc định là tất cả các dòng trong giỏ.
    selectedKeys() {
        const all = this.get().map(i => this.lineKey(i.id, i.size));
        if (!this.selectedKey()) return all;
        const saved = JSON.parse(localStorage.getItem(this.selectedKey()));
        if (!saved) return all;
        return saved.filter(k => all.includes(k));
    }

    // Lưu danh sách khoá dòng được tick.
    setSelected(keys) {
        if (!this.selectedKey()) return;
        localStorage.setItem(this.selectedKey(), JSON.stringify(keys));
    }

    // Tick / bỏ tick một dòng.
    toggleSelected(id, size) {
        const key = this.lineKey(id, size);
        const keys = this.selectedKeys();
        if (keys.includes(key)) this.setSelected(keys.filter(k => k !== key));
        else this.setSelected(keys.concat(key));
    }

    // Tick tất cả (checked = true) hoặc bỏ tick tất cả.
    selectAll(checked) {
        this.setSelected(checked ? this.get().map(i => this.lineKey(i.id, i.size)) : []);
    }

    // ---------- Tra cứu ----------

    // Ghép mỗi dòng giỏ với thông tin sản phẩm đầy đủ (tên, giá, ảnh...) để vẽ.
    // Dòng nào có sản phẩm không còn tồn tại thì bị lọc bỏ.
    lines() {
        return this.get()
            .map(i => ({ product: this.products.find(p => p.id === i.id), size: i.size, qty: i.qty }))
            .filter(l => l.product);
    }

    // Các dòng đang được tick để thanh toán.
    checkoutLines() {
        const keys = this.selectedKeys();
        return this.lines().filter(l => keys.includes(this.lineKey(l.product.id, l.size)));
    }

    // Tổng số món trong giỏ (cộng số lượng của mọi dòng) - con số hiện trên biểu tượng giỏ ở header.
    count() { return this.get().reduce((sum, i) => sum + i.qty, 0); }

    // Tổng tiền hàng của các dòng đã tick = cộng (giá x số lượng), chưa tính phí vận chuyển.
    subtotal() { return this.checkoutLines().reduce((s, l) => s + l.product.price * l.qty, 0); }

    // Xoá khỏi giỏ các dòng đã đặt hàng (những dòng được tick); các dòng không tick vẫn còn.
    clear() {
        if (!this.key()) return;
        const keys = this.selectedKeys();
        this.save(this.get().filter(i => !keys.includes(this.lineKey(i.id, i.size))));
        localStorage.removeItem(this.selectedKey());
    }

    // Chuyển sang trang giỏ hàng.
    open() { location.href = "pages/shop/cart.html"; }

    // Cập nhật số trên biểu tượng giỏ ở header (ẩn khi giỏ trống); nếu đang ở trang giỏ hàng thì vẽ lại cả trang.
    render() {
        const badge = Utils.$("cart-count");
        if (badge) {
            badge.textContent = this.count();
            badge.classList.toggle("show", this.count() > 0);
        }
        if (window.cartPage) cartPage.render();
    }

    // Bấm "Thanh toán": phải đăng nhập, giỏ trống hoặc chưa tick dòng nào thì báo, ngược lại sang trang thanh toán.
    checkout() {
        if (!auth.requireLogin("Vui lòng đăng nhập để đặt hàng")) return;
        if (!this.lines().length) { Utils.showToast("Giỏ hàng của bạn đang trống!"); return; }
        if (!this.checkoutLines().length) { Utils.showToast("Vui lòng chọn ít nhất một sản phẩm để thanh toán"); return; }
        location.href = "pages/shop/checkout.html";
    }
}

// Một đối tượng giỏ hàng dùng chung cho cả site.
const cart = new Cart(products);
