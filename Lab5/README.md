# Lab 5 - Cải thiện bài thực hành 4

Ứng dụng quản lý sản phẩm được viết bằng PHP thuần và MySQL. Dự án mở rộng bài
thực hành 4 với yêu cầu mục V: đăng ký, đăng nhập và đăng xuất.

## Chức năng

- Đăng ký tài khoản và kiểm tra tên đăng nhập trùng.
- Đăng nhập, đăng xuất và quản lý phiên làm việc bằng PHP Session.
- Xem danh sách, thêm, sửa và xóa sản phẩm có xác nhận.
- Kiểm tra dữ liệu đầu vào ở phía máy chủ.
- Bảo vệ các biểu mẫu bằng CSRF token.
- Lưu mật khẩu bằng `password_hash()`, không lưu mật khẩu dạng văn bản thuần.
- Sử dụng prepared statement để hạn chế SQL injection.
- Escape dữ liệu khi hiển thị để hạn chế XSS.

## Yêu cầu

- XAMPP có PHP 8.0 trở lên và extension `mysqli`.
- MySQL hoặc MariaDB đang hoạt động.
- Trình duyệt web hiện đại.

## Cấu trúc chính

```text
Lab5/
├── app/
│   ├── assets/          # CSS
│   ├── common/          # Kết nối DB, xác thực, CSRF và validation
│   ├── model/           # Truy vấn sản phẩm và người dùng
│   ├── view/            # Header và footer dùng chung
│   ├── database.sql     # Cấu trúc database và dữ liệu mẫu
│   ├── login.php
│   ├── register.php
│   ├── logout.php
│   └── product_*.php    # Các chức năng CRUD sản phẩm
├── README.md
└── run.sh
```

## Cài đặt database

1. Bật MySQL trong **XAMPP Manager**.
2. Mở phpMyAdmin.
3. Import file `app/database.sql`.

File SQL sẽ tạo:

- Database `shopping_cart`.
- Bảng `products` và 15 sản phẩm mẫu.
- Bảng `users` dùng cho tài khoản đăng nhập.

Có thể import lại `database.sql` mà không làm trùng dữ liệu mẫu. Khi nâng cấp
trực tiếp từ database của bài 4, ứng dụng cũng tự tạo bảng `users` nếu bảng này
chưa tồn tại.

## Cấu hình kết nối

Mặc định ứng dụng sử dụng:

```text
Host: localhost
Port: 3306
Database: shopping_cart
Username: root
Password: để trống
```

Nếu máy sử dụng cấu hình khác, đặt các biến môi trường `DB_HOST`, `DB_PORT`,
`DB_NAME`, `DB_USER` và `DB_PASS` trước khi chạy.

Ví dụ:

```bash
export DB_USER=root
export DB_PASS='mat_khau_mysql'
./run.sh
```

## Chạy ứng dụng

Trong thư mục `Lab5`, chạy:

```bash
./run.sh
```

Sau đó mở:

```text
http://localhost:8000
```

Nếu cổng `8000` đang được ứng dụng khác sử dụng, chạy trực tiếp bằng cổng khác:

```bash
/Applications/XAMPP/xamppfiles/bin/php -S localhost:8001 -t app
```

Sau đó mở `http://localhost:8001`.

## Sử dụng

1. Truy cập trang đăng ký và tạo một tài khoản mới.
2. Đăng nhập bằng tên đăng nhập và mật khẩu vừa tạo.
3. Sử dụng các chức năng thêm, sửa hoặc xóa sản phẩm.
4. Chọn **Đăng xuất** khi hoàn thành.

Tên đăng nhập dài từ 3 đến 50 ký tự và chỉ gồm chữ, số, dấu chấm (`.`), gạch
ngang (`-`) hoặc gạch dưới (`_`). Không nhập địa chỉ email vào trường này.
Mật khẩu phải có ít nhất 8 ký tự.

## Xử lý lỗi thường gặp

### PHP chưa bật `mysqli`

Không chạy dự án bằng lệnh `php` mặc định nếu phiên bản đó thiếu `mysqli`. Hãy
dùng `./run.sh` hoặc PHP của XAMPP như hướng dẫn ở trên.

### Không kết nối được database

- Kiểm tra MySQL đã được bật trong XAMPP.
- Kiểm tra database `shopping_cart` đã được tạo.
- Kiểm tra lại `DB_HOST`, `DB_PORT`, `DB_USER` và `DB_PASS`.

### Cổng đã được sử dụng

Dừng ứng dụng đang chiếm cổng `8000` hoặc chạy dự án trên cổng `8001`.

## Ghi chú

File `app/additional_products.sql` chỉ dùng để bổ sung sản phẩm cho database cũ
đang có 5 sản phẩm. Không cần import file này sau khi đã import `app/database.sql`.
