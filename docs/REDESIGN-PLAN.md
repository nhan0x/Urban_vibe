# Plan: refactor giao diện Urban Vibe theo bố cục owen.vn

Mục tiêu: dựng lại toàn bộ giao diện bằng HTML/CSS/JS thuần theo bố cục, khung card và animation của https://owen.vn/.
Giữ nguyên: thương hiệu Urban Vibe (logo, tên, nội dung chữ), dữ liệu sản phẩm, logic giỏ hàng / yêu thích / tài khoản (localStorage), ảnh trong `image/`.
Không sao chép: logo OWEN, chữ, ảnh của owen.vn. Font SVN-Gilroy là font thương mại nên dùng Poppins (đã có, hỗ trợ tiếng Việt, cùng kiểu hình học).
Ảnh còn thiếu: ưu tiên dùng ảnh có sẵn (lookbook, slider, ảnh sản phẩm). Chỉ khi thật sự thiếu mới lấy từ elise.vn/elise-urban, và ghi rõ file nào lấy ở đâu.

## Ghi chú khảo sát owen.vn (2026-10-30)

**Tổng thể**
- Nền trắng, chữ #323232, font hình học (Gilroy). Khung nội dung tối đa ~1306 px, căn giữa.
- Màu nhấn: đen #000 (header, nút chính), đỏ giảm giá #db2c38, xanh navy cho nút CTA trên banner.
- Nút nổi bên phải: 2 ô vuông bo góc màu đen (Messenger, Zalo) xếp dọc.

**Header** (cao 72 px, nền đen, dính trên cùng khi cuộn)
- Trái: logo chữ trắng. Giữa-trái: menu ngang chữ trắng 14px/600, mục có mũi tên xuống.
- Rê vào mục có menu con: mega menu nền xám đậm #2b2b2b phủ hết chiều ngang, 2 cột link bên trái, ảnh banner bên phải.
- Phải: 3 nút icon (tìm kiếm, tài khoản, giỏ hàng) dạng ô vuông bo 8px, viền trắng mờ.

**Trang chủ** (theo thứ tự)
1. Slider chính: ảnh bo góc 12px, cách lề, mũi tên tròn mờ hai bên, chấm tròn bên dưới, tự chạy.
2. 4 ô danh mục dọc (tỉ lệ ~3:4.5): tiêu đề chữ in hoa góc trên phải, nút "TRẢI NGHIỆM NGAY" nền navy ở đáy giữa.
3. Banner lớn trong khung viền xám bo góc (bản gốc là video, mình dùng ảnh lookbook).
4. Slider thứ hai (banner cam kết dịch vụ).
5. Blog: nền tối gradient, 3 thẻ (1 lớn + 2 nhỏ), ảnh trên, tiêu đề in hoa, ngày, "Xem chi tiết →".
6. Đăng ký nhận khuyến mãi: 2 nửa ảnh, thẻ kính mờ (glass) chứa tiêu đề, ô email, nút viền.
7. Footer: nền ảnh mờ tối, logo + thông tin công ty, 3 cột link (tiêu đề gạch chân chữ đầu), mạng xã hội, phương thức thanh toán.

**Trang danh mục**
- Banner danh mục full width, thẻ kính mờ góc dưới trái (tên danh mục + mô tả).
- Nền xám nhạt #f5f5f5. Breadcrumb chữ in hoa nhỏ.
- Hàng nút pill danh mục (viền xám, mục đang chọn nền đen chữ trắng).
- Cột lọc bên trái (thẻ trắng bo góc): nhóm có thể thu gọn, ô checkbox, lưới ô size 3 cột.
- Khu sản phẩm (thẻ trắng bo góc): thanh trên có nút thu gọn bộ lọc, số sản phẩm, nút đổi lưới 3/4 cột. Lưới 3 cột.

**Card sản phẩm**
- Ảnh nền xám #f2f2f2 bo 8px, tỉ lệ 3:4.
- Góc trên trái: nhãn giảm giá pill đỏ "-18%". Góc trên phải: nút tim tròn xám mờ.
- Rê chuột: nút "Mua ngay" đen bo 6px trượt lên ở đáy ảnh; ảnh đổi sang ảnh thứ 2.
- Dưới ảnh: chấm màu tròn, tên in hoa 16px/600, giá gốc gạch đỏ + giá bán, dòng nhãn phụ (chỉ có online, tích điểm).

