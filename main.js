const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let autoPlayEnabled = false; // This is the flag

let level = 1;
let score = 0;

let numStartingZombies = 6;
let numZombieStepSize = 20;
let maxZombieDelay = 500;

let maxPitCapacity = 3;

/*

TODO:

- xSpeed up the zombies by half for every half that are removed
- Move to a grid
- xZombies to step



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
pitImage.src = 'img/meeting.png'; 

let zombieImage = new Image();
zombieImage.src = 'img/recruiter.png'; 

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let zombieSpeed = 5;

let gameLoopRunning = false;
let levelStartTime;

function gameLoop() {

    if (!gameLoopRunning) {
        gameLoopRunning = true;
        levelStartTime = Date.now();
    }
    canvas.style.cursor = 'none';

    // RESTART
    if (zombies.length === 0) {  // All zombies have been removed
        playSound(restart);
        level++;  // Increase the level
        // zombieSpeed = zombieSpeed + 0.1; // Increase Zombie speed
        console.log("Last level time: " + (Date.now() - levelStartTime) / 1000);
        resetLevel();
    }

    // DRAW ----
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let pit of pits) {
        pit.draw(ctx);
    }

    for (let zombie of zombies) {
        zombie.draw(ctx);
    }

    for (let treasure of treasures) {
        treasure.draw(ctx);
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

   if (shouldSpawnTreasure()) {
        // Only spawn one
        if (treasures.length === 0) {
            const newTreasure = new Treasure();
            treasures.push(newTreasure);
            treasure_spawn.play();
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

    // Reinitialise
    zombieSpeed = 1 // Reset Zombie speed

    // Reset Game
    resetLevel();
    player = new Player(); // Initialize player with random safe location

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

    // console.log("Zombie Delay:" + maxZombieDelay * zombiesLeftPercentage)
    setTimeout(animateZombies, maxZombieDelay * zombiesLeftPercentage);
}


function resetLevel() {

    // TOOD: Make sure Zombies/Pits don't spawn on/near player
    setupPits(5); 
    setupZombies();
    setupTreasure();

    //("ZOMBIE SPEED: " + zombieSpeed);

}

function checkCollisions() {
    for (let pit of pits) {
        if (
            player.x < pit.x + pit.width &&
            player.x + 20 > pit.x &&
            player.y < pit.y + pit.height &&
            player.y + 20 > pit.y
        ) {
            return true;  // Collision with pit detected
        }
    }

    for (let zombie of zombies) {
        if (
            player.x < zombie.x + 20 &&
            player.x + 20 > zombie.x &&
            player.y < zombie.y + 20 &&
            player.y + 20 > zombie.y
        ) {
            return true;  // Collision with zombie detected
        }
    }

    let newTreasures = [];
    for (let treasure of treasures) {
        if (
            player.x < treasure.x + 20 &&
            player.x + 20 > treasure.x &&
            player.y < treasure.y + 20 &&
            player.y + 20 > treasure.y
        ) {
            // Collision detected, add 10 points to the score
            score += 10;
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
            if (
                zombie.x < pit.x + pit.width &&
                zombie.x + 20 > pit.x &&
                zombie.y < pit.y + pit.height &&
                zombie.y + 20 > pit.y 
            ) {

                // Pits have maximum capacity
                if (pit.attendance < maxPitCapacity) {
                    inPit = true;
                    score++;  // Increase the score when a zombie falls into a pit
                    playSound(fallen);
                    pit.incBodies();

                    if (pit.attendance >= maxPitCapacity){
                        // Remove pit !
                        pits = pits.filter(p => p.attendance < maxPitCapacity);
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
    
    return false;  // No collision
}
