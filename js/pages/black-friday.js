// Trang Black Friday (pages/shop/black-friday.html): các sản phẩm đang giảm giá, mỗi ảnh có nhãn "Giảm X%" và đồng hồ đếm ngược.

class BlackFridayPage {
    // pageSize: số sản phẩm hiện mỗi lần; shown: số đang hiện; target: thời điểm mở bán (27/11/2026, giờ máy người dùng).
    constructor() {
        this.pageSize = 12;
        this.shown = this.pageSize;
        this.target = new Date(2026, 10, 27, 0, 0, 0).getTime();
        this.items = Catalog.onSale();
    }

    // Phần trăm giảm của một sản phẩm: (giá gốc - giá bán) / giá gốc, làm tròn.
    discount(p) {
        const old = Utils.getOriginalPrice(p);
        return old ? Math.round((1 - p.price / old) * 100) : 0;
    }

    // Chuỗi đếm ngược dạng "16N 23:34:50" (N = ngày). Hết giờ thì trả "00:00:00".
    countdown() {
        const left = Math.max(0, this.target - Date.now());
        const days = Math.floor(left / 86400000);
        const h = String(Math.floor(left / 3600000) % 24).padStart(2, "0");
        const m = String(Math.floor(left / 60000) % 60).padStart(2, "0");
        const s = String(Math.floor(left / 1000) % 60).padStart(2, "0");
        return { days, text: `${h}:${m}:${s}` };
    }

    // Phần nhãn đè lên đáy ảnh: "Ưu đãi sắp mở - Giảm X%" bên trái, "Mở bán sau ..." bên phải.
    overlayHTML(p) {
        const c = this.countdown();
        return `
            <span class="bf-overlay">
                <span class="bf-off"><small>Ưu đãi sắp mở</small><strong>Giảm ${this.discount(p)}%</strong></span>
                <span class="bf-timer"><small>Mở bán sau</small><span><b class="bf-days">${c.days}N</b><i class="bf-clock">${c.text}</i></span></span>
            </span>`;
    }

    // Vẽ lưới sản phẩm, số lượng và nút "Xem thêm" (ẩn khi đã hiện hết).
    render() {
        const slice = this.items.slice(0, this.shown);
        ProductCard.renderInto("bf-grid", slice, "Chưa có sản phẩm ưu đãi.", { overlay: p => this.overlayHTML(p) });
        Utils.$("bf-count").textContent = this.items.length + " sản phẩm";
        const more = Utils.$("bf-more");
        if (this.shown >= this.items.length) more.innerHTML = "";
        else more.innerHTML = '<button type="button" class="btn btn-outline btn-wide" onclick="bfPage.more()">Xem thêm</button>';
    }

    // Hiện thêm một lượt sản phẩm.
    more() {
        this.shown += this.pageSize;
        this.render();
    }

    // Cập nhật đồng hồ mỗi giây (chỉ sửa chữ, không vẽ lại cả lưới).
    tick() {
        const c = this.countdown();
        document.querySelectorAll(".bf-days").forEach(el => { el.textContent = c.days + "N"; });
        document.querySelectorAll(".bf-clock").forEach(el => { el.textContent = c.text; });
    }

    // Điểm vào: vẽ lần đầu, chạy đồng hồ, vẽ lại khi đăng nhập / yêu thích thay đổi.
    init() {
        this.render();
        setInterval(() => this.tick(), 1000);
        window.addEventListener("authchange", () => this.render());
        window.addEventListener("wishlistchange", () => this.render());
    }
}

const bfPage = new BlackFridayPage();
bfPage.init();
