document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.querySelector('.start');
    const stopButton = document.querySelector('.stop');
    const replayButton = document.querySelector('.replay');
    const timerNumber = document.querySelector('.timer-number');
    const timerBar = document.querySelector('.timer-bar');

    const redAmpInput = document.querySelector('.alliance.red input[name="amp"]');
    const blueAmpInput = document.querySelector('.alliance.blue input[name="amp"]');
    const redSpeakerInput = document.querySelector('.alliance.red input[name="speaker"]');
    const blueSpeakerInput = document.querySelector('.alliance.blue input[name="speaker"]');
    const redTrapInput = document.querySelector('.alliance.red input[name="trap"]');
    const blueTrapInput = document.querySelector('.alliance.blue input[name="trap"]');
    const redOnstageInput = document.querySelector('.alliance.red input[name="onstage"]');
    const blueOnstageInput = document.querySelector('.alliance.blue input[name="onstage"]');
    const redHarmonyInput = document.querySelector('.alliance.red input[name="harmony"]');
    const blueHarmonyInput = document.querySelector('.alliance.blue input[name="harmony"]');

    const redTotalPointsInput = document.querySelector('.alliance.red .total-points input');
    const blueTotalPointsInput = document.querySelector('.alliance.blue .total-points input');

    const audioAuto = document.getElementById('audioAuto');
    const audioTeleop = document.getElementById('audioTeleop');
    const audioEndgame = document.getElementById('audioEndgame');
    const audioEnd = document.getElementById('audioEnd');
    const audioFault = document.getElementById('audioFault');

    let gameState = "prematch"; //prematch, auto, teleop, postmatch, fault
    let timerInterval;
    let timeLeft = 150; // Total time in seconds

    startButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', faultTimer);
    replayButton.addEventListener('click', resetTimer);

    document.addEventListener('keydown', function (event) {
        let ampScore = 1;
        let speakerScore = 2;

        if (gameState == 'auto'){
            ampScore = 2;
            speakerScore = 5;
        }
        
        if ('q' === event.key.toLowerCase()) {
            increaseScore(redSpeakerInput, speakerScore);
        } else if ('9' === event.key.toLowerCase()) {
            increaseScore(blueSpeakerInput, speakerScore);
        
        } else if ('a' === event.key.toLowerCase()) {
            increaseScore(redAmpInput, ampScore);
        } else if ('6' === event.key.toLowerCase()) {
            increaseScore(blueAmpInput, ampScore);
        
        } else if ('z' === event.key.toLowerCase()) {
            increaseScore(redTrapInput, 5, 15);
        } else if ('3' === event.key.toLowerCase()) {
            increaseScore(blueTrapInput, 5, 15);

        } else if ('s' === event.key.toLowerCase()) {
            increaseScore(redOnstageInput, 3, 9);
        } else if ('5' === event.key.toLowerCase()) {
            increaseScore(blueOnstageInput, 3, 9);

        } else if ('x' === event.key.toLowerCase()) {
            increaseScore(redHarmonyInput, 2, 2);
        } else if ('2' === event.key.toLowerCase()) {
            increaseScore(blueHarmonyInput, 2, 2);
        }
    });

    function startTimer() {
        if (gameState == "prematch") {
            gameState = "auto";
            playSound(audioAuto);
            timerInterval = setInterval(updateTimer, 1000);
        }
    }

    function updateTimer() {
        updateTimerDisplay(--timeLeft);

        if (timeLeft == 135) {
            gameState = "teleop";
            playSound(audioTeleop);
        }

        if (timeLeft == 20) {
            playSound(audioEndgame);
        }

        if (timeLeft <= 0) {
            gameState = "postmatch";
            playSound(audioEnd);
            clearInterval(timerInterval);
        }
    }

    function faultTimer() {
        gamestate = "fault";
        playSound(audioFault);
        clearInterval(timerInterval);
    }

    function resetTimer() {
        gamestate = "prematch";
        clearInterval(timerInterval);
        updateTimerDisplay(150);

        let redObjectives = [redAmpInput,redSpeakerInput,redTrapInput,redOnstageInput,redHarmonyInput];
        let blueObjectives = [blueAmpInput,blueSpeakerInput,blueTrapInput,blueOnstageInput,blueHarmonyInput];

        redObjectives.forEach(element => {
            element.value = 0;
        });

        blueObjectives.forEach(element => {
            element.value = 0;
        });

        updateTotalPoints()
    }

    function updateTimerDisplay(newTime) {
        timeLeft = newTime;
        timerNumber.innerHTML = timeLeft;
        let percentageLeft = (timeLeft / 150) * 100;
        timerBar.style.background = `linear-gradient(to right, #4CAF50 ${percentageLeft}%, grey 0%)`;
    }

    function increaseScore(inputElement, scoreValue, maxScore=1000) {
        let newValue = parseInt(inputElement.value) + scoreValue;
        if(newValue <= maxScore) inputElement.value = newValue;
        updateTotalPoints();
    }

    function updateTotalPoints() {
        let redObjectives = [redAmpInput,redSpeakerInput,redTrapInput,redOnstageInput,redHarmonyInput];
        let blueObjectives = [blueAmpInput,blueSpeakerInput,blueTrapInput,blueOnstageInput,blueHarmonyInput];
        let redTotal = 0;
        let blueTotal = 0;

        redObjectives.forEach(element => {
            redTotal += parseInt(element.value);
        });

        blueObjectives.forEach(element => {
            blueTotal += parseInt(element.value);
        });

        redTotalPointsInput.value = redTotal;
        blueTotalPointsInput.value = blueTotal;
    }

    function playSound(audioElement){
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.play();
    }
});