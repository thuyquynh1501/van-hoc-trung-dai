import re

data_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\data.js'
with open(data_js_path, 'r', encoding='utf-8') as f:
    data_content = f.read()

# Add author Nguyen Du (Truyen ky man luc)
author_nguyen_du_truyen_ky = """
    {
      id: "nguyen-du-truyen-ky",
      name: "Nguyễn Dữ",
      lifespan: "Thế kỷ XVI",
      dynasty: "Thời Lê Trung Hưng",
      description: "Nguyễn Dữ là học trò xuất sắc của Tuyết Giang Phu Tử Nguyễn Bỉnh Khiêm. Ông chỉ làm quan một năm rồi lui về ẩn cư, để lại kiệt tác Truyền kỳ mạn lục.",
      famousWorks: ["Truyền kỳ mạn lục"],
      avatar: "fa-feather"
    },"""

if "nguyen-du-truyen-ky" not in data_content:
    data_content = data_content.replace('authors: [', 'authors: [' + author_nguyen_du_truyen_ky)

# Add works
works_to_inject = """
    {
      id: "guong-bau-khuyen-ran-43",
      title: "Gương báu khuyên răn (Bài 43 - Cảnh ngày hè)",
      authorId: "nguyen-trai",
      authorName: "Nguyễn Trãi",
      year: "Thế kỷ XV",
      periodId: "p1",
      genre: "Thơ Nôm (Quốc âm thi tập)",
      description: "Bài thơ thể hiện tình yêu thiên nhiên, đất nước và tấm lòng ưu dân ái quốc sâu sắc của Nguyễn Trãi.",
      hanNomUrl: "https://hannom.misa.vn/",
      nomDictionaryLink: "http://nomfoundation.org/",
      writingPrompt: "Phân tích bức tranh thiên nhiên và tâm hồn Nguyễn Trãi trong bài Cảnh ngày hè (Gương báu khuyên răn, bài 43).",
      slides: [
        {
          slideNo: 1,
          title: "BẢO KÍNH CẢNH GIỚI (Bài 43) - NGUYỄN TRÃI",
          subtitle: "Bức Tranh Thiên Nhiên Và Tấm Lòng Ưu Dân Ái Quốc",
          type: "intro",
          content: [
            "**Tác giả**: Nguyễn Trãi (1380 - 1442).",
            "**Xuất xứ**: Bài số 43 thuộc chùm thơ Bảo kính cảnh giới (Gương báu khuyên răn) - Quốc âm thi tập.",
            "**Thể loại**: Thơ Nôm Đường luật (thất ngôn xen lục ngôn)."
          ]
        },
        {
          slideNo: 2,
          title: "Bức Tranh Cảnh Ngày Hè",
          subtitle: "Rực rỡ, tràn đầy sức sống",
          type: "analysis",
          content: [
            "Hòe lục đùn đùn tán rợp trương",
            "Thạch lựu hiên còn phun thức đỏ",
            "Hồng liên trì đã tiễn mùi hương",
            "-> Động từ mạnh 'đùn đùn', 'phun': Sức sống căng đầy từ bên trong tạo vật."
          ]
        },
        {
          slideNo: 3,
          title: "Tấm Lòng Nguyễn Trãi",
          subtitle: "Dân giàu đủ khắp đòi phương",
          type: "summary",
          content: [
            "Lẽ ra cáo quan về ở ẩn phải là lúc thảnh thơi, nhưng Nguyễn Trãi vẫn nặng lòng với dân nước.",
            "Khát vọng lớn nhất: Nhân dân được ấm no, hạnh phúc."
          ]
        }
      ]
    },
    {
      id: "tan-vien-tu-phan-su-luc",
      title: "Chuyện chức phán sự đền Tản Viên",
      authorId: "nguyen-du-truyen-ky",
      authorName: "Nguyễn Dữ",
      year: "Thế kỷ XVI",
      periodId: "p2",
      genre: "Truyền kỳ mạn lục",
      description: "Đề cao tinh thần khảng khái, cương trực, dám đấu tranh chống lại cái ác trừ hại cho dân của Ngô Tử Văn.",
      hanNomUrl: "https://hannom.misa.vn/",
      nomDictionaryLink: "http://nomfoundation.org/",
      writingPrompt: "Phân tích nhân vật Ngô Tử Văn trong Chuyện chức phán sự đền Tản Viên để làm nổi bật vẻ đẹp của kẻ sĩ Việt Nam.",
      slides: [
        {
          slideNo: 1,
          title: "CHUYỆN CHỨC PHÁN SỰ ĐỀN TẢN VIÊN",
          subtitle: "Nguyễn Dữ",
          type: "intro",
          content: [
            "**Tác giả**: Nguyễn Dữ (sống vào thế kỷ XVI).",
            "**Tác phẩm**: Truyền kỳ mạn lục - Thiên cổ kỳ bút.",
            "**Nhân vật chính**: Ngô Tử Văn - biểu tượng của người trí thức cương trực, khảng khái."
          ]
        }
      ]
    },
    {
      id: "duc-thuy-son",
      title: "Dục Thúy Sơn (Núi Dục Thúy)",
      authorId: "nguyen-trai",
      authorName: "Nguyễn Trãi",
      year: "Thế kỷ XV",
      periodId: "p1",
      genre: "Thơ chữ Hán",
      description: "Bài thơ chữ Hán miêu tả vẻ đẹp tiên cảnh của núi Dục Thúy và nỗi hoài cổ của tác giả về Trương Hán Siêu.",
      slides: [
        {
          slideNo: 1,
          title: "DỤC THÚY SƠN - NGUYỄN TRÃI",
          subtitle: "Vẻ Đẹp Tiên Cảnh & Nỗi Hoài Cổ",
          type: "intro",
          content: [
            "**Núi Dục Thúy**: Còn gọi là núi Non Nước ở Ninh Bình.",
            "Bài thơ vừa khắc họa bức tranh phong cảnh sơn thủy hữu tình, vừa gửi gắm nỗi niềm hoài cổ về Trương Hán Siêu."
          ]
        }
      ]
    },
    {
      id: "ngon-chi-bai-3",
      title: "Ngôn chí (Bài 3)",
      authorId: "nguyen-trai",
      authorName: "Nguyễn Trãi",
      year: "Thế kỷ XV",
      periodId: "p1",
      genre: "Thơ Nôm",
      description: "Bài thơ bộc lộ vẻ đẹp tâm hồn Nguyễn Trãi: hòa hợp với thiên nhiên nhưng luôn canh cánh nỗi niềm quốc trí dân an.",
      slides: [
        {
          slideNo: 1,
          title: "NGÔN CHÍ (BÀI 3) - NGUYỄN TRÃI",
          subtitle: "Vẻ Đẹp Tâm Hồn Ưu Dân Ái Quốc",
          type: "intro",
          content: [
            "Thuộc chùm thơ Ngôn Chí - Quốc Âm Thi Tập.",
            "Thể hiện lối sống thanh cao, giản dị và lý tưởng yêu nước thương dân bất diệt."
          ]
        }
      ]
    },
    {
      id: "bach-dang-hai-khau",
      title: "Bạch Đằng hải khẩu",
      authorId: "nguyen-trai",
      authorName: "Nguyễn Trãi",
      year: "Thế kỷ XV",
      periodId: "p1",
      genre: "Thơ chữ Hán",
      description: "Bài thơ thể hiện niềm tự hào về sông Bạch Đằng lịch sử và suy ngẫm sâu sắc về hưng vong của đất nước.",
      slides: [
        {
          slideNo: 1,
          title: "BẠCH ĐẰNG HẢI KHẨU - NGUYỄN TRÃI",
          subtitle: "Cửa Biển Bạch Đằng Hào Hùng",
          type: "intro",
          content: [
            "Bức tranh thiên nhiên hùng vĩ, hiểm trở.",
            "Khẳng định chân lý: Nhân tài mới là yếu tố quyết định sự tồn vong của đất nước, không phải địa hình hiểm trở."
          ]
        }
      ]
    },"""

