/* global Vue */
if (!window.Vue) {
    document.getElementById('startup-error').hidden = false;
} else {
    Vue.createApp({
        data() {
            return {
                products: [],
                form: { name: '', price: '', stock: 0 },
                editingId: null,
                deletingId: null,
                loading: false,
                loaded: false,
                saving: false,
                error: '',
                message: '',
            };
        },
        computed: {
            busy() {
                return this.loading || this.saving || this.deletingId !== null;
            },
        },
        mounted() {
            this.loadProducts();
        },
        methods: {
            formatPrice(price) {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
            },
            async request(method = 'GET', id = null, product = null) {
                const url = 'api/products.php' + (id === null ? '' : '?id=' + encodeURIComponent(id));
                const options = { method, headers: { Accept: 'application/json' }, cache: 'no-store' };
                if (product !== null) {
                    options.headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(product);
                }

                let response;
                try {
                    response = await fetch(url, options);
                } catch (error) {
                    throw new Error('Không kết nối được API. Kiểm tra máy chủ PHP rồi thử lại.');
                }
                let result;
                try {
                    result = await response.json();
                } catch (error) {
                    throw new Error('API không trả về JSON hợp lệ. Hãy mở trang bằng máy chủ PHP.');
                }
                if (!response.ok || result.success !== true) {
                    throw new Error(result.message || 'Thao tác không thành công. Vui lòng thử lại.');
                }
                return result;
            },
            async loadProducts() {
                this.loading = true;
                try {
                    const result = await this.request();
                    if (!Array.isArray(result.data)) {
                        throw new Error('Danh sách sản phẩm trả về không hợp lệ.');
                    }
                    this.products = result.data;
                    this.loaded = true;
                    return true;
                } catch (error) {
                    this.error = error.message;
                    return false;
                } finally {
                    this.loading = false;
                }
            },
            async refresh() {
                if (this.busy) return;
                this.error = '';
                this.message = '';
                await this.loadProducts();
            },
            resetForm() {
                this.editingId = null;
                this.form = { name: '', price: '', stock: 0 };
            },
            editProduct(product) {
                if (this.busy) return;
                this.error = '';
                this.message = '';
                this.editingId = product.id;
                this.form = { name: product.name, price: product.price, stock: product.stock };
                this.$nextTick(() => this.$refs.nameInput.focus());
            },
            cancelEdit() {
                this.resetForm();
                this.error = '';
                this.message = '';
            },
            async saveProduct() {
                if (this.busy) return;
                this.error = '';
                this.message = '';
                const product = { ...this.form, name: this.form.name.trim() };
                if ([...product.name].length < 1 || [...product.name].length > 100) {
                    this.error = 'Tên sản phẩm phải có từ 1 đến 100 ký tự sau khi bỏ khoảng trắng.';
                    return;
                }
                if (!Number.isInteger(product.price) || product.price <= 0 || product.price > 2147483647) {
                    this.error = 'Đơn giá phải là số nguyên từ 1 đến 2.147.483.647 đồng.';
                    return;
                }
                if (!Number.isInteger(product.stock) || product.stock < 0 || product.stock > 2147483647) {
                    this.error = 'Số lượng tồn phải là số nguyên từ 0 đến 2.147.483.647.';
                    return;
                }

                this.saving = true;
                try {
                    const method = this.editingId === null ? 'POST' : 'PUT';
                    const result = await this.request(method, this.editingId, product);
                    this.message = result.message;
                    this.resetForm();
                    await this.loadProducts();
                } catch (error) {
                    this.error = error.message;
                } finally {
                    this.saving = false;
                }
            },
            async deleteProduct(product) {
                if (this.busy) return;
                if (!window.confirm('Bạn có chắc muốn xóa sản phẩm “' + product.name + '”?')) return;

                this.error = '';
                this.message = '';
                this.deletingId = product.id;
                try {
                    const result = await this.request('DELETE', product.id);
                    this.message = result.message;
                    if (this.editingId === product.id) this.resetForm();
                    await this.loadProducts();
                } catch (error) {
                    this.error = error.message;
                } finally {
                    this.deletingId = null;
                }
            },
        },
    }).mount('#app');
}
