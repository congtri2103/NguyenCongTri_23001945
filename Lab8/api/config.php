<?php
declare(strict_types=1);

// Đọc cấu hình từ biến môi trường; không lưu mật khẩu trong mã nguồn.
function connectDatabase(): PDO
{
    if (!in_array('mysql', PDO::getAvailableDrivers(), true)) {
        throw new RuntimeException('PHP chưa bật tiện ích pdo_mysql. Xem README.md để cài đặt.');
    }

    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: '3306';
    $database = getenv('DB_NAME') ?: 'lab8';
    $user = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS');
    $socket = getenv('DB_SOCKET');
    $dsn = $socket !== false && $socket !== ''
        ? "mysql:unix_socket={$socket};dbname={$database};charset=utf8mb4"
        : "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";

    return new PDO(
        $dsn,
        $user,
        $password === false ? '' : $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
}

function databaseConnectionError(RuntimeException $error): string
{
    if (!$error instanceof PDOException) {
        return $error->getMessage();
    }

    // Chỉ trả nguyên nhân và cách xử lý, không tiết lộ cấu hình hay mật khẩu.
    return match ((int) ($error->errorInfo[1] ?? 0)) {
        1044 => 'Tài khoản MySQL chưa có quyền truy cập cơ sở dữ liệu. Kiểm tra DB_USER và quyền trên DB_NAME.',
        1045 => 'MySQL từ chối đăng nhập. Kiểm tra DB_USER và nhập lại đúng mật khẩu MySQL khi chạy start.sh.',
        1049 => 'Chưa có cơ sở dữ liệu. Chạy mysql -u root -p < database.sql tại thư mục Lab8.',
        2002, 2003 => 'Không kết nối được máy chủ MySQL. Kiểm tra máy chủ đang chạy, DB_HOST và DB_PORT.',
        2054 => 'Driver PHP chưa hỗ trợ phương thức đăng nhập của MySQL. Dừng máy chủ PHP cũ và chạy bash start.sh để nạp driver cục bộ; xem phần xử lý lỗi trong README.md.',
        default => 'Không kết nối được cơ sở dữ liệu. Kiểm tra MySQL, DB_USER, DB_PASS và nhập database.sql.',
    };
}
