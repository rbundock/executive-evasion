class Pit {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.attendance = 0;
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.drawImage(pitImage, this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '24px Barlow';
        ctx.fillText(this.attendance, this.x+15, this.y+25);  // Positioning it below the score


    }

    incBodies() {
        // Increase the count of zombies in pit
        this.attendance++;
        console.log("Pit has: " + this.attendance);
    }

}

function setupPits(totalRequired) {
    pits = [];  // Clear any existing pits
    let attempts = 0;  // Variable to track the number of attempts to place a pit
    let minDistanceFromPlayer = 100;
    let borderSize = 300;

    while (pits.length < totalRequired && attempts < 1000) {  // Create pits, with a limit on attempts to prevent an infinite loop
        let x = Math.random() * (canvas.width - borderSize) + (borderSize/2);  // Random X position, ensuring pit fits within canvas
        let y = Math.random() * (canvas.height - borderSize) + (borderSize/2);  // Random Y position, ensuring pit fits within canvas

        // Check for overlap with existing pits
        let overlapping = false;
        for (let pit of pits) {
            let distance = Math.sqrt(Math.pow(pit.x - x, 2) + Math.pow(pit.y - y, 2));
            if (distance < (pit.width*2)) {  // Twice the pit width, adjust as needed
                overlapping = true;
                console.log("overlapping pit!")
                break;
            }
        }

        if (!overlapping) {
            // Just check we aren't spawning on the player if this is a new level
            if (isValidPitSpawnPoint(x, y, minDistanceFromPlayer)) {
                pits.push(new Pit(x, y, 100, 100));   // No overlap, so add the pit
            }
        }

        attempts++;  // Increment the number of attempts
    }
}

function isValidPitSpawnPoint(x, y, minDistance) {
    //console.log("isValidPitSpawnPoint: " + minDistance);
    if (!player) return true;  // If player is undefined, skip the check
    const distance = Math.sqrt(Math.pow(x - player.x, 2) + Math.pow(y - player.y, 2));
    //console.log("distance: " + distance);
    return distance >= minDistance;
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