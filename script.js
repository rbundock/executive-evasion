const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const fallen = new Audio('sounds/fallen.mp3');
const gameover = new Audio('sounds/gameover.mp3');
const step = new Audio('sounds/step.mp3');
const restart = new Audio('sounds/restart.mp3');

let autoPlayEnabled = true; // This is the flag

let level = 1;
let score = 0;

let zombies = [];
let pits = [];

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

class Player {
    constructor() {
        let safeSpawn = false;  // Flag to check if spawn location is safe
        let x, y; // Declare the coordinates of the player

        while (!safeSpawn) {
            // Generate random coordinates within the canvas
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;

            // Check if this position overlaps with any pit or zombie
            if (!overlapsEntity(x, y, pits, 100) && !overlapsEntity(x, y, zombies, 100)) {
                safeSpawn = true;  // Found a safe spawn location
            }
        }

        this.x = x;
        this.y = y;
        this.stepSize = 19;  // Set the step size (adjust as needed)
    }
    
    move(direction) {
        playSound(step);
        switch(direction) {
            case 'left':
                this.x = Math.max(0, this.x - this.stepSize);
                break;
            case 'right':
                this.x = Math.min(canvas.width - 20, this.x + this.stepSize);
                break;
            case 'up':
                this.y = Math.max(0, this.y - this.stepSize);
                break;
            case 'down':
                this.y = Math.min(canvas.height - 20, this.y + this.stepSize);
                break;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, 20, 20);

        // Make sure the image is loaded before drawing
        if (playerImage.complete) {
            ctx.drawImage(playerImage, this.x, this.y, 80, 80);
        }
    }
}

class Pit {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (pitImage.complete) {
            ctx.drawImage(pitImage, this.x, this.y, this.width, this.height);
        }

    }

}

class Zombie {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 1;  // Adjust speed as needed
    }

    moveTowards(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, 20, 20);

        // Make sure the image is loaded before drawing
        if (zombieImage.complete) {
            ctx.drawImage(zombieImage, this.x, this.y, 80, 157);
        }
    }
}

let player;
let gameLoopRunning = false;

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawLevel() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Level: ' + level, 10, 60);  // Positioning it below the score
}

function overlapsEntity(x, y, entities, buffer) {
    for (let entity of entities) {
        let distance = Math.sqrt(Math.pow(entity.x - x, 2) + Math.pow(entity.y - y, 2));
        if (distance < buffer) {  
            return true;  // Overlap detected
        }
    }
    return false;  // No overlap
}

function setupPits() {
    pits = [];  // Clear any existing pits
    let attempts = 0;  // Variable to track the number of attempts to place a pit

    while (pits.length < 5 && attempts < 1000) {  // Create 5 pits, with a limit on attempts to prevent an infinite loop
        let x = Math.random() * (canvas.width - 100);  // Random X position, ensuring pit fits within canvas
        let y = Math.random() * (canvas.height - 100);  // Random Y position, ensuring pit fits within canvas

        // Check for overlap with existing pits
        let overlapping = false;
        for (let pit of pits) {
            let distance = Math.sqrt(Math.pow(pit.x - x, 2) + Math.pow(pit.y - y, 2));
            if (distance < (pit.width*2)) {  // Twice the pit width, adjust as needed
                overlapping = true;
                break;
            }
        }

        if (!overlapping) {
            pits.push(new Pit(x, y, 100, 100));  // No overlap, so add the pit
        }

        attempts++;  // Increment the number of attempts
    }
}

function setupZombies() {
    zombies = [];  // Clear any existing zombies
    for (let i = 0; i < 6 + level; i++) {  // Spawn 6 zombies plus additional zombies based on the level
        let x, y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (overlapsPit(x, y, 20, 20));  // Repeat until a position not overlapping a pit is found
        zombies.push(new Zombie(x, y));
    }
}

function overlapsPit(x, y, width, height) {
    for (let pit of pits) {
        if (
            x < pit.x + pit.width &&
            x + width > pit.x &&
            y < pit.y + pit.height &&
            y + height > pit.y
        ) {
            return true;  // Overlap detected
        }
    }
    return false;  // No overlap
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

function generateQRCode(data) {

    // Clear the element
    document.getElementById("qrcode").innerHTML = "";

    // Create QR Code
    const qr = new QRCode(document.getElementById("qrcode"), {
        text: data,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

function playSound(audioElement) {
    let sound = audioElement.cloneNode(true);
    sound.play();
}

async function sendScoreAndGenerateQR(score) {

    // TODO
    // Send score to the server

    // Generate a QR code with the hashed value
    generateQRCode(score);
  }

function update() {

    gameLoopRunning = true;

    if (zombies.length === 0) {  // All zombies have been removed
        playSound(restart);
        level++;  // Increase the level
        setupPits(); 
        setupZombies();  // Restart the game with more zombies
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let pit of pits) {
        pit.draw(ctx);
    }

    for (let zombie of zombies) {
        zombie.moveTowards(player);
        zombie.draw(ctx);
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

    requestAnimationFrame(update);
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
    update(); // Start the game loop
    if (autoPlayEnabled) {
        playAutomatically(player, zombies);
    }
}

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
    update();
    if (autoPlayEnabled) {
        playAutomatically(player, zombies);
    }
});

// --- 

function playAutomatically(player, zombies) {
    let interval = getRandomInt(150, 300); // Random interval between 150ms to 300ms
    let intervalID;

    intervalID = setInterval(function() {

        // If the game loop is not running don't try to move the player
        if (!gameLoopRunning) {
            clearInterval(intervalID);
            return;
        }

        if (zombies.length === 0) {
            console.log("No zombies to run from.");
            return; // No zombies to run from
        }

        let nearestZombie = zombies[0];
        let nearestDistance = distance(player.x, player.y, zombies[0].x, zombies[0].y);

        for (const zombie of zombies) {
            const currentDistance = distance(player.x, player.y, zombie.x, zombie.y);
            if (currentDistance < nearestDistance) {
                nearestDistance = currentDistance;
                nearestZombie = zombie;
            }
        }

        console.log(`Nearest zombie is at (${nearestZombie.x}, ${nearestZombie.y}) with distance: ${nearestDistance}`);

        let dx = player.x - nearestZombie.x;
        let dy = player.y - nearestZombie.y;
        let direction = "";

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                direction = 'right';
            } else {
                direction = 'left';
            }
        } else {
            if (dy > 0) {
                direction = 'down';
            } else {
                direction = 'up';
            }
        }

        console.log(`Moving player ${direction}`);
        player.move(direction);

    }, interval);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}