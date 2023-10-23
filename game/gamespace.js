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
                switch (this.gamespace[x][y]) {
                    case Gamespace.CHAIR_GREY_UP:
                        ctx.drawImage(chairGreyUpImage, x * gridSize, y * gridSize, gridSize, gridSize*2);
                    break;
                    case Gamespace.CHAIR_GREY_DOWN:
                        ctx.drawImage(chairGreyDownImage, x * gridSize, y * gridSize, gridSize, gridSize*2);
                    break;
                }
    
            }
        }
    }
}