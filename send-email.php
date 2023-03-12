
<?php
$to = 'info@zekmosfarms.org';
$name = $_POST['name'];
$email = $_POST['email'];
$email = $_POST['phone'];
$message = $_POST['message'];
$subject = 'New message from your website';

$headers = 'From: ' . $name . ' <' . $email . '>' . "\r\n" .
    'Reply-To: ' . $email . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);

header('Location: thank-you.html');
?> 


<form method="post" action="send-email.php">
    <!-- Form fields here -->
</form>
