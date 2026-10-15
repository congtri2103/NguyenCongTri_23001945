#!/bin/sh

XAMPP_PHP="/Applications/XAMPP/xamppfiles/bin/php"

if [ ! -x "$XAMPP_PHP" ]; then
    echo "Không tìm thấy PHP của XAMPP tại: $XAMPP_PHP"
    exit 1
fi

if ! "$XAMPP_PHP" -m | grep -qi '^mysqli$'; then
    echo "PHP của XAMPP chưa bật extension mysqli."
    exit 1
fi

echo "Đang chạy tại http://localhost:8000"
echo "Nhấn Ctrl+C để dừng server."
exec "$XAMPP_PHP" -S localhost:8000 -t app
