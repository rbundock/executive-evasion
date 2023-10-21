const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 48;
const stepSize = 24;
const pitSize = gridSize * 5;
const minSpawnDistanceFromPlayer = gridSize * 6;
const safeBorderSize = gridSize * 3;
const spawnDistanceTreasure = gridSize * 6;
const numPitsPerLevel = 5;

const debugMode = false;

const gamepad = navigator.getGamepads()[0];

let autoPlayEnabled = false; // This is the flag

let level = 1;
let score = 0;

let numStartingZombies = 20;
let numZombieStepSize = gridSize / 2;
let maxZombieDelay = 300; // in ms
let minZombieDelay = 90; // in ms

let minPitCapacity = 1;
let maxPitCapacity = 4;

/*

TODO:

- xSpeed up the zombies by half for every half that are removed
- xMove to a grid
- xZombies to step

GRAPHICS
- https://limezu.itch.io/modernoffice

AUDIO
- https://www.youtube.com/watch?v=oy_usKHTXOY

*//////



// Initilise 
let player;
let zombies = [];
let pits = [];      
let treasures = [];    

let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

let playerImage = new Image();
playerImage.src = 'img/cto_1.png';  

let pitImage = new Image();
pitImage.src = 'img/meeting_room.png'; 

let zombieImage = new Image();
zombieImage.src = 'img/recruiter.png'; 

let tileImage = new Image();
tileImage.src = 'img/floor_tile.png';

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log("Grid area:" + parseInt(canvas.width/gridSize) * parseInt(canvas.height/gridSize));

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    console.log("Grid area:" + parseInt(canvas.width/gridSize) * parseInt(canvas.height/gridSize));
});

let gameLoopRunning = false;
let levelStartTime;

function gameLoop() {

    if (!gameLoopRunning) {
        gameLoopRunning = true;
        levelStartTime = Date.now();
    }
    canvas.style.cursor = 'none';

    if (gamepad) {
        console.log("Gamepad: " + gamepad.axes[0]);
    }


    // RESTART
    if (zombies.length === 0 && !debugMode) {  // All zombies have been removed
        playSound(restart);
        level++;  // Increase the level
        // zombieSpeed = zombieSpeed + 0.1; // Increase Zombie speed
        console.log("Last level time: " + (Date.now() - levelStartTime) / 1000);
        resetLevel();
    }

    // DRAW ----
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw the floor    
    drawFloorTiles();

    if (debugMode) {
        ctx.globalAlpha = 0.5;  // Set transparency level (0 to 1)
        ctx.fillStyle = 'green';
        ctx.fillRect(safeBorderSize/2, safeBorderSize/2, canvas.width - safeBorderSize, canvas.height - safeBorderSize);
        ctx.globalAlpha = 1;  // Reset
    }

    for (let treasure of treasures) {
        treasure.draw(ctx);
    }

    for (let pit of pits) {
        pit.draw(ctx);
    }

    for (let zombie of zombies) {
        zombie.draw(ctx);
    }
    

    player.draw(ctx);
	drawScore();
    drawLevel();
    /// 


    if (checkCollisions()) {
        gameLoopRunning = false;
        
        console.log("Total game time: " + (Date.now() - levelStartTime) / 1000);

        playSound(gameover);
        document.getElementById('finalScore').textContent = 'Your Final Score: ' + score;
        sendScoreAndGenerateQR(score);
        document.getElementById('gameOverModal').style.display = 'flex';

        canvas.style.cursor = 'auto';
        return;  // End the game loop by not calling requestAnimationFrame
    }

    // If the player has closed a pit, then spawn treasure to help them out
    if (pits.length < numPitsPerLevel) {
        if (shouldSpawnTreasure()) {
            // Only spawn one
            if (treasures.length === 0) {
                const newTreasure = new Treasure();
                treasures.push(newTreasure);
                treasure_spawn.play();
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    
    // If the game loop is not running don't try to move the player
    if (!gameLoopRunning) {
        return;
    }

    if (!keys[e.code]) {
        keys[e.code] = true;

        switch(e.code) {
            case 'ArrowLeft':
                player.move('left');
                break;
            case 'ArrowRight':
                player.move('right');
                break;
            case 'ArrowUp':
                player.move('up');
                break;
            case 'ArrowDown':
                player.move('down');
                break;
        }
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function startGame() {

    document.getElementById('startModal').style.display = 'none';

    // Reset Game
    player = new Player(); // Initialize player with random safe location
    resetLevel();

    //playSound(restart);
    gameLoop(); // Start the game loop
    animateZombies();
    if (autoPlayEnabled) {
        playAI(player, zombies, pit);
    }
}

function animateZombies() {

    // If the game loop is not running, don't try to move the zombies
    if (!gameLoopRunning) {
        return;
    }

    // Percentage of Zombies left
    let zombiesLeftPercentage = zombies.length / numStartingZombies;

    // Animate
    zombies.forEach(zombie => {
        zombie.moveTowards(player);
    });

    playSound(zombie_step);

    // console.log("Zombie Delay:" + maxZombieDelay * zombiesLeftPercentage)
    setTimeout(animateZombies, minZombieDelay + (maxZombieDelay * zombiesLeftPercentage));
}


function resetLevel() {

    // TOOD: Make sure Zombies/Pits don't spawn on/near player
    setupPits(numPitsPerLevel); 
    setupZombies();
    setupTreasure();

    //("ZOMBIE SPEED: " + zombieSpeed);

}

function checkCollisions() {
    for (let pit of pits) {
        if (isColliding(pit, player)) {
            return true;  // Collision with zombie detected
        }
    }

    
    for (let zombie of zombies) {
        if (isColliding(zombie, player)) {
            return true;  // Collision with zombie detected
        }
    }
    

    let newTreasures = [];
    for (let treasure of treasures) {
        if (isColliding(treasure, player)) {
            // Collision detected, add 10 points to the score
            score += 10;
            spawnPit(1);
        } else {
            newTreasures.push(treasure);
        }
    }
    treasures = newTreasures;

    // Check for collisions between zombies and pits, and remove zombies in pits
    let newZombies = [];
    for (let zombie of zombies) {
        let inPit = false;
        for (let pit of pits) {
            if (isColliding(pit, zombie)) {

                // Pits have maximum capacity
                if (pit.capacity > 0) {
                    inPit = true;
                    score++;  // Increase the score when a zombie falls into a pit
                    playSound(fallen);
                    pit.incBodies();

                    if (pit.capacity === 0){
                        // Remove pit !
                        pits = pits.filter(p => p.capacity > 0);
                    }
                    //spawnZombie(player.x, player.y);  // Create another zombie
                    break;
                }
            
            }
        }
        if (!inPit) {
            newZombies.push(zombie);
        }
    }
    zombies = newZombies;
    
    return false;  // No collision with player
}
