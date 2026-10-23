// Dữ liệu nhân viên, ảnh Snap và thứ tự xếp hạng nhân viên.

// Danh sách nhân viên: id, tên, chiều cao (cm), cửa hàng, ảnh đại diện, viewOrder (thứ hạng lượt xem, số nhỏ = nhiều lượt xem).
const STAFF = [
    {"id":131201,"name":"Nguyễn Thị Hằng Nhi","height":170,"location":"Urban Vibe Biên Hòa 3","avatar":"image/staff/avatar-131201.jpg","viewOrder":2},
    {"id":131183,"name":"Huỳnh Thị Thu Nhung","height":165,"location":"Urban Vibe Thanh Hoá 1","avatar":"image/staff/avatar-131183.jpg","viewOrder":1},
    {"id":131219,"name":"Phạm Mỹ Linh","height":158,"location":"Urban Vibe Nguyễn Gia Thiều","avatar":"image/staff/avatar-131219.jpg","viewOrder":7},
    {"id":131224,"name":"Huỳnh Thị Trâm Anh","height":156,"location":"Urban Vibe Bến Tre","avatar":"image/staff/avatar-131224.jpg","viewOrder":4},
    {"id":131222,"name":"Nguyễn Hồng Hạnh","height":160,"location":"Urban Vibe Hà Nam","avatar":"image/staff/avatar-131222.jpg","viewOrder":3},
    {"id":131225,"name":"Nguyễn Thị Kiều Oanh","height":158,"location":"Urban Vibe Phan Đăng Lưu","avatar":"image/staff/avatar-131225.jpg","viewOrder":16},
    {"id":131221,"name":"Nguyễn Thị Thủy","height":165,"location":"Urban Vibe Uông Bí","avatar":"image/staff/avatar-131221.jpg","viewOrder":5},
    {"id":131220,"name":"Nguyễn Thị Hồng Nhung","height":157,"location":"Urban Vibe Nam Định","avatar":"image/staff/avatar-131220.jpg","viewOrder":15},
    {"id":131212,"name":"Trần Thị Như Quỳnh","height":163,"location":"Urban Vibe Điện Biên Phủ, Đà Nẵng","avatar":"image/staff/avatar-131212.jpg","viewOrder":6},
    {"id":131210,"name":"Gia Quyen","height":155,"location":"Urban Vibe Lê Văn Sỹ","avatar":"image/staff/avatar-131210.jpg","viewOrder":12},
    {"id":131197,"name":"Phạm Minh Thư","height":155,"location":"Urban Vibe Củ Chi","avatar":"image/staff/avatar-131197.jpg","viewOrder":9},
    {"id":131217,"name":"Trần Hồng Hạnh","height":160,"location":"Urban Vibe Trần Duy Hưng","avatar":"image/staff/avatar-131217.jpg","viewOrder":8},
    {"id":131203,"name":"Hồ Thị Trúc Mai","height":158,"location":"Urban Vibe Long Thành","avatar":"image/staff/avatar-131203.jpg","viewOrder":18},
    {"id":131199,"name":"Mai Lê Như Quỳnh","height":155,"location":"Urban Vibe Trường Chinh","avatar":"image/staff/avatar-131199.jpg","viewOrder":10},
    {"id":131211,"name":"Trang Nguyen","height":165,"location":"Urban Vibe Nam Kỳ Khởi Nghĩa","avatar":"image/staff/avatar-131211.jpg","viewOrder":11},
    {"id":132028,"name":"Trần Anh Thư","height":160,"location":"Urban Vibe Hậu Giang, Quận 6","avatar":"image/staff/avatar-132028.jpg","viewOrder":13},
    {"id":131209,"name":"Ngọc Dâu","height":152,"location":"Urban Vibe Bạc Liêu","avatar":"image/staff/avatar-131209.jpg","viewOrder":14},
    {"id":131190,"name":"Lê Thị Diệu Hồng","height":165,"location":"Urban Vibe Royal","avatar":"","viewOrder":17},
    {"id":131218,"name":"Bùi Thanh Hoa","height":155,"location":"Urban Vibe Việt Trì","avatar":"image/staff/avatar-131218.jpg","viewOrder":19}
];

// Snap mới nhất (staffId liên kết tới id trong STAFF).
const SNAPS_LATEST = [
    {"id":69356194,"staffId":131201,"image":"image/staff/snap-69356194.jpg"},
    {"id":69356531,"staffId":131201,"image":"image/staff/snap-69356531.jpg"},
    {"id":69356934,"staffId":131201,"image":"image/staff/snap-69356934.jpg"},
    {"id":69357380,"staffId":131201,"image":"image/staff/snap-69357380.jpg"},
    {"id":69357806,"staffId":131201,"image":"image/staff/snap-69357806.jpg"},
    {"id":69357941,"staffId":131201,"image":"image/staff/snap-69357941.jpg"},
    {"id":69358136,"staffId":131201,"image":"image/staff/snap-69358136.jpg"},
    {"id":69358511,"staffId":131201,"image":"image/staff/snap-69358511.jpg"},
    {"id":69359092,"staffId":131201,"image":"image/staff/snap-69359092.jpg"},
    {"id":69263045,"staffId":131201,"image":"image/staff/snap-69263045.jpg"},
    {"id":69262798,"staffId":131201,"image":"image/staff/snap-69262798.jpg"},
    {"id":69262511,"staffId":131201,"image":"image/staff/snap-69262511.jpg"},
    {"id":69261093,"staffId":131201,"image":"image/staff/snap-69261093.jpg"},
    {"id":69276435,"staffId":131201,"image":"image/staff/snap-69276435.jpg"},
    {"id":69276679,"staffId":131201,"image":"image/staff/snap-69276679.jpg"}
];
// Snap phổ biến.
const SNAPS_POPULAR = [
    {"id":69356194,"staffId":131201,"image":"image/staff/snap-69356194.jpg"},
    {"id":69356531,"staffId":131201,"image":"image/staff/snap-69356531.jpg"},
    {"id":69356934,"staffId":131201,"image":"image/staff/snap-69356934.jpg"},
    {"id":69358136,"staffId":131201,"image":"image/staff/snap-69358136.jpg"},
    {"id":69261093,"staffId":131201,"image":"image/staff/snap-69261093.jpg"},
    {"id":69277348,"staffId":131201,"image":"image/staff/snap-69277348.jpg"},
    {"id":69357380,"staffId":131201,"image":"image/staff/snap-69357380.jpg"},
    {"id":69262798,"staffId":131201,"image":"image/staff/snap-69262798.jpg"},
    {"id":69263045,"staffId":131201,"image":"image/staff/snap-69263045.jpg"},
    {"id":69357806,"staffId":131201,"image":"image/staff/snap-69357806.jpg"},
    {"id":69359092,"staffId":131201,"image":"image/staff/snap-69359092.jpg"},
    {"id":69262511,"staffId":131201,"image":"image/staff/snap-69262511.jpg"},
    {"id":69277455,"staffId":131201,"image":"image/staff/snap-69277455.jpg"},
    {"id":69277827,"staffId":131201,"image":"image/staff/snap-69277827.jpg"},
    {"id":69277919,"staffId":131201,"image":"image/staff/snap-69277919.jpg"}
];

// Thứ tự xếp hạng nhân viên: danh sách id theo hạng từ 1 trở đi.
const STAFF_RANKING = [131201,131183,131222,131224,131212,131221,131217,131225,131219,131197,131210,131209,131211,131199,132028];
