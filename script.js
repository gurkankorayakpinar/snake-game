const gameArea = document.querySelector('.game-area');
const gridSize = { width: 50, height: 30 }; // Oyun alanı
const initialSnakeLength = 1; // Yılanın başlangıç uzunluğu
let snake = [{ x: 5, y: 5 }]; // Yılanın başlangıç pozisyonu
let direction = { x: 1, y: 0 }; // Yılanın başlangıç yönü
let bait = { x: 10, y: 10 }; // Yem'in başlangıç pozisyonu (İlk yem için rastgele bir konum belirlenir.)
let speed = 75; // Yılanın hızı = 75 milisaniye
let gameInterval;
const maxLength = 300; // Oyunun sona ereceği uzunluk.
let autopilot = false;
let pathToBait = [];

// Oyun alanının oluşturulması
function createGrid() {
    gameArea.innerHTML = '';
    for (let y = 0; y < gridSize.height; y++) {
        for (let x = 0; x < gridSize.width; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gameArea.appendChild(cell);
        }
    }
}

// Yılan ve yem çizilmesi
function draw() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('snake', 'bait', 'head'));

    // Yılanın tüm parçalarını çiz
    snake.forEach((segment, index) => {
        const cellIndex = segment.y * gridSize.width + segment.x;
        if (index === 0) {
            cells[cellIndex].classList.add('head'); // Yılanın başı = yeşil
        } else {
            cells[cellIndex].classList.add('snake'); // Yılanın gövdesi = mavi
        }
    });

    // Yem
    const baitIndex = bait.y * gridSize.width + bait.x;
    cells[baitIndex].classList.add('bait');

    // Yılanın uzunluğunu göster.
    updateLengthDisplay();

    // Yılanın uzunluğu "maxLength" olduğunda oyunu bitir.
    if (snake.length >= maxLength) {
        endGame();
    }
}

// Yılanın uzunluğunu ekranda göster.
function updateLengthDisplay() {
    let lengthDisplay = document.querySelector('.length-display');
    if (!lengthDisplay) {
        lengthDisplay = document.createElement('div');
        lengthDisplay.classList.add('length-display');
        document.body.appendChild(lengthDisplay);
    }
    lengthDisplay.textContent = `Uzunluk: ${snake.length}`; // "Length" yerine "Uzunluk"
}

// Auto pilot sisteminin bir sonraki yem için en kısa yolu bulması amacıyla BFS (Breadth First Search) fonksiyonu
function bfs(start, target) {
    const queue = [{ position: start, path: [] }];
    const visited = new Set();
    visited.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
        const { position, path } = queue.shift();
        if (position.x === target.x && position.y === target.y) {
            return path;
        }

        const neighbors = [
            { x: position.x + 1, y: position.y },
            { x: position.x - 1, y: position.y },
            { x: position.x, y: position.y + 1 },
            { x: position.x, y: position.y - 1 },
        ];

        for (const neighbor of neighbors) {
            const neighborKey = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(neighborKey)) {
                visited.add(neighborKey);
                queue.push({ position: neighbor, path: [...path, neighbor] });
            }
        }
    }

    return [];
}

// Yılanı hareket ettir
function moveSnake() {
    if (autopilot && pathToBait.length > 0) {
        const nextPosition = pathToBait[0];
        direction = { x: nextPosition.x - snake[0].x, y: nextPosition.y - snake[0].y };
        pathToBait.shift();
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Duvarları aş
    if (head.x >= gridSize.width) head.x = 0;
    if (head.x < 0) head.x = gridSize.width - 1;
    if (head.y >= gridSize.height) head.y = 0;
    if (head.y < 0) head.y = gridSize.height - 1;

    snake.unshift(head);

    // Yem alındı mı? Kontrol et.
    if (head.x === bait.x && head.y === bait.y) {
        placeBait();
        if (autopilot) {
            pathToBait = bfs(snake[0], bait);
        }
    } else {
        snake.pop();
    }
}

// Yem, rastgele şekilde yerleştirilir.
function placeBait() {
    let newBait;
    do {
        newBait = {
            x: Math.floor(Math.random() * gridSize.width),
            y: Math.floor(Math.random() * gridSize.height),
        };
    } while (snake.some(segment => segment.x === newBait.x && segment.y === newBait.y));
    bait = newBait;

    if (autopilot) {
        pathToBait = bfs(snake[0], bait);
    }
}

// Auto pilot durumunu güncelle.
function updateAutopilotDisplay() {
    const autopilotStatus = document.getElementById('autopilotStatus');
    if (autopilot) {
        autopilotStatus.textContent = 'Açık';
        autopilotStatus.classList.add('active');
    } else {
        autopilotStatus.textContent = 'Kapalı';
        autopilotStatus.classList.remove('active');
    }
}

// Keyboard input
function handleInput(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    if (key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };

    // Auto pilot'u aç-kapat
    if (key === 'a' || key === 'A') {
        autopilot = !autopilot;
        if (autopilot) {
            pathToBait = bfs(snake[0], bait);
        }
        updateAutopilotDisplay(); // Autopilot durumunu güncelle
    }
}

// "Sağ tık ile menü açma" özelliği devre dışı
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Oyunu bitir.
function endGame() {
    clearInterval(gameInterval); // Oyun döngüsünü durdur.
    const gameOverMessage = document.createElement('div');
    gameOverMessage.textContent = 'Kazandınız!';
    gameOverMessage.classList.add('game-over-message');
    document.body.appendChild(gameOverMessage);
}

// Oyunu başlatma fonksiyonu.
function startGame() {
    createGrid();
    placeBait();
    gameInterval = setInterval(() => {
        moveSnake();
        draw();
    }, speed);
}

// Oyunu başlat.
document.addEventListener('keydown', handleInput);
startGame();