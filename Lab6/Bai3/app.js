const { createApp } = Vue;

createApp({
  data() {
    return {
      congViec: [
        { id: 1, ten: "Ôn tập các directive trong Vue.js", hoanThanh: false },
        { id: 2, ten: "Hoàn thành bài thực hành số 6", hoanThanh: false },
        { id: 3, ten: "Chuẩn bị tài liệu học tập", hoanThanh: true },
      ],
      idTiepTheo: 4,
      tenCongViecMoi: "",
      boLoc: "tat-ca",
      loiNhap: "",
    };
  },

  computed: {
    tongSoCongViec() {
      return this.congViec.length;
    },
    soViecChuaHoanThanh() {
      return this.congViec.filter((viec) => !viec.hoanThanh).length;
    },
    soViecDaHoanThanh() {
      return this.tongSoCongViec - this.soViecChuaHoanThanh;
    },
    danhSachDaLoc() {
      if (this.boLoc === "chua-hoan-thanh") {
        return this.congViec.filter((viec) => !viec.hoanThanh);
      }
      if (this.boLoc === "da-hoan-thanh") {
        return this.congViec.filter((viec) => viec.hoanThanh);
      }
      return this.congViec;
    },
  },

  methods: {
    themCongViec() {
      const ten = this.tenCongViecMoi.trim();
      if (ten === "") {
        this.loiNhap = "Vui lòng nhập tên công việc, không để trống hoặc chỉ nhập khoảng trắng.";
        return;
      }
      this.congViec.push({ id: this.idTiepTheo++, ten, hoanThanh: false });
      this.tenCongViecMoi = "";
      this.loiNhap = "";
      this.boLoc = "tat-ca";
    },
    xoaCongViec(id) {
      this.congViec = this.congViec.filter((viec) => viec.id !== id);
    },
    xoaCacViecDaHoanThanh() {
      this.congViec = this.congViec.filter((viec) => !viec.hoanThanh);
    },
  },
}).mount("#app");
