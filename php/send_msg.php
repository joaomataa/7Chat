<?php
include "db.php";

$message = $_POST["message"];
$sender_id = $_POST["sender_id"];
$receiver_id = $_POST["receiver_id"];

$sql =
    "INSERT INTO messages (sender_id, receiver_id, message, timestamp) VALUES (?, ?, ?, NOW())";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iis", $sender_id, $receiver_id, $message);

if ($stmt->execute()) {
    echo "Message sent successfully!";
} else {
    echo "Failed to send message!";
}

$stmt->close();
$conn->close();
