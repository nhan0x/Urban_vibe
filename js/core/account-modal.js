// Điều hướng tới trang đăng nhập / đăng ký (pages/account/sign-in.html) giống theciu.vn.
// Tên lớp AccountModal và các hàm open / close được giữ nguyên để auth.js và các trang khác không phải sửa.

class AccountModal {
    // Mở trang đăng nhập (tab "login") hoặc đăng ký (tab "register"), kèm địa chỉ trang hiện tại để quay lại sau khi đăng nhập xong.
    open(tab = "login") {
        if (location.pathname.endsWith("sign-in.html")) { this.switchTab(tab); return; }
        location.href = "pages/account/sign-in.html?tab=" + tab + "&return=" + encodeURIComponent(location.href);
    }

    // Gọi sau khi đăng nhập / đăng ký thành công: đang ở trang đăng nhập thì quay về trang trước đó (hoặc trang chủ).
    close() {
        if (!location.pathname.endsWith("sign-in.html")) return;
        const back = new URLSearchParams(location.search).get("return");
        if (back && !back.includes("sign-in.html")) location.href = back;
        else location.href = "index.html";
    }

    // Chuyển giữa 2 tab của trang đăng nhập (chỉ có tác dụng khi trang có các phần tử tab).
    switchTab(tab) {
        document.querySelectorAll("[data-auth-tab]").forEach(el => el.classList.toggle("active", el.dataset.authTab === tab));
        document.querySelectorAll("[data-auth-pane]").forEach(el => el.classList.toggle("active", el.dataset.authPane === tab));
    }

    // Bấm "Quên mật khẩu?": chỉ hiện thông báo (chưa có chức năng khôi phục thật).
    forgot() { Utils.showToast("Vui lòng liên hệ hotline 0775 665 912 để được hỗ trợ đặt lại mật khẩu"); }
}

const accountModal = new AccountModal();
