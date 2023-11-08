function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Barlow';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawLevel() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Barlow';
    ctx.fillText('Day: ' + level, 10, 60);  // Positioning it below the score

    ctx.fillText('Executives: ' + numTotalZombies + '/' + numZombiesFallen, 10, 90);

    if (debugMode) {
        ctx.fillText('Zombies Speed: ' + zombieDelay, 10, 120);
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

// Utility function to generate random coordinates within given boundaries
function getRandomCoordinate(canvasSize, borderSize, objectSize) {
    const min = borderSize / 2;
    const max = canvasSize - borderSize - objectSize;
    const coordinate = (parseInt((Math.random() * (max - min) + min) / gridSize)) * gridSize;
    return parseInt(coordinate);
}

// Utility function to check collision between two objects
function isColliding(rect1, rect2, distance = 1) {
    return isCollidingGrid(rect1, rect2, distance);
}

function isCollidingGrid(rect1, rect2, distance = 1) {

    r1gridX = parseInt(rect1.x / gridSize);
    r1gridY = parseInt(rect1.y / gridSize);
    r2gridX = parseInt(rect2.x / gridSize);
    r2gridY = parseInt(rect2.y / gridSize);

    return (
        r2gridX < r1gridX + distance &&
        r2gridX + distance > r1gridX &&
        r2gridY < r1gridY + distance &&
        r2gridY + distance > r1gridY
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

function newImage(src) {
    var image = new Image();
    image.src = src;
    return image;
}

function choosePlayer() {

    switch (Math.floor(Math.random() * (1 + 1))) {
        case 0:
            playerImageUp = player1ImageUp;
            playerImageDown = player1ImageDown;
            playerImageLeft = player1ImageLeft;
            playerImageRight = player1ImageRight;
            break;
        case 1:
            playerImageUp = player2ImageUp;
            playerImageDown = player2ImageDown;
            playerImageLeft = player2ImageLeft;
            playerImageRight = player2ImageRight;
            break;
    }
}

async function sendScoreAndGenerateQR(score) {

    // TODO
    // Send score to the server

    // Generate a QR code with the hashed value
    generateQRCode(score);
}
