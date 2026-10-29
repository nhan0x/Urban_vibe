// Nội dung các trang thông tin: FAQ, chính sách (bán hàng, bảo mật, quốc tế, hoàn tiền, vận chuyển, thanh toán),
// chính sách Membership và danh sách việc làm. Các trang pages/info/*.html đọc dữ liệu ở đây để vẽ.

// ---------- FAQ: nhóm câu hỏi, mỗi câu là [câu hỏi, câu trả lời] ----------
const FAQ_GROUPS = [
    {
        title: "Đơn hàng",
        items: [
            ["Mất bao lâu đơn hàng của tôi sẽ được giao hàng?", "Đối với đơn hàng nội thành TP.HCM và Hà Nội khoảng 1-2 ngày bạn sẽ nhận được hàng. Đối với đơn hàng ngoại thành, tỉnh lẻ khoảng 3-4 ngày bạn sẽ nhận được hàng."],
            ["Sản phẩm của shop được gửi từ đâu?", "Các sản phẩm khi đặt hàng trên website của shop sẽ được gửi đi thông qua đơn vị vận chuyển giao hàng tiết kiệm từ kho hoặc cửa hàng gần địa chỉ nhận hàng của bạn nhất."],
            ["Bạn sẽ bổ sung các mặt hàng đã bán hết không?", "Các sản phẩm đã hết hàng nếu có hàng restock shop sẽ lập tức cập nhật số lượng lên website để bạn đặt hàng."],
            ["Tại sao đơn hàng của tôi bị trì hoãn?", "Có nhiều lý do khiến đơn hàng bị trì hoãn, rất tiếc vì sự cố không mong muốn này khi bạn đặt hàng tại shop. Hiện tại chúng tôi đã liên hệ với đơn vị vận chuyển để thúc giục đơn hàng của bạn được vận chuyển sớm nhất có thể."],
            ["Tôi có thể nhận được đơn đặt hàng trước một ngày nhất định không?", "Shop không chắc chắn ngày cụ thể bạn sẽ nhận được hàng, nhưng sẽ cố gắng xử lý đơn và bàn giao đơn hàng cho đơn vị vận chuyển để bạn nhận được hàng sớm nhất có thể."],
            ["Tại sao thông tin vận chuyển / tôi nhận được email đã gói hàng đã được giao nhưng tôi vẫn chưa nhận được?", "Urban Vibe rất tiếc vì sự cố không mong muốn này. Bạn vui lòng cho shop xin mã đơn hàng để shop hỗ trợ kiểm tra và liên hệ đơn vị vận chuyển kiểm tra đơn hàng của bạn."],
            ["Bạn có giảm bớt phí vận chuyển không?", "Hiện tại Urban Vibe đang có chương trình freeship cho đơn hàng đặt trực tiếp trên website. Bạn có thể đặt hàng trực tiếp tại website để được áp dụng freeship cho đơn hàng."]
        ]
    },
    {
        title: "Đổi trả & hoàn tiền",
        items: [
            ["Tôi có thể đổi sản phẩm đã mua không?", "Bạn có thể đổi sản phẩm trong vòng 5 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên tem mác, chưa qua sử dụng và có hóa đơn mua hàng hợp lệ. Mỗi đơn hàng được hỗ trợ đổi 1 lần."],
            ["Ai chịu phí vận chuyển khi đổi hàng?", "Nếu sản phẩm bị lỗi từ phía sản xuất hoặc shop giao sai mẫu, sai kích thước, Urban Vibe sẽ chịu toàn bộ phí. Với trường hợp đổi theo nhu cầu cá nhân, khách hàng chịu phí vận chuyển một chiều."],
            ["Bao lâu tôi sẽ nhận lại được tiền hoàn?", "Sau khi tiếp nhận và kiểm tra sản phẩm hoàn, tiền sẽ được hoàn về tài khoản của bạn trong vòng 3-7 ngày làm việc tùy ngân hàng."]
        ]
    },
    {
        title: "Tài khoản & thành viên",
        items: [
            ["Làm sao để đăng ký tài khoản?", "Bạn bấm nút \"Đăng nhập\" ở góc phải màn hình, chọn \"Tạo tài khoản\" và điền họ tên, email, số điện thoại cùng mật khẩu. Tài khoản được tạo ngay sau khi bạn gửi thông tin."],
            ["Tôi quên mật khẩu thì phải làm sao?", "Bạn vui lòng liên hệ hotline chăm sóc khách hàng 0775 665 912 để được hỗ trợ đặt lại mật khẩu."],
            ["Chính sách thành viên có những hạng nào?", "Urban Vibe có 4 hạng thành viên: Economy, VIP, Premium và Platinum. Hạng được xét theo tổng chi tiêu tích lũy trong năm. Xem chi tiết tại trang Membership."]
        ]
    }
];

