document.addEventListener('DOMContentLoaded', function () {
    const displayTime = document.getElementById('timer');
    const resetButton = document.getElementById('resetButton');
    const pauseButton = document.getElementById('pauseButton')

    let isPaused = false;

    function updateButtonLabels(){
        chrome.storage.local.get(['buttonLabels'],function (result){
            if (result.buttonLabels){
                resetButton.innerHTML = result.buttonLabels.resetButtonLabel;
                pauseButton.innerHTML = result.buttonLabels.pauseButtonLabel;
            }
        })
        pauseButton.innerHTML = isPaused ? "Resume " : "Pause";
    }
    function togglePauseState(){
        isPaused = !isPaused;
        updateButtonLabels();

        chrome.runtime.sendMessage({action: isPaused ? "pauseTimer" : "resumeTimer"});

        chrome.storage.local.set({
            buttonLabels:{
                resetButtonLabel: "Reset Timer",
                pauseButtonLabel: isPaused ? "Resume" : "Pause"
            }
        })

    }
    resetButton.addEventListener('click', function () {
        // Send a message to background.js to reset the timer
        chrome.runtime.sendMessage({ action: "resetTimer" });
        this.innerHTML = "Reset Timer";
        pauseButton.style.display = 'none'
        chrome.storage.local.set({
            buttonLabels:{
                resetButtonLabel: "Reset Timer",
                pauseButtonLabel: "Pause"
            }
        })
        updateButtonLabels();
        // chrome.runtime.sendMessage({action:"startTimer"});
    });

    pauseButton.addEventListener('click',function(){
        chrome.runtime.sendMessage({action: " togglePause"})
        togglePauseState();
    })
    // Listen for changes in the storage and update the display
    chrome.storage.onChanged.addListener(function (changes) {
        if (changes.timerValue) {
            displayTime.innerHTML = changes.timerValue.newValue;
        }
        updateButtonLabels();
    });
    // Send a message to background.js to start the timer only when the button is clicked
    resetButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: "startTimer" });
        pauseButton.style.display = 'inline-block'
    });
});
