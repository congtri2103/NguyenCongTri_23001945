<?php
declare(strict_types=1);

/**
 * Tạo và dùng lại một kết nối MySQL trong suốt request hiện tại.
 * Có thể thay đổi cấu hình bằng các biến môi trường DB_HOST, DB_PORT,
 * DB_NAME, DB_USER và DB_PASS.
 */
function getDbConnection(): mysqli
{
    static $connection = null;

    if ($connection instanceof mysqli) {
        return $connection;
    }

    if (!extension_loaded('mysqli')) {
        http_response_code(500);
        exit(
            'PHP hiện tại chưa bật extension mysqli. '
            . 'Hãy chạy project bằng PHP của XAMPP: ./run.sh'
        );
    }

    $host = getenv('DB_HOST') ?: 'localhost';
    $port = (int) (getenv('DB_PORT') ?: 3306);
    $database = getenv('DB_NAME') ?: 'shopping_cart';
    $username = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS') ?: '';

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    try {
        $connection = new mysqli($host, $username, $password, $database, $port);
        $connection->set_charset('utf8mb4');
    } catch (mysqli_sql_exception $exception) {
        http_response_code(500);
        exit('Không thể kết nối cơ sở dữ liệu. Vui lòng kiểm tra cấu hình MySQL.');
    }

    return $connection;
}
