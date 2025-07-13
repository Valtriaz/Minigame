// Cache the DOM elements for performance
let playerScore = 0;
let computerScore = 0;
let gameIsOver = false;
const WINNING_SCORE = 3;

const container = document.querySelector(".container");
const playerScore_span = document.getElementById("player-score");
const computerScore_span = document.getElementById("computer-score");
const result_p = document.querySelector(".result > p");
const rock_button = document.getElementById("rock");
const paper_button = document.getElementById("paper");
const scissors_button = document.getElementById("scissors");
const choicesDiv = document.getElementById("choices-div");
const gameOverScreen = document.getElementById("game-over-screen");
const finalMessage = document.getElementById("final-message");
const playAgainButton = document.getElementById("play-again-button");

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomNumber = Math.floor(Math.random() * 3);
    return choices[randomNumber];
}

function convertToWord(word) {
    if (word === "rock") return "Rock";
    if (word === "paper") return "Paper";
    return "Scissors";
}

function convertToEmoji(word) {
    if (word === "rock") return "✊";
    if (word === "paper") return "✋";
    return "✌️";
}

function win(userChoice, computerChoice) {
    const userChoice_div = document.getElementById(userChoice);
    playerScore++;
    playerScore_span.innerHTML = playerScore;
    playerScore_span.classList.add('score-pulse');
    setTimeout(() => playerScore_span.classList.remove('score-pulse'), 300);
    result_p.innerHTML = `Your ${convertToEmoji(userChoice)} beats their ${convertToEmoji(computerChoice)}. You win! 🔥`;
    userChoice_div.classList.add('green-glow');
    setTimeout(() => userChoice_div.classList.remove('green-glow'), 500);

    if (playerScore === WINNING_SCORE) {
        endGame("You won the match! 🎉", true);
    }
}

function lose(userChoice, computerChoice) {
    const userChoice_div = document.getElementById(userChoice);
    computerScore++;
    computerScore_span.innerHTML = computerScore;
    computerScore_span.classList.add('score-pulse');
    setTimeout(() => computerScore_span.classList.remove('score-pulse'), 300);
    result_p.innerHTML = `Their ${convertToEmoji(computerChoice)} beats your ${convertToEmoji(userChoice)}. You lose... 😔`;
    userChoice_div.classList.add('red-glow');
    setTimeout(() => userChoice_div.classList.remove('red-glow'), 500);

    if (computerScore === WINNING_SCORE) {
        endGame("The computer won the match... 😔", false);
    }
}

function draw(userChoice, computerChoice) {
    const userChoice_div = document.getElementById(userChoice);
    result_p.innerHTML = `It's a draw. You both chose ${convertToEmoji(userChoice)}.`;
    userChoice_div.classList.add('gray-glow');
    setTimeout(() => userChoice_div.classList.remove('gray-glow'), 500);
}

function game(userChoice) {
    if (gameIsOver) return;

    const computerChoice = getComputerChoice();
    // A clever way to check all outcomes
    switch (userChoice + computerChoice) {
        case "rockscissors":
        case "paperrock":
        case "scissorspaper":
            win(userChoice, computerChoice);
            break;
        case "rockpaper":
        case "paperscissors":
        case "scissorsrock":
            lose(userChoice, computerChoice);
            break;
        case "rockrock":
        case "paperpaper":
        case "scissorsscissors":
            draw(userChoice, computerChoice);
            break;
    }
}

function endGame(message, playerWon) {
    gameIsOver = true;
    finalMessage.textContent = message;
    choicesDiv.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    playAgainButton.style.display = "block";

    if (playerWon) {
        triggerConfetti();
    } else {
        container.classList.add('shake');
        // Remove the class after the animation completes
        setTimeout(() => container.classList.remove('shake'), 500);
    }
}

function triggerConfetti() {
    if (typeof confetti !== 'function') return;
    const myCanvas = document.getElementById('confetti-canvas');
    if (!myCanvas) return;

    const myConfetti = confetti.create(myCanvas, { resize: true });

    myConfetti({ particleCount: 200, spread: 160, origin: { y: 0.6 } });
}

function resetGame() {
    gameIsOver = false;
    playerScore = 0;
    computerScore = 0;
    playerScore_span.textContent = playerScore;
    computerScore_span.textContent = computerScore;

    result_p.textContent = "Make your move!";
    gameOverScreen.classList.add('hidden');
    choicesDiv.classList.remove('hidden');
    finalMessage.textContent = "";
    playAgainButton.style.display = "none";
}

// Add event listeners to the buttons
rock_button.addEventListener('click', () => game("rock"));
paper_button.addEventListener('click', () => game("paper"));
scissors_button.addEventListener('click', () => game("scissors"));
playAgainButton.addEventListener('click', resetGame);
