/**
 * Kho Dữ Liệu Văn Học Trung Đại Việt Nam - Academic & Dynamic CRUD Edition
 */

const ALLUSIONS_DB = {
  "to-nga": {
    term: "Tố Nga (素娥)",
    source: "Cổ thi Á Đông",
    meaning: "Hằng Nga trên cung trăng, nghĩa rộng chỉ người con gái đẹp thanh khiết như ánh trăng.",
    context: "Trong 'Chị em Thúy Kiều': Nguyễn Du dùng để chỉ vẻ đẹp thanh cao, trong trắng của Vân và Kiều."
  },
  "mai-cot-cach": {
    term: "Mai cốt cách (梅骨格)",
    source: "Ước lệ cổ điển",
    meaning: "Vóc dáng thanh tú, cứng cỏi và thanh cao như cành hoa mai giữa giá lạnh.",
    context: "Khắc họa thần thái tao nhã của người con gái quý tộc."
  },
  "tuyet-tinh-than": {
    term: "Tuyết tinh thần (雪精神)",
    source: "Ước lệ cổ điển",
    meaning: "Tâm hồn tinh khôi, trong sạch và băng thanh như tuyết trắng.",
    context: "Khắc họa vẻ đẹp nội tâm và đạo đức trong sáng."
  },
  "thu-thuy": {
    term: "Thu thủy (秋水)",
    source: "Trang Tử - 'Thu Thủy'",
    meaning: "Làn nước mùa thu trong veo, tĩnh lặng, gợi vẻ đẹp đôi mắt trong sáng, sâu thẳm của người phụ nữ.",
    context: "Dùng miêu tả đôi mắt Thúy Kiều: 'Làn thu thủy, nét xuân sơn'."
  },
  "xuan-son": {
    term: "Xuân sơn (春山)",
    source: "Cổ thi",
    meaning: "Dáng núi mùa xuân xanh tươi, thanh tú, gợi vẻ đẹp hàng lông mày thanh thoát.",
    context: "Vẻ đẹp nét mày như đôi núi mùa xuân của Thúy Kiều."
  },
  "truc-nam-son": {
    term: "Trúc Nam Sơn (南山竹)",
    source: "Hán thư - 'Tội ác không ghi hết'",
    meaning: "Núi Nam Sơn sản xuất nhiều trúc để làm thẻ tre viết chữ. Trúc Nam Sơn cũng không đủ ghi hết tội ác.",
    context: "Nguyễn Trãi dùng trong 'Bình Ngô Đại Cáo': 'Độc ác thay, trúc Nam Sơn không ghi hết tội'."
  },
  "nuoc-dong-hai": {
    term: "Nước Đông Hải (東海沲)",
    source: "Điển cổ chính luận Hán văn",
    meaning: "Biển Đông bao la rộng lớn. Nước cả biển Đông cũng không rửa sạch bẩn thỉu tội ác quân thù.",
    context: "Nguyễn Trãi dùng để nhấn mạnh sự dơ bẩn, dã man của quân Minh xâm lược."
  },
  "dieu-phat": {
    term: "Điếu phạt (吊伐)",
    source: "Kinh Thư - 'Thương Thang phạt Kiệt'",
    meaning: "Điếu dân phạt tội (Thương xóm xóm dân lành khổ sở, tiêu diệt kẻ bạo ngược cai trị).",
    context: "Tư tưởng chính nghĩa: 'Quân điếu phạt trước lo trừ bạo'."
  },
  "nam-de": {
    term: "Nam Đế (南帝)",
    source: "Tự tôn dân tộc",
    meaning: "Hoàng đế phương Nam. Thể hiện tư tưởng bình đẳng, ngang hàng tối cao với Hoàng đế phương Bắc (Bắc Đế).",
    context: "Bài thơ thần 'Nam Quốc Sơn Hà': 'Nam quốc sơn hà Nam đế cư'."
  }
};

