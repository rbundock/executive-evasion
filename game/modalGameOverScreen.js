class ModalGameOverScreen {

    static loadGameOverScreen() {

        document.getElementById('finalScore').textContent = 'Your Final Score: ' + score;
        sendScoreAndGenerateQR(score);
        document.getElementById('gameOverModal').style.display = 'flex';

        canvas.style.cursor = 'auto';

        document.getElementById('restartButton').addEventListener('click', () => { 
            ModalGameOverScreen.unloadGameOverScreen(); 
        });
    }

    static unloadGameOverScreen() {
        // Reset the game state
        level = 1;
        score = 0;
        
        resetLevel();
        
        playSound(restart);

        // Hide the game over modal
        document.getElementById('gameOverModal').style.display = 'none';

        // Start the game loop again
        gameLoop();
        animateZombies();
        if (autoPlayEnabled) {
            playAI(player, zombies, pit);
        }
    }

}