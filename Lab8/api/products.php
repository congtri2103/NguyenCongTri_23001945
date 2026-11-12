<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

require_once __DIR__ . '/config.php';

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}

function readProduct(): array
{
    try {
        $input = json_decode(file_get_contents('php://input'), false, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $error) {
        respond(400, ['success' => false, 'message' => 'Nội dung JSON không hợp lệ.']);
    }

    if (!is_object($input)) {
        respond(400, ['success' => false, 'message' => 'Gửi một đối tượng JSON gồm name, price và stock.']);
    }

    if (!isset($input->name) || !is_string($input->name)) {
        respond(422, ['success' => false, 'message' => 'Tên sản phẩm phải là chuỗi từ 1 đến 100 ký tự.']);
    }

    // Đếm ký tự Unicode để tên tiếng Việt không bị tính theo số byte.
    $name = preg_replace('/^[\s\p{Z}]+|[\s\p{Z}]+$/u', '', $input->name);
    $length = preg_match_all('/./us', $name);
    if ($length < 1 || $length > 100) {
        respond(422, ['success' => false, 'message' => 'Tên sản phẩm sau khi bỏ khoảng trắng phải có từ 1 đến 100 ký tự.']);
    }

    if (!isset($input->price) || !is_int($input->price) || $input->price <= 0 || $input->price > 2147483647) {
        respond(422, ['success' => false, 'message' => 'Đơn giá phải là số nguyên từ 1 đến 2.147.483.647 đồng.']);
    }

    if (!isset($input->stock) || !is_int($input->stock) || $input->stock < 0 || $input->stock > 2147483647) {
        respond(422, ['success' => false, 'message' => 'Số lượng tồn phải là số nguyên từ 0 đến 2.147.483.647.']);
    }

    return ['name' => $name, 'price' => $input->price, 'stock' => $input->stock];
}

function readId(): int
{
    $id = $_GET['id'] ?? null;
    if (!is_string($id) || !preg_match('/^[1-9][0-9]*$/D', $id) || strlen($id) > 10 || (int) $id > 2147483647) {
        respond(400, ['success' => false, 'message' => 'Mã sản phẩm trên URL phải là số nguyên dương hợp lệ.']);
    }
    return (int) $id;
}

$method = $_SERVER['REQUEST_METHOD'];
if (!in_array($method, ['GET', 'POST', 'PUT', 'DELETE'], true)) {
    header('Allow: GET, POST, PUT, DELETE');
    respond(405, ['success' => false, 'message' => 'Phương thức không được hỗ trợ.']);
}

// Kiểm tra toàn bộ dữ liệu trước khi kết nối và ghi vào MySQL.
$id = in_array($method, ['PUT', 'DELETE'], true) ? readId() : null;
$product = in_array($method, ['POST', 'PUT'], true) ? readProduct() : null;

try {
    $pdo = connectDatabase();
} catch (RuntimeException $error) {
    respond(503, ['success' => false, 'message' => databaseConnectionError($error)]);
}

try {
    switch ($method) {
        case 'GET':
            $products = $pdo->query('SELECT id, name, price, stock FROM products ORDER BY id')->fetchAll();
            // Một số thư viện PDO trả cột INT dưới dạng chuỗi: chuẩn hóa cho JSON/Vue.
            foreach ($products as &$row) {
                $row['id'] = (int) $row['id'];
                $row['price'] = (int) $row['price'];
                $row['stock'] = (int) $row['stock'];
            }
            unset($row);
            respond(200, ['success' => true, 'data' => $products]);

        case 'POST':
            $statement = $pdo->prepare('INSERT INTO products (name, price, stock) VALUES (:name, :price, :stock)');
            $statement->execute($product);
            respond(201, [
                'success' => true,
                'message' => 'Đã thêm sản phẩm.',
                'data' => ['id' => (int) $pdo->lastInsertId()] + $product,
            ]);

        case 'PUT':
            // Khóa dòng trong giao dịch: phân biệt không tồn tại với sửa không đổi dữ liệu.
            $pdo->beginTransaction();
            $statement = $pdo->prepare('SELECT id FROM products WHERE id = :id FOR UPDATE');
            $statement->execute(['id' => $id]);
            if (!$statement->fetch()) {
                $pdo->rollBack();
                respond(404, ['success' => false, 'message' => 'Sản phẩm không tồn tại.']);
            }
            $statement = $pdo->prepare('UPDATE products SET name = :name, price = :price, stock = :stock WHERE id = :id');
            $statement->execute($product + ['id' => $id]);
            $pdo->commit();
            respond(200, ['success' => true, 'message' => 'Đã cập nhật sản phẩm.', 'data' => ['id' => $id] + $product]);

        case 'DELETE':
            $statement = $pdo->prepare('DELETE FROM products WHERE id = :id');
            $statement->execute(['id' => $id]);
            if ($statement->rowCount() === 0) {
                respond(404, ['success' => false, 'message' => 'Sản phẩm không tồn tại.']);
            }
            respond(200, ['success' => true, 'message' => 'Đã xóa sản phẩm.']);
    }
} catch (PDOException $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    respond(500, ['success' => false, 'message' => 'Không thể thực hiện thao tác với cơ sở dữ liệu. Kiểm tra bảng products.']);
}
