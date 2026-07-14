<?php
require_once 'config.php'; // Includes session_name()

session_start(); // Start session after config

// Check if user is logged in
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    // Not logged in - Show login form
    $login_error = isset($_SESSION['login_error']) ? $_SESSION['login_error'] : null;
    unset($_SESSION['login_error']); // Clear error after displaying
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- favicon -->
    <link rel="icon" type="image/png" href="favicon.png">
    <title>Login - CrapMedia</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="login-container">
        <h1>CrapMedia Music Player</h1>
        <form action="login.php" method="post">
            <label for="passcode">Enter Passcode:</label>
            <input type="password" id="passcode" name="passcode" required>
            <button type="submit">Login</button>
            <?php if ($login_error): ?>
                <p class="error"><?php echo htmlspecialchars($login_error); ?></p>
            <?php endif; ?>
        </form>
    </div>
</body>
</html>
<?php
    exit; // Stop further script execution
}

// --- If logged in, the rest of index.php (player interface) goes here ---
// We'll add the player HTML later in Step 5
?>

<?php
// (Previous login check code from Step 2 goes here)
// This code runs only if the user IS authenticated.
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CrapMedia Player</title>
    <link rel="stylesheet" href="css/style.css">
    <!-- Optional: Include Wavesurfer.js -->
    <script src="js/wavesurfer.min.js"></script>
</head>
<body>
    <header>
        <h1>CrapMedia Music Player</h1>
        <a href="logout.php">Logout</a>
    </header>

    <main class="player-container">
        <div class="player-controls">
            <div id="now-playing">Now Playing: <span id="current-track-name">---</span></div>
            <div class="visualizer-container"> <!-- Optional: Keep a container for styling -->
            <img src="images/visualizer.gif" alt="Music Visualizer Animation" id="visualizer-gif">
            </div>
            <audio id="audio-player" controls style="display: none;"></audio> <!-- Hide default controls if using custom -->
             <div class="controls-buttons">
                 <button id="prev-btn">⏮️ Prev</button>
                 <button id="play-pause-btn">▶️ Play</button>
                 <button id="stop-btn">⏹️ Stop</button>
                 <button id="next-btn">⏭️ Next</button>
                 <button id="shuffle-btn">🔀 Shuffle</button>
                 <label for="volume-slider">Volume:</label>
                 <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="1">
            </div>
            <div class="time-info">
                <span id="current-time">0:00</span> / <span id="duration">0:00</span>
            </div>
        </div>

        <div class="library-playlists">
            <div class="library">
                <h2>Music Library (All Tracks)</h2>
                <button id="master-shuffle-btn">Shuffle All Tracks</button>
                <ul id="track-list">
                    <!-- Tracks will be loaded here by JavaScript -->
                    <li>Loading music...</li>
                </ul>
            </div>

            <div class="playlists">
                <h2>Playlists</h2>
                 <select id="playlist-select">
                    <option value="">-- Load Playlist --</option>
                    <!-- Playlist names loaded here -->
                 </select>
                 <button id="load-playlist-btn">Load Selected</button>
                 <hr>
                 <input type="text" id="new-playlist-name" placeholder="New playlist name">
                 <button id="save-playlist-btn">Save Current Queue as New Playlist</button>
                 <button id="delete-playlist-btn" style="color: red;">Delete Selected Playlist</button>
            </div>
        </div>

        <div class="current-queue">
             <h2>Current Queue</h2>
             <ul id="current-queue-list">
                 <!-- Tracks currently playing or queued -->
                 <li>Queue is empty</li>
             </ul>
         </div>

    </main>

    <footer>
        <!-- Optional footer content -->
    </footer>

    <!-- Include the player JavaScript -->
    
    <script src="js/player.js"></script>
</body>
</html>