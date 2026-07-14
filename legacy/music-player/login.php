<?php
require_once 'config.php'; // Includes ACCESS_PASSCODE_HASH and session_name()

session_start(); // Resume session

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['passcode'])) {
    $entered_passcode = $_POST['passcode'];

    // Verify the entered passcode against the stored hash
    if (password_verify($entered_passcode, ACCESS_PASSCODE_HASH)) {
        // Passcode is correct
        $_SESSION['authenticated'] = true;
        unset($_SESSION['login_error']); // Clear any previous error
        session_regenerate_id(true); // Prevent session fixation
        header('Location: index.php'); // Redirect to the player
        exit;
    } else {
        // Passcode incorrect
        $_SESSION['login_error'] = 'Incorrect passcode.';
        header('Location: index.php'); // Redirect back to login
        exit;
    }
} else {
    // If accessed directly or without POST data, redirect to login
    header('Location: index.php');
    exit;
}
?>