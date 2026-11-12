SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS lab8
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE lab8;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL,
    CONSTRAINT chk_products_price CHECK (price > 0),
    CONSTRAINT chk_products_stock CHECK (stock >= 0)
) ENGINE=InnoDB;

-- Có thể chạy lại file mà không xóa dữ liệu hoặc thêm trùng sản phẩm mẫu.
INSERT INTO products (name, price, stock)
SELECT 'Bút bi', 5000, 20
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bút bi');

INSERT INTO products (name, price, stock)
SELECT 'Vở ô ly', 12000, 15
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vở ô ly');

INSERT INTO products (name, price, stock)
SELECT 'Thước kẻ', 8000, 0
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Thước kẻ');
