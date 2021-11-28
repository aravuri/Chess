const canvas = document.querySelector(".board");
const ctx = canvas.getContext('2d');
let colour = true;
const PIECES = {
    NONE: 0,
    PAWN: 1,
    KNIGHT: 2,
    BISHOP: 3,
    ROOK: 4,
    QUEEN: 5,
    KING: 6
}
const value = {
    0: 0,
    1: 1,
    2: 3,
    3: 3,
    4: 5,
    5: 9,
    6: 1000
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

function getMoveChoices(board, selectedPos) {
    let movesPos = [];
    let selectedPiece = board[selectedPos[1]][selectedPos[0]];
    if (selectedPiece == null) {
        return [];
    }
    switch (selectedPiece.type) {
        case PIECES.PAWN:
            if (selectedPiece.white) {
                if (selectedPos[1] === 0) {
                    return [];
                }
                if (!board[selectedPos[1] - 1][selectedPos[0]]) {
                    movesPos.push([selectedPos[0], selectedPos[1] - 1]);
                }
                if (selectedPos[1] === 6 && !board[selectedPos[1] - 1][selectedPos[0]] && !board[selectedPos[1] - 2][selectedPos[0]]) {
                    movesPos.push([selectedPos[0], selectedPos[1] - 2]);
                }
                if (board[selectedPos[1] - 1][selectedPos[0] - 1]) {
                    movesPos.push([selectedPos[0] - 1, selectedPos[1] - 1]);
                }
                if (board[selectedPos[1] - 1][selectedPos[0] + 1]) {
                    movesPos.push([selectedPos[0] + 1, selectedPos[1] - 1]);
                }
            } else {
                if (selectedPos[1] === 7) {
                    return [];
                }
                if (!board[selectedPos[1] + 1][selectedPos[0]]) {
                    movesPos.push([selectedPos[0], selectedPos[1] + 1]);
                }
                if (selectedPos[1] === 1 && !board[selectedPos[1] + 1][selectedPos[0]] && !board[selectedPos[1] + 2][selectedPos[0]]) {
                    movesPos.push([selectedPos[0], selectedPos[1] + 2]);
                }
                if (board[selectedPos[1] + 1][selectedPos[0] - 1]) {
                    movesPos.push([selectedPos[0] - 1, selectedPos[1] + 1]);
                }
                if (board[selectedPos[1] + 1][selectedPos[0] + 1]) {
                    movesPos.push([selectedPos[0] + 1, selectedPos[1] + 1]);
                }
            }
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
            addDiagonal(board, selectedPos, movesPos);
            break;
        case PIECES.ROOK:
            addCross(board, selectedPos, movesPos);
            break;
        case PIECES.QUEEN:
            addDiagonal(board, selectedPos, movesPos);
            addCross(board, selectedPos, movesPos);
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
    movesPos = movesPos.filter(move => move[0] >= 0 && move[0] < 8 && move[1] >= 0 && move[1] < 8 &&
        (!board[move[1]][move[0]] || board[move[1]][move[0]].white !== board[selectedPos[1]][selectedPos[0]].white));
    // console.log(movesPos);
    return movesPos;
}

function addDiagonal(board, selectedPos, movesPos) {
    let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (let i = 0; i < directions.length; i++) {
        let direction = directions[i];
        let x = selectedPos[0];
        let y = selectedPos[1];
        do {
            x += direction[0];
            y += direction[1];
            movesPos.push([x, y]);
        }
        while (0 <= x && x < 8 && 0 <= y && y < 8 && !board[y][x]);
    }
}

function addCross(board, selectedPos, movesPos) {
    let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let i = 0; i < directions.length; i++) {
        let direction = directions[i];
        let x = selectedPos[0];
        let y = selectedPos[1];
        do {
            x += direction[0];
            y += direction[1];
            movesPos.push([x, y]);
        }
        while (0 <= x && x < 8 && 0 <= y && y < 8 && !board[y][x]);
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

function move(board, pos1, pos2) {
    let copy = board.map(function(arr) {
        return arr.slice();
    });
    copy[pos2[1]][pos2[0]] = copy[pos1[1]][pos1[0]];
    copy[pos1[1]][pos1[0]] = null;
    if (copy[pos2[1]][pos2[0]].type === PIECES.PAWN && (pos2[1] === 7 || pos2[1] === 0)) {
        copy[pos2[1]][pos2[0]] = new Piece(PIECES.QUEEN, copy[pos2[1]][pos2[0]].white);
    }
    return copy;
}

function minimax(position, posEval, movesAhead, side) {
    if (movesAhead === 0) {
        return {move: null, value: posEval(position)};
    }
    let bestMove = {startPos: [-1, -1], endPos: [-1, -1]};
    let bestVal = -99999;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (position[j][i] && position[j][i].white === side) {
                let sPos = [i, j];
                let validMoves = getMoveChoices(position, sPos);
                for (let k = 0; k < validMoves.length; k++) {
                    let moveBoard = move(position, sPos, validMoves[k]);
                    let newVal = posEval(moveBoard, side) -
                        minimax(moveBoard, posEval, movesAhead - 1, !side).value;
                    // console.log(newVal);
                    if (newVal > bestVal) {
                        bestVal = newVal;
                        bestMove.startPos = sPos;
                        bestMove.endPos = validMoves[k];
                    }
                }
            }
        }
    }
    return {move: bestMove, value: bestVal};
}

function defaultPosEval(position, side) {
    let sum = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (position[i][j]) {
                sum += (side === position[i][j].white ? 1 : -1) * value[position[i][j].type];
            }
        }
    }
    return sum + 0.1*Math.random();
}

canvas.addEventListener('mousedown', function(e) {
    let clickedPos = getCursorPosition(canvas, e);
    if (!selectedPos) {
        if (board[clickedPos[1]][clickedPos[0]] && board[clickedPos[1]][clickedPos[0]].white === colour) {
            selectedPos = clickedPos;
            selectedPiece = board[selectedPos[1]][selectedPos[0]];
            movesPos = getMoveChoices(board, selectedPos);
        } else {
            selectedPos = null;
            selectedPiece = null;
            movesPos = [];
        }
    } else {
        if (clickedPos[0] === selectedPos[0] && clickedPos[1] === selectedPos[1]) {
            selectedPos = null;
            selectedPiece = null;
            movesPos = [];
        } else {
            if (isLegal(clickedPos)) {
                board = move(board, selectedPos, clickedPos);
                selectedPos = null;
                selectedPiece = null;
                movesPos = [];
                drawBoard();
                setTimeout(function () {
                    let best = minimax(board, defaultPosEval, 4, false);
                    console.log(best);
                    board = move(board, best.move.startPos, best.move.endPos);
                    drawBoard();
                }, 100)
            } else if (board[clickedPos[1]][clickedPos[0]] && board[clickedPos[1]][clickedPos[0]].white === colour) {
                selectedPos = clickedPos;
                selectedPiece = board[selectedPos[1]][selectedPos[0]];
                movesPos = getMoveChoices(board, selectedPos);
            } else {
                selectedPos = null;
                selectedPiece = null;
                movesPos = [];
            }
        }
    }
    drawBoard();
    // console.log(movesPos);
})

drawBoard();