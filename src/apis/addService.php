<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');



$servername = "localhost";
$dbname = "sample";
$username = "root";
$password = ""; // Add your password

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];
$price = $data['price'];
$status = 'available'; // Default status

$sql = "INSERT INTO services (name, price, status) VALUES ('$name', '$price', '$status')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}

$conn->close();
?>
