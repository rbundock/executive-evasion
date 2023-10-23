class Player {
    constructor() {
        let safeSpawn = false;  // Flag to check if spawn location is safe
        let x, y; // Declare the coordinates of the player

        while (!safeSpawn) {
            // Generate random coordinates within the canvas        
            x = getRandomCoordinate(canvas.width, safeBorderSize, gridSize);  // Random X position, ensuring player fits within canvas
            y = getRandomCoordinate(canvas.height, safeBorderSize, gridSize);  // Random Y position, ensuring player fits within canvas

            // Check if this position overlaps with any pit or zombie
            if (!overlapsEntity(x, y, pits, 100) && !overlapsEntity(x, y, zombies, 100)) {
                safeSpawn = true;  // Found a safe spawn location
            }
        }

        this.x = x;
        this.y = y;
        this.width = gridSize;
        this.height = gridSize;
        this.direction = "down";
    }
    
    move(direction) {
        playSound(step);
        this.direction = direction;
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
        
        if (debugMode){
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, gridSize, gridSize);
        }
        
        // Make sure the image is loaded before drawing
        switch (this.direction) {
            case "left":
                ctx.drawImage(playerImageLeft, this.x, this.y - 48, 48, 96);
                break;
            case "right":
                ctx.drawImage(playerImageRight, this.x, this.y - 48, 48, 96);
                break;
            case "up":
                ctx.drawImage(playerImageUp, this.x, this.y - 48, 48, 96);
                break;
            case "down":
                ctx.drawImage(playerImageDown, this.x, this.y - 48, 48, 96);
                break;
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