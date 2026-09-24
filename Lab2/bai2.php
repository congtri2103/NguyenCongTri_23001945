<?php

// =====================================
// CLASS MOVIE
// =====================================
class Movie
{
    private $id;
    private $title;
    private $price;
    private $totalSeats;
    private $availableSeats;

    public function __construct($id, $title, $price, $totalSeats)
    {
        if ($price <= 0) {
            throw new Exception("Giá vé phải lớn hơn 0.");
        }

        if ($totalSeats <= 0) {
            throw new Exception("Tổng số ghế phải lớn hơn 0.");
        }

        $this->id = $id;
        $this->title = $title;
        $this->price = $price;
        $this->totalSeats = $totalSeats;

        // Khi khởi tạo, số ghế còn lại = tổng số ghế
        $this->availableSeats = $totalSeats;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getTitle()
    {
        return $this->title;
    }

    // Đặt vé
    public function bookTicket($quantity)
    {
        if ($quantity <= 0) {
            echo "Số lượng vé đặt phải lớn hơn 0.<br>";
            return false;
        }

        if ($quantity > $this->availableSeats) {
            echo "Không đủ ghế để đặt cho phim "
                . $this->title . ".<br>";
            return false;
        }

        $this->availableSeats -= $quantity;

        echo "Đặt thành công $quantity vé phim "
            . $this->title . ".<br>";

        return true;
    }

    // Hủy vé
    public function cancelTicket($quantity)
    {
        if ($quantity <= 0) {
            echo "Số lượng vé hủy phải lớn hơn 0.<br>";
            return false;
        }

        $soldSeats = $this->getSoldSeats();

        if ($quantity > $soldSeats) {
            echo "Không thể hủy $quantity vé phim "
                . $this->title
                . " vì chỉ có $soldSeats vé đã bán.<br>";
            return false;
        }

        $this->availableSeats += $quantity;

        echo "Đã hủy thành công $quantity vé phim "
            . $this->title . ".<br>";

        return true;
    }

    // Lấy số vé đã bán
    public function getSoldSeats()
    {
        return $this->totalSeats - $this->availableSeats;
    }

    // Tính doanh thu
    public function getRevenue()
    {
        return $this->getSoldSeats() * $this->price;
    }

    // Hiển thị thông tin phim
    public function displayInfo()
    {
        echo "<tr>";

        echo "<td>" . $this->id . "</td>";
        echo "<td>" . $this->title . "</td>";
        echo "<td>" . number_format($this->price) . " VNĐ</td>";
        echo "<td>" . $this->totalSeats . "</td>";
        echo "<td>" . $this->availableSeats . "</td>";
        echo "<td>" . $this->getSoldSeats() . "</td>";
        echo "<td>" . number_format($this->getRevenue()) . " VNĐ</td>";

        echo "</tr>";
    }
}


// ==================================================
// CÁC FUNCTION XỬ LÝ DANH SÁCH PHIM
// ==================================================

// Tìm phim theo ID
function findMovieById($movies, $id)
{
    if (empty($movies)) {
        return null;
    }

    foreach ($movies as $movie) {
        if ($movie->getId() == $id) {
            return $movie;
        }
    }

    return null;
}


// Tính tổng doanh thu
function getTotalRevenue($movies)
{
    if (empty($movies)) {
        return 0;
    }

    $totalRevenue = 0;

    foreach ($movies as $movie) {
        $totalRevenue += $movie->getRevenue();
    }

    return $totalRevenue;
}


// Tìm phim bán được nhiều vé nhất
function getBestSellingMovie($movies)
{
    if (empty($movies)) {
        return null;
    }

    $bestMovie = $movies[0];

    foreach ($movies as $movie) {
        if ($movie->getSoldSeats() > $bestMovie->getSoldSeats()) {
            $bestMovie = $movie;
        }
    }

    return $bestMovie;
}


// ==================================================
// CHƯƠNG TRÌNH CHÍNH
// ==================================================

try {

    // ==================================================
    // BƯỚC 1: TẠO 10 OBJECT MOVIE
    // ==================================================

    $movie1 = new Movie(1, "Avengers", 100000, 100);
    $movie2 = new Movie(2, "Avatar", 120000, 80);
    $movie3 = new Movie(3, "Batman", 90000, 120);
    $movie4 = new Movie(4, "Spider-Man", 110000, 90);
    $movie5 = new Movie(5, "Iron Man", 100000, 100);
    $movie6 = new Movie(6, "Titanic", 80000, 150);
    $movie7 = new Movie(7, "Inception", 95000, 110);
    $movie8 = new Movie(8, "Interstellar", 105000, 100);
    $movie9 = new Movie(9, "The Dark Knight", 90000, 120);
    $movie10 = new Movie(10, "Joker", 85000, 130);


    // ==================================================
    // TẠO DANH SÁCH CÁC OBJECT MOVIE
    // ==================================================

    $movies = [
        $movie1,
        $movie2,
        $movie3,
        $movie4,
        $movie5,
        $movie6,
        $movie7,
        $movie8,
        $movie9,
        $movie10
    ];


    echo "<h2>THỰC HIỆN ĐẶT / HỦY VÉ</h2>";


    // ==================================================
    // BƯỚC 2: ĐẶT VÉ CHO AVENGERS
    // ==================================================

    $avengers = findMovieById($movies, 1);

    if ($avengers != null) {
        $avengers->bookTicket(30);
    } else {
        echo "Không tìm thấy phim Avengers.<br>";
    }


    // ==================================================
    // BƯỚC 3: ĐẶT VÉ CHO AVATAR
    // ==================================================

    $avatar = findMovieById($movies, 2);

    if ($avatar != null) {
        $avatar->bookTicket(40);
    } else {
        echo "Không tìm thấy phim Avatar.<br>";
    }


    // ==================================================
    // ĐẶT THÊM VÉ CHO MỘT SỐ PHIM
    // ==================================================

    $movie3->bookTicket(20);
    $movie4->bookTicket(35);
    $movie5->bookTicket(15);
    $movie6->bookTicket(25);
    $movie7->bookTicket(10);
    $movie8->bookTicket(45);
    $movie9->bookTicket(18);
    $movie10->bookTicket(22);


    // ==================================================
    // BƯỚC 4: HỦY 5 VÉ AVENGERS
    // ==================================================

    if ($avengers != null) {
        $avengers->cancelTicket(5);
    }


    // ==================================================
    // BƯỚC 5: HIỂN THỊ TẤT CẢ PHIM
    // ==================================================

    echo "<h2>DANH SÁCH PHIM</h2>";

    if (empty($movies)) {

        echo "Danh sách phim hiện đang trống.";

    } else {

        echo "
        <table border='1' cellpadding='10' cellspacing='0'>

            <tr>
                <th>ID</th>
                <th>Tên phim</th>
                <th>Giá vé</th>
                <th>Tổng ghế</th>
                <th>Ghế còn lại</th>
                <th>Vé đã bán</th>
                <th>Doanh thu</th>
            </tr>
        ";

        foreach ($movies as $movie) {
            $movie->displayInfo();
        }

        echo "</table>";
    }


    // ==================================================
    // BƯỚC 6: TÍNH TỔNG DOANH THU
    // ==================================================

    echo "<h3>Tổng doanh thu tất cả phim: "
        . number_format(getTotalRevenue($movies))
        . " VNĐ</h3>";


    // ==================================================
    // BƯỚC 7: TÌM PHIM BÁN NHIỀU VÉ NHẤT
    // ==================================================

    $bestMovie = getBestSellingMovie($movies);

    if ($bestMovie != null) {

        echo "<h3>PHIM BÁN NHIỀU VÉ NHẤT</h3>";

        echo "Tên phim: "
            . $bestMovie->getTitle()
            . "<br>";

        echo "Số vé đã bán: "
            . $bestMovie->getSoldSeats()
            . " vé<br>";

        echo "Doanh thu: "
            . number_format($bestMovie->getRevenue())
            . " VNĐ<br>";

    } else {

        echo "Danh sách phim trống.<br>";
    }


    // ==================================================
    // KIỂM TRA CÁC TRƯỜNG HỢP BẮT BUỘC
    // ==================================================

    echo "<hr>";

    echo "<h2>KIỂM TRA TRƯỜNG HỢP ĐẶC BIỆT</h2>";


    // Đặt vé <= 0
    echo "<b>1. Đặt số vé <= 0:</b><br>";
    $movie1->bookTicket(0);

    echo "<br>";


    // Đặt vượt số ghế còn lại
    echo "<b>2. Đặt vé vượt quá số ghế còn lại:</b><br>";
    $movie1->bookTicket(1000);

    echo "<br>";


    // Hủy vé <= 0
    echo "<b>3. Hủy số vé <= 0:</b><br>";
    $movie1->cancelTicket(0);

    echo "<br>";


    // Hủy nhiều hơn số vé đã bán
    echo "<b>4. Hủy nhiều hơn số vé đã bán:</b><br>";
    $movie1->cancelTicket(100);

    echo "<br>";


    // Tìm phim không tồn tại
    echo "<b>5. Tìm phim không tồn tại:</b><br>";

    $movieNotFound = findMovieById($movies, 999);

    if ($movieNotFound == null) {
        echo "Không tìm thấy phim có ID = 999.<br>";
    }


    echo "<br>";


    // Danh sách phim rỗng
    echo "<b>6. Kiểm tra danh sách phim rỗng:</b><br>";

    $emptyMovies = [];

    echo "Tổng doanh thu: "
        . number_format(getTotalRevenue($emptyMovies))
        . " VNĐ<br>";


    $best = getBestSellingMovie($emptyMovies);

    if ($best == null) {
        echo "Không có phim bán chạy nhất vì danh sách phim trống.<br>";
    }


    $search = findMovieById($emptyMovies, 1);

    if ($search == null) {
        echo "Không thể tìm phim vì danh sách phim trống.<br>";
    }

} catch (Exception $e) {

    echo "Lỗi: " . $e->getMessage();

}

?>