/* /minigames/wam/wam.js */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const squares = document.querySelectorAll('.square');
    const scoreDisplay = document.querySelector('#score');
    const timeLeftDisplay = document.querySelector('#time-left');
    const startButton = document.querySelector('#start-button');
    const gameContainer = document.querySelector('.container'); // Get the main container

    // --- Game State ---
    let score = 0;
    let currentTime = 60;
    let hitPosition = null;
    let moleTimerId = null;
    let countdownTimerId = null;
    let gameSpeed = 850; // Time in ms between mole appearances

    /**
     * Clears the 'mole' class from all squares on the grid.
     */
    function clearGrid() {
        squares.forEach(square => {
            square.classList.remove('mole');
        });
    }

    /**
     * Randomly selects a square and adds the 'mole' class to it.
     * Ensures the mole doesn't appear in the same square twice in a row.
     */
    function placeMole() {
        clearGrid();

        let randomPosition = squares[Math.floor(Math.random() * squares.length)];

        // Ensure the mole moves to a new square
        while (randomPosition.id === hitPosition) {
            randomPosition = squares[Math.floor(Math.random() * squares.length)];
        }

        randomPosition.classList.add('mole');
        hitPosition = randomPosition.id;
    }

    /**
     * Starts the timer that moves the mole at a set interval (gameSpeed).
     */
    function startMoleMovement() {
        // Clear any existing timer to prevent speeding up on multiple starts
        clearInterval(moleTimerId);
        moleTimerId = setInterval(placeMole, gameSpeed);
    }

    /**
     * Handles the game's main countdown timer. Ends the game when time is up.
     */
    function startCountdown() {
        currentTime--;
        timeLeftDisplay.textContent = currentTime;

        if (currentTime <= 0) {
            clearInterval(countdownTimerId);
            clearInterval(moleTimerId);
            clearGrid();

            // Announce the final score and reset the start button
            alert('Game Over! Your final score is ' + score);
            startButton.textContent = 'Play Again';
            startButton.style.display = 'block';
            countdownTimerId = null; // Mark the game as not running
        }
    }

    /**
     * Initializes and starts a new game.
     */
    function startGame() {
        // Reset game variables
        score = 0;
        currentTime = 60;
        scoreDisplay.textContent = score;
        timeLeftDisplay.textContent = currentTime;

        // Hide the start button and clear any leftover timers
        startButton.style.display = 'none';
        clearInterval(moleTimerId);
        clearInterval(countdownTimerId);

        // Start the game loops
        startMoleMovement();
        countdownTimerId = setInterval(startCountdown, 1000);
    }

    // --- Event Listeners ---

    // Add a click listener to the start button
    startButton.addEventListener('click', startGame);

    // Add a listener to each square to check for a successful "whack"
    squares.forEach(square => {
        // Using 'mousedown' feels more responsive than 'click' for this game
        square.addEventListener('mousedown', () => {
            // Guard clause: Do nothing if the game isn't running
            if (!countdownTimerId) return;

            // --- UPDATED: Check for correct vs. incorrect hit ---
            if (square.id === hitPosition) {
                // --- Correct Whack ---
                score++;
                scoreDisplay.textContent = score; 
                hitPosition = null; // Prevents scoring multiple times on the same mole
                square.classList.remove('mole'); // Instantly remove the whacked mole

                // Add and remove 'score-pop' class for visual feedback
                scoreDisplay.classList.add('score-pop');
                setTimeout(() => scoreDisplay.classList.remove('score-pop'), 300);

            } else {
                // --- Wrong Whack (Miss) ---
                // Add 'shake' class to the container for visual feedback
                gameContainer.classList.add('shake');
                // Remove the class after the animation ends to allow it to be re-triggered
                setTimeout(() => gameContainer.classList.remove('shake'), 400);
            }
        });
    });
});