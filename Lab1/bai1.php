<?php

if (PHP_SAPI !== 'cli') {
    header('Content-Type: text/plain; charset=utf-8');
}

$students = [
    ["name" => "Nguyen Van An",   "age" => 20, "score" => 8.5],
    ["name" => "Tran Thi Binh",   "age" => 21, "score" => 6.5],
    ["name" => "Le Van Cuong",    "age" => 19, "score" => 4.5],
    ["name" => "Pham Thi Dung",   "age" => 20, "score" => 7.5],
];

echo " DANH SÁCH SINH VIÊN" . PHP_EOL;

$totalScore = 0;

foreach ($students as $student) {
    echo "Họ tên: " . $student["name"]
        . " | Tuổi: " . $student["age"]
        . " | Điểm: " . $student["score"] . PHP_EOL;

    $totalScore += $student["score"];
}

$averageScore = $totalScore / count($students);

echo PHP_EOL;
echo "Điểm trung bình: " . number_format($averageScore, 2) . PHP_EOL;