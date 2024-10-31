<?php
header("Content-Type: application/json");
include "db.php";

$response = [];

$sender_id = isset($_GET["sender_id"]) ? intval($_GET["sender_id"]) : 0;
$receiver_id = isset($_GET["receiver_id"]) ? intval($_GET["receiver_id"]) : 0;

if ($sender_id <= 0 || $receiver_id <= 0) {
    http_response_code(400);
    $response["error"] = "Invalid sender or receiver ID";
    echo json_encode($response);
    exit();
}

$sql = "SELECT sender_id, message, timestamp FROM messages 
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) 
        ORDER BY timestamp ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iiii", $sender_id, $receiver_id, $receiver_id, $sender_id);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $response[] = $row;
}

echo json_encode($response);
$stmt->close();
$conn->close();
