<?php
include "db.php";

$sql = "SELECT id, username FROM users";

$users = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

header("Content-Type: application/json");
echo json_encode($users);

$conn->close();
