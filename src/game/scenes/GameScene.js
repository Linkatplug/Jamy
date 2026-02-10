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
  MAP_WIDTH, 
  MAP_HEIGHT, 
  PICKUP_ZONE, 
  DELIVERY_ZONE, 
  COLORS 
} from '../utils/constants.js';

/**
 * GameScene - Main gameplay scene
 */
export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.isPaused = false;
    
    // Set world bounds
    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    
    // Create map
    this.createMap();
    
    // Create zones
    this.createZones();
    
    // Create obstacles
    this.createObstacles();
    
    // Create truck at spawn position
    this.truck = new Truck(this, 150, 150);
    
    // Create trailer (optional - can be toggled)
    this.trailer = new Trailer(this, this.truck);
    
    // Initialize systems
    this.inputSystem = new InputSystem(this);
    this.missionSystem = new MissionSystem(this);
    this.uiSystem = new UISystem(this, this.missionSystem);
    this.cameraSystem = new CameraSystem(this, this.truck, { width: MAP_WIDTH, height: MAP_HEIGHT });
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

  createMap() {
    // Create simple map with grass background and roads
    const graphics = this.add.graphics();
    
    // Grass background
    graphics.fillStyle(COLORS.GRASS, 1);
    graphics.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    
    // Main road (horizontal)
    graphics.fillStyle(COLORS.ROAD, 1);
    graphics.fillRect(0, MAP_HEIGHT / 2 - 100, MAP_WIDTH, 200);
    
    // Road markings
    graphics.lineStyle(3, 0xFFFFFF, 1);
    for (let x = 0; x < MAP_WIDTH; x += 60) {
      graphics.strokeLineShape(new Phaser.Geom.Line(x, MAP_HEIGHT / 2, x + 30, MAP_HEIGHT / 2));
    }
    
    // Vertical road
    graphics.fillStyle(COLORS.ROAD, 1);
    graphics.fillRect(400, 0, 200, MAP_HEIGHT);
    
    // Vertical road markings
    for (let y = 0; y < MAP_HEIGHT; y += 60) {
      graphics.strokeLineShape(new Phaser.Geom.Line(500, y, 500, y + 30));
    }
    
    // Parking areas at zones
    graphics.fillStyle(0x666666, 1);
    graphics.fillRect(PICKUP_ZONE.x - 20, PICKUP_ZONE.y - 20, PICKUP_ZONE.width + 40, PICKUP_ZONE.height + 40);
    graphics.fillRect(DELIVERY_ZONE.x - 20, DELIVERY_ZONE.y - 20, DELIVERY_ZONE.width + 40, DELIVERY_ZONE.height + 40);
    
    // Set depth to background
    graphics.setDepth(0);
  }

  createZones() {
    // Pickup zone (green)
    const pickupGraphics = this.add.graphics();
    pickupGraphics.fillStyle(COLORS.PICKUP_ZONE, 0.3);
    pickupGraphics.fillRect(PICKUP_ZONE.x, PICKUP_ZONE.y, PICKUP_ZONE.width, PICKUP_ZONE.height);
    pickupGraphics.lineStyle(3, COLORS.PICKUP_ZONE, 1);
    pickupGraphics.strokeRect(PICKUP_ZONE.x, PICKUP_ZONE.y, PICKUP_ZONE.width, PICKUP_ZONE.height);
    pickupGraphics.setDepth(1);
    
    // Pickup label
    this.add.text(
      PICKUP_ZONE.x + PICKUP_ZONE.width / 2,
      PICKUP_ZONE.y + PICKUP_ZONE.height / 2,
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
    deliveryGraphics.fillRect(DELIVERY_ZONE.x, DELIVERY_ZONE.y, DELIVERY_ZONE.width, DELIVERY_ZONE.height);
    deliveryGraphics.lineStyle(3, COLORS.DELIVERY_ZONE, 1);
    deliveryGraphics.strokeRect(DELIVERY_ZONE.x, DELIVERY_ZONE.y, DELIVERY_ZONE.width, DELIVERY_ZONE.height);
    deliveryGraphics.setDepth(1);
    
    // Delivery label
    this.add.text(
      DELIVERY_ZONE.x + DELIVERY_ZONE.width / 2,
      DELIVERY_ZONE.y + DELIVERY_ZONE.height / 2,
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
    
    // Create some obstacles around the map
    const obstaclePositions = [
      { x: 600, y: 150, w: 60, h: 60 },
      { x: 700, y: 300, w: 40, h: 80 },
      { x: 300, y: 500, w: 80, h: 40 },
      { x: 900, y: 200, w: 50, h: 50 },
      { x: 800, y: 650, w: 60, h: 60 },
      { x: 1100, y: 400, w: 70, h: 50 },
      { x: 1300, y: 250, w: 50, h: 70 },
      { x: 200, y: 700, w: 60, h: 40 },
      { x: 1400, y: 750, w: 80, h: 60 }
    ];
    
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
