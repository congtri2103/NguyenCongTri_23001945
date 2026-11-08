# Bài 1 — Danh sách sản phẩm có tìm kiếm và thống kê

Vue 3 Options API và Vite. Giao diện tiếng Việt, có 9 sản phẩm mẫu thuộc 3 danh mục.

## Chạy dự án

Yêu cầu Node.js 20.19+ hoặc 22.12+.

```bash
cd Bai1
npm install
npm run dev
```

Mở địa chỉ Vite in trong terminal (mặc định http://127.0.0.1:5173).

```bash
npm test         # Kiểm tra logic, computed, watch và mounted
npm run build   # Build vào thư mục dist/
npm run preview # Xem bản build
```

## Đối chiếu yêu cầu

| Yêu cầu | Cách thực hiện |
| --- | --- |
| Bảng và nhãn tồn kho | `v-for`, `v-if`, `:class`; nhãn Còn hàng màu xanh, Hết hàng màu đỏ |
| Tìm theo tên không phân biệt hoa thường | `v-model="keyword"`, chuẩn hóa chữ thường trong `visibleProducts` |
| Lọc danh mục | `v-model="selectedCategory"` |
| Sắp xếp giá, không đổi mảng gốc | `sortOrder`, sắp xếp trên bản sao `[...result]` |
| Kết hợp tìm kiếm, lọc, sắp xếp | Một computed `visibleProducts` xử lý cả ba |
| Thêm và kiểm tra dữ liệu | `@submit.prevent="addProduct"`, lỗi hiển thị cạnh từng trường |
| Xóa sau xác nhận | Hộp thoại có Hủy và Xác nhận xóa; chỉ `confirmDelete` thay đổi dữ liệu |
| Số hiển thị/tổng số và giá trị tồn kho | Các computed `visibleCount`, `totalCount`, `inventoryValue` |
| Watch từ khóa một ký tự | `watch.keyword` đặt hoặc xóa `keywordNotice` |
| Trạng thái Sẵn sàng | `mounted()` cập nhật `pageStatus` |

`src/App.vue` chứa template và kết nối component. `src/product-manager.js` chứa toàn bộ Options API để dễ đọc và kiểm thử. `src/style.css` chứa giao diện responsive. `tests/product-manager.test.js` kiểm tra bằng Vue runtime thật và test runner có sẵn của Node.js.

Thống kê luôn tính trên kết quả hiện tại, kể cả khi không có kết quả. Tồn kho 0 hợp lệ; tên toàn khoảng trắng, giá không dương và tồn kho trống/âm/thập phân bị từ chối. Bộ lọc vẫn giữ nguyên sau khi thêm hoặc xóa.

Dữ liệu nằm trong bộ nhớ và trở về mẫu ban đầu khi tải lại trang. Font Google có font hệ thống dự phòng; chức năng không cần dịch vụ bên ngoài.
