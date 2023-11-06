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
        this.objects = [];
    }

    resetGamespace() {
        this.gamespace = [];

        for (let y = 0; y < this.height; y++) {
            let gamespaceRow = new Array(this.width).fill(null); // Fill with null or any default value
            this.gamespace.push(gamespaceRow);
        }
    }

    addObject(x, y, object) {
        //console.log(x + " :x: " + this.width);
        //console.log(y + " :y: " + this.height);
        if (x >= 0 && x < this.width) {  // Check x against number of columns
            if (y >= 0 && y < this.height) {  // Check y against number of rows
                this.gamespace[y][x] = object;
            } else {
                //console.error("Invalid grid position: (" + x + ", " + y + ")");
            }
        } else {
            //console.error("Invalid grid position: (" + x + ", " + y + ")");
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

                // Overdraw area to look nice
                if (y == (this.height - 1)) {
                    // Draw extra tile
                    ctx.drawImage(tileImage, x * gridSize, y * gridSize + gridSize, gridSize, gridSize);
                }

                if (x == (this.width - 1)) {
                    // Draw extra tile
                    ctx.drawImage(tileImage, x * gridSize + gridSize, y * gridSize, gridSize, gridSize);
                    ctx.drawImage(tileImage, x * gridSize + gridSize, y * gridSize + gridSize, gridSize, gridSize);
                }

                // Draw stuff
                switch (true) {
                    case (this.gamespace[y][x] instanceof Player):

                        if (debugMode) {
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

                        switch (this.gamespace[y][x].type) {
                            case Zombie.RECRUITER:

                                switch (this.gamespace[y][x].direction) {
                                    case "left":
                                        ctx.drawImage(zombie_RECRUITER_Left, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "right":
                                        ctx.drawImage(zombie_RECRUITER_Right, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "up":
                                        ctx.drawImage(zombie_RECRUITER_Up, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "down":
                                        ctx.drawImage(zombie_RECRUITER_Down, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                }
                                break;
                            case Zombie.VC_EXEC:
                                switch (this.gamespace[y][x].direction) {
                                    case "left":
                                        ctx.drawImage(zombie_VC_EXEC_Left, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "right":
                                        ctx.drawImage(zombie_VC_EXEC_Right, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "up":
                                        ctx.drawImage(zombie_VC_EXEC_Up, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "down":
                                        ctx.drawImage(zombie_VC_EXEC_Down, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                }
                                break;
                            case Zombie.CFO:
                                switch (this.gamespace[y][x].direction) {
                                    case "left":
                                        ctx.drawImage(zombie_CFO_Left, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "right":
                                        ctx.drawImage(zombie_CFO_Right, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "up":
                                        ctx.drawImage(zombie_CFO_Up, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "down":
                                        ctx.drawImage(zombie_CFO_Down, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                }
                                break;
                            case Zombie.CEO:
                                switch (this.gamespace[y][x].direction) {
                                    case "left":
                                        ctx.drawImage(zombie_CEO_Left, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "right":
                                        ctx.drawImage(zombie_CEO_Right, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "up":
                                        ctx.drawImage(zombie_CEO_Up, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                    case "down":
                                        ctx.drawImage(zombie_CEO_Down, x * gridSize, y * gridSize - 48, 48, 96);
                                        break;
                                }
                                break;
                        }

                        break;

                    case (this.gamespace[y][x] instanceof Pit):

                        if (debugMode) {
                            ctx.globalAlpha = 0.1;
                            ctx.fillStyle = 'black';
                            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                            ctx.globalAlpha = 1;
                        }

                        switch (this.gamespace[y][x].direction) {

                            case (Pit.DIRECTION_DOWN):
                                ctx.drawImage(chairGreyDownImage, x * gridSize, y * gridSize - 48, 48, 96);

                                // Add occupant in the seat
                                if (this.gamespace[y][x].capacity == 0) {
                                    switch (this.gamespace[y][x].occupant.type) {
                                        case Zombie.RECRUITER:
                                            ctx.drawImage(zombie_RECRUITER_Down, x * gridSize, y * gridSize - 48, 48, 96);
                                            break;
                                        case Zombie.CFO:
                                            ctx.drawImage(zombie_CFO_Down, x * gridSize, y * gridSize - 48, 48, 96);
                                            break;
                                        case Zombie.CEO:
                                            ctx.drawImage(zombie_CEO_Down, x * gridSize, y * gridSize - 48, 48, 96);
                                            break;
                                        case Zombie.VC_EXEC:
                                            ctx.drawImage(zombie_VC_EXEC_Down, x * gridSize, y * gridSize - 48, 48, 96);
                                            break;
                                    }
                                }
                                break;
                            case (Pit.DIRECTION_UP):
                                // Add occupant in the seat
                                if (this.gamespace[y][x].capacity == 0) {
                                    switch (this.gamespace[y][x].occupant.type) {
                                        case Zombie.RECRUITER:
                                            ctx.drawImage(zombie_RECRUITER_Up, x * gridSize, y * gridSize - 48, 48, 96);
                                            break;
                                        case Zombie.CFO:
                                            ctx.drawImage(zombie_CFO_Up, x * gridSize, y * gridSize - 48, 48, 96);
                                            break;
                                        case Zombie.CEO:
                                            ctx.drawImage(zombie_CEO_Up, x * gridSize, y * gridSize - 48, 48, 96);
                                            break;
                                        case Zombie.VC_EXEC:
                                            ctx.drawImage(zombie_VC_EXEC_Up, x * gridSize, y * gridSize - 48, 48, 96);
                                            break;
                                    }
                                }
                                ctx.drawImage(chairGreyUpImage, x * gridSize, y * gridSize - 48, 48, 96);
                                break;
                        }
                        break;

                    case (this.gamespace[y][x] instanceof Treasure):

                        ctx.drawImage(treasureImage, x * gridSize, y * gridSize - 48, 48, 96);

                        break;

                    default:
                        break;
                }

            }
        }

        // Draw any objects leaving/joning the gamespace
        let remainingObjects = []; // This will store objects that shouldn't be removed

        for (let object of this.objects) {
            // animate
            switch (true) {

                // FIX: Add in animation to highlight start position
                // Beam of light
                case (object instanceof Player):

                    if (object.animateFrame < 100) {
                        // Create a beam
                        ctx.globalAlpha = 0.5;
                        ctx.fillStyle = '#DAFF02'; // Set the fill color to red
                        let beamWidth = (gridSize / object.animateFrame) * gridSize;
                        ctx.fillRect((object.x + (gridSize / 2)) - (beamWidth / 2), 0, beamWidth, object.y + gridSize);
                        ctx.globalAlpha = 1;

                        remainingObjects.push(object); // Keep the object for the next frame
                        object.animateFrame++;
                    } else {
                        object.animateFrame = 0; // Reset
                    }

                    break;

                case (object instanceof Pit):
                    if (object.y > (0 - object.height)) {
                        // Calculate the y-offset using a sine function to create acceleration
                        // The sine function oscillates between -1 and 1, we shift it to oscillate between 0 and 1 instead
                        let acceleration = Math.sin(object.animateFrame) * 90;

                        // Update the position of the object using the acceleration
                        // You can adjust the factor '0.5' to control the speed of the acceleration
                        object.y -= acceleration;

                        switch (object.direction) {

                            case (Pit.DIRECTION_DOWN):
                                ctx.drawImage(chairGreyDownImage, object.x, object.y - 48, 48, 96);

                                // Add occupant in the seat
                                switch (object.occupant.type) {
                                    case Zombie.RECRUITER:
                                        ctx.drawImage(zombie_RECRUITER_Down, object.x, object.y - 48, 48, 96);
                                        break;
                                    case Zombie.CFO:
                                        ctx.drawImage(zombie_CFO_Down, object.x, object.y - 48, 48, 96);
                                        break;
                                    case Zombie.CEO:
                                        ctx.drawImage(zombie_CEO_Down, object.x, object.y - 48, 48, 96);
                                        break;
                                    case Zombie.VC_EXEC:
                                        ctx.drawImage(zombie_VC_EXEC_Down, object.x, object.y - 48, 48, 96);
                                        break;

                                }
                                break;
                            case (Pit.DIRECTION_UP):
                                // Add occupant in the seat
                                switch (object.occupant.type) {
                                    case Zombie.RECRUITER:
                                        ctx.drawImage(zombie_RECRUITER_Up, object.x, object.y - 48, 48, 96);
                                        break;
                                    case Zombie.CFO:
                                        ctx.drawImage(zombie_CFO_Up, object.x, object.y - 48, 48, 96);
                                        break;
                                    case Zombie.CEO:
                                        ctx.drawImage(zombie_CEO_Up, object.x, object.y - 48, 48, 96);
                                        break;
                                    case Zombie.VC_EXEC:
                                        ctx.drawImage(zombie_VC_EXEC_Up, object.x, object.y - 48, 48, 96);
                                        break;
                                }

                                ctx.drawImage(chairGreyUpImage, object.x, object.y - 48, 48, 96);
                                break;
                        }

                        // Increment time for the next frame
                        object.animateFrame += 0.05; // Adjust this value to control the rate of acceleration

                        remainingObjects.push(object); // Keep the object for the next frame
                    }
                    break;

            }
        }

        // Replace the old objects array with the new one, excluding objects that moved past the point
        this.objects = remainingObjects;

        if (debugMode) {
            ctx.globalAlpha = 0.5;  // Set transparency level (0 to 1)
            ctx.fillStyle = 'green';
            ctx.fillRect(safeBorderSize / 2, safeBorderSize / 2, canvas.width - safeBorderSize, canvas.height - safeBorderSize);
            ctx.globalAlpha = 1;  // Reset
        }
    }
}