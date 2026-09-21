<?php


if (PHP_SAPI !== 'cli') {
    header('Content-Type: text/plain; charset=utf-8');
}
 
 
function calculateAverageScore($students)
{
    if (count($students) === 0) {
        return 0;
    }

    $totalScore = 0;
    foreach ($students as $student) {
        $totalScore += $student["score"];
    }

    return $totalScore / count($students);
}


function getRank($score)
{
    if ($score >= 8) {
        return "Giỏi";
    }
    if ($score >= 6.5) {
        return "Khá";
    }
    if ($score >= 5) {
        return "Trung bình";
    }
    return "Yếu";
}


function displayStudent($student)
{
    echo "Họ tên: " . $student["name"]
        . " | Tuổi: " . $student["age"]
        . " | Điểm: " . $student["score"]
        . " | Xếp loại: " . getRank($student["score"]) . PHP_EOL;
}

$students = [
    ["name" => "Nguyen Van An",   "age" => 20, "score" => 8.5],
    ["name" => "Tran Thi Binh",   "age" => 21, "score" => 6.5],
    ["name" => "Le Van Cuong",    "age" => 19, "score" => 4.5],
    ["name" => "Pham Thi Dung",   "age" => 20, "score" => 7.5],
];

echo "DANH SÁCH SINH VIÊN" . PHP_EOL;
foreach ($students as $student) {
    displayStudent($student);
}

echo PHP_EOL;
echo "Điểm trung bình: " . number_format(calculateAverageScore($students), 2) . PHP_EOL;