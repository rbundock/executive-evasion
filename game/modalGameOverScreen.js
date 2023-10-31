class ModalGameOverScreen {

    static initGameOverScreen() {

        // Populate dropdowns with the alphabet
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        document.querySelectorAll('.initial-dropdown').forEach(dropdown => {
            alphabet.forEach(char => {
                const option = document.createElement('option');
                option.value = char;
                option.textContent = char;
                dropdown.appendChild(option);
            });
        });

    }

    static dropdownKeyHandler(event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
            
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                const change = (event.key === 'ArrowUp') ? -1 : 1;
                let newIndex = event.target.selectedIndex + change;

                // Handle looping for up and down arrows
                if (newIndex < 0) newIndex = event.target.options.length - 1;
                else if (newIndex >= event.target.options.length) newIndex = 0;

                event.target.selectedIndex = newIndex;
            } else {
                ModalGameOverScreen.handleArrowNavigation(event.target, event);
            }
        }
    }

    static submitKeyHandler(event) {
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
            ModalGameOverScreen.handleArrowNavigation(event.target, event);
        }
    }

    static submitClickHandler() {
        const initials = `${document.getElementById('initial1').value}${document.getElementById('initial2').value}${document.getElementById('initial3').value}`;

        // remove event listeners to dropdowns
        document.querySelectorAll('.initial-dropdown').forEach(dropdown => {
            dropdown.removeEventListener('keydown', ModalGameOverScreen.dropdownKeyHandler);
        });
        document.getElementById('submitInitials').removeEventListener('keydown', ModalGameOverScreen.submitKeyHandler);
        document.getElementById('submitInitials').removeEventListener('click', ModalGameOverScreen.submitClickHandler);

        ModalGameOverScreen.saveScore(initials, score);
        ModalGameOverScreen.unloadGameOverScreen(); 
    }

    static handleArrowNavigation(element, event) {
        const focusableElements = Array.from(document.querySelectorAll('.initial-dropdown, #submitInitials'));
        const focusableIndex = focusableElements.indexOf(element);
        let nextIndex;

        if (event.key === 'ArrowLeft') {
            nextIndex = focusableIndex - 1;
        } else if (event.key === 'ArrowRight') {
            nextIndex = focusableIndex + 1;
        }

        // Handle looping for left and right arrows
        if (nextIndex < 0) nextIndex = focusableElements.length - 1;
        else if (nextIndex >= focusableElements.length) nextIndex = 0;

        focusableElements[nextIndex].focus();
    }

    static loadGameOverScreen() {

        document.getElementById('finalScore').textContent = 'Your Final Score: ' + score;
        //sendScoreAndGenerateQR(score);
        document.getElementById('gameOverModal').style.display = 'flex';

        canvas.style.cursor = 'auto';

         // Attach event listeners to dropdowns
         document.querySelectorAll('.initial-dropdown').forEach(dropdown => {
            dropdown.addEventListener('keydown', ModalGameOverScreen.dropdownKeyHandler);
        });

        // Attach event listener to the "Submit" button for left and right arrow navigation
        const submitButton = document.getElementById('submitInitials');
        submitButton.addEventListener('keydown', ModalGameOverScreen.submitKeyHandler);
        
        // Handle initials submission
        submitButton.addEventListener('click', ModalGameOverScreen.submitClickHandler);

        ModalGameOverScreen.renderLeaderboard();
        document.getElementById('initial1').focus();

        // Initialize joystick support
        this.initJoystick();
    }

    static getSortedScores() {
        const scores = JSON.parse(localStorage.getItem('gameScores')) || [];
        const sortedScores = scores.sort((a, b) => {
            if (a.score !== b.score) {
                return b.score - a.score;  // Primary sort by score
            } else {
                return a.timeTaken - b.timeTaken;  // Secondary sort by time taken (assuming smaller is better)
            }
        });

        for (let score of sortedScores) {
            console.log(score.score + " in " + score.timeTaken);
        }

        return sortedScores.slice(0, numLeaderBoardPositions);
    }

    static clearLeaderboardWithConfirmation() {
        if (window.confirm("Are you sure you want to clear the leaderboard? This action cannot be undone.")) {
            localStorage.removeItem('gameScores');
        }
    }
    
    static renderLeaderboard() {
        const leaderboardContainer = document.getElementById('leaderboard');
        const sortedScores = ModalGameOverScreen.getSortedScores();
    
        // Clear previous leaderboard entries
        leaderboardContainer.innerHTML = '';
    
        // Create a header for the leaderboard
        const header = document.createElement('h2');
        header.textContent = 'Leaderboard';
        leaderboardContainer.appendChild(header);
    
        // Display scores
        sortedScores.forEach((entry, index) => {
            const scoreEntry = document.createElement('p');
            scoreEntry.textContent = `${index + 1}. ${entry.initials}: ${entry.score}`;
            leaderboardContainer.appendChild(scoreEntry);
        });
    }

    static initJoystick() {
        // Variable to hold the current dropdown index
        let currentDropdownIndex = 0;

        // List of dropdown elements
        const dropdowns = document.querySelectorAll('.initial-dropdown');

        window.addEventListener('gamepadconnected', (event) => {
            console.log('Gamepad connected:', event.gamepad);

            // Start the gamepad loop
            const gamepadLoop = setInterval(() => {
                // Get the state of the connected gamepad
                const gamepad = navigator.getGamepads()[event.gamepad.index];

                // Check for joystick and button input
                // Axis information is usually on gamepad.axes, button info on gamepad.buttons
                if (gamepad.axes[1] < -0.5) { // Move up
                    const selectedIndex = dropdowns[currentDropdownIndex].selectedIndex;
                    if (selectedIndex > 0) {
                        dropdowns[currentDropdownIndex].selectedIndex = selectedIndex - 1;
                    }
                } else if (gamepad.axes[1] > 0.5) { // Move down
                    const selectedIndex = dropdowns[currentDropdownIndex].selectedIndex;
                    if (selectedIndex < 25) { // Assuming 26 letters in the dropdown
                        dropdowns[currentDropdownIndex].selectedIndex = selectedIndex + 1;
                    }
                }

                // Check for fire button (usually button 0)
                if (gamepad.buttons[0].pressed) {
                    if (currentDropdownIndex < dropdowns.length - 1) {
                        // Move to next dropdown
                        currentDropdownIndex++;
                    } else {
                        // Submit the form or whatever the final action is
                        // Your submit function here
                        ModalGameOverScreen.submitClickHandler();
                        clearInterval(gamepadLoop); // Stop the gamepad loop once submitted
                    }
                }

            }, 100); // Run every 100ms
        });
    }

    static saveScore(initials, score) {
        const scores = JSON.parse(localStorage.getItem('gameScores')) || [];

        const scoreEntry = {
            initials: initials,
            score: score,
            timeTaken: game.lastGameTime(),
            timestamp: new Date().toISOString()  // Stores the current date and time as a string in ISO format
        };

        console.log("Score saved " + scoreEntry);

        scores.push(scoreEntry);
        localStorage.setItem('gameScores', JSON.stringify(scores));
    }

    static unloadGameOverScreen() {
 
        // Remove keydown event listener from dropdowns
        document.querySelectorAll('.initial-dropdown').forEach(dropdown => {
            dropdown.removeEventListener('keydown', ModalGameOverScreen.dropdownKeyHandler);
        });

        // Remove keydown and click event listeners from the submit button
        const submitButton = document.getElementById('submitInitials');
        submitButton.removeEventListener('keydown', ModalGameOverScreen.submitKeyHandler);
        submitButton.removeEventListener('click', ModalGameOverScreen.submitClickHandler);

        // Hide the game over modal
        document.getElementById('gameOverModal').style.display = 'none';

        game.start();

    }

}