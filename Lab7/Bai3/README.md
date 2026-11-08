# Bài 3 — Giỏ hàng với props và $emit

Vue 3 Options API, component JavaScript tách file. Cha sở hữu dữ liệu; con nhận props và chỉ phát sự kiện yêu cầu thay đổi.

## Chạy từ bất kỳ thư mục nào

```bash
cd "/Users/nguyencongtri/Documents/NguyenCongTri_23001945/Lab7/Bai3"
npm install
npm run dev
```

Mở URL Vite hiển thị trong Terminal. Mặc định là http://127.0.0.1:5173; nếu cổng đang dùng thì Vite chọn cổng tiếp theo. Nhấn Ctrl + C để dừng.

```bash
npm test
npm run build
npm run preview
```

## Cấu trúc

```text
Bai3/
├── app.js                       # Đăng ký component trước khi mount
├── cart.js                      # Cha: mảng giỏ hàng, xử lý sự kiện, computed
├── components/DongGioHang.js     # Con: props, thành tiền, nút và $emit
├── images/                      # Ảnh minh họa cục bộ
├── style.css
└── tests/cart.test.js
```

## Luồng dữ liệu

```text
Cha: gioHang
   │ :id, :ten, :don-gia, :so-luong, :anh
   ▼
Con: <dong-gio-hang>
   │ $emit('doi-so-luong', id, soLuongMoi)
   │ $emit('yeu-cau-xoa', id)
   ▼
Cha: kiểm tra mã, kiểm tra số lượng, cập nhật mảng
   └── Props và các computed tự cập nhật
```

Con dùng các props giá trị riêng, không nhận/sửa một đối tượng sản phẩm. Ô nhập dùng `:value` và `@change`, không dùng `v-model` trên prop. Tăng/giảm chỉ gửi yêu cầu và khóa nút tại biên 1/99. Nhập trực tiếp giá trị sai sẽ hiện lỗi từ cha và khôi phục giá trị hợp lệ ở ô nhập.

Cha kiểm tra `Number.isInteger(soLuongMoi)` và khoảng `[1, 99]`; từ chối chuỗi, `NaN`, số thập phân, số ngoài khoảng và mã không tồn tại. Cha cũng kiểm tra mã khi nhận yêu cầu xóa. Các phép cập nhật dùng `map`/`filter` tạo mảng mới.

## Đối chiếu yêu cầu

| Yêu cầu | Vị trí/cách thực hiện |
| --- | --- |
| Mục giỏ có id, tên, đơn giá, số lượng | `taoGioMau()` trong `cart.js` |
| Con nhận props, hiển thị thành tiền và các nút | `components/DongGioHang.js`, computed `thanhTien` |
| Khai báo và phát hai sự kiện | `emits`, `tangSoLuong`, `giamSoLuong`, `nhapSoLuong`, `yeuCauXoa` |
| Cha nhận và kiểm tra trước khi cập nhật | `doiSoLuong`, `yeuCauXoa` trong `cart.js` |
| Số nguyên từ 1 đến 99 | Kiểm tra ở cha, giới hạn nút ở con |
| Con không sửa props | Props giá trị riêng; chỉ `$emit` |
| Tổng số lượng và tổng tiền bằng computed | `tongSoLuong`, `tongTien` ở cha |
| Xóa hết hiện “Giỏ hàng trống” | `v-if`/`v-else` trong template của cha |

## Ví dụ kiểm tra

| Sản phẩm | Đơn giá | Số lượng | Thành tiền |
| --- | ---: | ---: | ---: |
| Bút bi xanh | 5.000 đ | 2 | 10.000 đ |
| Vở kẻ ngang | 12.000 đ | 3 | 36.000 đ |
| **Tổng** | | **5** | **46.000 đ** |

Đây cũng là dữ liệu mặc định khi mở trang hoặc bấm “Đặt lại giỏ mẫu”. Sau khi xóa hết, tổng số lượng và tổng tiền đều bằng 0. Dữ liệu lưu trong bộ nhớ; tải lại trang sẽ trở về giỏ mẫu. Bài thực hành không xử lý thanh toán.
