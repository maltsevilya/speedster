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
    baseSpeedIncreaseRate: 0.001, // Speed increase per distance unit
    maxBaseSpeed: 8, // Maximum base speed
    minObstacleInterval: 600, // Minimum time between obstacles (ms)
    maxObstacleInterval: 1500, // Maximum time between obstacles (ms)
    difficultyIncreaseRate: 0.02, // Difficulty increase per distance unit
};

// Game State
let canvas, ctx;
let gameState = 'start'; // start, playing, gameOver
let score = 0;
let distance = 0;
let speed = 5;
let difficultyLevel = 1;
let currentBaseSpeed = CONFIG.baseSpeed;
let currentObstacleInterval = CONFIG.maxObstacleInterval;

// Game Objects
let car;
let obstacles = [];
let roadOffset = 0;
let keys = {};
let lastObstacleTime = 0;
let obstacleInterval = 1500;

// Touch controls
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

// Audio elements
let bgMusic;
let crashSound;
let scoreSound;
let accelerateSound;
let isMuted = false;

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
    
    // Mobile touch controls
    setupMobileControls();
    setupSwipeControls();
    
    // Initialize audio
    initAudio();
    
    // Start game loop
    gameLoop();
}

function initAudio() {
    // Get audio elements
    bgMusic = document.getElementById('bgMusic');
    crashSound = document.getElementById('crashSound');
    scoreSound = document.getElementById('scoreSound');
    accelerateSound = document.getElementById('accelerateSound');
    
    // Set volumes
    if (bgMusic) bgMusic.volume = 0.3;
    if (crashSound) crashSound.volume = 0.5;
    if (scoreSound) scoreSound.volume = 0.4;
    if (accelerateSound) accelerateSound.volume = 0.2;
    
    // Setup mute button
    const muteButton = document.getElementById('muteButton');
    if (muteButton) {
        muteButton.addEventListener('click', toggleMute);
    }
    
    // Load muted state from localStorage
    const savedMuteState = localStorage.getItem('gameIsMuted');
    if (savedMuteState === 'true') {
        isMuted = true;
        updateMuteButton();
    }
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('gameIsMuted', isMuted);
    updateMuteButton();
    
    if (isMuted) {
        stopAllSounds();
    } else if (gameState === 'playing') {
        playBackgroundMusic();
    }
}

function updateMuteButton() {
    const soundOnIcon = document.getElementById('soundOnIcon');
    const soundOffIcon = document.getElementById('soundOffIcon');
    
    if (soundOnIcon && soundOffIcon) {
        if (isMuted) {
            soundOnIcon.style.display = 'none';
            soundOffIcon.style.display = 'block';
        } else {
            soundOnIcon.style.display = 'block';
            soundOffIcon.style.display = 'none';
        }
    }
}

function playBackgroundMusic() {
    if (!isMuted && bgMusic) {
        bgMusic.play().catch(err => {
            // Auto-play might be blocked by browser
            console.log('Background music autoplay prevented');
        });
    }
}

function stopBackgroundMusic() {
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
}

function playSound(sound) {
    if (!isMuted && sound) {
        sound.currentTime = 0;
        sound.play().catch(err => {
            console.log('Sound play prevented');
        });
    }
}

function stopAllSounds() {
    if (bgMusic) {
        bgMusic.pause();
    }
    if (crashSound) {
        crashSound.pause();
    }
    if (scoreSound) {
        scoreSound.pause();
    }
    if (accelerateSound) {
        accelerateSound.pause();
    }
}

function setupMobileControls() {
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnUp = document.getElementById('btnUp');
    const btnDown = document.getElementById('btnDown');
    
    // Left button
    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys['ArrowLeft'] = true;
        btnLeft.classList.add('pressed');
    });
    btnLeft.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys['ArrowLeft'] = false;
        keys['lastLeft'] = false;
        btnLeft.classList.remove('pressed');
    });
    
    // Right button
    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys['ArrowRight'] = true;
        btnRight.classList.add('pressed');
    });
    btnRight.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys['ArrowRight'] = false;
        keys['lastRight'] = false;
        btnRight.classList.remove('pressed');
    });
    
    // Up button
    btnUp.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys['ArrowUp'] = true;
        btnUp.classList.add('pressed');
    });
    btnUp.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys['ArrowUp'] = false;
        btnUp.classList.remove('pressed');
    });
    
    // Down button
    btnDown.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys['ArrowDown'] = true;
        btnDown.classList.add('pressed');
    });
    btnDown.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys['ArrowDown'] = false;
        btnDown.classList.remove('pressed');
    });
    
    // Also add click events for mouse/desktop testing
    btnLeft.addEventListener('mousedown', () => keys['ArrowLeft'] = true);
    btnLeft.addEventListener('mouseup', () => { keys['ArrowLeft'] = false; keys['lastLeft'] = false; });
    
    btnRight.addEventListener('mousedown', () => keys['ArrowRight'] = true);
    btnRight.addEventListener('mouseup', () => { keys['ArrowRight'] = false; keys['lastRight'] = false; });
    
    btnUp.addEventListener('mousedown', () => keys['ArrowUp'] = true);
    btnUp.addEventListener('mouseup', () => keys['ArrowUp'] = false);
    
    btnDown.addEventListener('mousedown', () => keys['ArrowDown'] = true);
    btnDown.addEventListener('mouseup', () => keys['ArrowDown'] = false);
}

