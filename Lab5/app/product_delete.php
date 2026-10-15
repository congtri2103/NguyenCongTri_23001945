<?php
declare(strict_types=1);

require_once __DIR__ . '/model/product.php';
require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/csrf.php';

requireAuth();

$id = $_SERVER['REQUEST_METHOD'] === 'POST'
    ? filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT)
    : filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$product = $id && $id > 0 ? getProductById($id) : null;

if ($product === null) {
    http_response_code(404);
    $pageTitle = 'Không tìm thấy sản phẩm';
    require __DIR__ . '/view/header.php';
    echo '<p class="error">Sản phẩm không tồn tại hoặc đã bị xóa.</p>';
    echo '<p><a href="product_list.php">Quay lại danh sách</a></p>';
    require __DIR__ . '/view/footer.php';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isValidCsrfToken($_POST['csrf_token'] ?? null)) {
        http_response_code(403);
        $pageTitle = 'Yêu cầu không hợp lệ';
        require __DIR__ . '/view/header.php';
        echo '<p class="error">Phiên làm việc không hợp lệ. Vui lòng quay lại và thử lần nữa.</p>';
        echo '<p><a href="product_list.php">Quay lại danh sách</a></p>';
        require __DIR__ . '/view/footer.php';
        exit;
    }

    if (deleteProduct((int) $id)) {
        header('Location: product_list.php?message=deleted');
        exit;
    }
}

$pageTitle = 'Xác nhận xóa sản phẩm';
require __DIR__ . '/view/header.php';
?>
<p>Bạn có chắc chắn muốn xóa sản phẩm <strong><?= h($product['name']) ?></strong> không?</p>
<form method="post" action="product_delete.php">
    <input type="hidden" name="id" value="<?= h($product['id']) ?>">
    <input type="hidden" name="csrf_token" value="<?= h(csrfToken()) ?>">
    <button class="button-danger" type="submit">Xác nhận xóa</button>
    <a class="button button-secondary" href="product_list.php">Hủy</a>
</form>
<?php require __DIR__ . '/view/footer.php'; ?>
