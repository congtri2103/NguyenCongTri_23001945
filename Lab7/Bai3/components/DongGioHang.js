export default {
  name: 'DongGioHang',

  // Nhận từng giá trị riêng, không nhận đối tượng có thể bị sửa lồng nhau.
  props: {
    id: { type: Number, required: true },
    ten: { type: String, required: true },
    donGia: { type: Number, required: true },
    soLuong: {
      type: Number,
      required: true,
      validator: (value) => Number.isInteger(value) && value >= 1 && value <= 99,
    },
    anh: { type: String, default: '' },
  },

  emits: ['doi-so-luong', 'yeu-cau-xoa'],

  computed: {
    thanhTien() {
      return this.donGia * this.soLuong
    },
  },

  methods: {
    dinhDangTien(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency', currency: 'VND', maximumFractionDigits: 0,
      }).format(value)
    },
    tangSoLuong() {
      if (this.soLuong < 99) this.$emit('doi-so-luong', this.id, this.soLuong + 1)
    },
    giamSoLuong() {
      if (this.soLuong > 1) this.$emit('doi-so-luong', this.id, this.soLuong - 1)
    },
    nhapSoLuong(event) {
      const input = event.target
      const value = input.value.trim()
      // Chỉ gửi yêu cầu; cha quyết định có chấp nhận số lượng này hay không.
      this.$emit('doi-so-luong', this.id, value === '' ? NaN : Number(value))
      // Nếu cha từ chối, trả ô nhập về giá trị hợp lệ từ props.
      this.$nextTick(() => { input.value = String(this.soLuong) })
    },
    yeuCauXoa() {
      this.$emit('yeu-cau-xoa', this.id)
    },
  },

  template: `
    <article class="cart-row" :data-product-id="id" :aria-label="ten">
      <div class="product-info">
        <div class="product-image-wrap">
          <img v-if="anh" :src="anh" :alt="ten" width="160" height="160" />
          <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm-9 5 9 5 9-5M12 12v10" /></svg>
        </div>
        <div class="product-copy">
          <span class="product-category">VĂN PHÒNG PHẨM</span>
          <h3>{{ ten }}</h3>
          <span class="product-code">SP{{ String(id).padStart(3, '0') }}</span>
          <span class="mobile-unit-price">{{ dinhDangTien(donGia) }} / sản phẩm</span>
        </div>
      </div>

      <span class="unit-price">{{ dinhDangTien(donGia) }}</span>

      <div class="quantity-control" role="group" :aria-label="'Điều chỉnh số lượng ' + ten">
        <button type="button" :disabled="soLuong <= 1" :aria-label="'Giảm số lượng ' + ten" @click="giamSoLuong">−</button>
        <input type="number" :value="soLuong" min="1" max="99" step="1" inputmode="numeric" :aria-label="'Số lượng ' + ten" @change="nhapSoLuong" @keydown.enter.prevent="$event.target.blur()" />
        <button type="button" :disabled="soLuong >= 99" :aria-label="'Tăng số lượng ' + ten" @click="tangSoLuong">+</button>
      </div>

      <span class="line-total"><span class="mobile-total-label">Thành tiền</span>{{ dinhDangTien(thanhTien) }}</span>

      <button type="button" class="delete-button" :aria-label="'Xóa ' + ten" :title="'Xóa ' + ten" @click="yeuCauXoa">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></svg>
      </button>
    </article>
  `,
}
