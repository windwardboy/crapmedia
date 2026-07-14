<?php
// config.php - Store configuration securely

// --- IMPORTANT SECURITY ---
// Generate a strong hash for your password.
// You can generate this ONCE using a separate PHP script:
// echo password_hash('YourSecretPassword', PASSWORD_DEFAULT);
// Then replace the example hash below with the generated one.
define('ACCESS_PASSCODE_HASH', 'REPLACE_WITH_password_hash(...)'); // Never commit real credentials

// --- Paths ---
// IMPORTANT: Use relative paths from the PHP script's location or absolute paths
// Check your shared hosting environment for the best way to define these.
// Using __DIR__ is generally reliable.
define('MUSIC_DIR', __DIR__ . '/music'); // Directory containing MP3s
define('PLAYLISTS_DIR', __DIR__ . '/playlists'); // Directory to store playlists

// --- Error Reporting (Development vs Production) ---
// For development:
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// For production (live site), turn off display_errors and log errors instead:
// ini_set('display_errors', 0);
// error_reporting(0);
// ini_set('log_errors', 1);
// ini_set('error_log', __DIR__ . '/php-error.log'); // Ensure this file is writable

// --- Session ---
// Use secure session settings if possible (check hosting capabilities)
// ini_set('session.cookie_httponly', 1);
// ini_set('session.cookie_secure', isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 1 : 0); // Requires HTTPS
// ini_set('session.use_strict_mode', 1);
session_name('CrapMediaMusicPlayerSession'); // Use a unique session name

// --- Ensure required directories exist and are writable ---
if (!is_dir(PLAYLISTS_DIR)) {
    if (!mkdir(PLAYLISTS_DIR, 0755)) { // Use 0755 or 0775, avoid 0777 if possible
        die("Error: Cannot create playlists directory: " . PLAYLISTS_DIR . ". Please create it manually and ensure it's writable by the web server.");
    }
}
if (!is_writable(PLAYLISTS_DIR)) {
    die("Error: Playlists directory is not writable: " . PLAYLISTS_DIR);
}
if (!is_dir(MUSIC_DIR)) {
     // Don't create it automatically, user should upload music here
     die("Error: Music directory not found: " . MUSIC_DIR . ". Please create it and upload your MP3s.");
}

?>