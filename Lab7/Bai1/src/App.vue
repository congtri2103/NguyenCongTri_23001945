<script>
import productManager from './product-manager.js'
import AppIcon from './components/AppIcon.vue'

export default {
  ...productManager,
  components: { AppIcon },
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="./" aria-label="Kho nhỏ - Trang chủ">
        <span class="brand-icon"><AppIcon name="box" /></span>
        Kho nhỏ<span class="brand-period">.</span>
      </a>
      <span class="nav-current"><AppIcon name="grid" /> Quản lý sản phẩm</span>
      <span class="course-label">VUE 3 <span>/</span> BÀI THỰC HÀNH 01</span>
    </div>
  </header>

  <main class="workspace">
    <section class="page-heading" aria-labelledby="page-title">
      <div>
        <p class="eyebrow">GỌN GÀNG HƠN, DỄ QUẢN LÝ HƠN</p>
        <h1 id="page-title">Quản lý sản phẩm<span>.</span></h1>
        <p class="page-description">Một góc nhỏ để theo dõi sản phẩm và nắm rõ kho hàng của bạn.</p>
      </div>
      <span class="ready-status" role="status"><span class="status-dot"></span>{{ pageStatus }}</span>
    </section>

    <section class="stats-grid" aria-label="Thống kê theo bộ lọc hiện tại" aria-live="polite" aria-atomic="true">
      <article class="stat-card">
        <div class="stat-top"><span>Sản phẩm hiển thị</span><span class="stat-icon purple"><AppIcon name="box" /></span></div>
        <p class="stat-value" data-testid="product-count">{{ visibleCount }} <span>/ {{ totalCount }}</span></p>
        <p class="stat-caption">sản phẩm trong danh sách</p>
      </article>
      <article class="stat-card">
        <div class="stat-top"><span>Giá trị tồn kho</span><span class="stat-icon green"><AppIcon name="wallet" /></span></div>
        <p class="stat-value money" data-testid="inventory-value">{{ formatCurrency(inventoryValue) }}</p>
        <p class="stat-caption">Tổng giá × số lượng tồn theo bộ lọc</p>
      </article>
      <article class="stat-card">
        <div class="stat-top"><span>Số lượng tồn kho</span><span class="stat-icon orange"><AppIcon name="layers" /></span></div>
        <p class="stat-value" data-testid="inventory-count">{{ formatNumber(inventoryCount) }} <span>đơn vị</span></p>
        <p class="stat-caption"><span class="small-dot"></span>{{ outOfStockCount }} sản phẩm đã hết hàng trong danh sách</p>
      </article>
    </section>

    <div v-if="feedback" class="feedback" role="status">
      <AppIcon name="check" /><span>{{ feedback }}</span>
      <button type="button" class="icon-button" aria-label="Đóng thông báo" @click="feedback = ''"><AppIcon name="close" /></button>
    </div>

    <div class="content-grid">
      <section class="panel product-panel" aria-labelledby="list-title">
        <div class="panel-heading">
          <div class="title-with-count"><h2 id="list-title">Danh sách sản phẩm</h2><span class="count-pill">{{ totalCount }}</span></div>
          <button v-if="hasFilters" type="button" class="text-button" @click="resetFilters"><AppIcon name="reset" /> Đặt lại</button>
        </div>

        <div class="filters">
          <div class="search-field">
            <AppIcon name="search" />
            <input id="search" v-model="keyword" type="search" placeholder="Tìm theo tên sản phẩm…" aria-label="Tìm theo tên sản phẩm" :aria-describedby="keywordNotice ? 'keyword-notice' : undefined" autocomplete="off" />
          </div>
          <div class="select-field category-select">
            <select id="category-filter" v-model="selectedCategory" aria-label="Lọc theo danh mục">
              <option value="">Tất cả danh mục</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
            <AppIcon name="chevron" />
          </div>
          <div class="select-field sort-select">
            <select id="sort-order" v-model="sortOrder" aria-label="Sắp xếp theo giá">
              <option value="">Thứ tự ban đầu</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
            <AppIcon name="chevron" />
          </div>
        </div>
        <p v-if="keywordNotice" id="keyword-notice" class="keyword-notice" role="status"><AppIcon name="info" />{{ keywordNotice }}</p>

        <div class="table-scroll">
          <table>
            <caption class="sr-only">{{ visibleCount }} trên {{ totalCount }} sản phẩm phù hợp với tìm kiếm và bộ lọc.</caption>
            <thead>
              <tr><th scope="col">Sản phẩm</th><th scope="col">Danh mục</th><th scope="col" class="numeric">Đơn giá</th><th scope="col" class="numeric">Tồn kho</th><th scope="col">Trạng thái</th><th scope="col"><span class="sr-only">Thao tác</span></th></tr>
            </thead>
            <tbody>
              <tr v-for="product in visibleProducts" :key="product.id" :data-product-id="product.id">
                <td><div class="product-cell"><span class="product-icon" :class="categoryClass(product.category)"><AppIcon :name="categoryIcon(product.category)" /></span><div><span class="product-name">{{ product.name }}</span><span class="product-code">{{ productCode(product.id) }}</span></div></div></td>
                <td><span class="category-tag" :class="categoryClass(product.category)">{{ product.category }}</span></td>
                <td class="numeric price-cell">{{ formatCurrency(product.price) }}</td>
                <td class="numeric stock-cell" :class="{ 'zero-stock': product.stock === 0 }">{{ formatNumber(product.stock) }}</td>
                <td><span class="stock-badge" :class="product.stock > 0 ? 'in-stock' : 'out-of-stock'"><span class="status-dot"></span>{{ product.stock > 0 ? 'Còn hàng' : 'Hết hàng' }}</span></td>
                <td><button type="button" class="icon-button delete-button" :aria-label="`Xóa ${product.name}`" :title="`Xóa ${product.name}`" @click="requestDelete(product)"><AppIcon name="trash" /></button></td>
              </tr>
              <tr v-if="visibleCount === 0">
                <td colspan="6"><div class="empty-state"><span class="empty-icon"><AppIcon name="search" /></span><h3>Chưa tìm thấy sản phẩm</h3><p>Thử từ khóa khác hoặc thay đổi danh mục nhé.</p><button v-if="hasFilters" type="button" class="secondary-button" @click="resetFilters">Xóa bộ lọc</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-footer"><span>Hiển thị <strong>{{ visibleCount }}</strong> trên <strong>{{ totalCount }}</strong> sản phẩm</span><span class="filter-note"><AppIcon name="info" /> Thống kê cập nhật theo bộ lọc</span></div>
      </section>

      <aside class="panel form-panel" aria-labelledby="form-title">
        <div class="form-heading"><span class="form-heading-icon"><AppIcon name="plus" /></span><div><h2 id="form-title">Thêm sản phẩm</h2><p>Bổ sung một sản phẩm vào kho.</p></div></div>
        <form novalidate @submit.prevent="addProduct">
          <div class="form-field">
            <label for="product-name">Tên sản phẩm <span class="required">*</span></label>
            <input id="product-name" ref="productName" v-model="form.name" type="text" placeholder="Ví dụ: Sổ tay bìa cứng" required :aria-invalid="Boolean(errors.name)" :aria-describedby="errors.name ? 'name-error' : undefined" />
            <p v-if="errors.name" id="name-error" class="field-error" role="alert">{{ errors.name }}</p>
          </div>
          <div class="form-field">
            <label for="product-category">Danh mục <span class="required">*</span></label>
            <div class="select-field"><select id="product-category" v-model="form.category" required :aria-invalid="Boolean(errors.category)" :aria-describedby="errors.category ? 'category-error' : undefined"><option v-for="category in categories" :key="category" :value="category">{{ category }}</option></select><AppIcon name="chevron" /></div>
            <p v-if="errors.category" id="category-error" class="field-error" role="alert">{{ errors.category }}</p>
          </div>
          <div class="form-field">
            <label for="product-price">Đơn giá <span class="required">*</span></label>
            <div class="input-with-unit"><input id="product-price" v-model="form.price" type="number" min="0" step="any" inputmode="decimal" placeholder="0" required :aria-invalid="Boolean(errors.price)" :aria-describedby="errors.price ? 'price-error' : undefined" /><span>VNĐ</span></div>
            <p v-if="errors.price" id="price-error" class="field-error" role="alert">{{ errors.price }}</p>
          </div>
          <div class="form-field">
            <label for="product-stock">Số lượng tồn <span class="required">*</span></label>
            <input id="product-stock" v-model="form.stock" type="number" min="0" step="1" inputmode="numeric" required :aria-invalid="Boolean(errors.stock)" :aria-describedby="errors.stock ? 'stock-error' : undefined" />
            <p v-if="errors.stock" id="stock-error" class="field-error" role="alert">{{ errors.stock }}</p>
          </div>
          <button class="primary-button" type="submit"><AppIcon name="plus" /> Thêm sản phẩm</button>
          <button class="reset-form" type="button" @click="resetForm">Làm mới biểu mẫu</button>
        </form>
        <div class="form-tip"><AppIcon name="info" /><p>Sản phẩm mới sẽ xuất hiện khi phù hợp với bộ lọc đang chọn.</p></div>
      </aside>
    </div>

    <footer class="page-footer"><span><span class="footer-brand">Kho nhỏ.</span> Mọi sản phẩm, trong tầm tay.</span><span>Bài 01 <span class="footer-dot">·</span> Vue 3 Options API</span></footer>
  </main>

  <dialog ref="deleteDialog" class="delete-dialog" aria-labelledby="delete-title" aria-describedby="delete-description" @cancel.prevent="cancelDelete">
    <div class="dialog-icon"><AppIcon name="trash" /></div>
    <h2 id="delete-title">Xóa sản phẩm?</h2>
    <p id="delete-description">Bạn có chắc muốn xóa <strong>{{ pendingDelete?.name }}</strong> khỏi kho hàng? Thao tác này không thể hoàn tác.</p>
    <div class="dialog-actions"><button type="button" class="secondary-button" autofocus @click="cancelDelete">Hủy</button><button type="button" class="danger-button" @click="confirmDelete">Xác nhận xóa</button></div>
  </dialog>
</template>
