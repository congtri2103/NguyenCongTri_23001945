import test from 'node:test'
import assert from 'node:assert/strict'
import { createRenderer, h, nextTick } from 'vue'
import GioHang, { taoGioMau } from '../cart.js'
import DongGioHang from '../components/DongGioHang.js'

// Mount bằng Vue runtime thật để kiểm tra computed và luồng props/$emit.
const renderer = createRenderer({
  createElement: () => ({}),
  createComment: (text) => ({ text }),
  createText: (text) => ({ text }),
  insert() {}, remove() {}, setText() {}, setElementText() {}, patchProp() {},
  parentNode: () => null, nextSibling: () => null,
})

function mount(t, options, props = {}) {
  const app = renderer.createApp({ ...options, render: options.render || (() => null) }, props)
  const vm = app.mount({})
  t.after(() => app.unmount())
  return vm
}

test('Giỏ mẫu: 2 bút × 5.000 + 3 vở × 12.000 = 5 sản phẩm, 46.000 đồng', (t) => {
  const vm = mount(t, GioHang)
  assert.equal(vm.gioHang.length, 2)
  assert.equal(vm.tongSoLuong, 5)
  assert.equal(vm.tongTien, 46000)
  assert.deepEqual(vm.gioHang.map(({ id, ten, donGia, soLuong }) => ({ id, ten, donGia, soLuong })), [
    { id: 1, ten: 'Bút bi xanh', donGia: 5000, soLuong: 2 },
    { id: 2, ten: 'Vở kẻ ngang', donGia: 12000, soLuong: 3 },
  ])
})

test('Tổng và thành tiền cập nhật đúng khi cha chấp nhận số lượng', (t) => {
  const vm = mount(t, GioHang)
  assert.equal(vm.doiSoLuong(1, 4), true)
  assert.equal(vm.tongSoLuong, 7)
  assert.equal(vm.tongTien, 56000)
  assert.equal(vm.gioHang[1].soLuong, 3)
  const row = mount(t, DongGioHang, vm.gioHang[0])
  assert.equal(row.thanhTien, 20000)
})

test('Chấp nhận hai biên 1 và 99, không ép kiểu dữ liệu sai', (t) => {
  const vm = mount(t, GioHang)
  for (const value of [1, 99]) {
    assert.equal(vm.doiSoLuong(1, value), true)
    assert.equal(vm.gioHang[0].soLuong, value)
  }
  const original = JSON.stringify(vm.gioHang)
  for (const value of [0, -1, 100, 1.5, NaN, Infinity, -Infinity, '3', '', null, undefined, true, {}, []]) {
    assert.equal(vm.doiSoLuong(1, value), false, `Giá trị: ${String(value)}`)
    assert.equal(JSON.stringify(vm.gioHang), original)
    assert.match(vm.loi, /số nguyên từ 1 đến 99/)
  }
})

test('Mã không hợp lệ/không tồn tại không thể cập nhật hoặc xóa', (t) => {
  const vm = mount(t, GioHang)
  const original = JSON.stringify(vm.gioHang)
  for (const id of [0, 999, 1.5, '1', null, undefined, NaN]) {
    assert.equal(vm.doiSoLuong(id, 3), false)
    assert.equal(vm.yeuCauXoa(id), false)
    assert.equal(JSON.stringify(vm.gioHang), original)
  }
})

test('Con khai báo sự kiện, gửi đúng mã/số lượng và không thay đổi props', (t) => {
  assert.deepEqual(DongGioHang.emits, ['doi-so-luong', 'yeu-cau-xoa'])
  const changes = []
  const deletes = []
  const item = Object.freeze({ id: 10, ten: 'Bút', donGia: 5000, soLuong: 2 })
  const row = mount(t, DongGioHang, {
    ...item,
    onDoiSoLuong: (...args) => changes.push(args),
    onYeuCauXoa: (id) => deletes.push(id),
  })
  row.tangSoLuong()
  row.giamSoLuong()
  row.yeuCauXoa()
  assert.deepEqual(changes, [[10, 3], [10, 1]])
  assert.deepEqual(deletes, [10])
  assert.equal(row.soLuong, 2)
  assert.equal(item.soLuong, 2)
  assert.equal(row.thanhTien, 10000)
})

