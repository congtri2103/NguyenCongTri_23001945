<?php
declare(strict_types=1);

require_once __DIR__ . '/../common/dbConnect.php';

/**
 * Tự bổ sung bảng tài khoản khi nâng cấp từ phiên bản Bài 4 cũ.
 * CREATE TABLE IF NOT EXISTS giữ nguyên mọi tài khoản đã có.
 */
function ensureUsersTableExists(): void
{
    static $initialized = false;

    if ($initialized) {
        return;
    }

    getDbConnection()->query(
        'CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )'
    );
    $initialized = true;
}

/** @return array{id: int, username: string, password_hash: string}|null */
function getUserByUsername(string $username): ?array
{
    ensureUsersTableExists();

    $statement = getDbConnection()->prepare(
        'SELECT id, username, password_hash FROM users WHERE username = ?'
    );
    $statement->bind_param('s', $username);
    $statement->execute();
    $user = $statement->get_result()->fetch_assoc();
    $statement->close();

    return $user ?: null;
}

function addUser(string $username, string $password): bool
{
    ensureUsersTableExists();

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $statement = getDbConnection()->prepare(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)'
    );
    $statement->bind_param('ss', $username, $passwordHash);

    try {
        return $statement->execute();
    } catch (mysqli_sql_exception $exception) {
        if ($exception->getCode() === 1062) {
            return false;
        }

        throw $exception;
    } finally {
        $statement->close();
    }
}
