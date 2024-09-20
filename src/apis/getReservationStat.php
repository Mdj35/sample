<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");

// Connect to the database
$connection = new mysqli('localhost', 'root', '', 'sample');


// Retrieve the posted user ID
$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'];

// Initialize response array
$response = array();

if (isset($userId)) {
    // Query to calculate the total number of accepted reservations and the total amount spent
    $query = "
        SELECT COUNT(*) as totalReservations, SUM(price) as totalSpent 
        FROM reservations 
        WHERE user_id = ? AND status = 'accepted'
    ";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $stmt->bind_result($totalReservations, $totalSpent);
        $stmt->fetch();

        $response['status'] = 'success';
        $response['totalReservations'] = $totalReservations;
        $response['totalSpent'] = $totalSpent ?? 0; // Handle null value for SUM
        $stmt->close();
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Failed to prepare statement';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'User ID not provided';
}

// Close database connection
$conn->close();

// Send response
echo json_encode($response);
?>
