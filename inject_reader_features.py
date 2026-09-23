import re

# 1. Update index.html
html_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

modal_html = """
  <!-- Modal Thêm Tác Phẩm -->
  <div id="add-work-modal" class="modal-overlay" style="display:none;" onclick="app.closeAddWorkModal()">
    <div class="modal-card animated-fade-in" onclick="event.stopPropagation()">
      <h3 style="font-family:var(--font-heading); color:var(--primary); margin-bottom:15px;">Thêm Tác Phẩm Mới</h3>
      <div style="margin-bottom:10px;">
        <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tên Tác Phẩm:</label>
        <input type="text" id="new-work-title" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
      </div>
      <div style="margin-bottom:10px;">
        <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tác Giả:</label>
        <input type="text" id="new-work-author" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
      </div>
      <div style="margin-bottom:10px;">
        <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Năm / Giai đoạn:</label>
        <input type="text" id="new-work-year" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
      </div>
      <div style="margin-bottom:10px;">
        <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Thể loại:</label>
        <input type="text" id="new-work-genre" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
      </div>
      <div style="margin-bottom:15px;">
        <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Mô tả / Tóm tắt:</label>
        <textarea id="new-work-desc" rows="3" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
      </div>
      <div style="text-align:right;">
        <button class="btn btn-outline" onclick="app.closeAddWorkModal()">Hủy</button>
        <button class="btn btn-primary" onclick="app.saveNewWork()">Lưu Tác Phẩm</button>
      </div>
    </div>
  </div>
"""
if "add-work-modal" not in html:
    html = html.replace('</body>', modal_html + '\n</body>')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)


# 2. Update js/app.js
app_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\app.js'
with open(app_js_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

# Add button to Library
btn_html = """
        <div class="filter-bar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div class="period-pills">
"""
app_js = app_js.replace('<div class="filter-bar">\n          <div class="period-pills">', btn_html)

btn2_html = """
          <button class="btn btn-primary teacher-only" onclick="app.openAddWorkModal()"><i class="fa-solid fa-plus"></i> Thêm Tác Phẩm</button>
        </div>

        <div class="works-grid"
"""
app_js = app_js.replace('</div>\n        </div>\n\n        <div class="works-grid"', btn2_html)

# Add Modal Logic
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

  renderWorksGrid() {
"""
if "openAddWorkModal()" not in app_js:
    app_js = app_js.replace('  renderWorksGrid() {', modal_logic)
    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(app_js)

# 3. Update js/reader.js
reader_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\reader.js'
with open(reader_js_path, 'r', encoding='utf-8') as f:
    reader_js = f.read()

old_logic = """      // Process Allusions in text
      let processedTrans = line.translation;
      if (line.allusions) {
        line.allusions.forEach(key => {
          const allusion = ALLUSIONS_DB[key];
          if (allusion) {
            const regex = new RegExp(allusion.term.split(' ')[0], 'gi');
            processedTrans = processedTrans.replace(regex, (match) => `
              <span class="allusion-tag" onclick="nomReader.showAllusionModal('${key}')">
                ${match} <i class="fa-solid fa-circle-info"></i>
              </span>
            `);
          }
        });
      }"""

new_logic = """      // Process Allusions in text (AUTO-MATCH GLOBAL)
      let processedTrans = line.translation || '';
      let processedSino = line.sinoVietnamese || '';
      let processedNotes = line.notes || '';
      
      const allAllusions = Object.assign({}, ALLUSIONS_DB, window.CUSTOM_ALLUSIONS);
      
      // Sort keys by length descending to match longest phrases first
      const keys = Object.keys(allAllusions).sort((a,b) => {
          let termA = allAllusions[a].term.split('(')[0].trim();
          let termB = allAllusions[b].term.split('(')[0].trim();
          return termB.length - termA.length;
      });

      keys.forEach(key => {
        const allusion = allAllusions[key];
        if (allusion && allusion.term) {
          const rawTerm = allusion.term.split('(')[0].trim();
          if (rawTerm.length > 1) {
            // Match whole words to avoid partial matches
            const regex = new RegExp(`\\\\b(${rawTerm})\\\\b`, 'gi');
            const replacement = `<span class="allusion-tag" onclick="nomReader.showAllusionModal('${key}')">$1 <i class="fa-solid fa-circle-info"></i></span>`;
            
            // Only replace if it doesn't already contain our HTML tag to avoid nested spans
            if (!processedTrans.includes(key)) {
                processedTrans = processedTrans.replace(regex, replacement);
            }
            if (!processedSino.includes(key)) {
                processedSino = processedSino.replace(regex, replacement);
            }
            if (!processedNotes.includes(key)) {
                processedNotes = processedNotes.replace(regex, replacement);
            }
          }
        }
      });"""

reader_js = reader_js.replace(old_logic, new_logic)
with open(reader_js_path, 'w', encoding='utf-8') as f:
    f.write(reader_js)

print("All features injected successfully.")
