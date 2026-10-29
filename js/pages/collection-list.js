// Trang danh sách bộ sưu tập (pages/collection/collection.html): bộ sưu tập mới nhất là thẻ lớn, các bộ còn lại xếp 2 cột.

class CollectionList {
    // Địa chỉ trang chi tiết của một bộ sưu tập.
    url(c) { return "pages/collection/collection-detail.html?slug=" + c.slug; }

    // HTML một thẻ bộ sưu tập: ảnh 4:3, tên, ngày và thẻ hashtag kèm nút tim.
    cardHTML(c, large) {
        const date = this.shortDate(c);
        return `
            <article class="col-card ${large ? "col-card-large" : ""}">
                <a class="col-thumb" href="${this.url(c)}"><img src="${c.hero}" alt="${Utils.escapeHTML(c.title)}" loading="lazy"></a>
                <h3 class="col-name"><a href="${this.url(c)}">${c.title}</a></h3>
                <p class="col-date">${date}</p>
                <div class="col-meta">
                    <p class="col-tag">#collection</p>
                    <button type="button" class="blog-like" onclick="Blog.like(this)" aria-label="Thích">${Icons.get("heart")}</button>
                </div>
            </article>`;
    }

    // Ngày hiển thị dạng dd/mm/yyyy suy ra từ chuỗi "October 2026" trong dữ liệu (lấy ngày 05 của tháng đó).
    shortDate(c) {
        const months = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
        const [month, year] = c.date.split(" ");
        return "05/" + String(months[month] || 1).padStart(2, "0") + "/" + year;
    }

    // Vẽ danh sách: bộ đầu tiên là thẻ lớn, các bộ còn lại trong lưới 2 cột.
    render() {
        const [first, ...rest] = collections;
        Utils.$("collection-list").innerHTML = `
            ${this.cardHTML(first, true)}
            <div class="col-grid">${rest.map(c => this.cardHTML(c, false)).join("")}</div>`;
    }
}

new CollectionList().render();
