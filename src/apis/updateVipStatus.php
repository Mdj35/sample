<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST"); // Use POST as it matches your use case
header("Access-Control-Allow-Headers: Content-Type");

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'];
$status = $data['status'];

// Database connection (replace with your own connection details)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sample";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Update VIP status to 'pending'
$sql = "UPDATE users SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('si', $status, $user_id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update VIP status.']);
}

$stmt->close();
$conn->close();
?>
