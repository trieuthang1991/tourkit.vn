# Tourkit.vn — Rebuild (Next.js, thay WordPress)

**Nguồn:** https://tourkit.vn/ (WordPress + Elementor — chậm, thay thế)
**Stack:** Next.js 16 + React 19 + Tailwind v4. Nội dung lưu file JSON, có trang admin.

## Kiến trúc nội dung (JSON "database")
- `content/site.json` — header, footer, menu, menu dịch vụ, liên hệ, dải CTA.
- `content/home.json` — toàn bộ nội dung trang chủ (hero, giải pháp, tính năng, dự án, đối tác, review, gallery, social, tin tức).
- Loader: `src/lib/content.ts` (đọc/ghi JSON, có TypeScript types).
- Các trang đọc JSON ở chế độ **dynamic** (`force-dynamic`) → sửa xong hiện ngay, không cần build lại.

## Trang Admin — `/admin`
- Đăng nhập bằng mật khẩu (biến môi trường `ADMIN_PASSWORD`, mặc định `tourkit@2025`, đổi trong file `.env.local`).
- Trình sửa **dạng form** tự sinh theo cấu trúc JSON: nhãn tiếng Việt, preview ảnh, thêm/xoá/di chuyển item trong danh sách.
- Có tab **"Sửa JSON thô"** để chỉnh trực tiếp (có kiểm tra cú pháp).
- Bấm **Lưu** → ghi thẳng vào file JSON + tự động refresh website.
- Bạn cũng có thể mở trực tiếp `content/*.json` bằng editor để sửa tay — kết quả giống nhau.
- API: `src/app/api/admin/{login,logout,content}`. Auth: `src/lib/admin-auth.ts`.

## Cấu trúc trang
- Root layout: `src/app/layout.tsx` (font, metadata).
- Nhóm marketing: `src/app/(site)/` — dùng chung header/footer (`(site)/layout.tsx`).
  Gồm: `/` (trang chủ), `/dich-vu`, `/ve-migroup`, `/ho-so-nang-luc`, `/du-an`, `/tin-tuc-su-kien`, `/lien-he`.
- `/admin` nằm ngoài `(site)` → không có header/footer marketing.
- Components: `src/components/` (site-header, site-footer, home/*, reveal, page-hero).

## Design tokens
- Font **Lexend Deca**. Tím `#8169F1`/`#5842BC`, cam `#FF6400`/`#FF5600`, xanh `#00129F`.
- Nền sáng `#F0EFF5`/`#FBFAFC`, section tối `#000`. Container 1200px.

## Đã hoàn thành gần đây
- Chuyển toàn bộ nội dung sang JSON + admin sửa nội dung (đã test lưu ghi file OK).
- Làm lại section "Giải Pháp toàn diện" đúng thiết kế gốc: card ngang, logo thương hiệu con
  (TOURKIT / GO / WEB / HRMO) + tiêu đề xanh + mô tả + 3 nút pill (tím/trắng/cam).

## Thành phần động (đã thêm)
- **Slider (Embla + plugins)** — `src/components/carousel.tsx`, nhiều biến thể cho đỡ nhàm:
  - **slide + scale (full-bleed)**: Giải pháp, Câu chuyện CĐS, Dự án Website — tràn viền, card giữa phóng to, 2 bên mờ + peek.
  - **marquee (chạy liên tục, full-bleed)**: Đối tác tiêu biểu, Gallery đội ngũ.
  - **fade (crossfade)**: Đánh giá khách hàng.
  - "Đối tác & Khách hàng" = 1 ảnh composite `Group-48-1024x843.png` (giống gốc, không phải carousel).
  - Full-bleed dùng `.tk-fullbleed` + `overflow-x: clip` để không tràn ngang, không phá sticky header.
  - Plugins: autoplay, auto-scroll, fade, class-names. Bố cục full/boxed theo đúng bản gốc.
- **Nút nổi (Buttonizer)** góc phải: Gọi/Zalo/Facebook/Tiktok + nút lên đầu trang.
  `src/components/floating-buttons.tsx`, cấu hình trong `site.json > floating`.
- **Popup + Form đăng ký/tư vấn**: mở khi bấm nút có `data-contact-popup` (Đăng ký dùng thử / Đặt lịch hẹn / Liên hệ ngay),
  và cũng dùng trên trang `/lien-he`. Form theo schema `site.json > consult.fields` (8 trường: Tên công ty, Họ & Tên,
  Chức vụ, Email, SĐT, Quy mô nhân sự, Khu vực, Nhu cầu — có 4 dropdown, sửa nhãn/tùy chọn trong admin).
  Components: `contact-popup.tsx` + `consult-form.tsx`.
- **Lưu lead**: form gửi về `POST /api/lead` → ghi vào `content/leads.json` (không commit git).
  Xem lead trong admin: mục **"📥 Lead đăng ký"** (bảng). API: `api/lead`, `api/admin/leads`.
- **Chat Pancake**: nhúng script `chat-plugin.pancake.vn`. `site.json > chat` (bật/tắt + đổi page_id).

## Còn lại (tùy chọn mở rộng)
1. Trang chi tiết Dự án `/du-an/[slug]` (30 mục) — thêm `content/projects.json` + template động.
2. Bài viết `/tin-tuc-su-kien/[slug]` + archive — thêm `content/posts.json`.
3. Upload ảnh trong admin (hiện nhập đường dẫn `/images/...`).
4. Nội dung riêng cho `/ve-migroup`, `/ho-so-nang-luc` (hiện tái sử dụng section trang chủ).

## Chạy
```
npm run dev      # http://localhost:3000  (admin: /admin)
npm run build && npm run start   # production
```
