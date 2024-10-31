<?php
$host = "localhost";
$db = "7chat";
$user = "___";
$pass = "___";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
