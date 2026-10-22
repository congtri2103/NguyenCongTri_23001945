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
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Danh sách giá sản phẩm</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 40px 16px;
            background: #f3f6fb;
            color: #1f2937;
            font-family: Arial, sans-serif;
            line-height: 1.5;
        }
        main {
            max-width: 720px;
            margin: 0 auto;
            padding: 32px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 28px rgba(31, 41, 55, 0.08);
        }
        h1 { margin: 0 0 8px; font-size: 26px; }
        .description { margin: 0 0 24px; color: #6b7280; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 13px 16px; border-bottom: 1px solid #e5e7eb; }
        th { background: #eff6ff; color: #1d4ed8; text-align: left; }
        th:last-child, td:last-child { text-align: right; }
        .summary {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin-top: 24px;
            padding: 20px;
            border-radius: 12px;
            background: #eff6ff;
        }
        .summary p { margin: 0; }
        .summary strong { display: block; margin-top: 6px; color: #1d4ed8; font-size: 20px; }
        @media (max-width: 520px) {
            main { padding: 20px; }
            .summary { display: block; }
            .summary p + p { margin-top: 16px; }
        }
        @media print {
            body { padding: 0; background: #fff; }
            main { max-width: none; padding: 0; box-shadow: none; }
        }
    </style>
</head>
<body>
    <main>
        <h1>Danh sách giá sản phẩm</h1>
        <p class="description">Giá của <?php echo count($prices); ?> sản phẩm</p>

        <table>
            <thead>
                <tr><th>Sản phẩm</th><th>Giá</th></tr>
            </thead>
            <tbody>
                <?php foreach ($prices as $index => $price) { ?>
                    <tr>
                        <td>Sản phẩm <?php echo $index + 1; ?></td>
                        <td><?php echo number_format($price, 0, ",", "."); ?> đồng</td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>

        <div class="summary">
            <p>Tổng giá trị<strong><?php echo number_format($totalPrice, 0, ",", "."); ?> đồng</strong></p>
            <p>Giá cao nhất<strong><?php echo number_format($maximumPrice, 0, ",", "."); ?> đồng</strong></p>
        </div>
    </main>
</body>
</html>
