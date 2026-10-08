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

INSERT INTO products (name, price, quantity) VALUES
    ('Bàn phím cơ', 850000.00, 12),
    ('Chuột không dây', 320000.00, 20),
    ('Tai nghe Bluetooth', 690000.00, 8),
    ('Màn hình 24 inch', 2890000.00, 5),
    ('Webcam Full HD', 540000.00, 10),
    ('Laptop văn phòng', 15990000.00, 6),
    ('Ổ cứng SSD 1TB', 1750000.00, 15),
    ('USB 64GB', 180000.00, 30),
    ('Loa Bluetooth', 780000.00, 9),
    ('Giá đỡ laptop', 250000.00, 18),
    ('Cáp HDMI 2 mét', 120000.00, 25),
    ('Sạc dự phòng 20000mAh', 890000.00, 11),
    ('Micro thu âm USB', 1250000.00, 7),
    ('Ghế công thái học', 3490000.00, 4),
    ('Bộ phát Wi-Fi', 950000.00, 13);
