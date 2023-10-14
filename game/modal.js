// Listen for the first keypress to hide the modal and start the game
window.addEventListener('keydown', function startKeyListener() {
    startGame();
    window.removeEventListener('keydown', startKeyListener); // Remove this listener to avoid calling startGame() again
});

document.getElementById('restartButton').addEventListener('click', () => {
    // Reset the game state
    level = 1;
    score = 0;
    setupPits(); 
    setupZombies();
    
    playSound(restart);

    // Hide the game over modal
    document.getElementById('gameOverModal').style.display = 'none';

    // Start the game loop again
    gameLoop();
    if (autoPlayEnabled) {
        playAI(player, zombies, pit);
    }
});
