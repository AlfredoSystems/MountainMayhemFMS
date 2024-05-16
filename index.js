document.addEventListener('DOMContentLoaded', function () {

    // Objectives data
    var objectivesData = [
        ["Auto Snow", 10, 1000],
        ["Auto Park", 5, 20],
        ["Teleop Snow", 5, 1000],
        ["Endgame Park", 5, 30],
        ["Rock Bonus", 15, 15],
        ["Pass Bonus", 10, 10]
    ];

    // Get Alliances
    var alliancesDivs = document.querySelectorAll('.alliance');
    alliancesDivs.forEach(function(allianceDiv) {

        // Add objectives and inputs
        var objectivesDiv = allianceDiv.querySelector('.objectives');
        objectivesData.forEach(function(objective) {
            var objectiveDiv = document.createElement('div');
            objectiveDiv.classList.add('objective');

            var span = document.createElement('span');
            span.textContent = objective[0];

            var input = document.createElement('input');
            input.type = 'text';
            input.value = '0';

            var plusButton = document.createElement('button');
            plusButton.textContent = '+';
            plusButton.classList.add('plus-button');

            var minusButton = document.createElement('button');
            minusButton.textContent = '-';
            minusButton.classList.add('minus-button');

            plusButton.addEventListener('click', function() {
                var input = plusButton.previousElementSibling;
                if(parseInt(input.value) < objective[2]){
                    input.value = parseInt(input.value) + objective[1];
                }
                updateTotalPoints();
            });

            minusButton.addEventListener('click', function() {
                var input = minusButton.previousElementSibling.previousElementSibling;
                if (parseInt(input.value) > 0) {
                    input.value = parseInt(input.value) - objective[1];
                }
                updateTotalPoints();
            });

            objectiveDiv.appendChild(span);
            objectiveDiv.appendChild(input);
            objectiveDiv.appendChild(plusButton);
            objectiveDiv.appendChild(minusButton);

            objectivesDiv.appendChild(objectiveDiv);
        });

        // Add total points span and input
        var totalPointsDiv = allianceDiv.querySelector('.total-points');
        var totalPointsSpan = document.createElement('span');
        totalPointsSpan.textContent = 'Total Points:';

        var totalPointsInput = document.createElement('input');
        totalPointsInput.type = 'text';
        totalPointsInput.value = '0';

        totalPointsDiv.appendChild(totalPointsSpan);
        totalPointsDiv.appendChild(totalPointsInput);

    });


    function updateTotalPoints(){
        // Get Alliances
        var alliancesDivs = document.querySelectorAll('.alliance');
        alliancesDivs.forEach(function(allianceDiv) {

            // Add objectives and inputs
            var objectiveInputDivs = allianceDiv.querySelectorAll('.objectives input');

            let total = 0
            objectiveInputDivs.forEach(function(input) {
                total += parseInt(input.value)
            });

            // Add total points span and input
            var totalPointsInput = allianceDiv.querySelector('.total-points input');
            totalPointsInput.value = total;
        });
    }


    const startButton = document.querySelector('.start');
    const stopButton = document.querySelector('.stop');
    const replayButton = document.querySelector('.replay');
    const timerNumber = document.querySelector('.timer-number');
    const timerBar = document.querySelector('.timer-bar');

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
        timeLeft = 150
        updateTimerDisplay(timeLeft);
        
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

    function playSound(audioElement){
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.play();
    }
});