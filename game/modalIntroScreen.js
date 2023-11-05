class ModalIntroScreen {

    static loadIntroScreen() {
        document.getElementById('startModal').style.display = 'flex';
        // Add the static method as an event listener
        window.addEventListener('keydown', ModalIntroScreen.startKeyListener);
    }

    static startGame(){
        document.getElementById('startModal').style.display = 'none';
        game.start();
        window.removeEventListener('keydown', ModalIntroScreen.startKeyListener);
    }

    static startKeyListener(event) {
        
        ModalIntroScreen.startGame();
    }

    static unloadIntroScreen() {
        document.getElementById('startModal').style.display = 'none';
    }
}
