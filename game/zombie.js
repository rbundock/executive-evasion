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

// Function to spawn a single zombie based on player coordinates
function spawnZombie(playerX, playerY) {
    // Determine canvas edges
    let topEdge = 0;
    let bottomEdge = canvas.height;
    let leftEdge = 0;
    let rightEdge = canvas.width;

    let x, y;

    // Calculate distance to each edge from the player
    let distToTop = Math.abs(playerY - topEdge);
    let distToBottom = Math.abs(bottomEdge - playerY);
    let distToLeft = Math.abs(playerX - leftEdge);
    let distToRight = Math.abs(rightEdge - playerX);

    // Determine the closest edge
    let closestEdge = Math.min(distToTop, distToBottom, distToLeft, distToRight);
    
    // Determine spawn coordinates based on the closest edge
    if (closestEdge === distToTop) {
        y = topEdge - 20;  // Spawn above the canvas
        x = playerX;
    } else if (closestEdge === distToBottom) {
        y = bottomEdge + 20;  // Spawn below the canvas
        x = playerX;
    } else if (closestEdge === distToLeft) {
        x = leftEdge - 20;  // Spawn to the left of the canvas
        y = playerY;
    } else {
        x = rightEdge + 20;  // Spawn to the right of the canvas
        y = playerY;
    }

    // Create new Zombie and add to zombies array
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