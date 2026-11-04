// Bộ icon SVG nét mảnh dùng chung (viewBox 24x24, nét 1.6, đầu nét tròn).
// Dùng: Icons.get("chevronDown") hoặc Icons.get("heart", "icon-lg") -> chuỗi <svg> chèn thẳng vào HTML.

const ICON_PATHS = {
    cart: '<path d="M3 4h2.4l2.1 11h10.1l2-8H6.2"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
    chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
    chevronUp: '<path d="m6 14.5 6-6 6 6"/>',
    chevronRight: '<path d="m9.5 6 6 6-6 6"/>',
    chevronLeft: '<path d="m14.5 6-6 6 6 6"/>',
    arrowLeft: '<path d="M20 12H4"/><path d="m10 6-6 6 6 6"/>',
    arrowRight: '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    box: '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m4 7 8 4 8-4"/><path d="M12 11v10"/>',
    power: '<path d="M12 3v8"/><path d="M6.4 6.6a8 8 0 1 0 11.2 0"/>',
    phone: '<path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 4.2 2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.3a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.7" r="2.4"/>',
    chat: '<path d="M4 5h16v11H9l-4.5 4V16H4z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.9M6.4 6.5A16.6 16.6 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 4-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    sort: '<path d="M3 6h10M3 12h7M3 18h4"/><path d="M17 5v13"/><path d="m14 15 3 3 3-3"/>',
    filter: '<path d="M3 5h18l-7 8.5V20l-4-2v-4.5z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    truck: '<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.5L4 9"/><path d="M4 4v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.5L20 15"/><path d="M20 20v-5h-5"/>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    gift: '<rect x="3" y="8" width="18" height="4"/><path d="M5 12v8h14v-8M12 8v12"/><path d="M12 8c-2-3-6-3-5 0 .5 1.4 3 1 5 0zm0 0c2-3 6-3 5 0-.5 1.4-3 1-5 0z"/>',
    star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z"/>',
    share: '<circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8"/>',
    ruler: '<path d="m3 17 14-14 4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>'
};

