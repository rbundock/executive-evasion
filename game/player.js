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
        //this.gridX = parseInt(x/gridSize);
        //this.gridY = parseInt(y/gridSize);

        gamespace.addObject(parseInt(this.x/gridSize), parseInt(this.y/gridSize), this);
    }
    
    move(direction) {
        playSound(step);
        this.direction = direction;

        switch(direction) {
            case 'left':
                this.x = Math.max(0, this.x - gridSize);
                break;
            case 'right':
                this.x = parseInt(Math.min((gamespace.width * gridSize) - gridSize, this.x + gridSize));
                break;
            case 'up':
                this.y = parseInt(Math.max(0, this.y - gridSize));
                break;
            case 'down':
                this.y = parseInt(Math.min((gamespace.height * gridSize) - gridSize, this.y + gridSize));
                break;
        }

    }

    draw() {
        gamespace.addObject(parseInt(this.x/gridSize), parseInt(this.y/gridSize), this);
        return;
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