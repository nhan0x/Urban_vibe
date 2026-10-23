// Định vị: lấy tọa độ của trình duyệt rồi đổi ra địa chỉ (reverse geocoding bằng OpenStreetMap Nominatim)
// để điền sẵn vào form giao hàng.

class GeoLocator {
    // Bỏ dấu, chữ thường, bỏ các tiền tố "Thành phố / Tỉnh" để so sánh tên tỉnh dễ hơn.
    static normalize(text) {
        return (text || "")
            .normalize("NFD").replace(/[̀-ͯ]/g, "")
            .replace(/đ/g, "d").replace(/Đ/g, "D")
            .toLowerCase()
            .replace(/thanh pho |tinh |city|province/g, "")
            .trim();
    }

    // Tìm tên tỉnh/thành trong danh sách PROVINCES khớp với tên Nominatim trả về (trả "" nếu không có).
    static matchProvince(name) {
        const target = GeoLocator.normalize(name);
        if (!target) return "";
        for (let i = 0; i < PROVINCES.length; i++) {
            if (GeoLocator.normalize(PROVINCES[i]) === target) return PROVINCES[i];
        }
        return "";
    }

    // Đổi tọa độ thành địa chỉ: { province, district, ward, address }.
    static async reverse(lat, lng) {
        const url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=vi&zoom=18&addressdetails=1"
            + "&lat=" + lat + "&lon=" + lng;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không tra được địa chỉ");
        const a = (await res.json()).address || {};
        const street = [a.house_number, a.road].filter(p => p).join(" ");
        return {
            province: GeoLocator.matchProvince(a.city || a.state || a.province),
            district: a.city_district || a.county || a.district || a.town || "",
            ward: a.suburb || a.quarter || a.neighbourhood || a.village || "",
            address: street
        };
    }

    // Hỏi trình duyệt vị trí hiện tại (Geolocation API) rồi đổi ra địa chỉ. Thành công thì gọi onSuccess(địa chỉ),
    // thất bại (từ chối quyền, quá hạn, mất mạng...) thì gọi onError(thông báo).
    static locate(onSuccess, onError) {
        if (!navigator.geolocation) {
            onError("Trình duyệt không hỗ trợ định vị");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            pos => {
                GeoLocator.reverse(pos.coords.latitude, pos.coords.longitude)
                    .then(onSuccess)
                    .catch(() => onError("Không tra được địa chỉ từ vị trí của bạn"));
            },
            () => onError("Không thể xác định vị trí của bạn"),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }
}
