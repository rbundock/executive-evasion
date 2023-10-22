const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 48;
const stepSize = 24;
const pitSize = gridSize * 5;
const minSpawnDistanceFromPlayer = gridSize * 6;
const safeBorderSize = gridSize * 3;
const spawnDistanceTreasure = gridSize * 6;
const numPitsPerLevel = 5;

const numLeaderBoardPositions = 15;

const debugMode = false;

const gamepad = navigator.getGamepads()[0];

let autoPlayEnabled = false; // This is the flag

let level = 1; // Start at 1
let score = 0;

let numStartingZombies = 6;
let numZombieStepSize = gridSize / 2;
let maxZombieDelay = 300; // in ms
let minZombieDelay = 90; // in ms

let minPitCapacity = 2; // You can't have a meeting on your own
let maxPitCapacity = 4;

/*

TODO:

- xSpeed up the zombies by half for every half that are removed
- xMove to a grid
- xZombies to step
- Zombies avoid pits once full

GRAPHICS
- https://limezu.itch.io/modernoffice

AUDIO
- Zombie step
- https://www.youtube.com/watch?v=oy_usKHTXOY

*//////



// Initilise 
let player;
let zombies = [];
let pits = [];      
let treasures = [];    

let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

let playerImage = new Image();
playerImage.src = 'img/cto_1.png';  

let pitImage = new Image();
pitImage.src = 'img/meeting_space.png'; 

let zombieImage = new Image();
zombieImage.src = 'img/recruiter.png'; 

let tileImage = new Image();
tileImage.src = 'img/floor_tile.png';

let tileHCImage = new Image();
tileHCImage.src = 'img/floor_tile_hc.png';

let tileCraftImage = new Image();
tileCraftImage.src = 'img/floor_tile_craft.png';

let treasureImage = new Image();
treasureImage.src = 'img/watercooler.png';

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log("Grid area:" + parseInt(canvas.width/gridSize) * parseInt(canvas.height/gridSize));

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeFloorTiles(); // Rebuild tiles
    console.log("Grid area:" + parseInt(canvas.width/gridSize) * parseInt(canvas.height/gridSize));
});

const Game = (function() {

    // Private variables and methods
    let instance;
    let gameLoopRunning = false;
    let levelStartTime;
    let lastGameTime;

    function gameLoop() {
        // ... (rest of your game loop code)
        canvas.style.cursor = 'none';

        if (gamepad) {
            console.log("Gamepad: " + gamepad.axes[0]);
        }
    
    
        // RESTART
        if (zombies.length === 0 && !debugMode) {  // All zombies have been removed
            playSound(restart);
            level++;  // Increase the level
            // zombieSpeed = zombieSpeed + 0.1; // Increase Zombie speed
            console.log("Last level time: " + (Date.now() - levelStartTime) / 1000);
            game.resetLevel();
        }
    
        // DRAW ----
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Draw the floor    
        drawFloorTiles();
    
        if (debugMode) {
            ctx.globalAlpha = 0.5;  // Set transparency level (0 to 1)
            ctx.fillStyle = 'green';
            ctx.fillRect(safeBorderSize/2, safeBorderSize/2, canvas.width - safeBorderSize, canvas.height - safeBorderSize);
            ctx.globalAlpha = 1;  // Reset
        }
    
        for (let treasure of treasures) {
            treasure.draw(ctx);
        }
    
        for (let pit of pits) {
            pit.draw(ctx);
        }
    
        for (let zombie of zombies) {
            zombie.draw(ctx);
        }
        
    
        player.draw(ctx);
        drawScore();
        drawLevel();
        /// 
    
        if (checkCollisions()) {
    
            game.stop();

            console.log("Total game time: " + lastGameTime);
            playSound(gameover);
    
            ModalGameOverScreen.loadGameOverScreen();

            return;  // End the game loop by not calling requestAnimationFrame
        }
    
        // If the player has closed a pit, then spawn treasure to help them out
        if (pits.length < numPitsPerLevel) {
            if (shouldSpawnTreasure() || debugMode) {
                // Only spawn one
                if (treasures.length === 0) {
                    const newTreasure = new Treasure();
                    treasures.push(newTreasure);
                    treasure_spawn.play();
                }
            }
        }
    
        requestAnimationFrame(gameLoop);
    }

    function animateZombies() {

        // If the game loop is not running, don't try to move the zombies
        if (!gameLoopRunning) {
            if (zombieTimeoutId) {
                clearTimeout(zombieTimeoutId);
                zombieTimeoutId = null;
            }
            return;
        }
    
        // Percentage of Zombies left
        let zombiesLeftPercentage = zombies.length / numStartingZombies;
    
        // Animate
        zombies.forEach(zombie => {
            zombie.moveTowards(player);
        });
    
        //playSound(zombie_step);
    
        console.log("Zombie Delay: " + (minZombieDelay + (maxZombieDelay * zombiesLeftPercentage)))
    
        // Clear any existing timeout before setting a new one
        if (zombieTimeoutId) {
            clearTimeout(zombieTimeoutId);
        }
        
        zombieTimeoutId = setTimeout(animateZombies, minZombieDelay + (maxZombieDelay * zombiesLeftPercentage));
    }

    function setupKeyListeners() {
        
        window.addEventListener('keydown', (e) => {
        
            // If the game loop is not running don't try to move the player
            if (!gameLoopRunning) {
                return;
            }
        
            if (!keys[e.code]) {
                keys[e.code] = true;
        
                switch(e.code) {
                    case 'ArrowLeft':
                        player.move('left');
                        break;
                    case 'ArrowRight':
                        player.move('right');
                        break;
                    case 'ArrowUp':
                        player.move('up');
                        break;
                    case 'ArrowDown':
                        player.move('down');
                        break;
                }
            }
        });
        
        window.addEventListener('keyup', (e) => {
            keys[e.code] = false;
        });
    }

    // Public methods exposed by the singleton
    return {
        getInstance: function() {
            if (!instance) {
                instance = {
                    lastGameTime: function () {
                        return lastGameTime;
                    },
                    isGameLoopRunning: function() {
                        return gameLoopRunning;
                    },
                    start: function() {
                        console.log("Game START called");
                        if (!gameLoopRunning) {
                            player = new Player(); // Initialize player with random safe location
                            level = 1;
                            score = 0;
                            gameLoopRunning = true;
                            levelStartTime = Date.now();

                            setupPits(numPitsPerLevel); 
                            setupZombies();
                            setupTreasure();

                            setupKeyListeners();
                            animateZombies();
                            requestAnimationFrame(gameLoop);
                        }
                    },
                    stop: function() {
                        console.log("Game STOP called");
                        gameLoopRunning = false;
                        lastGameTime = (Date.now() - levelStartTime) / 1000;
                    },
                    resetLevel: function() {
                        console.log("Level RESET called");
            
                        setupPits(numPitsPerLevel); 
                        setupZombies();
                        setupTreasure();

                    }
                };
            }
            return instance;
        }
    };
})();

