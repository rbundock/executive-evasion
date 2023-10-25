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

        for (let x = 0; x < rows; x++) {
            let gamespaceRow = new Array(cols).fill(null); // Fill with null or any default value
            this.gamespace.push(gamespaceRow);
        }
    }

    removeObject(gx, gy, object) {
        if (gx >= 0 && gx < this.gamespace.length && gy >= 0 && gy < this.gamespace[0].length) {
            this.gamespace[gx][gy] = null;
        } else {
            console.error("Invalid grid position: (" + gx + ", " + gy + ")");
        }
    }

    addObject(x, y, object) {
        if (x >= 0 && x < this.gamespace.length && y >= 0 && y < this.gamespace[0].length) {
            this.gamespace[x][y] = object;
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
        for (let x = 0; x < this.gamespace.length; x++) {
            for (let y = 0; y < this.gamespace[x].length; y++) {
                
                // Draw stuff
                switch (true) {
                    case (this.gamespace[x][y] instanceof Player):

                        if (debugMode){
                            ctx.fillStyle = 'blue';
                            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                        }

                        switch (this.gamespace[x][y].direction) {
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
                    
                    case (this.gamespace[x][y] instanceof Zombie):

                        if (debugMode) {
                            ctx.fillStyle = 'green';
                            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                        }
                
                        switch(this.gamespace[x][y].type) {
                        case Zombie.RECRUITER:
                            
                            switch (this.gamespace[x][y].direction) {
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
                     
                    case (this.gamespace[x][y] instanceof Treasure):

                        break;

                    default:
                        break;
                }
    
            }
        }
    }
}