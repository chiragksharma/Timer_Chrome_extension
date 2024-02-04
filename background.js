let timer = null;
let isPaused = false;
let [hrs, min, sec] = [0, 0, 0];

function updateDisplay() {
    const displayTime = `${hrs.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    chrome.storage.local.set({ timerValue: displayTime });
}

function logic() {
    sec++;
    if (sec === 60) {
        sec = 0;
        min++;
        if (min === 60) {
            min = 0;
            hrs++;
        }
    }
    updateDisplay();
}

function startTimer() {
    if (!timer) { // Create a new timer if not already running
        timer = setInterval(logic, 1000);
    }
}

function pauseTimer() {
    if (timer) {
        clearInterval(timer); // Stop the timer
        timer = null; // Clear the timer variable
    }
}

function resetTimer() {
    pauseTimer(); // Ensure the timer is stopped
    [hrs, min, sec] = [0, 0, 0]; // Reset time
    updateDisplay(); // Update the display immediately
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.action) {
        case "startTimer":
            if (isPaused) {
                isPaused = false;
                startTimer();
            } else {
                resetTimer();
                startTimer();
            }
            break;
        case "togglePause":
            if (isPaused) {
                isPaused = false;
                startTimer();
            } else {
                isPaused = true;
                pauseTimer();
            }
            break;
        case "resetTimer":
            resetTimer();
            break;
    }
});
