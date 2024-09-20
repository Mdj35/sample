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

$sql = "SELECT id, name, price, status FROM services";
$result = $conn->query($sql);

$services = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $services[] = $row;
    }
}

echo json_encode($services);

$conn->close();
?>
