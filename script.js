// Einstellungen
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

const grid = 20;
let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};
let apple = {
    x: 320,
    y: 320
};
let score = 0;

// Zufällige Position für den Apfel generieren
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Spiel-Schleife
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Schlange bewegen
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Schlange kann durch den Bildschirm gehen
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // Schlange-Array aktualisieren
    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Apfel zeichnen
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

    // Schlange zeichnen
    ctx.fillStyle = 'green';
    snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, grid-1, grid-1);  

        // Kollision mit sich selbst
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                gameOver();
            }
        }

        // Apfel fressen
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score += 10;
            scoreElement.textContent = score;
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;

            // Geschwindigkeit erhöhen bei jedem Fressen
            increaseSpeed();
        }
    });
}

// Spiel beenden
function gameOver() {
    gameOverElement.style.display = 'block';
    clearInterval(gameLoop); // Stoppt das Spiel
    // Optional: Spiel zurücksetzen oder Seite neu laden
}

// Tastensteuerung
document.addEventListener('keydown', function(e) {
    // Verhindern, dass der Bildschirm nach unten scrollt
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    if (e.keyCode === 37 && snake.dx === 0) { // Links
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.keyCode === 38 && snake.dy === 0) { // Oben
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.keyCode === 39 && snake.dx === 0) { // Rechts
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.keyCode === 40 && snake.dy === 0) { // Unten
        snake.dy = grid;
        snake.dx = 0;
    }

    // Spiel neu starten
    if (e.keyCode === 13 && gameOverElement.style.display === 'block') { // Enter
        resetGame();
    }
});

// Spiel zurücksetzen
function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.dx = grid;
    snake.dy = 0;
    snake.cells = [];
    snake.maxCells = 4;

    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;

    score = 0;
    scoreElement.textContent = score;

    gameOverElement.style.display = 'none';
    
    // Setze die Spielgeschwindigkeit zurück, falls nötig
    gameSpeed = 100; // Standardgeschwindigkeit
    gameLoop = setInterval(loop, gameSpeed);
}

// Geschwindigkeit anpassen
let gameSpeed = 100; // in Millisekunden (z.B. 100 ms = 10 Bewegungen pro Sekunde)
let gameLoop = setInterval(loop, gameSpeed);

// Funktion zur Geschwindigkeitserhöhung
function increaseSpeed() {
    if (gameSpeed > 50) { // Mindestgeschwindigkeit: 50 ms
        gameSpeed -= 5; // Erhöhe die Geschwindigkeit
        clearInterval(gameLoop);
        gameLoop = setInterval(loop, gameSpeed);
        console.log(`Geschwindigkeit erhöht: ${gameSpeed} ms`);
    }
}

// Spiel starten