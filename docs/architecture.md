# Jamy - Architecture Documentation

## Overview

Jamy is a top-down truck driving game built with Phaser 3 and Vite. The architecture follows a modular design pattern with clear separation of concerns between game logic, rendering, and input handling.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         main.js                             │
│                    (Game Bootstrap)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     Game Scenes                             │
├─────────────┬──────────────┬──────────────┬────────────────┤
│  BootScene  │  MenuScene   │  GameScene   │   EndScene     │
│  (Loading)  │  (Menu)      │  (Gameplay)  │   (Results)    │
└─────────────┴──────────────┴──────┬───────┴────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                ▼                   ▼                   ▼
        ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
        │   Entities   │    │   Systems    │   │   Utilities  │
        ├──────────────┤    ├──────────────┤   ├──────────────┤
        │ • Truck      │    │ • Input      │   │ • Math       │
        │ • Trailer    │    │ • Mission    │   │ • Constants  │
        │ • Obstacle   │    │ • UI         │   └──────────────┘
        └──────────────┘    │ • Camera     │
                            │ • Audio      │
                            └──────────────┘
```

## Core Modules

### 1. Game Initialization (main.js)

The entry point that:
- Imports all scenes
- Configures Phaser game instance
- Handles window focus/blur events

### 2. Game Configuration (config.js)

Defines:
- Canvas settings (size, pixel art mode)
- Physics engine configuration (Arcade Physics)
- Scale settings (upscaling for pixel art)
- Default settings

### 3. Scenes

#### BootScene
**Purpose**: Asset loading and initialization
- Displays loading progress bar
- Preloads all game assets (sprites, audio)
- Transitions to MenuScene when complete

**Key Methods**:
- `preload()`: Load assets
- `createLoadingBar()`: Visual loading feedback
- `updateLoadingBar()`: Progress updates

#### MenuScene
**Purpose**: Main menu interface
- Displays game title and controls
- Start button to begin game
- Mission description

**Key Methods**:
- `create()`: Build menu UI
- Event handlers for button interactions

#### GameScene
**Purpose**: Main gameplay loop
- Manages all game entities
- Coordinates all systems
- Handles game state (play/pause)
- Manages collisions

**Key Methods**:
- `create()`: Initialize game world
- `createMap()`: Generate map layout
- `createZones()`: Pickup/delivery zones
- `createObstacles()`: Place obstacles
- `setupCollisions()`: Configure physics
- `update()`: Main game loop
- `togglePause()`: Pause/resume
- `resetTruck()`: Reset position

**Flow**:
```
create() → setupEntities → setupSystems → setupCollisions
                                              ↓
                                          update()
                                              ↓
                              Input → Truck → Trailer → Mission
                                              ↓
                                          UI Update
