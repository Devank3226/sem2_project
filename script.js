// Function to load a game into the container dynamically
function loadGame(game) {
  const container = document.getElementById("game-container");

  // Show the game container
  container.style.display = "block";

  if (game === "tic-tac-toe") {
    container.innerHTML = `
      <div id="tic-tac-toe">
        <h2>Tic Tac Toe</h2>
        <div id="board">
          <div class="cell" data-index="0"></div>
          <div class="cell" data-index="1"></div>
          <div class="cell" data-index="2"></div>
          <div class="cell" data-index="3"></div>
          <div class="cell" data-index="4"></div>
          <div class="cell" data-index="5"></div>
          <div class="cell" data-index="6"></div>
          <div class="cell" data-index="7"></div>
          <div class="cell" data-index="8"></div>
        </div>
        <p id="status"></p>
        <button id="reset">Reset Game</button>
      </div>
    `;
    initTicTacToe();
  } else if (game === "rock-paper-scissor") {
    container.innerHTML = `
      <div id="rps-game">
        <h2>Rock Paper Scissors</h2>
        <p id="score">Player: 0 | Computer: 0</p>
        <p id="result">Make your choice!</p>
        <div id="choices">
          <button id="rock">✊ Rock</button>
          <button id="paper">✋ Paper</button>
          <button id="scissors">✌️ Scissors</button>
        </div>
        <button id="reset-game">Reset Game</button>
      </div>
    `;
    initRockPaperScissors();
  } else if (game === "memory-game") {
    container.innerHTML = `
      <div id="memory-game">
        <h2>Memory Game</h2>
        <div id="difficulty-selector">
          <button onclick="startMemoryGame(4)">4x4 Grid</button>
          <button onclick="startMemoryGame(6)">6x6 Grid</button>
        </div>
        <div id="card-grid"></div>
        <p id="moves">Moves: 0</p>
        <button id="reset-memory" style="display: none;">Reset Game</button>
      </div>
    `;
  } else if (game === "snake-game") {
  container.innerHTML = `
    <div id="snake-game">
      <h2>Snake Game</h2>
      <canvas id="snake-canvas" width="400" height="400"></canvas>
      <p id="snake-score">Score: 0</p>
      <button id="start-game">Start Game</button>
    </div>
    <div id="popup" class="hidden">
      <div id="popup-content">
        <h2 id="popup-message"></h2>
        <button id="restart-game">Restart Game</button>
      </div>
    </div>
  `;
  initSnakeGame(); // Re-attach everything after inject
}
 else {
    // For other games (not implemented yet)
    container.innerHTML = `<p>${game} is not yet implemented!</p>`;
  }
}

// Tic Tac Toe Game Logic
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];

function initTicTacToe() {
  currentPlayer = "X";
  board = ["", "", "", "", "", "", "", "", ""];
  const cells = document.querySelectorAll(".cell");
  const status = document.getElementById("status");
  status.textContent = `Player ${currentPlayer}'s turn`;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.addEventListener("click", handleCellClick);
  });

  document.getElementById("reset").addEventListener("click", initTicTacToe);
  hidePopup();
}

function handleCellClick(e) {
  const cell = e.currentTarget;
  const index = cell.getAttribute("data-index");

  if (board[index] !== "") return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    showPopup(`Player ${currentPlayer} wins!`, "tic-tac-toe");
    removeCellListeners();
    return;
  }
  if (board.every(cell => cell !== "")) {
    showPopup("It's a draw!", "tic-tac-toe");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById("status").textContent = `Player ${currentPlayer}'s turn`;
}

function removeCellListeners() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.removeEventListener("click", handleCellClick);
  });
}

