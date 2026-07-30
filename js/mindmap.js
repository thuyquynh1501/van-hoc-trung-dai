/**
 * Module Sơ Đồ Tư Duy, So Sánh Văn Bản & Xuất Phiếu Học Tập (Enhanced with Custom Comparative Pair Builder)
 */

class AcademicToolkit {
  constructor() {
    this.activePairId = 'comp-1';
    this.loadCustomComparativePairsFromStorage();
  }

  loadCustomComparativePairsFromStorage() {
    try {
      const stored = localStorage.getItem('MEDIEVAL_COMPARATIVE_PAIRS');
      if (stored) {
        const customPairs = JSON.parse(stored);
        customPairs.forEach(p => {
          if (!MEDIEVAL_DATA.comparativePairs.find(existing => existing.id === p.id)) {
            MEDIEVAL_DATA.comparativePairs.push(p);
          }
        });
      }
    } catch (e) {
      console.warn("Could not load comparative pairs from LocalStorage", e);
    }
  }

  saveCustomComparativePairsToStorage() {
    try {
      const customPairs = MEDIEVAL_DATA.comparativePairs.filter(p => p.id.startsWith('custom-comp-'));
      localStorage.setItem('MEDIEVAL_COMPARATIVE_PAIRS', JSON.stringify(customPairs));
    } catch (e) {
      console.warn("Could not save comparative pairs to LocalStorage", e);
    }
  }

  // Render Sơ đồ tư duy dạng Tree Node
  renderMindmap(workId) {
    const work = MEDIEVAL_DATA.works.find(w => w.id === workId);
    if (!work || !work.mindmap) {
      return `<div style="padding:20px; color:var(--text-muted);">Tác phẩm này chưa có Sơ đồ tư duy.</div>`;
    }

    const mm = work.mindmap;
    const nodesHtml = mm.nodes.map(node => `
      <div class="mindmap-node-card animated-fade-in">
        <div class="mindmap-node-title"><i class="fa-solid fa-code-branch"></i> ${node.label}</div>
        <div class="mindmap-node-details">${node.details}</div>
      </div>
    `).join('');

    return `
      <div class="mindmap-container animated-fade-in">
        <h3 class="mindmap-main-title"><i class="fa-solid fa-diagram-project"></i> ${mm.title}</h3>
        <div class="mindmap-tree-grid">
          ${nodesHtml}
        </div>
      </div>
    `;
  }

  // Render Toàn Bộ Trang So Sánh Văn Bản (Kèm nút Tạo Cặp So Sánh Mới)
  renderComparativePage() {
    const pairs = MEDIEVAL_DATA.comparativePairs;
    const activePair = pairs.find(p => p.id === this.activePairId) || pairs[0];

    const buttonsHtml = pairs.map(pair => `
      <div style="display:inline-flex; align-items:center; margin-right:8px; margin-bottom:8px;">
        <button class="btn btn-outline ${pair.id === activePair.id ? 'active-toggle' : ''}" onclick="academicToolkit.switchComparativePair('${pair.id}')">
          <i class="fa-solid fa-columns"></i> ${pair.title}
        </button>
        ${pair.id.startsWith('custom-comp-') ? `
          <button style="border:none; background:none; color:#DC3545; cursor:pointer; margin-left:-6px; padding:4px;" title="Xóa cặp so sánh này" onclick="academicToolkit.deleteCustomPair('${pair.id}')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="animated-fade-in" style="max-width: 1050px; margin: 0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:16px;">
          <div>
            <h2 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--primary);"><i class="fa-solid fa-columns"></i> So Sánh & Đối Chiếu Văn Bản</h2>
            <p style="color:var(--text-muted);">Đặt 2 văn bản / đoạn trích bên cạnh nhau để phân tích nét tương đồng và khác biệt nghệ thuật.</p>
          </div>
          
          <button class="btn btn-primary" onclick="academicToolkit.openCreatePairModal()">
            <i class="fa-solid fa-plus"></i> Tạo Cặp So Sánh Mới
          </button>
        </div>

        <!-- Pair Selection Bar -->
        <div style="margin-bottom:24px;">
          ${buttonsHtml}
        </div>

        <!-- Comparative Content View -->
        <div id="comparative-view-container">
          ${this.renderComparativeView(activePair.id)}
        </div>
      </div>

      <!-- Modal Create Custom Pair -->
      <div id="create-pair-modal" class="modal-overlay" style="display:none;" onclick="academicToolkit.closeCreatePairModal()">
        <div class="modal-card animated-fade-in" onclick="event.stopPropagation()" style="max-width:680px;">
          <h3 style="font-family:var(--font-heading); color:var(--primary); margin-bottom:16px;"><i class="fa-solid fa-columns"></i> Tạo Cặp Văn Bản So Sánh Mới</h3>
          
          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tiêu Đề Chủ Đề So Sánh:</label>
            <input type="text" id="pair-title" placeholder="VD: So sánh thơ Nôm Hồ Xuân Hương vs Thơ Nôm Bà Huyện Thanh Quan" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tiêu Đề Văn Bản 1:</label>
              <input type="text" id="pair-section1-title" placeholder="VD: Bánh Trôi Nước (Hồ Xuân Hương)" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment); margin-bottom:8px;">
              
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Nội Dung Văn Bản 1:</label>
              <textarea id="pair-content1" rows="5" placeholder="Thân em vừa trắng lại vừa tròn..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment); font-family:var(--font-serif);"></textarea>
            </div>

