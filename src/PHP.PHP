<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost:3306";  // Replace with your database server name
$username = "vynceianoani_sample"; // Replace with your database username
$password = "midnightdj35"; // Replace with your database password
$dbname = "vynceianoani_sample"; // Replace with your database name


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$fullName = isset($data['fullName']) ? $data['fullName'] : null;
$email = isset($data['email']) ? $data['email'] : null;
$password = isset($data['password']) ? $data['password'] : null;
$contactNumber = isset($data['contactNumber']) ? $data['contactNumber'] : null;
$branch = isset($data['branch']) ? $data['branch'] : null;
$services = isset($data['services']) ? $data['services'] : [];

if (empty($fullName) || empty($email) || empty($password) || empty($contactNumber) || empty($branch)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

if (strpos($email, '@chicstation') === false) {
    echo json_encode(["status" => "error", "message" => "Email must contain '@chicstation'."]);
    exit();
}

// Check if the email already exists
$emailCheckQuery = $conn->prepare("SELECT id FROM employees WHERE email = ?");
$emailCheckQuery->bind_param("s", $email);
$emailCheckQuery->execute();
$emailCheckResult = $emailCheckQuery->get_result();

if ($emailCheckResult->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email is already in use."]);
    $emailCheckQuery->close();
    $conn->close();
    exit();
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Prepare and execute the insert statement for the employee with branch assignment
$sql = $conn->prepare("INSERT INTO employees (fullName, email, password, contactNumber, branch_id) VALUES (?, ?, ?, ?, ?)");
$sql->bind_param("ssssi", $fullName, $email, $passwordHash, $contactNumber, $branch);

if ($sql->execute()) {
    $employeeId = $conn->insert_id;

    // Insert services into employee_services table
    if (!empty($services)) {
        $serviceStmt = $conn->prepare("INSERT INTO employee_services (employee_id, service_id) VALUES (?, ?)");
        foreach ($services as $serviceName) {
            // Check if the service exists, if not, insert it
            $serviceQuery = $conn->prepare("SELECT id FROM services WHERE name = ?");
            $serviceQuery->bind_param("s", $serviceName);
            $serviceQuery->execute();
            $serviceResult = $serviceQuery->get_result();

            if ($serviceResult->num_rows === 0) {
                // Insert the new service
                $insertService = $conn->prepare("INSERT INTO services (name) VALUES (?)");
                $insertService->bind_param("s", $serviceName);
                $insertService->execute();
                $serviceId = $conn->insert_id;
                $insertService->close();
            } else {
                $serviceId = $serviceResult->fetch_assoc()['id'];
            }

            // Insert the employee-service link
            $serviceStmt->bind_param("ii", $employeeId, $serviceId);
            $serviceStmt->execute();
        }
        $serviceStmt->close();
    }

    echo json_encode(["status" => "success", "message" => "Admin account created successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
}

$emailCheckQuery->close();
$sql->close();
$conn->close();
?>




<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST"); 
header("Access-Control-Allow-Headers: Content-Type");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the Content-Type is application/json
if (strpos($_SERVER['CONTENT_TYPE'], 'application/json') === false) {
    echo json_encode(["status" => "error", "message" => "Content-Type must be application/json."]);
    exit();
}

$servername = "localhost:3306";  // Replace with your database server name
$username = "vynceianoani_sample"; // Replace with your database username
$password = "midnightdj35"; // Replace with your database password
$dbname = "vynceianoani_sample"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$fullName = isset($data['fullName']) ? $data['fullName'] : null;
$email = isset($data['email']) ? $data['email'] : null;
$password = isset($data['password']) ? $data['password'] : null;
$contactNumber = isset($data['contactNumber']) ? $data['contactNumber'] : null;

// Validate input fields
if (empty($fullName) || empty($email) || empty($password) || empty($contactNumber)) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit();
}

// Check if the email already exists
$emailCheckQuery = $conn->prepare("SELECT id FROM users WHERE email = ?");
$emailCheckQuery->bind_param("s", $email);
$emailCheckQuery->execute();
$emailCheckResult = $emailCheckQuery->get_result();

if ($emailCheckResult->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email is already in use."]);
    $emailCheckQuery->close();
    $conn->close();
    exit();
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Prepare and execute the insert statement
$sql = $conn->prepare("INSERT INTO users (fullName, email, password, contactNumber) VALUES (?, ?, ?, ?)");
$sql->bind_param("ssss", $fullName, $email, $passwordHash, $contactNumber);

if ($sql->execute()) {
    echo json_encode(["status" => "success", "message" => "Account created successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
}

$emailCheckQuery->close();
$sql->close();
$conn->close();
?>
