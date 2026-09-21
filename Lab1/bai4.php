<?php


if (PHP_SAPI !== 'cli') {
    header('Content-Type: text/plain; charset=utf-8');
}
class Student
{
    const PASS_SCORE = 5;

    private $name;
    private $age;
    private $score;

    public function __construct($name, $age, $score)
    {
        $this->name  = $name;
        $this->age   = $age;
        $this->score = $score;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getScore()
    {
        return $this->score;
    }

    public function getRank()
    {
        if ($this->score >= 8) {
            return "Giỏi";
        }
        if ($this->score >= 6.5) {
            return "Khá";
        }
        if ($this->score >= self::PASS_SCORE) {
            return "Trung bình";
        }
        return "Yếu";
    }

    public function isPassed()
    {
        return $this->score >= self::PASS_SCORE;
    }

    public function display()
    {
        echo "Họ tên: " . $this->name
            . " | Tuổi: " . $this->age
            . " | Điểm: " . $this->score
            . " | Xếp loại: " . $this->getRank()
            . " | " . ($this->isPassed() ? "Đạt" : "Không đạt") . PHP_EOL;
    }
}


function displayAllStudents($students)
{
    foreach ($students as $student) {
        $student->display();
    }
}

function findBestStudent($students)
{
    $best = null;

    foreach ($students as $student) {
        if ($best === null || $student->getScore() > $best->getScore()) {
            $best = $student;
        }
    }

    return $best;
}

function countPassedStudents($students)
{
    $count = 0;

    foreach ($students as $student) {
        if ($student->isPassed()) {
            $count++;
        }
    }

    return $count;
}

function calculateAverageScore($students)
{
    if (count($students) === 0) {
        return 0;
    }

    $total = 0;
    foreach ($students as $student) {
        $total += $student->getScore();
    }

    return $total / count($students);
}

$student1 = new Student("Nguyen Van An", 20, 8.5);
$student2 = new Student("Tran Thi Binh", 21, 6.5);
$student3 = new Student("Le Van Cuong", 19, 4.5);
$student4 = new Student("Pham Thi Dung", 20, 7.5);

$students = [$student1, $student2, $student3, $student4];

echo "DANH SÁCH SINH VIÊN" . PHP_EOL;
displayAllStudents($students);

echo PHP_EOL;
$best = findBestStudent($students);
echo "Sinh viên điểm cao nhất: " . $best->getName() . " (" . $best->getScore() . ")" . PHP_EOL;
echo "Số sinh viên đạt: " . countPassedStudents($students) . "/" . count($students) . PHP_EOL;
echo "Điểm trung bình của lớp: " . number_format(calculateAverageScore($students), 2) . PHP_EOL;