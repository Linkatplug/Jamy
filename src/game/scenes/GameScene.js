import Phaser from 'phaser';
import Truck from '../entities/Truck.js';
import Trailer from '../entities/Trailer.js';
import Obstacle from '../entities/Obstacle.js';
import Squirrel from '../entities/Squirrel.js';
import Pedestrian from '../entities/Pedestrian.js';
import Building from '../entities/Building.js';
import TrafficVehicle from '../entities/TrafficVehicle.js';
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
    
    // Create buildings for city atmosphere
    this.createBuildings();
    
    // Create traffic vehicles on roads
    this.createTrafficVehicles();
    
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

    // Decorative wildlife
    this.bloodTrailGraphics = this.add.graphics().setDepth(2);
    this.createSquirrels();
    this.createPedestrians();
  }

  createMap(mapWidth, mapHeight) {
    // Create simple map with grass background and roads
    const graphics = this.add.graphics();
    
    // Determine grass color based on level
    const grassColor = this.levelKey === 'LEVEL_2' ? COLORS.LEVEL2_GRASS : COLORS.LEVEL1_GRASS;
    const laneColor = 0xf4f0dd;
    const shoulderColor = 0x6a6f73;
    
    // Grass background
    graphics.fillStyle(grassColor, 1);
    graphics.fillRect(0, 0, mapWidth, mapHeight);
    
    // Main roads (scaled to map size for better readability)
    const horizontalRoadY = mapHeight * 0.52;
    const verticalRoadX = mapWidth * 0.32;

    graphics.fillStyle(shoulderColor, 1);
    graphics.fillRect(0, horizontalRoadY - 116, mapWidth, 232);
    graphics.fillRect(verticalRoadX - 116, 0, 232, mapHeight);

    graphics.fillStyle(COLORS.ROAD, 1);
    graphics.fillRect(0, horizontalRoadY - 94, mapWidth, 188);
    graphics.fillRect(verticalRoadX - 94, 0, 188, mapHeight);

    // Road markings
    graphics.lineStyle(4, laneColor, 0.9);
    for (let x = 0; x < mapWidth; x += 84) {
      graphics.strokeLineShape(new Phaser.Geom.Line(x, horizontalRoadY, x + 42, horizontalRoadY));
    }

    for (let y = 0; y < mapHeight; y += 84) {
      graphics.strokeLineShape(new Phaser.Geom.Line(verticalRoadX, y, verticalRoadX, y + 42));
    }

    // Additional lane for larger missions
    if (this.levelData.mapWidth >= 1800) {
      const extraRoadX = mapWidth * 0.7;
      graphics.fillStyle(shoulderColor, 1);
      graphics.fillRect(extraRoadX - 96, 0, 192, mapHeight);
      graphics.fillStyle(COLORS.ROAD, 1);
      graphics.fillRect(extraRoadX - 78, 0, 156, mapHeight);

      for (let y = 0; y < mapHeight; y += 84) {
        graphics.strokeLineShape(new Phaser.Geom.Line(extraRoadX, y, extraRoadX, y + 42));
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
    pickupGraphics.fillStyle(COLORS.PICKUP_ZONE, 0.24);
    pickupGraphics.fillRect(pickupZone.x, pickupZone.y, pickupZone.width, pickupZone.height);
    pickupGraphics.lineStyle(3, COLORS.PICKUP_ZONE, 0.9);
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
        color: '#d8f2de',
        stroke: '#000000',
        strokeThickness: 3,
        fontStyle: 'bold'
      }
    ).setOrigin(0.5).setDepth(2);
    
    // Delivery zone (red)
    const deliveryGraphics = this.add.graphics();
    deliveryGraphics.fillStyle(COLORS.DELIVERY_ZONE, 0.24);
    deliveryGraphics.fillRect(deliveryZone.x, deliveryZone.y, deliveryZone.width, deliveryZone.height);
    deliveryGraphics.lineStyle(3, COLORS.DELIVERY_ZONE, 0.9);
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
        color: '#f6d7d7',
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

  createBuildings() {
    // Create buildings around the map edges and between roads
    const mapWidth = this.levelData.mapWidth;
    const mapHeight = this.levelData.mapHeight;
    
    const buildingTypes = ['house', 'shop', 'apartment', 'warehouse'];
    const buildingCount = Math.floor(mapWidth / 150); // Scale with map size
    
    for (let i = 0; i < buildingCount; i++) {
      const type = Phaser.Utils.Array.GetRandom(buildingTypes);
      const width = Phaser.Math.Between(60, 100);
      const height = Phaser.Math.Between(70, 120);
      
      // Place buildings in the "off-road" areas
      // Avoid center roads and zones
      let x, y;
      let attempts = 0;
      let validPlacement = false;
      do {
        x = Phaser.Math.Between(100, mapWidth - 100);
        y = Phaser.Math.Between(100, mapHeight - 100);
        attempts++;
        
        // Consider placement valid if not near road or we've tried many times
        validPlacement = !this.isNearRoad(x, y, mapWidth, mapHeight) || attempts >= 20;
      } while (!validPlacement && attempts < 20);
      
      // Only place building if we found a valid spot and it doesn't overlap zones
      if (validPlacement && !this.overlapsZone(x, y, width, height)) {
        new Building(this, x, y, width, height, type);
      }
    }
  }
  
  createTrafficVehicles() {
    this.trafficVehicles = this.physics.add.group();
    
    const mapWidth = this.levelData.mapWidth;
    const mapHeight = this.levelData.mapHeight;
    
    // Calculate road positions
    const horizontalRoadY = mapHeight * 0.52;
    const verticalRoadX = mapWidth * 0.32;
    const extraRoadX = mapWidth >= 1800 ? mapWidth * 0.7 : null;
    
    // Add vehicles on horizontal road
    const horizontalCount = Math.floor(mapWidth / 300);
    for (let i = 0; i < horizontalCount; i++) {
      const x = (i + 0.5) * (mapWidth / horizontalCount);
      const type = Phaser.Utils.Array.GetRandom(['car', 'sedan', 'van', 'bus']);
      const vehicle = new TrafficVehicle(this, x, horizontalRoadY, type, 'horizontal');
      this.trafficVehicles.add(vehicle);
    }
    
    // Add vehicles on vertical road
    const verticalCount = Math.floor(mapHeight / 250);
    for (let i = 0; i < verticalCount; i++) {
      const y = (i + 0.5) * (mapHeight / verticalCount);
      const type = Phaser.Utils.Array.GetRandom(['car', 'sedan', 'van']);
      const vehicle = new TrafficVehicle(this, verticalRoadX, y, type, 'vertical');
      this.trafficVehicles.add(vehicle);
    }
    
    // Add vehicles on extra road if it exists
    if (extraRoadX) {
      const extraCount = Math.floor(mapHeight / 300);
      for (let i = 0; i < extraCount; i++) {
        const y = (i + 0.5) * (mapHeight / extraCount);
        const type = Phaser.Utils.Array.GetRandom(['car', 'sedan']);
        const vehicle = new TrafficVehicle(this, extraRoadX, y, type, 'vertical');
        this.trafficVehicles.add(vehicle);
      }
    }
  }
  
  isNearRoad(x, y, mapWidth, mapHeight) {
    const horizontalRoadY = mapHeight * 0.52;
    const verticalRoadX = mapWidth * 0.32;
    const roadMargin = 150;
    
    // Check if near horizontal road
    if (Math.abs(y - horizontalRoadY) < roadMargin) {
      return true;
    }
    
    // Check if near vertical road
    if (Math.abs(x - verticalRoadX) < roadMargin) {
      return true;
    }
    
    // Check if near extra road
    if (mapWidth >= 1800) {
      const extraRoadX = mapWidth * 0.7;
      if (Math.abs(x - extraRoadX) < roadMargin) {
        return true;
      }
    }
    
    return false;
  }
  
  overlapsZone(x, y, width, height) {
    const pickupZone = this.levelData.pickupZone;
    const deliveryZone = this.levelData.deliveryZone;
    const margin = 50;
    
    // Check pickup zone
    if (x + width / 2 + margin > pickupZone.x - margin &&
        x - width / 2 - margin < pickupZone.x + pickupZone.width + margin &&
        y + height / 2 + margin > pickupZone.y - margin &&
        y - height / 2 - margin < pickupZone.y + pickupZone.height + margin) {
      return true;
    }
    
    // Check delivery zone
    if (x + width / 2 + margin > deliveryZone.x - margin &&
        x - width / 2 - margin < deliveryZone.x + deliveryZone.width + margin &&
        y + height / 2 + margin > deliveryZone.y - margin &&
        y - height / 2 - margin < deliveryZone.y + deliveryZone.height + margin) {
      return true;
    }
    
    return false;
  }

  setupCollisions() {
    // Truck collision with obstacles
    this.physics.add.collider(this.truck, this.obstaclesGroup, this.onTruckCollision, this.canTruckHitObstacles, this);
    
    // Truck collision with traffic vehicles (Carmageddon style!)
    this.physics.add.overlap(this.truck, this.trafficVehicles, this.onTrafficCollision, null, this);
    
    // Trailer collision with obstacles (optional)
    if (this.trailer) {
      this.physics.add.collider(this.trailer, this.obstaclesGroup);
      this.physics.add.overlap(this.trailer, this.trafficVehicles, this.onTrafficCollision, null, this);
    }
  }


  canTruckHitObstacles() {
    return !this.truck.isJumping;
  }

  onTrafficCollision(truck, vehicle) {
    if (vehicle.isCrushed) return;
    
    const truckSpeed = Math.abs(this.truck.getSpeed());
    
    // Carmageddon-style vehicle carnage!
    if (truckSpeed > 100) {
      vehicle.crush();
      
      // Create explosion particles
      this.createCollisionParticles(vehicle.x, vehicle.y);
      
      // Camera shake
      this.cameraSystem.shake(200, 0.01);
      
      // Play collision sound
      this.audioSystem.playCollision();
      
      // Add points for crushing traffic
      if (this.missionSystem) {
        this.missionSystem.addTrafficBonus(50);
      }
    } else {
      // Light bump - just push the vehicles apart
      const angle = Phaser.Math.Angle.Between(truck.x, truck.y, vehicle.x, vehicle.y);
      const pushForce = 100;
      vehicle.body.setVelocity(
        Math.cos(angle) * pushForce,
        Math.sin(angle) * pushForce
      );
    }
  }

  createPedestrians() {
    const palette = [0xff5cb8, 0x5ad06a, 0x55a7ff];
    const count = Math.min(18, Math.max(9, Math.floor(this.levelData.mapWidth / 210)));

    this.pedestrians = this.physics.add.group();

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(120, this.levelData.mapWidth - 120);
      const y = Phaser.Math.Between(120, this.levelData.mapHeight - 120);
      const pedestrian = new Pedestrian(this, x, y, {
        wheelchair: i % 5 === 0,
        hairColor: palette[i % palette.length],
        kind: i % 2 === 0 ? "flag" : (i % 5 === 0 ? "wheelchair" : "pedestrian")
      });
      this.pedestrians.add(pedestrian);
    }

    this.physics.add.collider(this.pedestrians, this.obstaclesGroup);

    this.physics.add.overlap(this.truck, this.pedestrians, (_vehicle, pedestrian) => {
      const speed = Math.abs(this.truck.getSpeed());
      if (!pedestrian.isCrushed && speed > 120 && !this.truck.isJumping) {
        pedestrian.isCrushed = true;
        this.paintRedTrail(pedestrian.x, pedestrian.y);
        this.spawnCrushChunks(pedestrian.x, pedestrian.y);
        this.truck.addBlood(0.26);
        this.missionSystem.registerCrush(pedestrian.kind);
        pedestrian.destroy();
      } else {
        pedestrian.pickNewDirection(this.truck.x, this.truck.y);
        this.createAlertParticles(pedestrian.x, pedestrian.y);
      }
    });

    if (this.trailer) {
      this.physics.add.overlap(this.trailer, this.pedestrians, (_trailer, pedestrian) => {
        const speed = Math.abs(this.truck.getSpeed());
        if (!pedestrian.isCrushed && speed > 115 && !this.truck.isJumping) {
          pedestrian.isCrushed = true;
          this.paintRedTrail(pedestrian.x, pedestrian.y);
          this.spawnCrushChunks(pedestrian.x, pedestrian.y);
          this.truck.addBlood(0.2);
          this.missionSystem.registerCrush(pedestrian.kind);
          pedestrian.destroy();
        } else {
          pedestrian.pickNewDirection(this.trailer.x, this.trailer.y);
          this.createAlertParticles(pedestrian.x, pedestrian.y);
        }
      });
    }
  }

  createAlertParticles(x, y) {
    const particles = this.add.particles(x, y, 'pixel', {
      speed: { min: 40, max: 90 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.2, end: 0 },
      lifespan: 380,
      quantity: 10,
      tint: 0xf2cf5b
    });

    this.time.delayedCall(420, () => particles.destroy());
  }

  setupEvents() {
    // Mission events
    this.events.on('cargoPickedUp', () => {
      this.cameraSystem.flash(100, 0x00ff00); // Reduced from 200ms to 100ms
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
      tint: 0x82c08b,
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
      tint: 0xc97b6d,
      blendMode: 'ADD'
    });
    particles.setDepth(50);
    
    this.time.delayedCall(500, () => {
      particles.destroy();
    });
  }

  createSquirrels() {
    const squirrelCount = Math.min(16, Math.max(8, Math.floor(this.levelData.mapWidth / 230)));
    this.squirrels = this.physics.add.group();

    for (let i = 0; i < squirrelCount; i++) {
      const x = Phaser.Math.Between(120, this.levelData.mapWidth - 120);
      const y = Phaser.Math.Between(120, this.levelData.mapHeight - 120);
      const squirrel = new Squirrel(this, x, y);
      this.squirrels.add(squirrel);
    }

    this.physics.add.collider(this.squirrels, this.obstaclesGroup);

    this.physics.add.overlap(this.truck, this.squirrels, (_truck, squirrel) => {
      const speed = Math.abs(this.truck.getSpeed());
      if (!squirrel.isCrushed && speed > 140 && !this.truck.isJumping) {
        squirrel.isCrushed = true;
        this.paintRedTrail(squirrel.x, squirrel.y);
        this.spawnCrushChunks(squirrel.x, squirrel.y);
        this.truck.addBlood(0.1);
        this.missionSystem.registerCrush('squirrel');
        squirrel.destroy();
      } else {
        squirrel.pickNewDirection(this.truck.x, this.truck.y);
      }
    });

    if (this.trailer) {
      this.physics.add.overlap(this.trailer, this.squirrels, (_trailer, squirrel) => {
        const speed = Math.abs(this.truck.getSpeed());
        if (!squirrel.isCrushed && speed > 130 && !this.truck.isJumping) {
          squirrel.isCrushed = true;
          this.paintRedTrail(squirrel.x, squirrel.y);
          this.spawnCrushChunks(squirrel.x, squirrel.y);
          this.truck.addBlood(0.08);
          this.missionSystem.registerCrush('squirrel');
          squirrel.destroy();
        } else {
          squirrel.pickNewDirection(this.trailer.x, this.trailer.y);
        }
      });
    }
  }

  spawnCrushChunks(x, y) {
    if (!this.crushChunks) {
      this.crushChunks = [];
    }

    for (let i = 0; i < 6; i++) {
      const chunk = this.add.rectangle(
        x + Phaser.Math.Between(-10, 10),
        y + Phaser.Math.Between(-10, 10),
        Phaser.Math.Between(3, 7),
        Phaser.Math.Between(2, 6),
        0x7f1414,
        0.8
      ).setDepth(2);

      this.crushChunks.push(chunk);
      if (this.crushChunks.length > 280) {
        const old = this.crushChunks.shift();
        old.destroy();
      }
    }
  }

  paintRedTrail(x, y) {
    if (!this.bloodTrailGraphics) return;

    this.bloodTrailGraphics.lineStyle(6, 0xa01717, 0.82);
    const angle = this.truck.rotation + Phaser.Math.FloatBetween(-0.18, 0.18);
    const len = Phaser.Math.Between(72, 136);
    this.bloodTrailGraphics.strokeLineShape(
      new Phaser.Geom.Line(x, y, x - Math.cos(angle) * len, y - Math.sin(angle) * len)
    );
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

    // Update wildlife
    if (this.squirrels) {
      this.squirrels.children.iterate((squirrel) => {
        if (squirrel) squirrel.update(delta);
      });
    }

    if (this.pedestrians) {
      this.pedestrians.children.iterate((pedestrian) => {
        if (pedestrian) pedestrian.update(delta);
      });
    }
    
    // Update traffic vehicles
    if (this.trafficVehicles) {
      const mapWidth = this.levelData.mapWidth;
      const mapHeight = this.levelData.mapHeight;
      this.trafficVehicles.children.iterate((vehicle) => {
        if (vehicle) vehicle.update(mapWidth, mapHeight);
      });
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
    if (this.squirrels) {
      this.squirrels.clear(true, true);
      this.squirrels = null;
    }
    if (this.pedestrians) {
      this.pedestrians.clear(true, true);
      this.pedestrians = null;
    }
    this.events.off('cargoPickedUp');
    this.events.off('collision');
    this.events.off('missionEnd');
    if (this.bloodTrailGraphics) {
      this.bloodTrailGraphics.destroy();
      this.bloodTrailGraphics = null;
    }
    if (this.crushChunks) {
      this.crushChunks.forEach((chunk) => chunk.destroy());
      this.crushChunks = null;
    }
  }
}