// ---------- Chính sách ----------
// Mỗi trang chính sách: title, và một trong hai dạng nội dung:
//   table   : bảng [nhãn, nội dung chung] hoặc [nhãn, nội dung ONLINE, nội dung OFFLINE];
//   sections: danh sách { heading, paragraphs[] }.
const POLICIES = {
    sale: {
        title: "Chính sách bán hàng",
        table: {
            head: ["", "ONLINE", "OFFLINE"],
            rows: [
                ["Điều kiện đổi hàng", ["Sản phẩm còn nguyên tem mác, chưa qua sử dụng, sửa chữa và không bị dơ bẩn, hư hỏng.", "Khách hàng cần cung cấp hóa đơn mua hàng hợp lệ khi thực hiện đổi hàng.", "Thời gian đổi hàng kể từ khi nhận được sản phẩm: 5 ngày."]],
                ["Cách thức đổi hàng", ["Liên hệ bộ phận CSKH qua hotline 0775.665.912 hoặc nhắn tin qua fanpage để được hỗ trợ đổi hàng.", "Hỗ trợ đổi hàng mua tại Facebook, Instagram, website ở bất kỳ cửa hàng nào của shop."], ["Quý khách hàng có thể đổi sản phẩm ở bất kì cửa hàng nào của shop sau 12:00PM mỗi ngày."]],
                ["Giá trị hàng hoán đổi", ["Chỉ áp dụng khi sản phẩm muốn đổi có giá lớn hơn hoặc bằng sản phẩm đã mua.", "Trường hợp giá sản phẩm đổi mới thấp hơn sản phẩm cũ, shop không hỗ trợ hoàn trả lại tiền chênh lệch."]],
                ["Chính sách đổi", ["Mỗi đơn hàng chỉ hỗ trợ đổi 1 lần.", "Shop không có chính sách trả hàng.", "Chính sách đổi hàng không áp dụng đối với phụ kiện, hàng sale."]],
                ["Phí ship đổi hàng", ["Đối với hàng bị lỗi từ phía sản xuất, shop giao sai mẫu, sai kích thước: miễn phí.", "Đổi hàng theo nhu cầu cá nhân: khách hàng chịu phí vận chuyển một chiều, Urban Vibe hỗ trợ phí vận chuyển một chiều còn lại."], ["Quý khách hàng có thể đổi sản phẩm ở bất kì cửa hàng nào của shop."]],
                ["Lưu ý", ["Các sản phẩm mua qua sàn thương mại điện tử (TikTok, Shopee) không áp dụng đổi hàng tại cửa hàng.", "Quý khách vui lòng không gửi hàng khi chưa có sự xác nhận của bộ phận CSKH của shop. Nếu xảy ra sự cố dẫn đến mất sản phẩm shop hoàn toàn không chịu trách nhiệm."]]
            ]
        }
    },
    privacy: {
        title: "Chính sách bảo mật",
        sections: [
            { heading: "1. Mục đích thu thập thông tin", paragraphs: ["Urban Vibe thu thập thông tin của khách hàng (họ tên, số điện thoại, email, địa chỉ nhận hàng) nhằm xử lý đơn hàng, chăm sóc khách hàng và gửi các thông tin ưu đãi khi bạn đồng ý nhận."] },
            { heading: "2. Phạm vi sử dụng thông tin", paragraphs: ["Thông tin chỉ được dùng cho các hoạt động của Urban Vibe và các đơn vị vận chuyển, thanh toán cần thiết để hoàn tất đơn hàng của bạn. Chúng tôi không bán hay chia sẻ thông tin cá nhân cho bên thứ ba vì mục đích thương mại."] },
            { heading: "3. Thời gian lưu trữ", paragraphs: ["Thông tin cá nhân được lưu trữ cho đến khi khách hàng có yêu cầu hủy bỏ hoặc tự đăng nhập và thực hiện hủy bỏ. Trong mọi trường hợp, thông tin sẽ được bảo mật trên máy chủ của Urban Vibe."] },
            { heading: "4. Cam kết bảo mật", paragraphs: ["Urban Vibe áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ dữ liệu khỏi truy cập trái phép, mất mát hoặc tiết lộ ngoài ý muốn."] },
            { heading: "5. Quyền của khách hàng", paragraphs: ["Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân bằng cách liên hệ hotline 0775 665 912 hoặc email cskh@urbanvibe.vn."] }
        ]
    },
    international: {
        title: "Chính sách quốc tế",
        sections: [
            { heading: "1. Phạm vi giao hàng", paragraphs: ["Urban Vibe hiện hỗ trợ giao hàng đến một số quốc gia và vùng lãnh thổ. Vui lòng liên hệ bộ phận chăm sóc khách hàng để biết danh sách cụ thể và báo giá vận chuyển."] },
            { heading: "2. Thuế và phí hải quan", paragraphs: ["Đơn hàng quốc tế có thể phát sinh thuế nhập khẩu và phí hải quan theo quy định của nước nhận. Khách hàng chịu trách nhiệm thanh toán các khoản phí này."] },
            { heading: "3. Đổi trả đơn hàng quốc tế", paragraphs: ["Đơn hàng quốc tế không áp dụng đổi trả trừ trường hợp sản phẩm bị lỗi do nhà sản xuất hoặc giao sai mẫu. Vui lòng liên hệ CSKH trong vòng 3 ngày kể từ khi nhận hàng."] }
        ]
    },
    refund: {
        title: "Chính sách hoàn tiền",
        sections: [
            { heading: "1. Trường hợp được hoàn tiền", paragraphs: ["Sản phẩm bị lỗi do nhà sản xuất mà shop không còn sản phẩm thay thế.", "Đơn hàng đã thanh toán trước nhưng bị hủy do hết hàng hoặc không thể giao đến địa chỉ của bạn."] },
            { heading: "2. Thời gian hoàn tiền", paragraphs: ["Sau khi tiếp nhận và kiểm tra, tiền được hoàn trong vòng 3-7 ngày làm việc tùy theo ngân hàng hoặc ví điện tử của bạn."] },
            { heading: "3. Hình thức hoàn tiền", paragraphs: ["Tiền được hoàn về đúng phương thức thanh toán ban đầu. Với đơn thanh toán khi nhận hàng (COD), shop sẽ hoàn qua chuyển khoản theo thông tin bạn cung cấp."] }
        ]
    },
    shipping: {
        title: "Chính sách vận chuyển và giao nhận",
        sections: [
            { heading: "1. Phạm vi giao hàng", paragraphs: ["Urban Vibe giao hàng toàn quốc thông qua các đơn vị vận chuyển uy tín."] },
            { heading: "2. Thời gian giao hàng", paragraphs: ["Nội thành TP.HCM và Hà Nội: 1-2 ngày làm việc.", "Ngoại thành và các tỉnh thành khác: 3-4 ngày làm việc."] },
            { heading: "3. Phí vận chuyển", paragraphs: ["Miễn phí vận chuyển cho đơn hàng đặt trực tiếp trên website urbanvibe.vn. Các đơn hàng khác áp dụng mức phí theo từng đơn vị vận chuyển."] },
            { heading: "4. Kiểm tra hàng khi nhận", paragraphs: ["Khách hàng được kiểm tra ngoại quan sản phẩm khi nhận hàng. Nếu có sai sót, vui lòng liên hệ ngay hotline để được hỗ trợ."] }
        ]
    },
    payment: {
        title: "Phương thức thanh toán",
        sections: [
            { heading: "1. Thanh toán khi nhận hàng (COD)", paragraphs: ["Bạn thanh toán bằng tiền mặt cho nhân viên giao hàng khi nhận được sản phẩm."] },
            { heading: "2. Chuyển khoản ngân hàng", paragraphs: ["Bạn chuyển khoản theo thông tin hiển thị khi đặt hàng. Đơn hàng được xử lý sau khi shop nhận được thanh toán."] },
            { heading: "3. Thẻ ATM nội địa, Visa, Mastercard", paragraphs: ["Hỗ trợ thanh toán trực tuyến an toàn qua cổng thanh toán. Urban Vibe không lưu trữ thông tin thẻ của khách hàng."] }
        ]
    }
};

