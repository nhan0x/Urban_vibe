// Trang Chi nhánh (pages/info/branch.html?id=...): danh sách cửa hàng bên trái, bản đồ bên phải.
// Bấm tên một chi nhánh để mở thông tin (địa chỉ, điện thoại, giờ mở cửa, nút "Tìm đường") và đưa bản đồ tới chi nhánh đó.

class BranchPage {
    // selected: id chi nhánh đang mở (đọc từ ?id=, sai thì dùng chi nhánh đầu tiên).
    constructor() {
        const id = parseInt(new URLSearchParams(location.search).get("id"), 10);
        this.selected = STORES.some(s => s.id === id) ? id : STORES[0].id;
    }

    // Địa chỉ iframe Google Maps (không cần khóa API) đặt ghim tại toạ độ chi nhánh.
    mapURL(s) {
        return `https://www.google.com/maps?q=${s.lat},${s.lng}&z=16&hl=vi&output=embed`;
    }

    // Đường dẫn chỉ đường tới chi nhánh trên Google Maps (mở tab mới).
    directionsURL(s) {
        return `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;
    }

    // HTML một chi nhánh: tên (bấm để mở); chi nhánh đang chọn hiện thêm địa chỉ, điện thoại, giờ mở cửa và nút "Tìm đường".
    itemHTML(s) {
        const open = s.id === this.selected;
        const detail = open ? `
            <div class="branch-detail">
                <p>${Icons.get("pin")}<span>${s.address}</span></p>
                <p>${Icons.get("phone")}<span>${s.phone}</span></p>
                <p>${Icons.get("clock")}<span>${s.hours}</span></p>
                <a class="btn btn-outline branch-route" href="${this.directionsURL(s)}" target="_blank" rel="noopener"><span>Tìm đường</span>${Icons.get("arrowRight")}</a>
            </div>` : "";
        return `
            <div class="branch-item ${open ? "open" : ""}">
                <button type="button" class="branch-name" onclick="branchPage.select(${s.id})">${s.name}</button>
                ${detail}
            </div>`;
    }

    // Vẽ khung bên trái (tiêu đề, số cửa hàng, hotline, danh sách) và bản đồ bên phải.
    render() {
        const current = STORES.find(s => s.id === this.selected);
        Utils.$("branch-panel").innerHTML = `
            <h1>HỆ THỐNG CHI NHÁNH</h1>
            <p class="branch-count"><strong>${STORES.length}</strong> cửa hàng</p>
            <p>Chăm sóc khách hàng: <strong>${SITE_CONTACT.care.tel}</strong></p>
            <div class="branch-list">${STORES.map(s => this.itemHTML(s)).join("")}</div>`;
        const map = Utils.$("branch-map");
        const url = this.mapURL(current);
        if (!map.firstElementChild) map.innerHTML = `<iframe title="Bản đồ ${current.name}" src="${url}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
        else map.firstElementChild.src = url;
    }

    // Chọn một chi nhánh: cập nhật địa chỉ trang và vẽ lại.
    select(id) {
        this.selected = id;
        history.replaceState(null, "", location.pathname + "?id=" + id);
        this.render();
    }
}

const branchPage = new BranchPage();
branchPage.render();
