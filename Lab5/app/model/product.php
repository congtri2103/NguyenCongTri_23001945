<?php
declare(strict_types=1);

require_once __DIR__ . '/../common/dbConnect.php';

/** @return array<int, array{id: int, name: string, price: string, quantity: int}> */
function getAllProducts(): array
{
    $result = getDbConnection()->query(
        'SELECT id, name, price, quantity FROM products ORDER BY id DESC'
    );

    return $result->fetch_all(MYSQLI_ASSOC);
}

/** @return array{id: int, name: string, price: string, quantity: int}|null */
function getProductById(int $id): ?array
{
    $statement = getDbConnection()->prepare(
        'SELECT id, name, price, quantity FROM products WHERE id = ?'
    );
    $statement->bind_param('i', $id);
    $statement->execute();
    $product = $statement->get_result()->fetch_assoc();
    $statement->close();

    return $product ?: null;
}

function addProduct(string $name, float $price, int $quantity): bool
{
    $statement = getDbConnection()->prepare(
        'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)'
    );
    $statement->bind_param('sdi', $name, $price, $quantity);
    $success = $statement->execute();
    $statement->close();

    return $success;
}

function updateProduct(int $id, string $name, float $price, int $quantity): bool
{
    $statement = getDbConnection()->prepare(
        'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?'
    );
    $statement->bind_param('sdii', $name, $price, $quantity, $id);
    $success = $statement->execute();
    $statement->close();

    return $success;
}

function deleteProduct(int $id): bool
{
    $statement = getDbConnection()->prepare('DELETE FROM products WHERE id = ?');
    $statement->bind_param('i', $id);
    $statement->execute();
    $deleted = $statement->affected_rows > 0;
    $statement->close();

    return $deleted;
}
