import re

data_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\data.js'
with open(data_js_path, 'r', encoding='utf-8') as f:
    data_content = f.read()

authors_grade12 = """
    {
      id: "dang-dung",
      name: "Đặng Dung",
      lifespan: "Cuối thế kỷ XIV - 1414",
      dynasty: "Nhà Hậu Trần",
      description: "Danh tướng nhà Hậu Trần, nổi tiếng với tấm lòng tận trung báo quốc, chí khí anh hùng và bi kịch của người anh hùng lỡ vận.",
      famousWorks: ["Cảm hoài"],
      avatar: "fa-user-ninja"
    },
    {
      id: "doan-thi-diem",
      name: "Đoàn Thị Điểm",
      lifespan: "1705 - 1748",
      dynasty: "Thời Lê Trung Hưng",
      description: "Nữ sĩ tài danh bậc nhất thế kỷ 18, tác giả Truyền kỳ tân phả và người dịch Chinh phụ ngâm khúc vô cùng thành công.",
      famousWorks: ["Truyền kỳ tân phả", "Chinh phụ ngâm (dịch)"],
      avatar: "fa-pen-fancy"
    },"""

if "doan-thi-diem" not in data_content:
    data_content = data_content.replace('authors: [', 'authors: [' + authors_grade12)

works_grade12 = """
    {
      id: "cam-hoai-dang-dung",
      title: "Cảm hoài (Nỗi lòng)",
      authorId: "dang-dung",
      authorName: "Đặng Dung",
      year: "Đầu Thế kỷ XV",
      periodId: "p1",
      genre: "Thơ chữ Hán",
      description: "Bài thơ mang âm hưởng bi tráng, thể hiện khát vọng cứu nước chưa thành và chí khí anh hùng của Đặng Dung.",
      hanNomUrl: "https://hannom.misa.vn/",
      nomDictionaryLink: "http://nomfoundation.org/",
      writingPrompt: "Phân tích vẻ đẹp bi tráng của hình tượng người anh hùng trong bài thơ Cảm hoài (Đặng Dung).",
      slides: [
        {
          slideNo: 1,
          title: "CẢM HOÀI (NỖI LÒNG) - ĐẶNG DUNG",
          subtitle: "Bi Ca Của Người Anh Hùng Lỡ Vận",
          type: "intro",
          content: [
            "**Tác giả**: Đặng Dung - danh tướng nhà Hậu Trần chống quân Minh.",
            "**Đặc sắc**: Bài thơ mang âm hưởng bi tráng, hùng sầu.",
            "**Hình tượng trung tâm**: Người anh hùng mài gươm dưới trăng."
          ]
        },
        {
          slideNo: 2,
          title: "Khát Vọng & Bi Kịch",
          subtitle: "Quốc thù vị báo đầu tiên bạch",
          type: "analysis",
          content: [
            "Thế sự tuần hoàn không thể đoán trước, nhưng người anh hùng vẫn nỗ lực xoay chuyển càn khôn.",
            "Bóng dáng người tráng sĩ rèn gươm dưới trăng thể hiện tinh thần không khuất phục trước số phận."
          ]
        }
      ]
    },
    {
      id: "hai-khau-linh-tu",
      title: "Hải khẩu linh từ (Đền thiêng cửa bể)",
      authorId: "doan-thi-diem",
      authorName: "Đoàn Thị Điểm",
      year: "Thế kỷ XVIII",
      periodId: "p3",
      genre: "Truyện Truyền kỳ",
      description: "Đoạn trích từ Truyền kỳ tân phả, ca ngợi công đức và nỗi oan khuất của nữ thần Bích Châu, thể hiện tiếng nói nhân đạo sâu sắc.",
      slides: [
        {
          slideNo: 1,
          title: "HẢI KHẨU LINH TỪ - ĐOÀN THỊ ĐIỂM",
          subtitle: "Truyền Thuyết Về Đền Thiêng Cửa Bể",
          type: "intro",
          content: [
            "**Tác giả**: Hồng Hà nữ sĩ Đoàn Thị Điểm.",
            "**Tác phẩm**: Trích Truyền kỳ tân phả (Ghi chép mới về những chuyện kỳ lạ).",
            "**Nhân vật**: Nữ thần Bích Châu (Chế Thắng phu nhân) - biểu tượng người phụ nữ trung trinh, tài sắc."
          ]
        },
        {
          slideNo: 2,
          title: "Giá Trị Nội Dung & Nghệ Thuật",
          subtitle: "Tiếng nói nhân đạo của Nữ sĩ",
          type: "summary",
          content: [
            "Thể hiện niềm xót xa cho thân phận người phụ nữ trong xã hội phong kiến.",
            "Nghệ thuật kể chuyện truyền kỳ hấp dẫn, kết hợp yếu tố kỳ ảo và hiện thực."
          ]
        }
      ]
    },"""

if "cam-hoai-dang-dung" not in data_content:
    data_content = data_content.replace('works: [', 'works: [' + works_grade12)

with open(data_js_path, 'w', encoding='utf-8') as f:
    f.write(data_content)


docs_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\documents.js'
with open(docs_js_path, 'r', encoding='utf-8') as f:
    docs_content = f.read()

docs_grade12 = """
      {
        id: 'doc-grade12-1',
        name: 'Giao_an_Cam_Hoai_Dang_Dung_L12.docx',
        type: 'word',
        size: '1.3 MB',
        uploadDate: '2026-09-23',
        description: 'Giáo án Ngữ văn 12: Bài thơ Cảm hoài (Nỗi lòng) của Đặng Dung.',
        url: '#'
      },
      {
        id: 'doc-grade12-2',
        name: 'PBT_Hai_Khau_Linh_Tu_Doan_Thi_Diem.pdf',
        type: 'pdf',
        size: '1.0 MB',
        uploadDate: '2026-09-23',
        description: 'Phiếu học tập và hướng dẫn đọc hiểu Hải khẩu linh từ (Đền thiêng cửa bể).',
        url: '#'
      },"""

if "doc-grade12-1" not in docs_content:
    docs_content = docs_content.replace('this.documents = [', 'this.documents = [' + docs_grade12)

with open(docs_js_path, 'w', encoding='utf-8') as f:
    f.write(docs_content)

print("Grade 12 data injected.")
