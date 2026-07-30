/**
 * Module Quản Lý & Tích Hợp Link Trò Chơi Học Tập (Kahoot, Quizizz, Wordwall, Quizlet)
 */

class GamesManager {
  constructor() {
    this.games = [];
    this.loadGamesFromStorage();
  }

  loadGamesFromStorage() {
    try {
      const stored = localStorage.getItem('MEDIEVAL_GAMES');
      if (stored) {
        this.games = JSON.parse(stored);
      } else {
        // Preset literature games
        this.games = [
          {
            id: "game-1",
            title: "Kahoot: Đấu Trí Hào Khí Đông A & Bình Ngô Đại Cáo",
            platform: "kahoot",
            platformName: "Kahoot!",
            gamePin: "582 910",
            workTitle: "Bình Ngô Đại Cáo",
            description: "Trò chơi khởi động 10 câu hỏi trắc nghiệm nhanh về bối cảnh lịch sử và tư tưởng Nhân nghĩa.",
            url: "https://kahoot.it/",
            color: "#46178F"
          },
          {
            id: "game-2",
            title: "Quizizz: Đua Xe Tri Thức - Chị Em Thúy Kiều",
            platform: "quizizz",
            platformName: "Quizizz",
            gamePin: "847291",
            workTitle: "Truyện Kiều",
            description: "Trò chơi đua xe tốc độ thử thách khả năng nhận diện bút pháp ước lệ tượng trưng.",
            url: "https://quizizz.com/join",
            color: "#8854D0"
          },
          {
            id: "game-3",
            title: "Wordwall: Vòng Quay May Mắn - Điển Tích Điển Cố Hán-Nôm",
            platform: "wordwall",
            platformName: "Wordwall",
            gamePin: "",
            workTitle: "Tất cả tác phẩm",
            description: "Vòng quay ngẫu nhiên gọi tên học sinh giải nghĩa điển tích (Tố nga, Thu thủy, Trúc Nam Sơn...).",
            url: "https://wordwall.net/vi",
            color: "#20BF6B"
          },
          {
            id: "game-4",
            title: "Quizlet: Thẻ Flashcard Từ Hán-Việt & Luật Thơ Đường Luật",
            platform: "quizlet",
            platformName: "Quizlet",
            gamePin: "",
            workTitle: "Thơ Nôm Đường Luật",
            description: "Bộ thẻ lật thông minh luyện nhớ các nốt Bằng-Trắc, Niêm, Vần và từ Hán-Việt cổ.",
            url: "https://quizlet.com/",
            color: "#4257B2"
          }
        ];
        this.saveGamesToStorage();
      }
    } catch (e) {
      console.warn("Could not access LocalStorage for games", e);
    }
  }

  saveGamesToStorage() {
    try {
      localStorage.setItem('MEDIEVAL_GAMES', JSON.stringify(this.games));
    } catch (e) {
      console.warn("Could not save games to LocalStorage", e);
    }
  }

  renderGamesView() {
    const container = document.getElementById('app-content-body');
    if (!container) return;

    container.innerHTML = `
      <div class="animated-fade-in" style="max-width: 1050px; margin: 0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:16px;">
          <div>
            <h2 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--primary);"><i class="fa-solid fa-gamepad"></i> Trò Chơi Học Tập & Khởi Động Lớp Học</h2>
            <p style="color:var(--text-muted);">Tích hợp liên kết Kahoot, Quizizz, Wordwall, Quizlet tạo không gian học tập sôi nổi.</p>
          </div>
          <button class="btn btn-primary" onclick="gamesManager.openAddGameModal()">
            <i class="fa-solid fa-plus"></i> Thêm Link Trò Chơi Mới
          </button>
        </div>

        <!-- Filter Platform Pills -->
        <div style="display:flex; gap:10px; margin-bottom:24px; flex-wrap:wrap;">
          <button class="btn btn-outline active-toggle" onclick="gamesManager.filterPlatform('all', this)">Tất cả Nền tảng</button>
          <button class="btn btn-outline" onclick="gamesManager.filterPlatform('kahoot', this)"><i class="fa-solid fa-bolt" style="color:#46178F"></i> Kahoot!</button>
          <button class="btn btn-outline" onclick="gamesManager.filterPlatform('quizizz', this)"><i class="fa-solid fa-circle-question" style="color:#8854D0"></i> Quizizz</button>
          <button class="btn btn-outline" onclick="gamesManager.filterPlatform('wordwall', this)"><i class="fa-solid fa-compass" style="color:#20BF6B"></i> Wordwall</button>
          <button class="btn btn-outline" onclick="gamesManager.filterPlatform('quizlet', this)"><i class="fa-solid fa-layer-group" style="color:#4257B2"></i> Quizlet</button>
        </div>

        <!-- Games Grid -->
        <div id="games-grid-container" class="games-grid">
          ${this.renderGamesGrid(this.games)}
        </div>
      </div>

      <!-- Add Game Modal Container -->
      <div id="add-game-modal" class="modal-overlay" style="display:none;" onclick="gamesManager.closeAddGameModal()">
        <div class="modal-card animated-fade-in" onclick="event.stopPropagation()" style="max-width:560px;">
          <h3 style="font-family:var(--font-heading); color:var(--primary); margin-bottom:16px;"><i class="fa-solid fa-gamepad"></i> Thêm Trò Chơi Học Tập Mới</h3>
          
          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Tên Trò Chơi / Thử Thách:</label>
            <input type="text" id="new-game-title" placeholder="VD: Kahoot: Ôn tập Hịch Tướng Sĩ" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Nền Tảng Trò Chơi:</label>
              <select id="new-game-platform" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
                <option value="kahoot">Kahoot!</option>
                <option value="quizizz">Quizizz</option>
                <option value="wordwall">Wordwall</option>
                <option value="quizlet">Quizlet</option>
                <option value="blooket">Blooket / Khác</option>
              </select>
            </div>
            <div>
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Mã Game PIN (Nếu có):</label>
              <input type="text" id="new-game-pin" placeholder="VD: 123 456" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Đường Dẫn Liên Kết (URL):</label>
            <input type="text" id="new-game-url" placeholder="https://kahoot.it/..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);">
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">Mô Tả Ngắn Trò Chơi:</label>
            <textarea id="new-game-desc" rows="3" placeholder="Trò chơi trắc nghiệm 10 câu hỏi dành cho tiết học khởi động..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-parchment);"></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn btn-outline" onclick="gamesManager.closeAddGameModal()">Hủy</button>
            <button class="btn btn-primary" onclick="gamesManager.saveNewGame()">Lưu Trò Chơi</button>
          </div>
        </div>
      </div>
    `;
  }

