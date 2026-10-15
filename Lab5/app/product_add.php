<?php
declare(strict_types=1);

require_once __DIR__ . '/model/product.php';
require_once __DIR__ . '/common/validation.php';
require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/csrf.php';

requireAuth();

$name = '';
$price = '';
$quantity = '';
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim((string) ($_POST['name'] ?? ''));
    $price = trim((string) ($_POST['price'] ?? ''));
    $quantity = trim((string) ($_POST['quantity'] ?? ''));
    $errors = validateProduct($name, $price, $quantity);

    if (!isValidCsrfToken($_POST['csrf_token'] ?? null)) {
        $errors['form'] = 'Phiên làm việc không hợp lệ. Vui lòng thử lại.';
    }

    if ($errors === []) {
        addProduct($name, (float) $price, (int) $quantity);
        header('Location: product_list.php?message=added');
        exit;
    }
}

$pageTitle = 'Thêm sản phẩm';
require __DIR__ . '/view/header.php';
?>
<form method="post" action="product_add.php" novalidate>
    <input type="hidden" name="csrf_token" value="<?= h(csrfToken()) ?>">
    <?php if (isset($errors['form'])): ?><p class="error error-box"><?= h($errors['form']) ?></p><?php endif; ?>
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
    <button type="submit">Lưu sản phẩm</button>
    <a class="button button-secondary" href="product_list.php">Hủy</a>
</form>
<?php require __DIR__ . '/view/footer.php'; ?>
