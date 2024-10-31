<?php
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

$userId =
  isset($_GET["user_id"]) && is_numeric($_GET["user_id"])
  ? intval($_GET["user_id"])
  : null;
if (!$userId) {
  echo json_encode(["error" => "Invalid user ID"]);
  exit();
}

$sql = "
  SELECT 
  u.id AS receiver_id, 
  u.username, 
  (SELECT message FROM messages 
   WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id) 
   ORDER BY timestamp DESC 
   LIMIT 1
  ) AS last_message,
  (SELECT IFNULL(MAX(timestamp), '1970-01-01 00:00:00') FROM messages 
   WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id) 
   ORDER BY timestamp DESC 
   LIMIT 1
  ) AS timestamp
  FROM users u
  WHERE u.id != ?
  ORDER BY timestamp DESC
";

$stmt = $conn->prepare($sql);
if ($stmt) {
  $stmt->bind_param("iiiii", $userId, $userId, $userId, $userId, $userId);
  $stmt->execute();
  $result = $stmt->get_result();

  $chats = [];
  while ($row = $result->fetch_assoc()) {
    $chats[] = $row;
  }

  echo json_encode($chats);
} else {
  echo json_encode(["error" => "Query preparation failed"]);
}

$stmt->close();
$conn->close();
