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
let pieceImgs = {

}
const SQUARE_SIZE = 80;
const MOVE_CIRCLE_RAD = 10;
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
let selectedPos = null;
let selectedPiece = null;
let movesPos = [];

function getPath(piece) {
    if (text[piece.type] != null) {
        return "resources/" + (piece.white ? 'w' : 'b') + text[piece.type] + ".png";
    }
    return null;
}

function drawBoard() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPieces();
    drawMoves();
}

function drawBackground() {
    let white = true;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            ctx.fillStyle = white ? 'rgb(240, 217, 183)' : 'rgb(180, 136, 102)';
            if (selectedPos != null && selectedPos[0] === j && selectedPos[1] === i) {
                ctx.fillStyle = 'rgb(170, 161, 76)';
            }
            ctx.fillRect(j*SQUARE_SIZE, i*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
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
                if (pieceImgs[path] === undefined) {
                    let img = new Image();
                    img.src = path;
                    img.onload = function () {
                        ctx.drawImage(img, j * SQUARE_SIZE, i * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                        pieceImgs[path] = img;
                    }
                } else {
                    ctx.drawImage(pieceImgs[path], j * SQUARE_SIZE, i * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                }
            }
        }
    }
}

function drawMoves() {
    movesPos.forEach(pos => {
        drawCircle(ctx, pos[0]*SQUARE_SIZE+SQUARE_SIZE/2, pos[1]*SQUARE_SIZE+SQUARE_SIZE/2,
            MOVE_CIRCLE_RAD, 'rgb(170, 161, 76)');
    })
}

function drawCircle(ctx, x, y, radius, fill) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = fill
    ctx.fill()
}


function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left)/SQUARE_SIZE);
    const y = Math.floor((event.clientY - rect.top)/SQUARE_SIZE);
    return [x, y];
}

function getMoveChoices() {
    let movesPos = [];
    switch (selectedPiece.type) {
        case PIECES.PAWN:
            movesPos.push([selectedPos[0], selectedPos[1] - 1]);
            break;
        case PIECES.KNIGHT:
            movesPos.push([selectedPos[0] - 2, selectedPos[1] - 1]);
            movesPos.push([selectedPos[0] - 1, selectedPos[1] - 2]);
            movesPos.push([selectedPos[0] + 2, selectedPos[1] - 1]);
            movesPos.push([selectedPos[0] + 1, selectedPos[1] - 2]);
            movesPos.push([selectedPos[0] - 2, selectedPos[1] + 1]);
            movesPos.push([selectedPos[0] - 1, selectedPos[1] + 2]);
            movesPos.push([selectedPos[0] + 2, selectedPos[1] + 1]);
            movesPos.push([selectedPos[0] + 1, selectedPos[1] + 2]);
            break;
        case PIECES.BISHOP:
            addDiagonal(movesPos);
            break;
        case PIECES.ROOK:
            addCross(movesPos);
            break;
        case PIECES.QUEEN:
            addDiagonal(movesPos);
            addCross(movesPos);
            break;
        case PIECES.KING:
            movesPos.push([selectedPos[0] - 1, selectedPos[1] - 1]);
            movesPos.push([selectedPos[0] - 1, selectedPos[1] + 1]);
            movesPos.push([selectedPos[0] + 1, selectedPos[1] - 1]);
            movesPos.push([selectedPos[0] + 1, selectedPos[1] + 1]);
            movesPos.push([selectedPos[0] - 1, selectedPos[1]]);
            movesPos.push([selectedPos[0] + 1, selectedPos[1]]);
            movesPos.push([selectedPos[0], selectedPos[1] + 1]);
            movesPos.push([selectedPos[0], selectedPos[1] - 1]);
            break;
    }
    return movesPos;
}

function addDiagonal(movesPos) {
    let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (let i = 0; i < directions.length; i++) {
        let direction = directions[i];
        let x = selectedPos[0];
        let y = selectedPos[1];
        console.log(direction);
        console.log(x);
        console.log(y);
        do {
            x += direction[0];
            y += direction[1];
            console.log(x + " " + y);
            movesPos.push([x, y]);
            console.log(movesPos);
        }
        while (0 <= x && x < 8 && 0 <= y && y < 8 && !board[y][x]);
        console.log(movesPos);
    }
}

function addCross(movesPos) {
    let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let i = 0; i < directions.length; i++) {
        let direction = directions[i];
        let x = selectedPos[0];
        let y = selectedPos[1];
        console.log(direction);
        console.log(x);
        console.log(y);
        do {
            x += direction[0];
            y += direction[1];
            console.log(x + " " + y);
            movesPos.push([x, y]);
            console.log(movesPos);
        }
        while (0 <= x && x < 8 && 0 <= y && y < 8 && !board[y][x]);
        console.log(movesPos);
    }
}

function isLegal(position) {
    for (let i = 0; i < movesPos.length; i++) {
        if (position[0] === movesPos[i][0] && position[1] === movesPos[i][1]) {
            return true;
        }
    }
    return false;
}

function move(pos1, pos2) {
    board[pos2[1]][pos2[0]] = board[pos1[1]][pos1[0]];
    board[pos1[1]][pos1[0]] = null;
}

canvas.addEventListener('mousedown', function(e) {
    let clickedPos = getCursorPosition(canvas, e);
    if (!selectedPos) {
        if (board[clickedPos[1]][clickedPos[0]]) {
            selectedPos = clickedPos;
            selectedPiece = board[selectedPos[1]][selectedPos[0]];
            movesPos = getMoveChoices();
        } else {
            selectedPos = null;
            selectedPiece = null;
            movesPos = [];
        }
    } else {
        if (isLegal(clickedPos)) {
            move(selectedPos, clickedPos);
            selectedPos = null;
            selectedPiece = null;
            movesPos = [];
        } else if (board[clickedPos[1]][clickedPos[0]]) {
            selectedPos = clickedPos;
            selectedPiece = board[selectedPos[1]][selectedPos[0]];
            movesPos = getMoveChoices();
        }
    }
    drawBoard();
    console.log(movesPos);
})

drawBoard();