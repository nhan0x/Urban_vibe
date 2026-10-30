// Slider dùng chung (slider trang chủ, carousel sản phẩm): trượt ngang bằng transform, nút mũi tên, chấm, tự chạy, vuốt trên điện thoại.
// Cấu trúc HTML cần có:
//   <div class="slider" data-autoplay="5000" data-per-view="1">
//     <div class="slider-track"> <div class="slide">...</div> ... </div>
//     <button class="slider-arrow prev"></button> <button class="slider-arrow next"></button>   (tuỳ chọn)
//     <div class="slider-dots"></div>                                                            (tuỳ chọn)
//   </div>
// data-per-view: số slide hiện cùng lúc (carousel). Có thể đổi theo màn hình bằng data-per-view-md (< 992px) và data-per-view-sm (< 600px).

class Slider {
    constructor(root) {
        this.root = root;
        this.track = root.querySelector(".slider-track");
        this.slides = [...this.track.children];
        this.dotsBox = root.querySelector(".slider-dots");
        this.index = 0;
        this.interval = Number(root.dataset.autoplay) || 0;
        this.timer = null;

        root.querySelector(".slider-arrow.prev")?.addEventListener("click", () => this.go(this.index - 1, true));
        root.querySelector(".slider-arrow.next")?.addEventListener("click", () => this.go(this.index + 1, true));
        root.addEventListener("mouseenter", () => this.stop());
        root.addEventListener("mouseleave", () => this.play());
        this.bindSwipe();
        window.addEventListener("resize", () => this.layout());

        this.layout();
        this.play();
    }

    // Số slide hiện cùng lúc theo bề rộng màn hình.
    perView() {
        const d = this.root.dataset;
        if (window.innerWidth < 600 && d.perViewSm) return Number(d.perViewSm);
        if (window.innerWidth < 992 && d.perViewMd) return Number(d.perViewMd);
        return Number(d.perView) || 1;
    }

    // Vị trí cuối cùng có thể dừng (để slide cuối vẫn nằm sát mép phải).
    maxIndex() { return Math.max(0, this.slides.length - this.perView()); }

    // Đặt bề rộng mỗi slide và vẽ lại các chấm.
    layout() {
        const pv = this.perView();
        this.slides.forEach(s => { s.style.flex = `0 0 ${100 / pv}%`; });
        if (this.dotsBox) {
            const count = this.maxIndex() + 1;
            this.dotsBox.innerHTML = Array.from({ length: count }, (_, i) =>
                `<button type="button" aria-label="Slide ${i + 1}"></button>`).join("");
            [...this.dotsBox.children].forEach((b, i) => b.addEventListener("click", () => this.go(i, true)));
        }
        this.go(Math.min(this.index, this.maxIndex()));
    }

    // Chuyển tới slide i (vòng lại đầu / cuối). byUser: người dùng bấm thì chạy lại bộ đếm tự chạy.
    go(i, byUser = false) {
        const max = this.maxIndex();
        if (i > max) i = 0;
        if (i < 0) i = max;
        this.index = i;
        this.track.style.transform = `translateX(-${(100 / this.perView()) * i}%)`;
        this.slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
        if (this.dotsBox) [...this.dotsBox.children].forEach((b, k) => b.classList.toggle("active", k === i));
        this.root.dispatchEvent(new CustomEvent("slidechange", { detail: { index: i } }));
        if (byUser) { this.stop(); this.play(); }
    }

    play() {
        if (!this.interval || this.slides.length <= this.perView()) return;
        this.stop();
        this.timer = setInterval(() => this.go(this.index + 1), this.interval);
    }
    stop() { clearInterval(this.timer); }

    // Vuốt trái / phải trên màn hình cảm ứng (lệch quá 40px thì đổi slide).
    bindSwipe() {
        let startX = null;
        this.track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; this.stop(); }, { passive: true });
        this.track.addEventListener("touchend", e => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) this.go(this.index + (dx < 0 ? 1 : -1), true);
            startX = null;
            this.play();
        });
    }

    // Khởi tạo mọi .slider trong phạm vi scope (mặc định cả trang).
    static mountAll(scope = document) {
        return [...scope.querySelectorAll(".slider")].map(el => new Slider(el));
    }
}
