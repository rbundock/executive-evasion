class ModalGameOverScreen {

    static loadGameOverScreen() {

        document.getElementById('finalScore').textContent = 'Your Final Score: ' + score;
        //sendScoreAndGenerateQR(score);
        document.getElementById('gameOverModal').style.display = 'flex';

        canvas.style.cursor = 'auto';

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

        // Function to handle left and right arrow navigation for focusable elements
        function handleArrowNavigation(element, event) {
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

        // Handle keydown events for focus cycling using arrow keys
        const focusableElements = Array.from(document.querySelectorAll('.initial-dropdown, #submitInitials'));

        // Attach event listeners to dropdowns
        document.querySelectorAll('.initial-dropdown').forEach(dropdown => {
            dropdown.addEventListener('keydown', (event) => {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                    event.preventDefault();
                    
                    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                        const change = (event.key === 'ArrowUp') ? -1 : 1;
                        let newIndex = dropdown.selectedIndex + change;

                        // Handle looping for up and down arrows
                        if (newIndex < 0) newIndex = dropdown.options.length - 1;
                        else if (newIndex >= dropdown.options.length) newIndex = 0;

                        dropdown.selectedIndex = newIndex;
                    } else {
                        handleArrowNavigation(dropdown, event);
                    }
                }
            });
        });

        // Attach event listener to the "Submit" button for left and right arrow navigation
        document.getElementById('submitInitials').addEventListener('keydown', (event) => {
            if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
                handleArrowNavigation(event.target, event);
            }
        });
        
        // Handle initials submission
        document.getElementById('submitInitials').addEventListener('click', function() {
            const initials = `${document.getElementById('initial1').value}${document.getElementById('initial2').value}${document.getElementById('initial3').value}`;
            ModalGameOverScreen.saveScore(initials,score );
            ModalGameOverScreen.unloadGameOverScreen(); 
        });

        ModalGameOverScreen.renderLeaderboard();
        document.getElementById('initial1').focus();
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

        return sortedScores.slice(0, numLeaderBoardPositions);
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
 
        // Hide the game over modal
        document.getElementById('gameOverModal').style.display = 'none';

        game.start();

    }

}