test('Con không phát yêu cầu tăng quá 99 hoặc giảm dưới 1', (t) => {
  const events = []
  const lower = mount(t, DongGioHang, { id: 1, ten: 'Bút', donGia: 5000, soLuong: 1, onDoiSoLuong: (...args) => events.push(args) })
  const upper = mount(t, DongGioHang, { id: 2, ten: 'Vở', donGia: 12000, soLuong: 99, onDoiSoLuong: (...args) => events.push(args) })
  lower.giamSoLuong()
  upper.tangSoLuong()
  assert.deepEqual(events, [])
})

test('Tích hợp: con emit → cha kiểm tra → props và computed của con cập nhật', async (t) => {
  const Row = { ...DongGioHang, render: () => null }
  const vm = mount(t, {
    ...GioHang,
    render() {
      return h(Row, {
        ...this.gioHang[0], ref: 'row',
        onDoiSoLuong: this.doiSoLuong,
        onYeuCauXoa: this.yeuCauXoa,
      })
    },
  })
  vm.$refs.row.tangSoLuong()
  assert.equal(vm.gioHang[0].soLuong, 3)
  await nextTick()
  assert.equal(vm.$refs.row.soLuong, 3)
  assert.equal(vm.$refs.row.thanhTien, 15000)
  assert.equal(vm.tongSoLuong, 6)
  assert.equal(vm.tongTien, 51000)

  const invalidInput = { value: '2.5' }
  vm.$refs.row.nhapSoLuong({ target: invalidInput })
  await nextTick()
  assert.equal(vm.gioHang[0].soLuong, 3)
  assert.equal(invalidInput.value, '3')
  assert.match(vm.loi, /số nguyên từ 1 đến 99/)

  const validInput = { value: '7' }
  vm.$refs.row.nhapSoLuong({ target: validInput })
  await nextTick()
  assert.equal(vm.$refs.row.soLuong, 7)
  assert.equal(validInput.value, '7')
  assert.equal(vm.loi, '')
})

test('Cha cập nhật bằng mảng/đối tượng mới, không sửa bản dữ liệu cũ', (t) => {
  const vm = mount(t, GioHang)
  const originalArray = vm.gioHang
  const originalItem = vm.gioHang[0]
  vm.doiSoLuong(1, 9)
  assert.notEqual(vm.gioHang, originalArray)
  assert.notEqual(vm.gioHang[0], originalItem)
  assert.equal(originalItem.soLuong, 2)
})

test('Xóa từng mục rồi xóa hết: tổng số lượng và tiền về 0', (t) => {
  const vm = mount(t, GioHang)
  assert.equal(vm.yeuCauXoa(1), true)
  assert.equal(vm.gioHang.length, 1)
  assert.equal(vm.tongSoLuong, 3)
  assert.equal(vm.tongTien, 36000)
  assert.equal(vm.yeuCauXoa(2), true)
  assert.equal(vm.gioHang.length, 0)
  assert.equal(vm.tongSoLuong, 0)
  assert.equal(vm.tongTien, 0)
  assert.equal(vm.yeuCauXoa(2), false)
})

test('Đặt lại khôi phục giỏ mẫu và xóa thông báo lỗi', (t) => {
  const vm = mount(t, GioHang)
  vm.yeuCauXoa(1)
  vm.doiSoLuong(2, -1)
  vm.datLaiGioHang()
  assert.equal(vm.gioHang.length, 2)
  assert.equal(vm.tongSoLuong, 5)
  assert.equal(vm.tongTien, 46000)
  assert.equal(vm.loi, '')
  assert.equal(vm.thongBao, '')
})

test('Giỏ mẫu được tạo độc lập cho mỗi lần khởi tạo', () => {
  const first = taoGioMau()
  const second = taoGioMau()
  first[0].soLuong = 99
  assert.equal(second[0].soLuong, 2)
  assert.notEqual(first, second)
})
