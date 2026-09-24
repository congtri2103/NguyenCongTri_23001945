<?php

// 1. CLASS CartItem
class CartItem
{
    private $name;
    private $price;
    private $quantity;

    public function __construct($name, $price, $quantity)
    {
        // Kiểm tra giá sản phẩm
        if ($price <= 0) {
            throw new Exception("Giá sản phẩm phải lớn hơn 0.");
        }

        // Kiểm tra số lượng
        if ($quantity <= 0) {
            throw new Exception("Số lượng sản phẩm phải lớn hơn 0.");
        }

        $this->name = $name;
        $this->price = $price;
        $this->quantity = $quantity;
    }

    // Lấy tên sản phẩm
    public function getName()
    {
        return $this->name;
    }

    // Lấy đơn giá
    public function getPrice()
    {
        return $this->price;
    }

    // Lấy số lượng
    public function getQuantity()
    {
        return $this->quantity;
    }

    // Tính thành tiền của sản phẩm
    public function getTotal()
    {
        return $this->price * $this->quantity;
    }
}


// 2. CLASS ShoppingCart
class ShoppingCart
{
    private $items = [];

    // Thêm sản phẩm vào giỏ hàng
    public function addItem($item)
    {
        if ($item instanceof CartItem) {
            $this->items[] = $item;
            echo "Đã thêm sản phẩm: " . $item->getName() . "<br>";
        } else {
            echo "Sản phẩm không hợp lệ.<br>";
        }
    }

    // Xóa sản phẩm theo tên
    public function removeItem($name)
    {
        foreach ($this->items as $key => $item) {

            if ($item->getName() === $name) {

                unset($this->items[$key]);

                // Đánh lại chỉ số của mảng
                $this->items = array_values($this->items);

                echo "<p>Đã xóa sản phẩm: <b>$name</b></p>";
                return;
            }
        }

        echo "<p>Không tìm thấy sản phẩm: <b>$name</b></p>";
    }

    // Tính tổng tiền của giỏ hàng
    public function calculateTotal()
    {
        $total = 0;

        foreach ($this->items as $item) {
            // Đúng yêu cầu đề:
            // gọi getTotal() của CartItem
            $total += $item->getTotal();
        }

        return $total;
    }

    // Hiển thị giỏ hàng
    public function displayCart()
    {
        echo "<h3>GIỎ HÀNG</h3>";

        // Trường hợp giỏ hàng rỗng
        if (empty($this->items)) {
            echo "Giỏ hàng hiện đang trống.<br>";
            echo "Tổng tiền: 0 VNĐ<br>";
            return;
        }

        echo "<table border='1' cellpadding='10' cellspacing='0'>";

        echo "
            <tr>
                <th>Tên sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
            </tr>
        ";

        foreach ($this->items as $item) {

            echo "<tr>";

            echo "<td>" . $item->getName() . "</td>";

            echo "<td>"
                . number_format($item->getPrice())
                . " VNĐ</td>";

            echo "<td>"
                . $item->getQuantity()
                . "</td>";

            echo "<td>"
                . number_format($item->getTotal())
                . " VNĐ</td>";

            echo "</tr>";
        }

        echo "
            <tr>
                <td colspan='3'><b>Tổng tiền</b></td>
                <td><b>"
                . number_format($this->calculateTotal())
                . " VNĐ</b></td>
            </tr>
        ";

        echo "</table>";
    }
}


// 3. CHƯƠNG TRÌNH CHÍNH

try {

    // Bước 1: Tạo ShoppingCart
    $cart = new ShoppingCart();


    // Bước 2: Tạo ít nhất 4 CartItem
    $item1 = new CartItem("Laptop", 15000000, 1);

    $item2 = new CartItem("Chuột", 250000, 2);

    $item3 = new CartItem("Bàn phím", 700000, 1);

    $item4 = new CartItem("Tai nghe", 500000, 2);


    // Bước 3: Thêm sản phẩm vào giỏ hàng
    $cart->addItem($item1);

    $cart->addItem($item2);

    $cart->addItem($item3);

    $cart->addItem($item4);


    echo "<hr>";


    // Bước 4: Hiển thị toàn bộ giỏ hàng
    $cart->displayCart();


    // Bước 5: Tính và hiển thị tổng tiền
    echo "<h3>Tổng tiền giỏ hàng: "
        . number_format($cart->calculateTotal())
        . " VNĐ</h3>";


    echo "<hr>";


    // Bước 6: Xóa sản phẩm
    $cart->removeItem("Chuột");


    // Bước 7: Hiển thị lại giỏ hàng
    $cart->displayCart();

    // Test xóa sản phẩm không tồn tại
   

    echo "<hr>";

    $cart->removeItem("Điện thoại");

    echo "<hr>";

    // Test trường hợp giỏ hàng rỗng
    echo "<h3>KIỂM TRA GIỎ HÀNG RỖNG</h3>";

    $emptyCart = new ShoppingCart();

    $emptyCart->displayCart();

    echo "<p>Tổng tiền giỏ hàng rỗng: "
        . number_format($emptyCart->calculateTotal())
        . " VNĐ</p>";


} catch (Exception $e) {

    echo "Lỗi: " . $e->getMessage();

}

?>
