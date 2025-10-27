// Game Configuration
const CONFIG = {
    roadWidth: 400,
    laneCount: 3,
    carWidth: 40,
    carHeight: 70,
    obstacleWidth: 40,
    obstacleHeight: 60,
    minSpeed: 0,
    maxSpeed: 15,
    acceleration: 0.3,
    deceleration: 0.2,
    friction: 0.05,
    baseSpeed: 3,
};

// Game State
let canvas, ctx;
let gameState = 'start'; // start, playing, gameOver
let score = 0;
let distance = 0;
let speed = 5;

// Game Objects
let car;
let obstacles = [];
let roadOffset = 0;
let keys = {};
let lastObstacleTime = 0;
let obstacleInterval = 1500;

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize car
    car = {
        x: canvas.width / 2 - CONFIG.carWidth / 2,
        y: canvas.height - CONFIG.carHeight - 50,
        width: CONFIG.carWidth,
        height: CONFIG.carHeight,
        speed: 0,
        lane: 1 // 0: left, 1: center, 2: right
    };
    
    // Event Listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
    
    // Start game loop
    gameLoop();
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(600, container.clientWidth - 40);
    canvas.width = maxWidth;
    canvas.height = Math.min(600, window.innerHeight - 300);
    
    CONFIG.roadWidth = canvas.width * 0.8;
    CONFIG.laneCount = 3;
    
    if (car) {
        // Reposition car when canvas resizes
        car.x = canvas.width / 2 - CONFIG.carWidth / 2;
        car.y = canvas.height - CONFIG.carHeight - 50;
    }
}

function handleKeyDown(e) {
    keys[e.key] = true;
    
    if (e.key === ' ') {
        e.preventDefault();
        if (gameState === 'start') {
            startGame();
        } else if (gameState === 'gameOver') {
            restartGame();
        }
    }
}

function handleKeyUp(e) {
    keys[e.key] = false;
}

function startGame() {
    gameState = 'playing';
    score = 0;
    distance = 0;
    speed = 5;
    obstacles = [];
    lastObstacleTime = Date.now();
    
    car.x = canvas.width / 2 - CONFIG.carWidth / 2;
    car.speed = 0;
    car.lane = 1;
    
    document.getElementById('startScreen').classList.remove('active');
    updateUI();
}

function restartGame() {
    document.getElementById('gameOverScreen').classList.remove('active');
    startGame();
}

