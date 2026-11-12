# Thực hành PHP và Vue.js — Lab 8

## Cấu trúc

```text
Lab8/
├── database.sql              # Câu 1: tạo bảng và 3 sản phẩm mẫu
├── api/
│   ├── config.php            # Kết nối PDO từ biến môi trường
│   └── products.php          # Câu 2: API GET, POST, PUT, DELETE
├── index.html               # Câu 3: giao diện Vue, v-for và v-model
├── assets/
│   ├── app.js
│   ├── style.css
│   ├── vue.global.prod.js    # Vue 3.5.13, lưu cục bộ để chạy không cần CDN
│   └── VUE-LICENSE.txt      # Giấy phép thư viện Vue
├── router.php               # Chặn truy cập HTTP vào file nội bộ
└── start.sh                 # Tự chạy MySQL riêng và PHP, không hỏi mật khẩu
```

## Chạy trên máy

Tại thư mục `Lab8`, chỉ cần chạy:

```bash
bash start.sh
```

Không cần nhập mật khẩu hoặc nhập SQL thủ công. Script dùng **MySQL Community Server 8.1.0** có sẵn tại `/usr/local/mysql`, tạo dữ liệu riêng trong `.runtime/mysql-data`, khởi động qua socket `.runtime/mysql.sock` và nhập `database.sql` khi chưa có bảng `products`. Lần đầu có ba sản phẩm mẫu. Những lần sau giữ nguyên dữ liệu, kể cả các sản phẩm đã xóa. Database MySQL hệ thống tại `/usr/local/mysql/data` được giữ nguyên.

Mở **http://127.0.0.1:8000**. Nhấn **Ctrl+C** để dừng PHP và tiến trình MySQL do script khởi động; dữ liệu vẫn được giữ trong `.runtime`. Không xóa `.runtime/mysql-data` nếu muốn giữ sản phẩm đã nhập. Không mở `index.html` trực tiếp bằng `file://` hoặc Live Server vì API cần PHP.

MySQL riêng không mở cổng TCP, plugin MySQL X cũng được tắt; socket và dữ liệu nằm trong thư mục `.runtime` quyền 700. API dùng tài khoản `lab8_app` không mật khẩu, chỉ có quyền đọc/thêm/sửa/xóa trong `lab8`. Router chặn truy cập HTTP vào các file ẩn, gồm `.runtime`. Không thay đổi mật khẩu tài khoản `root` của MySQL hệ thống.

Máy hiện tại đã có PHP, MySQL và driver PDO cục bộ. Trên máy khác cần PHP 8.1 trở lên có PDO MySQL tương thích và MySQL 8.1 (phiên bản đã kiểm thử cho chế độ cục bộ). Script mặc định tìm `/usr/local/mysql/bin/mysqld` và `/usr/local/mysql/bin/mysql`; có thể đổi đường dẫn bằng biến môi trường `MYSQL_SERVER` và `MYSQL_CLIENT`. Không cần Node.js/npm. Driver `.runtime/pdo_mysql.so` chỉ dành cho Mac hiện tại và không cần nộp kèm bài; trên máy khác script dùng driver PHP hệ thống nếu không nạp được driver cục bộ.

### Dùng MySQL hệ thống hoặc MySQL bên ngoài khi cần

Để dùng lại MySQL hiện có thay cho database riêng, nhập SQL và chạy chế độ ngoài:

```bash
mysql -u root -p < database.sql
DB_MODE=external bash start.sh
```

Chế độ này hỏi mật khẩu MySQL, mặc định dùng `127.0.0.1:3306`, database `lab8`, tài khoản `root`. Có thể đổi `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_SOCKET` qua biến môi trường. Các lệnh trong hướng dẫn được chạy tại `Lab8`.

Script in phiên bản và tên máy chủ trước khi chạy PHP, đồng thời từ chối kết nối MariaDB để giữ đúng yêu cầu MySQL của đề.

### Dữ liệu đã chuyển sang MySQL

Đã chuyển đủ 4 sản phẩm đang có từ database cục bộ trước đây sang MySQL, giữ nguyên ID, tên, giá và tồn kho. Bản sao trước chuyển đổi nằm trong `.runtime/products-before-mysql.json`; thư mục dữ liệu MariaDB cũ được giữ làm bản dự phòng và không còn được `start.sh` sử dụng.

## API

| Phương thức | Đường dẫn | Chức năng |
| --- | --- | --- |
| GET | `api/products.php` | Danh sách trong `data` |
| POST | `api/products.php` | Thêm sản phẩm |
| PUT | `api/products.php?id=1` | Sửa theo mã trên URL |
| DELETE | `api/products.php?id=1` | Xóa theo mã trên URL |

POST/PUT nhận JSON, ví dụ `{"name":"Bút chì","price":6000,"stock":10}`. Mọi phản hồi có `success`; lỗi có `message`. HTTP 201 khi thêm thành công, 400 khi JSON hoặc mã sai, 422 khi dữ liệu sai, 404 khi sửa/xóa sản phẩm không tồn tại, 405 khi phương thức không hỗ trợ, 503 khi chưa kết nối được cơ sở dữ liệu.

PHP kiểm tra tên Unicode sau khi bỏ khoảng trắng ở hai đầu, dài 1–100 ký tự; `price` và `stock` phải là số nguyên JSON thực sự, lần lượt lớn hơn 0 và không âm, nằm trong giới hạn INT của MySQL. Tất cả kiểm tra diễn ra trước khi ghi. Truy vấn có tham số dùng PDO prepared statements. Sửa bằng chính dữ liệu cũ vẫn được coi là thành công.