**Trang chi tiết**
- Breadcrumb. Trái: ảnh chính bo góc + cột thumbnail dọc bên phải ảnh. Phải: tên in hoa, mã SP, giá, tích điểm, màu, size dạng ô xám, banner ưu đãi, nút "Thêm vào giỏ hàng" đen full width, accordion (Mô tả, Giao hàng / đổi hàng).
- Dưới: "CÓ THỂ BẠN THÍCH" carousel 4 card, mũi tên vuông xám.

## Sprint

Mỗi sprint: làm xong → kiểm tra (ảnh chụp so với owen.vn ở desktop 1440 và mobile 375, không lỗi console, không cuộn ngang, luồng giỏ hàng / yêu thích / đăng nhập vẫn chạy) → commit + push → ghi kết quả vào mục "Kết quả" bên dưới.

### R1. Nền tảng + header + footer
- Biến thiết kế mới trong `css/base/base.css` (màu, bo góc, khung 1306 px, khoảng cách).
- Header đen dính trên cùng, menu ngang, mega menu có ảnh, 3 nút icon vuông. Menu trượt trên mobile giữ lại.
- Footer nền ảnh mờ, 4 cột. Nút nổi Messenger / Zalo.
- Test: header, mega menu, footer đúng trên mọi trang; badge giỏ hàng / yêu thích, nút tài khoản (hiện tên khi đăng nhập) vẫn chạy.

### R2. Trang chủ
- Slider chính, 4 ô danh mục, banner lớn có khung, slider cam kết, blog nền tối, khối đăng ký kính mờ.
- Animation: slider trượt + tự chạy, hover ô danh mục (ảnh phóng nhẹ), hiện dần khi cuộn tới.
- Test: slider chạy, nút mũi tên / chấm, không CLS lớn, mobile 1 cột / cuộn ngang ô danh mục.

### R3. Card sản phẩm + trang danh mục
- Viết lại `product-card.js` + CSS theo card owen (giữ API `ProductCard.html` / `renderInto`).
- Trang danh sách: banner danh mục, breadcrumb, pill danh mục, cột lọc (size, giá), thanh công cụ, lưới 3/4 cột, phân trang.
- Test: lọc, sắp xếp, phân trang, tim, mua ngay vẫn chạy.

### R4. Trang chi tiết sản phẩm
- Gallery + thumbnail dọc, khối thông tin, chọn size, accordion, carousel "Có thể bạn thích".
- Test: đổi ảnh, chọn size, thêm giỏ, mua ngay, tim.

### R5. Các trang còn lại
- Giỏ hàng, thanh toán, yêu thích, bộ sưu tập, Black Friday, blog, tài khoản, đăng nhập, theo dõi đơn, trang thông tin: áp dụng biến thiết kế, nút, thẻ, breadcrumb mới.
- Test: mỗi trang mở được, không lỗi console, không cuộn ngang ở 375 px.

### R6. Kiểm thử tổng
- Chụp so sánh từng trang chính với owen.vn. Lighthouse 4 trang chính (không để tệ hơn số cuối trong `docs/PLAN.md`).
- Cập nhật `CLAUDE.md` (cấu trúc, quy ước mới).

## Kết quả

### R1 (đạt)
- Header đen 72px dính trên cùng, menu ngang (Hàng mới về, Collections, Sản phẩm, Black Friday, Hệ thống cửa hàng, Thông tin thương hiệu), mega menu xám đậm có ảnh, 4 nút icon vuông (tìm kiếm, tài khoản, yêu thích, giỏ hàng). Đã đăng nhập: ô tài khoản hiện chữ cái đầu của tên, từ 1280px hiện thêm tên.
- Footer nền ảnh mờ tối, 4 cột, tiêu đề gạch chân ngắn. Nút nổi Messenger / Zalo dạng ô vuông đen.
- Badge giỏ hàng / yêu thích chỉ hiện khi > 0.
- Test: 20 trang có header + footer, không cuộn ngang ở 375px (đã sửa tiêu đề Membership và toast), không lỗi console trên 7 trang đã mở, menu trượt mobile mở được.

