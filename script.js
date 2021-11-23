const canvas = document.querySelector(".board");
const ctx = canvas.getContext('2d');
const PIECES = {
    NONE: 0,
    PAWN: 1,
    KNIGHT: 2,
    BISHOP: 3,
    ROOK: 4,
    QUEEN: 5,
    KING: 6
}
const SQUARE_SIZE = 50;

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPieces();
}

function drawBackground() {
    let white = true;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            ctx.fillStyle = white ? 'rgb(240, 217, 183)' : 'rgb(180, 136, 102)';
            ctx.fillRect(i*SQUARE_SIZE, j*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            white = !white;
        }
        white = !white;
    }
}

function drawPieces() {

}

drawBoard()