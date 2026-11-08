# Bài 2 — Danh mục sản phẩm bằng component

Vue 3 Options API, tách file JavaScript, không cần file `.vue`. Component dùng lại được: `<the-san-pham>`.

## Chạy

```bash
cd Bai2
npm install
npm run dev
```

Mở URL Vite in trong terminal, mặc định http://127.0.0.1:5173. Nếu cổng đã được dùng, Vite sẽ chọn cổng tiếp theo.

```bash
npm test
npm run build
npm run preview
```

## Cấu trúc

```text
Bai2/
├── index.html
├── app.js                      # Import, đăng ký rồi mount
├── catalog.js                  # Cha: danh sách và binding props
├── components/
│   └── TheSanPham.js            # Con: props, data riêng, template
├── images/                     # Ảnh SVG cục bộ, có ảnh dự phòng
├── style.css
└── tests/components.test.js
```

## Props

| Prop JavaScript | Binding HTML | Kiểu | Quy tắc |
| --- | --- | --- | --- |
| `ten` | `:ten` | `String` | Bắt buộc |
| `gia` | `:gia` | `Number` | Bắt buộc, số hữu hạn lớn hơn 0 |
| `anh` | `:anh` | `String` | Mặc định ảnh dự phòng |
| `moTa` | `:mo-ta` | `String` | Mặc định thông báo chưa có mô tả |
| `soLuongTon` | `:so-luong-ton` | `Number` | Mặc định 0, số nguyên không âm |

## Đối chiếu yêu cầu

1. `catalog.js` quản lý 4 sản phẩm; có cả sản phẩm còn hàng và hết hàng.
2. `TheSanPham.js` nhận đủ 5 prop tên, giá, ảnh, mô tả, số lượng tồn.
3. Tất cả prop có `type`; tên và giá có `required`; ảnh, mô tả, tồn kho có `default`.
4. Cha dùng `v-for`, `:key` và binding `:ten`, `:gia`, `:anh`, `:mo-ta`, `:so-luong-ton`.
5. Nút “Xem mô tả”/“Ẩn mô tả” bật tắt `hienMoTa` trong `data()` của con.
6. `data()` trả đối tượng mới cho mỗi instance, nên các thẻ có trạng thái độc lập.
7. Hàng hết có nhãn “Hết hàng”; nút “Mua” dùng `:disabled="!conHang"`. Method mua cũng kiểm tra tồn kho.
8. `app.js` import `components/TheSanPham.js`, gọi `app.component('the-san-pham', TheSanPham)` trước `app.mount('#app')`.

Nút “Mua” phát sự kiện để cha hiển thị thông báo chọn sản phẩm; đây là bài thực hành danh mục, không xử lý thanh toán hoặc đơn hàng. Component con không sửa props hay dữ liệu của cha. Ảnh được lưu cục bộ, không cần nguồn ảnh bên ngoài.

`app.js` dùng bản Vue có compiler (`vue/dist/vue.esm-bundler.js`) để xử lý template trong file `.js`. Hãy chạy qua Vite thay vì mở trực tiếp `index.html` bằng `file://`.
