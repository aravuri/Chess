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
const text = {
    0: null,
    1: "pawn",
    2: "knight",
    3: "bishop",
    4: "rook",
    5: "queen",
    6: "king"
}
const SQUARE_SIZE = 80;
canvas.width = SQUARE_SIZE*8
canvas.height = SQUARE_SIZE*8
function Piece(type, white) {
    this.type = type;
    this.white = white;
}
let board = [
    [new Piece(PIECES.ROOK, false), new Piece(PIECES.KNIGHT, false), new Piece(PIECES.BISHOP, false), new Piece(PIECES.QUEEN, false),
        new Piece(PIECES.KING, false), new Piece(PIECES.BISHOP, false), new Piece(PIECES.KNIGHT, false), new Piece(PIECES.ROOK, false)],
    [new Piece(PIECES.PAWN, false), new Piece(PIECES.PAWN, false), new Piece(PIECES.PAWN, false), new Piece(PIECES.PAWN, false),
        new Piece(PIECES.PAWN, false), new Piece(PIECES.PAWN, false), new Piece(PIECES.PAWN, false), new Piece(PIECES.PAWN, false)],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [new Piece(PIECES.PAWN, true), new Piece(PIECES.PAWN, true), new Piece(PIECES.PAWN, true), new Piece(PIECES.PAWN, true),
        new Piece(PIECES.PAWN, true), new Piece(PIECES.PAWN, true), new Piece(PIECES.PAWN, true), new Piece(PIECES.PAWN, true)],
    [new Piece(PIECES.ROOK, true), new Piece(PIECES.KNIGHT, true), new Piece(PIECES.BISHOP, true), new Piece(PIECES.QUEEN, true),
        new Piece(PIECES.KING, true), new Piece(PIECES.BISHOP, true), new Piece(PIECES.KNIGHT, true), new Piece(PIECES.ROOK, true)]
]

function getPath(piece) {
    if (text[piece.type] != null) {
        return "resources/" + (piece.white ? 'w' : 'b') + text[piece.type] + ".png";
    }
    return null;
}

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
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let piece = board[i][j];
            if (piece != null) {
                let path = getPath(piece);
                let img = new Image();
                img.src = path;
                console.log(img);
                img.onload = function () {
                    ctx.drawImage(img, j * SQUARE_SIZE, i * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                }
            }
        }
    }
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left)/SQUARE_SIZE);
    const y = Math.floor((event.clientY - rect.top)/SQUARE_SIZE);
    console.log("x: " + x + " y: " + y);
}

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

drawBoard()