```

#### EndScene
**Purpose**: Display mission results
- Shows success/failure message
- Displays score and statistics
- Restart or return to menu options

**Key Methods**:
- `init()`: Receive mission data
- `create()`: Build results UI

### 4. Entities

#### Truck (entities/Truck.js)
The player-controlled vehicle.

**Properties**:
- `speed`: Current speed
- `turnAngle`: Current turn rate
- `spawnX/Y`: Reset position

**Methods**:
- `handleInput(input, delta)`: Process controls and update physics
- `resetPosition()`: Return to spawn
- `handleCollision()`: Collision response
- `getSpeed()`: Current speed value

**Physics**:
- Acceleration forward/backward
- Speed-dependent turning
- Friction when not accelerating
- Handbrake for quick stops

#### Trailer (entities/Trailer.js)
Follows the truck with realistic pivot mechanics.

**Properties**:
- `truck`: Reference to truck
- `pivotDistance`: Connection distance

**Methods**:
- `updatePosition(delta)`: Follow truck with smooth interpolation
- `reset()`: Reset to position

**Mechanics**:
- Smooth following with lerp interpolation
- Angle limiting between truck and trailer
- Pivot point behind truck

#### Obstacle (entities/Obstacle.js)
Static collidable objects.

**Properties**:
- Immovable physics body
- Custom size and color

**Methods**:
- Constructor generates texture dynamically

### 5. Systems

Systems handle specific game functionality and can be easily extended or replaced.

#### InputSystem (systems/InputSystem.js)
**Purpose**: Keyboard input abstraction

**Features**:
- Key mapping configuration
- Support for multiple keys per action (W/Z for forward, A/Q for left)
- Helper methods for key state checks

**Methods**:
- `setupKeys()`: Initialize key bindings
- `isPressed(keyGroup)`: Check if key is down
- `isJustPressed(keyGroup)`: Check for single press
- `getInput()`: Get all current inputs

#### MissionSystem (systems/MissionSystem.js)
**Purpose**: Mission logic and progression

**Responsibilities**:
- Timer management
- Cargo pickup detection
- Delivery zone detection
- Collision counting
- Score calculation

**Methods**:
- `update(delta)`: Update timer
- `checkPickupZone(truck)`: Check if in pickup zone
- `checkDeliveryZone(truck)`: Check if in delivery zone
- `registerCollision()`: Record collision
- `endMission(success)`: Calculate score and end
- `getCurrentObjective()`: Get current goal text
- `getTargetPosition()`: Get next target coordinates

**Scoring Formula**:
```
Score = (TimeRemaining * POINTS_PER_SECOND) - (Collisions * COLLISION_PENALTY)
Score = max(0, Score)
```

#### UISystem (systems/UISystem.js)
**Purpose**: HUD and UI elements

**Elements**:
- Timer display (with color coding)
- Objective text
- Collision counter
- Direction arrow (points to target)
- Pause overlay

**Methods**:
- `createHUD()`: Initialize UI elements
- `update(truck)`: Refresh displays
- `updateDirectionArrow(truck)`: Point to target
- `showPauseOverlay()`: Display pause screen
- `hidePauseOverlay()`: Remove pause screen

#### CameraSystem (systems/CameraSystem.js)
**Purpose**: Camera control and effects

**Features**:
- Smooth follow with lerp
- Deadzone for reduced camera jitter
- Shake effect on collisions
- Flash effect on pickups

**Methods**:
- Constructor: Setup follow and bounds
- `setTarget(target)`: Change follow target
- `shake(duration, intensity)`: Screen shake
- `flash(duration, color)`: Screen flash

#### AudioSystem (systems/AudioSystem.js)
**Purpose**: Audio management (placeholder)

**Note**: Currently a placeholder for future audio implementation.

**Methods**:
- `loadSounds()`: Load audio assets
- `playEngine()`: Engine sound
- `playCollision()`: Collision sound
- `playPickup()`: Pickup sound
- `playDeliver()`: Delivery sound

### 6. Utilities

#### Math Utilities (utils/math.js)
Common mathematical functions:
- `clamp(value, min, max)`: Constrain value
- `lerp(start, end, t)`: Linear interpolation
- `angleBetween(x1, y1, x2, y2)`: Calculate angle
- `distance(x1, y1, x2, y2)`: Calculate distance
- `normalizeAngle(angle)`: Normalize to -180 to 180
- `angleDifference(angle1, angle2)`: Shortest angle difference
- `degToRad(degrees)`: Convert degrees to radians
- `radToDeg(radians)`: Convert radians to degrees

#### Constants (utils/constants.js)
Game configuration values:
- Screen dimensions
- Physics parameters
- Mission settings
- Zone positions
- Control mappings
- Color definitions

## Data Flow

### Game Loop Flow
```
User Input
    ↓
InputSystem.getInput()
    ↓
Truck.handleInput()
    ↓
Physics Update (Phaser)
    ↓
Trailer.updatePosition()
    ↓
MissionSystem.update()
    ↓
MissionSystem.checkZones()
    ↓
UISystem.update()
    ↓
Render (Phaser)
```

### Mission Flow
```
GameScene.create()
    ↓
Player moves truck
    ↓
Enter Pickup Zone → MissionSystem.checkPickupZone()
    ↓
cargoPickedUp = true → Event: 'cargoPickedUp'
    ↓
UI updates objective: "Deliver cargo"
    ↓
Enter Delivery Zone → MissionSystem.checkDeliveryZone()
    ↓
Calculate Score → MissionSystem.endMission()
    ↓
Event: 'missionEnd' → Transition to EndScene
```

## Event System

The game uses Phaser's event system for loose coupling:

**Events Emitted**:
- `'cargoPickedUp'`: When player enters pickup zone
- `'collision'`: When truck hits obstacle
- `'missionEnd'`: When mission completes (success or failure)

**Event Handlers**:
```javascript
// In GameScene
this.events.on('cargoPickedUp', () => {
  this.cameraSystem.flash(200, 0x00ff00);
});

this.events.on('collision', () => {
  this.cameraSystem.shake(150, 0.008);
});

this.events.on('missionEnd', (data) => {
  this.scene.start('EndScene', data);
});
```

## Physics System

### Truck Physics Model

The truck uses a simple arcade physics model:

**Acceleration**:
```javascript
if (forward) {
  speed = min(speed + ACCELERATION * dt, MAX_SPEED)
}
```

**Friction**:
```javascript
if (!accelerating) {
  speed *= FRICTION
}
```

**Turning**:
```javascript
speedFactor = speed / MAX_SPEED
if (speedFactor > MIN_TURN_SPEED) {
  rotation += TURN_SPEED * speedFactor * dt
}
```

**Velocity**:
```javascript
velocityX = cos(rotation) * speed
velocityY = sin(rotation) * speed
```

### Collision Detection

Uses Phaser's Arcade Physics:
- AABB (Axis-Aligned Bounding Box) collision
- Colliders between truck/trailer and obstacles
- World bounds collision
- Collision callbacks for game logic

## Extending the Game

### Adding a New Scene

1. Create scene file in `src/game/scenes/`:
```javascript
import Phaser from 'phaser';

