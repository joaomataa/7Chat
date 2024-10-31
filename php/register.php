<?php
include "db.php";
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Username already exists.",
        ]);
    } else {
        $stmt = $conn->prepare(
            "INSERT INTO users (username, password) VALUES (?, ?)"
        );
        $stmt->bind_param("ss", $username, $password);
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "User registered successfully!",
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to register user. Please try again.",
            ]);
        }
    }

    $stmt->close();
    $conn->close();
}