// ---------- Membership ----------
// Bốn hạng thẻ: tên, mức chi tiêu tích lũy trong năm, và các quyền lợi (true/false hoặc phần trăm).
const MEMBER_TIERS = [
    { key: "economy", name: "ECONOMY", spend: "< 5 triệu", exchange: true, repair: true, freeship: false, invoice: "", birthday: "" },
    { key: "vip", name: "VIP", spend: "5 triệu", exchange: true, repair: true, freeship: false, invoice: "5%", birthday: "10%" },
    { key: "premium", name: "PREMIUM", spend: "15 triệu", exchange: true, repair: true, freeship: true, invoice: "10%", birthday: "20%" },
    { key: "platinum", name: "PLATINUM", spend: "45 triệu", exchange: true, repair: true, freeship: true, invoice: "15%", birthday: "30%" }
];

// Các mục giải thích bên dưới bảng Membership: [tiêu đề, danh sách đoạn].
const MEMBER_NOTES = [
    ["(1) Thẻ thành viên / Membership Card", ["• Thẻ thành viên được cấp phát theo từng năm, tương ứng với hạng thành viên của khách hàng tại thời điểm xét hạng. Khách hàng cần xuất trình thẻ thành viên hợp lệ khi mua sắm để được áp dụng các quyền lợi và ưu đãi theo hạng."]],
    ["(2) Chỉ tiêu tích lũy trong năm", ["• Tổng giá trị các đơn hàng đã thanh toán thành công (không tính đơn đã hủy hoặc hoàn trả) trong năm dương lịch."]],
    ["(3) Chính sách đổi hàng", ["• Áp dụng cho mọi hạng thành viên theo chính sách bán hàng của Urban Vibe."]],
    ["(4) Chính sách sửa đồ", ["• Hỗ trợ sửa đồ (lên lai, thu eo) miễn phí một lần cho mỗi sản phẩm mua tại cửa hàng."]],
    ["(5) Miễn phí vận chuyển", ["• Hạng Premium và Platinum được miễn phí vận chuyển cho mọi đơn hàng."]],
    ["(6) Giảm giá hóa đơn", ["• Áp dụng trực tiếp trên tổng giá trị hóa đơn, không áp dụng đồng thời với một số chương trình khuyến mãi khác."]],
    ["(7) Ưu đãi sinh nhật", ["• Áp dụng trong tháng sinh nhật của khách hàng, cho một hóa đơn trong tháng."]]
];