let zombieTimeoutId = null;
const game = Game.getInstance();
initializeFloorTiles();
ModalIntroScreen.loadIntroScreen();

function checkCollisions() {
    for (let pit of pits) {
        if (isColliding(pit, player)) {
            return true;  // Collision with zombie detected
        }
    }

    
    for (let zombie of zombies) {
        if (isColliding(zombie, player)) {
            return true;  // Collision with zombie detected
        }
    }
    

    let newTreasures = [];
    for (let treasure of treasures) {
        if (isColliding(treasure, player)) {
            // Collision detected, add 10 points to the score
            score += 10;
            spawnPit(1);
        } else {
            newTreasures.push(treasure);
        }
    }
    treasures = newTreasures;

    // Check for collisions between zombies and pits, and remove zombies in pits
    let newZombies = [];
    for (let zombie of zombies) {
        let inPit = false;
        for (let pit of pits) {
            if (isColliding(pit, zombie)) {

                // Pits have maximum capacity
                if (pit.capacity > 0) {
                    inPit = true;
                    score++;  // Increase the score when a zombie falls into a pit
                    playSound(fallen);
                    pit.incBodies();

                    if (pit.capacity === 0){
                        // Remove pit !
                        pits = pits.filter(p => p.capacity > 0);
                    }
                    //spawnZombie(player.x, player.y);  // Create another zombie
                    break;
                }
            
            }
        }
        if (!inPit) {
            newZombies.push(zombie);
        }
    }
    zombies = newZombies;
    
    return false;  // No collision with player
}


function cyclePressAnyKey() {
    const h1Element = document.querySelector('.cycle-colour');

    const startColor = { r: 255, g: 70, b: 250 };
    const endColor = { r: 218, g: 255, b: 2 };
    let step = 0.01;  // Change this value to adjust the speed of the transition
    let t = 0;  // Parameter to interpolate between startColor and endColor

    function lerp(start, end, t) {
        return start + t * (end - start);
    }

    setInterval(function() {
        const r = Math.round(lerp(startColor.r, endColor.r, t));
        const g = Math.round(lerp(startColor.g, endColor.g, t));
        const b = Math.round(lerp(startColor.b, endColor.b, t));

        h1Element.style.color = `rgb(${r}, ${g}, ${b})`;

        t += step;

        // If t exceeds 1 or goes below 0, reverse the direction
        if (t >= 1 || t <= 0) {
            step = -step;
        }
    }, 10); 
}