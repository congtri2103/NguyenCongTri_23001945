# Bài thực hành số 6 — Vue.js

Gồm ba bài độc lập: thẻ sinh viên, đặt vé xem phim và quản lý công việc cá nhân.

## Cách chạy

Nhấp đúp `index.html` trong thư mục `Lab6`, sau đó chọn **Mở bài 1**, **Mở bài 2** hoặc **Mở bài 3**. Trong mỗi bài có liên kết quay về danh sách bài tập. Cũng có thể mở trực tiếp `Bai1/index.html`, `Bai2/index.html` hoặc `Bai3/index.html`.

Không cần cài npm, Node.js hay chạy build. Vue **3.5.13**, CSS và ảnh mẫu nằm trong thư mục `assets`, nên các bài chạy được khi không có Internet. Giữ nguyên cấu trúc thư mục để các đường dẫn tương đối hoạt động.

## Cấu trúc thư mục

```text
Lab6/
├── index.html                 # Trang chọn bài
├── README.md
├── assets/
│   ├── style.css              # Giao diện dùng chung
│   ├── avatar.svg             # Ảnh đại diện mẫu
│   ├── vue.global.prod.js     # Vue 3.5.13
│   └── VUE-LICENSE.txt        # Giấy phép MIT của Vue
├── Bai1/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── Bai2/
│   ├── index.html
│   ├── app.js
│   └── style.css
└── Bai3/
    ├── index.html
    ├── app.js
    └── style.css
```

Mỗi `app.js` khởi tạo một ứng dụng bằng `createApp`, khai báo trạng thái trong `data()` và gắn vào `#app`. Có chú thích trong mã tương ứng các yêu cầu của đề.

## Bài 1 — Thẻ thông tin sinh viên

| Yêu cầu | Thực hiện |
| --- | --- |
| 1. Dữ liệu sinh viên | `data()` khai báo mã, tên, lớp, ảnh, điểm và trạng thái đang học. |
| 2. Hiển thị tên và lớp | `{{ hoTen }}` và `v-text="lop"`. |
| 3. Gắn ảnh và mô tả | `v-bind:src` và `v-bind:alt`. |
| 4. Xếp loại theo điểm | `v-if` / `v-else-if`: Giỏi từ 8, Khá từ 6.5, Trung bình từ 5, Chưa đạt dưới 5. |
| 5. Màu xếp loại | `:class` gắn `gioi`, `kha`, `trung-binh` hoặc `chua-dat`. |
| 6. Trạng thái học | `v-if` / `v-else` hiển thị “Đang học” hoặc “Đã nghỉ”. |
| 7. Bật/tắt giới thiệu | Nút đảo `hienGioiThieu`; phần giới thiệu dùng `v-show`. |

Mở mục **Thay đổi dữ liệu sinh viên** phía dưới thẻ để thử sửa thông tin, điểm và trạng thái. `v-model` cập nhật dữ liệu, nên thẻ và màu tự thay đổi. Thử các điểm `0`, `4.9`, `5`, `6.4`, `6.5`, `7.9`, `8`, `10` để xem các mốc xếp loại.

Dữ liệu mặc định trong `Bai1/app.js`: Nguyễn Công Trí, mã `23001945`, lớp mẫu `CNTT K23`, điểm `8.5`. Lớp và ảnh chỉ là minh họa; có thể thay theo thực tế.

## Bài 2 — Đặt vé xem phim

