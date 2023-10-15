const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let autoPlayEnabled = false; // This is the flag

let level = 1;
let score = 0;

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


let gameLoopRunning = false;

function gameLoop() {

    gameLoopRunning = true;

    if (zombies.length === 0) {  // All zombies have been removed
        playSound(restart);
        level++;  // Increase the level
        setupPits(); 
        setupZombies();  // Restart the game with more zombies
        setupTreasure();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let pit of pits) {
        pit.draw(ctx);
    }

    for (let zombie of zombies) {
        zombie.moveTowards(player);
        zombie.draw(ctx);
    }

    for (let treasure of treasures) {
        treasure.draw(ctx);
    }
    
    player.draw(ctx);
	drawScore();
    drawLevel();

    if (checkCollisions()) {
        playSound(gameover);
        document.getElementById('finalScore').textContent = 'Your Final Score: ' + score;
        sendScoreAndGenerateQR(score);
        document.getElementById('gameOverModal').style.display = 'flex';
        gameLoopRunning = false;
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
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function startGame() {
    player = new Player(); // Initialize player with random safe location
    document.getElementById('startModal').style.display = 'none';
    setupPits(); 
    setupZombies();
    setupTreasure();
    playSound(restart);
    gameLoop(); // Start the game loop
    if (autoPlayEnabled) {
        playAI(player, zombies, pit);
    }
}

function checkCollisions() {
    for (let pit of pits) {
        if (
            player.x < pit.x + pit.width &&
            player.x + 20 > pit.x &&
            player.y < pit.y + pit.height &&
            player.y + 20 > pit.y
        ) {
            return true;  // Collision detected
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
                inPit = true;
                score++;  // Increase the score when a zombie falls into a pit
                playSound(fallen);
                spawnZombie(player.x, player.y);  // Create another zombie
                break;
            }
        }
        if (!inPit) {
            newZombies.push(zombie);
        }
    }
    zombies = newZombies;
    
    return false;  // No collision
}
