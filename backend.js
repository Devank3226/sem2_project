// backend.js – handles local storage of high score

// Load high score from local storage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const highScore = localStorage.getItem("snakeHighScore") || 0;
  updateHighScoreDisplay(highScore);
});

// Update high score in local storage if current score is higher
function checkAndUpdateHighScore(currentScore) {
  let highScore = parseInt(localStorage.getItem("snakeHighScore") || "0");

  if (currentScore > highScore) {
    localStorage.setItem("snakeHighScore", currentScore);
    highScore = currentScore;
  }

  updateHighScoreDisplay(highScore); // Update only once, not append.
}

// Show high score on the page
function updateHighScoreDisplay(score) {
  let display = document.getElementById("snake-high-score");

  if (!display) {
    display = document.createElement("p");
    display.id = "snake-high-score";
    document.getElementById("game-container").appendChild(display);
  }
  // Update the content rather than appending a new element each time.
  display.textContent = `High Score: ${score}`;
}