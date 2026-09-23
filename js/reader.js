/**
 * Phân Hệ Tra Cứu & Đọc Song Song Hán - Nôm - Quốc Ngữ (Parallel Reader & Academic Scanner)
 */

class NomParallelReader {
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

  loadWorkReader(workId) {
    const work = MEDIEVAL_DATA.works.find(w => w.id === workId);
    if (!work) return;

    this.activeWork = work;
    const container = document.getElementById('view-reader-container');
    if (!container) return;

    const linesHtml = work.parallelContent.map(line => {
      // Process Allusions in text
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
      }

      return `
        <div class="parallel-line-card animated-fade-in">
          <span class="line-badge">Dòng ${line.lineNo}</span>
          
          <div class="reader-columns">
            ${this.columnVisibility.han ? `
              <div class="col-text">
                <div class="col-label"><i class="fa-solid fa-scroll"></i> Nguyên tác (Hán / Nôm)</div>
                <div class="text-han">${line.hanOriginal}</div>
              </div>
            ` : ''}

            ${this.columnVisibility.sino ? `
              <div class="col-text">
                <div class="col-label"><i class="fa-solid fa-language"></i> Phiên âm Hán - Việt</div>
                <div class="text-sino ${this.selfStudyMode ? 'self-study-hidden' : ''}">
                  ${line.sinoVietnamese}
                </div>
              </div>
            ` : ''}

            ${this.columnVisibility.trans ? `
              <div class="col-text">
                <div class="col-label"><i class="fa-solid fa-book-open-reader"></i> Dịch nghĩa / Dịch thơ</div>
                <div class="text-trans ${this.selfStudyMode ? 'self-study-hidden' : ''}">
                  ${processedTrans}
                </div>
              </div>
            ` : ''}

            ${this.columnVisibility.notes ? `
              <div class="col-text">
                <div class="col-label"><i class="fa-solid fa-lightbulb"></i> Chú giải & Nghệ thuật</div>
                <div class="text-notes ${this.selfStudyMode ? 'self-study-hidden' : ''}">
                  ${line.notes}
                </div>
              </div>
            ` : ''}
          </div>

          ${this.showPoeticMeter && work.poeticMeter ? this.renderLinePoeticMeter(work.poeticMeter, line.lineNo) : ''}
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="reader-container animated-fade-in">
        <div class="reader-header">
          <div class="reader-title-group">
            <h2>${work.title}</h2>
            <p>Tác giả: <strong>${work.authorName}</strong> (${work.year}) • Thể loại: ${work.genre}</p>
          </div>

          <div class="reader-controls">
            <button class="btn btn-outline teacher-only" onclick="nomReader.openAddLineModal('${work.id}')">
              <i class="fa-solid fa-plus"></i> Thêm Câu Hán-Nôm
            </button>
            <button class="btn btn-outline teacher-only" onclick="nomReader.openAddAllusionModal()">
              <i class="fa-solid fa-book-journal-whills"></i> Thêm Chú Thích
            </button>
            <button class="btn btn-primary" onclick="academicToolkit.printWorksheet('${work.id}')">
              <i class="fa-solid fa-print"></i> In Phiếu Học Tập
            </button>
            <button class="btn btn-accent" onclick="slideEngine.openPresentation('${work.id}')">
              <i class="fa-solid fa-circle-play"></i> Trình Chiếu Slide
            </button>
            <a href="${work.nomDictionaryLink || 'https://nomfoundation.org/'}" target="_blank" class="btn btn-outline">
              <i class="fa-solid fa-magnifying-glass"></i> Tra Từ Điển Nôm
            </a>
          </div>
        </div>

        <!-- Academic Control Toolbar -->
        <div style="margin-bottom: 20px; padding: 14px 20px; background: var(--bg-parchment); border-radius: 10px; border: 1px solid var(--border-color); display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight: 600; font-size: 0.88rem;">Chế độ hiển thị:</span>
            <label style="cursor:pointer; font-size:0.85rem;"><input type="checkbox" checked onchange="nomReader.toggleColumn('han', this.checked)"> Hán/Nôm</label>
            <label style="cursor:pointer; font-size:0.85rem;"><input type="checkbox" checked onchange="nomReader.toggleColumn('sino', this.checked)"> Phiên âm</label>
            <label style="cursor:pointer; font-size:0.85rem;"><input type="checkbox" checked onchange="nomReader.toggleColumn('trans', this.checked)"> Dịch nghĩa</label>
          </div>

          <div style="display:flex; gap:12px; margin-left:auto;">
            <button class="btn btn-outline ${this.showPoeticMeter ? 'active-toggle' : ''}" onclick="nomReader.togglePoeticMeter()">
              <i class="fa-solid fa-feather"></i> ${this.showPoeticMeter ? 'Tắt Luật Bằng-Trắc' : 'Soi Luật Bằng - Trắc'}
            </button>
            <button class="btn btn-outline ${this.selfStudyMode ? 'active-toggle' : ''}" onclick="nomReader.toggleSelfStudy()">
              <i class="fa-solid fa-eye-slash"></i> ${this.selfStudyMode ? 'Hiện Đáp Án Dịch' : 'Chế Độ Học Sinh Tự Học'}
            </button>
          </div>
        </div>

        <div class="lines-list">
          ${linesHtml}
        </div>

        <!-- Mindmap Section Below -->
        ${work.mindmap ? `
          <div style="margin-top: 36px;">
            ${academicToolkit.renderMindmap(work.id)}
          </div>
        ` : ''}
      </div>

      <!-- Allusion Modal Container -->
      <div id="allusion-modal-overlay" class="modal-overlay" style="display:none;" onclick="nomReader.closeAllusionModal()">
        <div class="modal-card animated-fade-in" onclick="event.stopPropagation()">
          <h3 id="allusion-modal-title" style="font-family:var(--font-heading); color:var(--primary); margin-bottom:10px;"></h3>
          <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:6px;"><strong>Xuất xứ:</strong> <span id="allusion-modal-source"></span></p>
          <div style="background:var(--bg-parchment); padding:14px; border-radius:8px; margin-bottom:14px;">
            <p><strong>Giải nghĩa:</strong> <span id="allusion-modal-meaning"></span></p>
          </div>
          <p style="font-size:0.88rem; font-style:italic;"><strong>Văn cảnh tác phẩm:</strong> <span id="allusion-modal-context"></span></p>
          <div style="text-align:right; margin-top:20px;">
            <button class="btn btn-primary" onclick="nomReader.closeAllusionModal()">Đóng</button>
          </div>
        </div>
      

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
</div>
    `;
  }

  renderLinePoeticMeter(meterArray, lineNo) {
    const item = meterArray.find(m => m.lineNo === lineNo);
    if (!item) return '';

    const meterBadges = item.meter.map(m => `
      <span class="meter-badge ${m === 'B' ? 'meter-bang' : 'meter-trac'}">${m === 'B' ? 'B (Bằng)' : 'T (Trắc)'}</span>
    `).join('');

    return `
      <div class="poetic-meter-box animated-fade-in">
        <strong><i class="fa-solid fa-highlighter"></i> Phân tích Luật Bằng - Trắc:</strong> ${meterBadges}
        ${item.rhyme ? `<span style="margin-left:14px; font-style:italic; font-size:0.85rem; color:var(--primary);">• Vần chính: "${item.rhyme}"</span>` : ''}
      

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
</div>
    `;
  }


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

    const allusion = ALLUSIONS_DB[key];
    if (!allusion) return;

    document.getElementById('allusion-modal-title').innerText = allusion.term;
    document.getElementById('allusion-modal-source').innerText = allusion.source;
    document.getElementById('allusion-modal-meaning').innerText = allusion.meaning;
    document.getElementById('allusion-modal-context').innerText = allusion.context;

    document.getElementById('allusion-modal-overlay').style.display = 'flex';
  }

  closeAllusionModal() {
    document.getElementById('allusion-modal-overlay').style.display = 'none';
  }

  toggleColumn(colName, isVisible) {
    this.columnVisibility[colName] = isVisible;
    if (this.activeWork) {
      this.loadWorkReader(this.activeWork.id);
    }
  }

  toggleSelfStudy() {
    this.selfStudyMode = !this.selfStudyMode;
    if (this.activeWork) {
      this.loadWorkReader(this.activeWork.id);
    }
  }

  togglePoeticMeter() {
    this.showPoeticMeter = !this.showPoeticMeter;
    if (this.activeWork) {
      this.loadWorkReader(this.activeWork.id);
    }
  }
}

const nomReader = new NomParallelReader();
