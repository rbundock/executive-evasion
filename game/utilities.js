function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Barlow';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawLevel() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Barlow';
    ctx.fillText('Day: ' + level, 10, 60);  // Positioning it below the score

    if (debugMode) {
        let gridX = parseInt(canvas.width / gridSize);
        let gridY = parseInt(canvas.height / gridSize);
        ctx.fillText('Grid X: ' + gridX + " Y:" + gridY, 10, 90);  // Positioning it below the score
    }
}

let tileMatrix;  // This will store the type of each tile

function initializeFloorTiles() {
    tileMatrix = [];

    for (let y = 0; y < gamespace.height; y++) {
        let tileRow = [];
        for (let x = 0; x < gamespace.width; x++) {
            // Instead of randomizing during drawing, we randomize during initialization
            if (Math.random() < 0.985) {
                tileRow.push('regular');
            } else if (Math.random() < 0.90) {
                tileRow.push('HC');
            } else {
                tileRow.push('craft');
            }
        }
        tileMatrix.push(tileRow);
    }
}

/*
function drawFloorTiles() {
    for (let x = 0; x < tileMatrix.length; x++) {
        for (let y = 0; y < tileMatrix[x].length; y++) {
            switch (tileMatrix[x][y]) {
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

        }
    }
}
*/

// Utility function to generate random coordinates within given boundaries
function getRandomCoordinate(canvasSize, borderSize, objectSize) {
    const min = borderSize/2; 
    const max = canvasSize - borderSize - objectSize;
    const coordinate = (parseInt((Math.random() * (max - min) + min) / gridSize)) * gridSize;
    return parseInt(coordinate);
}

// Utility function to check collision between two objects
function isColliding(rect1, rect2) {
    return (
        rect2.x < rect1.x + rect1.width &&
        rect2.x + rect2.width > rect1.x &&
        rect2.y < rect1.y + rect1.height &&
        rect2.y + rect2.height > rect1.y
    );
}

function generateQRCode(data) {

    // Clear the element
    document.getElementById("qrcode").innerHTML = "";

    // Create QR Code
    const qr = new QRCode(document.getElementById("qrcode"), {
        text: data,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

async function sendScoreAndGenerateQR(score) {

    // TODO
    // Send score to the server

    // Generate a QR code with the hashed value
    generateQRCode(score);
}
