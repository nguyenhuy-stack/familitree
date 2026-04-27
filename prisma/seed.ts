import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.member.deleteMany()

  const members = [
    // ═══ THẾ HỆ 1: Cụ Ông Cụ Bà ═══
    { id: '1', name: 'Nguyễn Văn Tổ', role: 'Cụ Ông', gender: 'male' },
    { id: '2', name: 'Phạm Thị Hiền', role: 'Cụ Bà', gender: 'female', spouseId: '1' },

    // ═══ THẾ HỆ 2: Ông Bà (4 người con của Cụ) ═══
    // Nhánh 1: Con Cả
    { id: '10', name: 'Nguyễn Văn Đức', role: 'Ông Nội', gender: 'male', parentId: '1' },
    { id: '11', name: 'Trần Thị Lan', role: 'Bà Nội', gender: 'female', spouseId: '10' },
    // Nhánh 2: Con Thứ
    { id: '12', name: 'Nguyễn Văn Thành', role: 'Ông Hai', gender: 'male', parentId: '1' },
    { id: '13', name: 'Lê Thị Mai', role: 'Bà Hai', gender: 'female', spouseId: '12' },
    // Nhánh 3: Con Ba
    { id: '14', name: 'Nguyễn Thị Hoa', role: 'Cô Ba', gender: 'female', parentId: '1' },
    { id: '15', name: 'Đặng Văn Phúc', role: 'Dượng Ba', gender: 'male', spouseId: '14' },
    // Nhánh 4: Con Tư
    { id: '16', name: 'Nguyễn Văn Tài', role: 'Chú Tư', gender: 'male', parentId: '1' },
    { id: '17', name: 'Võ Thị Ngọc', role: 'Thím Tư', gender: 'female', spouseId: '16' },

    // ═══ THẾ HỆ 3: Cha Mẹ (con của các Ông Bà) ═══
    // --- Nhánh Ông Đức (10) ---
    { id: '20', name: 'Nguyễn Văn Hùng', role: 'Bác Cả', gender: 'male', parentId: '10' },
    { id: '21', name: 'Hoàng Thị Thuỷ', role: 'Bác Gái', gender: 'female', spouseId: '20' },
    { id: '22', name: 'Nguyễn Văn Dũng', role: 'Cha', gender: 'male', parentId: '10' },
    { id: '23', name: 'Lê Thị Hạnh', role: 'Mẹ', gender: 'female', spouseId: '22' },
    { id: '24', name: 'Nguyễn Thị Thuý', role: 'Cô Út', gender: 'female', parentId: '10' },
    { id: '25', name: 'Bùi Văn Long', role: 'Chú Út', gender: 'male', spouseId: '24' },

    // --- Nhánh Ông Thành (12) ---
    { id: '30', name: 'Nguyễn Văn Minh', role: 'Bác Minh', gender: 'male', parentId: '12' },
    { id: '31', name: 'Phạm Thị Hằng', role: 'Bác Gái Minh', gender: 'female', spouseId: '30' },
    { id: '32', name: 'Nguyễn Thị Liên', role: 'Cô Liên', gender: 'female', parentId: '12' },
    { id: '33', name: 'Trịnh Văn Hoà', role: 'Dượng Hoà', gender: 'male', spouseId: '32' },
    { id: '34', name: 'Nguyễn Văn Quang', role: 'Chú Quang', gender: 'male', parentId: '12' },
    { id: '35', name: 'Đỗ Thị Nga', role: 'Thím Quang', gender: 'female', spouseId: '34' },
    { id: '36', name: 'Nguyễn Văn Bình', role: 'Chú Bình', gender: 'male', parentId: '12' },
    { id: '37', name: 'Cao Thị Phương', role: 'Thím Bình', gender: 'female', spouseId: '36' },

    // --- Nhánh Cô Ba (14) ---
    { id: '40', name: 'Đặng Văn Tuấn', role: 'Anh Tuấn', gender: 'male', parentId: '14' },
    { id: '41', name: 'Ngô Thị Yến', role: 'Chị Yến', gender: 'female', spouseId: '40' },
    { id: '42', name: 'Đặng Thị Hương', role: 'Chị Hương', gender: 'female', parentId: '14' },
    { id: '43', name: 'Lý Văn Đạt', role: 'Anh Đạt', gender: 'male', spouseId: '42' },
    { id: '44', name: 'Đặng Văn Khoa', role: 'Em Khoa', gender: 'male', parentId: '14' },

    // --- Nhánh Chú Tư (16) ---
    { id: '50', name: 'Nguyễn Văn Phong', role: 'Anh Phong', gender: 'male', parentId: '16' },
    { id: '51', name: 'Đinh Thị Trang', role: 'Chị Trang', gender: 'female', spouseId: '50' },
    { id: '52', name: 'Nguyễn Thị Vy', role: 'Chị Vy', gender: 'female', parentId: '16' },
    { id: '53', name: 'Hồ Văn Sơn', role: 'Anh Sơn', gender: 'male', spouseId: '52' },
    { id: '54', name: 'Nguyễn Văn An', role: 'Em An', gender: 'male', parentId: '16' },
    { id: '55', name: 'Phan Thị Kim', role: 'Em Kim', gender: 'female', spouseId: '54' },

    // ═══ THẾ HỆ 4: Cháu (con của thế hệ 3) ═══
    // --- Con Bác Hùng (20) ---
    { id: '100', name: 'Nguyễn Văn Nhật', role: 'Cháu Cả', gender: 'male', parentId: '20' },
    { id: '101', name: 'Trương Thị Bích', role: 'Vợ Nhật', gender: 'female', spouseId: '100' },
    { id: '102', name: 'Nguyễn Thị Ngân', role: 'Cháu Gái', gender: 'female', parentId: '20' },
    { id: '103', name: 'Nguyễn Văn Tú', role: 'Cháu Út', gender: 'male', parentId: '20' },

    // --- Con Cha Dũng (22) ---
    { id: '110', name: 'Nguyễn Văn Khôi', role: 'Con Cả', gender: 'male', parentId: '22' },
    { id: '111', name: 'Lâm Thị Vân', role: 'Vợ Khôi', gender: 'female', spouseId: '110' },
    { id: '112', name: 'Nguyễn Thị Mai', role: 'Con Gái', gender: 'female', parentId: '22' },
    { id: '113', name: 'Vương Văn Nam', role: 'Chồng Mai', gender: 'male', spouseId: '112' },
    { id: '114', name: 'Nguyễn Văn Đạo', role: 'Con Thứ', gender: 'male', parentId: '22' },
    { id: '115', name: 'Nguyễn Thị Linh', role: 'Con Út', gender: 'female', parentId: '22' },

    // --- Con Cô Thuý (24) ---
    { id: '120', name: 'Bùi Văn Hải', role: 'Cháu Hải', gender: 'male', parentId: '24' },
    { id: '121', name: 'Bùi Thị Trâm', role: 'Cháu Trâm', gender: 'female', parentId: '24' },

    // --- Con Bác Minh (30) ---
    { id: '130', name: 'Nguyễn Văn Lộc', role: 'Cháu Lộc', gender: 'male', parentId: '30' },
    { id: '131', name: 'Kiều Thị Diệu', role: 'Vợ Lộc', gender: 'female', spouseId: '130' },
    { id: '132', name: 'Nguyễn Thị Tuyết', role: 'Cháu Tuyết', gender: 'female', parentId: '30' },
    { id: '133', name: 'Nguyễn Văn Trí', role: 'Cháu Trí', gender: 'male', parentId: '30' },
    { id: '134', name: 'Dương Thị Hà', role: 'Vợ Trí', gender: 'female', spouseId: '133' },

    // --- Con Cô Liên (32) ---
    { id: '140', name: 'Trịnh Văn Kiên', role: 'Cháu Kiên', gender: 'male', parentId: '32' },
    { id: '141', name: 'Trịnh Thị Hoa', role: 'Cháu Hoa', gender: 'female', parentId: '32' },
    { id: '142', name: 'Ngọc Thị Thanh', role: 'Vợ Kiên', gender: 'female', spouseId: '140' },

    // --- Con Chú Quang (34) ---
    { id: '150', name: 'Nguyễn Văn Vũ', role: 'Cháu Vũ', gender: 'male', parentId: '34' },
    { id: '151', name: 'Nguyễn Thị Ánh', role: 'Cháu Ánh', gender: 'female', parentId: '34' },
    { id: '152', name: 'Nguyễn Văn Hiếu', role: 'Cháu Hiếu', gender: 'male', parentId: '34' },
    { id: '153', name: 'Tạ Thị Mỹ', role: 'Vợ Hiếu', gender: 'female', spouseId: '152' },

    // --- Con Chú Bình (36) ---
    { id: '160', name: 'Nguyễn Thị Phượng', role: 'Cháu Phượng', gender: 'female', parentId: '36' },
    { id: '161', name: 'Nguyễn Văn Toàn', role: 'Cháu Toàn', gender: 'male', parentId: '36' },
    { id: '162', name: 'Lưu Thị Duyên', role: 'Vợ Toàn', gender: 'female', spouseId: '161' },

    // --- Con Anh Tuấn (40) ---
    { id: '170', name: 'Đặng Văn Trung', role: 'Cháu Trung', gender: 'male', parentId: '40' },
    { id: '171', name: 'Đặng Thị Loan', role: 'Cháu Loan', gender: 'female', parentId: '40' },
    { id: '172', name: 'Đặng Văn Thắng', role: 'Cháu Thắng', gender: 'male', parentId: '40' },

    // --- Con Chị Hương (42) ---
    { id: '180', name: 'Lý Văn Tâm', role: 'Cháu Tâm', gender: 'male', parentId: '42' },
    { id: '181', name: 'Lý Thị Hồng', role: 'Cháu Hồng', gender: 'female', parentId: '42' },

    // --- Con Anh Phong (50) ---
    { id: '190', name: 'Nguyễn Văn Quốc', role: 'Cháu Quốc', gender: 'male', parentId: '50' },
    { id: '191', name: 'Mai Thị Xuân', role: 'Vợ Quốc', gender: 'female', spouseId: '190' },
    { id: '192', name: 'Nguyễn Thị Thanh', role: 'Cháu Thanh', gender: 'female', parentId: '50' },
    { id: '193', name: 'Nguyễn Văn Cường', role: 'Cháu Cường', gender: 'male', parentId: '50' },

    // --- Con Chị Vy (52) ---
    { id: '200', name: 'Hồ Văn Đại', role: 'Cháu Đại', gender: 'male', parentId: '52' },
    { id: '201', name: 'Hồ Thị Ngọc', role: 'Cháu Ngọc', gender: 'female', parentId: '52' },
    { id: '202', name: 'Châu Thị Hương', role: 'Vợ Đại', gender: 'female', spouseId: '200' },

    // --- Con Em An (54) ---
    { id: '210', name: 'Nguyễn Văn Tín', role: 'Cháu Tín', gender: 'male', parentId: '54' },
    { id: '211', name: 'Nguyễn Thị Hằng', role: 'Cháu Hằng', gender: 'female', parentId: '54' },

    // ═══ THẾ HỆ 5: Chắt (con của thế hệ 4) ═══
    // --- Con Nhật (100) ---
    { id: '300', name: 'Nguyễn Văn Bảo', role: 'Chắt Bảo', gender: 'male', parentId: '100' },
    { id: '301', name: 'Nguyễn Thị Châu', role: 'Chắt Châu', gender: 'female', parentId: '100' },
    { id: '302', name: 'Nguyễn Văn Phát', role: 'Chắt Phát', gender: 'male', parentId: '100' },

    // --- Con Khôi (110) ---
    { id: '310', name: 'Nguyễn Văn Phúc', role: 'Chắt Phúc', gender: 'male', parentId: '110' },
    { id: '311', name: 'Nguyễn Thị Ngọc', role: 'Chắt Ngọc', gender: 'female', parentId: '110' },
    { id: '312', name: 'Nguyễn Văn Tâm', role: 'Chắt Tâm', gender: 'male', parentId: '110' },
    { id: '313', name: 'Nguyễn Thị Anh', role: 'Chắt Anh', gender: 'female', parentId: '110' },

    // --- Con Mai (112) ---
    { id: '320', name: 'Vương Văn Huy', role: 'Chắt Huy', gender: 'male', parentId: '112' },
    { id: '321', name: 'Vương Thị Trinh', role: 'Chắt Trinh', gender: 'female', parentId: '112' },

    // --- Con Lộc (130) ---
    { id: '330', name: 'Nguyễn Văn Thịnh', role: 'Chắt Thịnh', gender: 'male', parentId: '130' },
    { id: '331', name: 'Nguyễn Thị Uyên', role: 'Chắt Uyên', gender: 'female', parentId: '130' },
    { id: '332', name: 'Nguyễn Văn Nghĩa', role: 'Chắt Nghĩa', gender: 'male', parentId: '130' },

    // --- Con Trí (133) ---
    { id: '340', name: 'Nguyễn Văn Đông', role: 'Chắt Đông', gender: 'male', parentId: '133' },
    { id: '341', name: 'Nguyễn Thị Xuân', role: 'Chắt Xuân', gender: 'female', parentId: '133' },

    // --- Con Kiên (140) ---
    { id: '350', name: 'Trịnh Văn Lâm', role: 'Chắt Lâm', gender: 'male', parentId: '140' },
    { id: '351', name: 'Trịnh Thị My', role: 'Chắt My', gender: 'female', parentId: '140' },

    // --- Con Hiếu (152) ---
    { id: '360', name: 'Nguyễn Văn Hào', role: 'Chắt Hào', gender: 'male', parentId: '152' },
    { id: '361', name: 'Nguyễn Thị Diệp', role: 'Chắt Diệp', gender: 'female', parentId: '152' },

    // --- Con Toàn (161) ---
    { id: '370', name: 'Nguyễn Văn Vinh', role: 'Chắt Vinh', gender: 'male', parentId: '161' },
    { id: '371', name: 'Nguyễn Thị Tuyến', role: 'Chắt Tuyến', gender: 'female', parentId: '161' },

    // --- Con Trung (170) ---
    { id: '380', name: 'Đặng Văn Tiến', role: 'Chắt Tiến', gender: 'male', parentId: '170' },
    { id: '381', name: 'Đặng Thị Mơ', role: 'Chắt Mơ', gender: 'female', parentId: '170' },

    // --- Con Quốc (190) ---
    { id: '390', name: 'Nguyễn Văn Lợi', role: 'Chắt Lợi', gender: 'male', parentId: '190' },
    { id: '391', name: 'Nguyễn Thị Sen', role: 'Chắt Sen', gender: 'female', parentId: '190' },
    { id: '392', name: 'Nguyễn Văn Đảo', role: 'Chắt Đảo', gender: 'male', parentId: '190' },

    // --- Con Đại (200) ---
    { id: '400', name: 'Hồ Văn Lực', role: 'Chắt Lực', gender: 'male', parentId: '200' },
    { id: '401', name: 'Hồ Thị Lan', role: 'Chắt Lan', gender: 'female', parentId: '200' },

    // ═══ THÊM DỮ LIỆU MỞ RỘNG ═══
    // Thêm con cho Đạo (114)
    { id: '500', name: 'Trần Thị Thu', role: 'Vợ Đạo', gender: 'female', spouseId: '114' },
    { id: '501', name: 'Nguyễn Văn Khánh', role: 'Chắt Khánh', gender: 'male', parentId: '114' },
    { id: '502', name: 'Nguyễn Thị Ly', role: 'Chắt Ly', gender: 'female', parentId: '114' },

    // Thêm con cho Vũ (150)
    { id: '510', name: 'Lê Thị Thảo', role: 'Vợ Vũ', gender: 'female', spouseId: '150' },
    { id: '511', name: 'Nguyễn Văn Trọng', role: 'Chắt Trọng', gender: 'male', parentId: '150' },
    { id: '512', name: 'Nguyễn Thị Huyền', role: 'Chắt Huyền', gender: 'female', parentId: '150' },

    // Thêm con cho Thắng (172)
    { id: '520', name: 'Hà Thị Giang', role: 'Vợ Thắng', gender: 'female', spouseId: '172' },
    { id: '521', name: 'Đặng Văn Phú', role: 'Chắt Phú', gender: 'male', parentId: '172' },
    { id: '522', name: 'Đặng Thị Liễu', role: 'Chắt Liễu', gender: 'female', parentId: '172' },

    // Thêm con cho Tâm (180)
    { id: '530', name: 'Vũ Thị Quyên', role: 'Vợ Tâm', gender: 'female', spouseId: '180' },
    { id: '531', name: 'Lý Văn Bắc', role: 'Chắt Bắc', gender: 'male', parentId: '180' },
    { id: '532', name: 'Lý Thị Thu', role: 'Chắt Thu', gender: 'female', parentId: '180' },

    // Thêm con cho Cường (193)
    { id: '540', name: 'Đào Thị Huệ', role: 'Vợ Cường', gender: 'female', spouseId: '193' },
    { id: '541', name: 'Nguyễn Văn Đức Anh', role: 'Chắt Đức Anh', gender: 'male', parentId: '193' },

    // Thêm con cho Hải (120)
    { id: '550', name: 'Mạc Thị Dung', role: 'Vợ Hải', gender: 'female', spouseId: '120' },
    { id: '551', name: 'Bùi Văn Sáng', role: 'Chắt Sáng', gender: 'male', parentId: '120' },
    { id: '552', name: 'Bùi Thị Lý', role: 'Chắt Lý', gender: 'female', parentId: '120' },

    // Thêm con cho Tín (210)
    { id: '560', name: 'Hà Thị Nhi', role: 'Vợ Tín', gender: 'female', spouseId: '210' },
    { id: '561', name: 'Nguyễn Văn Tùng', role: 'Chắt Tùng', gender: 'male', parentId: '210' },
    { id: '562', name: 'Nguyễn Thị Hường', role: 'Chắt Hường', gender: 'female', parentId: '210' },

    // Thêm con cho Tú (103)
    { id: '570', name: 'Bạch Thị My', role: 'Vợ Tú', gender: 'female', spouseId: '103' },
    { id: '571', name: 'Nguyễn Văn Thông', role: 'Chắt Thông', gender: 'male', parentId: '103' },
    { id: '572', name: 'Nguyễn Thị Thi', role: 'Chắt Thi', gender: 'female', parentId: '103' },
    { id: '573', name: 'Nguyễn Văn Nghị', role: 'Chắt Nghị', gender: 'male', parentId: '103' },

    // Thêm vợ/chồng và con cho Khoa (44)
    { id: '580', name: 'Trần Thị Hiền', role: 'Vợ Khoa', gender: 'female', spouseId: '44' },
    { id: '581', name: 'Đặng Văn Lợi', role: 'Cháu Lợi', gender: 'male', parentId: '44' },
    { id: '582', name: 'Đặng Thị Hoa', role: 'Cháu Hoa', gender: 'female', parentId: '44' },
    { id: '583', name: 'Đặng Văn Tâm', role: 'Cháu Tâm', gender: 'male', parentId: '44' },

    // ═══ THẾ HỆ 6: Chút (con của Chắt) ═══
    // --- Con Bảo (300) ---
    { id: '600', name: 'Lý Thị Nương', role: 'Vợ Bảo', gender: 'female', spouseId: '300' },
    { id: '601', name: 'Nguyễn Văn Mạnh', role: 'Chút Mạnh', gender: 'male', parentId: '300' },
    { id: '602', name: 'Nguyễn Thị Kiều', role: 'Chút Kiều', gender: 'female', parentId: '300' },

    // --- Con Phúc (310) ---
    { id: '610', name: 'Đỗ Thị Quyên', role: 'Vợ Phúc', gender: 'female', spouseId: '310' },
    { id: '611', name: 'Nguyễn Văn Tuyển', role: 'Chút Tuyển', gender: 'male', parentId: '310' },
    { id: '612', name: 'Nguyễn Thị Yên', role: 'Chút Yên', gender: 'female', parentId: '310' },
    { id: '613', name: 'Nguyễn Văn Pháp', role: 'Chút Pháp', gender: 'male', parentId: '310' },

    // --- Con Thịnh (330) ---
    { id: '620', name: 'Lê Thị Thanh', role: 'Vợ Thịnh', gender: 'female', spouseId: '330' },
    { id: '621', name: 'Nguyễn Văn Quý', role: 'Chút Quý', gender: 'male', parentId: '330' },
    { id: '622', name: 'Nguyễn Thị Oanh', role: 'Chút Oanh', gender: 'female', parentId: '330' },

    // --- Con Hào (360) ---
    { id: '630', name: 'Trần Thị Khánh', role: 'Vợ Hào', gender: 'female', spouseId: '360' },
    { id: '631', name: 'Nguyễn Văn Hưng', role: 'Chút Hưng', gender: 'male', parentId: '360' },

    // --- Con Lợi (390) ---
    { id: '640', name: 'Mai Thị Phương', role: 'Vợ Lợi', gender: 'female', spouseId: '390' },
    { id: '641', name: 'Nguyễn Văn Phước', role: 'Chút Phước', gender: 'male', parentId: '390' },
    { id: '642', name: 'Nguyễn Thị Duyên', role: 'Chút Duyên', gender: 'female', parentId: '390' },

    // --- Con Tiến (380) ---
    { id: '650', name: 'Hà Thị Bình', role: 'Vợ Tiến', gender: 'female', spouseId: '380' },
    { id: '651', name: 'Đặng Văn Hoàng', role: 'Chút Hoàng', gender: 'male', parentId: '380' },
    { id: '652', name: 'Đặng Thị Cẩm', role: 'Chút Cẩm', gender: 'female', parentId: '380' },

    // --- Con Lực (400) ---
    { id: '660', name: 'Phạm Thị Tuyên', role: 'Vợ Lực', gender: 'female', spouseId: '400' },
    { id: '661', name: 'Hồ Văn Khải', role: 'Chút Khải', gender: 'male', parentId: '400' },

    // --- Con Vinh (370) ---
    { id: '670', name: 'Lê Thị Nga', role: 'Vợ Vinh', gender: 'female', spouseId: '370' },
    { id: '671', name: 'Nguyễn Văn Công', role: 'Chút Công', gender: 'male', parentId: '370' },
    { id: '672', name: 'Nguyễn Thị Nhung', role: 'Chút Nhung', gender: 'female', parentId: '370' },

    // --- Con Lâm (350) ---
    { id: '680', name: 'Bùi Thị Tâm', role: 'Vợ Lâm', gender: 'female', spouseId: '350' },
    { id: '681', name: 'Trịnh Văn Phát', role: 'Chút Phát', gender: 'male', parentId: '350' },
    { id: '682', name: 'Trịnh Thị Hải', role: 'Chút Hải', gender: 'female', parentId: '350' },

    // --- Con Phát (302) ---
    { id: '690', name: 'Kim Thị Liên', role: 'Vợ Phát', gender: 'female', spouseId: '302' },
    { id: '691', name: 'Nguyễn Văn Thành', role: 'Chút Thành', gender: 'male', parentId: '302' },
    { id: '692', name: 'Nguyễn Thị Hằng', role: 'Chút Hằng', gender: 'female', parentId: '302' },

    // --- Con Huy (320) ---
    { id: '700', name: 'Châu Thị Diễm', role: 'Vợ Huy', gender: 'female', spouseId: '320' },
    { id: '701', name: 'Vương Văn Quân', role: 'Chút Quân', gender: 'male', parentId: '320' },
    { id: '702', name: 'Vương Thị Mai', role: 'Chút Mai', gender: 'female', parentId: '320' },

    // --- Con Đông (340) ---
    { id: '710', name: 'Hồ Thị Vân', role: 'Vợ Đông', gender: 'female', spouseId: '340' },
    { id: '711', name: 'Nguyễn Văn Nam', role: 'Chút Nam', gender: 'male', parentId: '340' },

    // --- Con Bắc (531) ---
    { id: '720', name: 'Trần Thị Hoa', role: 'Vợ Bắc', gender: 'female', spouseId: '531' },
    { id: '721', name: 'Lý Văn Vĩnh', role: 'Chút Vĩnh', gender: 'male', parentId: '531' },

    // --- Con Trọng (511) ---
    { id: '730', name: 'Phạm Thị Hoa', role: 'Vợ Trọng', gender: 'female', spouseId: '511' },
    { id: '731', name: 'Nguyễn Văn Hoà', role: 'Chút Hoà', gender: 'male', parentId: '511' },
    { id: '732', name: 'Nguyễn Thị Thương', role: 'Chút Thương', gender: 'female', parentId: '511' },

    // Thêm bổ sung
    { id: '740', name: 'Nguyễn Văn Sang', role: 'Chắt Sang', gender: 'male', parentId: '161' },
    { id: '741', name: 'Đỗ Thị Ngân', role: 'Vợ Sang', gender: 'female', spouseId: '740' },
    { id: '742', name: 'Nguyễn Văn Viện', role: 'Chút Viện', gender: 'male', parentId: '740' },

    { id: '750', name: 'Đặng Văn Thìn', role: 'Chắt Thìn', gender: 'male', parentId: '170' },
    { id: '751', name: 'Lê Thị Châu', role: 'Vợ Thìn', gender: 'female', spouseId: '750' },
    { id: '752', name: 'Đặng Văn Hoàn', role: 'Chút Hoàn', gender: 'male', parentId: '750' },

    { id: '760', name: 'Nguyễn Thị Minh', role: 'Chắt Minh', gender: 'female', parentId: '190' },
    { id: '761', name: 'Nguyễn Văn Tâm', role: 'Chắt Tâm', gender: 'male', parentId: '200' },

    { id: '770', name: 'Bùi Văn Phước', role: 'Chắt Phước', gender: 'male', parentId: '120' },
    { id: '771', name: 'Nguyễn Thị Quỳnh', role: 'Vợ Phước', gender: 'female', spouseId: '770' },
    { id: '772', name: 'Bùi Văn Kha', role: 'Chút Kha', gender: 'male', parentId: '770' },

    { id: '780', name: 'Đặng Văn Tú', role: 'Cháu Tú', gender: 'male', parentId: '44' },
    { id: '781', name: 'Nguyễn Thị Ái', role: 'Vợ Tú', gender: 'female', spouseId: '780' },
    { id: '782', name: 'Đặng Văn Trường', role: 'Chắt Trường', gender: 'male', parentId: '780' },
    { id: '783', name: 'Đặng Thị Hạnh', role: 'Chắt Hạnh', gender: 'female', parentId: '780' },
  ]

  // Insert all members
  for (const member of members) {
    await prisma.member.create({ data: member as any })
  }

  // Update two-way spouse links
  const allMembers = await prisma.member.findMany()
  for (const m of allMembers) {
    if (m.spouseId) {
      const spouse = allMembers.find(s => s.id === m.spouseId)
      if (spouse && !spouse.spouseId) {
        await prisma.member.update({
          where: { id: spouse.id },
          data: { spouseId: m.id }
        })
      }
    }
  }

  console.log(`✅ Seeding finished: ${members.length} members created.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
