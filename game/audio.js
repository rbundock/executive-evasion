const fallen = new Audio('sounds/fallen.mp3');
const gameover = new Audio('sounds/gameover.mp3');
const step = new Audio('sounds/step.mp3');
const restart = new Audio('sounds/restart.mp3');
const treasure_spawn = new Audio('sounds/treasure-spawn.mp3');
const power_up = new Audio('sounds/powerup.mp3');
const zombie_step_0 = new Audio('sounds/move0.mp3');
const zombie_step_1 = new Audio('sounds/move1.mp3');
const zombie_step_2 = new Audio('sounds/move2.mp3');
const zombie_step_3 = new Audio('sounds/move3.mp3');

function playSound(audioElement, volumeLevel = 1) {
    if (!silentMode){
        let sound = audioElement.cloneNode(true);
        sound.volume = volumeLevel;
        sound.play();
    }
}