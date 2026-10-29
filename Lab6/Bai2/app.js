const { createApp } = Vue;

createApp({
  data() {
    return {
      tenPhim: "Hành trình kỳ diệu",
      hoTen: "",
      suatChieu: "18:00",
      loaiVe: "thuong",
      soLuong: 1,
      coCombo: false,
      xacNhan: null,
    };
  },

  computed: {
    giaVe() {
      return this.loaiVe === "vip" ? 100000 : 70000;
    },

    soLuongHopLe() {
      return Number.isInteger(this.soLuong) && this.soLuong >= 1 && this.soLuong <= 10;
    },

    tongTien() {
      if (!this.soLuongHopLe) return 0;
      return this.giaVe * this.soLuong + (this.coCombo ? 45000 : 0);
    },

    coTheDatVe() {
      return this.hoTen.trim().length > 0 && this.soLuongHopLe;
    },
  },

  methods: {
    dinhDangTien(soTien) {
      return new Intl.NumberFormat("vi-VN").format(soTien) + " đồng";
    },

    tangSoLuong() {
      if (!this.soLuongHopLe) {
        this.soLuong = 1;
      } else if (this.soLuong < 10) {
        this.soLuong++;
      }
    },

    giamSoLuong() {
      if (!this.soLuongHopLe) {
        this.soLuong = 1;
      } else if (this.soLuong > 1) {
        this.soLuong--;
      }
    },

    datLai() {
      this.hoTen = "";
      this.suatChieu = "18:00";
      this.loaiVe = "thuong";
      this.soLuong = 1;
      this.coCombo = false;
      this.xacNhan = null;
    },

    datVe() {
      if (!this.coTheDatVe) return;
      this.xacNhan = {
        tenPhim: this.tenPhim,
        hoTen: this.hoTen.trim(),
        suatChieu: this.suatChieu,
        loaiVe: this.loaiVe === "vip" ? "Vé VIP" : "Vé thường",
        soLuong: this.soLuong,
        coCombo: this.coCombo,
        tongTien: this.tongTien,
      };
    },
  },
}).mount("#app");
