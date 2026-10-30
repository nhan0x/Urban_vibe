// Sản phẩm yêu thích: lưu theo tài khoản, cập nhật số trên header và vẽ trang pages/shop/wishlist.html.

class Wishlist {
    // Key lưu danh sách yêu thích riêng cho từng tài khoản ("wishlist:email"). Chưa đăng nhập thì là null.
    key() { return auth.userKey("wishlist"); }

    // Đọc danh sách yêu thích: một mảng chứa id các sản phẩm, ví dụ [3, 7, 12]. Chưa đăng nhập hoặc chưa có dữ liệu thì trả [].
    get() {
        if (!this.key()) return [];
        return JSON.parse(localStorage.getItem(this.key())) || [];
    }

    // Lưu danh sách xuống localStorage, cập nhật số trên header và báo "wishlistchange" để các lưới sản phẩm vẽ lại (trái tim đổi màu ngay).
    save(list) {
        localStorage.setItem(this.key(), JSON.stringify(list));
        this.updateBadge();
        window.dispatchEvent(new Event("wishlistchange"));
    }

    // Sản phẩm này đã được yêu thích chưa? (true / false)
    has(id) { return this.get().includes(id); }

    // Cập nhật con số yêu thích trên header; nếu đang ở trang yêu thích thì vẽ lại cả trang.
    updateBadge() {
        Utils.setText("wishlist-count", this.get().length);
        const badge = Utils.$("wishlist-count");
        if (badge) badge.classList.toggle("show", this.get().length > 0);
        if (Utils.$("wishlist-page")) this.renderPage();
    }

    // Bấm trái tim: đã yêu thích thì bỏ (splice cắt khỏi mảng), chưa thì thêm (push). Phải đăng nhập.
    // event.stopPropagation() ngăn cú bấm "nổi bọt" lên thẻ sản phẩm bên ngoài (nếu không sẽ vừa tim vừa mở trang chi tiết).
    toggle(id, event) {
        event.stopPropagation();
        if (!auth.requireLogin("Vui lòng đăng nhập để lưu sản phẩm yêu thích")) return;
        const list = this.get();
        const index = list.indexOf(id);
        if (index > -1) {
            list.splice(index, 1);
            Utils.showToast("Đã xóa khỏi danh sách yêu thích");
        } else {
            list.push(id);
            Utils.showToast("❤️ Đã lưu vào danh sách yêu thích");
        }
        this.save(list);
    }
   

    // Xoá một sản phẩm khỏi danh sách yêu thích (giữ lại các id khác id này).
    remove(id) {
        if (!auth.requireLogin()) return;
        this.save(this.get().filter(x => x !== id));
        Utils.showToast("Đã xóa khỏi danh sách yêu thích");
    }

    // Vẽ trang yêu thích (pages/shop/wishlist.html): chưa đăng nhập thì mời đăng nhập; đã đăng nhập thì hiện lưới thẻ sản phẩm
    // đã thích (bấm tim trên thẻ để bỏ thích), hoặc lời nhắn khi chưa có sản phẩm nào.
    renderPage() {
        const root = Utils.$("wishlist-page");
        let body;
        if (!auth.isLoggedIn()) {
            body = `
                <div class="wl-empty">
                    <p>Vui lòng đăng nhập để xem danh sách yêu thích của bạn.</p>
                    <a class="btn btn-gray" href="javascript:void(0)" onclick="accountModal.open('login')">Đăng nhập</a>
                </div>`;
        } else {
            const items = this.get().map(id => products.find(p => p.id === id)).filter(Boolean);
            if (!items.length) {
                body = `
                    <div class="wl-empty">
                        <p>Bạn chưa có sản phẩm yêu thích nào. Hãy bấm biểu tượng trái tim trên sản phẩm để lưu lại nhé!</p>
                        <a class="btn btn-gray" href="pages/shop/products.html">Khám phá sản phẩm</a>
                    </div>`;
            } else {
                body = `<p class="wl-count">Có <strong>${items.length}</strong> sản phẩm trong danh sách yêu thích</p><div class="product-grid" id="wishlist-grid"></div>`;
            }
        }
        root.innerHTML = body;
        const grid = Utils.$("wishlist-grid");
        if (grid) ProductCard.renderInto("wishlist-grid", this.get().map(id => products.find(p => p.id === id)).filter(Boolean));
    }
}

const wishlist = new Wishlist();
