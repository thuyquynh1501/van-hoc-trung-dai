import re

reader_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\reader.js'
with open(reader_js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Inject Firebase listener and custom allusions init in constructor
constructor_replacement = """
  constructor() {
    this.activeWork = null;
    this.columnVisibility = { han: true, sino: true, trans: true, notes: true };
    this.showPoeticMeter = false;
    this.selfStudyMode = false;
    
    window.CUSTOM_ALLUSIONS = JSON.parse(localStorage.getItem('CUSTOM_ALLUSIONS')) || {};
    if (window.FirestoreSync) {
      FirestoreSync.listen('CUSTOM_ALLUSIONS', (data) => {
        if (data) {
          window.CUSTOM_ALLUSIONS = data;
          if (this.activeWork) this.loadWorkReader(this.activeWork.id);
        }
      });
    }
  }
"""
js = re.sub(r'constructor\(\) \{.*?\n  \}', constructor_replacement.strip(), js, flags=re.DOTALL)


# 2. Replace the old allusion matching with the new safe global matching
old_match = """      let processedTrans = line.translation;
      if (line.allusions && line.allusions.length > 0) {
        line.allusions.forEach(key => {
          const allusion = ALLUSIONS_DB[key];
          if (allusion) {
            const term = allusion.term.split(' ')[0]; // Basic matching
            const regex = new RegExp(`(${term})`, 'gi');
            processedTrans = processedTrans.replace(regex, (match) => `
              <span class="allusion-tag" onclick="nomReader.showAllusionModal('${key}')">
                ${match} <i class="fa-solid fa-circle-info"></i>
              </span>
            `);
          }
        });
      }"""

new_match = """      let processedTrans = line.translation || '';
      const allAllusions = { ...ALLUSIONS_DB, ...(window.CUSTOM_ALLUSIONS || {}) };
      const sortedKeys = Object.keys(allAllusions).sort((a, b) => {
         const tA = allAllusions[a].term.split(' (')[0].trim();
         const tB = allAllusions[b].term.split(' (')[0].trim();
         return tB.length - tA.length;
      });

      const safeReplace = (text, term, key) => {
         const parts = text.split(/(<[^>]+>)/g);
         for(let i=0; i<parts.length; i++) {
             if(!parts[i].startsWith('<')) {
                 const regex = new RegExp(`(${term})`, 'gi');
                 parts[i] = parts[i].replace(regex, (match) => `<span class="allusion-tag" onclick="nomReader.showAllusionModal('${key}')" style="font-weight:bold; color:var(--primary);">${match} <i class="fa-solid fa-circle-info"></i></span>`);
             }
         }
         return parts.join('');
      };

      sortedKeys.forEach(key => {
         const allusion = allAllusions[key];
         const term = allusion.term.split(' (')[0].trim();
         if (term.length > 0) {
            processedTrans = safeReplace(processedTrans, term, key);
         }
      });"""

js = js.replace(old_match, new_match)


# 3. Add buttons to reader-controls
old_controls = """          <div class="reader-controls">
            <button class="btn btn-primary" onclick="academicToolkit.printWorksheet('${work.id}')">
              <i class="fa-solid fa-print"></i> In Phiếu Học Tập
            </button>"""

new_controls = """          <div class="reader-controls">
            <button class="btn btn-outline teacher-only" onclick="nomReader.openAddLineModal('${work.id}')">
              <i class="fa-solid fa-plus"></i> Thêm Câu Hán-Nôm
            </button>
            <button class="btn btn-outline teacher-only" onclick="nomReader.openAddAllusionModal()">
              <i class="fa-solid fa-book-journal-whills"></i> Thêm Chú Thích
            </button>
            <button class="btn btn-primary" onclick="academicToolkit.printWorksheet('${work.id}')">
              <i class="fa-solid fa-print"></i> In Phiếu Học Tập
            </button>"""

js = js.replace(old_controls, new_controls)


# 4. Inject Modals into container.innerHTML
modals = """

      <!-- CMS Modals -->
      <div id="add-line-modal" class="modal-overlay" style="display:none;" onclick="nomReader.closeAddLineModal()">
        <div class="modal-card animated-fade-in" onclick="event.stopPropagation()">
          <h3 style="font-family:var(--font-heading); color:var(--primary); margin-bottom:15px;">Thêm Câu Hán-Nôm Mới</h3>
          <input type="hidden" id="new-line-work-id">
          <div style="margin-bottom:10px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Nguyên tác (Hán/Nôm):</label>
            <input type="text" id="new-line-han" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>
          <div style="margin-bottom:10px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Phiên âm Hán-Việt:</label>
            <input type="text" id="new-line-sino" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>
          <div style="margin-bottom:10px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Dịch nghĩa / Dịch thơ:</label>
            <textarea id="new-line-trans" rows="2" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>
          <div style="margin-bottom:15px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Chú giải & Nghệ thuật:</label>
            <textarea id="new-line-notes" rows="2" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>
          <div style="text-align:right;">
            <button class="btn btn-outline" onclick="nomReader.closeAddLineModal()">Hủy</button>
            <button class="btn btn-primary" onclick="nomReader.saveNewLine()">Lưu Câu</button>
          </div>
        </div>
      </div>

      <div id="add-allusion-modal" class="modal-overlay" style="display:none;" onclick="nomReader.closeAddAllusionModal()">
        <div class="modal-card animated-fade-in" onclick="event.stopPropagation()">
          <h3 style="font-family:var(--font-heading); color:var(--primary); margin-bottom:15px;">Thêm Điển Tích / Chú Thích</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:15px;">Từ khóa sẽ tự động được bôi đậm và giải thích trong toàn bộ văn bản.</p>
          <div style="margin-bottom:10px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Từ khóa cần bôi đậm:</label>
            <input type="text" id="new-al-term" placeholder="VD: Thủy Kiều" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>
          <div style="margin-bottom:10px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Nguồn gốc / Xuất xứ (Tùy chọn):</label>
            <input type="text" id="new-al-source" placeholder="VD: Truyện Kiều" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>
          <div style="margin-bottom:10px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Giải nghĩa:</label>
            <textarea id="new-al-meaning" rows="3" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>
          <div style="text-align:right;">
            <button class="btn btn-outline" onclick="nomReader.closeAddAllusionModal()">Hủy</button>
            <button class="btn btn-primary" onclick="nomReader.saveNewAllusion()">Lưu Chú Thích</button>
          </div>
        </div>
      </div>
"""
js = js.replace('</div>\n    `;', modals + '</div>\n    `;')


# 5. Add Modal JS Methods
modal_methods = """
  openAddLineModal(workId) {
    if (!window.isTeacher) { alert('Chỉ giáo viên mới có quyền thao tác!'); return; }
    document.getElementById('new-line-work-id').value = workId;
    document.getElementById('new-line-han').value = '';
    document.getElementById('new-line-sino').value = '';
    document.getElementById('new-line-trans').value = '';
    document.getElementById('new-line-notes').value = '';
    document.getElementById('add-line-modal').style.display = 'flex';
  }

  closeAddLineModal() {
    document.getElementById('add-line-modal').style.display = 'none';
  }

  saveNewLine() {
    if (!window.isTeacher) return;
    const workId = document.getElementById('new-line-work-id').value;
    const han = document.getElementById('new-line-han').value;
    const sino = document.getElementById('new-line-sino').value;
    const trans = document.getElementById('new-line-trans').value;
    const notes = document.getElementById('new-line-notes').value;
    
    if (!trans && !sino) {
        alert("Vui lòng nhập ít nhất Phiên âm hoặc Dịch nghĩa.");
        return;
    }

    const work = MEDIEVAL_DATA.works.find(w => w.id === workId);
    if (work) {
        if (!work.parallelContent) work.parallelContent = [];
        const nextLineNo = work.parallelContent.length > 0 ? work.parallelContent[work.parallelContent.length-1].lineNo + 1 : 1;
        work.parallelContent.push({
            lineNo: nextLineNo,
            hanOriginal: han,
            sinoVietnamese: sino,
            translation: trans,
            notes: notes
        });
        
        // Save to Firebase (works starting with custom-work- are saved automatically by app.js logic)
        app.saveStorageData('CUSTOM_MEDIEVAL_WORKS', MEDIEVAL_DATA.works.filter(w => w.id.startsWith('custom-')));
        
        this.closeAddLineModal();
        this.loadWorkReader(workId);
        alert("Thêm câu thành công!");
    }
  }

  openAddAllusionModal() {
    if (!window.isTeacher) { alert('Chỉ giáo viên mới có quyền thao tác!'); return; }
    document.getElementById('new-al-term').value = '';
    document.getElementById('new-al-source').value = '';
    document.getElementById('new-al-meaning').value = '';
    document.getElementById('add-allusion-modal').style.display = 'flex';
  }

  closeAddAllusionModal() {
    document.getElementById('add-allusion-modal').style.display = 'none';
  }

  saveNewAllusion() {
    if (!window.isTeacher) return;
    const term = document.getElementById('new-al-term').value;
    const source = document.getElementById('new-al-source').value;
    const meaning = document.getElementById('new-al-meaning').value;

    if (!term || !meaning) {
        alert("Vui lòng nhập Từ khóa và Giải nghĩa.");
        return;
    }

    const key = 'custom-al-' + Date.now();
    window.CUSTOM_ALLUSIONS[key] = {
        term: term,
        source: source || "Chú thích của Giáo viên",
        meaning: meaning,
        context: "Xem trong văn bản"
    };

    try {
        localStorage.setItem('CUSTOM_ALLUSIONS', JSON.stringify(window.CUSTOM_ALLUSIONS));
        if (window.FirestoreSync) FirestoreSync.save('CUSTOM_ALLUSIONS', window.CUSTOM_ALLUSIONS);
    } catch(e) { console.warn("Could not save allusions", e); }

    this.closeAddAllusionModal();
    if (this.activeWork) this.loadWorkReader(this.activeWork.id);
    alert("Thêm chú thích thành công! Từ khóa sẽ được tự động bôi đậm.");
  }

  showAllusionModal(key) {
"""

js = js.replace('  showAllusionModal(key) {', modal_methods)

# Fix empty work parallel content check (allow showing reader so they can add lines)
old_empty_check = """    if (!work.parallelContent || work.parallelContent.length === 0) {
      container.innerHTML = `<div class="reader-container"><h3>${work.title}</h3><p>Chưa có dữ liệu Hán-Nôm cho tác phẩm này.</p></div>`;
      return;
    }"""
new_empty_check = """    if (!work.parallelContent) work.parallelContent = [];"""
js = js.replace(old_empty_check, new_empty_check)

with open(reader_js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("reader.js patched.")
