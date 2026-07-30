/**
 * Module Quan Ly Kho Tai Lieu & Phuong Phap Day Hoc (Word/PPT/PDF & Teaching Methods Hub)
 */

class DocumentManager {
  constructor() {
    this.activeTab = 'general'; // 'general' | 'methods'
    this.docFilterType = 'all';
    this.methodSearchQuery = '';
    
    this.documents = [
      {
        id: 'doc-1',
        name: 'Giao_an_Binh_Ngo_Dai_Cao_GDPT2018.docx',
        type: 'word',
        size: '1.2 MB',
        uploadDate: '2026-07-25',
        description: 'Giáo án chi tiết phát triển năng lực bài Bình Ngô Đại Cáo theo chương trình GDPT 2018.',
        methodId: 'method-1',
        url: '#'
      },
      {
        slideNo: 1,
        id: 'doc-2',
        name: 'Slide_Giang_Day_Truyen_Kieu_Full.pptx',
        type: 'ppt',
        size: '4.8 MB',
        uploadDate: '2026-07-26',
        description: 'Bộ Slide trình chiếu bài Chị Em Thúy Kiều kèm ghi chú sư phạm.',
        methodId: 'method-2',
        url: '#'
      },
      {
        id: 'doc-3',
        name: 'Phieu_Hoc_Tap_Dien_Tich_Han_Nom.pdf',
        type: 'pdf',
        size: '850 KB',
        uploadDate: '2026-07-27',
        description: 'Phiếu bài tập tra cứu 20 Điển tích điển cố tiêu biểu trong Văn học Trung đại.',
        methodId: 'method-3',
        url: '#'
      }
    ];

    this.teachingMethods = [
      {
        id: 'method-1',
        title: 'Kỹ Thuật Mảnh Ghép Trong Phân Tích Bình Ngô Đại Cáo',
        category: 'Kỹ Thuật Dạy Học Tương Tác',
        description: 'Chia lớp thành các nhóm chuyên gia phân tích 4 đoạn của Bình Ngô Đại Cáo, sau đó ghép lại nhóm mảnh ghép để tổng hợp bức tranh toàn cảnh.',
        steps: [
          'Vòng 1 (Nhóm chuyên gia): Nhóm 1 tìm hiểu Tiền đề Nhân nghĩa; Nhóm 2 tìm hiểu Tội ác giặc Minh; Nhóm 3 tìm hiểu Kháng chiến Lam Sơn.',
          'Vòng 2 (Nhóm mảnh ghép): Mỗi nhóm mới gồm đại diện từ 3 nhóm trên, chia sẻ và tổng hợp toàn bộ bài học.'
        ],
        attachedDocs: [
          { name: 'Phan_Cong_Nhom_Manh_Ghep.docx', type: 'word', size: '450 KB' }
        ]
      },
      {
        id: 'method-2',
        title: 'Phương Pháp Đóng Vai & Sân Sấu Hóa Tác Phẩm Hán - Nôm',
        category: 'Phương Pháp Diễn Xướng & Sân Sấu',
        description: 'Học sinh chuyển thể các đoạn trích Truyện Kiều hoặc Hịch Tướng Sĩ thành kịch bản sân khấu nhỏ để hiểu sâu tâm lý nhân vật.',
        steps: [
          'Bước 1: Đọc hiểu và phân tích tâm lý nhân vật.',
          'Bước 2: Viết kịch bản đoạn hội thoại ngắn (10-15 phút).',
          'Bước 3: Tập luyện diễn xuất và trình diễn trước lớp.'
        ],
        attachedDocs: [
          { name: 'Kich_Ban_San_Stau_Thuy_Kieu.docx', type: 'word', size: '1.1 MB' }
        ]
      },
      {
        id: 'method-3',
        title: 'Phương Pháp Dạy Học Dự Án: Triển Lãm Điển Tích Văn Học',
        category: 'Dạy Học Dự Án GDPT 2018',
        description: 'Học sinh thiết kế ấn phẩm, infographics hoặc poster giải nghĩa các Điển tích Điển cố trong Thơ Nôm.',
        steps: [
          'Bước 1: Chọn danh mục 5 điển tích trong tác phẩm.',
          'Bước 2: Nguồn gốc điển tích và ý nghĩa sáng tạo của tác giả.',
          'Bước 3: Trưng bày ấn phẩm tại góc học tập của lớp.'
        ],
        attachedDocs: [
          { name: 'Huong_Dan_Du_An_Dien_Tich.pdf', type: 'pdf', size: '920 KB' }
        ]
      }
    ];

    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const storedDocs = localStorage.getItem('MEDIEVAL_DOCUMENTS');
      if (storedDocs) {
        this.documents = JSON.parse(storedDocs);
      }
      const storedMethods = localStorage.getItem('MEDIEVAL_TEACHING_METHODS');
      if (storedMethods) {
        this.teachingMethods = JSON.parse(storedMethods);
      }
    } catch (e) {
      console.warn("Could not load documents/methods from LocalStorage", e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('MEDIEVAL_DOCUMENTS', JSON.stringify(this.documents));
      localStorage.setItem('MEDIEVAL_TEACHING_METHODS', JSON.stringify(this.teachingMethods));
    } catch (e) {
      console.warn("Could not save documents/methods to LocalStorage", e);
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    this.renderDocumentsView();
  }

  renderDocumentsView() {
    const contentBody = document.getElementById('app-content-body');
    if (!contentBody) return;

    contentBody.innerHTML = `
      <div class="animated-fade-in" style="max-width: 1050px; margin: 0 auto;">
        <!-- Header & Main Tabs -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:16px;">
          <div>
            <h2 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--primary);">
              <i class="fa-solid fa-folder-open"></i> Kho Tài Liệu & Phương Pháp Dạy Học
            </h2>
            <p style="color:var(--text-muted);">Lưu trữ tài liệu Word, PPT, PDF và quản lý các phương pháp dạy học chuẩn GDPT 2018.</p>
          </div>
        </div>

        <!-- 2 Main Sub-Section Tabs -->
        <div style="display:flex; border-bottom:2px solid var(--border-color); margin-bottom:24px;">
          <button class="btn ${this.activeTab === 'general' ? 'btn-primary' : 'btn-outline'}" style="border-bottom-left-radius:0; border-bottom-right-radius:0; border-bottom:none; margin-right:8px;" onclick="docManager.switchTab('general')">
            <i class="fa-solid fa-box-archive"></i> Phần 1: Tổng Kho Tài Liệu (${this.documents.length} File)
          </button>
          <button class="btn ${this.activeTab === 'methods' ? 'btn-primary' : 'btn-outline'}" style="border-bottom-left-radius:0; border-bottom-right-radius:0; border-bottom:none;" onclick="docManager.switchTab('methods')">
            <i class="fa-solid fa-chalkboard-user"></i> Phần 2: Phương Pháp Dạy Học (${this.teachingMethods.length} Phương Pháp)
          </button>
        </div>

        <!-- Dynamic Content Based on Active Tab -->
        <div id="tab-content-container">
          ${this.activeTab === 'general' ? this.renderGeneralDocsSection() : this.renderTeachingMethodsSection()}
        </div>
      </div>
    `;
  }

  /* ================= PHẦN 1: TỔNG KHO TÀI LIỆU ================= */
  renderGeneralDocsSection() {
    let filteredDocs = this.documents;
    if (this.docFilterType !== 'all') {
      filteredDocs = filteredDocs.filter(d => d.type === this.docFilterType);
    }

    return `
      <!-- Upload Dropzone -->
      <div class="upload-dropzone" id="doc-dropzone" onclick="document.getElementById('file-input-trigger').click()">
        <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2.5rem; color: var(--primary); margin-bottom: 12px;"></i>
        <h3 style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 6px;">Kéo thả tệp tài liệu vào đây hoặc nhấp để chọn tệp</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Hỗ trợ các định dạng tệp: Word (.doc, .docx), PowerPoint (.ppt, .pptx), PDF (.pdf)</p>
        <input type="file" id="file-input-trigger" multiple accept=".doc,.docx,.ppt,.pptx,.pdf" style="display: none;" onchange="docManager.handleFileSelect(event)">
      </div>

      <!-- File Type Filter Buttons -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:16px;">
        <div class="period-pills">
          <button class="pill-btn ${this.docFilterType === 'all' ? 'active' : ''}" onclick="docManager.filterDocs('all')">Tất cả tệp (${this.documents.length})</button>
          <button class="pill-btn ${this.docFilterType === 'word' ? 'active' : ''}" onclick="docManager.filterDocs('word')"><i class="fa-solid fa-file-word"></i> Word</button>
          <button class="pill-btn ${this.docFilterType === 'ppt' ? 'active' : ''}" onclick="docManager.filterDocs('ppt')"><i class="fa-solid fa-file-powerpoint"></i> PowerPoint</button>
          <button class="pill-btn ${this.docFilterType === 'pdf' ? 'active' : ''}" onclick="docManager.filterDocs('pdf')"><i class="fa-solid fa-file-pdf"></i> PDF</button>
        </div>
      </div>

      <!-- Documents Cards Grid -->
      <div class="documents-grid">
        ${filteredDocs.length > 0 ? filteredDocs.map(doc => this.renderDocCard(doc)).join('') : '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">Chưa có tệp tài liệu nào trong danh mục này.</div>'}
      </div>
    `;
  }

  renderDocCard(doc) {
    let iconClass = 'fa-file-lines';
    let badgeBg = '#E9ECEF';
    let badgeColor = '#495057';

    if (doc.type === 'word') {
      iconClass = 'fa-file-word';
      badgeBg = '#E8F1FF';
      badgeColor = '#0B5ED7';
    } else if (doc.type === 'ppt') {
      iconClass = 'fa-file-powerpoint';
      badgeBg = '#FFF0EB';
      badgeColor = '#D9381E';
    } else if (doc.type === 'pdf') {
      iconClass = 'fa-file-pdf';
      badgeBg = '#FFEBEB';
      badgeColor = '#DC3545';
    }

    const attachedMethod = this.teachingMethods.find(m => m.id === doc.methodId);

    return `
      <div class="doc-card animated-fade-in">
        <div style="display: flex; gap: 14px; align-items: flex-start; margin-bottom: 12px;">
          <div class="doc-icon-badge" style="background: ${badgeBg}; color: ${badgeColor};">
            <i class="fa-solid ${iconClass}"></i>
          </div>
          <div style="flex: 1; overflow: hidden;">
            <h4 class="doc-title" title="${doc.name}">${doc.name}</h4>
            <div class="doc-meta">${doc.size} • Upload: ${doc.uploadDate}</div>
          </div>
        </div>

        <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${doc.description || 'Không có mô tả.'}
        </p>

        ${attachedMethod ? `
          <div style="font-size: 0.78rem; background: var(--accent-light); border: 1px solid var(--accent); padding: 4px 8px; border-radius: 6px; margin-bottom: 12px; color: #7A5C00;">
            <i class="fa-solid fa-link"></i> Phương pháp: <strong>${attachedMethod.title}</strong>
          </div>
        ` : ''}

        <div style="display: flex; gap: 8px; margin-top: auto;">
          <button class="btn btn-outline" style="flex: 1; font-size: 0.8rem; padding: 6px;" onclick="docManager.downloadDoc('${doc.id}')">
            <i class="fa-solid fa-download"></i> Tải Về
          </button>
          <button class="btn btn-outline" style="padding: 6px 10px; font-size: 0.8rem; color: #DC3545; border-color: #DC3545;" onclick="docManager.deleteDoc('${doc.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }

  filterDocs(type) {
    this.docFilterType = type;
    this.renderDocumentsView();
  }

  handleFileSelect(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      let type = 'word';
      if (f.name.endsWith('.ppt') || f.name.endsWith('.pptx')) type = 'ppt';
      if (f.name.endsWith('.pdf')) type = 'pdf';

      const newDoc = {
        id: 'doc-' + Date.now() + '-' + i,
        name: f.name,
        type: type,
        size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        description: 'Tài liệu giáo án / bài giảng do giáo viên tải lên.',
        url: '#'
      };

      this.documents.unshift(newDoc);
    }

    this.saveToStorage();
    this.renderDocumentsView();
    alert(`Đã tải lên thành công ${files.length} tệp tài liệu mới!`);
  }

  deleteDoc(id) {
    if (confirm("Bạn có chắc chắn muốn xóa tệp tài liệu này?")) {
      this.documents = this.documents.filter(d => d.id !== id);
      this.saveToStorage();
      this.renderDocumentsView();
    }
  }

  downloadDoc(id) {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      alert(`Đang khởi tạo tải tệp "${doc.name}" về máy tính...`);
    }
  }

  /* ================= PHẦN 2: PHƯƠNG PHÁP DẠY HỌC ================= */
  renderTeachingMethodsSection() {
    let filteredMethods = this.teachingMethods;
    if (this.methodSearchQuery) {
      filteredMethods = filteredMethods.filter(m => 
        m.title.toLowerCase().includes(this.methodSearchQuery) ||
        m.category.toLowerCase().includes(this.methodSearchQuery) ||
        m.description.toLowerCase().includes(this.methodSearchQuery)
      );
    }

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:16px;">
        <div style="position:relative; width:360px;">
          <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted);"></i>
          <input type="text" placeholder="Tìm phương pháp dạy học..." value="${this.methodSearchQuery}" oninput="docManager.filterMethods(this.value)" style="width:100%; padding:10px 14px 10px 40px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-card); font-size:0.9rem;">
        </div>

        <button class="btn btn-primary" onclick="docManager.openAddMethodModal()">
          <i class="fa-solid fa-plus"></i> Thêm Phương Pháp Mới
        </button>
      </div>

      <!-- Methods Grid -->
      <div style="display:flex; flex-direction:column; gap:20px;">
        ${filteredMethods.length > 0 ? filteredMethods.map(m => this.renderMethodCard(m)).join('') : '<div style="text-align:center; padding:40px; color:var(--text-muted); background:var(--bg-card); border-radius:12px;">Không tìm thấy phương pháp dạy học phù hợp.</div>'}
      </div>

      <!-- Modal Add Method -->
      <div id="add-method-modal" class="modal-overlay" style="display:none;" onclick="docManager.closeAddMethodModal()">
        <div class="modal-card animated-fade-in" onclick="event.stopPropagation()" style="max-width:640px;">
          <h3 style="font-family:var(--font-heading); color:var(--primary); margin-bottom:16px;"><i class="fa-solid fa-chalkboard-user"></i> Thêm Phương Pháp Dạy Học Mới</h3>
          
          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tên Phương Pháp / Kỹ Thuật Dạy Học:</label>
            <input type="text" id="new-method-title" placeholder="VD: Kỹ Thuật Mảnh Ghép Trong Thơ Nôm" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Phân Loại Phương Pháp:</label>
            <input type="text" id="new-method-category" placeholder="VD: Kỹ Thuật Dạy Học Tương Tác / Dạy Học Dự Án" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Mô Tả Mục Tiêu & Yêu Cầu Cần Đạt:</label>
            <textarea id="new-method-desc" rows="3" placeholder="Mô tả mục tiêu sư phạm của phương pháp..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Các Bước Tiến Hành Giảng Dạy (Mỗi dòng 1 bước):</label>
            <textarea id="new-method-steps" rows="3" placeholder="Bước 1: ...&#10;Bước 2: ..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn-outline" onclick="docManager.closeAddMethodModal()">Hủy</button>
            <button class="btn btn-primary" onclick="docManager.saveNewMethod()">Lưu Phương Pháp</button>
          </div>
        </div>
      </div>
    `;
  }

  renderMethodCard(method) {
    const attachedDocsForMethod = this.documents.filter(d => d.methodId === method.id)
      .concat(method.attachedDocs || []);

    return `
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-left:5px solid var(--primary); border-radius:14px; padding:24px; position:relative;" class="animated-fade-in">
        <button style="position:absolute; top:16px; right:16px; border:none; background:none; color:#DC3545; cursor:pointer; font-size:1rem;" title="Xóa phương pháp" onclick="docManager.deleteMethod('${method.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>

        <span style="font-size:0.78rem; font-weight:700; color:var(--primary); background:var(--primary-light); padding:4px 10px; border-radius:6px;">${method.category}</span>
        <h3 style="font-family:var(--font-heading); font-size:1.35rem; margin:10px 0 8px 0; color:var(--text-main);">${method.title}</h3>
        <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:16px;">${method.description}</p>

        <!-- Steps list -->
        <div style="background:var(--bg-parchment); padding:16px; border-radius:10px; margin-bottom:16px;">
          <strong style="font-size:0.85rem; color:var(--primary);"><i class="fa-solid fa-list-check"></i> Các Bước Thực Hiện Giảng Dạy:</strong>
          <ul style="margin-top:8px; padding-left:20px; font-size:0.88rem; color:var(--text-main);">
            ${(method.steps || []).map(s => `<li style="margin-bottom:4px;">${s}</li>`).join('')}
          </ul>
        </div>

        <!-- Attached Documents Section -->
        <div style="border-top:1px solid var(--border-color); padding-top:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <strong style="font-size:0.82rem; color:var(--text-muted);"><i class="fa-solid fa-paperclip"></i> Tài Liệu Đi Đính Kèm (${attachedDocsForMethod.length}):</strong>
            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:6px;">
              ${attachedDocsForMethod.length > 0 ? attachedDocsForMethod.map(d => `
                <span style="font-size:0.78rem; background:var(--bg-parchment); border:1px solid var(--border-color); padding:4px 8px; border-radius:6px;">
                  <i class="fa-solid fa-file"></i> ${d.name}
                </span>
              `).join('') : '<span style="font-size:0.78rem; color:var(--text-muted); font-style:italic;">Chưa gắn tài liệu.</span>'}
            </div>
          </div>

          <button class="btn btn-outline" style="font-size:0.8rem; padding:6px 12px;" onclick="docManager.attachFileToMethod('${method.id}')">
            <i class="fa-solid fa-paperclip"></i> Gắn Tài Liệu Tương Ứng
          </button>
        </div>
      </div>
    `;
  }

  filterMethods(query) {
    this.methodSearchQuery = query.toLowerCase();
    this.renderDocumentsView();
  }

  openAddMethodModal() { document.getElementById('add-method-modal').style.display = 'flex'; }
  closeAddMethodModal() { document.getElementById('add-method-modal').style.display = 'none'; }

  saveNewMethod() {
    const title = document.getElementById('new-method-title').value;
    const category = document.getElementById('new-method-category').value;
    const desc = document.getElementById('new-method-desc').value;
    const stepsRaw = document.getElementById('new-method-steps').value;

    if (!title || !category) {
      alert("Vui lòng điền tên phương pháp và phân loại!");
      return;
    }

    const newMethod = {
      id: "method-" + Date.now(),
      title: title,
      category: category,
      description: desc || "Phương pháp dạy học phát triển năng lực GDPT 2018.",
      steps: stepsRaw ? stepsRaw.split('\n').filter(s => s.trim() !== '') : ["Thực hiện theo giáo án."],
      attachedDocs: []
    };

    this.teachingMethods.unshift(newMethod);
    this.saveToStorage();
    this.closeAddMethodModal();
    this.renderDocumentsView();
    alert(`Đã thêm thành công phương pháp dạy học "${title}"!`);
  }

  deleteMethod(methodId) {
    if (confirm("Bạn có chắc chắn muốn xóa phương pháp dạy học này?")) {
      this.teachingMethods = this.teachingMethods.filter(m => m.id !== methodId);
      this.saveToStorage();
      this.renderDocumentsView();
    }
  }

  attachFileToMethod(methodId) {
    const docName = prompt("Nhập tên tệp tài liệu cần gắn vào phương pháp này (VD: Giao_an_Thao_luan.docx):");
    if (!docName) return;

    const method = this.teachingMethods.find(m => m.id === methodId);
    if (method) {
      if (!method.attachedDocs) method.attachedDocs = [];
      method.attachedDocs.push({
        name: docName,
        type: docName.endsWith('.pdf') ? 'pdf' : (docName.endsWith('.ppt') || docName.endsWith('.pptx') ? 'ppt' : 'word'),
        size: '1.0 MB'
      });
      this.saveToStorage();
      this.renderDocumentsView();
      alert(`Đã gắn tệp "${docName}" vào phương pháp "${method.title}"!`);
    }
  }
}

const docManager = new DocumentManager();
