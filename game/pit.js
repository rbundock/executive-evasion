class Pit {
    static DIRECTION_UP = 'UP';
    static DIRECTION_DOWN = 'DOWN';
    static DIRECTION_LEFT = 'LEFT';
    static DIRECTION_RIGHT = 'RIGHT';

    constructor(x, y, width, height, direction) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.occupant = null;
        this.capacity = 1;  //Math.floor(Math.random() * (maxPitCapacity - minPitCapacity + 1)) + minPitCapacity;
    }

    draw() {

        gamespace.addObject(parseInt(this.x/gridSize), parseInt(this.y/gridSize), this);
        return;

        if (!debugMode) {
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1;
        }

        ctx.drawImage(pitImage, this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '24px Barlow';
        ctx.fillText(this.capacity, this.x+15, this.y+25);  // Positioning it below the score


    }

    incBodies() {
        // Increase the count of zombies in pit
        this.capacity--;
        console.log("Pit has: " + this.capacity);
    }

}

function setupPits(totalRequired) {
    pits = [];  // Clear any existing pits
    let tries = 0;

    while (pits.length < totalRequired && tries < 100) {
        //console.log("spawnPit("+pits.length+")");
        spawnPit(1);
        tries++;
    }

    if (tries === 100 ) {
        console.log("HALTED over 100 tries");
    }
}

function spawnPit(totalRequired) {
    let attempts = 0;  // Variable to track the number of attempts to place a pit

    // Try to cluster
    while (attempts < 1000) {  // Create pits, with a limit on attempts to prevent an infinite loop
        let x = getRandomCoordinate(canvas.width, safeBorderSize, pitSize);  // Random X position, ensuring pit fits within canvas
        let y = getRandomCoordinate(canvas.height, safeBorderSize, pitSize);  // Random Y position, ensuring pit fits within canvas

        // Check for overlap with existing pits
        let overlapping = false;
        for (let pit of pits) {
            let distance = Math.sqrt(Math.pow(pit.x - x, 2) + Math.pow(pit.y - y, 2));
            if (distance < (pit.width*4)) {  // Twice the pit width, adjust as needed
                overlapping = true;
                console.log("overlapping pit! Attempts: " + attempts)
            }
        }

        if (!overlapping) {
            // Just check we aren't spawning on the player if this is a new level
            if (!isColliding({ x, y, width: pitSize, height: pitSize }, player)) {
                pits.push(new Pit(x, y, pitSize, pitSize, Pit.DIRECTION_DOWN));   // No overlap, so add the pit
                pits.push(new Pit(x + pitSize, y, pitSize, pitSize, Pit.DIRECTION_DOWN)); 
                pits.push(new Pit(x, y + (pitSize * 2), pitSize, pitSize, Pit.DIRECTION_UP)); 
                pits.push(new Pit(x + pitSize, y + (pitSize * 2), pitSize, pitSize, Pit.DIRECTION_UP)); 
                return;
            }
        }

        attempts++;  // Increment the number of attempts
    }
}


/*
function isValidPitSpawnPoint(x, y, minDistance) {
    //console.log("isValidPitSpawnPoint: " + minDistance);
    if (!player) return true;  // If player is undefined, skip the check
    const distance = Math.sqrt(Math.pow(x - player.x, 2) + Math.pow(y - player.y, 2));
    //console.log("distance: " + distance);
    return distance >= minDistance;
}
*/

function overlapsPit(x, y, width, height) {
    for (let pit of pits) {
        return isColliding({ x, y, width: pitSize, height: pitSize }, player);  // Overlap detected
    }
    return false;  // No overlap
}