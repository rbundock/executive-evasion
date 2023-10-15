class Treasure {
    constructor() {
        let safeSpawn = false;  // Flag to check if spawn location is safe
        let x, y; // Declare the coordinates of the player
        let borderSize = 50;

        while (!safeSpawn) {
            // Generate random coordinates within the canvas
            x = Math.random() * (canvas.width - borderSize) + (borderSize/2);  // Random X position, ensuring treasure fits within canvas
            y = Math.random() * (canvas.height - borderSize) + (borderSize/2);  // Random Y position, ensuring treasure fits within canvas

            // Check if this position overlaps with any pit or zombie
            if (!overlapsEntity(x, y, pits, 100) && !overlapsEntity(x, y, zombies, 100)) {
                safeSpawn = true;  // Found a safe spawn location
            }
        }

        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, 20, 20);
    }
}

function setupTreasure() {
    treasures = [];
}

function shouldSpawnTreasure() {
    // Define the bounding box for the player
    const playerMargin = 500;  // Adjust this value as you see fit
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