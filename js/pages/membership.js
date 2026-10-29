// Trang chính sách Membership (pages/info/membership.html): bảng quyền lợi 4 hạng thẻ, 4 thẻ minh hoạ và các ghi chú.
// Dữ liệu hạng thẻ nằm ở MEMBER_TIERS / MEMBER_NOTES (js/data/info-pages.js).

class MembershipPage {
    // Ô quyền lợi: true -> dấu chấm (có), false hoặc rỗng -> ô trống, còn lại là chữ (ví dụ "5%").
    cell(value) {
        if (value === true) return '<span class="member-dot"></span>';
        return value || "";
    }

    // Bảng quyền lợi: mỗi hạng một cột.
    tableHTML() {
        const row = (label, key, note) => `<tr><th scope="row">${label}${note ? `<sup>(${note})</sup>` : ""}</th>${MEMBER_TIERS.map(t => `<td>${this.cell(t[key])}</td>`).join("")}</tr>`;
        return `
            <div class="policy-table-wrap"><table class="member-table">
                <thead><tr><th>HẠNG THÀNH VIÊN<sup>(1)</sup></th>${MEMBER_TIERS.map(t => `<th>${t.name}</th>`).join("")}</tr></thead>
                <tbody>
                    ${row("Chỉ tiêu tích lũy trong năm", "spend", 2)}
                    ${row("Chính sách đổi hàng", "exchange", 3)}
                    ${row("Chính sách sửa đồ", "repair", 4)}
                    ${row("Miễn phí vận chuyển", "freeship", 5)}
                    ${row("Giảm giá hóa đơn", "invoice", 6)}
                    ${row("Ưu đãi sinh nhật", "birthday", 7)}
                </tbody>
            </table></div>`;
    }

    // Bốn thẻ thành viên xếp so le (vẽ bằng CSS).
    cardsHTML() {
        return `<div class="member-cards">${MEMBER_TIERS.map(t => `<div class="member-card member-card-${t.key}"><span>${t.name}</span><small>URBAN VIBE</small></div>`).join("")}</div>`;
    }

    // Các mục ghi chú (1) ... (7) bên dưới.
    notesHTML() {
        return MEMBER_NOTES.map(([title, paragraphs]) => `
            <div class="member-note"><h3>${title}</h3>${paragraphs.map(p => `<p>${p}</p>`).join("")}</div>`).join("");
    }

    // Vẽ cả trang.
    render() {
        Utils.$("membership-root").innerHTML = `
            <section class="member-hero">
                <div class="member-hero-inner">
                    <div class="member-hero-left">
                        <p class="member-kicker">CHÍNH SÁCH</p>
                        <h2 class="member-big">THÀNH VIÊN</h2>
                        ${this.tableHTML()}
                    </div>
                    ${this.cardsHTML()}
                </div>
            </section>
            <section class="page-container member-notes">${this.notesHTML()}</section>`;
    }
}

new MembershipPage().render();
