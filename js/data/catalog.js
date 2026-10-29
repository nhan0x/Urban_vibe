// Phân nhóm sản phẩm cho menu "Sản phẩm" và trang danh sách (pages/shop/products.html).
// Dữ liệu sản phẩm (products.js) không có trường "loại", nên nhóm được suy ra từ chữ đầu của tên sản phẩm.

// Mỗi nhóm: key (dùng trên địa chỉ ?c=...), label (tên hiển thị), test (tên sản phẩm có thuộc nhóm này không).
const CATALOG_CATEGORIES = [
    { key: "ao", label: "Áo", test: n => /^(ÁO|SM)(\s|$)/.test(n) && !/^ÁO GILE/.test(n) },
    { key: "ao-khoac", label: "Áo khoác", test: n => /^(VEST|BLAZER|BLAZE|GILE|ÁO GILE)(\s|$)/.test(n) },
    { key: "bo", label: "Bộ", test: n => /^SET(\s|$)/.test(n) },
    { key: "chan-vay", label: "Chân váy", test: n => /^(CV|CHÂN VÁY|JUPE)(\s|$)/.test(n) },
    { key: "dam", label: "Đầm", test: n => /^ĐẦM(\s|$)/.test(n) },
    { key: "quan", label: "Quần", test: n => /^QUẦN(\s|$)/.test(n) }
];

// Các cách sắp xếp ở trang danh sách: key, tên hiển thị, hàm so sánh (null = giữ thứ tự gốc).
const CATALOG_SORTS = [
    { key: "default", label: "Mới nhất", compare: null },
    { key: "price-asc", label: "Giá thấp nhất", compare: (a, b) => a.price - b.price },
    { key: "price-desc", label: "Giá cao nhất", compare: (a, b) => b.price - a.price },
    { key: "name", label: "Tên A - Z", compare: (a, b) => a.name.localeCompare(b.name, "vi") }
];

class Catalog {
    // Toàn bộ sản phẩm của cửa hàng (gồm cả sản phẩm thuộc các bộ sưu tập).
    static all() { return products; }

    // Sản phẩm thuộc một nhóm theo khoá ("ao", "dam"...). Khoá rỗng / không có thì trả tất cả.
    static byCategory(key) {
        const cat = CATALOG_CATEGORIES.find(c => c.key === key);
        if (!cat) return products;
        return products.filter(p => cat.test(p.name));
    }

    // Tìm theo tên (không phân biệt hoa thường và dấu).
    static search(text) {
        const kw = Utils.normalize(text.trim());
        if (!kw) return products;
        return products.filter(p => Utils.normalize(p.name).includes(kw));
    }

    // Sản phẩm đang giảm giá (có giá gốc cao hơn giá bán).
    static onSale() { return products.filter(p => Utils.getOriginalPrice(p) > 0); }

    // Sắp xếp một danh sách theo khoá trong CATALOG_SORTS (sắp trên bản sao để không đổi mảng gốc).
    static sort(list, key) {
        const sort = CATALOG_SORTS.find(s => s.key === key);
        if (!sort || !sort.compare) return list;
        return list.slice().sort(sort.compare);
    }
}