if "guong-bau-khuyen-ran-43" not in data_content:
    data_content = data_content.replace('works: [', 'works: [' + works_to_inject)

with open(data_js_path, 'w', encoding='utf-8') as f:
    f.write(data_content)


# Now Documents
docs_js_path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\documents.js'
with open(docs_js_path, 'r', encoding='utf-8') as f:
    docs_content = f.read()

docs_to_inject = """
      {
        id: 'doc-grade10-1',
        name: 'Giao_an_Tan_Vien_Tu_Phan_Su_Luc_Nang_Luc.docx',
        type: 'word',
        size: '1.4 MB',
        uploadDate: '2026-09-23',
        description: 'Giáo án Ngữ văn 10: Chuyện chức phán sự đền Tản Viên (Nguyễn Dữ).',
        methodId: 'method-1',
        url: '#'
      },
      {
        id: 'doc-grade10-2',
        name: 'Slide_Bao_Kinh_Canh_Gioi_43_Chuan.pptx',
        type: 'ppt',
        size: '5.2 MB',
        uploadDate: '2026-09-23',
        description: 'Bài giảng điện tử Gương báu khuyên răn (Cảnh ngày hè) - Nguyễn Trãi.',
        methodId: 'method-2',
        url: '#'
      },
      {
        id: 'doc-grade10-3',
        name: 'Phieu_Hoc_Tap_Tho_Nom_Nguyen_Trai.pdf',
        type: 'pdf',
        size: '0.8 MB',
        uploadDate: '2026-09-23',
        description: 'Phiếu bài tập tìm hiểu Dục Thúy sơn, Ngôn chí bài 3 và Bạch Đằng hải khẩu.',
        url: '#'
      },"""

if "doc-grade10-1" not in docs_content:
    # Find this.documents = [
    docs_content = docs_content.replace('this.documents = [', 'this.documents = [' + docs_to_inject)

with open(docs_js_path, 'w', encoding='utf-8') as f:
    f.write(docs_content)

print("Data successfully injected.")
