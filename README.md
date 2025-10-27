# Speedster - Car Racing Game 🏎️

A fun and engaging 2D car racing game built with HTML5 Canvas, CSS3, and vanilla JavaScript. Navigate your car through traffic, avoid obstacles, and score points!

## Features ✨

- **Smooth Gameplay**: Responsive controls with smooth car movement and lane switching
- **Adaptive Difficulty**: Automatically adjusts challenge level based on your device (easier on mobile, harder on desktop)
- **Progressive Difficulty**: Game becomes more challenging over time with faster obstacles and increased spawn rates
- **Dynamic Obstacles**: Three types of obstacles (cars, traffic cones, barriers) that spawn randomly
- **Multi-Obstacle Spawning**: Multiple obstacles appear simultaneously at higher difficulty levels
- **Score System**: Earn points for each obstacle you successfully pass
- **Speed Control**: Accelerate and brake to control your speed (0-150)
- **Distance Tracking**: Track how far you've traveled
- **Level System**: Difficulty level increases every 100 meters
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Mobile-Optimized**: Touch controls with on-screen buttons AND intuitive swipe gestures
- **Audio Support**: Background music and sound effects (mute button included)
- **Modern UI**: Beautiful gradient design with intuitive controls
- **Game States**: Start screen, gameplay, and game over screen

## How to Play 🎮

### Desktop Controls

- **↑ (Up Arrow)**: Accelerate
- **↓ (Down Arrow)**: Brake/Decelerate
- **← (Left Arrow)**: Move to left lane
- **→ (Right Arrow)**: Move to right lane
- **SPACE**: Start game / Restart after game over

### Mobile Controls

The game fully supports mobile devices with two control methods:

**Method 1: On-Screen Buttons**
- Four arrow buttons appear at the bottom of the screen
- Tap and hold to accelerate, brake, or change lanes

**Method 2: Swipe Gestures (on game canvas)**
- **Swipe Left/Right**: Change lanes
- **Swipe Up**: Accelerate
- **Swipe Down**: Brake
- **Tap**: Start game or restart after game over

### Objective

- Navigate your red car through traffic
- Avoid colliding with obstacles (blue cars, traffic cones, barriers)
- Score points by successfully passing obstacles (10 points each)
- Try to travel as far as possible!

### Difficulty Progression 🎯

The game gets progressively harder as you play:

- **Every 100 meters**: Difficulty level increases
- **Consistent Progression**: Distance increases at a fixed rate based on game speed, NOT your car's speed (ensures fair difficulty across all devices)
- **Device-Adaptive Difficulty**: The game automatically adjusts to your device for optimal experience

#### Desktop Difficulty:
- **Speed Range**: 3 → 8 (faster obstacles at high levels)
- **Spawn Rate**: 1500ms → 600ms (more frequent obstacles)
- **Level 3+**: 30% chance of 2 obstacles simultaneously
- **Level 5+**: Higher chance of multiple obstacles

#### Mobile Difficulty (Easier):
- **Speed Range**: 2.5 → 6 (25% slower than desktop)
- **Spawn Rate**: 2000ms → 800ms (33% more time between obstacles)
- **Level 3+**: 15% chance of 2 obstacles (50% less than desktop)
- **Level 5+**: 25% chance (lower than desktop)
- **Slower Ramp-Up**: Difficulty increases 30% slower

**Challenge yourself**: Can you reach Level 10? 🏆

**Note**: Your car's acceleration/braking affects your ability to dodge obstacles, but NOT the difficulty progression. Mobile players get easier difficulty to accommodate touch controls!

## Installation & Setup 🚀

### Option 1: Open Directly in Browser

1. Simply open the `index.html` file in any modern web browser
2. No server required!

### Option 2: Using a Local Server (Recommended)

Using Python:
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

Using Node.js (http-server):
```bash
npm install -g http-server
http-server

# Then open: http://localhost:8080
```

Using PHP:
```bash
php -S localhost:8000

# Then open: http://localhost:8000
```

## File Structure 📁

```
car-game/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── game.js            # Game logic and mechanics
├── logo.svg           # Game logo
├── favicon.svg        # Browser favicon
├── README.md          # This file
├── AUDIO_GUIDE.md     # Complete guide for adding audio files
└── audio/             # Audio files folder (needs to be created)
    ├── background-music.mp3
    ├── background-music.ogg
    ├── crash.mp3
    ├── crash.ogg
    ├── score.mp3
    ├── score.ogg
    ├── accelerate.mp3
    └── accelerate.ogg
```

