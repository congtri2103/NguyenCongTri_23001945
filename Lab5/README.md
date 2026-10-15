# Bài thực hành 4 - Quản lý sản phẩm PHP + MySQL

## Cài đặt

1. Import file `app/database.sql` vào MySQL. File này tạo database, bảng
   `products`, bảng `users` và 15 sản phẩm mẫu. Có thể import lại an toàn mà
   không làm trùng dữ liệu sản phẩm mẫu.
   Khi nâng cấp trực tiếp từ bản Bài 4 cũ, ứng dụng cũng sẽ tự tạo bảng `users`
   ở lần đầu sử dụng chức năng tài khoản.
2. Mặc định ứng dụng kết nối với `localhost:3306`, database `shopping_cart`, user `root`, mật khẩu rỗng.
3. Nếu cấu hình khác, đặt các biến môi trường: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`.
4. Trên máy hiện tại, chạy ứng dụng bằng PHP của XAMPP (đã có `mysqli`):

```bash
./run.sh
```

5. Mở `http://localhost:8000` trên trình duyệt.

Lưu ý: lệnh `php` mặc định trên máy đang trỏ đến `/opt/local/bin/php` và bản PHP này
không có extension `mysqli`. Không dùng trực tiếp `php -S ...` cho project này. Trước khi
chạy, hãy bật MySQL trong **XAMPP Manager** và import `app/database.sql` bằng phpMyAdmin.

Ứng dụng gồm chức năng đăng ký, đăng nhập, đăng xuất và quản lý phiên làm việc.
Sau khi đăng nhập, người dùng có thể xem danh sách, thêm, sửa và xóa sản phẩm.
Các biểu mẫu có kiểm tra dữ liệu đầu vào và CSRF token; mật khẩu được lưu bằng
`password_hash`, không lưu ở dạng văn bản thuần.

File `app/additional_products.sql` chỉ dùng khi nâng cấp database cũ đang có 5 sản phẩm;
không cần import file này sau khi đã import `app/database.sql`.
