// Cửa sổ thông tin sinh viên (BOM - Lab 6, bài 1): mở popup 600 x 400 nằm giữa màn hình bằng window.open.

class StudentPopup {
    // Kích thước cửa sổ và thông tin sinh viên (sửa tại đây nếu cần đổi).
    constructor() {
        this.width = 600;
        this.height = 400;
        this.info = [
            ["MSSV", "Ty00234"],
            ["Họ và tên", "Nguyễn Thiện Nhân"],
            ["Ngành học", "Phát triển phần mềm"],
            ["Lớp học", "WEB1044"],
            ["Đồ án", "Urban Vibe - Website bán hàng thời trang"]
        ];
    }

    // Tạo HTML cho trang bên trong cửa sổ: mỗi dòng thông tin là một hàng của bảng.
    pageHTML() {
        const rows = this.info.map(([label, value]) =>
            `<tr><td>${Utils.escapeHTML(label)}</td><td>${Utils.escapeHTML(value)}</td></tr>`).join("");
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Thông tin sinh viên</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 32px; background: #f7f7f7; color: #222; }
        h2 { text-align: center; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 22px; }
        table { width: 100%; border-collapse: collapse; background: #fff; }
        td { padding: 12px 16px; border: 1px solid #e8e8e8; font-size: 15px; }
        td:first-child { width: 32%; font-weight: 700; background: #fafafa; }
    </style>
</head>
<body>
    <h2>Thông tin sinh viên</h2>
    <table>${rows}</table>
</body>
</html>`;
    }

    // Mở cửa sổ: left / top = (kích thước màn hình - kích thước cửa sổ) / 2 để cửa sổ nằm giữa màn hình.
    // Trình duyệt chặn popup thì window.open trả null nên báo cho người dùng biết.
    open() {
        const left = Math.round((screen.width - this.width) / 2);
        const top = Math.round((screen.height - this.height) / 2);
        const win = window.open("", "studentInfo", `width=${this.width},height=${this.height},left=${left},top=${top}`);
        if (!win) {
            Utils.showToast("Trình duyệt đang chặn cửa sổ bật lên, hãy cho phép rồi thử lại");
            return;
        }
        win.document.write(this.pageHTML());
        win.document.close();
        win.focus();
    }
}

// Một đối tượng dùng chung, gọi từ nút ở chân trang: studentPopup.open().
const studentPopup = new StudentPopup();
