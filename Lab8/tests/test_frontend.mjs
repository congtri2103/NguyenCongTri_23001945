// Kiểm thử logic Vue với API thật; không thay thế kiểm tra DOM trên trình duyệt.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const baseUrl = process.env.APP_URL || 'http://127.0.0.1:8000/';
const calls = [];
const createdIds = new Set();
let definition;
let confirmed = false;
let failure = null;
let focused = 0;
let checks = 0;

function passed(message) {
    checks += 1;
    console.log('PASS:', message);
}

const sandbox = {
    window: { Vue: true, confirm: () => confirmed },
    Vue: {
        createApp(options) {
            definition = options;
            return { mount() {} };
        },
    },
    async fetch(relativeUrl, options) {
        const url = new URL(relativeUrl, baseUrl);
        calls.push({ method: options.method, url, body: options.body });
        if (failure === 'network') throw new TypeError('Test network failure');
        if (failure === 'json') return new Response('<html>Test error</html>');
        const response = await fetch(url, options);
        if (options.method === 'POST' && response.ok) {
            createdIds.add((await response.clone().json()).data.id);
        }
        return response;
    },
};

vm.runInNewContext(await readFile(new URL('../assets/app.js', import.meta.url), 'utf8'), sandbox);

function createInstance() {
    const app = definition.data();
    app.$nextTick = callback => callback();
    app.$refs = { nameInput: { focus() { focused += 1; } } };
    for (const [name, method] of Object.entries(definition.methods)) app[name] = method.bind(app);
    Object.defineProperty(app, 'busy', { get: definition.computed.busy.bind(app) });
    return app;
}

function json(value) {
    return JSON.parse(JSON.stringify(value));
}

try {
    const app = createInstance();
    let firstLoad;
    const load = app.loadProducts;
    app.loadProducts = () => (firstLoad = load());
    definition.mounted.call(app);
    await firstLoad;
    assert.equal(app.loaded, true);
    assert.equal(calls.at(-1).method, 'GET');
    const baseline = json(app.products);
    passed('mở ứng dụng tự gọi GET và lưu danh sách');

    const marker = 'Vue test ' + randomUUID().slice(0, 8);
    app.form = { name: '  ' + marker + '  ', price: 6000, stock: 2 };
    let start = calls.length;
    await app.saveProduct();
    assert.equal(app.error, '');
    assert.deepEqual(calls.slice(start).map(call => call.method), ['POST', 'GET']);
    let product = app.products.find(row => row.name === marker);
    assert.ok(product);
    assert.equal(app.form.name, '');
    passed('chế độ thêm gửi POST rồi GET, bỏ khoảng trắng và xóa biểu mẫu sau khi lưu');

    app.editProduct(product);
    assert.equal(app.editingId, product.id);
    assert.equal(app.form.price, 6000);
    assert.equal(focused, 1);
    app.form.price = 7500;
    app.form.stock = 0;
    start = calls.length;
    await app.saveProduct();
    assert.equal(app.error, '');
    assert.deepEqual(calls.slice(start).map(call => call.method), ['PUT', 'GET']);
    assert.equal(calls[start].url.searchParams.get('id'), String(product.id));
    product = app.products.find(row => row.id === product.id);
    assert.equal(product.price, 7500);
    assert.equal(product.stock, 0);
    assert.equal(app.editingId, null);
    passed('Sửa đưa dữ liệu vào form, gửi PUT đúng ID và hiển thị giá/tồn mới');

    const reloaded = createInstance();
    await reloaded.loadProducts();
    assert.equal(reloaded.products.find(row => row.id === product.id).price, 7500);
    passed('instance mới đọc lại được sản phẩm và giá đã lưu');

    confirmed = false;
    start = calls.length;
    await app.deleteProduct(product);
    assert.equal(calls.length, start);
    assert.ok(app.products.some(row => row.id === product.id));
    passed('hủy xác nhận không gửi DELETE hoặc thay đổi danh sách');

    app.editProduct(product);
    confirmed = true;
    start = calls.length;
    await app.deleteProduct(product);
    assert.equal(app.error, '');
    assert.deepEqual(calls.slice(start).map(call => call.method), ['DELETE', 'GET']);
    assert.equal(calls[start].url.searchParams.get('id'), String(product.id));
    assert.equal(app.products.some(row => row.id === product.id), false);
    assert.equal(app.editingId, null);
    createdIds.delete(product.id);
    await reloaded.loadProducts();
    assert.equal(reloaded.products.some(row => row.id === product.id), false);
    passed('đồng ý xóa gửi DELETE đúng ID rồi GET; instance khác đọc lại không còn');

    app.form = { name: marker, price: 5000, stock: -1 };
    start = calls.length;
    await app.saveProduct();
    assert.ok(app.error);
    assert.equal(calls.length, start);
    passed('biểu mẫu chặn tồn âm trước khi gửi');

    const absentId = Math.max(0, ...baseline.map(row => row.id), product.id) + 1;
    app.editingId = absentId;
    app.form = { name: marker, price: 5000, stock: 1 };
    await app.saveProduct();
    assert.ok(app.error.includes('không tồn tại'));
    assert.equal(app.editingId, absentId);
    assert.equal(app.form.name, marker);
    assert.equal(app.saving, false);
    passed('lỗi API được hiển thị và dữ liệu form được giữ để sửa lại');

    failure = 'network';
    await app.refresh();
    assert.ok(app.error.includes('Không kết nối được API'));
    assert.equal(app.loading, false);
    failure = 'json';
    await app.refresh();
    assert.ok(app.error.includes('JSON'));
    assert.equal(app.loading, false);
    passed('lỗi mạng và phản hồi không phải JSON đều được xử lý');

    failure = null;
    await app.refresh();
    assert.equal(app.error, '');
    assert.deepEqual(json(app.products), baseline);
    passed('Làm mới phục hồi sau lỗi; danh sách ban đầu được giữ nguyên');
    console.log(`Hoàn tất ${checks} nhóm kiểm tra logic Vue. Chưa kiểm tra DOM/trình duyệt.`);
} finally {
    for (const id of createdIds) {
        await fetch(new URL('api/products.php?id=' + id, baseUrl), { method: 'DELETE' });
    }
}
