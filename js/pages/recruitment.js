// Trang Tuyển dụng (pages/info/recruitment.html): tìm việc theo từ khoá và nhóm công việc, danh sách việc làm nổi bật.

class RecruitPage {
    // keyword / group: điều kiện tìm đang dùng ("Tất cả công việc" = không lọc nhóm).
    constructor() {
        this.keyword = "";
        this.group = JOB_GROUPS[0];
    }

    // Danh sách việc làm sau khi lọc theo từ khoá (tên vị trí / nơi làm việc) và nhóm.
    list() {
        const kw = Utils.normalize(this.keyword.trim());
        return JOBS.filter(j => (this.group === JOB_GROUPS[0] || j.group === this.group)
            && (!kw || Utils.normalize(j.title + " " + j.place).includes(kw)));
    }

    // HTML một việc làm: tên vị trí, nhóm, nơi làm việc, hình thức, lương, hạn nộp và nút "Ứng tuyển".
    jobHTML(j) {
        return `
            <article class="job-card">
                <div class="job-main">
                    <h3>${j.title}</h3>
                    <p class="job-tags"><span>${j.group}</span><span>${j.type}</span></p>
                    <p class="job-info">${Icons.get("pin")}${j.place}<i></i>${Icons.get("clock")}Hạn nộp ${j.deadline}</p>
                </div>
                <div class="job-side">
                    <strong>${j.salary}</strong>
                    <button type="button" class="btn btn-gray" onclick="recruitPage.apply(${j.id})">Ứng tuyển</button>
                </div>
            </article>`;
    }

    // Vẽ danh sách việc làm (hoặc thông báo khi không có).
    render() {
        const list = this.list();
        Utils.$("job-list").innerHTML = list.length ? list.map(j => this.jobHTML(j)).join("") : '<p class="empty-hint">Chưa có vị trí phù hợp với tìm kiếm của bạn.</p>';
    }

    // Gửi form tìm việc.
    search(e) {
        e.preventDefault();
        this.keyword = Utils.$("job-keyword").value;
        this.group = Utils.$("job-group").value;
        this.render();
    }

    // Bấm "Ứng tuyển": hướng dẫn gửi CV qua email (chưa có chức năng nộp hồ sơ thật).
    apply(id) {
        const job = JOBS.find(j => j.id === id);
        Utils.showToast(`Gửi CV cho vị trí "${job.title}" về tuyendung@urbanvibe.vn`);
    }
}

const recruitPage = new RecruitPage();
Utils.$("recruit-icon").innerHTML = Icons.get("search");
Utils.$("job-group").innerHTML = JOB_GROUPS.map(g => `<option>${g}</option>`).join("");
recruitPage.render();
