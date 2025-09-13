const gameArea = document.getElementById('game-area');
const propeller = document.getElementById('propeller');
const dollar = document.getElementById('dollar');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const leaderboardEl = document.getElementById('leaderboard');

let score = 0;
let angle = 0;
let speed = 1.5;
let timeLeft = 20;
const numBlades = 4;
const blades = [];
const serverUrl = "https://твoй_домен";

for (let i = 0; i < numBlades; i++) {
    const blade = document.createElement('div');
    blade.classList.add('blade');
    blade.style.transform = `rotate(${i * (360/numBlades)}deg) translateY(-50%)`;
    propeller.appendChild(blade);
    blades.push(blade);
    blade.addEventListener('click', () => { endGame(); });
}

function rotate() {
    angle += speed;
    propeller.style.transform = `rotate(${angle}deg)`;
    requestAnimationFrame(rotate);
}

function moveDollar() {
    const radius = 120;
    const center = 150;
    const r = Math.random() * radius * 0.8;
    const theta = Math.random() * 2 * Math.PI;
    const x = center + r * Math.cos(theta) - 14;
    const y = center + r * Math.sin(theta) - 14;
    dollar.style.left = `${x}px`;
    dollar.style.top = `${y}px`;
}

dollar.addEventListener('click', (e) => {
    score++;
    scoreDisplay.textContent = score;
    speed += 0.3;
    dollar.classList.add('flash');
    setTimeout(() => dollar.classList.remove('flash'), 200);
    createParticles(e.clientX - gameArea.getBoundingClientRect().left,
                    e.clientY - gameArea.getBoundingClientRect().top, gameArea);
    moveDollar();
    e.stopPropagation();
});

const timerInterval = setInterval(() => {
    timeLeft -= 1;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
}, 1000);

async function updateLeaderboard(name, score) {
    try {
        const res = await fetch(`${serverUrl}/submit_score`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, score})
        });
        const data = await res.json();
        leaderboardEl.innerHTML = data.top10.map(e => `<li>${e.name}: ${e.score}</li>`).join('');
    } catch(err) {
        console.error("Ошибка обновления leaderboard:", err);
    }
}

function endGame() {
    clearInterval(timerInterval);
    speed = 0;
    alert(`💥 Game Over! Ты набрал ${score} очков.`);
    const name = window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || "Игрок";
    updateLeaderboard(name, score);
}

rotate();
moveDollar();