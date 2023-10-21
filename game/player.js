class Player {
    constructor() {
        let safeSpawn = false;  // Flag to check if spawn location is safe
        let x, y; // Declare the coordinates of the player

        while (!safeSpawn) {
            // Generate random coordinates within the canvas        
            x = getRandomCoordinate(canvas.width, safeBorderSize);  // Random X position, ensuring player fits within canvas
            y = getRandomCoordinate(canvas.height, safeBorderSize);  // Random Y position, ensuring player fits within canvas

            // Check if this position overlaps with any pit or zombie
            if (!overlapsEntity(x, y, pits, 100) && !overlapsEntity(x, y, zombies, 100)) {
                safeSpawn = true;  // Found a safe spawn location
            }
        }

        this.x = x;
        this.y = y;
        this.width = gridSize;
        this.height = gridSize;
    }
    
    move(direction) {
        playSound(step);
        switch(direction) {
            case 'left':
                this.x = Math.max(0, this.x - stepSize);
                break;
            case 'right':
                this.x = Math.min(canvas.width - stepSize, this.x + stepSize);
                break;
            case 'up':
                this.y = Math.max(0, this.y - stepSize);
                break;
            case 'down':
                this.y = Math.min(canvas.height - stepSize, this.y + stepSize);
                break;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, gridSize, gridSize);

        // Make sure the image is loaded before drawing
        if (playerImage.complete) {
            ctx.drawImage(playerImage, this.x - 30, this.y - 44, 80, 80);
        }
    }
}

function overlapsEntity(x, y, entities, buffer) {
    for (let entity of entities) {
        let distance = Math.sqrt(Math.pow(entity.x - x, 2) + Math.pow(entity.y - y, 2));
        if (distance < buffer) {  
            return true;  // Overlap detected
        }
    }
    return false;  // No overlap
}