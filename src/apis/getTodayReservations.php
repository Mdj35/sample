<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = ""; // Add your username
$password = ""; // Add your password
$dbname = "sample"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$adminEmail = $data['adminEmail'];

$currentDate = date('Y-m-d'); // Get today's date

// Fetch reservations for today based on admin's email
$sql = "SELECT r.id, r.user_email, r.service, r.date, r.time, r.price, r.status 
        FROM reservations r
        JOIN employees e ON r.employee_id = e.id 
        WHERE e.email = ? AND r.date = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $adminEmail, $currentDate);
$stmt->execute();
$result = $stmt->get_result();

$reservations = [];
while ($row = $result->fetch_assoc()) {
    $reservations[] = $row;
}

if (count($reservations) > 0) {
    echo json_encode(["status" => "success", "reservations" => $reservations]);
} else {
    echo json_encode(["status" => "error", "message" => "No reservations for today."]);
}

$stmt->close();
$conn->close();
?>
