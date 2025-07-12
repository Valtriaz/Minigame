// Cache the DOM elements for performance
let playerScore = 0;
let computerScore = 0;
const playerScore_span = document.getElementById("player-score");
const computerScore_span = document.getElementById("computer-score");
const result_p = document.querySelector(".result > p");
const rock_button = document.getElementById("rock");
const paper_button = document.getElementById("paper");
const scissors_button = document.getElementById("scissors");

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

function win(userChoice, computerChoice) {
    playerScore++;
    playerScore_span.innerHTML = playerScore;
    result_p.innerHTML = `${convertToWord(userChoice)} beats ${convertToWord(computerChoice)}. You win! 🔥`;
}

function lose(userChoice, computerChoice) {
    computerScore++;
    computerScore_span.innerHTML = computerScore;
    result_p.innerHTML = `${convertToWord(computerChoice)} beats ${convertToWord(userChoice)}. You lose... 💩`;
}

function draw(userChoice, computerChoice) {
    result_p.innerHTML = `It's a draw. You both chose ${convertToWord(userChoice)}.`;
}

function game(userChoice) {
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

// Add event listeners to the buttons
rock_button.addEventListener('click', () => game("rock"));
paper_button.addEventListener('click', () => game("paper"));
scissors_button.addEventListener('click', () => game("scissors"));

