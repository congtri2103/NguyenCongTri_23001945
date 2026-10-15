<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/csrf.php';

requireGuest();

$username = '';
$error = '';
$notice = ($_GET['message'] ?? '') === 'registered'
    ? 'Đăng ký thành công. Bạn có thể đăng nhập ngay.'
    : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string) ($_POST['username'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if (!isValidCsrfToken($_POST['csrf_token'] ?? null)) {
        $error = 'Phiên làm việc không hợp lệ. Vui lòng thử lại.';
    } elseif (!loginUser($username, $password)) {
        $error = 'Tên đăng nhập hoặc mật khẩu không đúng.';
    } else {
        header('Location: product_list.php?message=logged_in');
        exit;
    }
}

$pageTitle = 'Đăng nhập';
require __DIR__ . '/view/header.php';
?>
<?php if ($notice !== ''): ?><p class="notice"><?= h($notice) ?></p><?php endif; ?>
<?php if ($error !== ''): ?><p class="error error-box"><?= h($error) ?></p><?php endif; ?>
<form method="post" action="login.php">
    <input type="hidden" name="csrf_token" value="<?= h(csrfToken()) ?>">
    <div class="form-group">
        <label for="username">Tên đăng nhập</label>
        <input id="username" name="username" type="text" maxlength="50" autocomplete="username" required autofocus value="<?= h($username) ?>">
    </div>
    <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required>
    </div>
    <button type="submit">Đăng nhập</button>
    <a class="button button-secondary" href="register.php">Tạo tài khoản</a>
</form>
<?php require __DIR__ . '/view/footer.php'; ?>
