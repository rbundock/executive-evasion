function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Barlow';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawLevel() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Barlow';
    ctx.fillText('Day: ' + level, 10, 60);  // Positioning it below the score

    let gridX = parseInt(canvas.width / 20);
    let gridY = parseInt(canvas.height / 20);
    ctx.fillText('Grid X: ' + gridX + " Y:" + gridY, 10, 90);  // Positioning it below the score

}


// Utility function to generate random coordinates within given boundaries
function getRandomCoordinate(max, borderSize) {
    const coordinate = (parseInt((Math.random() * (max - borderSize) + (borderSize/2)) / gridSize)) * gridSize;
    return parseInt(coordinate);
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
