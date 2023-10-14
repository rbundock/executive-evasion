function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawLevel() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Level: ' + level, 10, 60);  // Positioning it below the score
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
