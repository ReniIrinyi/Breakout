const canvas = document.getElementById("breakout");
const canvasCtx = canvas.getContext("2d");

//Style Canvas
canvas.style.border = "1px solid #0FF";

//Variables and Constants
const paddleWidth = 100;
const paddleMarginBottom = 50;
const paddleHeight = 20;
let leftArrow = false;
let rightArrow = false;
let life = 5; //player has 5 life
const ballRadius = 8;
let score = 0;
const scoreUnit = 10;

//Paddle
const paddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - paddleMarginBottom - paddleHeight,
  width: paddleWidth,
  height: paddleHeight,
  dx: 5,
};

console.log(paddle);
//Draw paddle
const drawPaddle = function () {
  canvasCtx.fillStyle = "#2e3548";
  canvasCtx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  canvasCtx.strokeStyle = "#ffcd05";
  canvasCtx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
};

//create the ball
const ball = {
  x: canvas.width / 2,
  y: paddle.y - ballRadius,
  radius: ballRadius,
  speed: 5,
  dx: 3 * (Math.random() * 3 - 1),
  dy: -3,
};

//draw the ball
const drawBall = function () {
  canvasCtx.beginPath();
  canvasCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  canvasCtx.fillStyle = " #ff3838";
  canvasCtx.fill();
  canvasCtx.strokeStyle = "#fff200";
  canvasCtx.stroke();
  canvasCtx.closePath();
};

//create the bricks
const brick = {
  row: 5,
  column: 5,
  width: 55,
  height: 20,
  offSetLeft: 20,
  offSetTop: 10,
  marginTop: 20,
  fillColor: "#fff200",
  strokeColor: "#ff3838",
};
let bricks = [];
const createbricks = function () {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
      };
    }
  }
};
createbricks();
console.log(bricks);
//draw the bricks
const drawBricks = function () {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status) {
        canvasCtx.fillStyle = brick.fillColor;
        canvasCtx.fillRect(b.x, b.y, brick.width, brick.height);
        canvasCtx.strokeStyle = brick.strokeColor;
        canvasCtx.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
};

//draw function
function draw() {
  drawPaddle();
  drawBall();
  drawBricks();
}

//moving the ball
const moveBall = function () {
  ball.x += ball.dx;
  ball.y += ball.dy;
};
const resetBall = function () {
  ball.x = canvas.width / 2;
  ball.y = paddle.y - ballRadius;
  ball.dx = 3 * (Math.random() * 3 - 1);
  ball.dy = -3;
};
const ballCollision = function () {
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
    ball.dx = -ball.dx;
  if (ball.y - ball.radius < 0) ball.dy = -ball.dy;
  if (ball.y + ball.radius > canvas.height) {
    life--;
    resetBall();
  }
};
console.log(life);

const ballPaddleCollision = function () {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    ball.y > paddle.y
  ) {
    //where the ball hit the paddle
    let collisionPoint = ball.x - (paddle.x + paddle.width / 2);
    collisionPoint = collisionPoint / (paddle.width / 2);
    let angle = collisionPoint * (Math.PI / 3);

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
};

const ballBrickCollision = function () {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y + ball.radius < b.y + brick.height
        ) {
          ball.dy = -ball.dy;
          b.status = false;
          score += scoreUnit;
        }
      }
    }
  }
};

//moving the paddle
document.addEventListener("keydown", function (e) {
  console.log(e.key);
  if (e.key === "ArrowLeft") leftArrow = true;
  if (e.key === "ArrowRight") rightArrow = true;
});

document.addEventListener("keyup", function (e) {
  console.log(e.key);
  if (e.key === "ArrowLeft") leftArrow = false;
  if (e.key === "ArrowRight") rightArrow = false;
});

const movingPaddle = function () {
  if (rightArrow && paddle.x + paddle.width < canvas.width)
    paddle.x += paddle.dx;
  if (leftArrow && paddle.x > 0) paddle.x -= paddle.dx;
};

//game stats
const gameStats = function (text, textX, textY, img, imgX, imgY) {
  canvasCtx.fillStyle = "#fff";
  canvasCtx.font = "24px Comic Sans MS";
};

//update function
const update = function () {
  movingPaddle();
  moveBall();
  ballCollision();
  ballPaddleCollision();
  ballBrickCollision();
};

const loop = function () {
  canvasCtx.drawImage(bgImage, 0, 0);
  draw();
  update();
  requestAnimationFrame(loop);
};
loop();
