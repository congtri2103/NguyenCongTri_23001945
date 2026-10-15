<?php
declare(strict_types=1);

require_once __DIR__ . '/../model/user.php';
require_once __DIR__ . '/csrf.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'httponly' => true,
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'samesite' => 'Lax',
    ]);
    session_start();
}

/** @return array{id: int, username: string}|null */
function currentUser(): ?array
{
    $user = $_SESSION['user'] ?? null;

    return is_array($user) && isset($user['id'], $user['username']) ? $user : null;
}

function loginUser(string $username, string $password): bool
{
    $user = getUserByUsername($username);
    if ($user === null || !password_verify($password, $user['password_hash'])) {
        return false;
    }

    session_regenerate_id(true);
    $_SESSION['user'] = [
        'id' => (int) $user['id'],
        'username' => (string) $user['username'],
    ];

    return true;
}

function logoutUser(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $parameters = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $parameters['path'], $parameters['domain'],
            $parameters['secure'], $parameters['httponly']);
    }
    session_destroy();
}

function requireAuth(): void
{
    if (currentUser() === null) {
        header('Location: login.php?message=required');
        exit;
    }
}

function requireGuest(): void
{
    if (currentUser() !== null) {
        header('Location: product_list.php');
        exit;
    }
}
