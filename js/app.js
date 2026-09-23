/**
 * Application Router & Main Controller (Academic Edition - Slide Giảng Dạy Hub & Full CRUD)
 */

class MedievalApp {
  constructor() {
    this.currentView = 'library';
    this.selectedPeriod = 'all';
    this.searchQuery = '';
    
    // Search states for specific views
    this.authorSearchQuery = '';
    this.periodSearchQuery = '';
    this.writingSearchQuery = '';
    this.slideSearchQuery = '';

    // Slide Builder State
    this.editingDeckId = null;
    this.builderSlides = [];

    this.loadAllStorageData();
    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindSearch();
    this.renderView('library');
  }

  loadAllStorageData() {
    try {
      const storedWorks = localStorage.getItem('CUSTOM_MEDIEVAL_WORKS');
      if (storedWorks) {
        const customWorks = JSON.parse(storedWorks);
        customWorks.forEach(w => {
          if (!MEDIEVAL_DATA.works.find(existing => existing.id === w.id)) {
            MEDIEVAL_DATA.works.unshift(w);
          }
        });
      }

      const storedAuthors = localStorage.getItem('CUSTOM_MEDIEVAL_AUTHORS');
      if (storedAuthors) {
        const customAuthors = JSON.parse(storedAuthors);
        customAuthors.forEach(a => {
          if (!MEDIEVAL_DATA.authors.find(existing => existing.id === a.id)) {
            MEDIEVAL_DATA.authors.unshift(a);
          }
        });
      }

      const storedPeriods = localStorage.getItem('CUSTOM_MEDIEVAL_PERIODS');
      if (storedPeriods) {
        const customPeriods = JSON.parse(storedPeriods);
        customPeriods.forEach(p => {
          if (!MEDIEVAL_DATA.periods.find(existing => existing.id === p.id)) {
            MEDIEVAL_DATA.periods.push(p);
          }
        });
      }

      const storedWriting = localStorage.getItem('CUSTOM_MEDIEVAL_WRITING');
      if (storedWriting) {
        const customWriting = JSON.parse(storedWriting);
        customWriting.forEach(wp => {
          if (!MEDIEVAL_DATA.writingPromptsList.find(existing => existing.id === wp.id)) {
            MEDIEVAL_DATA.writingPromptsList.unshift(wp);
          }
        });
      }
      const storedSlides = localStorage.getItem('CUSTOM_MEDIEVAL_SLIDES');
      if (storedSlides) {
        const customSlides = JSON.parse(storedSlides);
        customSlides.forEach(slideData => {
          const work = MEDIEVAL_DATA.works.find(w => w.id === slideData.workId);
          if (work) work.slides = slideData.slides;
        });
      }
    } catch (e) {
      console.warn("Could not load storage data", e);
    }
    
    // Firebase Real-time Listeners
    if (window.FirestoreSync) {
      FirestoreSync.listen('CUSTOM_MEDIEVAL_SLIDES', (data) => {
        if (!data) return;
        data.forEach(slideData => {
          const work = MEDIEVAL_DATA.works.find(w => w.id === slideData.workId);
          if (work) work.slides = slideData.slides;
        });
        if(this.currentView === 'slide-builder') this.renderView('slide-builder');
      });
      FirestoreSync.listen('CUSTOM_MEDIEVAL_WORKS', (data) => {
        if (!data) return;
        MEDIEVAL_DATA.works = MEDIEVAL_DATA.works.filter(w => !w.id.startsWith('custom-work-'));
        MEDIEVAL_DATA.works.unshift(...data);
        if(this.currentView === 'library') this.renderWorksGrid();
      });

      FirestoreSync.listen('CUSTOM_MEDIEVAL_AUTHORS', (data) => {
        if (!data) return;
        MEDIEVAL_DATA.authors = MEDIEVAL_DATA.authors.filter(a => !a.id.startsWith('custom-author-'));
        MEDIEVAL_DATA.authors.unshift(...data);
        if(this.currentView === 'authors') this.renderView('authors');
      });

      FirestoreSync.listen('CUSTOM_MEDIEVAL_PERIODS', (data) => {
        if (!data) return;
        MEDIEVAL_DATA.periods = MEDIEVAL_DATA.periods.filter(p => !p.id.startsWith('custom-period-'));
        MEDIEVAL_DATA.periods.push(...data);
        if(this.currentView === 'periods') this.renderView('periods');
      });

      FirestoreSync.listen('CUSTOM_MEDIEVAL_WRITING', (data) => {
        if (!data) return;
        MEDIEVAL_DATA.writingPromptsList = MEDIEVAL_DATA.writingPromptsList.filter(wp => !wp.id.startsWith('custom-wp-'));
        MEDIEVAL_DATA.writingPromptsList.unshift(...data);
        if(this.currentView === 'writing') this.filterWriting(this.writingSearchQuery || '');
      });
    }
  }

