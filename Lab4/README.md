# Lab 4 - Quản lý giỏ hàng PHP + MySQL

## Cài đặt

1. Import duy nhất file `app/database.sql` vào MySQL. File này đã tạo database,
   bảng `products` và đủ 15 sản phẩm mẫu.
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

Ứng dụng gồm đầy đủ chức năng xem danh sách, thêm, sửa, xóa có xác nhận và kiểm tra dữ liệu đầu vào.

File `app/additional_products.sql` chỉ dùng khi nâng cấp database cũ đang có 5 sản phẩm;
không cần import file này sau khi đã import `app/database.sql`.