function setupSwipeControls() {
    // Add swipe detection on the canvas for alternative control
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (e.touches.length > 0) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const deltaTime = Date.now() - touchStartTime;
    
    // Minimum swipe distance
    const minSwipeDistance = 30;
    
    // Determine swipe direction
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Horizontal swipe (lane change)
    if (absX > absY && absX > minSwipeDistance && deltaTime < 300) {
        if (deltaX > 0) {
            // Swipe right
            if (car.lane < CONFIG.laneCount - 1) {
                car.lane++;
            }
        } else {
            // Swipe left
            if (car.lane > 0) {
                car.lane--;
            }
        }
    }
    // Vertical swipe (speed control)
    else if (absY > absX && absY > minSwipeDistance && deltaTime < 300) {
        if (deltaY < 0) {
            // Swipe up - brief acceleration
            car.speed = Math.min(car.speed + 2, CONFIG.maxSpeed);
        } else {
            // Swipe down - brief deceleration
            car.speed = Math.max(car.speed - 2, CONFIG.minSpeed);
        }
    }
    // Tap (if very short distance and time)
    else if (absX < 10 && absY < 10 && deltaTime < 200) {
        if (gameState === 'start') {
            startGame();
        } else if (gameState === 'gameOver') {
            restartGame();
        }
    }
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
    
    // Reset difficulty
    difficultyLevel = 1;
    currentBaseSpeed = CONFIG.baseSpeed;
    currentObstacleInterval = CONFIG.maxObstacleInterval;
    
    car.x = canvas.width / 2 - CONFIG.carWidth / 2;
    car.speed = 0;
    car.lane = 1;
    
    document.getElementById('startScreen').classList.remove('active');
    updateUI();
    
    // Start background music
    playBackgroundMusic();
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
    
    // Update difficulty based on progress
    updateDifficulty();
    
    // Update road animation
    roadOffset += speed;
    if (roadOffset > 40) {
        roadOffset = 0;
    }
    
    // Update distance based on fixed game speed (not player's car speed)
    // This ensures consistent difficulty progression across all devices
    distance += currentBaseSpeed * 0.15;
    
    // Spawn obstacles
    spawnObstacles();
    
    // Update obstacles
    updateObstacles();
    
    // Check collisions
    checkCollisions();
    
    // Update UI
    updateUI();
}

function updateDifficulty() {
    // Calculate difficulty level based on distance (every 100m increases difficulty)
    difficultyLevel = 1 + Math.floor(distance / 100);
    
    // Increase base speed gradually (obstacles move faster)
    currentBaseSpeed = Math.min(
        CONFIG.baseSpeed + (distance * CONFIG.baseSpeedIncreaseRate),
        CONFIG.maxBaseSpeed
    );
    
    // Decrease obstacle spawn interval (obstacles appear more frequently)
    const difficultyFactor = 1 + (distance * CONFIG.difficultyIncreaseRate);
    currentObstacleInterval = Math.max(
        CONFIG.maxObstacleInterval / difficultyFactor,
        CONFIG.minObstacleInterval
    );
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
        // Apply friction with deadzone to prevent flickering
        const targetSpeed = 5;
        const deadzone = 0.1;
        
        if (Math.abs(car.speed - targetSpeed) < deadzone) {
            car.speed = targetSpeed; // Snap to target speed
        } else if (car.speed > targetSpeed) {
            car.speed -= CONFIG.friction;
        } else if (car.speed < targetSpeed) {
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
    
    if (currentTime - lastObstacleTime > currentObstacleInterval) {
        const laneWidth = CONFIG.roadWidth / CONFIG.laneCount;
        const roadLeft = (canvas.width - CONFIG.roadWidth) / 2;
        
        // Random obstacle type
        const types = ['car', 'cone', 'barrier'];
        
        // Determine number of obstacles to spawn based on difficulty
        let numObstacles = 1;
        if (difficultyLevel >= 3 && Math.random() < 0.3) {
            numObstacles = 2; // 30% chance of 2 obstacles at level 3+
        }
        if (difficultyLevel >= 5 && Math.random() < 0.15) {
            numObstacles = 2; // Higher chance at level 5+
        }
        
        // Track which lanes are occupied to avoid duplicates
        const occupiedLanes = new Set();
        
        for (let i = 0; i < numObstacles; i++) {
            // Find an available lane
            let lane;
            let attempts = 0;
            do {
                lane = Math.floor(Math.random() * CONFIG.laneCount);
                attempts++;
            } while (occupiedLanes.has(lane) && attempts < 10);
            
            // Only spawn if we found a unique lane
            if (!occupiedLanes.has(lane)) {
                occupiedLanes.add(lane);
                
                const type = types[Math.floor(Math.random() * types.length)];
                
                obstacles.push({
                    x: roadLeft + (lane * laneWidth) + (laneWidth - CONFIG.obstacleWidth) / 2,
                    y: -CONFIG.obstacleHeight,
                    width: CONFIG.obstacleWidth,
                    height: CONFIG.obstacleHeight,
                    type: type,
                    passed: false
                });
            }
        }
        
        lastObstacleTime = currentTime;
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.y += speed + currentBaseSpeed;
        
        // Check if obstacle is passed
        if (!obstacle.passed && obstacle.y > car.y + car.height) {
            obstacle.passed = true;
            score += 10;
            // Play score sound
            playSound(scoreSound);
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
    
    // Stop background music and play crash sound
    stopBackgroundMusic();
    playSound(crashSound);
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = difficultyLevel;
    document.getElementById('speed').textContent = Math.round(speed * 10);
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