  saveStorageData(key, dataFilter) {
    try {
      localStorage.setItem(key, JSON.stringify(dataFilter));
      if(window.FirestoreSync) {
        window.FirestoreSync.save(key, dataFilter);
      }
    } catch (e) {
      console.warn(`Could not save data for ${key}`, e);
    }
  }

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = item.dataset.view;
        
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        this.renderView(targetView);
      });
    });
  }

  bindSearch() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        if (this.currentView === 'library') {
          this.renderWorksGrid();
        }
      });
    }
  }

  renderView(viewName) {
    this.currentView = viewName;
    const contentBody = document.getElementById('app-content-body');
    if (!contentBody) return;

    if (viewName === 'library') {
      contentBody.innerHTML = `
        <div class="hero-banner animated-fade-in">
          <div class="hero-content">
            <span class="hero-tag"><i class="fa-solid fa-graduation-cap"></i> Tài Liệu Giảng Dạy Văn Học</span>
            <h1 class="hero-title">Văn Học Trung Đại Việt Nam</h1>
            <p class="hero-desc">Hệ thống tra cứu tác phẩm, đối chiếu bản dịch Hán - Nôm, giải nghĩa Điển tích, soi luật Bằng-Trắc, kho tài liệu Word/PPT/PDF, trò chơi học tập và kho Slide bài giảng tương tác.</p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">4</span>
                <span class="stat-label">Giai đoạn Lịch sử</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">100%</span>
                <span class="stat-label">Chuẩn GDPT 2018</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">Slide HUB</span>
                <span class="stat-label">Kho Slide Giảng Dạy</span>
              </div>
            </div>
          </div>
        </div>

        <div class="filter-bar">
          <div class="period-pills">
            <button class="pill-btn ${this.selectedPeriod === 'all' ? 'active' : ''}" onclick="app.filterPeriod('all')">Tất cả Giai đoạn</button>
            ${MEDIEVAL_DATA.periods.map(p => `
              <button class="pill-btn ${this.selectedPeriod === p.id ? 'active' : ''}" onclick="app.filterPeriod('${p.id}')">${p.name}</button>
            `).join('')}
          </div>
        </div>

        <div class="works-grid" id="works-grid-container"></div>
      `;
      this.renderWorksGrid();
    } 
    else if (viewName === 'reader') {
      contentBody.innerHTML = `<div id="view-reader-container"></div>`;
      if (MEDIEVAL_DATA.works.length > 0) {
        nomReader.loadWorkReader(MEDIEVAL_DATA.works[0].id);
      }
    } 
    else if (viewName === 'documents') {
      docManager.renderDocumentsView();
    }
    else if (viewName === 'games') {
      gamesManager.renderGamesView();
    }
    else if (viewName === 'comparative') {
      contentBody.innerHTML = academicToolkit.renderComparativePage();
    }
    else if (viewName === 'authors') {
      this.renderAuthorsView(contentBody);
    }
    else if (viewName === 'periods') {
      this.renderPeriodsView(contentBody);
    }
    else if (viewName === 'quizzes') {
      contentBody.innerHTML = `
        <div class="animated-fade-in" style="max-width: 800px; margin:0 auto;">
          <h2 style="font-family:var(--font-heading); font-size:1.8rem; margin-bottom:8px; color:var(--primary);">Củng Cố Kiến Thức & Thảo Luận Lớp Học</h2>
          <p style="color:var(--text-muted); margin-bottom:28px;">Ngân hàng câu hỏi trắc nghiệm tương tác dùng cho tiết học ôn tập hoặc khởi động bài mới.</p>
          <div id="quiz-list-container">
            ${MEDIEVAL_DATA.quizzes.map(q => `
              <div class="quiz-card" id="quiz-card-${q.id}">
                <div class="quiz-question">${q.question}</div>
                <div class="quiz-options">
                  ${q.options.map((opt, idx) => `
                    <button class="quiz-option-btn" onclick="app.checkQuizAnswer('${q.id}', ${idx})">${opt}</button>
                  `).join('')}
                </div>
                <div id="quiz-feedback-${q.id}" style="margin-top:16px; display:none; padding:12px; border-radius:8px; font-size:0.9rem;"></div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    else if (viewName === 'writing') {
      this.renderWritingView(contentBody);
    }
    else if (viewName === 'slide-builder') {
      this.renderSlidesHubView(contentBody);
    }
  }

  /* PHÂN HỆ SLIDE GIẢNG DẠY HUB (DANH SÁCH & BIÊN SOẠN) */
  renderSlidesHubView(container) {
    const allWorksWithSlides = MEDIEVAL_DATA.works.filter(w => w.slides && w.slides.length > 0);

    container.innerHTML = `
      <div class="animated-fade-in" style="max-width: 1050px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:16px;">
          <div>
            <h2 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--primary);"><i class="fa-solid fa-chalkboard-user"></i> Slide Giảng Dạy & Biên Soạn</h2>
            <p style="color:var(--text-muted);">Quản lý danh sách bộ slide đã tạo, trình chiếu trực tiếp hoặc biên soạn slide bài giảng mới.</p>
          </div>
          
          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" class="btn btn-outline teacher-only" onclick="app.openNewSlideBuilder()">
              <i class="fa-solid fa-plus"></i> Tạo Bộ Slide Mới
            </button>
          </div>
        </div>

        <!-- Search Bar for Slides -->
        <div style="margin-bottom:24px; position:relative; max-width:400px;">
          <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted);"></i>
          <input type="text" id="slide-search-input" placeholder="Tìm bộ slide bài giảng..." oninput="app.filterSlideDecks(this.value)" style="width:100%; padding:10px 14px 10px 40px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-card); font-size:0.9rem;">
        </div>

        <!-- Slides Decks Grid -->
        <div id="slides-grid-container" class="works-grid">
          ${this.renderSlideDecksGrid(allWorksWithSlides)}
        </div>

        <!-- Inline Editor Section Container (Hidden by default) -->
        <div id="slide-editor-section" style="display:none; margin-top:36px; border-top:2px dashed var(--border-color); padding-top:32px;"></div>
      </div>
    `;
  }

  renderSlideDecksGrid(worksList) {
    if (!worksList || worksList.length === 0) {
      return `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted); background:var(--bg-card); border-radius:12px; border:1px solid var(--border-color);">Không tìm thấy bộ slide phù hợp. Hãy tạo bộ slide mới!</div>`;
    }

    return worksList.map(work => `
      <div class="work-card animated-fade-in">
        <div>
          <div class="work-header">
            <span class="work-genre"><i class="fa-solid fa-layer-group"></i> ${work.slides ? work.slides.length : 0} Slide</span>
            <span class="work-year">${work.year}</span>
          </div>
          <h3 class="work-title">${work.title}</h3>
          <p class="work-author">Tác giả / GV: ${work.authorName}</p>
          <p class="work-desc">${work.description}</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">
          <button class="btn btn-accent" style="justify-center;" onclick="slideEngine.openPresentation('${work.id}')">
            <i class="fa-solid fa-circle-play"></i> Trình Chiếu Fullscreen
          </button>

          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline" style="flex:1; justify-content:center; font-size:0.82rem;" class="btn btn-outline teacher-only" onclick="app.editSlideDeck('${work.id}')">
              <i class="fa-solid fa-pen-to-square"></i> Chỉnh Sửa
            </button>
            ${work.id.startsWith('custom-') ? `
              <button class="btn teacher-only btn-outline" style="padding:6px 12px; font-size:0.82rem; color:#DC3545; border-color:#DC3545;" onclick="app.deleteSlideDeck('${work.id}')">
                <i class="fa-solid fa-trash"></i>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  filterSlideDecks(query) {
    this.slideSearchQuery = query.toLowerCase();
    const filtered = MEDIEVAL_DATA.works.filter(w => 
      w.slides && w.slides.length > 0 &&
      (w.title.toLowerCase().includes(this.slideSearchQuery) ||
       w.authorName.toLowerCase().includes(this.slideSearchQuery) ||
       w.description.toLowerCase().includes(this.slideSearchQuery))
    );
    const container = document.getElementById('slides-grid-container');
    if (container) container.innerHTML = this.renderSlideDecksGrid(filtered);
  }

  openNewSlideBuilder() {
    this.editingDeckId = null;
    this.builderSlides = [
      {
        slideNo: 1,
        title: "TỔNG QUAN BÀI HỌC",
        subtitle: "Đặt Vấn Đề & Yêu Cầu Cần Đạt",
        type: "intro",
        content: ["**Mục tiêu bài học**: Nắm vững hoàn cảnh sáng tác và tư tưởng chủ đạo.", "**Thể loại**: Thơ Nôm Đường luật / Biền ngẫu.", "**Năng lực cần đạt**: Bút pháp nghệ thuật & Ý nghĩa bài học."],
        teacherNotes: "Gợi ý: Cho học sinh đọc diễn cảm bài thơ trước khi phân tích."
      },
      {
        slideNo: 2,
        title: "PHẦN 1: PHÂN TÍCH NỘI DUNG",
        subtitle: "Luận Điểm & Hình Tượng Trung Tâm",
        type: "analysis",
        content: ["**Luận điểm 1**: Hình ảnh trung tâm bài thơ.", "**Biện pháp nghệ thuật**: Ước lệ tượng trưng và phép đối ngẫu.", "**Giá trị tư tưởng**: Lòng yêu nước / Cảm hứng nhân đạo."],
        teacherNotes: "Hướng dẫn học sinh thảo luận cặp đôi về hình tượng nhân vật."
      }
    ];

    const editorSec = document.getElementById('slide-editor-section');
    if (editorSec) {
      editorSec.style.display = 'block';
      this.renderSlideBuilderForm(editorSec, "Tạo Bộ Slide Bài Giảng Mới", "Bài Giảng Mới", "Giáo viên");
      editorSec.scrollIntoView({ behavior: 'smooth' });
    }
  }

  editSlideDeck(workId) {
    const work = MEDIEVAL_DATA.works.find(w => w.id === workId);
    if (!work || !work.slides) return;

    this.editingDeckId = work.id;
    this.builderSlides = JSON.parse(JSON.stringify(work.slides));

    const editorSec = document.getElementById('slide-editor-section');
    if (editorSec) {
      editorSec.style.display = 'block';
      this.renderSlideBuilderForm(editorSec, `Chỉnh Sửa Bộ Slide: "${work.title}"`, work.title, work.authorName, work.genre, work.description);
      editorSec.scrollIntoView({ behavior: 'smooth' });
    }
  }

  deleteSlideDeck(workId) {
    if (!window.isTeacher) { alert('Chỉ giáo viên mới có quyền thao tác!'); return; }
    if (confirm("Bạn có chắc chắn muốn xóa bộ slide bài giảng này?")) {
      MEDIEVAL_DATA.works = MEDIEVAL_DATA.works.filter(w => w.id !== workId);
      this.saveStorageData('CUSTOM_MEDIEVAL_WORKS', MEDIEVAL_DATA.works.filter(w => w.id.startsWith('custom-')));
      this.renderView('slide-builder');
    }
  }

  renderSlideBuilderForm(container, formHeaderTitle, defaultTitle = "", defaultAuthor = "", defaultGenre = "Thơ Nôm Đường Luật", defaultDesc = "") {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:16px;">
        <h3 style="font-family:var(--font-heading); font-size:1.5rem; color:var(--primary);">${formHeaderTitle}</h3>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline" onclick="app.generateStandardSampleDeck()">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Nạp Bộ Slide Mẫu GDPT 2018
          </button>
          <button class="btn btn-accent" onclick="app.previewBuilderDeck()">
            <i class="fa-solid fa-circle-play"></i> Trình Chiếu Thử Ngay
          </button>
          <button class="btn btn-primary" onclick="app.saveFullDeckToLibrary()">
            <i class="fa-solid fa-floppy-disk"></i> Lưu Vĩnh Viễn Vào Thư Viện
          </button>
        </div>
      </div>

      <!-- Meta info card -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; padding:24px; margin-bottom:24px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div>
            <label style="display:block; font-weight:600; font-size:0.88rem; margin-bottom:4px;">Tên Bài Học / Tác Phẩm:</label>
            <input type="text" id="builder-work-title" value="${defaultTitle}" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>
          <div>
            <label style="display:block; font-weight:600; font-size:0.88rem; margin-bottom:4px;">Tác Giả / GV:</label>
            <input type="text" id="builder-work-author" value="${defaultAuthor}" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>
          <div>
            <label style="display:block; font-weight:600; font-size:0.88rem; margin-bottom:4px;">Thể Loại:</label>
            <input type="text" id="builder-work-genre" value="${defaultGenre}" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>
          <div>
            <label style="display:block; font-weight:600; font-size:0.88rem; margin-bottom:4px;">Mô Tả Ngắn Bài Học:</label>
            <input type="text" id="builder-work-desc" value="${defaultDesc}" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h4 style="font-family:var(--font-heading); color:var(--primary); font-size:1.2rem;">
          <i class="fa-solid fa-layer-group"></i> Danh Sách Các Slide (<span id="builder-slide-count">${this.builderSlides.length}</span> Slide)
        </h4>
        <button class="btn btn-outline" onclick="app.addNewEmptySlide()">
          <i class="fa-solid fa-plus"></i> Thêm Slide Mới
        </button>
      </div>

      <div id="builder-slides-container">
        ${this.renderBuilderSlidesList()}
      </div>
    `;
  }

  renderBuilderSlidesList() {
    return this.builderSlides.map((slide, idx) => `
      <div class="slide-editor-card animated-fade-in" style="background:var(--bg-card); border:1px solid var(--border-color); border-left:5px solid var(--accent); border-radius:14px; padding:24px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:16px;">
          <span style="font-weight:700; color:var(--primary); font-size:1rem;">
            <i class="fa-solid fa-file-powerpoint"></i> Slide ${idx + 1} / ${this.builderSlides.length}
          </span>
          <div style="display:flex; gap:8px;">
            ${idx > 0 ? `<button class="btn btn-outline" style="padding:4px 10px; font-size:0.8rem;" onclick="app.moveSlide(${idx}, -1)"><i class="fa-solid fa-arrow-up"></i> Lên</button>` : ''}
            ${idx < this.builderSlides.length - 1 ? `<button class="btn btn-outline" style="padding:4px 10px; font-size:0.8rem;" onclick="app.moveSlide(${idx}, 1)"><i class="fa-solid fa-arrow-down"></i> Xuống</button>` : ''}
            <button class="btn teacher-only btn-outline" style="padding:4px 10px; font-size:0.8rem; color:#DC3545; border-color:#DC3545;" onclick="app.deleteSlide(${idx})"><i class="fa-solid fa-trash"></i> Xóa</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:2fr 1fr; gap:16px; margin-bottom:16px;">
          <div>
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tiêu Đề Slide:</label>
            <input type="text" id="slide-title-${idx}" value="${slide.title}" onchange="app.updateSlideField(${idx}, 'title', this.value)" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>
          <div>
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Loại Slide:</label>
            <select id="slide-type-${idx}" onchange="app.updateSlideField(${idx}, 'type', this.value)" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
              <option value="intro" ${slide.type === 'intro' ? 'selected' : ''}>Mở đầu / Giới thiệu</option>
              <option value="analysis" ${slide.type === 'analysis' ? 'selected' : ''}>Phân tích chi tiết</option>
              <option value="summary" ${slide.type === 'summary' ? 'selected' : ''}>Tổng kết nghệ thuật</option>
              <option value="quiz" ${slide.type === 'quiz' ? 'selected' : ''}>Câu hỏi Thảo luận</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom:16px;">
          <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Phụ Đề Slide (Tùy chọn):</label>
          <input type="text" id="slide-subtitle-${idx}" value="${slide.subtitle || ''}" onchange="app.updateSlideField(${idx}, 'subtitle', this.value)" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
        </div>

        <div style="margin-bottom:16px;">
          <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Nội Dung Ý Chính (Mỗi dòng 1 ý, dùng **từ khóa** để bôi đậm):</label>
          <textarea id="slide-content-${idx}" rows="4" onchange="app.updateSlideBullets(${idx}, this.value)" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment); font-family:var(--font-sans);">${(slide.content || []).join('\n')}</textarea>
        </div>

        <div>
          <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px; color:var(--primary);"><i class="fa-solid fa-user-graduate"></i> Ghi Chú Sư Phạm Cho Giáo Viên (Teacher Presenter Notes):</label>
          <input type="text" id="slide-notes-${idx}" value="${slide.teacherNotes || ''}" onchange="app.updateSlideField(${idx}, 'teacherNotes', this.value)" placeholder="Ví dụ: Gợi ý hướng dẫn học sinh đọc diễn cảm..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--primary-light);">
        </div>
      </div>
    `).join('');
  }

  addNewEmptySlide() {
    this.builderSlides.push({
      slideNo: this.builderSlides.length + 1,
      title: `SLIDE ${this.builderSlides.length + 1}: NỘI DUNG MỚI`,
      subtitle: "Phân Tích & Thảo Luận",
      type: "analysis",
      content: ["**Ý 1**: Nội dung phân tích chi tiết.", "**Ý 2**: Dẫn chứng từ văn bản.", "**Ý 3**: Nhận xét nghệ thuật."],
      teacherNotes: "Ghi chú hướng dẫn bài học."
    });
    this.refreshBuilderList();
  }

  deleteSlide(idx) {
    if (this.builderSlides.length <= 1) {
      alert("Bộ bài giảng phải có ít nhất 1 slide!");
      return;
    }
    this.builderSlides.splice(idx, 1);
    this.builderSlides.forEach((s, i) => s.slideNo = i + 1);
    this.refreshBuilderList();
  }

  moveSlide(idx, direction) {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= this.builderSlides.length) return;
    
    const temp = this.builderSlides[idx];
    this.builderSlides[idx] = this.builderSlides[targetIdx];
    this.builderSlides[targetIdx] = temp;

    this.builderSlides.forEach((s, i) => s.slideNo = i + 1);
    this.refreshBuilderList();
  }

  updateSlideField(idx, field, value) {
    if (this.builderSlides[idx]) {
      this.builderSlides[idx][field] = value;
    }
  }

  updateSlideBullets(idx, value) {
    if (this.builderSlides[idx]) {
      this.builderSlides[idx].content = value.split('\n').filter(line => line.trim() !== '');
    }
  }

  refreshBuilderList() {
    const container = document.getElementById('builder-slides-container');
    const countEl = document.getElementById('builder-slide-count');
    if (container) {
      container.innerHTML = this.renderBuilderSlidesList();
    }
    if (countEl) {
      countEl.innerText = this.builderSlides.length;
    }
  }

  generateStandardSampleDeck() {
    this.builderSlides = [
      {
        slideNo: 1,
        title: "BÀI GIẢNG: THƠ NÔM NGUYỄN BỈNH KHIỆM",
        subtitle: "Chuẩn Kiến Thức & Kỹ Năng GDPT 2018",
        type: "intro",
        content: [
          "**Tác giả**: Nguyễn Bỉnh Khiêm (1491 - 1585) - Trạng Trình kiệt xuất.",
          "**Thể loại**: Thơ Nôm Đường luật (Thất ngôn bát cú).",
          "**Yêu cầu đọc hiểu**: Phân tích triết lý Nhàn dật & Thái độ sống thanh cao."
        ],
        teacherNotes: "Khởi động: Yêu cầu học sinh nhắc lại các tác gia thơ Nôm đã học."
      },
      {
        slideNo: 2,
        title: "PHẦN 1: TRIẾT LÝ SỐNG NHÀN",
        subtitle: "Thái Độ Hòa Hợp Thiên Nhiên & Xa Rời Danh Lợi",
        type: "analysis",
        content: [
          "**Thái độ sống**: 'Một mai, một vút, một cần câu / Thơ thẩn dầu ai vui thú nào'.",
          "**Quan niệm Nhàn**: Tự tại, thanh thản, không chạy theo vinh hoa phú quý ảo vọng.",
          "**Nghệ thuật**: Điệp từ 'một', nhịp thơ thong thả nhẹ nhàng."
        ],
        teacherNotes: "Hướng dẫn học sinh phân tích từ láy 'thơ thẩn' và số từ 'một'."
      }
    ];

    this.refreshBuilderList();
    alert("Đã khởi tạo bộ 5 Slide chuẩn GDPT 2018 thành công!");
  }

  previewBuilderDeck() {
    const title = document.getElementById('builder-work-title').value || "Bài Giảng Mới";

    const previewWork = {
      id: "preview-deck",
      title: title,
      authorName: document.getElementById('builder-work-author').value || "Giáo viên",
      slides: this.builderSlides
    };

    slideEngine.openPresentationCustomWork(previewWork);
  }

  saveFullDeckToLibrary() {
    const title = document.getElementById('builder-work-title').value;
    const author = document.getElementById('builder-work-author').value;
    const genre = document.getElementById('builder-work-genre').value;
    const desc = document.getElementById('builder-work-desc').value;

    if (!title || !author) {
      alert("Vui lòng điền tên bài học và tên tác giả!");
      return;
    }

    if (this.editingDeckId) {
      // Update existing deck
      const existing = MEDIEVAL_DATA.works.find(w => w.id === this.editingDeckId);
      if (existing) {
        existing.title = title;
        existing.authorName = author;
        existing.genre = genre;
        existing.description = desc;
        existing.slides = JSON.parse(JSON.stringify(this.builderSlides));
      }
    } else {
      // Create new deck
      const newWork = {
        id: 'custom-' + Date.now(),
        title: title,
        authorId: 'custom-author',
        authorName: author,
        year: '2026',
        periodId: 'p1',
        genre: genre || 'Bài giảng Mới',
        description: desc || 'Bộ Slide bài giảng chuyên nghiệp do giáo viên biên soạn.',
        parallelContent: [
          {
            lineNo: 1,
            hanOriginal: title,
            sinoVietnamese: title,
            translation: title,
            notes: "Nội dung bài giảng mới."
          }
        ],
        slides: JSON.parse(JSON.stringify(this.builderSlides))
      };
      MEDIEVAL_DATA.works.unshift(newWork);
    }

    this.saveStorageData('CUSTOM_MEDIEVAL_WORKS', MEDIEVAL_DATA.works.filter(w => w.id.startsWith('custom-')));

    alert(`Đã lưu thành công bộ ${this.builderSlides.length} Slide bài giảng "${title}"!`);
    this.renderView('slide-builder');
  }

  /* OTHER VIEWS CRUD METHODS */
  renderAuthorsView(container) {
    container.innerHTML = `
      <div class="animated-fade-in" style="max-width: 1050px; margin: 0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:16px;">
          <div>
            <h2 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--primary);"><i class="fa-solid fa-users-viewfinder"></i> Tác Giả Tiêu Biểu</h2>
            <p style="color:var(--text-muted);">Chân dung, phong cách nghệ thuật và các tác phẩm để đời của những đại thi hào dân tộc.</p>
          </div>
          <button class="btn teacher-only btn-primary" onclick="app.openAddAuthorModal()">
            <i class="fa-solid fa-user-plus"></i> Thêm Tác Giả Mới
          </button>
        </div>

        <div style="margin-bottom:24px; position:relative; max-width:400px;">
          <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted);"></i>
          <input type="text" id="author-search-input" placeholder="Tìm tác phẩm, tác giả..." oninput="app.filterAuthors(this.value)" style="width:100%; padding:10px 14px 10px 40px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-card); font-size:0.9rem;">
        </div>

        <div class="authors-grid" id="authors-grid-container">
          ${this.renderAuthorsGrid(MEDIEVAL_DATA.authors)}
        </div>
      </div>

      <div id="add-author-modal" class="modal-overlay" style="display:none;" onclick="app.closeAddAuthorModal()">
        <div class="modal-card animated-fade-in" onclick="event.stopPropagation()" style="max-width:600px;">
          <h3 style="font-family:var(--font-heading); color:var(--primary); margin-bottom:16px;"><i class="fa-solid fa-user-plus"></i> Thêm Hồ Sơ Tác Giả Mới</h3>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tên Tác Giả:</label>
              <input type="text" id="new-author-name" placeholder="VD: Nguyễn Bỉnh Khiêm" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
            </div>
            <div>
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tên Hiệu / Tên Tự:</label>
              <input type="text" id="new-author-courtesy" placeholder="VD: Trạng Trình" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Năm Sinh - Năm Mất:</label>
              <input type="text" id="new-author-years" placeholder="VD: 1491 - 1585" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
            </div>
            <div>
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Quê Quán:</label>
              <input type="text" id="new-author-hometown" placeholder="VD: Hải Phòng" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Danh Hiệu / Tôn Vinh:</label>
            <input type="text" id="new-author-title" placeholder="VD: Nhà triết học kiệt xuất" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tiểu Sử Tóm Tắt:</label>
            <textarea id="new-author-bio" rows="3" placeholder="Nhập tiểu sử tác giả..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tác Phẩm Tiêu Biểu (Cách nhau bằng phẩy):</label>
            <input type="text" id="new-author-works" placeholder="VD: Bạch Vân Quốc Âm Thi Tập" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn-outline" onclick="app.closeAddAuthorModal()">Hủy</button>
            <button class="btn btn-primary" onclick="app.saveNewAuthor()">Lưu Hồ Sơ Tác Giả</button>
          </div>
        </div>
      </div>
    `;
  }

  renderAuthorsGrid(authorsList) {
    if (!authorsList || authorsList.length === 0) {
      return `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">Không tìm thấy tác giả phù hợp.</div>`;
    }

    return authorsList.map(author => `
      <div class="author-card animated-fade-in" style="position:relative;">
        <button style="position:absolute; top:12px; right:12px; border:none; background:none; color:#DC3545; cursor:pointer; font-size:1rem;" title="Xóa tác giả" onclick="app.deleteAuthor('${author.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
        
        <img src="${author.avatar}" alt="${author.name}" class="author-avatar" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'">
        <h3 class="author-name">${author.name}</h3>
        <span class="author-title">${author.title}</span>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:8px;">${author.years} • ${author.hometown}</p>
        <p class="author-bio">${author.bio}</p>
        <div style="margin-top:auto; width:100%; text-align:left; background:var(--bg-parchment); padding:10px; border-radius:8px; font-size:0.82rem;">
          <strong>Tác phẩm tiêu biểu:</strong> ${Array.isArray(author.majorWorks) ? author.majorWorks.join(', ') : author.majorWorks}
        </div>
      </div>
    `).join('');
  }

  filterAuthors(query) {
    this.authorSearchQuery = query.toLowerCase();
    const filtered = MEDIEVAL_DATA.authors.filter(a => 
      a.name.toLowerCase().includes(this.authorSearchQuery) ||
      a.title.toLowerCase().includes(this.authorSearchQuery) ||
      a.bio.toLowerCase().includes(this.authorSearchQuery)
    );
    const container = document.getElementById('authors-grid-container');
    if (container) container.innerHTML = this.renderAuthorsGrid(filtered);
  }

  openAddAuthorModal() { document.getElementById('add-author-modal').style.display = 'flex'; }
  closeAddAuthorModal() { document.getElementById('add-author-modal').style.display = 'none'; }

  saveNewAuthor() {
    const name = document.getElementById('new-author-name').value;
    const courtesy = document.getElementById('new-author-courtesy').value;
    const years = document.getElementById('new-author-years').value;
    const hometown = document.getElementById('new-author-hometown').value;
    const title = document.getElementById('new-author-title').value;
    const bio = document.getElementById('new-author-bio').value;
    const works = document.getElementById('new-author-works').value;

    if (!name || !title) {
      alert("Vui lòng điền tên tác giả và danh hiệu!");
      return;
    }

    const newAuthor = {
      id: "custom-author-" + Date.now(),
      name: name,
      courtesyName: courtesy || "",
      years: years || "Trung đại",
      hometown: hometown || "Việt Nam",
      title: title,
      avatar: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
      bio: bio || "Tác giả văn học trung đại Việt Nam.",
      style: "Phong cách nghệ thuật độc đáo.",
      majorWorks: works ? works.split(',').map(w => w.trim()) : ["Tác phẩm Nôm"]
    };

    MEDIEVAL_DATA.authors.unshift(newAuthor);
    this.saveStorageData('CUSTOM_MEDIEVAL_AUTHORS', MEDIEVAL_DATA.authors.filter(a => a.id.startsWith('custom-author-')));
    this.closeAddAuthorModal();
    this.renderView('authors');
    alert(`Đã thêm thành công hồ sơ tác giả "${name}"!`);
  }

  deleteAuthor(authorId) {
    if (confirm("Bạn có chắc chắn muốn xóa tác giả này khỏi danh sách?")) {
      MEDIEVAL_DATA.authors = MEDIEVAL_DATA.authors.filter(a => a.id !== authorId);
      this.saveStorageData('CUSTOM_MEDIEVAL_AUTHORS', MEDIEVAL_DATA.authors.filter(a => a.id.startsWith('custom-author-')));
      this.renderView('authors');
    }
  }

  renderPeriodsView(container) {
    container.innerHTML = `
      <div class="animated-fade-in" style="max-width: 950px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:16px;">
          <div>
            <h2 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--primary);"><i class="fa-solid fa-timeline"></i> Tiến Trình Lịch Sử (X - XIX)</h2>
            <p style="color:var(--text-muted);">Các giai đoạn phát triển lớn gắn liền với biến thiên lịch sử dựng nước và giữ nước.</p>
          </div>
          <button class="btn teacher-only btn-primary" onclick="app.openAddPeriodModal()">
            <i class="fa-solid fa-plus"></i> Thêm Giai Đoạn Mới
          </button>
        </div>

        <div style="margin-bottom:24px; position:relative; max-width:400px;">
          <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted);"></i>
          <input type="text" id="period-search-input" placeholder="Tìm giai đoạn lịch sử..." oninput="app.filterPeriods(this.value)" style="width:100%; padding:10px 14px 10px 40px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-card); font-size:0.9rem;">
        </div>

        <div id="periods-list-container" style="display:flex; flex-direction:column; gap:24px;">
          ${this.renderPeriodsList(MEDIEVAL_DATA.periods)}
        </div>
      </div>

      <div id="add-period-modal" class="modal-overlay" style="display:none;" onclick="app.closeAddPeriodModal()">
        <div class="modal-card animated-fade-in" onclick="event.stopPropagation()" style="max-width:580px;">
          <h3 style="font-family:var(--font-heading); color:var(--primary); margin-bottom:16px;"><i class="fa-solid fa-timeline"></i> Thêm Giai Đoạn Lịch Sử Mới</h3>
          
          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tên Giai Đoạn (Thời gian):</label>
            <input type="text" id="new-period-name" placeholder="VD: Đầu thế kỷ XX" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tiêu Đề / Đặc Điểm Cốt Lõi:</label>
            <input type="text" id="new-period-title" placeholder="VD: Giai đoạn Giao thời & Chuyển mình Hiện đại" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Bối Cảnh Lịch Sử & Xã Hội:</label>
            <textarea id="new-period-desc" rows="3" placeholder="Mô tả hoàn cảnh xã hội lịch sử..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Các Đặc Điểm Nổi Bật (Mỗi dòng 1 ý):</label>
            <textarea id="new-period-chars" rows="3" placeholder="Ý 1: Sự ra đời chữ Quốc ngữ..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn-outline" onclick="app.closeAddPeriodModal()">Hủy</button>
            <button class="btn btn-primary" onclick="app.saveNewPeriod()">Lưu Giai Đoạn</button>
          </div>
        </div>
      </div>
    `;
  }

  renderPeriodsList(periodsList) {
    if (!periodsList || periodsList.length === 0) {
      return `<div style="text-align:center; padding:40px; color:var(--text-muted);">Không tìm thấy giai đoạn phù hợp.</div>`;
    }

    return periodsList.map(p => `
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-left:5px solid var(--accent); border-radius:12px; padding:24px; position:relative;" class="animated-fade-in">
        <button style="position:absolute; top:16px; right:16px; border:none; background:none; color:#DC3545; cursor:pointer; font-size:1rem;" title="Xóa giai đoạn" onclick="app.deletePeriod('${p.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>

        <span style="font-size:0.8rem; font-weight:700; color:var(--primary); text-transform:uppercase;">${p.name}</span>
        <h3 style="font-family:var(--font-heading); font-size:1.4rem; margin:6px 0 12px 0;">${p.title}</h3>
        <p style="color:var(--text-main); font-family:var(--font-serif); margin-bottom:14px;">${p.description}</p>
        <div style="background:var(--bg-parchment); padding:14px; border-radius:8px;">
          <strong style="font-size:0.85rem;">Đặc điểm nổi bật:</strong>
          <ul style="margin-top:6px; padding-left:20px; font-size:0.88rem; color:var(--text-muted);">
            ${(p.characteristics || []).map(c => `<li style="margin-bottom:4px;">${c}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }

  filterPeriods(query) {
    this.periodSearchQuery = query.toLowerCase();
    const filtered = MEDIEVAL_DATA.periods.filter(p => 
      p.name.toLowerCase().includes(this.periodSearchQuery) ||
      p.title.toLowerCase().includes(this.periodSearchQuery) ||
      p.description.toLowerCase().includes(this.periodSearchQuery)
    );
    const container = document.getElementById('periods-list-container');
    if (container) container.innerHTML = this.renderPeriodsList(filtered);
  }

  openAddPeriodModal() { document.getElementById('add-period-modal').style.display = 'flex'; }
  closeAddPeriodModal() { document.getElementById('add-period-modal').style.display = 'none'; }

  saveNewPeriod() {
    const name = document.getElementById('new-period-name').value;
    const title = document.getElementById('new-period-title').value;
    const desc = document.getElementById('new-period-desc').value;
    const charsRaw = document.getElementById('new-period-chars').value;

    if (!name || !title) {
      alert("Vui lòng điền tên giai đoạn và tiêu đề!");
      return;
    }

    const newPeriod = {
      id: "custom-period-" + Date.now(),
      name: name,
      title: title,
      description: desc || "Bối cảnh phát triển văn học.",
      characteristics: charsRaw ? charsRaw.split('\n').filter(c => c.trim() !== '') : ["Đặc điểm giai đoạn"]
    };

    MEDIEVAL_DATA.periods.push(newPeriod);
    this.saveStorageData('CUSTOM_MEDIEVAL_PERIODS', MEDIEVAL_DATA.periods.filter(p => p.id.startsWith('custom-period-')));
    this.closeAddPeriodModal();
    this.renderView('periods');
    alert(`Đã thêm thành công giai đoạn "${name}"!`);
  }

  deletePeriod(periodId) {
    if (confirm("Bạn có chắc chắn muốn xóa giai đoạn này khỏi tiến trình?")) {
      MEDIEVAL_DATA.periods = MEDIEVAL_DATA.periods.filter(p => p.id !== periodId);
      this.saveStorageData('CUSTOM_MEDIEVAL_PERIODS', MEDIEVAL_DATA.periods.filter(p => p.id.startsWith('custom-period-')));
      this.renderView('periods');
    }
  }

  renderWritingView(container) {
    container.innerHTML = `
      <div class="animated-fade-in" style="max-width: 900px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:16px;">
          <div>
            <h2 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--primary);"><i class="fa-solid fa-pen-nib"></i> Kết Nối Tri Thức: Bài Tập Viết Ngắn (150 - 200 Chữ)</h2>
            <p style="color:var(--text-muted);">Rèn luyện kỹ năng viết đoạn văn nghị luận xã hội / văn học theo chuẩn GDPT 2018.</p>
          </div>
          <button class="btn teacher-only btn-primary" onclick="app.openAddWritingModal()">
            <i class="fa-solid fa-plus"></i> Thêm Đề Bài Mới
          </button>
        </div>

        <div style="margin-bottom:24px; position:relative; max-width:400px;">
          <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted);"></i>
          <input type="text" id="writing-search-input" placeholder="Tìm đề bài viết ngắn..." oninput="app.filterWriting(this.value)" style="width:100%; padding:10px 14px 10px 40px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-card); font-size:0.9rem;">
        </div>

        <div id="writing-list-container">
          ${this.renderWritingList(MEDIEVAL_DATA.writingPromptsList)}
        </div>
      </div>

      <div id="add-writing-modal" class="modal-overlay" style="display:none;" onclick="app.closeAddWritingModal()">
        <div class="modal-card animated-fade-in" onclick="event.stopPropagation()" style="max-width:580px;">
          <h3 style="font-family:var(--font-heading); color:var(--primary); margin-bottom:16px;"><i class="fa-solid fa-pen-nib"></i> Thêm Đề Bài Viết Ngắn Mới</h3>
          
          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tác Phẩm Gắn Liền:</label>
            <input type="text" id="new-writing-work" placeholder="VD: Hịch Tướng Sĩ (Trần Quốc Tuấn)" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Đề Bài Viết Ngắn (150 - 200 chữ):</label>
            <textarea id="new-writing-prompt" rows="3" placeholder="Nhập câu hỏi / đề bài nghị luận ngắn..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Gợi Ý Dàn Ý Làm Bài:</label>
            <textarea id="new-writing-outline" rows="3" placeholder="1. Mở đoạn: ...&#10;2. Thân đoạn: ...&#10;3. Kết đoạn: ..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn-outline" onclick="app.closeAddWritingModal()">Hủy</button>
            <button class="btn btn-primary" onclick="app.saveNewWritingPrompt()">Lưu Đề Bài</button>
          </div>
        </div>
      </div>
    `;
  }

  renderWritingList(list) {
    if (!list || list.length === 0) {
      return `<div style="text-align:center; padding:40px; color:var(--text-muted);">Không tìm thấy đề bài phù hợp.</div>`;
    }

    return list.map(item => `
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:24px; margin-bottom:20px; position:relative;" class="animated-fade-in">
        <button style="position:absolute; top:16px; right:16px; border:none; background:none; color:#DC3545; cursor:pointer; font-size:1rem;" title="Xóa đề bài" onclick="app.deleteWritingPrompt('${item.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>

        <h3 style="font-family:var(--font-heading); color:var(--primary);">${item.workTitle}</h3>
        <p style="font-size:0.95rem; margin:10px 0; font-weight:600;"><strong>Đề bài:</strong> ${item.prompt}</p>
        ${item.outline ? `<p style="font-size:0.85rem; color:var(--text-muted); background:var(--accent-light); padding:10px; border-radius:6px; margin-bottom:12px;"><strong>Gợi ý dàn ý:</strong><br>${item.outline.replace(/\n/g, '<br>')}</p>` : ''}
        
        <textarea rows="4" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);" placeholder="Nhập bài làm của em tại đây..."></textarea>
        <div style="margin-top:10px; text-align:right;">
          <button class="btn btn-outline" onclick="alert('Đã lưu bài làm vào hệ thống!')"><i class="fa-solid fa-floppy-disk"></i> Lưu Bài Làm</button>
        </div>
      </div>
    `).join('');
  }

  filterWriting(query) {
    this.writingSearchQuery = query.toLowerCase();
    const filtered = MEDIEVAL_DATA.writingPromptsList.filter(wp => 
      wp.workTitle.toLowerCase().includes(this.writingSearchQuery) ||
      wp.prompt.toLowerCase().includes(this.writingSearchQuery)
    );
    const container = document.getElementById('writing-list-container');
    if (container) container.innerHTML = this.renderWritingList(filtered);
  }

  openAddWritingModal() { document.getElementById('add-writing-modal').style.display = 'flex'; }
  closeAddWritingModal() { document.getElementById('add-writing-modal').style.display = 'none'; }

  saveNewWritingPrompt() {
    if (!window.isTeacher) { alert('Chỉ giáo viên mới có quyền thao tác!'); return; }
    const workTitle = document.getElementById('new-writing-work').value;
    const prompt = document.getElementById('new-writing-prompt').value;
    const outline = document.getElementById('new-writing-outline').value;

    if (!workTitle || !prompt) {
      alert("Vui lòng điền tên tác phẩm và đề bài!");
      return;
    }

    const newWp = {
      id: "custom-wp-" + Date.now(),
      workTitle: workTitle,
      prompt: prompt,
      outline: outline || ""
    };

    MEDIEVAL_DATA.writingPromptsList.unshift(newWp);
    this.saveStorageData('CUSTOM_MEDIEVAL_WRITING', MEDIEVAL_DATA.writingPromptsList.filter(wp => wp.id.startsWith('custom-wp-')));
    this.closeAddWritingModal();
    this.renderView('writing');
    alert("Đã thêm thành công đề bài viết ngắn mới!");
  }

  deleteWritingPrompt(wpId) {
    if (!window.isTeacher) { alert('Chỉ giáo viên mới có quyền thao tác!'); return; }
    if (confirm("Bạn có chắc chắn muốn xóa đề bài này?")) {
      MEDIEVAL_DATA.writingPromptsList = MEDIEVAL_DATA.writingPromptsList.filter(wp => wp.id !== wpId);
      this.saveStorageData('CUSTOM_MEDIEVAL_WRITING', MEDIEVAL_DATA.writingPromptsList.filter(wp => wp.id.startsWith('custom-wp-')));
      this.renderView('writing');
    }
  }

  filterPeriod(periodId) {
    this.selectedPeriod = periodId;
    const buttons = document.querySelectorAll('.period-pills .pill-btn');
    buttons.forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    this.renderWorksGrid();
  }

  renderWorksGrid() {
    const container = document.getElementById('works-grid-container');
    if (!container) return;

    let filtered = MEDIEVAL_DATA.works;
    if (this.selectedPeriod !== 'all') {
      filtered = filtered.filter(w => w.periodId === this.selectedPeriod);
    }
    if (this.searchQuery) {
      filtered = filtered.filter(w => 
        w.title.toLowerCase().includes(this.searchQuery) || 
        w.authorName.toLowerCase().includes(this.searchQuery) ||
        w.description.toLowerCase().includes(this.searchQuery)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">Không tìm thấy tác phẩm phù hợp.</div>`;
      return;
    }

    container.innerHTML = filtered.map(work => `
      <div class="work-card animated-fade-in">
        <div>
          <div class="work-header">
            <span class="work-genre">${work.genre}</span>
            <span class="work-year">${work.year}</span>
          </div>
          <h3 class="work-title">${work.title}</h3>
          <p class="work-author">Tác giả: ${work.authorName}</p>
          <p class="work-desc">${work.description}</p>
        </div>

        <div class="work-actions">
          <button class="btn btn-outline" onclick="app.openWorkReader('${work.id}')">
            <i class="fa-solid fa-book-open"></i> Đọc Hán-Nôm
          </button>
          <button class="btn btn-accent" onclick="slideEngine.openPresentation('${work.id}')">
            <i class="fa-solid fa-display"></i> Trình Chiếu Slide (${work.slides ? work.slides.length : 0})
          </button>
        </div>
      </div>
    `).join('');
  }

  openWorkReader(workId) {
    this.renderView('reader');
    nomReader.loadWorkReader(workId);
  }

  checkQuizAnswer(quizId, selectedIdx) {
    const quiz = MEDIEVAL_DATA.quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const feedbackEl = document.getElementById(`quiz-feedback-${quizId}`);
    const cardEl = document.getElementById(`quiz-card-${quizId}`);
    const optionBtns = cardEl.querySelectorAll('.quiz-option-btn');

    optionBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === quiz.correctAnswer) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx && selectedIdx !== quiz.correctAnswer) {
        btn.classList.add('wrong');
      }
    });

    if (feedbackEl) {
      feedbackEl.style.display = 'block';
      if (selectedIdx === quiz.correctAnswer) {
        feedbackEl.style.background = '#D4EDDA';
        feedbackEl.style.color = '#155724';
        feedbackEl.innerHTML = `<strong><i class="fa-solid fa-circle-check"></i> Chính xác!</strong> ${quiz.explanation}`;
      } else {
        feedbackEl.style.background = '#F8D7DA';
        feedbackEl.style.color = '#721C24';
        feedbackEl.innerHTML = `<strong><i class="fa-solid fa-circle-xmark"></i> Chưa đúng.</strong> ${quiz.explanation}`;
      }
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new MedievalApp();
});