| Yêu cầu | Thực hiện |
| --- | --- |
| 1. Họ tên khách hàng | `v-model.trim` bỏ khoảng trắng ở hai đầu. |
| 2. Suất chiếu | `select` gồm 14:00, 18:00 và 20:30. |
| 3. Loại vé | Radio chọn vé thường 70.000 đồng hoặc VIP 100.000 đồng. |
| 4. Số lượng | `v-model.number`; `Number.isInteger` kiểm tra số nguyên từ 1 đến 10. |
| 5. Combo | Checkbox thêm 45.000 đồng cho toàn đơn. |
| 6. Tổng tiền | `computed`: giá vé × số lượng + tiền combo. |
| 7. Tăng, giảm, đặt lại | Các `methods` điều chỉnh số lượng trong giới hạn và khôi phục form. |
| 8. Điều kiện đặt vé | Nút bị vô hiệu khi tên trống hoặc số lượng không hợp lệ. |
| 9. Xác nhận tại trang | `@submit.prevent` gọi `datVe` và lưu thông tin xác nhận tại thời điểm gửi. |

Cách tự kiểm tra:

1. Nhập họ tên, chọn **Vé VIP**, nhập **2** vé và chọn **combo bắp nước**. Tổng tiền phải là **245.000 đồng**: `100.000 × 2 + 45.000`.
2. Nhấn **Đặt vé** để xem xác nhận ngay dưới form. Thay đổi form sau đó không làm thay đổi bản xác nhận đã gửi.
3. Thử số lượng `0`, `11`, `1.5` hoặc xóa trống ô số lượng: hiện báo lỗi và nút **Đặt vé** bị vô hiệu.
4. Thử họ tên rỗng hoặc chỉ có khoảng trắng: không được đặt vé.
5. Nhấn **Đặt lại form**: họ tên và xác nhận được xóa, số lượng về 1, vé thường và không combo.

Đây là mô phỏng đặt vé trong trình duyệt, không gửi đơn đến hệ thống bán vé.

## Bài 3 — Quản lý công việc cá nhân

| Yêu cầu | Thực hiện |
| --- | --- |
| 1. Dữ liệu công việc | Mỗi phần tử gồm `id`, `ten`, `hoanThanh`. |
| 2. Thêm bằng nút hoặc Enter | Form dùng `@submit.prevent="themCongViec"`. |
| 3. Chặn tên rỗng | `.trim` kết hợp kiểm tra trong `methods`. |
| 4. Duyệt danh sách | `v-for` dùng `congViec.id` làm `:key`. |
| 5. Đánh dấu hoàn thành | Checkbox `v-model`; công việc hoàn thành có `text-decoration: line-through`. |
| 6. Xóa từng việc | Xóa bằng `id`, kể cả khi đang lọc. |
| 7. Lọc ba trạng thái | Tất cả, Chưa hoàn thành, Đã hoàn thành; danh sách lọc dùng `computed`. |
| 8. Thống kê | `computed` tính tổng, số chưa hoàn thành và số đã hoàn thành. |
| 9. Xóa các việc hoàn thành | Giữ lại các việc có `hoanThanh === false`. |
| 10. Thông báo rỗng | Phân biệt chưa có công việc với không có kết quả của bộ lọc. |

Cách tự kiểm tra:

1. Thêm một việc bằng nút **Thêm**, thêm việc khác bằng phím Enter. Tên chỉ có khoảng trắng phải bị từ chối.
2. Đánh dấu checkbox: tên được gạch ngang, các số lượng cập nhật ngay.
3. Thử cả ba bộ lọc, rồi xóa một việc từ danh sách đang lọc.
4. Chọn **Xóa các việc đã hoàn thành**: chỉ các việc chưa hoàn thành được giữ lại.
5. Khi bộ lọc không có kết quả, xem thông báo tương ứng. Xóa hết công việc để xem thông báo danh sách trống.

Danh sách mẫu có 3 công việc: 2 chưa hoàn thành, 1 đã hoàn thành. Khi thêm việc mới, bộ lọc trở về **Tất cả** để hiển thị việc vừa thêm.

## Lưu ý về dữ liệu

Các thay đổi chỉ tồn tại trong lần mở trang hiện tại. Tải lại trang sẽ khôi phục dữ liệu mặc định trong `app.js`; không có lưu trữ máy chủ hay `localStorage`.
