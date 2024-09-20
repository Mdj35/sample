<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = ""; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "sample"; // Replace with your database name

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['email']) || !isset($input['profileImage'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input.']);
    exit;
}

$email = $input['email'];
$profileImage = $input['profileImage'];

// Determine if the email belongs to an employee or a user
$isEmployee = strpos($email, '@chicstation') !== false;
$table = $isEmployee ? 'employees' : 'users';
$profileTable = 'employees_profile_images';

// Get user_id from the appropriate table
$sql = "SELECT id FROM $table WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $user_id = $row['id'];

    // Check if the user already has a profile image
    $checkSql = "SELECT id FROM $profileTable WHERE user_id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param('i', $user_id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        // Update existing profile image URL
        $updateSql = "UPDATE $profileTable SET profile_image_url = ? WHERE user_id = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param('si', $profileImage, $user_id);
        
        if ($updateStmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Profile image updated successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update profile image.']);
        }
        $updateStmt->close();
    } else {
        // Insert new profile image URL
        $insertSql = "INSERT INTO $profileTable (user_id, profile_image_url) VALUES (?, ?)";
        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->bind_param('is', $user_id, $profileImage);
        
        if ($insertStmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Profile image saved successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to save profile image.']);
        }
        $insertStmt->close();
    }

    $checkStmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found.']);
}

$stmt->close();
$conn->close();
?>
    