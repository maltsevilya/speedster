# Audio Setup Guide 🎵

The game now has full audio support with background music and sound effects! Here's how to add your audio files.

## Required Audio Files

You need to create an `audio` folder in your game directory with the following sound files:

```
car-game/
├── audio/
│   ├── background-music.mp3    (Background music that loops during gameplay)
│   ├── background-music.ogg    (Alternative format for better browser support)
│   ├── crash.mp3              (Plays when you crash into an obstacle)
│   ├── crash.ogg              (Alternative format)
│   ├── score.mp3              (Plays when you successfully pass an obstacle)
│   ├── score.ogg              (Alternative format)
│   ├── accelerate.mp3         (Optional: plays when accelerating)
│   └── accelerate.ogg         (Alternative format)
```

## How to Get Audio Files

### Option 1: Free Royalty-Free Sound Resources

1. **Background Music:**
   - [freesound.org](https://freesound.org/) - Search for "game music" or "racing music"
   - [incompetech.com](https://incompetech.com/music/royalty-free/) - Kevin MacLeod's free music
   - [opengameart.org](https://opengameart.org/) - Game-specific music and sounds
   - Search for: "8-bit racing", "arcade music", "upbeat electronic"

2. **Sound Effects:**
   - [freesound.org](https://freesound.org/) - Huge library of sound effects
   - [zapsplat.com](https://www.zapsplat.com/) - Free sound effects
   - [mixkit.co/free-sound-effects/](https://mixkit.co/free-sound-effects/) - Free game sounds
   - Search for: "car crash", "coin pickup", "beep", "engine"

### Option 2: Create Your Own Sounds

- **[BeepBox](https://www.beepbox.co/)** - Create simple chiptune music online
- **[BFXR](https://www.bfxr.net/)** - Generate retro game sound effects
- **[ChipTone](https://sfbgames.itch.io/chiptone)** - Another great sound effect generator

### Option 3: Use Placeholder Sounds (Testing)

For testing purposes, you can use simple sine wave beeps:

1. Go to [onlinetonegenerator.com](https://onlinetonegenerator.com/)
2. Generate different frequency tones
3. Download as MP3
4. Use these as temporary sounds

## Converting Audio Files

Most browsers support MP3, but OGG provides better compatibility. To convert:

### Using Online Converter:
- Visit [cloudconvert.com](https://cloudconvert.com/)
- Upload your MP3 file
- Convert to OGG format
- Download both versions

### Using FFmpeg (Command Line):
```bash
# Install FFmpeg first (if not installed)
# Mac: brew install ffmpeg
# Windows: Download from ffmpeg.org

# Convert MP3 to OGG
ffmpeg -i background-music.mp3 -c:a libvorbis background-music.ogg
ffmpeg -i crash.mp3 -c:a libvorbis crash.ogg
ffmpeg -i score.mp3 -c:a libvorbis score.ogg
ffmpeg -i accelerate.mp3 -c:a libvorbis accelerate.ogg
```

## Setup Instructions

1. **Create the audio folder:**
   ```bash
   cd car-game
   mkdir audio
   ```

2. **Add your audio files** to the `audio` folder

3. **Test the game** - The audio should work automatically!

## Audio Features

### ✨ What Works Now:

- **🎵 Background Music**: Loops continuously during gameplay
- **💥 Crash Sound**: Plays when you hit an obstacle
- **🎯 Score Sound**: Plays each time you pass an obstacle
- **🔇 Mute Button**: Toggle sound on/off (top-right corner)
- **💾 Persistent Settings**: Your mute preference is saved to localStorage

### Volume Levels:

The game has pre-set volume levels for optimal balance:
- Background Music: 30% (0.3)
- Crash Sound: 50% (0.5)
- Score Sound: 40% (0.4)
- Accelerate Sound: 20% (0.2)

You can adjust these in `game.js` in the `initAudio()` function.

## Recommended Audio Specs

For best performance and compatibility:

- **Format**: MP3 (primary) + OGG (fallback)
- **Sample Rate**: 44100 Hz
- **Bit Rate**: 128-192 kbps for music, 64-128 kbps for effects
- **Duration**: 
  - Background music: 30-120 seconds (will loop)
  - Sound effects: 0.5-2 seconds
- **File Size**: Keep under 1-2 MB per file for fast loading

## Quick Start (No Audio Files)

If you don't have audio files yet, the game will work perfectly fine without them! The code handles missing audio gracefully:

- No errors will be shown
- The mute button will still work
- The game is fully playable
- Console logs will show "Sound play prevented" (this is normal)

## Troubleshooting

### Audio Won't Play?

1. **Browser Autoplay Policy**: Some browsers block autoplay. Users might need to interact with the page first (click Start Game).

2. **File Paths**: Make sure your audio files are in the `audio` folder with the exact names shown above.

3. **File Format**: If one format doesn't work, the browser will try the alternative (MP3 ↔ OGG).

4. **Check Console**: Open browser DevTools (F12) and check for any error messages.

5. **HTTPS Required**: Some browsers require HTTPS for audio to work properly in production.

### Adjusting Volume

Edit `game.js`, find the `initAudio()` function, and modify:

```javascript
if (bgMusic) bgMusic.volume = 0.3;  // Change 0.3 to your preferred volume (0.0 - 1.0)
```

## License Considerations

When using audio files, make sure to:

1. ✅ Check the license (Creative Commons, Public Domain, etc.)
2. ✅ Provide attribution if required
3. ✅ Ensure commercial use is allowed (if applicable)
4. ✅ Keep a `LICENSE.txt` file with audio credits

## Example Audio Credits Format

Create a `CREDITS.txt` file:

```
Audio Credits
=============

Background Music: "Retro Racing" by Artist Name
Source: Website URL
License: CC BY 3.0

Crash Sound: "Metal Crash" by Artist Name
Source: Website URL
License: CC0 (Public Domain)

Score Sound: "Coin Pickup" by Artist Name
Source: Website URL
License: CC BY 4.0
```

## Next Steps

1. Create the `audio` folder
2. Download or create your audio files
3. Add the files to the `audio` folder
4. Test the game with sound!
5. Adjust volumes as needed
6. Add audio credits to your project

Enjoy your game with immersive sound! 🎮🔊

