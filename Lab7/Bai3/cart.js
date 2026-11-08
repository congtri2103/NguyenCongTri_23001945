// Luôn tạo dữ liệu mới khi khởi tạo/đặt lại; không dùng chung mảng giữa các app.
export function taoGioMau() {
  return [
    { id: 1, ten: 'Bút bi xanh', donGia: 5000, soLuong: 2, anh: new URL('./images/pen.svg', import.meta.url).href },
    { id: 2, ten: 'Vở kẻ ngang', donGia: 12000, soLuong: 3, anh: new URL('./images/notebook.svg', import.meta.url).href },
  ]
}

export default {
  name: 'GioHang',

  data() {
    return { gioHang: taoGioMau(), thongBao: '', loi: '' }
  },

  computed: {
    tongSoLuong() {
      return this.gioHang.reduce((tong, sanPham) => tong + sanPham.soLuong, 0)
    },
    tongTien() {
      return this.gioHang.reduce((tong, sanPham) => tong + sanPham.donGia * sanPham.soLuong, 0)
    },
  },

  methods: {
    dinhDangTien(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency', currency: 'VND', maximumFractionDigits: 0,
      }).format(value)
    },
    doiSoLuong(id, soLuongMoi) {
      // Không ép kiểu: từ chối cả chuỗi "3", số thập phân, NaN, rỗng...
      if (!Number.isInteger(id) || !this.gioHang.some((sanPham) => sanPham.id === id)) {
        this.loi = 'Không tìm thấy sản phẩm trong giỏ hàng.'
        return false
      }
      if (!Number.isInteger(soLuongMoi) || soLuongMoi < 1 || soLuongMoi > 99) {
        this.loi = 'Số lượng phải là số nguyên từ 1 đến 99.'
        return false
      }

      // Chỉ cha cập nhật mảng. Component con không sửa props.
      this.gioHang = this.gioHang.map((sanPham) =>
        sanPham.id === id ? { ...sanPham, soLuong: soLuongMoi } : sanPham,
      )
      this.loi = ''
      this.thongBao = ''
      return true
    },
    yeuCauXoa(id) {
      const sanPham = this.gioHang.find((item) => item.id === id)
      if (!Number.isInteger(id) || !sanPham) {
        this.loi = 'Không tìm thấy sản phẩm trong giỏ hàng.'
        return false
      }
      this.gioHang = this.gioHang.filter((item) => item.id !== id)
      this.loi = ''
      this.thongBao = 'Đã xóa “' + sanPham.ten + '” khỏi giỏ hàng.'
      return true
    },
    datLaiGioHang() {
      this.gioHang = taoGioMau()
      this.thongBao = ''
      this.loi = ''
    },
  },

  template: `
    <header class="topbar">
      <div class="topbar-inner">
        <a href="./" class="brand" aria-label="Kho nhỏ - Trang chủ"><span class="brand-mark" aria-hidden="true"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm-9 5 9 5 9-5M12 12v10M7.5 4.5l9 5" /></svg></span>Kho nhỏ<span class="brand-period">.</span></a>
        <span class="nav-current"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l2 14H4L6 7ZM9 8V6a3 3 0 0 1 6 0v2" /></svg> Giỏ hàng</span>
        <span class="course-label">VUE 3 <span>/</span> BÀI THỰC HÀNH 03</span>
      </div>
    </header>

    <main class="workspace">
      <section class="page-heading" aria-labelledby="page-title">
        <div><p class="eyebrow">NHỮNG MÓN NHỎ BẠN ĐÃ CHỌN</p><h1 id="page-title">Giỏ hàng của bạn<span>.</span></h1><p class="page-description">Thêm một chút ngăn nắp, thêm một chút cảm hứng cho mỗi ngày.</p></div>
        <button type="button" class="reset-button" @click="datLaiGioHang"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11a9 9 0 1 1 2.6 7M3 4v7h7" /></svg>Đặt lại giỏ mẫu</button>
      </section>

      <div v-if="loi" class="notice error-notice" role="alert"><span>{{ loi }}</span><button type="button" aria-label="Đóng thông báo lỗi" @click="loi = ''">×</button></div>
      <div v-if="thongBao" class="notice success-notice" role="status"><span>{{ thongBao }}</span><button type="button" aria-label="Đóng thông báo" @click="thongBao = ''">×</button></div>

      <div class="cart-layout">
        <section class="panel cart-panel" aria-labelledby="cart-title">
          <div class="panel-heading"><h2 id="cart-title">Sản phẩm trong giỏ <span class="count-pill">{{ gioHang.length }}</span></h2><span class="cart-heading-note">Những lựa chọn của bạn</span></div>

          <template v-if="gioHang.length">
            <div class="cart-columns" aria-hidden="true"><span>Sản phẩm</span><span>Đơn giá</span><span>Số lượng</span><span>Thành tiền</span><span></span></div>
            <div class="cart-items">
              <dong-gio-hang
                v-for="sanPham in gioHang"
                :key="sanPham.id"
                :id="sanPham.id"
                :ten="sanPham.ten"
                :don-gia="sanPham.donGia"
                :so-luong="sanPham.soLuong"
                :anh="sanPham.anh"
                @doi-so-luong="doiSoLuong"
                @yeu-cau-xoa="yeuCauXoa"
              ></dong-gio-hang>
            </div>
            <div class="cart-panel-footer"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></svg><span>Bạn có thể chọn từ 1 đến 99 cho mỗi sản phẩm.</span></div>
          </template>

          <div v-else class="empty-cart">
            <span class="empty-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l2 14H4L6 7ZM9 8V6a3 3 0 0 1 6 0v2" /></svg></span>
            <h3>Giỏ hàng trống</h3><p>Chưa có sản phẩm nào trong giỏ hàng của bạn.</p>
            <button type="button" class="primary-button" @click="datLaiGioHang">Khôi phục giỏ mẫu</button>
          </div>
        </section>

        <aside class="panel summary-panel" aria-labelledby="summary-title">
          <div class="summary-heading"><span class="summary-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v19l-3-2-3 2-3-2-3 2V3ZM9 7h6M9 11h6M9 15h3" /></svg></span><h2 id="summary-title">Tóm tắt giỏ hàng</h2></div>
          <div class="summary-values" aria-live="polite" aria-atomic="true">
            <dl><div><dt>Số loại sản phẩm</dt><dd data-testid="item-count">{{ gioHang.length }}</dd></div><div><dt>Tổng số lượng</dt><dd data-testid="quantity-total">{{ tongSoLuong }} <span>sản phẩm</span></dd></div></dl>
            <div class="grand-total"><span>Tổng tiền</span><strong data-testid="money-total">{{ dinhDangTien(tongTien) }}</strong></div>
          </div>
          <p class="summary-caption">Tổng thành tiền của tất cả sản phẩm trong giỏ.</p>
          <div class="summary-tip"><span class="check-icon">✓</span><p>Giỏ hàng tự động cập nhật sau mỗi thay đổi của bạn.</p></div>
        </aside>
      </div>

      <div class="little-note"><span aria-hidden="true">✳</span><p>Một chiếc bút, vài trang vở. Khởi đầu cho những ý tưởng hay.</p></div>
      <footer class="page-footer"><span><strong>Kho nhỏ.</strong> Những điều nhỏ, niềm vui mỗi ngày.</span><span>Bài 03 <span class="footer-dot">·</span> Vue 3 Props &amp; Events</span></footer>
    </main>
  `,
}
