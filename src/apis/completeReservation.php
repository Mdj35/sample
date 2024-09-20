<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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
$reservationId = $data['id'];
$status = $data['status'];

// Update the reservation status
$sql = "UPDATE reservations SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $reservationId);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Reservation status updated."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update reservation status."]);
}

$stmt->close();
$conn->close();
?>
