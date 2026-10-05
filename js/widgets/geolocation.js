// Định vị: lấy tọa độ của trình duyệt rồi đổi thành địa chỉ (Nominatim / OpenStreetMap) để điền sẵn form giao hàng.

class GeoLocator {
    // Bỏ dấu, chữ thường, bỏ ký tự đặc biệt và tiền tố "Tỉnh" / "Thành phố" để so sánh tên tỉnh giữa hai nguồn dữ liệu.
    static normalize(text) {
        return String(text || "")
            .normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d")
            .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
            .replace(/^(tinh|thanh pho|tp) /, "")
            .replace(/ city$/, "");
    }

    // Tên gọi khác của vài thành phố lớn (OSM đôi khi trả tên cũ hoặc tên tiếng Anh).
    static ALIASES = { "sai gon": "ho chi minh", "saigon": "ho chi minh", "hue": "thua thien hue" };

    // Tìm tỉnh trong PROVINCES khớp với một trong các tên ứng viên. Không thấy thì trả chuỗi rỗng.
    static matchProvince(candidates) {
        for (const name of candidates) {
            let key = GeoLocator.normalize(name);
            if (!key) continue;
            key = GeoLocator.ALIASES[key] || key;
            const found = PROVINCES.find(p => GeoLocator.normalize(p) === key);
            if (found) return found;
        }
        return "";
    }

    // Hỏi trình duyệt vị trí hiện tại. Trả Promise có { latitude, longitude }; bị từ chối / quá hạn thì reject với thông báo tiếng Việt.
    static getPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) return reject(new Error("Trình duyệt không hỗ trợ định vị"));
            navigator.geolocation.getCurrentPosition(
                pos => resolve(pos.coords),
                err => {
                    let message = "Không thể xác định vị trí của bạn";
                    if (err.code === err.PERMISSION_DENIED) message = "Bạn chưa cho phép truy cập vị trí";
                    else if (err.code === err.TIMEOUT) message = "Xác định vị trí quá lâu, vui lòng thử lại";
                    reject(new Error(message));
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            );
        });
    }

    // Đổi tọa độ thành địa chỉ qua Nominatim. Trả { province, district, ward, address } (ô nào không có thì để rỗng).
    static async reverse(latitude, longitude) {
        const url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=vi"
            + `&lat=${latitude}&lon=${longitude}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không tra được địa chỉ từ vị trí này");
        const a = (await res.json()).address;
        if (!a) throw new Error("Không tra được địa chỉ từ vị trí này");

        const province = GeoLocator.matchProvince([a.state, a.province, a.city, a.region]);
        const districtCandidates = [a.city_district, a.county, a.district, a.town, a.city];
        const district = districtCandidates.find(d => d && d !== a.state && GeoLocator.normalize(d) !== GeoLocator.normalize(province)) || "";
        return {
            province,
            district,
            ward: a.suburb || a.quarter || a.neighbourhood || a.village || "",
            address: [a.house_number, a.road].filter(Boolean).join(" ")
        };
    }

    // Làm trọn một lượt: lấy vị trí rồi đổi ra địa chỉ.
    static async locate() {
        const coords = await GeoLocator.getPosition();
        return GeoLocator.reverse(coords.latitude, coords.longitude);
    }
}
