<?php
header('Content-Type: application/json');

function sanitize($str) {
    return htmlspecialchars(trim($str), ENT_QUOTES, 'UTF-8');
}

$email = sanitize($_POST['email'] ?? '');

if ($email === '') {
    echo json_encode(["status" => "error", "message" => "Email required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email address"]);
    exit;
}

$to = "your-email@example.com";

$subject = "New Newsletter Subscription";
$body = "A new user subscribed to your newsletter:\nEmail: $email";
$headers = "From: $email\r\nReply-To: $email\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>