function gameLoop() {
    if (gameState === 'playing') {
        update();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Handle car movement
    updateCarMovement();
    
    // Update road animation
    roadOffset += speed;
    if (roadOffset > 40) {
        roadOffset = 0;
    }
    
    // Update distance
    distance += speed * 0.1;
    
    // Spawn obstacles
    spawnObstacles();
    
    // Update obstacles
    updateObstacles();
    
    // Check collisions
    checkCollisions();
    
    // Update UI
    updateUI();
}

function updateCarMovement() {
    const laneWidth = CONFIG.roadWidth / CONFIG.laneCount;
    const roadLeft = (canvas.width - CONFIG.roadWidth) / 2;
    
    // Handle acceleration/deceleration
    if (keys['ArrowUp']) {
        car.speed = Math.min(car.speed + CONFIG.acceleration, CONFIG.maxSpeed);
    } else if (keys['ArrowDown']) {
        car.speed = Math.max(car.speed - CONFIG.deceleration, CONFIG.minSpeed);
    } else {
        // Apply friction
        if (car.speed > 5) {
            car.speed -= CONFIG.friction;
        } else if (car.speed < 5) {
            car.speed += CONFIG.friction * 0.5;
        }
    }
    
    // Handle lane switching
    if (keys['ArrowLeft'] && !keys['lastLeft']) {
        if (car.lane > 0) {
            car.lane--;
            keys['lastLeft'] = true;
        }
    } else if (!keys['ArrowLeft']) {
        keys['lastLeft'] = false;
    }
    
    if (keys['ArrowRight'] && !keys['lastRight']) {
        if (car.lane < CONFIG.laneCount - 1) {
            car.lane++;
            keys['lastRight'] = true;
        }
    } else if (!keys['ArrowRight']) {
        keys['lastRight'] = false;
    }
    
    // Calculate target position
    const targetX = roadLeft + (car.lane * laneWidth) + (laneWidth - CONFIG.carWidth) / 2;
    
    // Smooth movement to target lane
    car.x += (targetX - car.x) * 0.2;
    
    // Update speed display
    speed = car.speed;
}

function spawnObstacles() {
    const currentTime = Date.now();
    const interval = Math.max(800, obstacleInterval - (distance * 2));
    
    if (currentTime - lastObstacleTime > interval) {
        const laneWidth = CONFIG.roadWidth / CONFIG.laneCount;
        const roadLeft = (canvas.width - CONFIG.roadWidth) / 2;
        const lane = Math.floor(Math.random() * CONFIG.laneCount);
        
        // Random obstacle type
        const types = ['car', 'cone', 'barrier'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        obstacles.push({
            x: roadLeft + (lane * laneWidth) + (laneWidth - CONFIG.obstacleWidth) / 2,
            y: -CONFIG.obstacleHeight,
            width: CONFIG.obstacleWidth,
            height: CONFIG.obstacleHeight,
            type: type,
            passed: false
        });
        
        lastObstacleTime = currentTime;
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.y += speed + CONFIG.baseSpeed;
        
        // Check if obstacle is passed
        if (!obstacle.passed && obstacle.y > car.y + car.height) {
            obstacle.passed = true;
            score += 10;
        }
        
        // Remove obstacles that are off screen
        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
        }
    }
}

function checkCollisions() {
    for (const obstacle of obstacles) {
        if (isColliding(car, obstacle)) {
            gameOver();
            break;
        }
    }
}

function isColliding(rect1, rect2) {
    const margin = 5; // Small margin for better gameplay
    return rect1.x + margin < rect2.x + rect2.width - margin &&
           rect1.x + rect1.width - margin > rect2.x + margin &&
           rect1.y + margin < rect2.y + rect2.height - margin &&
           rect1.y + rect1.height - margin > rect2.y + margin;
}

function gameOver() {
    gameState = 'gameOver';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalDistance').textContent = Math.floor(distance) + 'm';
    document.getElementById('gameOverScreen').classList.add('active');
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('speed').textContent = Math.floor(speed * 10);
    document.getElementById('distance').textContent = Math.floor(distance) + 'm';
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw road
    drawRoad();
    
    // Draw obstacles
    drawObstacles();
    
    // Draw car
    drawCar();
}

function drawRoad() {
    const roadLeft = (canvas.width - CONFIG.roadWidth) / 2;
    
    // Draw grass/sides
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, 0, roadLeft, canvas.height);
    ctx.fillRect(roadLeft + CONFIG.roadWidth, 0, canvas.width - (roadLeft + CONFIG.roadWidth), canvas.height);
    
    // Draw road
    ctx.fillStyle = '#34495e';
    ctx.fillRect(roadLeft, 0, CONFIG.roadWidth, canvas.height);
    
    // Draw road edge lines
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(roadLeft - 2, 0, 4, canvas.height);
    ctx.fillRect(roadLeft + CONFIG.roadWidth - 2, 0, 4, canvas.height);
    
    // Draw lane lines
    const laneWidth = CONFIG.roadWidth / CONFIG.laneCount;
    ctx.fillStyle = '#f39c12';
    ctx.strokeStyle = '#f39c12';
    ctx.setLineDash([20, 20]);
    ctx.lineDashOffset = -roadOffset;
    ctx.lineWidth = 3;
    
    for (let i = 1; i < CONFIG.laneCount; i++) {
        const x = roadLeft + (i * laneWidth);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    ctx.setLineDash([]);
}

function drawCar() {
    const gradient = ctx.createLinearGradient(car.x, car.y, car.x, car.y + car.height);
    gradient.addColorStop(0, '#e74c3c');
    gradient.addColorStop(1, '#c0392b');
    
    // Car body
    ctx.fillStyle = gradient;
    ctx.fillRect(car.x, car.y, car.width, car.height);
    
    // Car windows
    ctx.fillStyle = '#3498db';
    ctx.fillRect(car.x + 5, car.y + 10, car.width - 10, car.height * 0.3);
    
    // Car wheels
    ctx.fillStyle = '#000';
    ctx.fillRect(car.x - 3, car.y + 10, 6, 15);
    ctx.fillRect(car.x + car.width - 3, car.y + 10, 6, 15);
    ctx.fillRect(car.x - 3, car.y + car.height - 25, 6, 15);
    ctx.fillRect(car.x + car.width - 3, car.y + car.height - 25, 6, 15);
    
    // Car lights
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(car.x + 5, car.y + car.height - 5, 10, 4);
    ctx.fillRect(car.x + car.width - 15, car.y + car.height - 5, 10, 4);
}

function drawObstacles() {
    for (const obstacle of obstacles) {
        if (obstacle.type === 'car') {
            drawObstacleCar(obstacle);
        } else if (obstacle.type === 'cone') {
            drawCone(obstacle);
        } else if (obstacle.type === 'barrier') {
            drawBarrier(obstacle);
        }
    }
}

function drawObstacleCar(obstacle) {
    const gradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height);
    gradient.addColorStop(0, '#3498db');
    gradient.addColorStop(1, '#2980b9');
    
    // Car body
    ctx.fillStyle = gradient;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    
    // Car windows
    ctx.fillStyle = '#34495e';
    ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.height * 0.6, obstacle.width - 10, obstacle.height * 0.3);
    
    // Car wheels
    ctx.fillStyle = '#000';
    ctx.fillRect(obstacle.x - 3, obstacle.y + 10, 6, 12);
    ctx.fillRect(obstacle.x + obstacle.width - 3, obstacle.y + 10, 6, 12);
    ctx.fillRect(obstacle.x - 3, obstacle.y + obstacle.height - 22, 6, 12);
    ctx.fillRect(obstacle.x + obstacle.width - 3, obstacle.y + obstacle.height - 22, 6, 12);
}

function drawCone(obstacle) {
    // Orange traffic cone
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
    ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
    ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
    ctx.closePath();
    ctx.fill();
    
    // White stripes
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.height * 0.3, obstacle.width - 10, 5);
    ctx.fillRect(obstacle.x + 3, obstacle.y + obstacle.height * 0.6, obstacle.width - 6, 5);
}

function drawBarrier(obstacle) {
    // Construction barrier
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height * 0.7);
    
    // Stripes
    ctx.fillStyle = '#ecf0f1';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(obstacle.x + i * 15, obstacle.y + i * 10, 10, 8);
        ctx.fillRect(obstacle.x + obstacle.width - 10 - i * 15, obstacle.y + i * 10, 10, 8);
    }
    
    // Base
    ctx.fillStyle = '#34495e';
    ctx.fillRect(obstacle.x - 5, obstacle.y + obstacle.height * 0.7, obstacle.width + 10, obstacle.height * 0.3);
}

// Initialize game when page loads
window.addEventListener('load', init);

