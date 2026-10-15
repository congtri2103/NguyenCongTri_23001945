<?php
declare(strict_types=1);

$pageTitle = $pageTitle ?? 'Quản lý sản phẩm';
$loggedInUser = function_exists('currentUser') ? currentUser() : null;

function h(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= h($pageTitle) ?></title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<main class="container">
    <header class="page-header">
        <h1><?= h($pageTitle) ?></h1>
        <nav>
            <?php if ($loggedInUser !== null): ?>
                <a href="product_list.php">Danh sách sản phẩm</a>
                <span class="user-name">Xin chào, <?= h($loggedInUser['username']) ?></span>
                <form class="logout-form" method="post" action="logout.php">
                    <input type="hidden" name="csrf_token" value="<?= h(csrfToken()) ?>">
                    <button class="link-button" type="submit">Đăng xuất</button>
                </form>
            <?php else: ?>
                <a href="login.php">Đăng nhập</a>
                <a href="register.php">Đăng ký</a>
            <?php endif; ?>
        </nav>
    </header>