## Câu 4: kiểm tra trước khi nộp

Giữ máy chủ PHP đang chạy, mở một Terminal khác để chạy các lệnh curl. Các lệnh dưới không cần mật khẩu vì gọi API cục bộ.

1. **Thêm và lưu bền:** thêm trên giao diện tên “Bút chì”, giá 6000, tồn 10. Tải lại trang; sản phẩm vẫn phải xuất hiện. Có thể thêm bằng API:

   ```bash
   curl -i http://127.0.0.1:8000/api/products.php -H 'Content-Type: application/json' -d '{"name":"Bút chì","price":6000,"stock":10}'
   ```

2. **Sửa giá:** bấm Sửa ở sản phẩm vừa thêm, đổi giá thành 7000 rồi Lưu. Bảng phải cập nhật giá mà không tải lại trang. Tải lại trang để xác nhận dữ liệu đã lưu.

3. **Chặn tồn âm ở PHP:** lấy số dòng trước, gửi trực tiếp tồn −1, rồi kiểm tra lại:

   ```bash
   env -u MYSQL_PWD /usr/local/mysql/bin/mysql --no-defaults --protocol=SOCKET --socket="$PWD/.runtime/mysql.sock" -u root -e 'SELECT COUNT(*) FROM lab8.products;'
   curl -i http://127.0.0.1:8000/api/products.php -H 'Content-Type: application/json' -d '{"name":"Không hợp lệ","price":5000,"stock":-1}'
   env -u MYSQL_PWD /usr/local/mysql/bin/mysql --no-defaults --protocol=SOCKET --socket="$PWD/.runtime/mysql.sock" -u root -e 'SELECT COUNT(*) FROM lab8.products;'
   ```

   Mong đợi HTTP 422, `success: false`, thông báo về số lượng tồn và số dòng không thay đổi.

4. **Xóa và lưu bền:** bấm Xóa ở sản phẩm vừa thêm. Chọn Hủy để xác nhận dòng vẫn còn; bấm Xóa lần nữa và đồng ý, dòng phải biến mất. Tải lại trang; sản phẩm không còn trong danh sách.

5. **Mã không tồn tại:** PUT và DELETE với mã `2147483647` (nếu mã đó chưa tồn tại) phải trả HTTP 404, `success: false`. Tên chỉ chứa khoảng trắng, tên quá 100 ký tự, giá 0, số thập phân, chuỗi số, thiếu trường và JSON sai đều phải bị từ chối.

File SQL có thể nhập lại mà không xóa dữ liệu hay thêm trùng sản phẩm mẫu theo tên. Bảng đã có sẽ được giữ nguyên cấu trúc; kiểm tra `SHOW CREATE TABLE lab8.products` nếu bảng được tạo từ bài khác.

Sau khi thử xóa, danh sách có thể ít hơn ba sản phẩm; đó là dữ liệu đã được lưu. `start.sh` không tự thêm lại các sản phẩm đã xóa. Khi muốn bổ sung các sản phẩm mẫu chưa có theo tên, giữ ứng dụng đang chạy và nhập lại SQL:

```bash
env -u MYSQL_PWD /usr/local/mysql/bin/mysql --no-defaults --protocol=SOCKET --socket="$PWD/.runtime/mysql.sock" -u root < database.sql
```

Sau đó bấm **Làm mới**. Lệnh giữ nguyên các sản phẩm đã có.

### Bộ kiểm thử API tự động

Khi máy chủ đang chạy, mở Terminal khác tại `Lab8`:

```bash
python3 tests/test_api.py
```

Script thực hiện 81 lượt kiểm tra HTTP, tạo các sản phẩm thử rồi xóa chính những sản phẩm đó. Có thể đổi API bằng biến môi trường `API_URL`. Kết quả lần kiểm thử khi hoàn thiện bài được ghi trong [KIEM_THU.md](KIEM_THU.md). Các bước xác nhận hộp thoại và tải lại trang trên trình duyệt vẫn cần làm theo danh sách bên trên.

Kiểm tra thêm logic Vue với API thật bằng Node.js, không cần cài thư viện npm:

```bash
node tests/test_frontend.mjs
```

Bộ này kiểm tra 10 nhóm hành vi: tải khi mở trang, POST/PUT đúng chế độ, điền form khi sửa, hủy/đồng ý xóa, tải lại danh sách, giữ dữ liệu qua instance mới và hiển thị lỗi. Phần đăng ký Vue được mô phỏng để gọi đúng các hàm trong `assets/app.js`; bộ này chưa kiểm tra DOM, bố cục hoặc hộp thoại thật trên trình duyệt. Node.js chỉ cần để chạy bộ kiểm thử này, không bắt buộc để chạy ứng dụng.

## Tài liệu tham khảo

- [Vue: dùng không cần bước build](https://vuejs.org/guide/quick-start.html#using-vue-from-cdn)
- [PHP: PDO prepared statements](https://www.php.net/manual/en/pdo.prepared-statements.php)
- [MacPorts: php83-mysql](https://ports.macports.org/port/php83-mysql/)
- [MacPorts: các biến thể mysqlnd và mysql8 của php83-mysql](https://ports.macports.org/port/php83-mysql/details/)
- [MySQL: khởi tạo thư mục dữ liệu](https://dev.mysql.com/doc/refman/8.0/en/data-directory-initialization.html)
