<?php
$prices = [150000, 250000, 90000, 320000, 180000];

function calculateTotal($priceList)
{
    $total = 0;

    foreach ($priceList as $price) {
        $total += $price;
    }

    return $total;
}

function findMaxPrice($priceList)
{
    $maxPrice = $priceList[0];

    foreach ($priceList as $price) {
        if ($price > $maxPrice) {
            $maxPrice = $price;
        }
    }

    return $maxPrice;
}

$totalPrice = calculateTotal($prices);
$maximumPrice = findMaxPrice($prices);

echo "Danh sách giá của 5 sản phẩm:<br>\n";
foreach ($prices as $index => $price) {
    echo "Sản phẩm " . ($index + 1) . ": "
        . number_format($price, 0, ",", ".") . " đồng<br>\n";
}

echo "Tổng giá trị sản phẩm: "
    . number_format($totalPrice, 0, ",", ".") . " đồng<br>\n";
echo "Giá sản phẩm cao nhất: "
    . number_format($maximumPrice, 0, ",", ".") . " đồng\n";
?>
