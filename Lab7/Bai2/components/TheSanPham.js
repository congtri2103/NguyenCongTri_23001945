const anhMacDinh = new URL('../images/placeholder.svg', import.meta.url).href

export default {
  name: 'TheSanPham',

  props: {
    ten: {
      type: String,
      required: true,
    },
    gia: {
      type: Number,
      required: true,
      validator: (value) => Number.isFinite(value) && value > 0,
    },
    anh: {
      type: String,
      default: anhMacDinh,
    },
    moTa: {
      type: String,
      default: 'Sản phẩm hiện chưa có mô tả chi tiết.',
    },
    soLuongTon: {
      type: Number,
      default: 0,
      validator: (value) => Number.isSafeInteger(value) && value >= 0,
    },
  },

  emits: ['mua'],

  // Mỗi lần dùng <the-san-pham> sẽ tạo một đối tượng data mới.
  // Mở mô tả của thẻ này không thay đổi trạng thái ở thẻ khác.
  data() {
    return { hienMoTa: false }
  },

  computed: {
    conHang() {
      return this.soLuongTon > 0
    },
    giaHienThi() {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(this.gia)
    },
  },

  methods: {
    batTatMoTa() {
      this.hienMoTa = !this.hienMoTa
    },
    muaSanPham() {
      // Kiểm tra cả ở method, ngoài việc khóa nút trên giao diện.
      if (this.conHang) this.$emit('mua', this.ten)
    },
    xuLyLoiAnh(event) {
      const image = event.target
      if (image.dataset.fallback) return
      image.dataset.fallback = 'true'
      image.src = anhMacDinh
    },
  },

  template: `
    <article class="product-card" :class="{ 'sold-out': !conHang }">
      <div class="product-image-wrap">
        <img class="product-image" :src="anh" :alt="ten" width="640" height="520" @error="xuLyLoiAnh" />
        <span class="image-label" :class="conHang ? 'available-label' : 'sold-out-label'">
          <span class="status-dot" aria-hidden="true"></span>
          {{ conHang ? 'Còn hàng' : 'Hết hàng' }}
        </span>
      </div>

      <div class="product-content">
        <p class="product-eyebrow">GÓC LÀM VIỆC</p>
        <h3>{{ ten }}</h3>
        <div class="product-price-row">
          <p class="product-price">{{ giaHienThi }}</p>
          <p class="product-stock">{{ conHang ? 'Còn ' + soLuongTon + ' sản phẩm' : 'Tạm hết hàng' }}</p>
        </div>

        <button type="button" class="description-toggle" :aria-expanded="hienMoTa" @click="batTatMoTa">
          {{ hienMoTa ? 'Ẩn mô tả' : 'Xem mô tả' }}
          <svg :class="{ rotated: hienMoTa }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <p v-if="hienMoTa" class="product-description">{{ moTa }}</p>

        <button type="button" class="buy-button" :disabled="!conHang" :aria-label="'Mua ' + ten" @click="muaSanPham">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 7h12l2 14H4L6 7Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          Mua
        </button>
      </div>
    </article>
  `,
}
