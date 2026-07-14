<?php
require_once 'config.php';

session_start(); // Resume session to check authentication

// --- Security Check ---
// Ensure the user is authenticated for all API actions
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'Authentication required.']);
    exit;
}

// --- Basic Router ---
$action = $_GET['action'] ?? null;

header('Content-Type: application/json'); // Set response type

try {
    switch ($action) {
        case 'scan_music':
            echo json_encode(scanMusicDirectory(MUSIC_DIR));
            break;

        case 'get_playlists':
            echo json_encode(getPlaylists(PLAYLISTS_DIR));
            break;

        case 'get_playlist_tracks':
            $name = $_GET['name'] ?? null;
            if (!$name) throw new Exception("Playlist name not provided.");
            echo json_encode(getPlaylistTracks(PLAYLISTS_DIR, $name));
            break;

        case 'save_playlist':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Invalid request method.");
            $data = json_decode(file_get_contents('php://input'), true);
            $name = $data['name'] ?? null;
            $tracks = $data['tracks'] ?? []; // Expect an array of relative track paths
            if (!$name) throw new Exception("Playlist name not provided for saving.");
            if (savePlaylist(PLAYLISTS_DIR, $name, $tracks)) {
                echo json_encode(['success' => true, 'message' => 'Playlist saved.']);
            } else {
                 throw new Exception("Failed to save playlist.");
            }
            break;

        case 'delete_playlist':
             if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Invalid request method.");
             $data = json_decode(file_get_contents('php://input'), true);
             $name = $data['name'] ?? null;
             if (!$name) throw new Exception("Playlist name not provided for deletion.");
             if (deletePlaylist(PLAYLISTS_DIR, $name)) {
                 echo json_encode(['success' => true, 'message' => 'Playlist deleted.']);
             } else {
                  throw new Exception("Failed to delete playlist.");
             }
             break;

        default:
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => 'Invalid action specified.']);
    }
} catch (Exception $e) {
    header('HTTP/1.1 500 Internal Server Error'); // Or appropriate error code
    echo json_encode(['error' => $e->getMessage()]);
}

exit; // End script execution

// --- Helper Functions ---

/**
 * Scans the music directory recursively for MP3 files.
 * Returns an array of objects, each containing filename and relative path.
 */
function scanMusicDirectory(string $dir): array {
    $files = [];
    if (!is_dir($dir)) return $files; // Return empty if dir doesn't exist

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    $basePathLength = strlen(rtrim($dir, DIRECTORY_SEPARATOR)) + 1;

    foreach ($iterator as $file) {
        /** @var SplFileInfo $file */
        if ($file->isFile() && strtolower($file->getExtension()) === 'mp3') {
            $relativePath = substr($file->getPathname(), $basePathLength);
            // Normalize path separators for web use
            $webPath = str_replace(DIRECTORY_SEPARATOR, '/', $relativePath);
            $files[] = [
                'filename' => $file->getBasename('.mp3'), // Name without extension
                'path' => $webPath // Relative path used in URLs
            ];
        }
    }
    // Sort alphabetically by path for consistency
    usort($files, fn($a, $b) => strcmp($a['path'], $b['path']));
    return $files;
}

/**
 * Gets a list of available playlist names.
 */
function getPlaylists(string $playlistDir): array {
    $playlists = [];
    if (!is_dir($playlistDir)) return $playlists;

    $items = scandir($playlistDir);
    foreach ($items as $item) {
        if (pathinfo($item, PATHINFO_EXTENSION) === 'json') {
            $playlists[] = pathinfo($item, PATHINFO_FILENAME); // Get name without .json
        }
    }
    sort($playlists);
    return $playlists;
}

/**
 * Loads the track paths from a specific playlist file.
 */
function getPlaylistTracks(string $playlistDir, string $name): array {
    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', $name); // Basic sanitization
    if (empty($safeName)) throw new Exception("Invalid playlist name.");

    $filePath = $playlistDir . DIRECTORY_SEPARATOR . $safeName . '.json';

    if (!file_exists($filePath)) {
        throw new Exception("Playlist not found: " . htmlspecialchars($name));
    }

    $content = file_get_contents($filePath);
    $data = json_decode($content, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding playlist file: " . json_last_error_msg());
    }
    // Expecting the JSON file to contain an array of relative track paths
    return $data ?? [];
}

/**
 * Saves track paths to a playlist file.
 */
function savePlaylist(string $playlistDir, string $name, array $tracks): bool {
    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', $name); // Basic sanitization
     if (empty($safeName)) throw new Exception("Invalid playlist name for saving.");

    $filePath = $playlistDir . DIRECTORY_SEPARATOR . $safeName . '.json';
    $jsonData = json_encode($tracks, JSON_PRETTY_PRINT);

    if ($jsonData === false) {
         throw new Exception("Error encoding playlist data: " . json_last_error_msg());
    }

    // Use file_put_contents for atomic write (usually)
    return file_put_contents($filePath, $jsonData, LOCK_EX) !== false;
}

/**
 * Deletes a playlist file.
 */
function deletePlaylist(string $playlistDir, string $name): bool {
     $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', $name); // Basic sanitization
     if (empty($safeName)) throw new Exception("Invalid playlist name for deletion.");

     $filePath = $playlistDir . DIRECTORY_SEPARATOR . $safeName . '.json';

     if (file_exists($filePath)) {
         return unlink($filePath);
     }
     return false; // File didn't exist, consider it non-failure or throw exception?
}

?>