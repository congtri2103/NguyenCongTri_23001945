<?php
$name = "Nguyễn Văn An";
$score = 7.5;

if ($score >= 8) {
    $classification = "Giỏi";
} elseif ($score >= 6.5) {
    $classification = "Khá";
} elseif ($score >= 5) {
    $classification = "Trung bình";
} else {
    $classification = "Yếu";
}

?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kết quả học tập</title>
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
        .result { margin: 0; }
        .result div {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            padding: 16px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .result dt { color: #6b7280; }
        .result dd { margin: 0; font-weight: 600; text-align: right; }
        .result .classification {
            margin-top: 16px;
            padding: 20px;
            border: 0;
            border-radius: 12px;
            background: #eff6ff;
        }
        .classification dd { color: #1d4ed8; font-size: 20px; }
        @media print {
            body { padding: 0; background: #fff; }
            main { max-width: none; padding: 0; box-shadow: none; }
        }
    </style>
</head>
<body>
    <main>
        <h1>Kết quả học tập</h1>
        <p class="description">Thông tin và xếp loại học sinh</p>

        <dl class="result">
            <div>
                <dt>Tên học sinh</dt>
                <dd><?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?></dd>
            </div>
            <div>
                <dt>Điểm</dt>
                <dd><?php echo $score; ?></dd>
            </div>
            <div class="classification">
                <dt>Xếp loại</dt>
                <dd><?php echo $classification; ?></dd>
            </div>
        </dl>
    </main>
</body>
</html>
