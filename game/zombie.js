class Zombie {
    static RECRUITER = 'RECRUITER';
    static CFO = 'CFO';
    static VC_EXEC = 'VC_EXEC';

    constructor(x, y, type = Zombie.RECRUITER) {
        this.x = x;
        this.y = y;
        this.stepSize = numZombieStepSize;
        this.speed = zombieSpeed;  // Adjust speed as needed
        this.type = Zombie.RECRUITER;
    }

    /* Original movement code
    moveTowards(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }
    */

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
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, 20, 20);

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
    const minDistanceFromPlayer = 200;  // Set minimum distance from player
    for (let i = 0; i < numStartingZombies + (level * 2); i++) {  // Spawn 6 zombies plus additional zombies based on the level
        let x, y;
        do {
            x = (Math.random() * parseInt(canvas.width / 20));
            y = (Math.random() * parseInt(canvas.height / 20));
            x = x * 20;
            y = y * 20;
        } while (
            overlapsPit(x, y, 20, 20) || 
            (player && !isValidSpawnPoint(x, y, minDistanceFromPlayer))  // Skip the check if player is undefined
        );  
        // Repeat until a position not overlapping a pit and far enough from the player is found
        zombies.push(new Zombie(x, y));
    }
}

function isValidSpawnPoint(x, y, minDistance) {
    const distance = Math.sqrt(Math.pow(x - player.x, 2) + Math.pow(y - player.y, 2));
    return distance >= minDistance;
}