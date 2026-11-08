import { createApp } from 'vue/dist/vue.esm-bundler.js'
import GioHang from './cart.js'
import DongGioHang from './components/DongGioHang.js'
import './style.css'

const app = createApp(GioHang)
app.component('dong-gio-hang', DongGioHang)
app.mount('#app')
