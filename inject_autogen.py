import re

app_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\app.js'
with open(app_js_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Add Button to the UI
old_button = """        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline" onclick="app.generateStandardSampleDeck()">"""
new_button = """        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-outline" onclick="app.autoGenerateSlidesFromContent()" style="border-color:var(--accent); color:var(--accent);">
            <i class="fa-solid fa-robot"></i> Tự Động Tạo Từ Nội Dung
          </button>
          <button class="btn btn-outline" onclick="app.generateStandardSampleDeck()">"""
app_js = app_js.replace(old_button, new_button)

# 2. Add the Auto-Generate Logic
auto_gen_logic = """  autoGenerateSlidesFromContent() {
    if (!this.editingDeckId) {
      alert("Vui lòng lưu tác phẩm trước khi dùng tính năng tạo tự động!");
      return;
    }
    
    const work = MEDIEVAL_DATA.works.find(w => w.id === this.editingDeckId);
    if (!work || !work.description) {
      alert("Tác phẩm này chưa có nội dung trong phần Mô tả. Vui lòng nhập nội dung tác phẩm vào phần Mô tả (Thư viện -> Chỉnh sửa) rồi thử lại!");
      return;
    }

    if (this.builderSlides.length > 0) {
      if (!confirm("Hệ thống sẽ ghi đè lên các slide hiện tại. Bạn có chắc chắn muốn tạo mới tự động không?")) {
        return;
      }
    }

    // Process text from description
    const text = work.description.trim();
    
    // Split by period, newline, or question mark, exclamation mark to get sentences
    // Using regex to split by sentence endings while keeping them, or simply splitting by newline if it's a poem
    let chunks = [];
    if (text.includes('\\n')) {
      // It's formatted with newlines (like a poem)
      let lines = text.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
      for (let i = 0; i < lines.length; i += 2) {
        let chunk = lines[i];
        if (i + 1 < lines.length) chunk += " \\n " + lines[i+1];
        chunks.push(chunk);
      }
    } else {
      // It's a continuous paragraph
      let sentences = text.match(/[^.!?]+[.!?]+/g);
      if (!sentences) sentences = [text]; // Fallback if no punctuation
      
      for (let i = 0; i < sentences.length; i += 2) {
        let chunk = sentences[i].trim();
        if (i + 1 < sentences.length) chunk += " " + sentences[i+1].trim();
        chunks.push(chunk);
      }
    }

    const newSlides = [];
    
    // Slide 1: Intro
    newSlides.push({
      slideNo: 1,
      title: work.title.toUpperCase(),
      subtitle: "Giới thiệu chung",
      type: "intro",
      content: [
        `**Tác giả**: ${work.authorName}`,
        `**Thể loại**: ${work.genre}`,
        `**Hoàn cảnh sáng tác**: ${work.year}`
      ],
      teacherNotes: "Giáo viên giới thiệu khái quát về tác phẩm."
    });

    // Slides 2..N: Content
    chunks.forEach((chunk, index) => {
      newSlides.push({
        slideNo: index + 2,
        title: "Phân Tích Chi Tiết",
        subtitle: `Đoạn ${index + 1}`,
        type: "analysis",
        content: [
          `**Nguyên văn:**`,
          chunk.replace(/\\n/g, '<br>'), // Render newlines nicely
          ` `,
          `**Gợi ý phân tích:**`,
          `- Chú ý các từ ngữ, hình ảnh đặc sắc...`
        ],
        teacherNotes: "Gợi ý học sinh đọc diễn cảm và tìm biện pháp tu từ."
      });
    });

    this.builderSlides = newSlides;
    this.renderSlideBuilderForm(document.getElementById('slide-editor-section'), `Chỉnh Sửa Bộ Slide: "${work.title}"`, work.title, work.authorName, work.genre, work.description);
    alert("Đã tạo tự động " + newSlides.length + " slide từ nội dung!");
  }

  generateStandardSampleDeck() {"""

app_js = app_js.replace("  generateStandardSampleDeck() {", auto_gen_logic)

with open(app_js_path, 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Auto-generate feature injected successfully.")
