<?php
declare(strict_types=1);

$pageTitle = $pageTitle ?? 'Quản lý sản phẩm';

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
        <nav><a href="product_list.php">Danh sách sản phẩm</a></nav>
    </header>
