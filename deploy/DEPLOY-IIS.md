# Hướng dẫn public Tourkit lên IIS

Quy trình đã chạy thật trên server hiện tại. Làm đúng thứ tự là lên.

- **Server:** Windows Server 2012 R2 (IIS 8.5), tên `migroup-03`
- **Thư mục site:** `C:\inetpub\wwwroot\tourkit.vn`
- **Domain:** `landing.tourkit.vn`
- **Cách chạy:** IIS dùng **HttpPlatformHandler** tự khởi động `node server.js`
  (KHÔNG dùng iisnode — nó không chạy được với Next.js standalone).

---

## A. Cài 1 lần trên server (chỉ làm lần đầu)

1. **Node.js** — tải bản x64 từ nodejs.org, cài vào `C:\Program Files\nodejs\`.
   > Server 2012 R2 không được Node đời mới hỗ trợ chính thức, nhưng vẫn chạy được
   > nhờ biến `NODE_SKIP_PLATFORM_CHECK=1` (đã có sẵn trong `web.config`).
2. **HttpPlatformHandler** — https://www.iis.net/downloads/microsoft/httpplatformhandler
   → cài → xong.
3. (Có sẵn rồi) URL Rewrite — không bắt buộc cho cách này.
4. `iisreset`

---

## B. Mỗi lần public bản mới

### Ở máy DEV (máy này)
1. Nếu đổi domain SEO: sửa `.env.local` →
   `NEXT_PUBLIC_SITE_URL=https://landing.tourkit.vn` (biến này nhúng lúc build).
2. Chạy: **`npm run bundle`** (hoặc bấm đúp `publish.cmd`).
   → Ra thư mục **`dist\`** đầy đủ (server.js, node_modules, .next, public, content,
   web.config, logs\).

### Copy lên server
3. Copy nội dung `dist\` vào `C:\inetpub\wwwroot\tourkit.vn\`.
   - **Lần đầu:** copy tất cả.
   - **Lần sau (cập nhật):** copy đè MỌI THỨ **TRỪ thư mục `content\`** — giữ nguyên
     `content\` cũ trên server để không mất nội dung đã sửa + lead khách gửi.

### Cấu hình trên server (chỉ cần làm kỹ lần đầu)
4. Mở `C:\inetpub\wwwroot\tourkit.vn\web.config`, sửa:
   - `processPath` = đúng đường dẫn `node.exe` (mặc định `C:\Program Files\nodejs\node.exe`)
   - `ADMIN_PASSWORD value="..."` = mật khẩu admin thật
5. Tạo thư mục `logs` (nếu chưa có) và cấp quyền ghi cho IIS. CMD quyền Admin:
   ```cmd
   mkdir "C:\inetpub\wwwroot\tourkit.vn\logs"
   icacls "C:\inetpub\wwwroot\tourkit.vn\logs"    /grant "IIS_IUSRS:(OI)(CI)M"
   icacls "C:\inetpub\wwwroot\tourkit.vn\content" /grant "IIS_IUSRS:(OI)(CI)M"
   ```

### Khởi động lại + kiểm tra
6. `iisreset`
7. Mở `http://landing.tourkit.vn` → phải ra web.

> Cập nhật lần sau chỉ cần: bước 2 (build) → 3 (copy đè, chừa `content\`) → `iisreset`.

---

## C. Kiểm tra nhanh khi nghi lỗi

Chạy tay để xem node báo gì (thấy lỗi thật ngay lập tức):
```cmd
cd /d "C:\inetpub\wwwroot\tourkit.vn"
set NODE_SKIP_PLATFORM_CHECK=1
set PORT=3000
"C:\Program Files\nodejs\node.exe" server.js
```
- Ra `✓ Ready in ...` = app OK, lỗi nằm ở IIS/web.config/quyền.
- Ra `Error:` = app lỗi, đọc stack trace để biết.

> Nhớ tắt cửa sổ này (Ctrl+C) trước khi test qua IIS, kẻo chiếm cổng 3000.

---

## D. Bảng lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| `500.19` (0x8007000d) | web.config tham chiếu module chưa cài | Cài **HttpPlatformHandler** → `iisreset` |
| Event 1000, Error `-2147023829` (process aborted) | Node crash — thường do thiếu `NODE_SKIP_PLATFORM_CHECK` trên Server 2012 R2 | Đảm bảo dòng `NODE_SKIP_PLATFORM_CHECK=1` có trong web.config |
| `Could not create stdoutLogFile ... -2147024893` | Thiếu thư mục `logs` | `mkdir logs` + cấp quyền IIS_IUSRS (bước B5) |
| `entry point ... KERNEL32.dll` khi chạy tay | Node quá mới, OS quá cũ tải không nổi | Cài Node bản thấp hơn, hoặc nâng OS lên 2016+ |
| Web lên nhưng admin sai mật khẩu | `ADMIN_PASSWORD` chưa set / sai | Sửa trong web.config → `iisreset` |
| `502.3` / trắng trang | Node chưa chạy | Xem log trong `logs\`, hoặc chạy tay (mục C) |

---

## E. Biến môi trường

| Biến | Đặt ở đâu | Ghi chú |
|------|-----------|---------|
| `ADMIN_PASSWORD` | `web.config` trên server | **Bắt buộc đổi** — mặc định public trên GitHub |
| `NODE_SKIP_PLATFORM_CHECK` | `web.config` (đã có) | Chỉ cần cho Server 2012 R2. Server 2016+ thì bỏ. |
| `NEXT_PUBLIC_SITE_URL` | `.env.local` ở máy dev, **trước khi** build | Nhúng lúc build, KHÔNG set ở server |
| `PORT` / `HOSTNAME` | `web.config` (đã có) | IIS tự cấp cổng qua `%HTTP_PLATFORM_PORT%` |

---

## F. Còn lại: HTTPS (https://)

Hiện mới chạy `http://`. Để vào bằng `https://landing.tourkit.vn` cần gắn chứng chỉ
SSL vào site trong IIS (Bindings → https → chọn cert). Lỗi `ERR_QUIC_PROTOCOL_ERROR`
lúc trước là do binding 443 chưa đúng. Làm sau khi http đã chạy ổn.

---

## Ghi nhớ 3 điều hay quên
1. Cập nhật thì **chừa thư mục `content\`** trên server (nội dung + lead nằm đó).
2. Đổi domain SEO thì sửa `.env.local` **rồi build lại** (không sửa trên server được).
3. Luôn đặt `ADMIN_PASSWORD` thật trong `web.config`.
