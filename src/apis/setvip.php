<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "";
$password = "";
$dbname = "sample"; // Replace with your database name


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve data from POST request
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id'])) {
    $userId = $data['id'];

    // Prepare and execute the query
    $stmt = $conn->prepare("UPDATE users SET status = 'VIP' WHERE id = ?");
    $stmt->bind_param("i", $userId);

    if ($stmt->execute()) {
        $response = array("status" => "success", "message" => "User status updated to VIP.");
    } else {
        $response = array("status" => "error", "message" => "Failed to update user status.");
    }

    $stmt->close();
} else {
    $response = array("status" => "error", "message" => "User ID is required.");
}

$conn->close();

// Send response
header('Content-Type: application/json');
echo json_encode($response);
?>