// Icon có khung vẽ và độ dày nét riêng (khớp bộ icon của theciu.vn): viewBox, độ dày nét, tô đặc hay chỉ viền.
const ICON_SPECS = {
    search: { vb: 20, sw: 1.5, body: '<path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8M19 19l-6-6"/>' },
    bag: { vb: 20, sw: 1.5, body: '<path d="M3.347 6h13.306c.338 0 .673.062.98.183.308.12.58.296.801.515.22.218.383.475.476.753.093.277.114.568.063.853L17.5 16.456c-.128.708-.55 1.355-1.187 1.821-.639.467-1.452.723-2.293.723H5.98c-.842 0-1.655-.257-2.293-.723-.638-.467-1.06-1.113-1.187-1.821L1.027 8.304a1.7 1.7 0 0 1 .063-.853c.093-.278.255-.535.476-.753a2.35 2.35 0 0 1 .8-.515c.308-.12.643-.183.981-.183"/><path d="M6.478 9V4c0-.796.37-1.559 1.03-2.121S9.065 1 9.999 1s1.829.316 2.49.879c.66.562 1.03 1.325 1.03 2.121v5"/>' },
    heart: { vb: 20, sw: 1.5, body: '<path d="M17.504 10.65 10.008 19l-7.496-8.35a5.7 5.7 0 0 1-1.144-1.911 6.3 6.3 0 0 1-.366-2.266 6.2 6.2 0 0 1 .472-2.241 5.6 5.6 0 0 1 1.232-1.84 4.9 4.9 0 0 1 1.784-1.13 4.5 4.5 0 0 1 2.037-.23 4.6 4.6 0 0 1 1.949.708c.6.385 1.12.905 1.532 1.528a5.2 5.2 0 0 1 1.535-1.515 4.6 4.6 0 0 1 1.945-.698c.684-.08 1.375 0 2.03.235.656.234 1.26.619 1.778 1.128a5.6 5.6 0 0 1 1.228 1.835 6.249 6.249 0 0 1 .114 4.494 5.7 5.7 0 0 1-1.134 1.91"/>' },
    // Icon đặc (tô kín) cho cụm nút trên header đen: nhìn rõ hơn icon viền mảnh.
    searchSolid: { vb: 24, sw: 0, filled: true, body: '<path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"/>' },
    userSolid: { vb: 24, sw: 0, filled: true, body: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"/>' },
    heartSolid: { vb: 24, sw: 0, filled: true, body: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/>' },
    bagSolid: { vb: 24, sw: 0, filled: true, body: '<path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2"/>' },
    bloom: { vb: 48, sw: 1.4, body: '<ellipse cx="24" cy="14.5" rx="5.2" ry="9"/><ellipse cx="24" cy="14.5" rx="5.2" ry="9" transform="rotate(72 24 24)"/><ellipse cx="24" cy="14.5" rx="5.2" ry="9" transform="rotate(144 24 24)"/><ellipse cx="24" cy="14.5" rx="5.2" ry="9" transform="rotate(216 24 24)"/><ellipse cx="24" cy="14.5" rx="5.2" ry="9" transform="rotate(288 24 24)"/><circle cx="24" cy="24" r="2.2" fill="currentColor" stroke="none"/>' },
    user: { vb: 24, sw: 1, body: '<path d="M3 12a9 9 0 1 0 18.001 0A9 9 0 0 0 3 12Z"/><path d="M9 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"/>' },
    globe: { vb: 20, sw: 0.25, filled: true, body: '<path d="m7.642 1.191-.063.018a9.12 9.12 0 0 0-6.704 8.796 9.115 9.115 0 0 0 6.713 8.789 8.4 8.4 0 0 0 2.16.312q.128.023.258.018a8.9 8.9 0 0 0 2.414-.33 9.12 9.12 0 0 0 4.842-14.317 9.12 9.12 0 0 0-4.832-3.268 7.5 7.5 0 0 0-1.48-.276 8.6 8.6 0 0 0-3.308.258Zm4.475 1.128a7.98 7.98 0 0 1 5.132 4.383h-3.57A12.6 12.6 0 0 0 11.4 2.155q.362.065.716.164ZM7.516 6.702a11.2 11.2 0 0 1 2.488-4.399 11.45 11.45 0 0 1 2.47 4.399zm-.476 3.304c-.002-.721.066-1.44.204-2.148h5.519c.261 1.417.261 2.87 0 4.287h-5.52a11 11 0 0 1-.203-2.139Zm-5.01 0c0-.727.103-1.45.304-2.148h3.734q-.183 1.066-.184 2.148 0 1.078.184 2.14H2.334a7.7 7.7 0 0 1-.304-2.14Zm5.86 7.678A7.94 7.94 0 0 1 2.758 13.3H6.31a12.5 12.5 0 0 0 2.302 4.548 7 7 0 0 1-.722-.165Zm10.078-7.679v.001a7.8 7.8 0 0 1-.295 2.14h-3.742c.248-1.42.248-2.87 0-4.288h3.734c.205.697.307 1.42.303 2.147ZM7.828 2.337l.062-.017a8 8 0 0 1 .716-.157 12.5 12.5 0 0 0-2.286 4.54H2.763a8.03 8.03 0 0 1 5.065-4.366Zm-.312 10.964h4.958a11.3 11.3 0 0 1-2.47 4.408 11.5 11.5 0 0 1-2.488-4.408Zm4.602 4.382q-.358.094-.722.16a12.6 12.6 0 0 0 2.282-4.542h3.572a7.96 7.96 0 0 1-5.132 4.382Z"/>' }
};

class Icons {
    // Trả về chuỗi <svg> của icon theo tên; cls là class CSS thêm vào (ví dụ để chỉnh kích thước).
    static get(name, cls = "") {
        const spec = ICON_SPECS[name];
        if (spec) {
            const paint = spec.filled ? 'fill="currentColor"' : 'fill="none"';
            return `<svg class="icon ${cls}" viewBox="0 0 ${spec.vb} ${spec.vb}" ${paint} stroke="currentColor" stroke-width="${spec.sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${spec.body}</svg>`;
        }
        return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;
    }

    // Icon trái tim đặc (đã yêu thích): giống heart nhưng tô kín màu hiện tại.
    static heartFilled(cls = "") {
        return Icons.get("heart", cls).replace('fill="none"', 'fill="currentColor"');
    }
}
