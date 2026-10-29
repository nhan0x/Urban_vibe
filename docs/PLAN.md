# Kế hoạch: tối ưu tốc độ và trải nghiệm Urban Vibe

Phương pháp: chia thành sprint nhỏ. Mỗi sprint có mục tiêu, việc cần làm, tiêu chí đạt (test) và kết quả đo được. Sprint chỉ được chốt khi test đạt, sau đó cập nhật [CLAUDE.md](../CLAUDE.md) và commit + push.

## Sprint 1: Đo baseline
**Mục tiêu:** có số liệu gốc để so sánh trước/sau.
- Chạy server local bằng Node (`npx serve .`).
- Đo Lighthouse mobile cho: trang chủ, danh sách sản phẩm, chi tiết sản phẩm, giỏ hàng.
- Ghi LCP, CLS, INP (hoặc TBT), tổng dung lượng, số request, ảnh lớn nhất.
- Đo thêm bằng Claude in Chrome: thời điểm DOMContentLoaded và load, số lỗi console.

**Tiêu chí đạt:** có bảng số liệu baseline trong mục "Kết quả" bên dưới; trang tải không lỗi console.

## Sprint 2: Tối ưu ảnh
**Mục tiêu:** giảm mạnh dung lượng ảnh, đặc biệt là ảnh PNG và ảnh lookbook.
- Tạo bản WebP song song cho ảnh trong `image/`, giữ nguyên file gốc.
  - Ảnh lookbook: resize về tối đa 1600px, chất lượng khoảng 80.
  - Ảnh sản phẩm: giữ kích thước phù hợp với khung hiển thị.
- Chuyển thẻ `<img>` sang `<picture>` có `<source type="image/webp">`, fallback là file gốc.
- Thêm `loading="lazy" decoding="async"` cho ảnh ngoài màn hình đầu.
- Ảnh banner đầu trang: `fetchpriority="high"`, không lazy.
- Thêm `width`/`height` hoặc `aspect-ratio` để tránh CLS.

**Tiêu chí đạt:** tổng dung lượng ảnh trang chủ giảm ít nhất 60%; LCP cải thiện so với baseline; không có ảnh bị vỡ (kiểm tra bằng Claude in Chrome).

### Kết quả Sprint 2 (đo lại 3 lần, lấy trung vị)

| Chỉ tiêu | Trước | Sau | Kết quả |
|---|---|---|---|
| Ảnh trang chủ (KB) | 2862 | 1116 | Giảm 61%, đạt |
| LCP trang chủ | 9.49 s | 8.40 s | Cải thiện, đạt |
| LCP danh sách | 10.34 s | 8.91 s | Cải thiện, đạt |
| LCP chi tiết | 16.70 s | 8.80 s | Cải thiện, đạt |
| LCP giỏ hàng | 2.11 s | 3.03 s | Tệ hơn, chưa đạt (chưa rõ nguyên nhân) |
| CLS chi tiết | 0.000 | 0.274 (2/3 lần) | Tệ hơn, chưa đạt (chưa rõ nguyên nhân) |
| CLS giỏ hàng | 0.003 | 0.070 | Tệ hơn, chưa đạt |
| Ảnh hỏng | — | 0 (kiểm tra DOM sau khi cuộn hết trang) | Đạt |

**Thay đổi:** WebP cho 355 ảnh (lookbook, slider và home nén lại ở 1200 px, chất lượng 75); lazy load cho ảnh dưới màn hình đầu; 4 thẻ đầu lưới sản phẩm tải ngay; popup khuyến mãi hiện sau khi trang tải xong; bỏ lazy ở thumbnail giỏ hàng.

**Chưa giải quyết:** CLS chi tiết và giỏ hàng tệ hơn trong Lighthouse, và LCP giỏ hàng cũng vậy. Thử bỏ lazy ở thumbnail chi tiết không làm CLS biến mất, nên nguyên nhân khác. Sẽ kiểm tra ở Sprint 3 (font và thứ tự tải script).

**Lỗi đo trước đó:** số liệu trang chi tiết trong baseline đo nhầm trang "không tìm thấy sản phẩm", vì server `serve` bỏ tham số `?id=`. Đã sửa bằng cấu hình `cleanUrls: false`. Số liệu trong bảng trên là đúng.

### Kết quả Sprint 2 (bản đầu, đã thay thế)
- Đã tạo WebP song song cho 355 file ảnh: 90.4 MB → 37.1 MB. File gốc giữ nguyên.
- Đã đổi 330 tham chiếu `.jpg/.png` sang `.webp` trong HTML/JS/CSS (đều có file tồn tại).
- Đã thêm `loading="lazy"` cho ảnh dưới màn hình đầu; 4 thẻ sản phẩm đầu của lưới tải ngay.
- Đã sửa popup khuyến mãi: hiện sau khi trang tải xong (1.5 s), thay vì 0.5 s.

