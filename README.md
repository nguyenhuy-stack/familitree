# 🌳 Family Tree - Ứng Dụng Cây Phả Hệ Hiện Đại

Ứng dụng quản lý và hiển thị cây phả hệ gia đình được xây dựng với các công nghệ web tiên tiến nhất, mang lại trải nghiệm mượt mà, trực quan và chuyên nghiệp.

![Family Tree Preview](https://raw.githubusercontent.com/TienThinh/family-tree/main/public/preview.png) *(Lưu ý: Cập nhật link ảnh thực tế nếu có)*

## ✨ Tính năng nổi bật

- **Cây Phả Hệ Tương Tác**: Hiển thị cấu trúc gia đình phân cấp, hỗ trợ đệ quy đa thế hệ.
- **Phóng to/Thu nhỏ (Zoom & Pan)**: Dễ dàng điều hướng trong những cây phả hệ lớn với tính năng kéo thả và zoom mượt mà.
- **Tìm Kiếm Thông Minh**: Tìm kiếm thành viên nhanh chóng theo tên hoặc vai trò.
- **Quản Lý Thành Viên**: Thêm, sửa thông tin thành viên (tên, ngày sinh, vai trò, avatar, mối quan hệ vợ/chồng).
- **Giao Diện Premium**: Thiết kế hiện đại với Tailwind CSS 4, hỗ trợ hiệu ứng chuyển cảnh Fluid Animations từ Framer Motion.
- **Hiệu Năng Cao**: Xây dựng trên TanStack Start (React 19) giúp tối ưu hóa tốc độ tải và SEO.

## 🛠️ Công nghệ sử dụng

- **Frontend**: [React 19](https://react.dev/), [TanStack Start](https://tanstack.com/start) (Full-stack framework).
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (Animations).
- **Database**: [Prisma](https://www.prisma.io/) với [SQLite](https://sqlite.org/).
- **Quản lý trạng thái & Routing**: [TanStack Router](https://tanstack.com/router) & [TanStack Query](https://tanstack.com/query).
- **Icons**: [Lucide React](https://lucide.dev/).
- **Tiện ích**: `react-zoom-pan-pinch`, `react-hot-toast`.

## 🚀 Hướng dẫn cài đặt

### 1. Clone project
```bash
git clone <your-repo-url>
cd family-tree
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Thiết lập Database
Ứng dụng sử dụng SQLite để lưu trữ dữ liệu cục bộ. Chạy các lệnh sau để khởi tạo database:
```bash
# Khởi tạo schema prisma
npx prisma generate
npx prisma db push

# (Tùy chọn) Chạy seed dữ liệu nếu có
# npx prisma db seed
```

### 4. Chạy môi trường Development
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

## 📁 Cấu trúc thư mục

- `src/components/`: Chứa các component dùng chung (Header, GlobalSearch, Tree nodes...).
- `src/routes/`: Quản lý các trang và API endpoints sử dụng TanStack File-based Routing.
- `prisma/`: Định nghĩa schema database và các file migration.
- `public/`: Chứa các tài sản tĩnh như ảnh, favicon.

## 📝 Scripts chính

- `npm run dev`: Chạy server phát triển.
- `npm run build`: Xây dựng ứng dụng cho môi trường production.
- `npm run test`: Chạy bộ kiểm thử Vitest.
- `npx prisma studio`: Mở giao diện quản lý dữ liệu Prisma trực quan.

## 🤝 Đóng góp

Mọi đóng góp nhằm cải thiện ứng dụng đều được trân trọng. Vui lòng tạo Issue hoặc Pull Request nếu bạn có ý tưởng mới.

---
Được xây dựng với ❤️ bởi **nguyenhuy**.
