<?php
declare(strict_types=1);

// Không phục vụ các file nội bộ như dữ liệu MySQL, log và .git qua HTTP.
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/');
foreach (explode('/', $path) as $segment) {
    if (str_starts_with($segment, '.')) {
        http_response_code(404);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Không tìm thấy trang.';
        return true;
    }
}

return false;
