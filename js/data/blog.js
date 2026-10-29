// Dữ liệu bài viết Blog (trang chủ, pages/blog/blog.html và blog-detail.html).
// Mỗi bài: slug (dùng trên địa chỉ), category (chuyên mục: Bản tin / Blogs / BST mới / Phong cách), title, date (dd/mm/yyyy), likes, image (ảnh bìa), excerpt (tóm tắt) và body (các đoạn nội dung).

// Các chuyên mục hiển thị ở trang Blog.
const BLOG_CATEGORIES = ["Bản tin", "Blogs", "BST mới", "Phong cách"];

const BLOG_POSTS = [
    {
        slug: "cach-phoi-vay-hoa-ngay-thu", category: "BST mới", title: "5 cách phối váy hoa dịu dàng cho những ngày thu", date: "12/10/2026", likes: 12,
        image: "image/lookbook/autumn-breeze.jpg",
        excerpt: "Váy hoa chưa bao giờ hết hợp mốt. Chỉ cần thay đổi áo khoác, giày và phụ kiện, bạn đã có năm diện mạo hoàn toàn khác nhau cho những ngày se lạnh đầu thu.",
        body: [
            "Váy hoa luôn là món đồ được yêu thích nhờ vẻ nhẹ nhàng, nữ tính và dễ phối. Vào những ngày thu se lạnh, bạn chỉ cần thêm một lớp áo khoác mỏng là đã có ngay một bộ trang phục vừa ấm vừa xinh.",
            "Cách thứ nhất là kết hợp váy hoa nhí với áo cardigan len mỏng cùng tông màu. Gam màu pastel như hồng phấn, kem hay xanh bạc hà sẽ giúp tổng thể trở nên hài hòa và mềm mại.",
            "Cách thứ hai dành cho những ngày cần chỉn chu: khoác thêm một chiếc blazer dáng ngắn, đi cùng giày búp bê hoặc loafer. Phần hoa họa tiết sẽ làm điểm nhấn, còn blazer giúp bạn trông thanh lịch hơn nơi công sở.",
            "Ba cách còn lại xoay quanh phụ kiện: thắt lưng nhỏ để tôn vòng eo, túi xách mini màu trung tính và vớ cổ ngắn phối cùng giày mary jane. Chỉ cần thay đổi những chi tiết nhỏ, bạn có thể mặc một chiếc váy theo nhiều phong cách khác nhau."
        ]
    },
    {
        slug: "trang-phuc-cong-so-thanh-lich", category: "Phong cách", title: "Gợi ý trang phục công sở thanh lịch nhưng không nhàm chán", date: "08/10/2026", likes: 7,
        image: "image/lookbook/modern-living.jpg",
        excerpt: "Công sở không có nghĩa là chỉ có áo sơ mi trắng và quần tây đen. Hãy thử thay đổi chất liệu, phom dáng và một vài điểm nhấn nhỏ để mỗi ngày đi làm đều là một ngày mới.",
        body: [
            "Trang phục công sở hiện đại ngày càng linh hoạt. Bạn hoàn toàn có thể giữ sự chuyên nghiệp mà vẫn thể hiện cá tính qua cách chọn màu sắc, chất liệu và phụ kiện.",
            "Một chiếc sơ mi lụa màu kem phối cùng quần suông ống rộng sẽ tạo cảm giác nhẹ nhàng và sang trọng. Nếu muốn nổi bật hơn, hãy chọn áo có chi tiết cổ đức hoặc tay phồng nhẹ.",
            "Đối với những buổi họp quan trọng, vest tafta dáng ngắn kết hợp chân váy chữ A là lựa chọn an toàn nhưng vẫn rất thời trang. Đừng quên một đôi giày da mũi nhọn để hoàn thiện tổng thể."
        ]
    },
    {
        slug: "cach-chon-chan-vay-xep-ly", category: "Blogs", title: "Cách chọn chân váy xếp ly hợp dáng người", date: "02/10/2026", likes: 9,
        image: "image/lookbook/polka-dot-charm.jpg",
        excerpt: "Chân váy xếp ly có thể che khuyết điểm và tôn dáng cực tốt, nhưng chỉ khi bạn chọn đúng độ dài và chất liệu. Cùng xem những mẹo chọn váy phù hợp với từng vóc dáng.",
        body: [
            "Chân váy xếp ly là món đồ cơ bản trong tủ đồ của nhiều cô gái. Độ xòe của váy tạo cảm giác bồng bềnh, nhẹ nhàng và giúp cân đối tổng thể cơ thể.",
            "Với dáng người thấp, hãy ưu tiên váy dài qua gối một chút và chọn cạp cao để tạo cảm giác đôi chân dài hơn. Chất liệu mềm rũ sẽ giúp váy không bị cồng kềnh.",
            "Với dáng người cao, bạn có thể thử các kiểu váy midi hoặc maxi xếp ly nhuyễn. Màu trơn như đen, be hay olive dễ phối cùng nhiều loại áo khác nhau."
        ]
    },
    {
        slug: "bi-quyet-phoi-do-mau-pastel", category: "Blogs", title: "Bí quyết phối đồ với bảng màu pastel không bị nhạt nhòa", date: "27/09/2026", likes: 4,
        image: "image/lookbook/for-her.jpg",
        excerpt: "Màu pastel mang lại cảm giác nhẹ nhàng, nữ tính nhưng nếu không khéo sẽ dễ khiến bộ trang phục trở nên nhạt. Hãy thử nguyên tắc phối tương phản nhẹ này.",
        body: [
            "Bảng màu pastel gồm hồng phấn, xanh bạc hà, vàng bơ, lavender... rất hợp với phong cách dịu dàng. Tuy nhiên, mặc toàn bộ cùng một tông dễ khiến bạn bị chìm trong trang phục.",
            "Hãy thử kết hợp một món đồ pastel với một món trung tính như trắng, be hoặc nâu. Điều này giúp tổng thể có chiều sâu mà vẫn giữ được sự nhẹ nhàng."
        ]
    },
    {
        slug: "phu-kien-nho-tao-diem-nhan", category: "Phong cách", title: "Phụ kiện nhỏ, điểm nhấn lớn: nơ, kẹp tóc và túi mini", date: "20/09/2026", likes: 6,
        image: "image/lookbook/romanza-a-como.jpg",
        excerpt: "Một chiếc nơ lụa, chiếc kẹp tóc ngọc trai hay túi mini đúng màu có thể khiến bộ đồ đơn giản trở nên cuốn hút hơn rất nhiều.",
        body: [
            "Phụ kiện là cách nhanh nhất để làm mới một bộ trang phục quen thuộc. Chỉ với vài chi tiết nhỏ, bạn có thể biến một chiếc váy đơn giản thành bộ cánh đi chơi cuối tuần.",
            "Nơ lụa buộc ở cổ áo, kẹp tóc ngọc trai hay túi mini màu kem là những món đồ nhỏ nhưng mang lại cảm giác tinh tế. Hãy chọn một món làm điểm nhấn và giữ các món còn lại thật đơn giản."
        ]
    },
    {
        slug: "tu-do-capsule-cho-nguoi-ban-ron", category: "Bản tin", title: "Tủ đồ capsule dành cho người bận rộn: 10 món là đủ", date: "14/09/2026", likes: 11,
        image: "image/lookbook/the-monochromes.jpg",
        excerpt: "Không cần một tủ đồ đầy ắp, chỉ cần 10 món cơ bản được chọn kỹ là bạn đã có thể mix & match thành hàng chục bộ trang phục cho cả tuần.",
        body: [
            "Tủ đồ capsule là cách xây dựng tủ quần áo gọn nhẹ nhưng linh hoạt. Thay vì mua nhiều, bạn chọn ít nhưng chất lượng và dễ phối với nhau.",
            "Một tủ đồ capsule cơ bản gồm áo sơ mi trắng, áo thun trơn, blazer, quần suông, chân váy chữ A, một chiếc đầm đen, áo len mỏng và vài món phụ kiện cần thiết.",
            "Khi chọn màu, hãy bám theo ba gam chủ đạo: một màu trung tính, một màu tương phản và một màu điểm nhấn. Như vậy mọi món đồ đều có thể kết hợp với nhau dễ dàng."
        ]
    }
];