function checkWin(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

// Rock Paper Scissors Game Logic
let playerScore = 0;
let computerScore = 0;

function initRockPaperScissors() {
  playerScore = 0;
  computerScore = 0;
  updateScore();

  document.getElementById("rock").addEventListener("click", () => playRound("rock"));
  document.getElementById("paper").addEventListener("click", () => playRound("paper"));
  document.getElementById("scissors").addEventListener("click", () => playRound("scissors"));
  document.getElementById("reset-game").addEventListener("click", initRockPaperScissors);
}

function playRound(playerChoice) {
  const choices = ["rock", "paper", "scissors"];
  const computerChoice = choices[Math.floor(Math.random() * 3)];
  const result = getResult(playerChoice, computerChoice);

  document.getElementById("result").textContent = `You chose: ${getEmoji(playerChoice)} | Computer chose: ${getEmoji(computerChoice)}`;

  if (result === "win") {
    playerScore++;
    document.getElementById("result").textContent += " - You win!";
  } else if (result === "lose") {
    computerScore++;
    document.getElementById("result").textContent += " - You lose!";
  } else {
    document.getElementById("result").textContent += " - It's a draw!";
  }

  updateScore();
}

function getResult(player, computer) {
  if (player === computer) return "draw";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "scissors" && computer === "paper") ||
    (player === "paper" && computer === "rock")
  ) {
    return "win";
  }
  return "lose";
}

function updateScore() {
  document.getElementById("score").textContent = `Player: ${playerScore} | Computer: ${computerScore}`;
}

function getEmoji(choice) {
  switch (choice) {
    case "rock": return "✊";
    case "paper": return "✋";
    case "scissors": return "✌️";
    default: return "";
  }
}

// Memory Game Logic
let cards = [];
let flippedCards = [];
let moves = 0;
let gridSize = 4; // Default grid size

function startMemoryGame(size) {
  gridSize = size;
  initMemoryGame();
}

function initMemoryGame() {
  moves = 0;
  flippedCards = [];
  cards = [];

  const cardValues = [];
  const pairs = Math.floor((gridSize * gridSize) / 2);

  for (let i = 0; i < pairs; i++) {
    cardValues.push(String.fromCodePoint(0x1F600 + i)); // Use emojis as card values
    cardValues.push(String.fromCodePoint(0x1F600 + i));
  }

  shuffle(cardValues);

  const grid = document.getElementById("card-grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;

  cardValues.forEach((value, index) => {
    const card = document.createElement("div");
    card.classList.add("card", "hidden");
    card.setAttribute("data-value", value);
    card.addEventListener("click", flipCard);
    grid.appendChild(card);
    cards.push(card);
  });

  document.getElementById("moves").textContent = `Moves: ${moves}`;
  document.getElementById("reset-memory").style.display = "inline-block";
  document.getElementById("reset-memory").addEventListener("click", initMemoryGame);
}

function flipCard(e) {
  const card = e.currentTarget;

  if (flippedCards.length === 2 || card.classList.contains("matched") || !card.classList.contains("hidden")) return;

  card.classList.remove("hidden");
  card.textContent = card.getAttribute("data-value");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    document.getElementById("moves").textContent = `Moves: ${moves}`;

    setTimeout(() => {
      checkMatch();
    }, 1000);
  }
}

