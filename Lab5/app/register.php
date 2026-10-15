<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/csrf.php';

requireGuest();

$username = '';
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string) ($_POST['username'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');
    $passwordConfirmation = (string) ($_POST['password_confirmation'] ?? '');

    if (!isValidCsrfToken($_POST['csrf_token'] ?? null)) {
        $errors['form'] = 'Phiên làm việc không hợp lệ. Vui lòng thử lại.';
    }
    if (!preg_match('/^[\p{L}\p{N}_.-]{3,50}$/u', $username)) {
        $errors['username'] = 'Tên đăng nhập dài 3–50 ký tự và chỉ gồm chữ, số, dấu chấm, gạch ngang hoặc gạch dưới.';
    } elseif (getUserByUsername($username) !== null) {
        $errors['username'] = 'Tên đăng nhập đã tồn tại.';
    }
    if (strlen($password) < 8) {
        $errors['password'] = 'Mật khẩu phải có ít nhất 8 ký tự.';
    } elseif ($password !== $passwordConfirmation) {
        $errors['password_confirmation'] = 'Mật khẩu nhập lại không khớp.';
    }

    if ($errors === []) {
        if (addUser($username, $password)) {
            header('Location: login.php?message=registered');
            exit;
        }
        $errors['username'] = 'Tên đăng nhập đã tồn tại.';
    }
}

$pageTitle = 'Đăng ký tài khoản';
require __DIR__ . '/view/header.php';
?>
<?php if (isset($errors['form'])): ?><p class="error error-box"><?= h($errors['form']) ?></p><?php endif; ?>
<form method="post" action="register.php" novalidate>
    <input type="hidden" name="csrf_token" value="<?= h(csrfToken()) ?>">
    <div class="form-group">
        <label for="username">Tên đăng nhập</label>
        <input id="username" name="username" type="text" minlength="3" maxlength="50" autocomplete="username" required autofocus value="<?= h($username) ?>">
        <?php if (isset($errors['username'])): ?><p class="error"><?= h($errors['username']) ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input id="password" name="password" type="password" minlength="8" autocomplete="new-password" required>
        <?php if (isset($errors['password'])): ?><p class="error"><?= h($errors['password']) ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <label for="password_confirmation">Nhập lại mật khẩu</label>
        <input id="password_confirmation" name="password_confirmation" type="password" minlength="8" autocomplete="new-password" required>
        <?php if (isset($errors['password_confirmation'])): ?><p class="error"><?= h($errors['password_confirmation']) ?></p><?php endif; ?>
    </div>
    <button type="submit">Đăng ký</button>
    <a class="button button-secondary" href="login.php">Đã có tài khoản</a>
</form>
<?php require __DIR__ . '/view/footer.php'; ?>
