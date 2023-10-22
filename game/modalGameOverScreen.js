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
 
        // Hide the game over modal
        document.getElementById('gameOverModal').style.display = 'none';

        game.reset();

    }

}