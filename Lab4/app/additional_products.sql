USE shopping_cart;

-- File này chỉ dùng để bổ sung dữ liệu cho database cũ đang có 5 sản phẩm.
-- Nếu đã import database.sql thì không cần chạy file này.
-- Điều kiện NOT EXISTS giúp tránh chèn trùng khi vô tình chạy lại file.
INSERT INTO products (name, price, quantity)
SELECT new_products.name, new_products.price, new_products.quantity
FROM (
    SELECT 'Laptop văn phòng' AS name, 15990000.00 AS price, 6 AS quantity
    UNION ALL SELECT 'Ổ cứng SSD 1TB', 1750000.00, 15
    UNION ALL SELECT 'USB 64GB', 180000.00, 30
    UNION ALL SELECT 'Loa Bluetooth', 780000.00, 9
    UNION ALL SELECT 'Giá đỡ laptop', 250000.00, 18
    UNION ALL SELECT 'Cáp HDMI 2 mét', 120000.00, 25
    UNION ALL SELECT 'Sạc dự phòng 20000mAh', 890000.00, 11
    UNION ALL SELECT 'Micro thu âm USB', 1250000.00, 7
    UNION ALL SELECT 'Ghế công thái học', 3490000.00, 4
    UNION ALL SELECT 'Bộ phát Wi-Fi', 950000.00, 13
) AS new_products
WHERE NOT EXISTS (
    SELECT 1
    FROM products
    WHERE products.name = new_products.name
);
