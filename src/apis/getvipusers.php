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



// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to get VIP users
$sql = "SELECT id, fullName, email FROM users WHERE status = 'VIP'"; // Adjust the condition based on how VIP status is stored
$result = $conn->query($sql);

// Prepare the response array
$response = array();
$response['vipUsers'] = array();

// Fetch data and populate the response array
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $response['vipUsers'][] = array(
            'id' => $row['id'],
            'fullName' => $row['fullName'],
            'email' => $row['email'],
        );
    }
}

// Close the connection
$conn->close();

// Return the JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
