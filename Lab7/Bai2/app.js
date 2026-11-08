// Dùng bản Vue có compiler để hỗ trợ template viết trong file .js.
import { createApp } from 'vue/dist/vue.esm-bundler.js'
import DanhMucSanPham from './catalog.js'
import TheSanPham from './components/TheSanPham.js'
import './style.css'

const app = createApp(DanhMucSanPham)

// Nạp và đăng ký component trước khi mount ứng dụng.
app.component('the-san-pham', TheSanPham)
app.mount('#app')
