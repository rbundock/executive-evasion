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

function spawnZombie() {

    let x, y;

    // Randomly choose one of the four edges (top, right, bottom, left)
    const edge = Math.floor(Math.random() * 4);

    switch (edge) {
        case 0: // Top edge
            x = Math.random() * canvas.width;
            y = 0;
            break;
        case 1: // Right edge
            x = canvas.width;
            y = Math.random() * canvas.height;
            break;
        case 2: // Bottom edge
            x = Math.random() * canvas.width;
            y = canvas.height;
            break;
        case 3: // Left edge
            x = 0;
            y = Math.random() * canvas.height;
            break;
    }

    // Create and return the new Zombie object
    zombies.push(new Zombie(x, y));
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