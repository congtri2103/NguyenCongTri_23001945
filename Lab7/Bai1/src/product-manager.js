// Options API: dữ liệu, computed, methods, watch và lifecycle mounted.
export default {
  data() {
    return {
      products: [
        { id: 1, name: 'Bàn phím cơ không dây', price: 890000, category: 'Điện tử', stock: 12 },
        { id: 2, name: 'Chuột không dây', price: 350000, category: 'Điện tử', stock: 24 },
        { id: 3, name: 'Tai nghe Bluetooth', price: 650000, category: 'Điện tử', stock: 0 },
        { id: 4, name: 'Sổ tay bìa cứng A5', price: 85000, category: 'Văn phòng phẩm', stock: 35 },
        { id: 5, name: 'Bộ bút gel 6 màu', price: 45000, category: 'Văn phòng phẩm', stock: 50 },
        { id: 6, name: 'Khay đựng tài liệu', price: 120000, category: 'Văn phòng phẩm', stock: 0 },
        { id: 7, name: 'Bình giữ nhiệt 500ml', price: 280000, category: 'Đồ gia dụng', stock: 18 },
        { id: 8, name: 'Đèn bàn đọc sách', price: 420000, category: 'Đồ gia dụng', stock: 8 },
        { id: 9, name: 'Chậu cây để bàn', price: 95000, category: 'Đồ gia dụng', stock: 15 },
      ],
      categories: ['Điện tử', 'Văn phòng phẩm', 'Đồ gia dụng'],
      keyword: '',
      selectedCategory: '',
      sortOrder: '',
      keywordNotice: '',
      pageStatus: 'Đang tải',
      form: { name: '', price: '', category: 'Điện tử', stock: 0 },
      errors: {},
      feedback: '',
      pendingDelete: null,
      nextId: 10,
    }
  },

  computed: {
    // filter() tạo mảng mới; sort() chỉ sắp xếp bản sao, giữ nguyên mảng gốc.
    visibleProducts() {
      const keyword = this.keyword.trim().toLocaleLowerCase('vi')
      const result = this.products.filter((product) => {
        const matchesName = product.name.toLocaleLowerCase('vi').includes(keyword)
        const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory
        return matchesName && matchesCategory
      })

      if (this.sortOrder === 'asc') return [...result].sort((a, b) => a.price - b.price)
      if (this.sortOrder === 'desc') return [...result].sort((a, b) => b.price - a.price)
      return result
    },
    visibleCount() {
      return this.visibleProducts.length
    },
    totalCount() {
      return this.products.length
    },
    inventoryValue() {
      return this.visibleProducts.reduce((sum, product) => sum + product.price * product.stock, 0)
    },
    inventoryCount() {
      return this.visibleProducts.reduce((sum, product) => sum + product.stock, 0)
    },
    outOfStockCount() {
      return this.visibleProducts.filter((product) => product.stock === 0).length
    },
    hasFilters() {
      return Boolean(this.keyword || this.selectedCategory || this.sortOrder)
    },
  },

  watch: {
    keyword(value) {
      this.keywordNotice = Array.from(value).length === 1
        ? 'Từ khóa chỉ có 1 ký tự. Nhập thêm để tìm kiếm cụ thể hơn.'
        : ''
    },
  },

  mounted() {
    this.pageStatus = 'Sẵn sàng'
  },

  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
    },
    formatNumber(value) {
      return new Intl.NumberFormat('vi-VN').format(value)
    },
    productCode(id) {
      return `SP${String(id).padStart(3, '0')}`
    },
    categoryClass(category) {
      return { 'Điện tử': 'electronics', 'Văn phòng phẩm': 'stationery', 'Đồ gia dụng': 'household' }[category]
    },
    categoryIcon(category) {
      return { 'Điện tử': 'monitor', 'Văn phòng phẩm': 'pen', 'Đồ gia dụng': 'home' }[category]
    },
    resetFilters() {
      this.keyword = ''
      this.selectedCategory = ''
      this.sortOrder = ''
    },
    focusForm() {
      this.$refs.productName?.focus()
    },
    resetForm() {
      this.form = { name: '', price: '', category: 'Điện tử', stock: 0 }
      this.errors = {}
    },
    addProduct() {
      const name = this.form.name.trim()
      const price = Number(this.form.price)
      const stock = Number(this.form.stock)
      const errors = {}

      if (!name) errors.name = 'Vui lòng nhập tên sản phẩm.'
      if (!Number.isFinite(price) || price <= 0) errors.price = 'Giá phải là một số lớn hơn 0.'
      if (String(this.form.stock).trim() === '' || !Number.isSafeInteger(stock) || stock < 0) {
        errors.stock = 'Tồn kho phải là số nguyên không âm.'
      }
      if (!this.categories.includes(this.form.category)) errors.category = 'Vui lòng chọn danh mục hợp lệ.'
      if (Number.isFinite(price) && Number.isFinite(stock) && !Number.isFinite(price * stock)) {
        errors.price = 'Giá trị tồn kho quá lớn. Vui lòng giảm giá hoặc số lượng.'
      }

      this.errors = errors
      this.feedback = ''
      if (Object.keys(errors).length) return false

      this.products.push({ id: this.nextId++, name, price, category: this.form.category, stock })
      this.resetForm()
      this.feedback = `Đã thêm “${name}”.${this.hasFilters ? ' Sản phẩm hiển thị khi phù hợp với bộ lọc hiện tại.' : ''}`
      return true
    },
    requestDelete(product) {
      this.pendingDelete = product
      this.$refs.deleteDialog.showModal()
    },
    cancelDelete() {
      this.$refs.deleteDialog.close()
      this.pendingDelete = null
    },
    confirmDelete() {
      if (!this.pendingDelete) return
      const product = this.pendingDelete
      this.products = this.products.filter((item) => item.id !== product.id)
      this.feedback = `Đã xóa “${product.name}”.`
      this.cancelDelete()
    },
  },
}