## Audio Setup 🎵

The game includes full audio support! See **[AUDIO_GUIDE.md](AUDIO_GUIDE.md)** for detailed instructions.

**Quick Start:**
1. Create an `audio` folder in the game directory
2. Add your audio files (see AUDIO_GUIDE.md for sources)
3. The game works without audio files - they're optional!

**Features:**
- 🎵 Background music that loops during gameplay
- 💥 Crash sound effect
- 🎯 Score sound effect  
- 🔇 Mute/unmute button (top-right corner)
- 💾 Mute preference saved to browser

## Technical Details 🔧

### Technologies Used

- **HTML5 Canvas**: For game rendering
- **HTML5 Audio**: For background music and sound effects
- **CSS3**: For styling and responsive design
- **Vanilla JavaScript**: For game logic (no frameworks)
- **LocalStorage**: For saving audio preferences

### Game Mechanics

- **Lane System**: 3-lane road with smooth lane transitions
- **Collision Detection**: Precise collision detection with small margins for better gameplay
- **Adaptive Difficulty System**: 
  - Automatic device detection (mobile vs desktop)
  - Mobile gets 25-30% easier difficulty for better touch control experience
  - Distance progression at fixed rate (independent of player speed for consistency)
  - Difficulty level calculated based on distance traveled (every 100m = +1 level)
  - Base speed increases dynamically (desktop: 3→8, mobile: 2.5→6)
  - Obstacle spawn interval decreases dynamically (desktop: 1500→600ms, mobile: 2000→800ms)
  - Multiple obstacles spawn at higher levels (reduced frequency on mobile)
- **Speed Physics**: Player-controlled acceleration, deceleration, and friction with anti-flicker deadzone (affects dodging, not difficulty)
- **Responsive Canvas**: Automatically adjusts to screen size

### Browser Compatibility

- Chrome (Recommended)
- Firefox
- Safari
- Edge
- Any modern browser with HTML5 Canvas support

## Future Enhancements 🚀

Completed improvements:
- [✓] Background music
- [✓] Sound effects for collisions and scoring
- [✓] Mobile touch controls
- [✓] Swipe gesture support

Potential future additions:
- [ ] Multiple levels with increasing difficulty
- [ ] Power-ups (shields, speed boost)
- [ ] Leaderboard system
- [ ] Different car skins
- [ ] Multiplayer mode
- [ ] Day/night themes

## Development 👨‍💻

### Game Configuration

You can customize game settings in the `CONFIG` object in `game.js`:

```javascript
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
    baseSpeedIncreaseRate: 0.001, // How fast obstacles speed up
    maxBaseSpeed: 8, // Maximum obstacle speed
    minObstacleInterval: 600, // Minimum time between obstacles (ms)
    maxObstacleInterval: 1500, // Starting time between obstacles (ms)
    difficultyIncreaseRate: 0.02, // How fast difficulty increases
};
```

**Mobile Configuration** (easier difficulty):
```javascript
const MOBILE_CONFIG = {
    baseSpeed: 2.5,                    // Slower starting speed
    baseSpeedIncreaseRate: 0.0007,     // 30% slower ramp-up
    maxBaseSpeed: 6,                   // 25% lower max speed
    minObstacleInterval: 800,          // More time at max difficulty
    maxObstacleInterval: 2000,         // Slower starting spawn
    difficultyIncreaseRate: 0.015,     // 25% slower progression
    multiObstacleChanceLevel3: 0.15,   // 50% less multi-obstacles
    multiObstacleChanceLevel5: 0.25,   // Lower chance
};
```

**Difficulty Tuning Tips:**
- Game automatically detects device type and applies appropriate config
- Increase `baseSpeedIncreaseRate` for faster difficulty ramp-up
- Decrease `minObstacleInterval` to make the game more intense at high levels
- Adjust `difficultyIncreaseRate` to change how quickly obstacles spawn more frequently
- Modify `MOBILE_CONFIG` values to fine-tune mobile experience

## Credits 🙏

Created with ❤️ using HTML5, CSS3, and JavaScript

## License 📄

Free to use and modify for personal and educational purposes.

---

**Enjoy the game!** 🎮🏁

