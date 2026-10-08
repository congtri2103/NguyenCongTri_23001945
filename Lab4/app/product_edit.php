<?php
declare(strict_types=1);

require_once __DIR__ . '/model/product.php';
require_once __DIR__ . '/common/validation.php';

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
}

$product = $id && $id > 0 ? getProductById($id) : null;
if ($product === null) {
    http_response_code(404);
    $pageTitle = 'Không tìm thấy sản phẩm';
    require __DIR__ . '/view/header.php';
    echo '<p class="error">Sản phẩm không tồn tại hoặc mã sản phẩm không hợp lệ.</p>';
    echo '<p><a href="product_list.php">Quay lại danh sách</a></p>';
    require __DIR__ . '/view/footer.php';
    exit;
}

$name = (string) $product['name'];
$price = (string) $product['price'];
$quantity = (string) $product['quantity'];
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim((string) ($_POST['name'] ?? ''));
    $price = trim((string) ($_POST['price'] ?? ''));
    $quantity = trim((string) ($_POST['quantity'] ?? ''));
    $errors = validateProduct($name, $price, $quantity);

    if ($errors === []) {
        updateProduct((int) $id, $name, (float) $price, (int) $quantity);
        header('Location: product_list.php?message=updated');
        exit;
    }
}

$pageTitle = 'Sửa sản phẩm';
require __DIR__ . '/view/header.php';
?>
<form method="post" action="product_edit.php" novalidate>
    <input type="hidden" name="id" value="<?= h($id) ?>">
    <div class="form-group">
        <label for="name">Tên sản phẩm</label>
        <input id="name" name="name" type="text" maxlength="100" required value="<?= h($name) ?>">
        <?php if (isset($errors['name'])): ?><p class="error"><?= h($errors['name']) ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <label for="price">Giá</label>
        <input id="price" name="price" type="number" min="0.01" step="0.01" required value="<?= h($price) ?>">
        <?php if (isset($errors['price'])): ?><p class="error"><?= h($errors['price']) ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <label for="quantity">Số lượng</label>
        <input id="quantity" name="quantity" type="number" min="0" step="1" required value="<?= h($quantity) ?>">
        <?php if (isset($errors['quantity'])): ?><p class="error"><?= h($errors['quantity']) ?></p><?php endif; ?>
    </div>
    <button type="submit">Cập nhật</button>
    <a class="button button-secondary" href="product_list.php">Hủy</a>
</form>
<?php require __DIR__ . '/view/footer.php'; ?>
