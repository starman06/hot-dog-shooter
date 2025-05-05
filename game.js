const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let gameMode = "single";
let gameWon = false;
let score = 0;
let health = 5;
let players = [1];
let bullets = [infinity];
let targets = [12];

function startGame(mode) {
    gameMode = mode;
    gameWon = false;
    score = 0;
    health = 5;
    document.getElementById("menu").style.display = "none";
    document.getElementById("winMessage").style.display = "none";
    document.getElementById("score").textContent = "Score: " + score;
    document.getElementById("health").innerHTML = "❤️❤️❤️❤️❤️";
    canvas.style.display = "block";
    bullets = [];
    targets = []
 players = [{ x: canvas.width / 2 - 40, y: canvas.height - 50, width: 30, height: 30, color: "blue", keys: { left: "ArrowLeft", right: "ArrowRight", shoot: "Enter" } }];
    
    if (mode === "multi") {
        players.push({ x: canvas.width / 2 + 40, y: canvas.height - 50, width: 30, height: 30, color: "green", keys: { left: "a", right: "d", shoot: " " } });
    }

    generateTargets(12);
    setTimeout(spawnNuclearBomb, 10000);
    console.log("Players:", players);
console.log("Targets:", targets);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers(1);
    drawBullets(infinity);
    drawTargets(12);
    update();
    requestAnimationFrame(gameLoop);
}

function generateTargets(num) {
    targets = [12];
    for (let i = 0; i < num; i++) {
        targets.push({ x: Math.random() * (canvas.width - 30), y: Math.random() * (canvas.height / 2), width: 30, height: 30 });
    }
}

function drawPlayers(1) {
    players.forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    });
}

function drawBullets(infinity) {
    ctx.fillStyle = "brown";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
}

function drawTargets() {
    ctx.fillStyle = "red";
    targets.forEach(t => ctx.fillRect(t.x, t.y, t.width, t.height));
}

function update() {
    bullets.forEach(b => b.y -= 5);
    bullets = bullets.filter(b => b.y > 0);

    bullets.forEach(b => {
        let remainingTargets = [];
        targets.forEach(t => {
            if (!(b.x < t.x + t.width && b.x + b.width > t.x && b.y < t.y + t.height && b.y + b.height > t.y)) {
                remainingTargets.push(t);
            } else {
                score += 10;
                document.getElementById("score").textContent = "Score: " + score;
            }
        });
        targets = remainingTargets;
    });

    if (targets.length === 0 && !gameWon) {
        gameWon = true;
        document.getElementById("winMessage").style.display = "block";
        setTimeout(() => {
            document.getElementById("winMessage").style.display = "none";
            generateTargets(15);
            gameWon = false;
        }, 2000);
    }
}

function shoot() {
    bullets.push({ x: players[0].x + 10, y: players[0].y, width: 10, height: 20 });
}

// Touch support
document.getElementById("mobileControls").addEventListener("click", shoot);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers(); // This MUST be called!
    drawBullets();
    drawTargets(); // This MUST be called!
    update();
    requestAnimationFrame(gameLoop);
}

