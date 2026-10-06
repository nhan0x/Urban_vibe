// Định vị: lấy tọa độ của trình duyệt rồi tìm cửa hàng gần nhất để gợi ý tỉnh/thành khi giao hàng.

// Danh sách cửa hàng (mảng object). province phải trùng đúng tên trong PROVINCES để chọn được trong ô tỉnh/thành.
const STORES = [
    { name: "Luna Hà Nội", province: "Thành phố Hà Nội", lat: 21.0285, lng: 105.8542 },
    { name: "Luna Hải Phòng", province: "Thành phố Hải Phòng", lat: 20.8449, lng: 106.6881 },
    { name: "Luna Đà Nẵng", province: "Thành phố Đà Nẵng", lat: 16.0544, lng: 108.2022 },
    { name: "Luna Hồ Chí Minh", province: "Thành phố Hồ Chí Minh", lat: 10.7769, lng: 106.7009 },
    { name: "Luna Cần Thơ", province: "Thành phố Cần Thơ", lat: 10.0452, lng: 105.7469 }
];

class GeoLocator {
    // Khoảng cách giữa hai tọa độ (tính gần đúng theo định lý Pythagoras, đủ để so sánh xa / gần).
    static distance(lat1, lng1, lat2, lng2) {
        const dLat = lat1 - lat2;
        const dLng = lng1 - lng2;
        return Math.sqrt(dLat * dLat + dLng * dLng);
    }

    // Duyệt mảng STORES, trả về cửa hàng có khoảng cách nhỏ nhất.
    static findNearestStore(lat, lng) {
        let nearest = STORES[0];
        let min = GeoLocator.distance(lat, lng, nearest.lat, nearest.lng);
        for (let i = 1; i < STORES.length; i++) {
            const d = GeoLocator.distance(lat, lng, STORES[i].lat, STORES[i].lng);
            if (d < min) {
                min = d;
                nearest = STORES[i];
            }
        }
        return nearest;
    }

    // Hỏi trình duyệt vị trí hiện tại (Geolocation API). Thành công thì gọi onSuccess(cửa hàng gần nhất),
    // thất bại (từ chối quyền, quá hạn...) thì gọi onError(thông báo).
    static locate(onSuccess, onError) {
        if (!navigator.geolocation) {
            onError("Trình duyệt không hỗ trợ định vị");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            pos => onSuccess(GeoLocator.findNearestStore(pos.coords.latitude, pos.coords.longitude)),
            () => onError("Không thể xác định vị trí của bạn")
        );
    }
}
