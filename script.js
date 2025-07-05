
// Water Drop Game Logic
const gameContainer = document.getElementById('game-container');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const feedback = document.getElementById('feedback');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

let score = 0;
let timeLeft = 30;
let gameInterval;
let timerInterval;

function getRandomX() {
    return Math.floor(Math.random() * (gameContainer.clientWidth - 70));
}

function spawnDrop() {
    const drop = document.createElement('div');
    drop.classList.add('water-drop');
    drop.style.left = `${getRandomX()}px`;
    drop.style.top = '0px';
    gameContainer.appendChild(drop);

    drop.addEventListener('click', (e) => {
        e.stopPropagation();
        score++;
        scoreEl.textContent = score;
        drop.remove();
        feedback.textContent = "+1!";
    });

    animateDrop(drop);
}

function spawnObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('water-drop', 'bad-drop');
    obstacle.style.left = `${getRandomX()}px`;
    obstacle.style.top = '0px';
    gameContainer.appendChild(obstacle);

    obstacle.addEventListener('click', (e) => {
        e.stopPropagation();
        score--;
        scoreEl.textContent = score;
        obstacle.remove();
        feedback.textContent = "-1!";
    });

    animateDrop(obstacle);
}

function animateDrop(element) {
    let pos = 0;
    const dropHeight = element.offsetHeight || 70;
    const containerHeight = gameContainer.clientHeight;
    const fallSpeed = 5;
    element.style.top = '0px'; // Ensure it starts at the very top
    const interval = setInterval(() => {
        if (pos >= containerHeight - dropHeight) {
            element.remove();
            clearInterval(interval);
        } else {
            pos += fallSpeed;
            element.style.top = `${pos}px`;
        }
    }, 30);
}

function startGame() {
    resetGame();
    gameInterval = setInterval(() => {
        spawnDrop();
        if (Math.random() < 0.3) spawnObstacle();
    }, 600);

    timerInterval = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            clearInterval(timerInterval);
            feedback.textContent = score >= 10 ? 'You Win! 🎉' : 'Game Over!';

            if (score >= 10 && window.confetti) {
                confetti({
                    particleCount: 200,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    }, 1000);
}

function resetGame() {
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    feedback.textContent = '';
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameContainer.innerHTML = '';
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