### R2 (đạt)
- Trang chủ dựng lại theo owen.vn: slider chính (ảnh bo 8px trên dải nền xám, mũi tên tròn mờ, chấm, tự chạy 5 s, vuốt trên điện thoại) → 4 ô danh mục (Áo, Đầm, Chân váy, Quần) có tiêu đề góc trên phải và nút "TRẢI NGHIỆM NGAY" → banner lớn trong khung xám (ảnh lookbook phóng chậm thay cho video) → slider cam kết (Miễn phí vận chuyển, Đổi hàng 30 ngày, Sửa đồ miễn phí) → blog nền tối 3 thẻ viền trắng mờ → đăng ký nhận khuyến mãi với thẻ kính mờ.
- Bỏ khối sản phẩm 3 tab cũ vì owen.vn không có khối này ở trang chủ.
- Thêm `js/widgets/slider.js` + `css/components/slider.css` (dùng lại ở trang chi tiết). Hiệu ứng hiện dần khi cuộn (`.reveal`, xử lý trong `app.js`).
- Ảnh: tạo 4 ảnh ô danh mục 640×880 trong `image/home/` từ ảnh sản phẩm có sẵn; tạo lại WebP 1920px cho banner desktop (slider, lookbook). Không lấy ảnh từ elise.vn.
- Chuyển style thẻ blog dùng chung (`.blog-card`, `.blog-grid`) từ `home.css` cũ sang `info.css` để trang blog chi tiết không bị ảnh hưởng.
- Test: slider chạy (mũi tên, chấm, tự chạy), không cuộn ngang ở 375px, không lỗi console. Lighthouse mobile trang chủ: LCP 5.9–6.6 s (trước redesign 5.0 s), CLS 0–0.068.

### R3 (đạt)
- Card sản phẩm kiểu owen: ảnh 3:4 nền xám bo 8px, nhãn "-x%" đỏ (hoặc NEW / HOT), nút tim tròn xám mờ, nút "Mua ngay" đen trượt lên khi rê chuột (màn hình cảm ứng luôn hiện), chấm mẫu màu, tên in hoa 16px/600, giá gốc gạch đỏ + giá bán, nhãn "Chỉ có tại Online" và "Tích lũy x điểm". Giữ nguyên API `ProductCard.html` / `renderInto`.
- Trang danh mục: banner theo nhóm + thẻ kính mờ, đường dẫn in hoa, hàng nút pill, cột lọc (Nổi bật: hàng mới / bán chạy / đang giảm giá; Khoảng giá), thanh công cụ (thu gọn bộ lọc, số sản phẩm, sắp xếp, lưới 3/4 cột nhớ trong localStorage), phân trang 24 sản phẩm / trang.
- Không làm bộ lọc kích cỡ như owen vì dữ liệu sản phẩm không có size riêng, lọc sẽ không đổi kết quả.
- Test: lọc, bỏ lọc, sắp xếp giá tăng dần, lưới 4 cột, sang trang 2, ẩn / hiện bộ lọc, "Mua ngay" tăng giỏ hàng; 5 trang dùng card không cuộn ngang ở 375px; không lỗi console.

### R4 (đạt)
- Trang chi tiết theo owen: khung ~1060px, ảnh lớn 3:4 + cột ảnh nhỏ dọc cao bằng ảnh lớn (cuộn khi nhiều ảnh), tên in hoa + nút tim tròn, mã SP, giá + giá gốc đỏ, tích điểm, màu sắc, kích cỡ dạng ô xám, phiếu ưu đãi, số lượng + "Thêm vào giỏ hàng" đen + "Mua ngay" viền, accordion (Mô tả, Giao hàng / đổi hàng, Cửa hàng còn hàng), carousel "CÓ THỂ BẠN THÍCH" 4 thẻ (3 / 2 ở màn hình nhỏ) mũi tên vuông xám.
- Giữ "Mua ngay" và chọn số lượng (owen chỉ có nút thêm giỏ) vì là chức năng sẵn có của đồ án.
- Test: đổi ảnh, chọn size, tăng số lượng, thêm giỏ (badge tăng đúng số lượng), đóng / mở accordion, carousel trượt, tim (carousel vẽ lại không gắn sự kiện trùng), phóng to ảnh; mobile 375px không cuộn ngang.
