import re

data_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\data.js'
with open(data_js_path, 'r', encoding='utf-8') as f:
    data_content = f.read()

authors_grade11 = """
    {
      id: "nguyen-cong-tru",
      name: "Nguyễn Công Trứ",
      lifespan: "1778 - 1858",
      dynasty: "Thời nhà Nguyễn",
      description: "Nhà quân sự, kinh tế tài ba, nhà nho tài tử lỗi lạc với phong cách sống và sáng tác 'ngất ngưởng', tự do, khát vọng lập công danh.",
      famousWorks: ["Bài ca ngất ngưởng", "Chí nam nhi"],
      avatar: "fa-chess-knight"
    },"""

if "nguyen-cong-tru" not in data_content:
    data_content = data_content.replace('authors: [', 'authors: [' + authors_grade11)

works_grade11 = """
    {
      id: "trao-duyen",
      title: "Trao duyên (Trích Truyện Kiều)",
      authorId: "nguyen-du",
      authorName: "Nguyễn Du",
      year: "Đầu Thế kỷ XIX",
      periodId: "p3",
      genre: "Truyện thơ Nôm",
      description: "Đoạn trích miêu tả bi kịch tình yêu tan vỡ và nỗi đau đớn tột cùng của Thúy Kiều khi phải trao mối tình dang dở với Kim Trọng cho Thúy Vân.",
      slides: [
        { slideNo: 1, title: "TRAO DUYÊN", subtitle: "Bi kịch tình yêu tan vỡ", type: "intro", content: ["**Vị trí**: Từ câu 723 đến câu 756.", "**Ý nghĩa**: Mở đầu cho kiếp đoạn trường 15 năm lưu lạc của Thúy Kiều."] },
        { slideNo: 2, title: "Lý Lẽ Trao Duyên", subtitle: "Cậy em em có chịu lời", type: "analysis", content: ["Từ ngữ: 'Cậy', 'chịu lời', 'Lạy', 'Thưa'.", "Sự nhún nhường, van vỉ, đặt Thúy Vân vào thế không thể chối từ."] }
      ]
    },
    {
      id: "doc-tieu-thanh-ki",
      title: "Độc Tiểu Thanh kí",
      authorId: "nguyen-du",
      authorName: "Nguyễn Du",
      year: "Đầu Thế kỷ XIX",
      periodId: "p3",
      genre: "Thơ chữ Hán",
      description: "Tiếng thở dài xót xa cho thân phận hồng nhan bạc mệnh của nàng Tiểu Thanh, đồng thời là lời tự vấn về nỗi niềm tài hoa bạc mệnh của chính Nguyễn Du.",
      slides: [
        { slideNo: 1, title: "ĐỘC TIỂU THANH KÍ", subtitle: "Nỗi đau tài hoa bạc mệnh", type: "intro", content: ["**Cảm hứng**: Từ câu chuyện nàng Tiểu Thanh thời Minh.", "**Chủ đề**: Sự đồng cảm sâu sắc với kiếp hồng nhan và tài tử."] }
      ]
    },
    {
      id: "chi-khi-anh-hung",
      title: "Chí khí anh hùng (Trích Truyện Kiều)",
      authorId: "nguyen-du",
      authorName: "Nguyễn Du",
      year: "Đầu Thế kỷ XIX",
      periodId: "p3",
      genre: "Truyện thơ Nôm",
      description: "Khắc họa hình tượng Từ Hải - người anh hùng mang tầm vóc vũ trụ, với lý tưởng tự do và khát vọng lập công danh.",
      slides: [
        { slideNo: 1, title: "CHÍ KHÍ ANH HÙNG", subtitle: "Hình tượng Từ Hải", type: "intro", content: ["**Vị trí**: Nửa sau tác phẩm, khi Từ Hải dứt áo từ biệt Kiều để đi lập nghiệp lớn.", "**Đặc điểm**: Từ Hải là hiện thân của khát vọng tự do và công lý."] }
      ]
    },
    {
      id: "mong-dac-thai-lien",
      title: "Mộng đắc thái liên (Mơ đi hái sen)",
      authorId: "nguyen-du",
      authorName: "Nguyễn Du",
      year: "Đầu Thế kỷ XIX",
      periodId: "p3",
      genre: "Thơ chữ Hán",
      description: "Bài thơ ghi lại một giấc mơ êm đềm, qua đó gửi gắm tình yêu thiên nhiên, sự gắn bó với quê hương và tâm hồn tinh tế của Nguyễn Du.",
      slides: [
        { slideNo: 1, title: "MỘNG ĐẮC THÁI LIÊN", subtitle: "Giấc mơ sen êm đềm", type: "intro", content: ["Thể loại: Ngũ ngôn.", "Bức tranh thơ mộng về cảnh hái sen và tình người xứ sen."] }
      ]
    },
    {
      id: "bai-ca-ngat-nguong",
      title: "Bài ca ngất ngưởng",
      authorId: "nguyen-cong-tru",
      authorName: "Nguyễn Công Trứ",
      year: "Thế kỷ XIX",
      periodId: "p3",
      genre: "Hát nói",
      description: "Bản tuyên ngôn về lối sống 'ngất ngưởng', vượt lên trên danh lợi tầm thường, khẳng định cá tính và bản lĩnh của một nhà Nho tài tử.",
      slides: [
        { slideNo: 1, title: "BÀI CA NGẤT NGƯỞNG", subtitle: "Tuyên ngôn về bản lĩnh cá nhân", type: "intro", content: ["**Hoàn cảnh**: Sáng tác sau khi cáo quan về hưu (1848).", "**Thể loại**: Hát nói - tự do, phóng khoáng, phù hợp bộc lộ cá tính cá nhân."] },
        { slideNo: 2, title: "Sự 'Ngất Ngưởng' Trên Lưng Bò", subtitle: "Đạc ngựa bò vàng đeo ngất ngưởng", type: "analysis", content: ["Khác người, khác đời: Về hưu không cưỡi ngựa mà cưỡi bò vàng.", "Thể hiện thái độ ung dung, tự tại, vượt ra ngoài khuôn khổ Nho giáo khắt khe."] }
      ]
    },"""

