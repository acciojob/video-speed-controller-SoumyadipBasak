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
 */
function togglePlay() {
    // Uses the video API's play() and pause() methods
    video.paused ? video.play() : video.pause();
}

/**
 * Updates the play/pause button text (► or ❚ ❚).
 */
function updateButton() {
    const icon = video.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

/**
 * Handles volume and playbackSpeed changes from the range sliders.
 */
function handleRangeUpdate() {
    // Sets the corresponding video property (volume or playbackRate) 
    // using the input's 'name' and 'value'.
    // Note: The HTML input name "playbackSpeed" maps directly to video.playbackRate
    video[this.name] = this.value;
}

/**
 * Handles skipping/rewinding the video (10s back / 25s forward).
 */
function skip() {
    // Adds the 'data-skip' value (e.g., -10 or 25) to the current time.
    video.currentTime += parseFloat(this.dataset.skip);
}

/**
 * Updates the progress bar width based on the video's current time.
 */
function handleProgress() {
    // Calculates the percentage of video completion.
    const percent = (video.currentTime / video.duration) * 100;
    // Uses flex-basis to control the width of the progress bar fill.
    progressBar.style.flexBasis = `${percent}%`;
}

/**
 * Allows the user to seek a new position in the video (scrubbing).
 */
function scrub(e) {
    if (mousedown) {
        // Calculates the seek time: (click position / progress bar width) * total duration
        const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
        video.currentTime = scrubTime;
    }
}

// 3. Attach Event Listeners

// Play/Pause
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton); // Updates button to ❚ ❚
video.addEventListener('pause', updateButton); // Updates button to ►

// Progress Bar
video.addEventListener('timeupdate', handleProgress);

// Skip Buttons
skipButtons.forEach(button => button.addEventListener('click', skip));

// Sliders (Volume and Speed)
// 'change' for when slider stops, 'mousemove' for real-time adjustments
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate)); 

// Scrubbing Functionality
progress.addEventListener('click', scrub);
// Attach mousemove only when mousedown is true
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mousemove', scrub); 
progress.addEventListener('mouseleave', () => mousedown = false); // Prevents seeking after dragging mouse out