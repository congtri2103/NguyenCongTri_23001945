<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';

header('Location: ' . (currentUser() === null ? 'login.php' : 'product_list.php'));
exit;
