// Danh sách cửa hàng (dữ liệu giả cho đồ án): thành phố, tên, địa chỉ, giờ mở cửa, điện thoại và toạ độ (lat, lng)
// để tính khoảng cách tới người dùng và hiện bản đồ.

const STORE_CITIES = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];

const STORES = [
    { id: 1, city: "Hà Nội", name: "Urban Vibe Bà Triệu", address: "120 Bà Triệu, Hai Bà Trưng, Hà Nội", hours: "09:00 - 22:00", phone: "0900 000 101", lat: 21.0136, lng: 105.8493 },
    { id: 2, city: "Hà Nội", name: "Urban Vibe Cầu Giấy", address: "235 Xuân Thủy, Cầu Giấy, Hà Nội", hours: "09:00 - 22:00", phone: "0900 000 102", lat: 21.0368, lng: 105.7826 },
    { id: 3, city: "Hà Nội", name: "Urban Vibe Royal City", address: "72A Nguyễn Trãi, Thanh Xuân, Hà Nội", hours: "09:30 - 22:00", phone: "0900 000 103", lat: 21.0030, lng: 105.8150 },
    { id: 4, city: "Hà Nội", name: "Urban Vibe Long Biên", address: "27 Cổ Linh, Long Biên, Hà Nội", hours: "09:30 - 22:00", phone: "0900 000 104", lat: 21.0245, lng: 105.8935 },
    { id: 5, city: "TP. Hồ Chí Minh", name: "Urban Vibe Nguyễn Trãi", address: "250 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh", hours: "09:00 - 22:00", phone: "0900 000 201", lat: 10.7685, lng: 106.6890 },
    { id: 6, city: "TP. Hồ Chí Minh", name: "Urban Vibe Phú Nhuận", address: "180 Phan Xích Long, Phú Nhuận, TP. Hồ Chí Minh", hours: "09:00 - 22:00", phone: "0900 000 202", lat: 10.8010, lng: 106.6890 },
    { id: 7, city: "TP. Hồ Chí Minh", name: "Urban Vibe Quận 7", address: "101 Tôn Dật Tiên, Quận 7, TP. Hồ Chí Minh", hours: "09:30 - 22:00", phone: "0900 000 203", lat: 10.7290, lng: 106.7190 },
    { id: 8, city: "TP. Hồ Chí Minh", name: "Urban Vibe Thủ Đức", address: "216 Võ Văn Ngân, Thủ Đức, TP. Hồ Chí Minh", hours: "09:30 - 21:30", phone: "0900 000 204", lat: 10.8500, lng: 106.7570 },
    { id: 9, city: "Đà Nẵng", name: "Urban Vibe Hùng Vương", address: "155 Hùng Vương, Hải Châu, Đà Nẵng", hours: "09:00 - 22:00", phone: "0900 000 301", lat: 16.0680, lng: 108.2180 },
    { id: 10, city: "Đà Nẵng", name: "Urban Vibe Sơn Trà", address: "40 Ngô Quyền, Sơn Trà, Đà Nẵng", hours: "09:00 - 21:30", phone: "0900 000 302", lat: 16.0720, lng: 108.2380 },
    { id: 11, city: "Hải Phòng", name: "Urban Vibe Lạch Tray", address: "88 Lạch Tray, Ngô Quyền, Hải Phòng", hours: "09:00 - 21:30", phone: "0900 000 401", lat: 20.8480, lng: 106.6890 },
    { id: 12, city: "Cần Thơ", name: "Urban Vibe Ninh Kiều", address: "52 Trần Phú, Ninh Kiều, Cần Thơ", hours: "09:00 - 21:30", phone: "0900 000 501", lat: 10.0410, lng: 105.7790 }
];
