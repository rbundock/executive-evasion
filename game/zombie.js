class Zombie {
    static RECRUITER = 'RECRUITER';
    static CFO = 'CFO';
    static CEO = 'CEO';
    static VC_EXEC = 'VC_EXEC';

    constructor(x, y) {
        const types = [Zombie.RECRUITER, Zombie.CFO]; //, Zombie.CEO, Zombie.VC_EXEC];

        this.x = x;
        this.y = y;
        this.width = gridSize;
        this.height = gridSize;
        this.type = types[Math.floor(Math.random() * types.length)];
        this.direction = "down";
        this.path = [];
        this.pathStep = 0;
        //this.gridX = parseInt(x/gridSize);
        //this.gridY = parseInt(y/gridSize);
    }

    get gridX() {
        return parseInt(this.x / gridSize);
    }

    get gridY() {
        return parseInt(this.y / gridSize);
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

        let potentialX = this.x;
        let potentialY = this.y;

        this.direction = direction;

        switch (direction) {
            case 'left':
                potentialX = Math.max(0, this.x - numZombieStepSize);
                break;
            case 'right':
                potentialX = Math.min(canvas.width - numZombieStepSize, this.x + numZombieStepSize);
                break;
            case 'up':
                potentialY = Math.max(0, this.y - numZombieStepSize);
                break;
            case 'down':
                potentialY = Math.min(canvas.height - numZombieStepSize, this.y + numZombieStepSize);
                break;
        }

        // If other zombies exist, check we aren't stepping on their toes. 
        let collision = false;
        let alreadyColliding = false;
        //if (zombies.length> 1) {
        for (let otherZombie of zombies) {
            if (otherZombie !== this) {
                if (isColliding(this, otherZombie)) {
                    // break the deadlock when two zombies are ontop of each other
                    alreadyColliding = true;
                }
                if (isColliding({ x: potentialX, y: potentialY, width: this.width, height: this.height }, otherZombie)) {
                    collision = true;
                }
            }
        }

        for (let pit of pits) {
            //if (isColliding(this, pit)) {
            // break the deadlock when two zombies are ontop of each other
            //    alreadyColliding = true;
            //}
            // Only avoid full pits. 
            if (pit.capacity == 0) {
                if (isColliding({ x: potentialX, y: potentialY, width: this.width, height: this.height }, pit)) {
                    collision = true;
                }
            }
        }
        //}

        if (!collision || alreadyColliding) {
            this.x = potentialX;
            this.y = potentialY;

        }

        //console.log("Zombie move");
    }

    draw() {

        gamespace.addObject(parseInt(this.x / gridSize), parseInt(this.y / gridSize), this);
        return;

    }
}

function spawnZombie() {

    let x, y;
    let attempts = 0;

    // Randomly choose one of the four edges (top, right, bottom, left)
    const edge = Math.floor(Math.random() * 4);
    let attempt = true;

    while (attempts < 100 && attempt) {

        switch (edge) {
            case 0: // Top edge
                x = parseInt(Math.random() * gamespace.width);
                y = 0;

                if (Math.abs(player.gridX - x) > 3) {
                    attempt = false;
                }
                break;
            case 1: // Right edge
                x = gamespace.width - 1;
                y = parseInt(Math.random() * gamespace.height);


                if (Math.abs(player.gridY - y) > 3) {
                    attempt = false;
                }
                break;
            case 2: // Bottom edge
                x = parseInt(Math.random() * gamespace.width);
                y = gamespace.height - 1;

                if (Math.abs(player.gridX - x) > 3) {
                    attempt = false;
                }
                break;
            case 3: // Left edge
                x = 0;
                y = parseInt(Math.random() * gamespace.height);

                if (Math.abs(player.gridY - y) > 3) {
                    attempt = false;
                }
                break;
        }

        if (!attempt){ 
            console.log("No spawn");
        }
        attempts++;
    }

    // FIX THIS: Collision with a buffer area
    //if (Math.abs(player.gridX - x) > 3 && Math.abs(player.gridY - y) > 3) {
    // Create and return the new Zombie object
    let newZ = new Zombie(x * gridSize, y * gridSize)
    zombies.push(newZ);
    gamespace.addObject(parseInt(x), parseInt(y), newZ);

    console.log("Spanwed zombie: x: " + x + " y:" + y);
    console.log("Player at: x: " + player.gridX + " y:" + player.gridY);
    //return;
    //}
}

function setupZombies(numZombiesToSetup) {
    zombies = [];  // Clear any existing zombies
    numZombiesFallen = 0; // Reset 

    for (let i = 0; i < numZombiesToSetup; i++) {  // Spawn 6 zombies plus additional zombies based on the level
        let x, y;
        do {
            x = getRandomCoordinate(canvas.width, safeBorderSize, gridSize);
            y = getRandomCoordinate(canvas.height, safeBorderSize, gridSize);

        } while (
            overlapsPit(x, y, gridSize, gridSize) ||
            (player && !isValidZombieSpawnPoint(x, y, minSpawnDistanceFromPlayer))  // Skip the check if player is undefined
        );
        // Repeat until a position not overlapping a pit and far enough from the player is found
        let newZ = new Zombie(x, y)
        zombies.push(newZ);
        gamespace.addObject(parseInt(x / gridSize), parseInt(y / gridSize), newZ);

    }
}

function isValidZombieSpawnPoint(x, y, minDistance) {
    const distance = Math.sqrt(Math.pow(x - player.x, 2) + Math.pow(y - player.y, 2));
    return distance >= minDistance;
}