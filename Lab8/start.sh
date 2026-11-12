#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v php >/dev/null 2>&1; then
    echo "Chưa tìm thấy PHP. Hãy cài PHP 8.1 trở lên."
    exit 1
fi

PHP_COMMAND=(php)
LOCAL_PDO="$PROJECT_DIR/.runtime/pdo_mysql.so"
if [[ -f "$LOCAL_PDO" ]] && php -n -d "extension=$LOCAL_PDO" -r 'exit(in_array("mysql", PDO::getAvailableDrivers(), true) ? 0 : 1);' >/dev/null 2>&1; then
    PHP_COMMAND=(php -n -d "extension=$LOCAL_PDO")
    echo "Đang dùng driver PDO MySQL cục bộ."
fi

if ! "${PHP_COMMAND[@]}" -r 'exit(in_array("mysql", PDO::getAvailableDrivers(), true) ? 0 : 1);'; then
    echo "PHP chưa bật pdo_mysql. Với PHP MacPorts trên máy này, chạy:"
    echo "  sudo port install php83-mysql"
    echo "Sau đó kiểm tra: php -m | grep pdo_mysql"
    exit 1
fi

DATABASE_PID=''
PHP_PID=''
cleanup() {
    trap - EXIT INT TERM
    if [[ -n "$PHP_PID" ]] && kill -0 "$PHP_PID" 2>/dev/null; then
        kill -TERM "$PHP_PID" 2>/dev/null || true
        wait "$PHP_PID" 2>/dev/null || true
    fi
    if [[ -n "$DATABASE_PID" ]] && kill -0 "$DATABASE_PID" 2>/dev/null; then
        kill -TERM "$DATABASE_PID" 2>/dev/null || true
        wait "$DATABASE_PID" 2>/dev/null || true
    fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

case "${DB_MODE:-local}" in
local)
    MYSQL_SERVER="${MYSQL_SERVER:-/usr/local/mysql/bin/mysqld}"
    MYSQL_CLIENT="${MYSQL_CLIENT:-/usr/local/mysql/bin/mysql}"
    if [[ ! -x "$MYSQL_SERVER" || ! -x "$MYSQL_CLIENT" ]]; then
        echo "Chưa tìm thấy MySQL. Đặt MYSQL_SERVER và MYSQL_CLIENT trỏ tới mysqld và mysql của MySQL."
        exit 1
    fi
    case "$("$MYSQL_SERVER" --version)" in
        *MariaDB*)
            echo "Bài yêu cầu MySQL. MYSQL_SERVER đang trỏ tới MariaDB; hãy chọn mysqld của MySQL."
            exit 1
            ;;
    esac
    MYSQL_BASEDIR="$(cd -- "$(dirname -- "$MYSQL_SERVER")/.." && pwd)"

    RUNTIME_DIR="$PROJECT_DIR/.runtime"
    DATA_DIR="$RUNTIME_DIR/mysql-data"
    mkdir -p "$RUNTIME_DIR"
    chmod 700 "$RUNTIME_DIR"
    export DB_SOCKET="$RUNTIME_DIR/mysql.sock"
    export DB_NAME=lab8 DB_USER=lab8_app DB_PASS=''
    MYSQL_COMMAND=(env -u MYSQL_PWD "$MYSQL_CLIENT" --no-defaults --protocol=SOCKET "--socket=$DB_SOCKET" --user=root)

    if [[ ! -d "$DATA_DIR" ]]; then
        echo "Đang tạo MySQL riêng cho bài thực hành (chỉ lần đầu)…"
        INIT_DIR="$RUNTIME_DIR/mysql-init.$$"
        if ! "$MYSQL_SERVER" --no-defaults --initialize-insecure \
            "--basedir=$MYSQL_BASEDIR" "--datadir=$INIT_DIR" \
            --innodb-redo-log-capacity=16M --innodb-buffer-pool-size=32M \
            > "$RUNTIME_DIR/mysql-init.log" 2>&1; then
            tail -n 15 "$RUNTIME_DIR/mysql-init.log"
            exit 1
        fi
        mv "$INIT_DIR" "$DATA_DIR"
    fi

    if ! "${MYSQL_COMMAND[@]}" -e 'SELECT 1' >/dev/null 2>&1; then
        echo "Đang khởi động MySQL cục bộ…"
        # Chỉ dùng socket bên trong thư mục quyền 700; không mở cổng mạng.
        "$MYSQL_SERVER" --no-defaults "--basedir=$MYSQL_BASEDIR" \
            "--datadir=$DATA_DIR" "--socket=$DB_SOCKET" \
            --skip-networking --mysqlx=0 --skip-log-bin \
            --innodb-redo-log-capacity=16M --innodb-buffer-pool-size=32M \
            "--pid-file=$RUNTIME_DIR/mysql.pid" "--log-error=$RUNTIME_DIR/mysql.log" \
            > "$RUNTIME_DIR/mysql-console.log" 2>&1 &
        DATABASE_PID=$!
        ready=false
        for attempt in {1..100}; do
            if "${MYSQL_COMMAND[@]}" -e 'SELECT 1' >/dev/null 2>&1; then
                ready=true
                break
            fi
            if ! kill -0 "$DATABASE_PID" 2>/dev/null; then
                break
            fi
            sleep 0.2
        done
        if [[ "$ready" != true ]]; then
            echo "MySQL chưa khởi động được. Xem $RUNTIME_DIR/mysql.log."
            exit 1
        fi
    fi

    # Chỉ nhập dữ liệu mẫu khi chưa có bảng: giữ nguyên thao tác xóa sau khi chạy lại.
    table_exists=$("${MYSQL_COMMAND[@]}" --batch --skip-column-names -e \
        "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'lab8' AND TABLE_NAME = 'products';")
    if [[ "$table_exists" == '0' ]]; then
        "${MYSQL_COMMAND[@]}" < "$PROJECT_DIR/database.sql"
        echo "Đã tạo bảng products và ba sản phẩm mẫu."
    fi
    "${MYSQL_COMMAND[@]}" -e "CREATE USER IF NOT EXISTS 'lab8_app'@'localhost' IDENTIFIED BY ''; GRANT SELECT, INSERT, UPDATE, DELETE ON lab8.* TO 'lab8_app'@'localhost';"
    ;;
