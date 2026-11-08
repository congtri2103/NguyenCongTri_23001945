import test from 'node:test'
import assert from 'node:assert/strict'
import { createRenderer, h, nextTick } from 'vue'
import productManager from '../src/product-manager.js'

// Mount thật bằng Vue để kiểm tra cả computed, watcher và mounted,
// dùng renderer tối giản để chạy trực tiếp trong Node, không cần trình duyệt.
const renderer = createRenderer({
  createElement: () => ({ open: false, showModal() { this.open = true }, close() { this.open = false } }),
  createText: (text) => ({ text }),
  createComment: (text) => ({ text }),
  insert() {}, remove() {}, setText() {}, setElementText() {}, patchProp() {},
  parentNode: () => null, nextSibling: () => null,
})

function setup(t) {
  const app = renderer.createApp({ ...productManager, render: () => h('dialog', { ref: 'deleteDialog' }) })
  const vm = app.mount({})
  t.after(() => app.unmount())
  return vm
}

test('Dữ liệu ban đầu có ít nhất 6 sản phẩm, 3 danh mục; mounted đặt Sẵn sàng', (t) => {
  const vm = setup(t)
  assert.ok(vm.products.length >= 6)
  assert.equal(new Set(vm.products.map((p) => p.category)).size, 3)
  assert.equal(vm.pageStatus, 'Sẵn sàng')
  assert.equal(vm.visibleCount, 9)
  assert.equal(vm.totalCount, 9)
  assert.equal(vm.inventoryValue, 34130000)
  assert.equal(vm.inventoryCount, 162)
  assert.equal(vm.outOfStockCount, 2)
})

test('Tìm kiếm không phân biệt hoa thường và bỏ khoảng trắng thừa ở hai đầu', (t) => {
  const vm = setup(t)
  vm.keyword = '  BÀN  '
  assert.deepEqual(vm.visibleProducts.map((p) => p.id), [1, 8, 9])
})

test('Kết hợp tìm kiếm, danh mục và sắp xếp; thống kê khớp kết quả', (t) => {
  const vm = setup(t)
  vm.keyword = 'BÀN'
  vm.selectedCategory = 'Đồ gia dụng'
  vm.sortOrder = 'asc'
  assert.deepEqual(vm.visibleProducts.map((p) => p.id), [9, 8])
  assert.equal(vm.visibleCount, 2)
  assert.equal(vm.totalCount, 9)
  assert.equal(vm.inventoryValue, 4785000)
  assert.equal(vm.inventoryCount, 23)
  vm.sortOrder = 'desc'
  assert.deepEqual(vm.visibleProducts.map((p) => p.id), [8, 9])
})

test('Sắp xếp tăng/giảm không làm đổi thứ tự mảng gốc', (t) => {
  const vm = setup(t)
  const originalIds = vm.products.map((p) => p.id)
  vm.sortOrder = 'asc'
  assert.deepEqual(vm.visibleProducts.map((p) => p.price), [...vm.products].map((p) => p.price).sort((a, b) => a - b))
  vm.sortOrder = 'desc'
  assert.deepEqual(vm.visibleProducts.map((p) => p.price), [...vm.products].map((p) => p.price).sort((a, b) => b - a))
  assert.deepEqual(vm.products.map((p) => p.id), originalIds)
  vm.sortOrder = ''
  assert.deepEqual(vm.visibleProducts.map((p) => p.id), originalIds)
})

test('Không có kết quả: số hiển thị, tồn kho, giá trị tồn đều bằng 0', (t) => {
  const vm = setup(t)
  vm.keyword = 'không có sản phẩm này'
  assert.equal(vm.visibleCount, 0)
  assert.equal(vm.totalCount, 9)
  assert.equal(vm.inventoryValue, 0)
  assert.equal(vm.inventoryCount, 0)
  assert.equal(vm.outOfStockCount, 0)
})

test('watch thông báo khi đúng 1 ký tự, xóa khi rỗng hoặc có từ 2 ký tự', async (t) => {
  const vm = setup(t)
  for (const [keyword, expected] of [['a', true], ['ab', false], ['đ', true], ['', false], ['😀', true], ['😀a', false]]) {
    vm.keyword = keyword
    await nextTick()
    assert.equal(Boolean(vm.keywordNotice), expected, `keyword: ${keyword}`)
  }
})

