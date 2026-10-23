// Slider banner (giống elise.vn): tự chuyển ảnh trượt ngang, chấm tròn bên dưới.

class Slider {
    // Lấy các ảnh (.slide) và chỗ đặt chấm tròn, dựng chấm, gắn sự kiện, hiện ảnh đầu tiên rồi bật tự chạy.
    constructor(root) {
        this.root = root;
        this.slides = root.querySelectorAll(".slide");
        this.dotsWrap = root.querySelector(".slider-dots");
        this.interval = 4000;
        this.current = 0;
        this.timer = null;
        this.offsets = [];

        this.createDots();
        this.bindEvents();
        this.goTo(0);
        this.start();
    }

    // Tạo mỗi ảnh một chấm tròn (button). Bấm chấm i thì nhảy tới ảnh i và đặt lại bộ đếm giờ tự chuyển.
    createDots() {
        this.slides.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.className = "slider-dot";
            dot.setAttribute("aria-label", "Ảnh " + (i + 1));
            dot.addEventListener("click", () => { this.goTo(i); this.start(); });
            this.dotsWrap.appendChild(dot);
        });
        this.dots = this.dotsWrap.querySelectorAll(".slider-dot");
    }

    // Chuyển tới ảnh thứ index (chạy vòng tròn nhờ phép "% số ảnh").
    // Mỗi ảnh có vị trí so với ảnh hiện tại: 0 = đang hiện, -1 = nằm bên trái (is-prev), còn lại nằm bên phải.
    // Ảnh nào phải "nhảy" từ bên trái sang bên phải (hoặc ngược lại) thì tắt hiệu ứng trượt (no-anim) để không quét ngang qua màn hình.
    goTo(index) {
        const total = this.slides.length;
        const half = Math.floor(total / 2);
        this.current = (index + total) % total;
        this.slides.forEach((s, n) => {
            const raw = ((n - this.current + total + half) % total) - half;
            const pos = Math.max(-1, Math.min(1, raw));
            const jump = this.offsets[n] !== undefined && Math.abs(pos - this.offsets[n]) > 1;
            if (jump) s.classList.add("no-anim");
            s.classList.toggle("active", pos === 0);
            s.classList.toggle("is-prev", pos === -1);
            if (jump) { void s.offsetWidth; s.classList.remove("no-anim"); }
            this.offsets[n] = pos;
        });
        this.dots.forEach((d, n) => d.classList.toggle("active", n === this.current));
    }

    // Bật tự chuyển: huỷ bộ đếm cũ trước (tránh chạy chồng nhiều bộ đếm), rồi cứ 4 giây sang ảnh kế tiếp.
    start() {
        this.stop();
        this.timer = setInterval(() => this.goTo(this.current + 1), this.interval);
    }

    // Dừng tự chuyển.
    stop() { clearInterval(this.timer); }

    // Gắn sự kiện: rê chuột vào thì dừng và rê ra thì chạy tiếp.
    bindEvents() {
        this.root.addEventListener("mouseenter", () => this.stop());
        this.root.addEventListener("mouseleave", () => this.start());
    }
}

// Chỉ tạo slider khi trang có #hero-slider (trang chủ).
const heroEl = document.getElementById("hero-slider");
let slider = null;
if (heroEl) slider = new Slider(heroEl);
