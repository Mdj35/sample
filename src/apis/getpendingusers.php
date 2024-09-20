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

// Query to fetch users with 'Pending' status
$sql = "SELECT id, fullName, email, status FROM users WHERE status = 'Pending'";
$result = $conn->query($sql);

$pendingUsers = array();

if ($result->num_rows > 0) {
    // Fetch all users into an array
    while ($row = $result->fetch_assoc()) {
        $pendingUsers[] = $row;
    }
} else {
    $pendingUsers = array("status" => "no_results", "message" => "No pending users found.");
}

// Close the connection
$conn->close();

// Send response
header('Content-Type: application/json');
echo json_encode(array("pendingUsers" => $pendingUsers));
?>
