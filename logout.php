<?php
// Start the session to access session variables
session_start();

// Destroy the session and redirect to the login page
session_destroy();
header("Location: index.php");
exit();
?>
