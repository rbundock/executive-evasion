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