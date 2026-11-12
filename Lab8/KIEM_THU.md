# Kết quả kiểm tra toàn bộ dự án — 12/11/2026

Đã đối chiếu mã nguồn với Câu 1–4, chạy trên **MySQL Community Server 8.1.0** và PHP 8.3.33. Không phát hiện lỗi chức năng làm sai yêu cầu trong các phần đã kiểm chứng. Có giới hạn kiểm tra trình duyệt và lưu ý dữ liệu hiện tại ở cuối báo cáo.

## Câu 1 — SQL và bảng products

- `database.sql` tạo đúng các cột: `id INT PRIMARY KEY AUTO_INCREMENT`, `name VARCHAR(100) NOT NULL`, `price INT NOT NULL`, `stock INT NOT NULL`.
- Có CHECK giá > 0 và tồn >= 0.
- Đã nhập SQL vào schema MySQL tạm hoàn toàn mới và đối chiếu đúng ba dòng: Bút bi / 5000 / 20; Vở ô ly / 12000 / 15; Thước kẻ / 8000 / 0.
- Nhập lại lần hai vẫn có đúng ba dòng, không trùng dữ liệu mẫu.
- Đã đọc INFORMATION_SCHEMA để xác nhận kiểu dữ liệu, độ dài, NOT NULL, khóa chính và tự tăng.
- Đã gửi INSERT SQL trực tiếp: MySQL từ chối giá 0, tồn −1 với lỗi 3819 và tên NULL với lỗi 1048; số dòng vẫn là 3.
- Sản phẩm hợp lệ mới được cấp ID tự tăng. Schema thử đã được xóa; không sửa bảng ứng dụng để kiểm tra SQL.

## Câu 2 — API PHP

Bộ `tests/test_api.py` đạt **81 lượt kiểm tra HTTP trên MySQL**:

| Nhóm | Kết quả |
| --- | --- |
| GET danh sách | HTTP 200, JSON có success và data dạng mảng |
| POST hợp lệ | HTTP 201, dữ liệu được ghi và đọc lại được |
| PUT theo ID | Lưu đúng giá và tồn; dữ liệu không đổi vẫn thành công |
| DELETE theo ID | Xóa được; xóa lại trả HTTP 404 |
| Sửa/xóa mã không tồn tại | JSON báo lỗi HTTP 404 |
| Tên sau trim dài 1–100 ký tự Unicode | Chấp nhận biên 100; chặn rỗng, khoảng trắng và 101 ký tự |
| Giá và tồn | Chặn 0/âm sai quy định, thập phân, chuỗi số, boolean, thiếu trường, vượt INT |
| Tồn −1 trực tiếp qua POST/PUT | HTTP 422, có message, không thêm dòng hoặc đổi dữ liệu cũ |
| JSON và mã trên URL sai | HTTP 400, JSON báo lỗi |
| Phương thức ngoài yêu cầu | HTTP 405 |
| Tên chứa dấu nháy/nội dung SQL | Lưu như văn bản; bảng vẫn hoạt động |
| Dọn dữ liệu thử | Danh sách trở về đúng dữ liệu trước kiểm tra |

Đã rà soát các câu lệnh có tham số: đều dùng PDO prepared statements. Kiểm tra đầu vào diễn ra trước khi kết nối và ghi MySQL. Phản hồi thành công/thất bại có `success`; lỗi có `message`. Các cột số trong danh sách được chuẩn hóa về kiểu số JSON.

## Câu 3 — Vue.js

Đã kiểm tra `index.html` có v-for, v-model cho đủ ba trường, các sự kiện Sửa/Xóa/Lưu và vùng hiển thị thông báo.

Bộ `tests/test_frontend.mjs` đạt **10 nhóm kiểm tra logic Vue với API thật**:

1. mounted tự gọi GET và nhận danh sách.
2. Thêm gửi POST rồi GET, trim tên và đặt lại form sau thành công.
3. Sửa đưa dữ liệu vào form, gửi PUT đúng ID, cập nhật giá/tồn rồi GET.
4. Instance mới đọc lại được dữ liệu đã lưu.
5. Hủy xác nhận không gửi DELETE và giữ danh sách.
6. Đồng ý xóa gửi DELETE đúng ID rồi GET; instance khác đọc lại không còn; form đang sửa được đặt lại.
7. Form chặn tồn âm trước khi gửi.
8. Lỗi API hiện thông báo và giữ dữ liệu form để sửa lại.
9. Lỗi mạng hoặc phản hồi không phải JSON được xử lý, không giữ trạng thái đang tải.
10. Làm mới sau lỗi khôi phục danh sách và giữ nguyên dữ liệu ban đầu.

Bộ này mô phỏng đăng ký Vue để chạy các hàm thực tế trong `assets/app.js`, không phải kiểm thử trình duyệt/DOM.

## Câu 4 — Lưu dữ liệu và khởi động lại

Đã tạo một sản phẩm thử riêng, sửa giá và tồn, dừng PHP/MySQL bằng Ctrl+C, rồi chạy lại script từ thư mục khác. Đọc qua API xác nhận sản phẩm và các giá trị mới vẫn còn.

Sau đó đã xóa chính sản phẩm thử, dừng/chạy lại lần nữa và xác nhận sản phẩm không xuất hiện lại. Danh sách cuối cùng giống hệt trước kiểm tra, giữ nguyên **2 sản phẩm hiện có**: Bút bi và Vở ô ly. Không khôi phục hoặc xóa sản phẩm của người dùng trong quá trình rà soát.

## Khởi động, tài nguyên và cú pháp

- `bash start.sh` khởi động không hỏi mật khẩu, in đúng phiên bản 8.1.0 và tên MySQL Community Server - GPL.
- Gọi start.sh từ thư mục khác vẫn xác định đúng đường dẫn dự án.
- Ctrl+C dừng PHP và MySQL do script khởi động; dữ liệu nằm trong `.runtime/mysql-data`.
- Trang HTML, CSS, JavaScript và Vue cục bộ trả HTTP 200, có nội dung; Vue đang dùng bản 3.5.13.
- Truy cập `.runtime`, đường dẫn mã hóa đến file nội bộ và `.gitignore` trả HTTP 404.
- Cú pháp các file PHP, JavaScript ứng dụng và script Bash hợp lệ.

## Lưu ý trước khi nộp

1. **Tại thời điểm rà soát có 2 sản phẩm.** Sau đó đã nhập lại database.sql để bổ sung Thước kẻ (giá 8000, tồn 0), giữ nguyên Bút bi và Vở ô ly. API đã xác nhận có đủ 3 sản phẩm mẫu. Script không tự thêm lại sản phẩm khi khởi động vì phải giữ đúng kết quả thao tác xóa.
2. **Chưa điều khiển trực tiếp trình duyệt trong phiên này.** Cần bấm thử các nút, kiểm tra hộp thoại xác nhận, v-model trong ô nhập và tải lại trang thật. Logic xử lý đã kiểm tra tự động; bố cục/DOM chưa được kiểm chứng bằng tự động hóa trình duyệt.
3. **Môi trường máy nộp bài:** driver `.runtime/pdo_mysql.so` và đường dẫn MySQL mặc định dành cho Mac hiện tại. Máy khác cần PDO MySQL tương thích và cấu hình kết nối/đường dẫn theo README; không nộp thư mục dữ liệu `.runtime`.
