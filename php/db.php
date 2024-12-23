<?php
$host = "localhost";
$db = "7chat";
$user = "miguel";
$pass = "edfrt456";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
