let intervalID;

function playAI(player, zombies, pit) {
    function gameLogic() {
        // If the game loop is not running, don't try to move the player
        if (!gameLoopRunning) {
            clearInterval(intervalID);
            return;
        }

        if (zombies.length === 0) {
            console.log("No zombies to run from.");
            return; // No zombies to run from
        }

        let nearestZombie = zombies[0];
        let nearestDistance = distance(player.x, player.y, zombies[0].x, zombies[0].y);

        for (const zombie of zombies) {
            const currentDistance = distance(player.x, player.y, zombie.x, zombie.y);
            if (currentDistance < nearestDistance) {
                nearestDistance = currentDistance;
                nearestZombie = zombie;
            }
        }

        console.log(`Nearest zombie is at (${nearestZombie.x}, ${nearestZombie.y}) with distance: ${nearestDistance}`);

    // Calculate new interval based on nearestDistance
    let newInterval = Math.max(150, nearestDistance); // Assuming nearestDistance is in a reasonable range

    clearInterval(intervalID);
    intervalID = setInterval(gameLogic, newInterval);

    let dx = player.x - nearestZombie.x;
    let dy = player.y - nearestZombie.y;
    let direction = "";

    if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? 'right' : 'left';
    } else {
        direction = dy > 0 ? 'down' : 'up';
    }

        console.log(`Moving player ${direction}`);
        player.move(direction);
    }

    intervalID = setInterval(gameLogic, getRandomInt(150, 300));
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}