function checkMatch() {
  const [firstCard, secondCard] = flippedCards;

  if (firstCard.getAttribute("data-value") === secondCard.getAttribute("data-value")) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
  } else {
    firstCard.classList.add("hidden");
    secondCard.classList.add("hidden");
    firstCard.textContent = "";
    secondCard.textContent = "";
  }

  flippedCards = [];

  if (document.querySelectorAll(".matched").length === cards.length) {
    showPopup("You win! All pairs matched!", "memory-game");
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function initSnakeGame() {
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('start-game');
  const restartBtn = document.getElementById('restart-game');
  const scoreDisplay = document.getElementById('snake-score');
  const popup = document.getElementById('popup');
  const popupMsg = document.getElementById('popup-message');
  const highScoreDisplay = document.getElementById('snake-high-score'); // Display for high score

  let snake = [];
  let direction = 'RIGHT';
  let food = {};
  let score = 0;
  let speed = 200;
  let gameInterval;

  const snakeSize = 20;
  const canvasSize = 400;

  // Load the high score from localStorage
  const highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
  updateHighScoreDisplay(highScore); // Show the high score when the game starts

  function startGame() {
    score = 0;
    speed = 200;
    snake = [{ x: 100, y: 100 }];
    direction = 'RIGHT';
    food = spawnFood();
    scoreDisplay.textContent = `Score: ${score}`;
    popup.classList.add('hidden');
    startBtn.style.display = 'none';
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
  }

  function restartGame() {
    popup.classList.add('hidden');
    startBtn.style.display = 'block';
  }

  function updateGame() {
    moveSnake();
    checkCollision();
    updateCanvas();
    updateScore();
  }

  function moveSnake() {
    let head = { ...snake[0] };

    if (direction === 'LEFT') head.x -= snakeSize;
    if (direction === 'RIGHT') head.x += snakeSize;
    if (direction === 'UP') head.y -= snakeSize;
    if (direction === 'DOWN') head.y += snakeSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      food = spawnFood();
      if (score % 5 === 0) {
        speed *= 0.9;
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, speed);
      }
    } else {
      snake.pop();
    }
  }

  function updateCanvas() {
  ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas before drawing

  const gridSize = snakeSize; // Grid size equal to snake size
  const rows = canvasSize / gridSize;
  const cols = canvasSize / gridSize;

  // Draw the chessboard grid
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      // Alternate between two colors for the grid
      if ((x + y) % 2 === 0) {
        ctx.fillStyle = '#fff308'; // Light green squares
      } else {
        ctx.fillStyle = '#face0a'; // Dark green squares
      }
      ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize); // Draw the square
    }
  }

  // Draw the snake
  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? 'green' : 'lightgreen'; // Head is green, body is light green
    ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize); // Draw snake segment
  });

  // Draw the food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}


  function spawnFood() {
    const max = canvasSize / snakeSize;
    let x = Math.floor(Math.random() * max) * snakeSize;
    let y = Math.floor(Math.random() * max) * snakeSize;
    return { x, y };
  }

  function changeDirection(e) {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    else if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  }

  function checkCollision() {
    const head = snake[0];
    const hitWall = head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize;
    const hitSelf = snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y);

    if (hitWall || hitSelf) {
      clearInterval(gameInterval);
      popupMsg.textContent = `Game Over! Final Score: ${score}`;
      popup.classList.remove('hidden');
      // Check if we need to update the high score
      checkAndUpdateHighScore(score);
    }
  }

  function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
  }

  // Check and update high score
  function checkAndUpdateHighScore(currentScore) {
    let highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
    if (currentScore > highScore) {
      localStorage.setItem('snakeHighScore', currentScore);
      highScore = currentScore; // Update local variable to display
    }
    updateHighScoreDisplay(highScore); // Update display with the new high score
  }

  // Show the high score
  function updateHighScoreDisplay(score) {
  const highScoreDisplay = document.getElementById('snake-high-score');
  if (highScoreDisplay) {
    highScoreDisplay.textContent = `High Score: ${score}`;
  } else {
    const display = document.createElement('p');
    display.id = 'snake-high-score';
    display.textContent = `High Score: ${score}`;
    document.getElementById('game-container').appendChild(display);
  }
}

  // Attach event listeners
  document.addEventListener('keydown', changeDirection);
  startBtn.onclick = startGame;
  restartBtn.onclick = restartGame;
}

// Popup Logic
function showPopup(message, gameType) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const restartButton = document.getElementById("restart-game");

  popupMessage.textContent = message;
  popup.classList.remove("hidden");

  restartButton.onclick = () => {
    hidePopup();
    loadGame(gameType); // Reload the correct game
  };
}

function hidePopup() {
  document.getElementById("popup").classList.add("hidden");
}