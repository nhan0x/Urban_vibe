// Trang FAQ (pages/info/faq.html): các nhóm câu hỏi thường gặp, đánh số liên tục trong từng nhóm.

class FaqPage {
    // Vẽ toàn bộ nhóm câu hỏi từ FAQ_GROUPS (js/data/info-pages.js).
    render() {
        Utils.$("faq-root").innerHTML = FAQ_GROUPS.map(group => `
            <section class="faq-group">
                <h2>${group.title}</h2>
                ${group.items.map(([q, a], i) => `
                    <div class="faq-item">
                        <h3>${i + 1}. ${q}</h3>
                        <p>${a}</p>
                    </div>`).join("")}
            </section>`).join("");
    }
}

new FaqPage().render();
