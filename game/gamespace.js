class Gamespace {
    static CHAIR_GREY_UP = 'chair_grey_up';
    static CHAIR_GREY_DOWN = 'chair_grey_down';
 
    constructor(canvasWidth, canvasHeight, gridSize) {
        this.gamespace = [];
        this.gridSize = gridSize;

        // Calculate number of columns based on canvasWidth and gridSize
        let cols = parseInt(canvasWidth / gridSize);
        // Calculate number of rows based on canvasHeight and gridSize
        let rows = parseInt(canvasHeight / gridSize);

        for (let y = 0; y < rows; y++) {
            let gamespaceRow = new Array(cols).fill(null); // Fill with null or any default value
            this.gamespace.push(gamespaceRow);
        }

        this.width = this.gamespace[0].length;
        this.height = this.gamespace.length;
    }

    resetGamespace () {
        this.gamespace = [];

        for (let y = 0; y < this.width; y++) {
            let gamespaceRow = new Array(this.width).fill(null); // Fill with null or any default value
            this.gamespace.push(gamespaceRow);
        }
    }

    removeObject(gx, gy, object) {
        console.log(x + " :x: " + this.width);
        console.log(y + " :y: " + this.height);
        if (gx >= 0 && gx < this.gamespace.length && gy >= 0 && gy < this.gamespace[0].length) {
            this.gamespace[gy][gx] = null;
        } else {
            console.error("Invalid grid position: (" + gx + ", " + gy + ")");
        }
    }

    addObject(x, y, object) {
        console.log(x + " :x: " + this.width);
        console.log(y + " :y: " + this.height);
        if (x >= 0 && x < this.width) {  // Check x against number of columns
            if (y >= 0 && y < this.height) {  // Check y against number of rows
                this.gamespace[y][x] = object;  
            } else {
                console.error("Invalid grid position: (" + x + ", " + y + ")");
            }
        } else {
            console.error("Invalid grid position: (" + x + ", " + y + ")");
        }
    }

    addChair(x, y, type) {
        if (x >= 0 && x < this.gamespace.length && y >= 0 && y < this.gamespace[0].length) {
            this.gamespace[x][y] = type;
        } else {
            console.error("Invalid grid position: (" + x + ", " + y + ")");
        }
    }

    draw(ctx) {
        // Draw the gamespace, back to front
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {

                switch (tileMatrix[y][x]) {
                    case 'regular': 
                        ctx.drawImage(tileImage, x * gridSize, y * gridSize, gridSize, gridSize);
                        break;
                    case 'HC': 
                        ctx.drawImage(tileHCImage, x * gridSize, y * gridSize, gridSize, gridSize);
                        break;
                    case 'craft': 
                        ctx.drawImage(tileCraftImage, x * gridSize, y * gridSize, gridSize, gridSize);
                        break;
                }

                // Draw stuff
                switch (true) {
                    case (this.gamespace[y][x] instanceof Player):

                        if (debugMode){
                            ctx.fillStyle = 'blue';
                            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                        }

                        switch (this.gamespace[y][x].direction) {
                            case "left":
                                ctx.drawImage(playerImageLeft, x * gridSize, y * gridSize - 48, 48, 96);
                                break;
                            case "right":
                                ctx.drawImage(playerImageRight, x * gridSize, y * gridSize - 48, 48, 96);
                                break;
                            case "up":
                                ctx.drawImage(playerImageUp, x * gridSize, y * gridSize - 48, 48, 96);
                                break;
                            case "down":
                                ctx.drawImage(playerImageDown, x * gridSize, y * gridSize - 48, 48, 96);
                                break;
                        }

                        //ctx.drawImage(chairGreyUpImage, x * gridSize, y * gridSize, gridSize, gridSize*2);
                        break;
                    
                    case (this.gamespace[y][x] instanceof Zombie):

                        if (debugMode) {
                            ctx.fillStyle = 'green';
                            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                        }
                
                        switch(this.gamespace[y][x].type) {
                        case Zombie.RECRUITER:
                            
                            switch (this.gamespace[y][x].direction) {
                                case "left":
                                    ctx.drawImage(zombieImageLeft, x * gridSize, y * gridSize - 48, 48, 96);
                                    break;
                                case "right":
                                    ctx.drawImage(zombieImageRight, x * gridSize, y * gridSize - 48, 48, 96);
                                    break;
                                case "up":
                                    ctx.drawImage(zombieImageUp, x * gridSize, y * gridSize - 48, 48, 96);
                                    break;
                                case "down":
                                    ctx.drawImage(zombieImageDown, x * gridSize, y * gridSize - 48, 48, 96);
                                    break;
                            }
                            break;
                        case Zombie.VC_EXEC:
                            ctx.drawImage(zombieImage, this.x - 15, this.y - 68, 45, 88);
                            break;
                        case Zombie.CFO:
                            ctx.drawImage(zombieImage, this.x - 15, this.y - 68, 45, 88);
                            break;
                        }
                    
                        break;
                     
                    case (this.gamespace[y][x] instanceof Treasure):

                        break;

                    default:
                        break;
                }
    
            }
        }
    }
}