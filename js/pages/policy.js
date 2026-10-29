// Trang chính sách (pages/info/policy.html?p=sale|privacy|international|refund|shipping|payment).
// Nội dung lấy từ POLICIES (js/data/info-pages.js): dạng bảng (chính sách bán hàng) hoặc dạng các mục có tiêu đề.

class PolicyPage {
    // Chính sách đang xem theo ?p=...; sai hoặc thiếu thì dùng "sale".
    constructor() {
        const key = new URLSearchParams(location.search).get("p");
        this.key = POLICIES[key] ? key : "sale";
        this.policy = POLICIES[this.key];
    }

    // HTML dạng bảng: hàng tiêu đề (ONLINE / OFFLINE) và từng hàng nội dung. Hàng chỉ có 1 cột nội dung thì gộp ô.
    tableHTML(t) {
        const head = t.head.map(h => `<th>${h}</th>`).join("");
        const rows = t.rows.map(([label, online, offline]) => {
            const lines = list => list.map(x => `<span>${x}</span>`).join("");
            const cells = offline
                ? `<td>${lines(online)}</td><td>${lines(offline)}</td>`
                : `<td colspan="2">${lines(online)}</td>`;
            return `<tr><th scope="row">${label}</th>${cells}</tr>`;
        }).join("");
        return `<div class="policy-table-wrap"><table class="policy-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }

    // HTML dạng các mục: tiêu đề nhỏ + các đoạn văn.
    sectionsHTML(list) {
        return `<div class="policy-sections">${list.map(s => `
            <section>
                <h2>${s.heading}</h2>
                ${s.paragraphs.map(p => `<p>${p}</p>`).join("")}
            </section>`).join("")}</div>`;
    }

    // Vẽ trang: đổi tiêu đề, đường dẫn và nội dung theo chính sách đang chọn.
    render() {
        document.title = this.policy.title + " - Urban Vibe";
        Utils.$("policy-title").textContent = this.policy.title;
        Utils.$("policy-crumb").textContent = this.policy.title;
        Utils.$("policy-root").innerHTML = this.policy.table ? this.tableHTML(this.policy.table) : this.sectionsHTML(this.policy.sections);
    }
}

new PolicyPage().render();