            <div>
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tiêu Đề Văn Bản 2:</label>
              <input type="text" id="pair-section2-title" placeholder="VD: Qua Đèo Ngang (Bà Huyện Thanh Quan)" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment); margin-bottom:8px;">
              
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Nội Dung Văn Bản 2:</label>
              <textarea id="pair-content2" rows="5" placeholder="Bước tới Đèo Ngang bóng xế tà..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment); font-family:var(--font-serif);"></textarea>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px; color:var(--primary);"><i class="fa-solid fa-brain"></i> Nhận Xét & Phân Tích So Sánh:</label>
            <textarea id="pair-analysis" rows="3" placeholder="Nhập tổng kết nét tương đồng và khác biệt giữa 2 văn bản..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--accent-light);"></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn-outline" onclick="academicToolkit.closeCreatePairModal()">Hủy</button>
            <button class="btn btn-primary" onclick="academicToolkit.saveNewPair()">Lưu Cặp So Sánh</button>
          </div>
        </div>
      </div>
    `;
  }

  // Render Màn hình So Sánh 2 Văn Bản
  renderComparativeView(pairId) {
    const pair = MEDIEVAL_DATA.comparativePairs.find(p => p.id === pairId) || MEDIEVAL_DATA.comparativePairs[0];
    if (!pair) return '';

    return `
      <div class="comparative-container animated-fade-in">
        <h2 style="font-family:var(--font-heading); font-size:1.6rem; color:var(--primary); margin-bottom:8px;">${pair.title}</h2>
        <p style="color:var(--text-muted); margin-bottom:24px;">Đặt hai đoạn trích/văn bản cạnh nhau để đối chiếu nghệ thuật và tư tưởng.</p>
        
        <div class="comparative-grid">
          <div class="comp-column">
            <h3 class="comp-header">${pair.section1Title}</h3>
            <div class="comp-box">${pair.content1.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="comp-column">
            <h3 class="comp-header">${pair.section2Title}</h3>
            <div class="comp-box">${pair.content2.replace(/\n/g, '<br>')}</div>
          </div>
        </div>

        <div class="comp-analysis-card">
          <h4><i class="fa-solid fa-brain"></i> Nhận Xét & Phân Tích So Sánh:</h4>
          <p>${pair.analysis}</p>
        </div>
      </div>
    `;
  }

  switchComparativePair(pairId) {
    this.activePairId = pairId;
    const contentBody = document.getElementById('app-content-body');
    if (contentBody) {
      contentBody.innerHTML = this.renderComparativePage();
    }
  }

  openCreatePairModal() {
    const modal = document.getElementById('create-pair-modal');
    if (modal) modal.style.display = 'flex';
  }

  closeCreatePairModal() {
    const modal = document.getElementById('create-pair-modal');
    if (modal) modal.style.display = 'none';
  }

  saveNewPair() {
    const title = document.getElementById('pair-title').value;
    const section1Title = document.getElementById('pair-section1-title').value;
    const content1 = document.getElementById('pair-content1').value;
    const section2Title = document.getElementById('pair-section2-title').value;
    const content2 = document.getElementById('pair-content2').value;
    const analysis = document.getElementById('pair-analysis').value;

    if (!title || !section1Title || !content1 || !section2Title || !content2) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung cho cả 2 văn bản!");
      return;
    }

    const newPair = {
      id: "custom-comp-" + Date.now(),
      title: title,
      workId1: "custom-1",
      section1Title: section1Title,
      content1: content1,
      workId2: "custom-2",
      section2Title: section2Title,
      content2: content2,
      analysis: analysis || "Nhận xét phân tích so sánh giữa 2 văn bản."
    };

    MEDIEVAL_DATA.comparativePairs.push(newPair);
    this.activePairId = newPair.id;
    this.saveCustomComparativePairsToStorage();
    this.closeCreatePairModal();

    const contentBody = document.getElementById('app-content-body');
    if (contentBody) {
      contentBody.innerHTML = this.renderComparativePage();
    }

    alert(`Đã tạo thành công cặp so sánh mới "${title}"!`);
  }

  deleteCustomPair(pairId) {
    if (confirm("Bạn có chắc chắn muốn xóa cặp so sánh này?")) {
      MEDIEVAL_DATA.comparativePairs = MEDIEVAL_DATA.comparativePairs.filter(p => p.id !== pairId);
      this.activePairId = MEDIEVAL_DATA.comparativePairs[0].id;
      this.saveCustomComparativePairsToStorage();

      const contentBody = document.getElementById('app-content-body');
      if (contentBody) {
        contentBody.innerHTML = this.renderComparativePage();
      }
    }
  }

  // Mở cửa sổ in Phiếu Học Tập A4
  printWorksheet(workId) {
    const work = MEDIEVAL_DATA.works.find(w => w.id === workId);
    if (!work) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PHIẾU HỌC TẬP - ${work.title.toUpperCase()}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.5; color: #000; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; }
          .header h2 { margin: 0; text-transform: uppercase; }
          .section { margin-bottom: 20px; }
          .section h3 { background: #eee; padding: 6px; margin: 0 0 10px 0; font-size: 1.1rem; }
          .box { border: 1px dashed #666; min-height: 100px; padding: 10px; margin-top: 6px; }
          .footer { margin-top: 40px; text-align: right; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>PHIẾU HỌC TẬP MÔN NGỮ VĂN - TRUNG ĐẠI</h2>
          <p><strong>Tác phẩm:</strong> ${work.title} | <strong>Tác giả:</strong> ${work.authorName} (${work.year})</p>
        </div>

        <div class="section">
          <h3>I. TRI THỨC VĂN HỌC & NGHỆ THUẬT</h3>
          <p><strong>Thể loại:</strong> ${work.genre}</p>
          <p><strong>Tóm tắt nội dung chính:</strong> ${work.description}</p>
        </div>

        <div class="section">
          <h3>II. CÂU HỎI ĐỌC HIỂU TƯƠNG TÁC</h3>
          <p>1. Phân tích bối cảnh ra đời và cảm hứng chủ đạo của tác phẩm?</p>
          <div class="box"></div>
          <p>2. Chỉ ra các điển tích/điển cố hoặc biện pháp nghệ thuật tiêu biểu được sử dụng trong bài?</p>
          <div class="box"></div>
        </div>

        <div class="section">
          <h3>III. ĐỀ BÀI KẾT NỐI TRI THỨC (GDPT 2018)</h3>
          <p>${work.writingPrompt || 'Viết đoạn văn ngắn (150 - 200 chữ) thể hiện suy nghĩ của em sau khi học xong tác phẩm.'}</p>
          <div class="box" style="min-height: 180px;"></div>
        </div>

        <div class="footer">
          <p>Họ và tên học sinh: .............................................................. Lớp: .............</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}

const academicToolkit = new AcademicToolkit();
