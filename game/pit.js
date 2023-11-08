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
        this.animateFrame = 0;
        //this.gridX = parseInt(x/gridSize);
        //this.gridY = parseInt(y/gridSize);
    }

    draw() {

        gamespace.addObject(parseInt(this.x/gridSize), parseInt(this.y/gridSize), this);
        return;
        
    }

    incBodies() {
        // Increase the count of zombies in pit
        this.capacity--;
    }

}

function setupPits(totalRequired) {
    pits = [];  // Clear any existing pits
    let tries = 0;

    while (pits.length < totalRequired && tries < 100) {
        spawnPit(1);
        tries++;
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
                console.error("overlapping pit! Attempts: " + attempts);
            }
        }

        // Check player
        let distance = Math.sqrt(Math.pow(player.x - x, 2) + Math.pow(player.y - y, 2));
        if (distance < (player.width * 4)) {  // Twice the pit width, adjust as needed
            overlapping = true;
            console.error("overlapping pit! Attempts: " + attempts);
        }

        if (!overlapping) {
            // Just check we aren't spawning on the player if this is a new level
            if (!isColliding({ x, y, width: pitSize * 2, height: pitSize * 3 }, player)) {
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

function animateOut(x, y, direction) {
    // Base condition to stop the recursion
    if (y <= 0) return;

    // Draw the images based on the direction
    switch (direction) {
        case Pit.DIRECTION_DOWN:
            // Add occupant in the seat
            ctx.drawImage(chairGreyDownImage, x, y - 48, 48, 96);
            break;
        case Pit.DIRECTION_UP:
            // Add occupant in the seat    
            ctx.drawImage(chairGreyUpImage, x, y - 48, 48, 96);
            break;
    }

}

function overlapsPit(x, y, width, height) {
    for (let pit of pits) {
        return isColliding({ x, y, width: pitSize, height: pitSize }, player);  // Overlap detected
    }
    return false;  // No overlap
}