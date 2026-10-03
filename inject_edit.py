import re

# 1. Update index.html to remove onclick from ALL modals except allusion-modal-overlay
html_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Already removed from add-work-modal. Let's do it generally for any future ones if needed.
# Actually, the user's specific request was "khi đang thêm tác phẩm". We already fixed index.html for add-work-modal.
# But let's also fix other modals in app.js and reader.js as requested by my own initiative.

# 2. Update js/app.js
app_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\app.js'
with open(app_js_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

# Fix modals in app.js
app_js = app_js.replace('onclick="app.closeAddAuthorModal()"', '')
app_js = app_js.replace('onclick="app.closeAddPeriodModal()"', '')
app_js = app_js.replace('onclick="app.closeAddWritingModal()"', '')

# Insert edit button into works-grid
btn_edit_html = """        <div class="work-actions">
          <button class="btn btn-outline teacher-only" onclick="app.editWork('${work.id}')" title="Chỉnh sửa thông tin">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>"""
app_js = app_js.replace('        <div class="work-actions">', btn_edit_html)

# Add editWork() and update saveNewWork()
edit_work_logic = """  editWork(workId) {
    if (!window.isTeacher) return;
    const work = MEDIEVAL_DATA.works.find(w => w.id === workId);
    if (!work) return;

    document.getElementById('new-work-title').value = work.title || '';
    document.getElementById('new-work-author').value = work.authorName || '';
    document.getElementById('new-work-year').value = work.year || '';
    document.getElementById('new-work-genre').value = work.genre || '';
    document.getElementById('new-work-desc').value = work.description || '';
    
    const modal = document.getElementById('add-work-modal');
    modal.dataset.editId = workId;
    modal.querySelector('h3').innerText = "Chỉnh Sửa Tác Phẩm";
    modal.style.display = 'flex';
  }

  openAddWorkModal() {
    if (!window.isTeacher) { alert('Chỉ giáo viên mới có quyền!'); return; }
    document.getElementById('new-work-title').value = '';
    document.getElementById('new-work-author').value = '';
    document.getElementById('new-work-year').value = '';
    document.getElementById('new-work-genre').value = '';
    document.getElementById('new-work-desc').value = '';
    
    const modal = document.getElementById('add-work-modal');
    delete modal.dataset.editId;
    modal.querySelector('h3').innerText = "Thêm Tác Phẩm Mới";
    modal.style.display = 'flex';
  }

  closeAddWorkModal() {
    document.getElementById('add-work-modal').style.display = 'none';
  }

  saveNewWork() {
    if (!window.isTeacher) return;
    const title = document.getElementById('new-work-title').value;
    const author = document.getElementById('new-work-author').value;
    const year = document.getElementById('new-work-year').value;
    const genre = document.getElementById('new-work-genre').value;
    const desc = document.getElementById('new-work-desc').value;

    if (!title || !author) { alert("Vui lòng nhập Tên và Tác giả!"); return; }

    const modal = document.getElementById('add-work-modal');
    const editId = modal.dataset.editId;

    if (editId) {
      // Update existing work
      const work = MEDIEVAL_DATA.works.find(w => w.id === editId);
      if (work) {
        work.title = title;
        work.authorName = author;
        work.year = year || work.year;
        work.genre = genre || work.genre;
        work.description = desc || work.description;
      }
      alert("Cập nhật tác phẩm thành công!");
    } else {
      // Create new work
      const newWork = {
        id: "custom-work-" + Date.now(),
        title: title,
        authorName: author,
        year: year || "Chưa rõ",
        periodId: "p1",
        genre: genre || "Chưa phân loại",
        description: desc || "Tác phẩm do giáo viên thêm.",
        parallelContent: [],
        slides: []
      };
      MEDIEVAL_DATA.works.unshift(newWork);
      alert("Thêm tác phẩm thành công! Bạn có thể chọn 'Đọc Hán-Nôm' để thêm văn bản.");
    }

    this.saveStorageData('CUSTOM_MEDIEVAL_WORKS', MEDIEVAL_DATA.works.filter(w => w.id.startsWith('custom-')));
    
    this.closeAddWorkModal();
    this.renderView('library');
  }"""

# Replace the old functions block
app_js = re.sub(r'  openAddWorkModal\(\) \{[\s\S]*?  renderWorksGrid\(\) \{', edit_work_logic + '\n\n  renderWorksGrid() {', app_js)

with open(app_js_path, 'w', encoding='utf-8') as f:
    f.write(app_js)


# 3. Update js/reader.js to remove onclick from its modals (except allusion view)
reader_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\reader.js'
with open(reader_js_path, 'r', encoding='utf-8') as f:
    reader_js = f.read()

reader_js = reader_js.replace('onclick="nomReader.closeAddLineModal()"', '')
reader_js = reader_js.replace('onclick="nomReader.closeAddAllusionModal()"', '')
with open(reader_js_path, 'w', encoding='utf-8') as f:
    f.write(reader_js)

print("Edit feature and modal protections applied.")
