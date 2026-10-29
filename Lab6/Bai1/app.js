const { createApp } = Vue;

createApp({
  data() {
    return {
      maSinhVien: "23001945",
      hoTen: "Nguyễn Công Trí",
      lop: "CNTT K23",
      anhDaiDien: "../assets/avatar.svg",
      diemTrungBinh: 8.5,
      dangHoc: true,
      gioiThieu: "Mình yêu thích công nghệ, lập trình và xây dựng các trang web. Hiện tại mình đang học Vue.js.",
      hienGioiThieu: true,
    };
  },
}).mount("#app");

