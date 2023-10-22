class ModalIntroScreen {



    static loadIntroScreen() {

        document.getElementById('startModal').style.display = 'flex';

        // Listen for the first keypress to hide the modal and start the game
        window.addEventListener('keydown', function startKeyListener() {
            document.getElementById('startModal').style.display = 'none';
            game.start();
            window.removeEventListener('keydown', startKeyListener); // Remove this listener to avoid calling startGame() again
        });
    
    }

    static unloadIntroScreen() {
        document.getElementById('startModal').style.display = 'none';
    }
}