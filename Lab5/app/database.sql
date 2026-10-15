CREATE DATABASE IF NOT EXISTS shopping_cart
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE shopping_cart;

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Chỉ thêm dữ liệu mẫu khi bảng đang trống, tránh bị trùng khi import lại.
INSERT INTO products (name, price, quantity)
SELECT sample.name, sample.price, sample.quantity
FROM (
    SELECT 'Bàn phím cơ' AS name, 850000.00 AS price, 12 AS quantity
    UNION ALL SELECT 'Chuột không dây', 320000.00, 20
    UNION ALL SELECT 'Tai nghe Bluetooth', 690000.00, 8
    UNION ALL SELECT 'Màn hình 24 inch', 2890000.00, 5
    UNION ALL SELECT 'Webcam Full HD', 540000.00, 10
    UNION ALL SELECT 'Laptop văn phòng', 15990000.00, 6
    UNION ALL SELECT 'Ổ cứng SSD 1TB', 1750000.00, 15
    UNION ALL SELECT 'USB 64GB', 180000.00, 30
    UNION ALL SELECT 'Loa Bluetooth', 780000.00, 9
    UNION ALL SELECT 'Giá đỡ laptop', 250000.00, 18
    UNION ALL SELECT 'Cáp HDMI 2 mét', 120000.00, 25
    UNION ALL SELECT 'Sạc dự phòng 20000mAh', 890000.00, 11
    UNION ALL SELECT 'Micro thu âm USB', 1250000.00, 7
    UNION ALL SELECT 'Ghế công thái học', 3490000.00, 4
    UNION ALL SELECT 'Bộ phát Wi-Fi', 950000.00, 13
) AS sample
WHERE NOT EXISTS (SELECT 1 FROM products);
