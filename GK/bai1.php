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

echo "Tên học sinh: " . $name . "<br>\n";
echo "Điểm: " . $score . "<br>\n";
echo "Xếp loại: " . $classification . "\n";
?>
