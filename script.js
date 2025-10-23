// 1. Get DOM Elements
const player = document.querySelector('.player');
const video = player.querySelector('.player__video');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

// State for progress bar seeking
let mousedown = false;

// 2. Implement Core Functions

/**
 * Toggles the video state between play and pause.
 * Also updates the button text to show the current state (► or ❚ ❚).
 */
function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

/**
 * Updates the play/pause button text based on the video's state.
 */
function updateButton() {
    const icon = video.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

/**
 * Handles volume and playbackSpeed changes from the range sliders.
 */
function handleRangeUpdate() {
    // 'this.name' will be 'volume' or 'playbackSpeed'
    // 'this.value' will be the value from the slider
    video[this.name] = this.value;
}

/**
 * Handles skipping/rewinding the video using the skip buttons.
 */
function skip() {
    // 'this.dataset.skip' gets the value from data-skip attribute (e.g., -10 or 25)
    video.currentTime += parseFloat(this.dataset.skip);
}

/**
 * Updates the progress bar width based on the video's current time.
 */
function handleProgress() {
    // Calculate the percentage of video completion
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

/**
 * Allows the user to seek a new position in the video by clicking or dragging on the progress bar.
 * @param {Event} e - The mouse event (click/mousemove).
 */
function scrub(e) {
    if (mousedown) {
        // Calculate the new time based on the click position relative to the progress bar width
        const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
        video.currentTime = scrubTime;
    }
}

// 3. Attach Event Listeners

// Play/Pause functionality
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

// Update button icon when video starts/pauses
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// Progress Bar update
video.addEventListener('timeupdate', handleProgress);

// Skip buttons
skipButtons.forEach(button => button.addEventListener('click', skip));

// Sliders (Volume and Playback Speed)
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
// Use 'mousemove' for real-time adjustments (like volume/speed feedback)
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));


// Progress Bar seeking (Scrubbing)
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => scrub(e)); // Calls scrub on move
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

// Also stop scrubbing if mouse leaves the progress bar area while held down
progress.addEventListener('mouseleave', () => mousedown = false);