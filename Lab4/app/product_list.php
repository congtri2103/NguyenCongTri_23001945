<?php
declare(strict_types=1);

require_once __DIR__ . '/model/product.php';

$products = getAllProducts();
$messages = [
    'added' => 'Thêm sản phẩm thành công.',
    'updated' => 'Cập nhật sản phẩm thành công.',
    'deleted' => 'Xóa sản phẩm thành công.',
];
$notice = $messages[$_GET['message'] ?? ''] ?? '';
$pageTitle = 'Danh sách sản phẩm';

require __DIR__ . '/view/header.php';
?>
<?php if ($notice !== ''): ?>
    <p class="notice"><?= h($notice) ?></p>
<?php endif; ?>

<p><a class="button" href="product_add.php">Thêm sản phẩm</a></p>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Chức năng</th>
        </tr>
    </thead>
    <tbody>
        <?php if ($products === []): ?>
            <tr><td colspan="5">Chưa có sản phẩm.</td></tr>
        <?php else: ?>
            <?php foreach ($products as $product): ?>
                <tr>
                    <td><?= h($product['id']) ?></td>
                    <td><?= h($product['name']) ?></td>
                    <td><?= number_format((float) $product['price'], 2, ',', '.') ?> đ</td>
                    <td><?= h($product['quantity']) ?></td>
                    <td class="actions">
                        <a href="product_edit.php?id=<?= h($product['id']) ?>">Sửa</a>
                        <a href="product_delete.php?id=<?= h($product['id']) ?>">Xóa</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
    </tbody>
</table>
<?php require __DIR__ . '/view/footer.php'; ?>
