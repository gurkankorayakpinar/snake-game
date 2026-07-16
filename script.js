const gameArea = document.querySelector('.game-area');
const gridSize = { width: 49, height: 29 }; // Oyun alanı (BFS algoritmasının duvarlardan geçerken doğru çalışması için tek sayılar tercih edildi.)
const initialSnakeLength = 1; // Yılanın başlangıç uzunluğu
let snake = [{ x: 5, y: 5 }]; // Yılanın başlangıç pozisyonu
let direction = { x: 1, y: 0 }; // Yılanın başlangıç yönü
let bait = { x: 10, y: 10 };
let speed = 75; // Yılanın başlangıç hızı = 75 milisaniye (1000 olursa, saniyede 1 kare hareket eder.)
let gameInterval;
const maxLength = 300; // Oyunun sona ereceği uzunluk
let autopilot = false;
let pathToBait = [];
let timeLeft = 10; // Bir sonraki elmayı almak için kalan süre
let timerInterval;

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

    // Yılanın tüm parçalarını çiz.
    snake.forEach((segment, index) => {
        const cellIndex = segment.y * gridSize.width + segment.x;
        if (index === 0) {
            cells[cellIndex].classList.add('head'); // Yılanın başı = yeşil
        } else {
            cells[cellIndex].classList.add('snake'); // Yılanın gövdesi = mavi
        }
    });

    // Yem (Maksimum uzunluğa ulaşılmadığı müddetçe çizilir.)
    if (snake.length < maxLength) {
        const baitIndex = bait.y * gridSize.width + bait.x;
        cells[baitIndex].classList.add('bait');
    }

    // Yılanın uzunluğunu göster.
    updateLengthDisplay();

    // Yılanın uzunluğu "maxLength" olduğunda oyunu bitir.
    if (snake.length >= maxLength) {
        updateSpeedLogic();
        endGame(true);
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
    lengthDisplay.textContent = `Uzunluk: ${snake.length}`;
}

// Uzunluğa göre hız güncellemesi
function updateSpeedLogic() {
    let newSpeed = 75;
    let activeBars = 1;

    if (snake.length >= 250) {
        newSpeed = 50;
        activeBars = 6;
    } else if (snake.length >= 200) {
        newSpeed = 55;
        activeBars = 5;
    } else if (snake.length >= 150) {
        newSpeed = 60;
        activeBars = 4;
    } else if (snake.length >= 100) {
        newSpeed = 65;
        activeBars = 3;
    } else if (snake.length >= 50) {
        newSpeed = 70;
        activeBars = 2;
    }

    if (newSpeed !== speed) {
        speed = newSpeed;
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            moveSnake();
            draw();
        }, speed);
    }

    // Çizgileri güncelle.
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (index < activeBars) {
            bar.classList.remove('faded');
        } else {
            bar.classList.add('faded');
        }
    });
}

// Zamanlayıcıyı güncelle ve ekrana yazdır.
function updateTimerDisplay() {
    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) {
        timerDisplay.textContent = `Kalan süre: ${timeLeft}`;
    }
}

// Geri sayımı başlatan fonksiyon
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            endGame(false); // Süre bittiği için kayıp.
        }
    }, 1000);
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
            { x: (position.x + 1) % gridSize.width, y: position.y },
            { x: (position.x - 1 + gridSize.width) % gridSize.width, y: position.y },
            { x: position.x, y: (position.y + 1) % gridSize.height },
            { x: position.x, y: (position.y - 1 + gridSize.height) % gridSize.height },
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

// Yılanı hareket ettir.
function moveSnake() {
    if (autopilot && pathToBait.length > 0) {
        const nextPosition = pathToBait[0];

        // Duvar geçişli en kısa mesafe için yön belirleme yapısı
        let dx = nextPosition.x - snake[0].x;
        let dy = nextPosition.y - snake[0].y;

        // Eğer fark 1'den büyükse, duvarın diğer tarafına geçilir.
        if (Math.abs(dx) > 1) dx = dx > 0 ? -1 : 1;
        if (Math.abs(dy) > 1) dy = dy > 0 ? -1 : 1;

        direction = { x: dx, y: dy };
        pathToBait.shift();
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Duvarlardan geçilebilir.
    if (head.x >= gridSize.width) head.x = 0;
    if (head.x < 0) head.x = gridSize.width - 1;
    if (head.y >= gridSize.height) head.y = 0;
    if (head.y < 0) head.y = gridSize.height - 1;

    snake.unshift(head);

    // Yem alındı mı? Kontrol et.
    if (head.x === bait.x && head.y === bait.y) {
        // Eğer hedef uzunluğa ulaşılmadıysa, yeni yem yerleştir.
        if (snake.length < maxLength) {
            placeBait();
            startTimer(); // Yem alınınca sayacı sıfırla ve yeniden başlat.
        }
        updateSpeedLogic(); // Yem alınınca hızı kontrol et.
        if (autopilot && snake.length < maxLength) {
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
    if (key === 'ArrowUp') direction = { x: 0, y: -1 };
    if (key === 'ArrowDown') direction = { x: 0, y: 1 };
    if (key === 'ArrowLeft') direction = { x: -1, y: 0 };
    if (key === 'ArrowRight') direction = { x: 1, y: 0 };

    // Auto pilot sistemini aç & kapat.
    if (key === 'a' || key === 'A') {
        autopilot = !autopilot;
        if (autopilot) {
            pathToBait = bfs(snake[0], bait);
        }
        updateAutopilotDisplay(); // Auto pilot durumunu güncelle.
    }
}

// "Sağ tık ile menü açma" özelliği devre dışı
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Oyunu bitir.
function endGame(isWin) {
    clearInterval(gameInterval); // Oyun döngüsünü durdur.
    clearInterval(timerInterval); // Zamanlayıcıyı durdur.
    const gameOverMessage = document.createElement('div');
    gameOverMessage.textContent = isWin ? 'KAZANDINIZ' : 'KAYBETTİNİZ';
    gameOverMessage.classList.add('game-over-message');
    document.body.appendChild(gameOverMessage);
}

function startGame() {
    createGrid();
    placeBait();
    startTimer(); // Oyun başlangıcında zamanlayıcıyı başlat.
    updateSpeedLogic(); // Başlangıç hız çizgilerini çiz.
    gameInterval = setInterval(() => {
        moveSnake();
        draw();
    }, speed);
}

// Oyunu başlat.
document.addEventListener('keydown', handleInput);
startGame();