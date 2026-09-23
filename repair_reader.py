import re

# 1. Fix reader.js
reader_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\reader.js'
with open(reader_js_path, 'r', encoding='utf-8') as f:
    reader_js = f.read()

# Fix the undefined map crash
reader_js = reader_js.replace('const linesHtml = work.parallelContent.map(line => {', 
                              'const contentLines = work.parallelContent || [];\n    const linesHtml = contentLines.map(line => {')

# Fix the allusion sorting crash
old_sort = """      const keys = Object.keys(allAllusions).sort((a,b) => {
          let termA = allAllusions[a].term.split('(')[0].trim();
          let termB = allAllusions[b].term.split('(')[0].trim();
          return termB.length - termA.length;
      });"""
new_sort = """      const keys = Object.keys(allAllusions).filter(k => allAllusions[k] && allAllusions[k].term).sort((a,b) => {
          let termA = allAllusions[a].term.split('(')[0].trim();
          let termB = allAllusions[b].term.split('(')[0].trim();
          return termB.length - termA.length;
      });"""
reader_js = reader_js.replace(old_sort, new_sort)

with open(reader_js_path, 'w', encoding='utf-8') as f:
    f.write(reader_js)

# 2. Fix app.js missing button and missing functions
app_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\app.js'
with open(app_js_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

# Try to insert the button again using regex
pattern_grid = r'(<div class="works-grid" id="works-grid-container"></div>)'
btn_html = r'<div style="text-align:right; margin-bottom: 15px;"><button class="btn btn-primary teacher-only" onclick="app.openAddWorkModal()"><i class="fa-solid fa-plus"></i> Thêm Tác Phẩm</button></div>\n        \1'
app_js = re.sub(pattern_grid, btn_html, app_js)

# Insert the missing modal functions if they aren't there
if "openAddWorkModal()" not in app_js:
    modal_logic = """
  openAddWorkModal() {
    if (!window.isTeacher) { alert('Chỉ giáo viên mới có quyền!'); return; }
    document.getElementById('new-work-title').value = '';
    document.getElementById('new-work-author').value = '';
    document.getElementById('new-work-year').value = '';
    document.getElementById('new-work-genre').value = '';
    document.getElementById('new-work-desc').value = '';
    document.getElementById('add-work-modal').style.display = 'flex';
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
    this.saveStorageData('CUSTOM_MEDIEVAL_WORKS', MEDIEVAL_DATA.works.filter(w => w.id.startsWith('custom-')));
    
    this.closeAddWorkModal();
    this.renderView('library');
    alert("Thêm tác phẩm thành công! Bạn có thể chọn 'Đọc Hán-Nôm' để thêm văn bản.");
  }

  renderWorksGrid() {"""
    app_js = app_js.replace("  renderWorksGrid() {", modal_logic)

with open(app_js_path, 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Repairs applied.")
