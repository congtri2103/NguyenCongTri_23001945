<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/csrf.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isValidCsrfToken($_POST['csrf_token'] ?? null)) {
    http_response_code(405);
    header('Allow: POST');
    exit('Yêu cầu đăng xuất không hợp lệ.');
}

logoutUser();
header('Location: login.php');
exit;