| Trang | LCP trước → sau | Tổng dung lượng trước → sau | CLS trước → sau |
|---|---|---|---|
| Trang chủ | 9.8 s → 9.2 s | 3.3 MB → 1.8 MB | 0.008 → 0.009 |
| Danh sách | 10.5 s → 8.9–9.2 s | 11.8 MB → 2.4 MB | 0 → 0.001 đến 0.132 (dao động) |
| Giỏ hàng | 3.4 s → 4.4 s | 456 KB → 456 KB | 0.071 → 0.07 |

**Đánh giá:** tiêu chí "giảm ≥ 60% dung lượng ảnh trang chủ" chưa đạt rõ ràng (tổng trang giảm 44%, gồm cả JS/CSS/font). LCP chỉ cải thiện nhẹ. Nguyên nhân LCP cao không nằm ở dung lượng mà ở thời gian JS/CSS chiếm luồng chính (bootup ~1.5 s, style/layout ~0.8 s) và ở font tải từ CDN. Điều này thuộc Sprint 3. Giỏ hàng LCP tăng từ 3.4 lên 4.4 s, có thể do dao động đo; cần đo lại nhiều lần.

Trên Chrome thật (không giả lập throttling), trang chủ tải xong sau khoảng 0.86 s, nên số LCP cao là kết quả của giả lập mobile.

## Sprint 3: Tối ưu script và font
**Mục tiêu:** trang vào nhanh hơn, không tải code thừa.
- Thêm `defer` cho các script không chặn render, giữ đúng thứ tự phụ thuộc (xem CLAUDE.md).
- Chỉ tải script của trang đang mở (ví dụ `home.js` chỉ ở trang chủ).
- Kiểm tra `mock-data.js`: nếu không dùng thì bỏ khỏi trang.
- Giảm font: bỏ các cỡ và trọng số không dùng; `font-display: swap`.
- Kiểm tra font Font Awesome: nếu chỉ dùng vài icon thì cân nhắc thay bằng SVG có sẵn trong `icons.js`.

**Tiêu chí đạt:** số script đồng bộ trên trang chủ giảm; LCP và TBT cải thiện; mọi chức năng (menu, giỏ hàng, yêu thích, tìm kiếm) vẫn chạy đúng.

## Sprint 4: Trải nghiệm mượt (UX)
**Mục tiêu:** người dùng thấy trang phản hồi ngay, không bị giật.
- Skeleton hoặc khung giữ chỗ cho danh sách sản phẩm khi đang tải.
- Transition nhẹ (`transform`, `opacity`) cho hover, mở menu, ngăn kéo giỏ hàng.
- Phản hồi ngay khi bấm "Thêm vào giỏ": đổi trạng thái nút, cập nhật số lượng giỏ không cần tải lại.
- Tránh layout nhảy khi popup hoặc banner xuất hiện.
- Kiểm tra trên màn hình điện thoại (375px): không cuộn ngang, nút đủ lớn để bấm.

**Tiêu chí đạt:** CLS < 0.1 trên các trang chính; INP < 200 ms khi thêm vào giỏ; không có lỗi console khi dùng các luồng chính.

## Sprint 5: Kiểm thử tổng thể và báo cáo
**Mục tiêu:** chốt số liệu trước/sau để đưa vào báo cáo.
- Đo lại Lighthouse cho cùng bốn trang như Sprint 1.
- Quay video demo các luồng: vào trang, tìm sản phẩm, xem chi tiết, thêm giỏ, thanh toán.
- Viết bảng so sánh trước/sau vào mục "Kết quả".

**Tiêu chí đạt:** các luồng chính chạy trơn tru; bảng so sánh đầy đủ.

## Checklist luồng cần kiểm tra mỗi sprint
- [ ] Trang chủ tải, banner và menu hoạt động.
- [ ] Danh sách sản phẩm: hiển thị, lọc/sắp xếp (nếu có).
- [ ] Chi tiết sản phẩm: chọn size/màu, thêm giỏ.
- [ ] Giỏ hàng: tăng/giảm số lượng, xóa, tổng tiền đúng.
- [ ] Yêu thích: thêm và bỏ.
- [ ] Không có lỗi đỏ trong console.

## Kết quả

### Baseline (Sprint 1)
Đo bằng Lighthouse, mobile, headless Chrome, server `npx serve`. Ngày 2026-10-29.

| Trang | Điểm | LCP | CLS | TBT | Tổng dung lượng |
|---|---|---|---|---|---|
| Trang chủ (`index.html`) | 0.73 | 9.8 s | 0.008 | 0 ms | 3.3 MB |
| Danh sách (`pages/shop/products.html`) | 0.70 | 10.5 s | 0 | 0 ms | 11.8 MB |
| Chi tiết (`pages/shop/product.html?id=1`) | 0.96 | 2.2 s | 0 | 0 ms | 462 KB |
| Giỏ hàng (`pages/shop/cart.html`) | 0.89 | 3.4 s | 0.071 | 0 ms | 456 KB |

Nhận xét: trang danh sách và trang chủ có LCP rất cao, nguyên nhân chính là ảnh. Trang chi tiết đã nhẹ hơn nhiều. Chưa kiểm tra console và INP (sẽ bổ sung khi chạy Claude in Chrome).

### Sau tối ưu (Sprint 5)
_Chưa đo._
