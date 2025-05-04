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
let lastEnterPress = 0;

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
    
    gameLoop(); // Ensure the game loop starts!
}

function generateTargets(num) {
    targets = [];
    for (let i = 0; i < num; i++) {
        targets.push({ x: Math.random() * (canvas.width - 30), y: Math.random() * (canvas.height / 2), width: 30, height: 30 });
    }
}

function drawPlayers() {
    players.forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    });
}

function drawBullets() {
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

function spawnNuclearBomb() {
    if (targets.length > 10) {
        createExplosionEffect();
        setTimeout(() => {
            for (let i = 0; i < 10; i++) {
                if (targets.length > 0) {
                    let index = Math.floor(Math.random() * targets.length);
                    targets.splice(index, 1);
                }
            }
            loseHeart();
        }, 500);
    }
    setTimeout(spawnNuclearBomb, 10000);
}

function createExplosionEffect() {
    let explosionX = canvas.width / 2;
    let explosionY = canvas.height / 3;
    let particles = [];

    for (let i = 0; i < 20; i++) {
        particles.push({
            x: explosionX,
            y: explosionY,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            size: Math.random() * 5 + 3,
            life: Math.random() * 30 + 20
        });
    }

    function drawExplosion() {
        ctx.fillStyle = "rgba(255, 165, 0, 0.8)";
        ctx.beginPath();
        ctx.arc(explosionX, explosionY, 60, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach(p => {
            ctx.fillStyle = "rgba(255, 50, 0, 0.8)";
            ctx.fillRect(p.x, p.y, p.size, p.size);
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
        });

        particles = particles.filter(p => p.life > 0);
        if (particles.length > 0) requestAnimationFrame(drawExplosion);
    }

    drawExplosion();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers();
    drawBullets();
    drawTargets();
    update();
    requestAnimationFrame(gameLoop);
}startGame("single");

