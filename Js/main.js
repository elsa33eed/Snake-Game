const gameBoard = document.querySelector(".game-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".control i");

let foodX, foodY;

let snakeX = 10,
  snakeY = 5,
  snakeBody = [];

let dirX = 0,
  dirY = 0;

let gameOver = false;

let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`; // to update high score in screen

//Make random number for food position
const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 20) + 1;
  foodY = Math.floor(Math.random() * 13) + 1;
};

const handleGameOver = () => {
  clearInterval(stopInterval);
  alert("Game Over! press OK to replay...");
  location.reload();
};

const changeDirection = (e) => {
  //change direction of snake
  if (e.key === "ArrowUp" && dirY != 1) {
    dirX = 0;
    dirY = -1;
  } else if (e.key === "ArrowDown" && dirY != -1) {
    dirX = 0;
    dirY = 1;
  } else if (e.key === "ArrowLeft" && dirX != 1) {
    dirX = -1;
    dirY = 0;
  } else if (e.key === "ArrowRight" && dirX != -1) {
    dirX = 1;
    dirY = 0;
  }
};

controls.forEach((key) => {
  key.addEventListener("click", () => {
    changeDirection({ key: key.dataset.key });
  });
});

const initGame = () => {
  if (gameOver) return handleGameOver();
  //food and snake html element
  let htmlElement = `<div class="food" style="grid-area: ${foodY}/${foodX}"><img src="../Images/apple.png" width="20px" alt="food" /></div>`;

  //to change apple position if snake eat apple
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); //push food array position to current array snake body position
    score++; // to incerment score
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerHTML = `Score: ${score}`; // to update score in screen
    highScoreElement.innerHTML = `High Score: ${highScore}`; // to update high score in screen
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // this loop start from the end to start to move snake body to the right to make snake move
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY]; //reset first element of snake to current snake position

  //to changed direction of snake to make snake move up, down, left and right
  snakeX += dirX;
  snakeY += dirY;

  //check if snake hit the line or not
  if (snakeX <= 0 || snakeX > 20 || snakeY <= 0 || snakeY > 15) {
    gameOver = true;
  }
  //snake html element
  for (let i = 0; i < snakeBody.length; i++) {
    htmlElement += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  gameBoard.innerHTML = htmlElement;
};

changeFoodPosition();
var stopInterval = setInterval(initGame, 200);
document.addEventListener("keydown", changeDirection);
