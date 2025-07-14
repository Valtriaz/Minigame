// DOM Elements
const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('status-text');
const restartButton = document.getElementById('restart-button');

// Game Constants
const PLAYER_X = 'x';
const PLAYER_O = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Game State
let currentPlayer;
let gameActive;

function startGame() {
    gameActive = true;
    currentPlayer = PLAYER_X;
    statusText.textContent = `Your turn (${PLAYER_X.toUpperCase()})`;
    statusText.classList.remove('win', 'lose', 'draw');

    cells.forEach(cell => {
        cell.classList.remove(PLAYER_X, PLAYER_O, 'win');
        // UPDATED: Use a zero-width space to stabilize cell dimensions
        cell.textContent = '\u200B';
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick, { once: true });
    });
}

function handleCellClick(e) {
    if (!gameActive) return;
    const cell = e.target;

    // Player's move
    placeMark(cell, currentPlayer);
    if (checkWin(currentPlayer)) {
        endGame(false);
        return;
    }
    if (isDraw()) {
        endGame(true);
        return;
    }

    // Switch to computer's turn
    swapTurns();
    statusText.textContent = `Computer's turn (${PLAYER_O.toUpperCase()})...`;

    // Computer's move (with a slight delay for better UX)
    setTimeout(() => {
        if (gameActive) {
            computerMove();
            if (checkWin(currentPlayer)) {
                endGame(false);
                return;
            }
            if (isDraw()) {
                endGame(true);
                return;
            }
            swapTurns();
            statusText.textContent = `Your turn (${PLAYER_X.toUpperCase()})`;
        }
    }, 800);
}

function computerMove() {
    const availableCells = [...cells].filter(cell => {
        return !cell.classList.contains(PLAYER_X) && !cell.classList.contains(PLAYER_O);
    });
    // Simple AI: pick a random available cell
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    if (randomCell) {
        placeMark(randomCell, currentPlayer);
    }
}

function placeMark(cell, player) {
    cell.classList.add(player);
    cell.textContent = player;
}

function swapTurns() {
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
}

function checkWin(player) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(player);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(PLAYER_X) || cell.classList.contains(PLAYER_O);
    });
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        statusText.textContent = "It's a Draw!";
        statusText.classList.add('draw');
    } else {
        const isWinner = currentPlayer === PLAYER_X;
        statusText.textContent = isWinner ? 'You Win!' : 'Computer Wins!';
        statusText.classList.add(isWinner ? 'win' : 'lose');
        highlightWinningCells();
    }
}

function highlightWinningCells() {
    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => cells[index].classList.contains(currentPlayer));
    });
    if (winningCombination) {
        winningCombination.forEach(index => cells[index].classList.add('win'));
    }
}

// Event Listeners
restartButton.addEventListener('click', startGame);

// Initial game start
startGame();