export default class NewScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NewScene' });
  }
  
  create() {
    // Scene logic
  }
}
```

2. Import and add to `main.js`:
```javascript
import NewScene from './game/scenes/NewScene.js';
gameConfig.scene = [..., NewScene];
```

### Adding a New Entity

1. Create entity file in `src/game/entities/`:
```javascript
import Phaser from 'phaser';

export default class NewEntity extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'sprite-key');
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
```

2. Instantiate in GameScene:
```javascript
this.newEntity = new NewEntity(this, x, y);
```

### Adding a New System

1. Create system file in `src/game/systems/`:
```javascript
export default class NewSystem {
  constructor(scene) {
    this.scene = scene;
  }
  
  update(delta) {
    // System logic
  }
  
  destroy() {
    // Cleanup
  }
}
```

2. Initialize in GameScene:
```javascript
this.newSystem = new NewSystem(this);
```

3. Update in game loop:
```javascript
update(time, delta) {
  this.newSystem.update(delta);
}
```

### Adding New Controls

1. Update `CONTROLS` in `constants.js`:
```javascript
export const CONTROLS = {
  // ... existing
  NEW_ACTION: ['KEY']
};
```

2. Add to InputSystem:
```javascript
this.keys.newAction = CONTROLS.NEW_ACTION.map(key => 
  keyboard.addKey(key)
);
```

3. Use in game logic:
```javascript
if (input.newAction) {
  // Handle action
}
```

## Performance Considerations

### Optimization Techniques Used

1. **Object Pooling**: Potential for obstacle reuse
2. **Sprite Batching**: Phaser handles automatically
3. **Texture Atlas**: Can combine sprites for better performance
4. **Physics Groups**: Efficient collision detection
5. **Depth Sorting**: Minimal use, only where needed

### Performance Tips

- Keep physics bodies simple (rectangles)
- Limit number of active physics objects
- Use texture atlases for multiple sprites
- Minimize text updates (cache where possible)
- Use object pools for frequently created/destroyed objects

## Testing Strategy

### Manual Testing Checklist

- [ ] All controls respond correctly
- [ ] Truck physics feel responsive
- [ ] Trailer follows smoothly
- [ ] Collisions detected accurately
- [ ] Pickup zone triggers
- [ ] Delivery zone triggers
- [ ] Timer counts down
- [ ] Score calculates correctly
- [ ] Pause/resume works
- [ ] Reset position works
- [ ] Scene transitions smooth
- [ ] UI displays correctly
- [ ] Direction arrow points correctly

### Debug Mode

Enable physics debug in `config.js`:
```javascript
physics: {
  default: 'arcade',
  arcade: {
    debug: true // Shows collision boxes
  }
}
```

## Asset Pipeline

### Asset Generation

Assets are generated programmatically using Node.js Canvas:

```bash
npm run gen-assets
```

This creates:
- `truck.png` (32x32): Pixel art truck sprite
- `trailer.png` (16x48): Pixel art trailer sprite
- `tiles.png` (128x64): Tileset with various terrain types

### Custom Assets

To use custom assets:
1. Create assets with correct dimensions
2. Place in `public/assets/sprites/`
3. Maintain naming convention
4. Restart dev server

## Build Process

### Development Build
```bash
npm run dev
```
- Fast rebuild
- Hot module replacement
- Source maps
- No minification

### Production Build
```bash
npm run build
```
- Minified code
- Optimized assets
- Tree shaking
- Chunk splitting

## Future Architecture Improvements

### Potential Enhancements

1. **State Management**: Implement global state manager for persistence
2. **Asset Loading**: Add asset loading queue system
3. **Save System**: LocalStorage for progress saving
4. **Network Layer**: WebSocket for multiplayer
5. **Sound Manager**: Full audio system with volume controls
6. **Particle System**: Add visual effects
7. **Animation System**: Sprite animations for truck
8. **Map Editor**: Tool for creating custom maps
9. **Plugin System**: Modular plugin architecture

### Scalability Considerations

- **Scene Manager**: Better scene state management
- **Resource Manager**: Centralized resource loading
- **Config System**: External JSON configuration
- **Localization**: Multi-language support
- **Analytics**: Event tracking integration
- **Error Handling**: Centralized error management

---

This architecture provides a solid foundation for a pixel art truck driving game while remaining simple enough to understand and extend.
