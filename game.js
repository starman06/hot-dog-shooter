const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let gameMode = "single";
let gameWon = false;
let score = 0;
let health = 5;
let players = [];
let bullets = [];
let targets = [];

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
    targets = [];
    
    players = [{ x: canvas.width / 2 - 40, y: canvas.height - 50, width: 30, height: 30, color: "blue", keys: { left: "ArrowLeft", right: "ArrowRight", shoot: "Enter" } }];
    
    if (mode === "multi") {
        players.push({ x: canvas.width / 2 + 40, y: canvas.height - 50, width: 30, height: 30, color: "green", keys: { left: "a", right: "d", shoot: " " } });
    }

    generateTargets(12);
    setTimeout(spawnNuclearBomb, 10000);
    
    gameLoop();
}

function generateTargets(num) {
    targets = [];
    for (let i = 0; i < num; i++) {
        targets.push({ x: Math.random() * (canvas.width - 30), y: Math.random() * (canvas.height / 2), width: 30, height: 30 });
    }
}

function drawPlayers() {
    players.forEach(player => {
        ctx.fillStyle = player.color || "blue";
        ctx.fillRect(player.x, player.y, player.width, player.height);
    });
}

function drawBullets() {
    ctx.fillStyle = "brown";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
}

function drawTargets() {
    ctx.fillStyle = "red";
    targets.forEach(target => {
        ctx.fillRect(target.x, target.y, target.width, target.height);
    });
}

function update() {
    bullets.forEach(b => b.y -= 5);
    bullets = bullets.filter(b => b.y > 0);

    bullets.forEach(b => {
        let remainingTargets = [];
        targets.forEach(target => {
            if (!(b.x < target.x + target.width && b.x + b.width > target.x && b.y < target.y + target.height && b.y + b.height > target.y)) {
                remainingTargets.push(target);
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
    drawPlayers();
    drawBullets();
    drawTargets();
    update();
    requestAnimationFrame(gameLoop);
}