test('Từ chối tên rỗng, giá không dương và tồn kho không hợp lệ', (t) => {
  const vm = setup(t)
  vm.form = { name: '   ', price: 0, category: 'Điện tử', stock: -1 }
  assert.equal(vm.addProduct(), false)
  assert.deepEqual(Object.keys(vm.errors).sort(), ['name', 'price', 'stock'])
  for (const stock of ['', ' ', -1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    vm.form = { name: 'Sản phẩm mới', price: 10000, category: 'Điện tử', stock }
    assert.equal(vm.addProduct(), false)
    assert.ok(vm.errors.stock)
  }
  for (const price of ['', ' ', 0, -1, Infinity, NaN, 'không phải số']) {
    vm.form = { name: 'Sản phẩm mới', price, category: 'Điện tử', stock: 1 }
    assert.equal(vm.addProduct(), false)
    assert.ok(vm.errors.price)
  }
  assert.equal(vm.totalCount, 9)
})

test('Thêm sản phẩm hợp lệ, trim tên, chuyển số và reset biểu mẫu', (t) => {
  const vm = setup(t)
  vm.form = { name: '  Sổ mới  ', price: '50000', category: 'Văn phòng phẩm', stock: '3' }
  assert.equal(vm.addProduct(), true)
  assert.deepEqual(vm.products.at(-1), { id: 10, name: 'Sổ mới', price: 50000, category: 'Văn phòng phẩm', stock: 3 })
  assert.equal(vm.totalCount, 10)
  assert.equal(vm.inventoryValue, 34280000)
  assert.equal(vm.form.name, '')
  assert.deepEqual(vm.errors, {})
})

test('Chấp nhận tồn kho bằng 0; thêm dưới bộ lọc giữ thống kê chính xác', (t) => {
  const vm = setup(t)
  vm.keyword = 'Sổ'
  vm.selectedCategory = 'Văn phòng phẩm'
  vm.sortOrder = 'desc'
  vm.form = { name: 'Bàn mới', price: 10000, category: 'Đồ gia dụng', stock: 0 }
  assert.equal(vm.addProduct(), true)
  assert.equal(vm.visibleCount, 1)
  assert.equal(vm.totalCount, 10)
  assert.equal(vm.inventoryValue, 2975000)
  vm.form = { name: 'Sổ mới', price: 100000, category: 'Văn phòng phẩm', stock: 0 }
  assert.equal(vm.addProduct(), true)
  assert.deepEqual(vm.visibleProducts.map((p) => p.name), ['Sổ mới', 'Sổ tay bìa cứng A5'])
  assert.equal(vm.outOfStockCount, 1)
  assert.equal(vm.inventoryValue, 2975000)
})

test('Chỉ xóa sau xác nhận; hủy không xóa; ID không trùng sau khi thêm lại', (t) => {
  const vm = setup(t)
  const product = vm.products[0]
  vm.requestDelete(product)
  assert.equal(vm.$refs.deleteDialog.open, true)
  assert.equal(vm.totalCount, 9)
  vm.cancelDelete()
  assert.equal(vm.$refs.deleteDialog.open, false)
  assert.equal(vm.totalCount, 9)
  vm.requestDelete(product)
  vm.confirmDelete()
  assert.equal(vm.totalCount, 8)
  assert.equal(vm.products.some((p) => p.id === product.id), false)
  assert.equal(vm.inventoryValue, 23450000)
  assert.equal(vm.pendingDelete, null)
  vm.form = { name: 'Mới', price: 10000, category: 'Điện tử', stock: 1 }
  vm.addProduct()
  assert.equal(new Set(vm.products.map((p) => p.id)).size, vm.totalCount)
})

test('Xóa sản phẩm duy nhất đang lọc trả về thống kê rỗng', (t) => {
  const vm = setup(t)
  vm.keyword = 'Bàn phím'
  vm.requestDelete(vm.visibleProducts[0])
  vm.confirmDelete()
  assert.equal(vm.visibleCount, 0)
  assert.equal(vm.totalCount, 8)
  assert.equal(vm.inventoryValue, 0)
  vm.resetFilters()
  assert.equal(vm.visibleCount, 8)
  assert.equal(vm.hasFilters, false)
})

test('Xóa toàn bộ sản phẩm vẫn hiển thị thống kê 0 trên 0', (t) => {
  const vm = setup(t)
  for (const product of [...vm.products]) {
    vm.requestDelete(product)
    vm.confirmDelete()
  }
  assert.equal(vm.visibleCount, 0)
  assert.equal(vm.totalCount, 0)
  assert.equal(vm.inventoryValue, 0)
  assert.equal(vm.inventoryCount, 0)
})
