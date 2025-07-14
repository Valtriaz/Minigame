const gameBoard = document.querySelector('.memory-game');
const movesCountSpan = document.getElementById('moves-count');
const timerSpan = document.getElementById('timer');
const winMessageEl = document.getElementById('win-message');
const restartButton = document.getElementById('restart-button');

const cardEmojis = ['🍕', '🎉', '🎈', '🎁', '⭐', '🚀', '💡', '💻'];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let timer = 0;
let timerInterval = null;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    const gameCards = [...cardEmojis, ...cardEmojis]; // Create fresh pairs for each game
    shuffle(gameCards); 
    gameBoard.innerHTML = ''; // Clear previous board
    gameCards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.emoji = emoji;

        card.innerHTML = `
            <div class="front-face">${emoji}</div>
            <div class="back-face"></div>
        `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // Prevent double-clicking the same card

    // Start the timer on the very first card flip of the game
    if (moves === 0 && !hasFlippedCard) {
        startTimer();
    }

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // First card flipped
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second card flipped
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    moves++;
    movesCountSpan.textContent = moves;
    let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    // It's a match!
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++;
    resetBoard();

    if (matchedPairs === cardEmojis.length) {
        stopTimer();
        setTimeout(() => { // A brief delay for the last card to finish flipping
            winMessageEl.textContent = `You won in ${moves} moves! 🎉`;
            winMessageEl.classList.remove('hidden');
            triggerConfetti();
        }, 600);
    }
}

function startTimer() {
    if (timerInterval) return; // Prevent multiple intervals
    timerInterval = setInterval(() => {
        timer++;
        timerSpan.textContent = timer;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function triggerConfetti() {
    const myCanvas = document.getElementById('confetti-canvas');
    if (!myCanvas || typeof confetti !== 'function') return;

    const myConfetti = confetti.create(myCanvas, { resize: true });

    myConfetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 }
    });
}

function unflipCards() {
    lockBoard = true; // Lock the board to prevent flipping more cards

    // Not a match
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1200);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function restartGame() {
    moves = 0;
    matchedPairs = 0;
    timer = 0;
    timerSpan.textContent = timer;
    stopTimer();
    winMessageEl.classList.add('hidden');
    movesCountSpan.textContent = moves;
    resetBoard();
    // A slight delay before creating the new board for a smoother feel
    setTimeout(createBoard, 200);
}

// Initial game setup
createBoard();

// Event Listeners
restartButton.addEventListener('click', restartGame);