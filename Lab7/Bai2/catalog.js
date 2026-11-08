export default {
  name: 'DanhMucSanPham',

  // Component cha sở hữu danh sách; component con chỉ đọc dữ liệu từ props.
  data() {
    return {
      sanPhams: [
        {
          id: 1,
          ten: 'Tai nghe không dây',
          gia: 990000,
          anh: new URL('./images/headphones.svg', import.meta.url).href,
          moTa: 'Âm thanh rõ nét, đệm tai mềm mại và kết nối Bluetooth ổn định. Pin lên đến 30 giờ, đồng hành cùng những buổi làm việc tập trung.',
          soLuongTon: 8,
        },
        {
          id: 2,
          ten: 'Bàn phím cơ mini',
          gia: 1290000,
          anh: new URL('./images/keyboard.svg', import.meta.url).href,
          moTa: 'Bố cục 65% gọn gàng, phím bấm êm và kết nối không dây. Tông màu kem nhẹ nhàng giúp góc bàn thêm ngăn nắp, dễ chịu.',
          soLuongTon: 12,
        },
        {
          id: 3,
          ten: 'Đèn bàn tối giản',
          gia: 450000,
          anh: new URL('./images/lamp.svg', import.meta.url).href,
          moTa: 'Ánh sáng ấm dịu với ba mức điều chỉnh độ sáng. Chân đèn vững chắc, thiết kế nhỏ gọn dành cho bàn đọc sách và làm việc.',
          soLuongTon: 0,
        },
        {
          id: 4,
          ten: 'Bình giữ nhiệt 500ml',
          gia: 320000,
          anh: new URL('./images/bottle.svg', import.meta.url).href,
          moTa: 'Bình inox hai lớp, nắp kín chống tràn và dung tích 500ml vừa tay. Giữ nóng đến 6 giờ, giữ lạnh đến 12 giờ.',
          soLuongTon: 16,
        },
      ],
      thongBao: '',
    }
  },

  computed: {
    soSanPhamConHang() {
      return this.sanPhams.filter((sanPham) => sanPham.soLuongTon > 0).length
    },
  },

  methods: {
    chonMua(ten) {
      this.thongBao = 'Bạn đã chọn “' + ten + '”.'
    },
  },

  template: `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="./" aria-label="Kho nhỏ - Trang chủ">
          <span class="brand-mark" aria-hidden="true">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z" /><path d="m3 7 9 5 9-5M12 12v10M7.5 4.5l9 5" /></svg>
          </span>
          Kho nhỏ<span class="brand-period">.</span>
        </a>
        <span class="nav-current">Danh mục sản phẩm</span>
        <span class="course-label">VUE 3 <span>/</span> BÀI THỰC HÀNH 02</span>
      </div>
    </header>

    <main class="workspace">
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-copy">
          <p class="eyebrow"><span></span> MỘT CHÚT CẢM HỨNG CHO MỖI NGÀY</p>
          <h1 id="page-title">Những món nhỏ,<br />cho góc làm việc <em>của bạn.</em></h1>
          <p class="hero-description">Một chiếc bàn gọn gàng. Một ngày nhiều cảm hứng.<br />Khám phá những món đồ giúp bạn làm việc theo cách mình thích.</p>
        </div>
        <div class="hero-note" aria-hidden="true">
          <span class="note-sparkle">✳</span>
          <span class="note-number">0{{ sanPhams.length }}</span>
          <p>Món đồ nhỏ.<br />Cảm hứng lớn.</p>
          <span class="note-line"></span>
        </div>
      </section>

      <section class="catalog" aria-labelledby="catalog-title">
        <div class="catalog-heading">
          <div><p class="section-eyebrow">ĐƯỢC CHỌN CHO BẠN</p><h2 id="catalog-title">Khám phá sản phẩm <span class="count-pill">{{ sanPhams.length }}</span></h2></div>
          <p class="catalog-status"><span class="status-dot"></span>{{ soSanPhamConHang }} sản phẩm đang có sẵn</p>
        </div>

        <div v-if="thongBao" class="feedback" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
          <span>{{ thongBao }}</span>
          <button type="button" aria-label="Đóng thông báo" @click="thongBao = ''">×</button>
        </div>

        <div class="product-grid">
          <!-- Binding kebab-case ánh xạ tới props camelCase ở component con. -->
          <the-san-pham
            v-for="sanPham in sanPhams"
            :key="sanPham.id"
            :ten="sanPham.ten"
            :gia="sanPham.gia"
            :anh="sanPham.anh"
            :mo-ta="sanPham.moTa"
            :so-luong-ton="sanPham.soLuongTon"
            @mua="chonMua"
          ></the-san-pham>
        </div>
      </section>

      <section class="collection-note" aria-label="Về bộ sưu tập">
        <span class="collection-symbol" aria-hidden="true">✳</span>
        <div><h2>Chọn ít hơn. Thích nhiều hơn.</h2><p>Những món đồ thiết thực, để mỗi ngày ở góc bàn đều dễ chịu hơn một chút.</p></div>
        <span class="collection-tag">THE DESK EDIT · 01</span>
      </section>

      <footer class="page-footer"><span><strong>Kho nhỏ.</strong> Những điều nhỏ, niềm vui mỗi ngày.</span><span>Bài 02 <span class="footer-dot">·</span> Vue 3 Components</span></footer>
    </main>
  `,
}
