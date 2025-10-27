# Speedster - Car Racing Game 🏎️

A fun and engaging 2D car racing game built with HTML5 Canvas, CSS3, and vanilla JavaScript. Navigate your car through traffic, avoid obstacles, and score points!

## Features ✨

- **Smooth Gameplay**: Responsive controls with smooth car movement and lane switching
- **Dynamic Obstacles**: Three types of obstacles (cars, traffic cones, barriers) that spawn randomly
- **Score System**: Earn points for each obstacle you successfully pass
- **Speed Control**: Accelerate and brake to control your speed (0-150)
- **Distance Tracking**: Track how far you've traveled
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
- **Dynamic Difficulty**: Obstacle spawn rate increases as you travel further
- **Speed Physics**: Realistic acceleration, deceleration, and friction
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
};
```

## Credits 🙏

Created with ❤️ using HTML5, CSS3, and JavaScript

## License 📄

Free to use and modify for personal and educational purposes.

---

**Enjoy the game!** 🎮🏁

