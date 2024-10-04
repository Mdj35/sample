<?php
// Database connection details
$host = "localhost:3306";  // Replace with your database server name
$username = "vynceianoani_sample"; // Replace with your database username
$password = "midnightdj35"; // Replace with your database password
$dbname = "vynceianoani_sample"; // Replace with your database name

// Create a connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);
$reservationId = $data['reservation_id'];
$amount = $data['amount'];

// PayMongo API setup (replace with your actual PayMongo secret key)
require 'vendor/autoload.php'; // Include Composer autoload if using PayMongo SDK
use Paymongo\Paymongo;

// Initialize PayMongo
Paymongo::setApiKey('sk_test_65ovyJjG9Dc2XAfj5akWxgia');

// Step 1: Create payment intent
try {
    $paymentIntent = Paymongo::paymentIntents()->create([
        'amount' => $amount * 100, // amount in cents
        'currency' => 'PHP',
        'payment_method_types' => ['gcash'], // Adjust based on your payment method
        'metadata' => ['reservation_id' => $reservationId],
    ]);

    // Get payment intent ID
    $paymentIntentId = $paymentIntent->id;

    // Step 2: Insert payment details into the database
    $sql = "INSERT INTO payments (reservation_id, payment_intent_id, amount, status) VALUES (?, ?, ?, 'pending')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isi", $reservationId, $paymentIntentId, $amount);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'payment_intent_id' => $paymentIntentId]);
    } else {
        throw new Exception("Failed to save payment details: " . $stmt->error);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

// Close the database connection
$conn->close();
?>