  renderGamesGrid(gamesList) {
    if (!gamesList || gamesList.length === 0) {
      return `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted); background:var(--bg-card); border-radius:12px; border:1px solid var(--border-color);">Chưa có trò chơi nào thuộc nền tảng này.</div>`;
    }

    return gamesList.map(game => {
      let badgeBg = "#46178F";
      let icon = "fa-gamepad";

      if (game.platform === 'kahoot') { badgeBg = "#46178F"; icon = "fa-bolt"; }
      else if (game.platform === 'quizizz') { badgeBg = "#8854D0"; icon = "fa-circle-question"; }
      else if (game.platform === 'wordwall') { badgeBg = "#20BF6B"; icon = "fa-compass"; }
      else if (game.platform === 'quizlet') { badgeBg = "#4257B2"; icon = "fa-layer-group"; }

      return `
        <div class="game-card animated-fade-in">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span class="game-platform-badge" style="background:${badgeBg}; color:#FFF;">
              <i class="fa-solid ${icon}"></i> ${game.platformName || game.platform.toUpperCase()}
            </span>
            ${game.gamePin ? `<span class="game-pin-badge"><i class="fa-solid fa-key"></i> PIN: <strong>${game.gamePin}</strong></span>` : ''}
          </div>

          <h3 style="font-family:var(--font-heading); font-size:1.2rem; color:var(--text-main); margin-bottom:6px;">${game.title}</h3>
          <p style="font-size:0.82rem; color:var(--primary); font-weight:600; margin-bottom:10px;">Gắn với bài: ${game.workTitle || 'Chung'}</p>
          <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:20px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${game.description}</p>

          <div style="display:flex; gap:8px; margin-top:auto;">
            <a href="${game.url}" target="_blank" class="btn btn-accent" style="flex:1; justify-content:center; text-decoration:none;">
              <i class="fa-solid fa-play"></i> VÀO CHƠI NGAY
            </a>
            ${game.gamePin ? `
              <button class="btn btn-outline" style="padding:8px 12px;" title="Sao chép mã PIN" onclick="navigator.clipboard.writeText('${game.gamePin}'); alert('Đã sao chép mã PIN: ${game.gamePin}');">
                <i class="fa-solid fa-copy"></i>
              </button>
            ` : ''}
            <button class="btn btn-outline" style="padding:8px 12px; color:#DC3545; border-color:#DC3545;" title="Xóa trò chơi" onclick="gamesManager.deleteGame('${game.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  openAddGameModal() {
    document.getElementById('add-game-modal').style.display = 'flex';
  }

  closeAddGameModal() {
    document.getElementById('add-game-modal').style.display = 'none';
  }

  saveNewGame() {
    const title = document.getElementById('new-game-title').value;
    const platform = document.getElementById('new-game-platform').value;
    const pin = document.getElementById('new-game-pin').value;
    const url = document.getElementById('new-game-url').value;
    const desc = document.getElementById('new-game-desc').value;

    if (!title || !url) {
      alert("Vui lòng điền tiêu đề trò chơi và đường dẫn URL!");
      return;
    }

    let platformName = "Kahoot!";
    if (platform === 'quizizz') platformName = "Quizizz";
    else if (platform === 'wordwall') platformName = "Wordwall";
    else if (platform === 'quizlet') platformName = "Quizlet";
    else if (platform === 'blooket') platformName = "Blooket";

    const newGame = {
      id: "game-" + Date.now(),
      title: title,
      platform: platform,
      platformName: platformName,
      gamePin: pin || "",
      workTitle: "Tự biên soạn",
      description: desc || "Trò chơi học tập tương tác cho lớp học.",
      url: url
    };

    this.games.unshift(newGame);
    this.saveGamesToStorage();
    this.closeAddGameModal();
    this.renderGamesView();

    alert(`Đã thêm thành công trò chơi "${title}"!`);
  }

  deleteGame(gameId) {
    if (confirm("Bạn có chắc chắn muốn xóa trò chơi này khỏi danh sách?")) {
      this.games = this.games.filter(g => g.id !== gameId);
      this.saveGamesToStorage();
      this.renderGamesView();
    }
  }

  filterPlatform(platform, btnEl) {
    const btns = btnEl.parentElement.querySelectorAll('.btn');
    btns.forEach(b => b.classList.remove('active-toggle'));
    btnEl.classList.add('active-toggle');

    const container = document.getElementById('games-grid-container');
    if (!container) return;

    let filtered = this.games;
    if (platform !== 'all') {
      filtered = this.games.filter(g => g.platform === platform);
    }

    container.innerHTML = this.renderGamesGrid(filtered);
  }
}

const gamesManager = new GamesManager();
