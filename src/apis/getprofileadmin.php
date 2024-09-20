<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection details
$servername = "localhost"; // Replace with your database server name
$username = ""; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "sample"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the POST data
$inputData = json_decode(file_get_contents('php://input'), true);
$email = isset($inputData['email']) ? $inputData['email'] : null;

if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Email is required."]);
    exit();
}

// Determine the table to query
$table = strpos($email, '@chicstation') !== false ? 'employees' : 'users';

// Fetch user details
$sql = "SELECT id, fullName, email, contactNumber, status FROM $table WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User not found."]);
    exit();
}

$user = $result->fetch_assoc();
$user_id = $user['id'];

// Fetch profile image URL from the user_profile_images table
$imageSql = "SELECT profile_image_url FROM employees_profile_images WHERE user_id = ?";
$imageStmt = $conn->prepare($imageSql);
$imageStmt->bind_param('i', $user_id);
$imageStmt->execute();
$imageResult = $imageStmt->get_result();

if ($imageResult->num_rows > 0) {
    $imageRow = $imageResult->fetch_assoc();
    $user['profileImageUrl'] = $imageRow['profile_image_url'];
} else {
    $user['profileImageUrl'] = null; // Set to null if no image is found
}

// Fetch services for employees if they exist
if ($table === 'employees') {
    $servicesSql = "
        SELECT s.name AS service_name 
        FROM employee_services es
        JOIN services s ON es.service_id = s.id
        WHERE es.employee_id = ?
    ";
    $servicesStmt = $conn->prepare($servicesSql);
    $servicesStmt->bind_param('i', $user_id);
    $servicesStmt->execute();
    $servicesResult = $servicesStmt->get_result();
    
    $services = [];
    while ($serviceRow = $servicesResult->fetch_assoc()) {
        $services[] = $serviceRow['service_name'];
    }
    $user['services'] = $services;
    
    $servicesStmt->close();
}

$response = [
    "status" => "success",
    "data" => $user
];

echo json_encode($response);

$stmt->close();
$imageStmt->close();
$conn->close();
?>