// ---------- Tuyển dụng ----------
// Mỗi việc làm: id, tên vị trí, nhóm, nơi làm việc, hình thức, mức lương, hạn nộp.
const JOB_GROUPS = ["Tất cả công việc", "Bán hàng", "Thiết kế", "Marketing", "Vận hành"];
const JOBS = [
    { id: 1, title: "Nhân viên bán hàng (Sales Associate)", group: "Bán hàng", place: "TP. Hồ Chí Minh", type: "Toàn thời gian", salary: "8 - 12 triệu", deadline: "30/11/2026" },
    { id: 2, title: "Cửa hàng phó", group: "Bán hàng", place: "Hà Nội", type: "Toàn thời gian", salary: "14 - 18 triệu", deadline: "15/12/2026" },
    { id: 3, title: "Nhà thiết kế thời trang (Fashion Designer)", group: "Thiết kế", place: "TP. Hồ Chí Minh", type: "Toàn thời gian", salary: "15 - 25 triệu", deadline: "20/12/2026" },
    { id: 4, title: "Chuyên viên Social Media", group: "Marketing", place: "TP. Hồ Chí Minh", type: "Toàn thời gian", salary: "10 - 15 triệu", deadline: "10/12/2026" },
    { id: 5, title: "Stylist / Content Creator", group: "Marketing", place: "Hà Nội", type: "Bán thời gian", salary: "6 - 10 triệu", deadline: "05/12/2026" },
    { id: 6, title: "Nhân viên kho vận", group: "Vận hành", place: "TP. Hồ Chí Minh", type: "Toàn thời gian", salary: "8 - 11 triệu", deadline: "25/11/2026" }
];
