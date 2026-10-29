// Hàm tiện ích dùng chung: lấy phần tử, định dạng giá / ngày, thông báo toast, cuộn tới mục.
// Mọi hàm đều là static (không dùng this, không giữ dữ liệu) nên gọi thẳng: Utils.$("id"), Utils.showToast("...").

class Utils {
    // Viết tắt của document.getElementById: tìm phần tử HTML theo id.
    static $(id) { return document.getElementById(id); }

    // Đổi chữ bên trong phần tử có id này. Nếu không tìm thấy phần tử thì bỏ qua (tránh lỗi trên trang không có phần tử đó).
    static setText(id, text) {
        const el = Utils.$(id);
        if (el) el.textContent = text;
    }

    // 1498000 -> "1.498.000₫" (toLocaleString("vi-VN") tự thêm dấu chấm ngăn cách hàng nghìn).
    static formatPrice(n) { return n.toLocaleString("vi-VN") + "₫"; }

    // Bỏ dấu tiếng Việt và đổi chữ thường: "Áo Đầm" -> "ao dam". Dùng để tìm kiếm không phân biệt dấu / hoa thường.
    static normalize(text) {
        return text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
    }

    // Tên sản phẩm trong dữ liệu viết HOA toàn bộ: đổi thành kiểu câu ("ĐẦM TRẮNG HT HOA" -> "Đầm trắng HT hoa").
    // Các chữ viết tắt (CV = chân váy, SM = sơ mi, HT = hoạ tiết...) giữ nguyên chữ hoa.
    static prettyName(name) {
        const keep = ["CV", "SM", "HT", "KT", "TT", "DT", "UMI", "A", "V"];
        const words = name.split(" ").map(w => keep.includes(w) ? w : w.toLowerCase());
        const text = words.join(" ");
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    // Giá gốc để gạch ngang. Chỉ sản phẩm nhóm "sale" mới có (giá hiện tại x 1.25), còn lại trả 0 (nghĩa là không có giá gốc).
    static getOriginalPrice(p) {
        if (p.oldPrice) return p.oldPrice;
        if (p.category === "sale") return Math.round(p.price * 1.25 / 1000) * 1000;
        return 0;
    }

    // Trả về "" nếu có giá trị, ngược lại trả về thông báo lỗi bắt buộc nhập
    static required(value) {
        if (value) return "";
        return "Đây là trường bắt buộc";
    }

    // Hiện thông báo nhỏ ở góc phải dưới (giống theciu.vn): biểu tượng tròn + chữ, tự ẩn sau 2,4 giây.
    // Thông báo thành công (bắt đầu bằng "Đã ..." hoặc có dấu ✓) dùng biểu tượng dấu tích xanh, còn lại dùng biểu tượng thông tin.
    static showToast(message) {
        const toast = Utils.$("toast");
        const ok = /^(Đã |✓|Đăng nhập thành công|Đăng ký thành công)/.test(message);
        const text = message.replace(/^✓s*/, "");
        toast.innerHTML = `<span class="toast-icon ${ok ? "ok" : "info"}">${Icons.get(ok ? "check" : "chat")}</span><span>${Utils.escapeHTML(text)}</span>`;
        toast.classList.add("show");
        clearTimeout(Utils.toastTimer);
        Utils.toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
    }

    // Chống chèn mã HTML độc hại (XSS): đặt chữ vào một thẻ div bằng textContent (trình duyệt tự coi nó là chữ thường),
    // rồi đọc lại innerHTML để lấy bản đã được mã hoá (ví dụ "<" thành "&lt;"). Dùng cho dữ liệu người dùng nhập trước khi chèn vào HTML.
    static escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // Đổi mốc thời gian (số mili giây) thành chuỗi ngày giờ kiểu Việt Nam, ví dụ "14:30 05/10/2026".
    static formatDateTime(ts) {
        return new Date(ts).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" });
    }

    // Cuộn mượt tới phần tử có id này (nếu có).
    static scrollToSection(id) {
        const el = Utils.$(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }
}
