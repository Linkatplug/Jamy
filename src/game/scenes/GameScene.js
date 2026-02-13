import Phaser from 'phaser';
import Truck from '../entities/Truck.js';
import Trailer from '../entities/Trailer.js';
import Obstacle from '../entities/Obstacle.js';
import InputSystem from '../systems/InputSystem.js';
import MissionSystem from '../systems/MissionSystem.js';
import UISystem from '../systems/UISystem.js';
import CameraSystem from '../systems/CameraSystem.js';
import AudioSystem from '../systems/AudioSystem.js';
import { 
  LEVELS,
  COLORS,
  MISSION_TYPES
} from '../utils/constants.js';

/**
 * GameScene - Main gameplay scene with level support
 */
export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    // Get level data (default to LEVEL_1)
    this.levelKey = data.levelKey || 'LEVEL_1';
    this.levelData = LEVELS[this.levelKey];
  }

  create() {
    this.isPaused = false;
    
    // Use level-specific dimensions
    const mapWidth = this.levelData.mapWidth;
    const mapHeight = this.levelData.mapHeight;
    
    // Set world bounds
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    
    // Create map with level-specific settings
    this.createMap(mapWidth, mapHeight);
    
    // Create zones with level-specific positions
    this.createZones();
    
    // Create obstacles with level-specific positions
    this.createObstacles();
    
    // Create truck at level-specific spawn position
    this.truck = new Truck(this, this.levelData.spawnX, this.levelData.spawnY);
    
    // Create trailer (optional - can be toggled)
    this.trailer = new Trailer(this, this.truck);
    
    // Initialize systems
    this.inputSystem = new InputSystem(this);
    this.missionSystem = new MissionSystem(this, MISSION_TYPES.STANDARD, this.levelKey);
    this.uiSystem = new UISystem(this, this.missionSystem);
    this.cameraSystem = new CameraSystem(this, this.truck, { width: mapWidth, height: mapHeight });
    this.audioSystem = new AudioSystem(this);
    
    // Initialize audio (create engine sound)
    this.audioSystem.createEngineSound();
    this.audioSystem.startAmbientMusic();
    
    // Setup collisions
    this.setupCollisions();
    
    // Setup event listeners
    this.setupEvents();
    
    // Create particle emitters for effects
    this.createParticleEffects();
  }

  createMap(mapWidth, mapHeight) {
    // Create simple map with grass background and roads
    const graphics = this.add.graphics();
    
    // Determine grass color based on level
    const grassColor = this.levelKey === 'LEVEL_2' ? COLORS.LEVEL2_GRASS : COLORS.LEVEL1_GRASS;
    
    // Grass background
    graphics.fillStyle(grassColor, 1);
    graphics.fillRect(0, 0, mapWidth, mapHeight);
    
    // Main road (horizontal)
    graphics.fillStyle(COLORS.ROAD, 1);
    graphics.fillRect(0, mapHeight / 2 - 100, mapWidth, 200);
    
    // Road markings
    graphics.lineStyle(3, 0xFFFFFF, 1);
    for (let x = 0; x < mapWidth; x += 60) {
      graphics.strokeLineShape(new Phaser.Geom.Line(x, mapHeight / 2, x + 30, mapHeight / 2));
    }
    
    // Vertical road
    graphics.fillStyle(COLORS.ROAD, 1);
    graphics.fillRect(400, 0, 200, mapHeight);
    
    // Vertical road markings
    for (let y = 0; y < mapHeight; y += 60) {
      graphics.strokeLineShape(new Phaser.Geom.Line(500, y, 500, y + 30));
    }
    
    // Additional roads for level 2
    if (this.levelKey === 'LEVEL_2') {
      // Diagonal road
      graphics.fillStyle(COLORS.ROAD, 1);
      graphics.fillRect(800, 0, 200, mapHeight);
      
      // Diagonal road markings
      for (let y = 0; y < mapHeight; y += 60) {
        graphics.strokeLineShape(new Phaser.Geom.Line(900, y, 900, y + 30));
      }
    }
    
    // Parking areas at zones (use level-specific zones)
    const pickupZone = this.levelData.pickupZone;
    const deliveryZone = this.levelData.deliveryZone;
    
    graphics.fillStyle(0x666666, 1);
    graphics.fillRect(pickupZone.x - 20, pickupZone.y - 20, pickupZone.width + 40, pickupZone.height + 40);
    graphics.fillRect(deliveryZone.x - 20, deliveryZone.y - 20, deliveryZone.width + 40, deliveryZone.height + 40);
    
    // Set depth to background
    graphics.setDepth(0);
  }

  createZones() {
    // Use level-specific zones
    const pickupZone = this.levelData.pickupZone;
    const deliveryZone = this.levelData.deliveryZone;
    
    // Pickup zone (green)
    const pickupGraphics = this.add.graphics();
    pickupGraphics.fillStyle(COLORS.PICKUP_ZONE, 0.3);
    pickupGraphics.fillRect(pickupZone.x, pickupZone.y, pickupZone.width, pickupZone.height);
    pickupGraphics.lineStyle(3, COLORS.PICKUP_ZONE, 1);
    pickupGraphics.strokeRect(pickupZone.x, pickupZone.y, pickupZone.width, pickupZone.height);
    pickupGraphics.setDepth(1);
    
    // Add pulsing animation to pickup zone
    this.tweens.add({
      targets: pickupGraphics,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
    
    // Pickup label
    this.add.text(
      pickupZone.x + pickupZone.width / 2,
      pickupZone.y + pickupZone.height / 2,
      'PICKUP',
      {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#00ff00',
        stroke: '#000000',
        strokeThickness: 3,
        fontStyle: 'bold'
      }
    ).setOrigin(0.5).setDepth(2);
    
    // Delivery zone (red)
    const deliveryGraphics = this.add.graphics();
    deliveryGraphics.fillStyle(COLORS.DELIVERY_ZONE, 0.3);
    deliveryGraphics.fillRect(deliveryZone.x, deliveryZone.y, deliveryZone.width, deliveryZone.height);
    deliveryGraphics.lineStyle(3, COLORS.DELIVERY_ZONE, 1);
    deliveryGraphics.strokeRect(deliveryZone.x, deliveryZone.y, deliveryZone.width, deliveryZone.height);
    deliveryGraphics.setDepth(1);
    
    // Add pulsing animation to delivery zone
    this.tweens.add({
      targets: deliveryGraphics,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
    
    // Delivery label
    this.add.text(
      deliveryZone.x + deliveryZone.width / 2,
      deliveryZone.y + deliveryZone.height / 2,
      'DELIVERY',
      {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 3,
        fontStyle: 'bold'
      }
    ).setOrigin(0.5).setDepth(2);
  }

  createObstacles() {
    this.obstaclesGroup = this.physics.add.group();
    
    // Use level-specific obstacle positions
    const obstaclePositions = this.levelData.obstacles;
    
    obstaclePositions.forEach(pos => {
      const obstacle = new Obstacle(this, pos.x, pos.y, pos.w, pos.h, COLORS.OBSTACLE);
      this.obstaclesGroup.add(obstacle);
    });
  }

  setupCollisions() {
    // Truck collision with obstacles
    this.physics.add.collider(this.truck, this.obstaclesGroup, this.onTruckCollision, null, this);
    
    // Trailer collision with obstacles (optional)
    if (this.trailer) {
      this.physics.add.collider(this.trailer, this.obstaclesGroup);
    }
  }

  setupEvents() {
    // Mission events
    this.events.on('cargoPickedUp', () => {
      this.cameraSystem.flash(200, 0x00ff00);
      this.audioSystem.playPickup();
      this.createPickupParticles(this.truck.x, this.truck.y);
    });
    
    this.events.on('collision', () => {
      this.cameraSystem.shake(150, 0.008);
      this.audioSystem.playCollision();
      this.createCollisionParticles(this.truck.x, this.truck.y);
    });
    
    this.events.on('missionEnd', (data) => {
      if (data.success) {
        this.audioSystem.playDeliver();
        // Mark level as complete
        if (this.levelKey === 'LEVEL_1') {
          localStorage.setItem('jamy_level1_complete', 'true');
        }
        // Add level info to mission data
        data.levelKey = this.levelKey;
        data.levelName = this.levelData.name;
      }
      this.audioSystem.stopAll();
      // Transition to end scene
      this.time.delayedCall(1000, () => {
        this.scene.start('EndScene', data);
      });
    });
  }

  createParticleEffects() {
    // Create dust particles for truck movement
    this.dustParticles = this.add.particles(0, 0, 'pixel', {
      speed: { min: 20, max: 40 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 500,
      frequency: 100,
      tint: 0x8B7355,
      on: false
    });
    this.dustParticles.setDepth(8);
  }

  createPickupParticles(x, y) {
    // Create success particles
    const particles = this.add.particles(x, y, 'pixel', {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 2, end: 0 },
      lifespan: 600,
      quantity: 20,
      tint: 0x00ff00,
      blendMode: 'ADD'
    });
    particles.setDepth(50);
    
    this.time.delayedCall(700, () => {
      particles.destroy();
    });
  }

  createCollisionParticles(x, y) {
    // Create collision particles
    const particles = this.add.particles(x, y, 'pixel', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      lifespan: 400,
      quantity: 15,
      tint: 0xff4500,
      blendMode: 'ADD'
    });
    particles.setDepth(50);
    
    this.time.delayedCall(500, () => {
      particles.destroy();
    });
  }

  onTruckCollision(truck, obstacle) {
    this.truck.handleCollision();
    this.missionSystem.registerCollision();
  }

  update(time, delta) {
    if (this.isPaused) return;
    
    // Get input
    const input = this.inputSystem.getInput();
    
    // Handle pause
    if (input.pause) {
      this.togglePause();
      return;
    }
    
    // Handle reset
    if (input.reset) {
      this.resetTruck();
    }
    
    // Update truck
    this.truck.handleInput(input, delta);
    
    // Update audio - engine sound based on truck speed
    const truckSpeed = this.truck.getSpeed();
    this.audioSystem.playEngine(truckSpeed, 300);
    
    // Update dust particles based on truck speed
    if (Math.abs(truckSpeed) > 50 && this.dustParticles) {
      this.dustParticles.setPosition(this.truck.x - Math.cos(this.truck.rotation) * 15, 
                                      this.truck.y - Math.sin(this.truck.rotation) * 15);
      this.dustParticles.start();
    } else if (this.dustParticles) {
      this.dustParticles.stop();
    }
    
    // Update trailer
    if (this.trailer) {
      this.trailer.updatePosition(delta);
    }
    
    // Update mission system
    this.missionSystem.update(delta);
    
    // Check mission zones
    this.missionSystem.checkPickupZone(this.truck);
    this.missionSystem.checkDeliveryZone(this.truck);
    
    // Update UI
    this.uiSystem.update(this.truck);
    
    // Update camera
    this.cameraSystem.update();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.physics.pause();
      this.uiSystem.showPauseOverlay();
    } else {
      this.physics.resume();
      this.uiSystem.hidePauseOverlay();
    }
  }

  resetTruck() {
    this.truck.resetPosition();
    if (this.trailer) {
      const pos = this.truck.getPosition();
      this.trailer.reset(pos.x - 40, pos.y, pos.rotation);
    }
  }

  shutdown() {
    // Cleanup
    this.inputSystem.destroy();
    this.uiSystem.destroy();
    this.audioSystem.destroy();
    this.events.off('cargoPickedUp');
    this.events.off('collision');
    this.events.off('missionEnd');
  }
}
