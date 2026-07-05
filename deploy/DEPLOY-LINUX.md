# Hướng dẫn public Tourkit lên Linux (Ubuntu)

Đơn giản và ổn định hơn IIS: Node chạy native (không cần `NODE_SKIP_PLATFORM_CHECK`),
SSL miễn phí tự động, nginx làm cổng vào. Khuyên dùng nếu chuyển được khỏi Windows 2012 R2.

- **OS:** Ubuntu 22.04/24.04 (hoặc Debian)
- **Kiến trúc:** nginx (80/443) → reverse proxy → `node server.js` (127.0.0.1:3000)
- **Thư mục site:** `/var/www/tourkit`

---

## A. Cài 1 lần trên server

```bash
# 1. Node.js 24 (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx

# 2. Thư mục + quyền
sudo mkdir -p /var/www/tourkit
sudo chown -R $USER:$USER /var/www/tourkit
```

---

## B. Lấy code + build (lần đầu)

```bash
cd /var/www/tourkit
git clone https://github.com/trieuthang1991/tourkit.vn.git .

# Biến môi trường build-time (SEO) + runtime
cat > .env.local <<'EOF'
NEXT_PUBLIC_SITE_URL=https://landing.tourkit.vn
ADMIN_PASSWORD=DOI_MAT_KHAU_NAY
EOF

npm ci
npm run bundle        # tạo ./dist tự chứa server.js + assets + content
```

> Build **trên server Linux** để node_modules đúng nền tảng (đừng copy `dist` từ Windows sang).

---

## C. Chạy như service (systemd)

```bash
# Copy content lần đầu ra ngoài dist để không bị ghi đè khi cập nhật (tuỳ chọn — xem mục E)
sudo cp deploy/tourkit.service /etc/systemd/system/tourkit.service
sudo nano /etc/systemd/system/tourkit.service   # sửa WorkingDirectory, ADMIN_PASSWORD nếu cần

sudo systemctl daemon-reload
sudo systemctl enable --now tourkit
sudo systemctl status tourkit                    # phải thấy "active (running)"
curl -I http://127.0.0.1:3000                     # phải trả 200
```

---

## D. Nginx + HTTPS

```bash
sudo cp deploy/nginx-tourkit.conf /etc/nginx/sites-available/tourkit
sudo ln -s /etc/nginx/sites-available/tourkit /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# HTTPS miễn phí (Let's Encrypt) — tự động thêm cấu hình 443:
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d landing.tourkit.vn
```

Xong → mở `https://landing.tourkit.vn`. Certbot tự gia hạn chứng chỉ.

> Đảm bảo DNS `landing.tourkit.vn` trỏ về IP server Linux trước khi chạy certbot.

---

## E. Cập nhật bản mới (mỗi lần sau)

```bash
cd /var/www/tourkit
git pull
npm ci
npm run bundle
sudo systemctl restart tourkit
```

**Giữ dữ liệu:** thư mục `content/` chứa nội dung + lead. `git pull` không đụng file
lead (đã gitignore), nhưng nếu bạn sửa nội dung qua `/admin` trên server thì các file
`content/*.json` sẽ khác repo → `git pull` có thể conflict. Cách an toàn: để `content/`
ở ngoài repo và trỏ vào, hoặc backup trước khi pull:

```bash
cp -r /var/www/tourkit/dist/content /var/www/tourkit/content-backup-$(date +%F)
```

---

## F. Lệnh kiểm tra nhanh

```bash
sudo systemctl status tourkit      # service còn chạy không
sudo journalctl -u tourkit -n 50   # log app (lỗi crash nằm ở đây)
curl -I http://127.0.0.1:3000      # node có trả lời không
sudo nginx -t                      # cú pháp nginx
```

---

## Ghi nhớ
1. Build **trên server Linux**, không copy `dist` từ Windows.
2. `NEXT_PUBLIC_SITE_URL` phải đúng domain và set **trước khi** `npm run bundle`.
3. Đặt `ADMIN_PASSWORD` thật (trong `.env.local` khi build, hoặc trong file service).
4. Backup `content/` định kỳ — đó là toàn bộ nội dung + lead của bạn.
