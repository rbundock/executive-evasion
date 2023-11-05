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

    static dropdownKeyHandler(eventCode) {

        const change = (eventCode === 'ArrowUp') ? -1 : 1;
        let newIndex = document.activeElement.selectedIndex + change;

        // Handle looping for up and down arrows
        if (newIndex < 0) newIndex = document.activeElement.options.length - 1;
        else if (newIndex >= document.activeElement.options.length) newIndex = 0;

        document.activeElement.selectedIndex = newIndex;

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
        //document.querySelectorAll('.initial-dropdown').forEach(dropdown => {
        //    dropdown.removeEventListener('keydown', ModalGameOverScreen.dropdownKeyHandler);
        ///});
        //document.getElementById('submitInitials').removeEventListener('keydown', ModalGameOverScreen.submitKeyHandler);
        //document.getElementById('submitInitials').removeEventListener('click', ModalGameOverScreen.submitClickHandler);

        ModalGameOverScreen.saveScore(initials, score);
        ModalGameOverScreen.unloadGameOverScreen();
    }

    static handleArrowNavigation(eventCode) {
        const focusableElements = Array.from(document.querySelectorAll('.initial-dropdown, #submitInitials'));
        const focusableIndex = focusableElements.indexOf(document.activeElement);
        let nextIndex;

        if (eventCode === 'ArrowLeft') {
            nextIndex = focusableIndex - 1;
        } else if (eventCode === 'ArrowRight') {
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

        window.addEventListener('keydown', ModalGameOverScreen.startKeyListener);


        // Attach event listeners to dropdowns
        // document.querySelectorAll('.initial-dropdown').forEach(dropdown => {
        //     dropdown.addEventListener('keydown', ModalGameOverScreen.dropdownKeyHandler);
        // });

        // Attach event listener to the "Submit" button for left and right arrow navigation
        // const submitButton = document.getElementById('submitInitials');
        //  submitButton.addEventListener('keydown', ModalGameOverScreen.submitKeyHandler);

        // Handle initials submission
        //  submitButton.addEventListener('click', ModalGameOverScreen.submitClickHandler);

        ModalGameOverScreen.renderLeaderboard();
        document.getElementById('initial1').focus();
    }

    static startKeyListener(event) {

        // dispatch
        switch (event.code) {

            case "ArrowLeft":
            case "ArrowRight":
                ModalGameOverScreen.handleArrowNavigation(event.code);
                break;

            case "ArrowUp":
            case "ArrowDown":
                if (document.activeElement.className === "initial-dropdown") {
                    event.preventDefault()
                    ModalGameOverScreen.dropdownKeyHandler(event.code);
                }
                break;

            case "Space":
            case "Enter":
                ModalGameOverScreen.submitClickHandler();
                break;

        }

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
        //document.querySelectorAll('.initial-dropdown').forEach(dropdown => {
        //    dropdown.removeEventListener('keydown', ModalGameOverScreen.dropdownKeyHandler);
        //});

        // Remove keydown and click event listeners from the submit button
        //const submitButton = document.getElementById('submitInitials');
        //submitButton.removeEventListener('keydown', ModalGameOverScreen.submitKeyHandler);
        // submitButton.removeEventListener('click', ModalGameOverScreen.submitClickHandler);

        window.removeEventListener('keydown', ModalGameOverScreen.startKeyListener);

        // Hide the game over modal
        document.getElementById('gameOverModal').style.display = 'none';

        game.start();

    }

}