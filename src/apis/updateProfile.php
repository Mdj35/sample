
<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");

// Connect to the database
$connection = new mysqli('localhost', 'root', '', 'your_database');

if ($connection->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit();
}

// Get the posted data
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$fullName = $data['fullName'];
$contactNumber = $data['contactNumber'];

// Update the user information
$sql = "UPDATE users SET fullName = ?, contactNumber = ? WHERE email = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param('sss', $fullName, $contactNumber, $email);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update profile.']);
}

$stmt->close();
$connection->close();
?>
