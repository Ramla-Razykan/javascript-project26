const canvas = document.getElementById('gameSnake');
const ctx = canvas.getContext('2d');

let box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
};
let direction = 'RIGHT';
let score = 0;
let speed = 400;
let game;
let isPaused = false;

let eatSound = new Audio('sound/bite-cartoon.mp3');
let gameOverSound = new Audio('sound/gameOver.wav');

// Event Listeners for buttons
document.addEventListener('keydown', changeDirection);
document.getElementById('left').addEventListener('click', () => changeDirection({ keyCode: 37 }));
document.getElementById('up').addEventListener('click', () => changeDirection({ keyCode: 38 }));
document.getElementById('down').addEventListener('click', () => changeDirection({ keyCode: 40 }));
document.getElementById('right').addEventListener('click', () => changeDirection({ keyCode: 39 }));
document.getElementById('pause').addEventListener('click', pauseGame);
document.getElementById('restart').addEventListener('click', restartGame);

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? '#fff' : 'rgb(159, 55, 55)';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood() {
    ctx.fillStyle = 'rgb(159, 55, 55)';
    ctx.fillRect(food.x, food.y, box, box);
}

function updateGame() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').textContent = score;
        eatSound.play();
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box,
        };
        if (speed > 100) speed -= 10;
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= 20 * box || snakeY >= 20 * box || collision(newHead, snake)) {
        clearInterval(game);
        gameOverSound.play();
        swal({
            title: "Game Over!",
            text: "Your score was: " + score,
            icon: "error",
            buttons: {
                restart: { text: "Restart", value: "restart" },
                cancel: { text: "Cancel", value: "cancel", visible: true },
            },
        }).then((value) => {
            if (value === "restart") restartGame();
        });
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    updateGame();
}

function startGame() {
    game = setInterval(draw, speed);
}

function pauseGame() {
    if (isPaused) {
        startGame();
        isPaused = false;
    } else {
        clearInterval(game);
        isPaused = true;
    }
}

function restartGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = 'RIGHT';
    score = 0;
    document.getElementById('score').textContent = score;  // Reset score display
    speed = 400;
    food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    clearInterval(game);
    startGame();
}

startGame();
