/**
 * Trình Chiếu Bài Giảng & Tạo Slide Tương Tác (Interactive Slide Engine)
 */

class SlidePresenter {
  constructor() {
    this.currentWork = null;
    this.slides = [];
    this.currentIndex = 0;
    this.isFullscreen = false;
    this.showTeacherNotes = true;
    
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      const overlay = document.getElementById('slide-overlay');
      if (!overlay || overlay.style.display === 'none') return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        this.nextSlide();
      } else if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'Escape') {
        this.closePresentation();
      }
    });
  }

  openPresentation(workId) {
    const work = MEDIEVAL_DATA.works.find(w => w.id === workId);
    if (!work || !work.slides || work.slides.length === 0) {
      alert("Tác phẩm này chưa có bài giảng Slide!");
      return;
    }

    this.openPresentationCustomWork(work);
  }

  openPresentationCustomWork(work) {
    if (!work || !work.slides || work.slides.length === 0) {
      alert("Bộ bài giảng chưa có slide nào!");
      return;
    }

    this.currentWork = work;
    this.slides = work.slides;
    this.currentIndex = 0;

    let overlay = document.getElementById('slide-overlay');
    if (!overlay) {
      overlay = this.createOverlayDOM();
      document.body.appendChild(overlay);
    }

    const titleEl = document.getElementById('pres-work-title');
    if (titleEl) {
      titleEl.innerHTML = `<i class="fa-solid fa-chalkboard-user"></i> Trình Chiếu: <strong>${work.title}</strong> (${work.authorName})`;
    }

    overlay.style.display = 'flex';
    this.renderCurrentSlide();
  }

  closePresentation() {
    const overlay = document.getElementById('slide-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  nextSlide() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      this.renderCurrentSlide();
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCurrentSlide();
    }
  }

  toggleTeacherNotes() {
    this.showTeacherNotes = !this.showTeacherNotes;
    const notesEl = document.getElementById('pres-teacher-notes');
    if (notesEl) {
      notesEl.style.display = this.showTeacherNotes ? 'block' : 'none';
    }
  }

  renderCurrentSlide() {
    const slide = this.slides[this.currentIndex];
    const frame = document.getElementById('pres-slide-frame');
    const counter = document.getElementById('pres-slide-counter');
    const notesEl = document.getElementById('pres-teacher-notes-content');

    if (!frame) return;

    // Slide markup
    let contentHtml = '';
    if (Array.isArray(slide.content)) {
      contentHtml = slide.content.map(item => {
        const formatted = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return `
          <div class="slide-bullet">
            <i class="fa-solid fa-feather-pointed"></i>
            <div>${formatted}</div>
          </div>
        `;
      }).join('');
    }

    frame.innerHTML = `
      <div class="animated-fade-in">
        <h2 class="slide-title">${slide.title}</h2>
        ${slide.subtitle ? `<p class="slide-subtitle">${slide.subtitle}</p>` : ''}
        <div class="slide-content-list">
          ${contentHtml}
        </div>
      </div>
    `;

    if (counter) {
      counter.innerText = `Slide ${this.currentIndex + 1} / ${this.slides.length}`;
    }

    if (notesEl) {
      notesEl.innerText = slide.teacherNotes || "Không có ghi chú thêm cho slide này.";
    }
  }

  createOverlayDOM() {
    const overlay = document.createElement('div');
    overlay.id = 'slide-overlay';
    overlay.className = 'presentation-overlay';
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <div class="pres-header">
        <div class="pres-title" id="pres-work-title">
          <i class="fa-solid fa-chalkboard-user"></i> Trình Chiếu Bài Giảng
        </div>
        <div class="pres-controls">
          <button class="btn btn-outline" style="color:#FFF; border-color:rgba(255,255,255,0.3)" onclick="slideEngine.toggleTeacherNotes()">
            <i class="fa-solid fa-note-sticky"></i> Bật/Tắt Ghi Chú GV
          </button>
          <button class="btn btn-outline" style="color:#FFF; border-color:rgba(255,255,255,0.3)" onclick="slideEngine.closePresentation()">
            <i class="fa-solid fa-xmark"></i> Thoát (Esc)
          </button>
        </div>
      </div>

      <div class="pres-stage">
        <div class="slide-frame" id="pres-slide-frame"></div>
      </div>

      <div class="teacher-notes-drawer" id="pres-teacher-notes">
        <strong><i class="fa-solid fa-user-graduate"></i> Ghi Chú Sư Phạm Cho Giáo Viên:</strong>
        <div id="pres-teacher-notes-content" style="margin-top: 6px;"></div>
      </div>

      <div class="pres-footer">
        <span id="pres-slide-counter" style="color:var(--accent); font-weight:600;">Slide 1 / 5</span>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-outline" style="color:#FFF; border-color:rgba(255,255,255,0.3)" onclick="slideEngine.prevSlide()">
            <i class="fa-solid fa-chevron-left"></i> Slide Trước
          </button>
          <button class="btn btn-accent" onclick="slideEngine.nextSlide()">
            Slide Tiếp Theo <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;

    return overlay;
  }
}

const slideEngine = new SlidePresenter();
