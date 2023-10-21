const fallen = new Audio('sounds/fallen.mp3');
const gameover = new Audio('sounds/gameover.mp3');
const step = new Audio('sounds/step.mp3');
const restart = new Audio('sounds/restart.mp3');
const treasure_spawn = new Audio('sounds/treasure-spawn.mp3');
const zombie_step = new Audio('');

function playSound(audioElement) {
    let sound = audioElement.cloneNode(true);
    sound.play();
}