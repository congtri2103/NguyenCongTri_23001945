import test from 'node:test'
import assert from 'node:assert/strict'
import { createRenderer, nextTick } from 'vue'
import TheSanPham from '../components/TheSanPham.js'
import DanhMucSanPham from '../catalog.js'

// Dùng Vue runtime thật để kiểm tra data/props độc lập, không cần DOM.
const renderer = createRenderer({
  createComment: (text) => ({ text }),
  insert() {}, remove() {},
  parentNode: () => null, nextSibling: () => null,
})

function mount(t, options, props = {}) {
  const app = renderer.createApp({ ...options, render: () => null }, props)
  const vm = app.mount({})
  t.after(() => app.unmount())
  return vm
}

test('Cha quản lý ít nhất 4 sản phẩm đủ dữ liệu, có cả hàng còn và hết', (t) => {
  const vm = mount(t, DanhMucSanPham)
  assert.ok(vm.sanPhams.length >= 4)
  assert.equal(vm.soSanPhamConHang, 3)
  assert.equal(new Set(vm.sanPhams.map((p) => p.id)).size, vm.sanPhams.length)
  for (const sanPham of vm.sanPhams) {
    assert.equal(typeof sanPham.ten, 'string')
    assert.equal(typeof sanPham.gia, 'number')
    assert.equal(typeof sanPham.anh, 'string')
    assert.equal(typeof sanPham.moTa, 'string')
    assert.ok(Number.isInteger(sanPham.soLuongTon))
  }
})

test('Props khai báo đủ kiểu dữ liệu, bắt buộc và mặc định', () => {
  assert.equal(TheSanPham.props.ten.type, String)
  assert.equal(TheSanPham.props.ten.required, true)
  assert.equal(TheSanPham.props.gia.type, Number)
  assert.equal(TheSanPham.props.gia.required, true)
  assert.equal(TheSanPham.props.anh.type, String)
  assert.equal(TheSanPham.props.moTa.type, String)
  assert.equal(TheSanPham.props.soLuongTon.type, Number)
  assert.equal(TheSanPham.props.soLuongTon.default, 0)
  assert.equal(TheSanPham.props.gia.validator(0), false)
  assert.equal(TheSanPham.props.gia.validator(Infinity), false)
  assert.equal(TheSanPham.props.soLuongTon.validator(-1), false)
  assert.equal(TheSanPham.props.soLuongTon.validator(1.5), false)
})

test('Giá trị mặc định hoạt động khi chỉ truyền prop bắt buộc', (t) => {
  const vm = mount(t, TheSanPham, { ten: 'Sản phẩm', gia: 100000 })
  assert.equal(vm.moTa, 'Sản phẩm hiện chưa có mô tả chi tiết.')
  assert.match(vm.anh, /placeholder\.svg$/)
  assert.equal(vm.soLuongTon, 0)
  assert.equal(vm.conHang, false)
  assert.match(vm.giaHienThi, /100\.000/)
})

test('Mô tả bật/tắt độc lập giữa các instance của cùng component', (t) => {
  const first = mount(t, TheSanPham, { ten: 'Thẻ thứ nhất', gia: 100000, moTa: 'Mô tả 1', soLuongTon: 2 })
  const second = mount(t, TheSanPham, { ten: 'Thẻ thứ hai', gia: 200000, moTa: 'Mô tả 2', soLuongTon: 3 })
  assert.equal(first.hienMoTa, false)
  assert.equal(second.hienMoTa, false)
  first.batTatMoTa()
  assert.equal(first.hienMoTa, true)
  assert.equal(second.hienMoTa, false)
  second.batTatMoTa()
  first.batTatMoTa()
  assert.equal(first.hienMoTa, false)
  assert.equal(second.hienMoTa, true)
  assert.equal(first.moTa, 'Mô tả 1')
  assert.equal(second.moTa, 'Mô tả 2')
})

test('Mua hàng phát sự kiện đúng tên, hàng hết không phát sự kiện', (t) => {
  const events = []
  const available = mount(t, TheSanPham, { ten: 'Còn hàng', gia: 100000, soLuongTon: 2, onMua: (ten) => events.push(ten) })
  const empty = mount(t, TheSanPham, { ten: 'Hết hàng', gia: 200000, soLuongTon: 0, onMua: (ten) => events.push(ten) })
  available.muaSanPham()
  empty.muaSanPham()
  assert.deepEqual(events, ['Còn hàng'])
  assert.equal(available.soLuongTon, 2)
  assert.equal(empty.soLuongTon, 0)
})

test('Ảnh lỗi được thay bằng ảnh dự phòng và không lặp vô hạn', () => {
  const image = { dataset: {}, src: 'anh-loi.svg' }
  TheSanPham.methods.xuLyLoiAnh({ target: image })
  assert.match(image.src, /placeholder\.svg$/)
  image.src = 'khong-thay-doi-lan-hai.svg'
  TheSanPham.methods.xuLyLoiAnh({ target: image })
  assert.equal(image.src, 'khong-thay-doi-lan-hai.svg')
})

test('Thông báo chọn mua của cha không tác động tới data mô tả của con', async (t) => {
  const parent = mount(t, DanhMucSanPham)
  const child = mount(t, TheSanPham, { ...parent.sanPhams[0], onMua: (ten) => parent.chonMua(ten) })
  child.batTatMoTa()
  child.muaSanPham()
  await nextTick()
  assert.match(parent.thongBao, /Tai nghe không dây/)
  assert.equal(child.hienMoTa, true)
  assert.equal(parent.sanPhams[0].soLuongTon, 8)
})
