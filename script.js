// State Variables
let totalSecondsRemaining = 300; // Default: 5 minutes
let initialTotalSeconds = 300;
let timerInterval = null;
let isRunning = false;
let soundEnabled = true;
let audioCtx = null;
let inactivityTimeout = null;

// DOM Elements
const clockDisplay = document.getElementById('clock-display');
const subLabel = document.getElementById('sub-label');
const statusBadge = document.getElementById('status-badge');
const startPauseBtn = document.getElementById('start-pause-btn');
const startPauseText = document.getElementById('start-pause-text');
const startPauseIcon = document.getElementById('start-pause-icon');
const resetBtn = document.getElementById('reset-btn');
const applyTimeBtn = document.getElementById('apply-time-btn');

const inputHours = document.getElementById('input-hours');
const inputMinutes = document.getElementById('input-minutes');
const inputSeconds = document.getElementById('input-seconds');

const controlDrawer = document.getElementById('control-drawer');
const toggleDrawerBtn = document.getElementById('toggle-drawer-btn');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const fsIcon = document.getElementById('fs-icon');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const screenClickArea = document.getElementById('screen-click-area');
const topBar = document.getElementById('top-bar');
const footer = document.getElementById('footer');
const presetButtons = document.querySelectorAll('.preset-btn');

// Initialize Web Audio Context (resumes on user interaction)
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Sound: Ticking sound for the last 5 seconds
function playTickSound() {
    if (!soundEnabled) return;
    initAudio();
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime); // High crisp tick

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
        console.error('Audio playback error', e);
    }
}

// Sound: Rich resonant gong chord for timer completion
function playGongSound() {
    if (!soundEnabled) return;
    initAudio();
    try {
        const now = audioCtx.currentTime;
        const frequencies = [130.81, 196.00, 261.63, 392.00, 523.25]; // C major harmonic blend

        frequencies.forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = index === 0 ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, now);

            const baseGain = 0.3 / (index + 1);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(baseGain, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 3.5);
        });
    } catch (e) {
        console.error('Gong playback error', e);
    }
}

// Format seconds into HH:MM:SS or MM:SS
function formatTime(totalSecs) {
    if (totalSecs < 0) totalSecs = 0;
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const pad = (num) => String(num).padStart(2, '0');

    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

// Update clock numbers on the screen
function updateDisplay() {
    clockDisplay.textContent = formatTime(totalSecondsRemaining);

    // Adjust font size clamp if showing 6 digits (hours included) vs 4 digits
    if (totalSecondsRemaining >= 3600) {
        clockDisplay.style.fontSize = 'clamp(3.5rem, 20vw, 30vh)';
    } else {
        clockDisplay.style.fontSize = 'clamp(4rem, 27vw, 36vh)';
    }
}

// Toast notification helper
function showToast(message, isSuccess = true) {
    const toast = document.getElementById('toast-box');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    toastMsg.textContent = message;
    toastIcon.textContent = isSuccess ? '●' : '▲';
    toastIcon.className = isSuccess ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold';

    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 10px)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 0)';
    }, 2500);
}

// Start Timer
function startTimer() {
    if (totalSecondsRemaining <= 0) {
        showToast('Please set a duration greater than zero', false);
        return;
    }
    if (isRunning) return;

    initAudio();
    isRunning = true;
    statusBadge.textContent = 'Running';
    statusBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-950 text-emerald-400 border border-emerald-800';
    startPauseText.textContent = 'Pause';
    startPauseIcon.textContent = '❚❚';
    subLabel.textContent = 'Remaining Time';

    timerInterval = setInterval(() => {
        if (totalSecondsRemaining > 0) {
            totalSecondsRemaining--;
            updateDisplay();

            // Trigger ticking on final 5 seconds
            if (totalSecondsRemaining > 0 && totalSecondsRemaining <= 5) {
                playTickSound();
                clockDisplay.classList.add('animate-urgent');
            }
        }

        if (totalSecondsRemaining <= 0) {
            stopTimer();
            playGongSound();
            statusBadge.textContent = 'Finished';
            statusBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-red-950 text-red-400 border border-red-800';
            subLabel.textContent = "Time's Up!";
            showToast('Countdown Finished!');
        }
    }, 1000);
}

// Stop / Pause Timer
function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    statusBadge.textContent = 'Paused';
    statusBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-950 text-amber-400 border border-amber-800';
    startPauseText.textContent = 'Start';
    startPauseIcon.textContent = '▶';
    clockDisplay.classList.remove('animate-urgent');
}