class Blog {
    // Tìm bài viết theo slug (không thấy thì undefined).
    static bySlug(slug) { return BLOG_POSTS.find(p => p.slug === slug); }

    // Địa chỉ trang chi tiết của một bài viết.
    static url(post) { return "pages/blog/blog-detail.html?slug=" + post.slug; }

    // Đoạn tóm tắt ngắn gọn của bài (cắt theo độ dài tối đa, thêm "..." nếu bị cắt).
    static excerpt(post, max = 140) {
        if (post.excerpt.length <= max) return post.excerpt;
        return post.excerpt.slice(0, max).trim() + "...";
    }

    // HTML một thẻ bài viết (ảnh, tiêu đề, tóm tắt, ngày, lượt thích, nút "Xem thêm") dùng ở trang chủ và trang blog.
    static cardHTML(post) {
        const url = Blog.url(post);
        return `
            <article class="blog-card">
                <a class="blog-thumb" href="${url}"><img src="${post.image}" alt="${Utils.escapeHTML(post.title)}" loading="lazy"></a>
                <a class="blog-title" href="${url}">${post.title}</a>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-meta">
                    <div class="blog-meta-left">
                        ${Icons.get("clock")}<span>${post.date}</span><i class="blog-divider"></i>
                        <button type="button" class="blog-like" onclick="Blog.like(this)" aria-label="Thích">${Icons.get("heart")}</button><span class="blog-like-count">${post.likes}</span>
                    </div>
                    <a class="btn btn-outline" href="${url}">Xem thêm</a>
                </div>
            </article>`;
    }

    // Bấm trái tim ở bài viết: bật / tắt thích và cộng / trừ 1 vào số lượt thích đang hiển thị (chỉ trên màn hình).
    static like(btn) {
        const active = btn.classList.toggle("active");
        const count = btn.parentNode.querySelector(".blog-like-count");
        count.textContent = (parseInt(count.textContent, 10) || 0) + (active ? 1 : -1);
        btn.innerHTML = active ? Icons.heartFilled() : Icons.get("heart");
    }
}
