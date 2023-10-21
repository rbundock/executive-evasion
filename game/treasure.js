class Treasure {
    constructor() {
        let safeSpawn = false;  // Flag to check if spawn location is safe
        let x, y; // Declare the coordinates of the player

        while (!safeSpawn) {
            // Generate random coordinates within the canvas
            x = getRandomCoordinate(canvas.width, safeBorderSize, gridSize);  // Random X position, ensuring treasure fits within canvas
            y = getRandomCoordinate(canvas.height, safeBorderSize, gridSize);  // Random Y position, ensuring treasure fits within canvas

            // Check if this position overlaps with any pit or zombie
            if (!overlapsEntity(x, y, pits, minSpawnDistanceFromPlayer) && !overlapsEntity(x, y, zombies, minSpawnDistanceFromPlayer)) {
                safeSpawn = true;  // Found a safe spawn location
            }
        }

        this.x = x;
        this.y = y;
        this.width = gridSize;
        this.height = gridSize;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, gridSize, gridSize);
    }
}

function setupTreasure() {
    treasures = [];
}

function shouldSpawnTreasure() {

    

    // Define the bounding box for the player
    const playerMargin = spawnDistanceTreasure;  // Adjust this value as you see fit
    const playerLeft = player.x - playerMargin;
    const playerRight = player.x + playerMargin;
    const playerTop = player.y - playerMargin;
    const playerBottom = player.y + playerMargin;
  
    // Initialize the bounding box for zombies
    let zombieLeft = Infinity;
    let zombieRight = -Infinity;
    let zombieTop = Infinity;
    let zombieBottom = -Infinity;
  
    // Calculate the bounding box for zombies
    for (let zombie of zombies) {
      zombieLeft = Math.min(zombieLeft, zombie.x);
      zombieRight = Math.max(zombieRight, zombie.x);
      zombieTop = Math.min(zombieTop, zombie.y);
      zombieBottom = Math.max(zombieBottom, zombie.y);
    }
  
    // Check if the zombie bounding box is completely outside the player bounding box
    if (
      zombieLeft > playerRight ||
      zombieRight < playerLeft ||
      zombieTop > playerBottom ||
      zombieBottom < playerTop
    ) {
      // The bounding box of all zombies is outside the bounding box of the player
      return true;
    }
  
    // The bounding box of some or all zombies intersects with the bounding box of the player
    return false;
  }