if "bai-ca-ngat-nguong" not in data_content:
    data_content = data_content.replace('works: [', 'works: [' + works_grade11)

with open(data_js_path, 'w', encoding='utf-8') as f:
    f.write(data_content)


docs_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\documents.js'
with open(docs_js_path, 'r', encoding='utf-8') as f:
    docs_content = f.read()

docs_grade11 = """
      {
        id: 'doc-grade11-1',
        name: 'Giao_an_Bai_Ca_Ngat_Nguong.docx',
        type: 'word',
        size: '1.5 MB',
        uploadDate: '2026-09-23',
        description: 'Giáo án Ngữ văn 11: Bài ca ngất ngưởng (Nguyễn Công Trứ).',
        url: '#'
      },
      {
        id: 'doc-grade11-2',
        name: 'Chuyen_De_Truyen_Kieu_Lop_11.pdf',
        type: 'pdf',
        size: '3.2 MB',
        uploadDate: '2026-09-23',
        description: 'Chuyên đề ôn tập Truyện Kiều: Trao duyên, Chí khí anh hùng.',
        url: '#'
      },
      {
        id: 'doc-grade11-3',
        name: 'Phieu_Doc_Tieu_Thanh_Ki.docx',
        type: 'word',
        size: '0.5 MB',
        uploadDate: '2026-09-23',
        description: 'Phiếu học tập Độc Tiểu Thanh kí và Mộng đắc thái liên.',
        url: '#'
      },"""

if "doc-grade11-1" not in docs_content:
    docs_content = docs_content.replace('this.documents = [', 'this.documents = [' + docs_grade11)

with open(docs_js_path, 'w', encoding='utf-8') as f:
    f.write(docs_content)

print("Grade 11 data injected.")
