const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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


// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.stepSize = 50;  // Set the step size (adjust as needed)
    }
    
    move() {
        if (keys.ArrowLeft) this.x -= 5;
        if (keys.ArrowRight) this.x += 5;
        if (keys.ArrowUp) this.y -= 5;
        if (keys.ArrowDown) this.y += 5;
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, 20, 20);
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
    }
}

let player = new Player(50, 50);

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function setupPits() {
    pits = [];  // Clear any existing pits
    for (let i = 0; i < 5; i++) {  // Create 5 pits
        let x = Math.random() * (canvas.width - 50);  // Random X position, ensuring pit fits within canvas
        let y = Math.random() * (canvas.height - 50);  // Random Y position, ensuring pit fits within canvas
        pits.push(new Pit(x, y, 50, 50));
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

function update() {

    if (zombies.length === 0) {  // All zombies have been removed
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

    player.move();
    player.draw(ctx);
	drawScore();

    if (checkCollisions()) {
        alert('Game Over!');
        return;  // End the game loop by not calling requestAnimationFrame
    }

    requestAnimationFrame(update);
}

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

setupPits();
setupZombies();
update();  // Start the game loop