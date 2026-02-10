# JAMY - Truck Driving Game

A top-down truck driving game in pixel art style for web browsers. Drive an American-style truck, pick up cargo, and deliver it before time runs out!

![Game Preview](docs/preview.png)

## Features

- 🚚 Top-down arcade truck driving physics
- 🎮 Keyboard controls only
- 🎨 Pixel art graphics with nearest neighbor rendering
- 📦 Mission-based gameplay: pickup and delivery
- ⏱️ Time-based scoring system
- 🎯 Direction arrow pointing to objectives
- 🚧 Obstacles and collision detection
- 🎪 Trailer mechanics (fake pivot system)

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Linkatplug/Jamy.git
cd Jamy

# Install dependencies
npm install

# Generate game assets (sprites)
npm run gen-assets

# Start development server
npm run dev
```

The game will automatically open in your browser at `http://localhost:3000`.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

## Controls

| Key | Action |
|-----|--------|
| **W** or **Z** | Accelerate forward |
| **S** | Brake / Reverse |
| **A** or **Q** | Turn left |
| **D** | Turn right |
| **SPACE** | Handbrake (emergency brake) |
| **R** | Reset truck position |
| **ESC** | Pause / Resume game |

## Gameplay

### Objective
Pick up cargo from the green zone and deliver it to the red zone before time runs out!

### Scoring
- **Time Bonus**: Faster deliveries earn more points (10 points per second remaining)
- **Collision Penalty**: Each collision deducts 50 points
- **Final Score**: Time Bonus - Collision Penalties

### Tips
- Use the direction arrow at the bottom of the screen to find your target
- Avoid obstacles to maximize your score
- The truck turns better at higher speeds
- Use handbrake for tight turns
- Watch your collision counter!

## Project Structure

```
Jamy/
├── public/
│   └── assets/
│       └── sprites/          # Generated sprite assets
│           ├── truck.png
│           ├── trailer.png
│           └── tiles.png
├── src/
│   ├── main.js              # Game bootstrap
│   ├── styles/
│   │   └── style.css        # Game styling
│   └── game/
│       ├── config.js        # Phaser configuration
│       ├── scenes/          # Game scenes
│       │   ├── BootScene.js     # Asset loading
│       │   ├── MenuScene.js     # Main menu
│       │   ├── GameScene.js     # Main gameplay
│       │   └── EndScene.js      # Results screen
│       ├── entities/        # Game entities
│       │   ├── Truck.js         # Player truck
│       │   ├── Trailer.js       # Trailer mechanics
│       │   └── Obstacle.js      # Static obstacles
│       ├── systems/         # Game systems
│       │   ├── InputSystem.js   # Keyboard input
│       │   ├── MissionSystem.js # Mission logic
│       │   ├── UISystem.js      # HUD display
│       │   ├── CameraSystem.js  # Camera follow
│       │   └── AudioSystem.js   # Audio (placeholder)
│       └── utils/           # Utilities
│           ├── constants.js     # Game constants
│           └── math.js          # Math helpers
├── scripts/
│   └── gen-assets.js        # Asset generation script
├── docs/
│   └── architecture.md      # Architecture documentation
├── package.json
├── vite.config.js
└── README.md
```

## Customization

### Adding Your Own Sprites

The game uses auto-generated placeholder sprites by default. To use your own:

1. **Truck sprite**: Replace `public/assets/sprites/truck.png` with your own 32x32 pixel art truck
2. **Trailer sprite**: Replace `public/assets/sprites/trailer.png` with your own 16x48 pixel art trailer
3. **Tiles**: Replace `public/assets/sprites/tiles.png` with your own tileset

**Important**: Maintain the same dimensions for proper game rendering:
- Truck: 32x32 pixels
- Trailer: 16x48 pixels
- Tiles: Any size (currently 128x64 for 4x2 tiles)

### Modifying Game Constants

Edit `src/game/utils/constants.js` to adjust:
- Truck physics (acceleration, max speed, turn rate)
- Mission time limit
- Scoring parameters
- Map dimensions
- Zone positions

### Adding New Obstacles

In `src/game/scenes/GameScene.js`, add positions to the `obstaclePositions` array in the `createObstacles()` method.

## Deployment

### GitHub Pages

1. Update `vite.config.js` base path if needed:
```javascript
export default defineConfig({
  base: '/Jamy/', // Replace with your repo name
  // ...
});
```

2. Build the project:
```bash
npm run build
```

3. Deploy the `dist/` folder to GitHub Pages:
```bash
# Using gh-pages package
npm install -g gh-pages
gh-pages -d dist
```

4. Enable GitHub Pages in repository settings pointing to the `gh-pages` branch

### Other Hosting

Simply upload the contents of the `dist/` folder to any static hosting service:
- Netlify
- Vercel
- AWS S3
- Firebase Hosting
- etc.

## Technology Stack

- **Game Engine**: [Phaser 3](https://phaser.io/) - HTML5 game framework
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tool and dev server
- **Language**: JavaScript (ES Modules)
- **Asset Generation**: Node.js Canvas API

## Development

### NPM Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run gen-assets` - Generate placeholder sprite assets

### Adding Features

See [docs/architecture.md](docs/architecture.md) for detailed information about the game architecture and how to extend it.

## Browser Support

The game works in all modern browsers that support:
- ES6 Modules
- Canvas API
- WebGL (for Phaser 3)

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details

## Credits

Created as a pixel art truck driving game demonstration using Phaser 3.

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/Linkatplug/Jamy).

## Roadmap

Potential future enhancements:
- [ ] Multiple missions with increasing difficulty
- [ ] Different truck types
- [ ] Weather effects
- [ ] Day/night cycle
- [ ] More detailed maps
- [ ] Multiplayer mode
- [ ] Mobile touch controls
- [ ] Sound effects and music
- [ ] Achievements system
- [ ] Leaderboards

---

**Enjoy the game! 🚚💨**