// Toggle Start / Pause
function togglePlayState() {
    if (isRunning) {
        stopTimer();
    } else {
        if (totalSecondsRemaining <= 0) {
            resetTimer();
        }
        startTimer();
    }
}

// Reset Timer
function resetTimer() {
    stopTimer();
    totalSecondsRemaining = initialTotalSeconds;
    updateDisplay();
    clockDisplay.classList.remove('animate-urgent');
    statusBadge.textContent = 'Ready';
    statusBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-zinc-800 text-zinc-400 border border-zinc-700';
    subLabel.textContent = 'Remaining Time';
    showToast('Timer reset');
}

// Apply Duration from Input Form
function applyCustomTime() {
    const h = parseInt(inputHours.value, 10) || 0;
    const m = parseInt(inputMinutes.value, 10) || 0;
    const s = parseInt(inputSeconds.value, 10) || 0;

    const total = (h * 3600) + (m * 60) + s;
    if (total <= 0) {
        showToast('Please enter a valid time duration', false);
        return;
    }

    stopTimer();
    initialTotalSeconds = total;
    totalSecondsRemaining = total;
    updateDisplay();
    clockDisplay.classList.remove('animate-urgent');
    statusBadge.textContent = 'Ready';
    statusBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-zinc-800 text-zinc-400 border border-zinc-700';
    subLabel.textContent = 'Remaining Time';
    toggleDrawer();
    showToast(`Timer set to ${h > 0 ? h + 'h ' : ''}${m}m ${s}s`);
}

// Preset Handler
function setPreset(h, m, s) {
    inputHours.value = h;
    inputMinutes.value = m;
    inputSeconds.value = s;
    applyCustomTime();
}

// Toggle Drawer Slide-in
function toggleDrawer() {
    const isOpen = controlDrawer.classList.contains('translate-x-0');
    if (isOpen) {
        controlDrawer.classList.remove('translate-x-0');
        controlDrawer.classList.add('translate-x-full');
    } else {
        controlDrawer.classList.remove('translate-x-full');
        controlDrawer.classList.add('translate-x-0');
    }
}

// Toggle Fullscreen Mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
            showToast('Unable to activate fullscreen mode', false);
        });
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

// Fullscreen Icon Listener
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fsIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4m0 0H4m5 0L3 10m11-6h5m-5 0v5m0-5l6 6M9 15v5m0 0h5m-5 0l6-6m-6 6h-5m5 0v-5m0 5l-6-6"></path>';
    } else {
        fsIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>';
    }
});

// Event Listeners
toggleDrawerBtn.addEventListener('click', toggleDrawer);
closeDrawerBtn.addEventListener('click', toggleDrawer);
fullscreenBtn.addEventListener('click', toggleFullscreen);
startPauseBtn.addEventListener('click', togglePlayState);
resetBtn.addEventListener('click', resetTimer);
applyTimeBtn.addEventListener('click', applyCustomTime);
screenClickArea.addEventListener('click', togglePlayState);

presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const h = parseInt(btn.dataset.h, 10);
        const m = parseInt(btn.dataset.m, 10);
        const s = parseInt(btn.dataset.s, 10);
        setPreset(h, m, s);
    });
});

// Sound Toggle Listener
soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggleBtn.textContent = soundEnabled ? 'Enabled' : 'Muted';
    soundToggleBtn.className = soundEnabled
        ? 'px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-white transition'
        : 'px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-500 transition';
    showToast(soundEnabled ? 'Sound effects enabled' : 'Sound effects muted');
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return; // Do not trigger shortcuts while typing

    if (e.code === 'Space') {
        e.preventDefault();
        togglePlayState();
    } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
    } else if (e.code === 'KeyC') {
        e.preventDefault();
        toggleDrawer();
    } else if (e.code === 'Escape') {
        if (controlDrawer.classList.contains('translate-x-0')) {
            toggleDrawer();
        }
    }
});

// Auto-dim UI during fullscreen playback on inactivity
document.addEventListener('mousemove', () => {
    topBar.style.opacity = '0.9';
    footer.style.opacity = '1';
    clearTimeout(inactivityTimeout);

    if (document.fullscreenElement && isRunning) {
        inactivityTimeout = setTimeout(() => {
            if (!controlDrawer.classList.contains('translate-x-0')) {
                topBar.style.opacity = '0.1';
                footer.style.opacity = '0.1';
            }
        }, 3000);
    }
});

// Initial boot
updateDisplay();
