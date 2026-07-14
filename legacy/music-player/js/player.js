// js/player.js - Updated v3: Refined playTrack, removed load(), simplified event listeners

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const masterShuffleBtn = document.getElementById('master-shuffle-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const currentTrackNameEl = document.getElementById('current-track-name');
    const trackListUl = document.getElementById('track-list');
    const currentQueueUl = document.getElementById('current-queue-list');
    const playlistSelect = document.getElementById('playlist-select');
    const loadPlaylistBtn = document.getElementById('load-playlist-btn');
    const newPlaylistNameInput = document.getElementById('new-playlist-name');
    const savePlaylistBtn = document.getElementById('save-playlist-btn');
    const deletePlaylistBtn = document.getElementById('delete-playlist-btn');
    // const searchInput = document.getElementById('search-input');

    // --- State Variables ---
    let allTracks = [];
    let currentQueue = [];
    let originalQueue = [];
    let currentTrackIndex = -1;
    let isPlaying = false; // Reflects intention/last known state
    let isShuffled = false;

    // --- Core Functions ---

    async function fetchData(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errData = await response.json();
                    errorMsg = errData.error || JSON.stringify(errData);
                } catch(e) { /* Ignore */ }
                throw new Error(errorMsg);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch Error:', error);
            alert(`Error communicating with server: ${error.message}`);
            return null;
        }
    }

    async function loadLibrary() {
        const data = await fetchData('api.php?action=scan_music');
        if (data) {
            allTracks = data;
            renderTrackList(allTracks, trackListUl, false);
        } else {
             trackListUl.innerHTML = '<li>Error loading music library.</li>';
        }
    }

    async function loadPlaylists() {
        const playlistNames = await fetchData('api.php?action=get_playlists');
        playlistSelect.innerHTML = '<option value="">-- Load Playlist --</option>';
        if (playlistNames && Array.isArray(playlistNames)) {
            playlistNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                playlistSelect.appendChild(option);
            });
        }
    }

    async function loadPlaylistTracks(playlistName) {
        if (!playlistName) return;
        const trackPaths = await fetchData(`api.php?action=get_playlist_tracks&name=${encodeURIComponent(playlistName)}`);
        if (trackPaths && Array.isArray(trackPaths)) {
            const playlistTracks = trackPaths
                .map(path => allTracks.find(track => track.path === path))
                .filter(track => track);

            if (playlistTracks.length === 0 && trackPaths.length > 0) {
                console.warn("Some tracks in loaded playlist not found in library scan.");
            }

            currentQueue = playlistTracks.map(t => t.path);
            originalQueue = [...currentQueue];
            isShuffled = false;
            shuffleBtn.classList.remove('active');
            currentTrackIndex = 0;
            renderQueue(); // Render first
            if (currentQueue.length > 0) {
                playTrack(currentTrackIndex); // Then play
            } else {
                stopPlayback();
            }
        } else {
            alert(`Could not load tracks for playlist: ${playlistName}`);
            renderQueue();
        }
    }

    function renderTrackList(tracks, targetUl, isQueue) {
        targetUl.innerHTML = '';
        if (!tracks || tracks.length === 0) {
            let message = '<li>No tracks found.';
            if (targetUl === trackListUl) {
                 message += ' Upload MP3s to the music directory.</li>';
                 // Add search message if search active
            } else {
                message = '<li>Queue is empty</li>';
            }
            targetUl.innerHTML = message;
            return;
        }

        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.filename || track.path;
            li.dataset.path = track.path;
            li.dataset.listIndex = index; // Index within the *rendered* list

            li.addEventListener('click', () => {
                const trackPathToPlay = track.path;
                if (isQueue) {
                     const queueIndex = currentQueue.findIndex(path => path === trackPathToPlay);
                     if (queueIndex !== -1) {
                        playTrack(queueIndex);
                     } else { console.error("Queue click: Track not found in currentQueue", trackPathToPlay); }
                } else {
                    addToQueue(trackPathToPlay);
                    if (!isPlaying || currentQueue.length === 1) {
                         playTrack(currentQueue.length - 1);
                    }
                }
            });

            if (!isQueue) {
                const addBtn = document.createElement('button');
                addBtn.textContent = '+ Queue';
                addBtn.classList.add('add-queue-btn');
                addBtn.onclick = (e) => {
                    e.stopPropagation();
                    addToQueue(track.path);
                };
                li.appendChild(addBtn);
            }
            targetUl.appendChild(li);
        });
    }

     function renderQueue() {
         const queueTracks = currentQueue
             .map(path => allTracks.find(track => track.path === path))
             .filter(track => track);

         renderTrackList(queueTracks, currentQueueUl, true);

         // Highlight after rendering
         if (currentTrackIndex >= 0 && currentTrackIndex < currentQueue.length && currentQueueUl.children.length > currentTrackIndex) {
             const playingLi = currentQueueUl.children[currentTrackIndex];
             if (playingLi) {
                  playingLi.classList.add('playing');
             }
         }
     }

    function addToQueue(trackPath) {
        if (!currentQueue.includes(trackPath)) {
            currentQueue.push(trackPath);
            if (!isShuffled) {
                originalQueue.push(trackPath);
            }
            renderQueue();
        } else {
            console.log("Track already in queue:", trackPath);
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateTime() {
        const duration = audioPlayer.duration;
        if (isFinite(duration)) {
             currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
             durationEl.textContent = formatTime(duration);
        } else {
             currentTimeEl.textContent = '0:00';
             durationEl.textContent = '0:00';
        }
    }

    // --- REVISED playTrack function ---
    function playTrack(index) {
        if (index < 0 || index >= currentQueue.length) {
            console.log(`playTrack: Invalid index (${index}) or empty queue.`);
            stopPlayback();
            return;
        }

        currentTrackIndex = index;
        const trackPath = currentQueue[currentTrackIndex];
        const trackData = allTracks.find(t => t.path === trackPath);

        if (!trackData) {
            console.error(`playTrack: Track data not found for path: ${trackPath}. Skipping.`);
            // playNext(); // Decide if you want to auto-skip
            return;
        }

        const trackUrl = `music/${trackPath}`;
        console.log(`playTrack: Setting source index ${currentTrackIndex}, URL: ${trackUrl}`);

        currentTrackNameEl.textContent = trackData.filename || trackPath;
        // Title update will happen on 'play' event

        try {
            // --- Set source WITHOUT calling load() ---
            audioPlayer.src = trackUrl;

            // --- Render queue BEFORE attempting play ---
            // This ensures highlighting is correct even if play fails immediately
            renderQueue();

            // --- Attempt to play ---
            // This returns a promise. Let the event listeners handle UI state.
            console.log(`playTrack: Requesting play for ${trackUrl}`);
            const playPromise = audioPlayer.play();

            if (playPromise !== undefined) {
                playPromise
                  .then(_ => {
                    // Play request was initially successful (browser started trying)
                    console.log(`playTrack: Play promise resolved for ${trackUrl}`);
                    // The 'play' event listener will handle isPlaying state and UI updates.
                  })
                  .catch(error => {
                    // Play request failed.
                    console.error(`playTrack: Play promise rejected for ${trackUrl}:`, error);
                    // The 'pause' event listener should handle isPlaying state and UI updates.
                    // We might want to ensure the state is correct if events don't fire quickly
                    isPlaying = false;
                    playPauseBtn.textContent = '▶️ Play';
                    document.title = 'CrapMedia Player'; // Reset title on definite failure
                });
            } else {
                 console.warn("playTrack: audioPlayer.play() did not return a promise.");
                 // Assume it might work; rely on event listeners for UI state
            }

        } catch (error) {
             console.error(`playTrack: Error setting audio source for ${trackUrl}:`, error);
             stopPlayback(); // Stop completely if source setting fails
        }
    }
    // --- End of REVISED playTrack function ---


    function togglePlayPause() {
        console.log(`togglePlayPause: Called. Player paused? ${audioPlayer.paused}`);
        if (audioPlayer.paused) {
            // If nothing is loaded/selected yet, play the first track
            if (currentTrackIndex === -1 && currentQueue.length > 0) {
                 playTrack(0);
            } else if (audioPlayer.currentSrc) { // Only play if something is loaded
                // Attempt to play
                 console.log("togglePlayPause: Attempting to resume/play.");
                const playPromise = audioPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("togglePlayPause: Play failed:", error);
                        // Rely on 'pause' event to update UI
                    });
                }
            } else {
                console.log("togglePlayPause: Play clicked but nothing loaded.");
            }
        } else {
            // Pause the audio
            console.log("togglePlayPause: Attempting to pause.");
            audioPlayer.pause();
        }
        // Let the 'play' and 'pause' event listeners handle UI updates
    }

    function stopPlayback() {
        console.log("stopPlayback: Called.");
        audioPlayer.pause();
        // Check if src is set before trying to reset time, avoids potential errors
        if (audioPlayer.currentSrc) {
            audioPlayer.currentTime = 0;
        }
        currentTrackIndex = -1; // Reset index
        // Let the 'pause' event handle isPlaying and button text
        // Manually update parts not covered by 'pause' event
        currentTrackNameEl.textContent = '---';
        document.title = 'CrapMedia Player';
        renderQueue(); // Unhighlight track
    }

    function playNext() {
        if (currentQueue.length === 0) return;
        let nextIndex = currentTrackIndex + 1;
        if (nextIndex >= currentQueue.length) {
            nextIndex = 0; // Loop
        }
        console.log(`playNext: Calculated next index: ${nextIndex}`);
        playTrack(nextIndex);
    }

    function playPrev() {
         if (currentQueue.length === 0) return;
         let prevIndex;
         // If played > 3s, restart current track, else go prev
        if (audioPlayer.currentTime > 3 && currentTrackIndex !== -1) {
             prevIndex = currentTrackIndex; // Restart current
             console.log(`playPrev: Restarting track index: ${prevIndex}`);
        } else {
            prevIndex = currentTrackIndex - 1;
            if (prevIndex < 0) {
                prevIndex = currentQueue.length - 1; // Loop to end
            }
             console.log(`playPrev: Calculated prev index: ${prevIndex}`);
        }
        playTrack(prevIndex);
    }

    function toggleShuffle() {
        isShuffled = !isShuffled;
        shuffleBtn.classList.toggle('active', isShuffled);
        const currentPlayingPath = (currentTrackIndex >= 0 && currentTrackIndex < currentQueue.length) ? currentQueue[currentTrackIndex] : null;

        if (isShuffled) {
            let arrayToShuffle = [...originalQueue];
            for (let i = arrayToShuffle.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arrayToShuffle[i], arrayToShuffle[j]] = [arrayToShuffle[j], arrayToShuffle[i]];
            }
            currentQueue = arrayToShuffle;
        } else {
            currentQueue = [...originalQueue];
        }

        // Find new index of the playing track after shuffle/unshuffle
        if (currentPlayingPath) {
            currentTrackIndex = currentQueue.findIndex(path => path === currentPlayingPath);
             if(currentTrackIndex === -1) {
                 console.warn("Playing track path not found after shuffle state change.");
                 currentTrackIndex = currentQueue.length > 0 ? 0 : -1; // Default to start or none
             }
        } else {
             currentTrackIndex = currentQueue.length > 0 ? 0 : -1; // If nothing was playing
        }

        renderQueue();
        console.log("Shuffle toggled:", isShuffled, "New index:", currentTrackIndex);
        // Do not automatically play here, just update queue and index
    }

    function masterShuffle() {
        currentQueue = allTracks.map(t => t.path);
        originalQueue = [...currentQueue];
        isShuffled = true;
        shuffleBtn.classList.add('active');

        for (let i = currentQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentQueue[i], currentQueue[j]] = [currentQueue[j], currentQueue[i]];
        }

        currentTrackIndex = currentQueue.length > 0 ? 0 : -1;
        renderQueue(); // Render first
        if (currentTrackIndex !== -1) {
             playTrack(currentTrackIndex); // Then play
        } else {
            stopPlayback();
        }
    }

    async function savePlaylist() {
        const name = newPlaylistNameInput.value.trim();
        if (!name) { alert("Please enter a playlist name."); return; }
        if (currentQueue.length === 0) { alert("Cannot save empty queue."); return; }
        const tracksToSave = currentQueue;
        const result = await fetchData('api.php?action=save_playlist', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, tracks: tracksToSave })
        });
        if (result && result.success) {
            alert(`Playlist "${name}" saved.`);
            newPlaylistNameInput.value = '';
            loadPlaylists();
        } else { alert(`Failed to save playlist: ${result?.error || 'Unknown error'}`); }
    }

    async function deletePlaylist() {
         const name = playlistSelect.value;
         if (!name) { alert("Please select a playlist to delete."); return; }
         if (!confirm(`Delete playlist "${name}"? This cannot be undone.`)) { return; }
         const result = await fetchData('api.php?action=delete_playlist', {
             method: 'POST', headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ name: name })
         });
         if (result && result.success) {
             alert(`Playlist "${name}" deleted.`);
             loadPlaylists();
         } else { alert(`Failed to delete playlist: ${result?.error || 'Unknown error'}`); }
     }

    // --- Event Listeners ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    stopBtn.addEventListener('click', stopPlayback);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    shuffleBtn.addEventListener('click', toggleShuffle);
    masterShuffleBtn.addEventListener('click', masterShuffle);
    loadPlaylistBtn.addEventListener('click', () => loadPlaylistTracks(playlistSelect.value));
    savePlaylistBtn.addEventListener('click', savePlaylist);
    deletePlaylistBtn.addEventListener('click', deletePlaylist);

    volumeSlider.addEventListener('input', (e) => { audioPlayer.volume = e.target.value; });

    // --- Centralized UI Updates Based on Audio Events ---
    audioPlayer.addEventListener('play', () => {
        // Fired when playback begins or resumes.
        console.log("Audio event: play");
        isPlaying = true;
        playPauseBtn.textContent = '⏸️ Pause';
        // Update title if track is known
        if (currentTrackIndex !== -1 && currentQueue.length > currentTrackIndex) {
            const trackData = allTracks.find(t => t.path === currentQueue[currentTrackIndex]);
            if(trackData) document.title = `▶ ${trackData.filename || currentQueue[currentTrackIndex]} - CrapMedia Player`;
        } else {
            document.title = '▶ CrapMedia Player'; // Playing but track unknown?
        }
    });

    audioPlayer.addEventListener('pause', () => {
        // Fired when playback is paused (by user, end of track before 'ended', or interruption).
        console.log("Audio event: pause");
        isPlaying = false;
        playPauseBtn.textContent = '▶️ Play';
        document.title = 'CrapMedia Player'; // Reset title when paused
    });

    audioPlayer.addEventListener('ended', () => {
        // Fired when playback reaches the end of the media.
        console.log("Audio event: ended");
        // isPlaying state should already be false due to preceding 'pause' event (usually)
        playPauseBtn.textContent = '▶️ Play'; // Ensure button is correct
        playNext(); // Automatically play next track
    });

    audioPlayer.addEventListener('timeupdate', updateTime);
    audioPlayer.addEventListener('loadedmetadata', updateTime);

    // Optional: Listen for errors on the audio element itself
    audioPlayer.addEventListener('error', (e) => {
        console.error("Audio Element Error:", audioPlayer.error, e);
        // Handle media errors, e.g., display message, try next track?
         currentTrackNameEl.textContent = `Error loading track`;
         stopPlayback(); // Stop if there's a media error
    });

    // --- Initialization ---
    function initializePlayer() {
        console.log("Initializing player...");
        audioPlayer.volume = volumeSlider.value;
        loadLibrary()
            .then(() => {
                 console.log("Library loaded.");
                 loadPlaylists();
            })
            .catch(error => {
                console.error("Initialization failed:", error);
                trackListUl.innerHTML = '<li>Error initializing player. Check console.</li>';
            });
         renderQueue(); // Render initially empty queue
    }

    initializePlayer();

    // Attach Search Event Listener (Keep commented out)
    // searchInput?.addEventListener('input', handleSearch);

}); // End of DOMContentLoaded listener