const MEDIEVAL_DATA = {
  periods: [
    {
      id: "p1",
      name: "Thế kỷ X - XV",
      title: "Giai đoạn Định hình & Khẳng định Chủ quyền",
      description: "Giai đoạn đất nước giành lại độc lập tự chủ (từ nhà Ngô, Đinh, Tiền Lê đến Lý, Trần, Lê Sơ). Văn học mang đậm hào khí Đông A, chủ nghĩa yêu nước và tinh thần tự hào dân tộc.",
      characteristics: [
        "Văn học chữ Hán chiếm ưu thế với các thể loại hành chính - chính luận: Chiếu, Hịch, Cáo, Thơ.",
        "Văn học chữ Nôm bắt đầu xuất hiện (Nguyễn Trãi với Quốc Âm Thi Tập).",
        "Cảm hứng chủ đạo: Khẳng định chủ quyền đất nước, lòng yêu nước, tinh thần Nhân nghĩa."
      ]
    },
    {
      id: "p2",
      name: "Thế kỷ XVI - XVII",
      title: "Giai đoạn Biến động & Phản ánh Hiện thực",
      description: "Xã hội phong kiến bắt đầu khủng hoảng, nội chiến Trịnh - Nguyễn. Văn học chuyển hướng phản ánh xung đột xã hội và số phận con người.",
      characteristics: [
        "Sự phát triển mạnh mẽ của văn học Nôm và thể loại Truyền kỳ (Truyền kỳ mạn lục).",
        "Triết lý nhàn dật, phê phán hiện thực (Nguyễn Bỉnh Khiêm).",
        "Văn học bắt đầu chú ý hơn đến đời sống cá nhân và tâm trạng con người."
      ]
    },
    {
      id: "p3",
      name: "Thế kỷ XVIII - nửa đầu XIX",
      title: "Giai đoạn Đỉnh cao Văn học Nôm & Cảm hứng Nhân đạo",
      description: "Giai đoạn phát triển rực rỡ nhất của văn học trung đại. Phong trào nông dân khởi nghĩa đỉnh cao là Tây Sơn. Văn học mang nặng nỗi niềm nhân đạo.",
      characteristics: [
        "Văn học chữ Nôm đạt đến đỉnh cao rực rỡ với các thể Truyện thơ Nôm, Ngâm khúc, Thơ Nôm đường luật.",
        "Trào lưu nhân đạo chủ nghĩa: Đề cao quyền sống, khát vọng hạnh phúc, cảm thông sâu sắc với phụ nữ.",
        "Các kiệt tác: Truyện Kiều (Nguyễn Du), Chinh phụ ngâm, Thơ Hồ Xuân Hương, Bích Câu kỳ ngộ."
      ]
    },
    {
      id: "p4",
      name: "Nửa sau thế kỷ XIX",
      title: "Giai đoạn Văn học Yêu nước Chống Pháp",
      description: "Thực dân Pháp xâm lược Việt Nam. Văn học chuyển sang nhiệm vụ cổ vũ chiến đấu, thể hiện nỗi đau mất nước và ca ngợi người anh hùng nghĩa quân.",
      characteristics: [
        "Thơ văn yêu nước mang đậm tính chiến đấu (Nguyễn Đình Chiểu).",
        "Thơ trữ tình trào phán phê phán xã hội giao thời (Nguyễn Khuyến, Trần Tế Xương).",
        "Chuẩn bị cho bước chuyển sang văn học hiện đại đầu thế kỷ XX."
      ]
    }
  ],

  authors: [
    {
      id: "nguyen-du-truyen-ky",
      name: "Nguyễn Dữ",
      lifespan: "Thế kỷ XVI",
      dynasty: "Thời Lê Trung Hưng",
      description: "Nguyễn Dữ là học trò xuất sắc của Tuyết Giang Phu Tử Nguyễn Bỉnh Khiêm. Ông chỉ làm quan một năm rồi lui về ẩn cư, để lại kiệt tác Truyền kỳ mạn lục.",
      famousWorks: ["Truyền kỳ mạn lục"],
      avatar: "fa-feather"
    },
    {
      id: "nguyen-trai",
      name: "Nguyễn Trãi",
      courtesyName: "Ức Trai",
      years: "1380 - 1442",
      hometown: "Làng Chi Căng, Nhị Khê (Hà Nội) / Chí Linh (Hải Dương)",
      title: "Anh hùng dân tộc - Danh nhân văn hóa thế giới",
      avatar: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80",
      bio: "Nguyễn Trãi là nhà chính trị, quân sự, triết gia, nhà thơ lớn của dân tộc Việt Nam. Ông đã cùng Lê Lợi lãnh đạo cuộc khởi nghĩa Lam Sơn chiến thắng giặc Minh xâm lược. Năm 1980, ông được UNESCO công nhận là Danh nhân văn hóa thế giới.",
      style: "Văn chính luận kiệt xuất, mực thước, sắc bén, chan chứa tình yêu thiên nhiên và lòng thương dân sâu sắc.",
      majorWorks: ["Bình Ngô Đại Cáo", "Quân Trung Từ Mệnh Tập", "Ức Trai Thi Tập", "Quốc Âm Thi Tập"],
      quote: "Việc nhân nghĩa cốt ở yên dân / Quân điếu phạt trước lo trừ bạo."
    },
    {
      id: "nguyen-du",
      name: "Nguyễn Du",
      courtesyName: "Tố Như, hiệu Thanh Hiên",
      years: "1765 - 1820",
      hometown: "Làng Tiên Điền, huyện Nghi Xuân, tỉnh Hà Tĩnh",
      title: "Đại thi hào dân tộc - Danh nhân văn hóa thế giới",
      avatar: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
      bio: "Nguyễn Du sinh ra trong một gia đình đại quý tộc có truyền thống khoa bảng và văn học. Trải qua thời kỳ biến cố lịch sử Tây Sơn - Nguyễn, ông thấu hiểu sâu sắc nỗi đau khổ của nhân dân. Năm 2013, ông được UNESCO vinh danh là Danh nhân văn hóa thế giới.",
      style: "Thần đồng ngôn ngữ Nôm, bút pháp tả cảnh ngụ tình bậc thầy, trái tim nhân đạo mênh mông.",
      majorWorks: ["Truyện Kiều (Đoạn Trường Tân Thanh)", "Thanh Hiên Thi Tập", "Bắc Hành Tạp Lục"],
      quote: "Trải qua một cuộc dâu bể, / Những điều trông thấy mà đau đớn lòng."
    },
    {
      id: "tran-quoc-tuan",
      name: "Trần Quốc Tuấn",
      courtesyName: "Hưng Đạo Đại Vương",
      years: "1231 - 1300",
      hometown: "Tức Mặc, Thiên Trường (Nam Định)",
      title: "Anh hùng dân tộc - Nhà quân sự kiệt xuất",
      avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80",
      bio: "Trần Quốc Tuấn là danh tướng đời Trần, người chỉ huy quân dân Đại Việt 3 lần đánh tan quân xâm lược Mông - Nguyên hùng mạnh bậc nhất thế giới đương thời.",
      style: "Văn phong hùng khí Đông A, hừng hực tinh thần yêu nước, lý luận quân sự sắc bén.",
      majorWorks: ["Hịch Tướng Sĩ (Dụ Chư Tướng Sĩ Văn)", "Binh Thư Yếu Lược"],
      quote: "Nửa đêm vỗ gối, ruột đau như cắt, nước mắt đầm đìa, chỉ căm tức rằng chưa xả thịt lột da, nuốt gan uống máu kẻ thù."
    },
    {
      id: "ly-thuong-kiet",
      name: "Lý Thường Kiệt",
      courtesyName: "Lý Thường Kiệt (Họ Ngô)",
      years: "1019 - 1105",
      hometown: "Phường Cơ Xá, Thăng Long (Hà Nội)",
      title: "Danh tướng đời Lý - Nhà chính trị tài ba",
      avatar: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80",
      bio: "Lý Thường Kiệt là người chỉ huy cuộc kháng chiến chống quân Tống (1075-1077), nổi tiếng với chiến thuật 'tiên phát chế nhân' và bài thơ thần khẳng định chủ quyền trên sông Như Nguyệt.",
      style: "Lời văn dũng mãnh, quyết đoán, tràn đầy lòng tự hào dân tộc.",
      majorWorks: ["Nam Quốc Sơn Hà", "Phạt Tống Lộ Bố Văn"],
      quote: "Nam quốc sơn hà Nam đế cư / Tiệt nhiên định phận tại thiên thư."
    },
    {
      id: "ho-xuan-huong",
      name: "Hồ Xuân Hương",
      courtesyName: "Bà chúa thơ Nôm",
      years: "Thế kỷ XVIII - XIX",
      hometown: "Làng Quỳnh Đôi, huyện Quỳnh Lưu, tỉnh Nghệ An",
      title: "Nữ sĩ kiệt xuất - Bà chúa Thơ Nôm",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Nữ sĩ tài hoa có cuộc đời nhiều truân chuyên. Thơ Hồ Xuân Hương vừa độc đáo, vừa thách thức lễ giáo phong kiến, cất lên tiếng nói đòi quyền sống cho phụ nữ.",
      style: "Thơ Nôm đường luật cá tính mạnh mẽ, ngôn ngữ bình dân hóm hỉnh trào phán.",
      majorWorks: ["Bánh Trôi Nước", "Tự Tình (I, II, III)", "Quả Mít"],
      quote: "Thân em vừa trắng lại vừa tròn / 7 nổi 3 chìm với nước non."
    }
  ],

  works: [
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
    },
    {
      id: "binh-ngo-dai-cao",
      title: "Bình Ngô Đại Cáo",
      authorId: "nguyen-trai",
      authorName: "Nguyễn Trãi",
      year: "1428",
      periodId: "p1",
      genre: "Cáo (Chính luận Hán văn)",
      description: "Bản Tuyên ngôn Độc lập thứ hai của dân tộc Việt Nam, tổng kết cuộc kháng chiến Lam Sơn 10 năm gian khổ đánh tan quân xâm lược nhà Minh.",
      hanNomUrl: "https://hannom.misa.vn/search?q=binh+ngo+dai+cao",
      nomDictionaryLink: "https://nomfoundation.org/",
      writingPrompt: "Viết một đoạn văn nghị luận (khoảng 150 - 200 chữ) trình bày suy nghĩ của em về tư tưởng Nhân nghĩa trong bài 'Bình Ngô Đại Cáo' và bài học đối với thế hệ trẻ ngày nay.",
      mindmap: {
        title: "Sơ Đồ Bố Cục Bình Ngô Đại Cáo",
        nodes: [
          { id: "m1", label: "1. Tiền đề tư tưởng Nhân nghĩa", details: "Yên dân, trừ bạo & Khẳng định chủ quyền Đại Việt." },
          { id: "m2", label: "2. Tố cáo tội ác kẻ thù nhà Minh", details: "Vạch trần âm mưu mạo danh, chính sách thuế bóc lột dã man." },
          { id: "m3", label: "3. Quá trình Kháng chiến Lam Sơn", details: "Giai đoạn đầu gian khổ -> Giai đoạn phản công hào hùng -> Chu cấp thuyền xe hiếu sinh." },
          { id: "m4", label: "4. Tuyên bố độc lập & Hòa bình", details: "Trịnh trọng tuyên bố đất nước thái bình, mở ra kỷ nguyên mới." }
        ]
      },
      parallelContent: [
        {
          lineNo: 1,
          hanOriginal: "仁義之舉，要在安民；吊伐之師，莫先去暴。",
          sinoVietnamese: "Nhân nghĩa chi cử, yếu tại an dân; / Điếu phạt chi sư, mạc tiên khứ bạo.",
          translation: "Việc nhân nghĩa cốt ở yên dân, / Quân điếu phạt trước lo trừ bạo.",
          notes: "Nêu tiền đề tư tưởng 'Nhân nghĩa'.",
          allusions: ["dieu-phat"]
        },
        {
          lineNo: 2,
          hanOriginal: "惟我大越之國，實爲文獻之邦。",
          sinoVietnamese: "Duy ngã Đại Việt chi quốc, / Thực vi văn hiến chi bang.",
          translation: "Như nước Đại Việt ta từ trước, / Vốn xưng nền văn hiến đã lâu.",
          notes: "Khẳng định nền văn hiến lâu đời."
        }
      ],
      slides: [
        {
          slideNo: 1,
          title: "BÌNH NGÔ ĐẠI CÁO - NGUYỄN TRÃI",
          subtitle: "Bản Tuyên Ngôn Độc Lập Thứ Hai Của Dân Tộc",
          type: "intro",
          content: [
            "**Tác giả**: Nguyễn Trãi (1380 - 1442) - Anh hùng dân tộc, Danh nhân văn hóa thế giới.",
            "**Hoàn cảnh sáng tác**: Đầu năm 1428, sau chiến thắng quân Minh.",
            "**Thể loại**: Cáo (văn biền ngẫu Hán văn)."
          ],
          teacherNotes: "Giáo viên nhấn mạnh bối cảnh lịch sử năm 1428."
        }
      ]
    },
    {
      id: "truyen-kieu-chi-em-thuy-kieu",
      title: "Truyện Kiều - Chị Em Thúy Kiều",
      authorId: "nguyen-du",
      authorName: "Nguyễn Du",
      year: "Đầu thế kỷ XIX",
      periodId: "p3",
      genre: "Truyện thơ Nôm (Lục bát)",
      description: "Đoạn trích miêu tả vẻ đẹp kiều diễm, tài năng và dự báo số phận trớ trêu của hai chị em Thúy Kiều, Thúy Vân.",
      hanNomUrl: "https://hannom.misa.vn/",
      nomDictionaryLink: "http://nomfoundation.org/nom-project/Tale-of-Kieu",
      writingPrompt: "Phân tích nghệ thuật ước lệ tượng trưng và đòn bẩy miêu tả nhân vật của Nguyễn Du trong đoạn trích 'Chị em Thúy Kiều' (khoảng 200 chữ).",
      mindmap: {
        title: "Sơ Đồ Bố Cục Chị Em Thúy Kiều",
        nodes: [
          { id: "k1", label: "1. 4 câu đầu: Vẻ đẹp chung 2 chị em", details: "Đầu lòng hai ả tố nga - Mai cốt cách, Tuyết tinh thần." },
          { id: "k2", label: "2. 4 câu tiếp: Vẻ đẹp Thúy Vân", details: "Khuôn mặt đầy đặn, nét ngài nở dầy -> Thiên nhiên 'thua, nhường'." },
          { id: "k3", label: "3. 12 câu tiếp: Vẻ đẹp Thúy Kiều", details: "Nghệ thuật đòn bẩy: Thu thủy, Xuân sơn -> Thiên nhiên 'ghen, hờn'." }
        ]
      },
      parallelContent: [
        {
          lineNo: 1,
          hanOriginal: "𥫣𪢅頭𡮤雲𩇢 / 𥘠𥘯𩈘𪦆𪹤雙",
          sinoVietnamese: "Đầu lòng hai ả tố nga, / Thúy Kiều là chị em là Thúy Vân.",
          translation: "Đầu lòng hai ả tố nga, / Thúy Kiều là chị em là Thúy Vân.",
          notes: "Giới thiệu hai người con gái đẹp.",
          allusions: ["to-nga"]
        }
      ],
      slides: [
        {
          slideNo: 1,
          title: "ĐOẠN TRÍCH: CHỊ EM THÚY KIỀU",
          subtitle: "Bút Pháp Ước Lệ Của Nguyễn Du",
          type: "intro",
          content: [
            "**Vị trí đoạn trích**: Thuộc phần mở đầu 'Gặp gỡ và đính ước'.",
            "**Thể thơ**: Lục bát Nôm."
          ],
          teacherNotes: "Hướng dẫn học sinh đọc diễn cảm."
        }
      ]
    }
  ],

  comparativePairs: [
    {
      id: "comp-1",
      title: "So sánh Bức Họa Chân Dung: Thúy Vân vs Thúy Kiều",
      workId1: "truyen-kieu-chi-em-thuy-kieu",
      section1Title: "Chân Dạng Thúy Vân (Phúc Hậu)",
      content1: "Khuôn mặt đầy đặn nét ngài nở dầy / Hoa cười ngọc thốt đoan trang / Mây thua nước tóc tuyết nhường màu da.\n-> Dự báo số phận bình yên, êm ấm.",
      workId2: "truyen-kieu-chi-em-thuy-kieu",
      section2Title: "Chân Dung Thúy Kiều (Sắc Sảo Bạc Mệnh)",
      content2: "Làn thu thủy nét xuân sơn / Hoa ghen thua thắm liễu hờn kém xanh / Một hai nghiêng nước nghiêng thành.\n-> Dự báo số phận tài hoa gánh giông bão.",
      analysis: "Nguyễn Du miêu tả Vân trước làm đòn bẩy tôn Kiều lên. Thái độ thiên nhiên với Vân là 'thua, nhường' (hòa hợp); với Kiều là 'ghen, hờn' (đố kỵ, trớ trêu)."
    },
    {
      id: "comp-2",
      title: "So sánh Tuyên Ngôn Độc Lập: Nam Quốc Sơn Hà vs Bình Ngô Đại Cáo",
      workId1: "nam-quoc-son-ha",
      section1Title: "Nam Quốc Sơn Hà (1077)",
      content1: "Nam quốc sơn hà Nam đế cư / Tiệt nhiên định phận tại thiên thư.\n-> Khẳng định chủ quyền qua Sách Trời (Thiên Thư) & Danh xưng Nam Đế.",
      workId2: "binh-ngo-dai-cao",
      section2Title: "Bình Ngô Đại Cáo (1428)",
      content2: "Thực vi văn hiến chi bang / Sơn xuyên phong vực ký thù / Nam bắc phong tục diệc dị.\n-> Khẳng định chủ quyền toàn diện: Văn hiến, Lãnh thổ, Phong tục, Triều đại, Hào kiệt.",
      analysis: "Bình Ngô Đại Cáo kế thừa và phát triển tư tưởng Nam Quốc Sơn Hà từ chủ quyền lãnh thổ thần linh đến tư tưởng Nhân nghĩa và Văn hiến lâu đời."
    }
  ],

  writingPromptsList: [
    {
      id: "wp-1",
      workTitle: "Bình Ngô Đại Cáo (Nguyễn Trãi)",
      prompt: "Viết một đoạn văn nghị luận (khoảng 150 - 200 chữ) trình bày suy nghĩ của em về tư tưởng Nhân nghĩa trong bài 'Bình Ngô Đại Cáo' và bài học đối với thế hệ trẻ ngày nay.",
      outline: "1. Mở đoạn: Nêu tư tưởng Nhân nghĩa của Nguyễn Trãi.\n2. Thân đoạn: Phân tích 2 khía cạnh (An dân & Trừ bạo). Rút ra bài học sống có trách nhiệm, yêu thương con người.\n3. Kết đoạn: Khẳng định giá trị thời đại của tư tưởng."
    },
    {
      id: "wp-2",
      workTitle: "Truyện Kiều - Chị Em Thúy Kiều (Nguyễn Du)",
      prompt: "Phân tích nghệ thuật ước lệ tượng trưng và đòn bẩy miêu tả nhân vật của Nguyễn Du trong đoạn trích 'Chị em Thúy Kiều' (khoảng 200 chữ).",
      outline: "1. Mở đoạn: Giới thiệu vị trí đoạn trích và tài năng miêu tả con người của Nguyễn Du.\n2. Thân đoạn: Phân tích ước lệ tượng trưng (hoa, tuyết, mây, thu thủy) & nghệ thuật đòn bẩy tả Vân để tôn Kiều.\n3. Kết đoạn: Đánh giá đỉnh cao ngôn từ thơ Nôm."
    }
  ],

  quizzes: [
    {
      id: "q1",
      workId: "binh-ngo-dai-cao",
      question: "Tư tưởng cốt lõi xuyên suốt bài 'Bình Ngô Đại Cáo' của Nguyễn Trãi là gì?",
      options: [
        "A. Khát vọng làm bá chủ các nước phương Nam",
        "B. Tư tưởng Nhân nghĩa cốt ở yên dân và trừ bạo",
        "C. Triết lý nhàn dật lánh đời tìm về thiên nhiên",
        "D. Ý định trả thù quân xâm lược Minh"
      ],
      correctAnswer: 1,
      explanation: "Nguyễn Trãi mở đầu tác phẩm bằng khẳng định: 'Việc nhân nghĩa cốt ở yên dân / Quân điếu phạt trước lo trừ bạo'."
    }
  ]
};
