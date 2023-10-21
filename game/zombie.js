class Zombie {
    static RECRUITER = 'RECRUITER';
    static CFO = 'CFO';
    static VC_EXEC = 'VC_EXEC';

    constructor(x, y, type = Zombie.RECRUITER) {
        this.x = x;
        this.y = y;
        this.width = gridSize;
        this.height = gridSize;
        this.type = Zombie.RECRUITER;
    }

    moveTowards(player) {

        // Find the angle
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
 
        // Convert to degrees
        let angleInDegrees = angle * (180 / Math.PI);

        // Normalize the angle to a value between 0 and 360 degrees
        angleInDegrees = (angleInDegrees + 360) % 360;

        let direction;

        // Determine cardinal direction based on angle
        if (angleInDegrees >= 45 && angleInDegrees < 135) {
            direction = "down";
        } else if (angleInDegrees >= 135 && angleInDegrees < 225) {
            direction = "left";
        } else if (angleInDegrees >= 225 && angleInDegrees < 315) {
            direction = "up";
        } else {
            direction = "right";
        }

        switch(direction) {
            case 'left':
                this.x = Math.max(0, this.x - numZombieStepSize);
                break;
            case 'right':
                this.x = Math.min(canvas.width - numZombieStepSize, this.x + numZombieStepSize);
                break;
            case 'up':
                this.y = Math.max(0, this.y - numZombieStepSize);
                break;
            case 'down':
                this.y = Math.min(canvas.height - numZombieStepSize, this.y + numZombieStepSize);
                break;
        }

    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, gridSize, gridSize);

        switch(this.type) {
        case Zombie.RECRUITER:
            ctx.drawImage(zombieImage, this.x - 15, this.y - 68, 45, 88);
            break;
        case Zombie.VC_EXEC:
            ctx.drawImage(zombieImage, this.x - 15, this.y - 68, 45, 88);
            break;
        case Zombie.CFO:
            ctx.drawImage(zombieImage, this.x - 15, this.y - 68, 45, 88);
            break;
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
    for (let i = 0; i < numStartingZombies + (level * 2); i++) {  // Spawn 6 zombies plus additional zombies based on the level
        let x, y;
        do {
            x = getRandomCoordinate(canvas.width, safeBorderSize, gridSize);
            y = getRandomCoordinate(canvas.height, safeBorderSize, gridSize);

        } while (
            overlapsPit(x, y, gridSize, gridSize) || 
            (player && !isValidZombieSpawnPoint(x, y, minSpawnDistanceFromPlayer))  // Skip the check if player is undefined
        );  
        // Repeat until a position not overlapping a pit and far enough from the player is found
        zombies.push(new Zombie(x, y));
    }
}

function isValidZombieSpawnPoint(x, y, minDistance) {
    const distance = Math.sqrt(Math.pow(x - player.x, 2) + Math.pow(y - player.y, 2));
    return distance >= minDistance;
}