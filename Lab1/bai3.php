<?php

if (PHP_SAPI !== 'cli') {
    header('Content-Type: text/plain; charset=utf-8');
}


function findBestStudent($students)
{
    $best = null;

    foreach ($students as $student) {
        if ($best === null || $student["score"] > $best["score"]) {
            $best = $student;
        }
    }

    return $best;
}


function findWorstStudent($students)
{
    $worst = null;

    foreach ($students as $student) {
        if ($worst === null || $student["score"] < $worst["score"]) {
            $worst = $student;
        }
    }

    return $worst;
}


function countPassedStudents($students)
{
    $count = 0;

    foreach ($students as $student) {
        if ($student["score"] >= 5) {
            $count++;
        }
    }

    return $count;
}


function findStudentByName($students, $name)
{
    foreach ($students as $student) {
        if (strcasecmp($student["name"], trim($name)) === 0) {
            return $student;
        }
    }

    return null;
}

function printStudent($label, $student)
{
    if ($student === null) {
        echo $label . ": Không tìm thấy" . PHP_EOL;
        return;
    }

    echo $label . ": " . $student["name"]
        . " (tuổi " . $student["age"] . ", điểm " . $student["score"] . ")" . PHP_EOL;
}

$students = [
    ["name" => "Nguyen Van An",   "age" => 20, "score" => 8.5],
    ["name" => "Tran Thi Binh",   "age" => 21, "score" => 6.5],
    ["name" => "Le Van Cuong",    "age" => 19, "score" => 4.5],
    ["name" => "Pham Thi Dung",   "age" => 20, "score" => 7.5],
];

printStudent("Sinh viên điểm cao nhất", findBestStudent($students));
printStudent("Sinh viên điểm thấp nhất", findWorstStudent($students));
echo "Số sinh viên đạt: " . countPassedStudents($students) . "/" . count($students) . PHP_EOL;

printStudent("Tìm 'Pham Thi Dung'", findStudentByName($students, "Pham Thi Dung"));
printStudent("Tìm 'Hoang Van Em'", findStudentByName($students, "Hoang Van Em"));