external)
    export DB_HOST="${DB_HOST:-127.0.0.1}"
    export DB_PORT="${DB_PORT:-3306}"
    export DB_NAME="${DB_NAME:-lab8}"
    export DB_USER="${DB_USER:-root}"
    if [[ -z "${DB_PASS+x}" ]]; then
        read -r -s -p "Mật khẩu MySQL cho ${DB_USER} (Enter nếu không có): " DB_PASS
        echo
    fi
    export DB_PASS
    ;;
*)
    echo "DB_MODE phải là local hoặc external."
    exit 1
    ;;
esac

if [[ "${DB_MODE:-local}" == local ]]; then
    echo "Đang dùng MySQL riêng trong Lab8, không cần mật khẩu."
fi

echo "Đang kiểm tra kết nối cơ sở dữ liệu…"
"${PHP_COMMAND[@]}" -r '
    require $argv[1];
    try {
        $pdo = connectDatabase();
        $version = $pdo->query("SELECT VERSION()")->fetchColumn();
        $edition = $pdo->query("SELECT @@version_comment")->fetchColumn();
        if (stripos($version . " " . $edition, "MariaDB") !== false) {
            throw new RuntimeException("Bài yêu cầu MySQL; cấu hình hiện tại đang kết nối MariaDB.");
        }
        echo "Kết nối MySQL ", $version, " thành công (", $edition, ").", PHP_EOL;
    } catch (RuntimeException $error) {
        fwrite(STDERR, databaseConnectionError($error) . PHP_EOL);
        exit(1);
    }
' "$PROJECT_DIR/api/config.php"

echo "Mở http://127.0.0.1:8000 để sử dụng. Nhấn Ctrl+C để dừng."
"${PHP_COMMAND[@]}" -S 127.0.0.1:8000 -t "$PROJECT_DIR" "$PROJECT_DIR/router.php" &
PHP_PID=$!
wait "$PHP_PID"
