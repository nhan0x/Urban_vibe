// Giỏ hàng nhanh ngay trên trang chủ (Lab 6, bài 4): bảng các dòng trong giỏ, thành tiền từng dòng và tổng tiền.
// Dữ liệu lấy từ giỏ hàng chính (cart), Cart.render() gọi miniCart.render() mỗi khi giỏ thay đổi.

class MiniCart {
    // Tạo nhanh một phần tử: tên thẻ, class (có thể bỏ trống) và chữ bên trong (có thể bỏ trống).
    make(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined) el.textContent = text;
        return el;
    }

    // Tạo nút nhỏ (-, +, Xóa) chạy hàm onClick khi bấm.
    button(text, onClick, className = "") {
        const btn = this.make("button", className, text);
        btn.type = "button";
        btn.addEventListener("click", onClick);
        return btn;
    }

    // Tạo MỘT dòng của bảng: STT, ảnh, tên (kèm size), đơn giá, số lượng (có nút -/+), thành tiền, nút Xóa.
    // Thành tiền = đơn giá x số lượng.
    rowElement(line, index) {
        const p = line.product;
        const tr = this.make("tr");

        const imgCell = this.make("td");
        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p.name;
        imgCell.appendChild(img);

        const nameCell = this.make("td", "mini-cart-name");
        nameCell.append(this.make("a", "", p.name), this.make("small", "", "Size " + line.size));
        nameCell.firstChild.href = "product.html?id=" + p.id;

        const qtyCell = this.make("td", "mini-cart-qty");
        qtyCell.append(
            this.button("−", () => cart.changeQty(p.id, line.size, -1)),
            this.make("span", "", line.qty),
            this.button("+", () => cart.changeQty(p.id, line.size, 1))
        );

        const removeCell = this.make("td");
        removeCell.appendChild(this.button("Xóa", () => cart.remove(p.id, line.size), "mini-cart-remove"));

        tr.append(
            this.make("td", "", index + 1),
            imgCell,
            nameCell,
            this.make("td", "", Utils.formatPrice(p.price)),
            qtyCell,
            this.make("td", "mini-cart-money", Utils.formatPrice(p.price * line.qty)),
            removeCell
        );
        return tr;
    }

    // Tạo bảng giỏ hàng: dòng tiêu đề, các dòng sản phẩm, dòng cuối là "Tổng tiền".
    tableElement(lines) {
        const table = this.make("table", "mini-cart-table");
        const head = this.make("thead");
        const headRow = this.make("tr");
        ["STT", "Hình", "Sản phẩm", "Đơn giá", "Số lượng", "Thành tiền", ""].forEach(t => headRow.appendChild(this.make("th", "", t)));
        head.appendChild(headRow);

        const body = this.make("tbody");
        lines.forEach((line, i) => body.appendChild(this.rowElement(line, i)));

        const foot = this.make("tfoot");
        const footRow = this.make("tr");
        const label = this.make("td", "", "Tổng tiền");
        label.colSpan = 5;
        footRow.append(label, this.make("td", "mini-cart-money", Utils.formatPrice(cart.subtotal())), this.make("td"));
        foot.appendChild(footRow);

        table.append(head, body, foot);
        return table;
    }

    // Hai nút dưới bảng: xem giỏ hàng đầy đủ và thanh toán.
    actionsElement() {
        const box = this.make("div", "mini-cart-actions");
        const view = this.make("a", "mini-cart-btn", "Xem giỏ hàng");
        view.href = "cart.html";
        box.append(view, this.button("Thanh toán", () => cart.checkout(), "mini-cart-btn mini-cart-btn-dark"));
        return box;
    }

    // Vẽ giỏ hàng nhanh. Có 3 trường hợp: chưa đăng nhập (mời đăng nhập), giỏ trống, hoặc có hàng (bảng + nút).
    // Trang không có khung #mini-cart thì bỏ qua.
    render() {
        const box = Utils.$("mini-cart");
        if (!box) return;
        box.innerHTML = "";
        box.appendChild(this.make("h4", "mini-cart-title", "Giỏ hàng của bạn"));

        if (!auth.isLoggedIn()) {
            box.appendChild(this.make("p", "mini-cart-empty", "Đăng nhập để thêm sản phẩm và xem giỏ hàng."));
            return;
        }
        const lines = cart.lines();
        if (!lines.length) {
            box.appendChild(this.make("p", "mini-cart-empty", "Giỏ hàng trống - bấm \"Thêm giỏ hàng\" ở sản phẩm bên trên."));
            return;
        }
        const wrap = this.make("div", "mini-cart-scroll");
        wrap.appendChild(this.tableElement(lines));
        box.append(wrap, this.actionsElement());
    }
}

// Một đối tượng dùng chung cho trang chủ.
const miniCart = new MiniCart();
