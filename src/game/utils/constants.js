// Game constants

// Screen dimensions (internal resolution - will be upscaled)
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// Truck physics
export const TRUCK_ACCELERATION = 200;
export const TRUCK_MAX_SPEED = 300;
export const TRUCK_REVERSE_SPEED = -150;
export const TRUCK_FRICTION = 0.95;
export const TRUCK_TURN_SPEED = 180; // degrees per second
export const TRUCK_MIN_TURN_SPEED = 0.3; // Minimum speed to turn

// Trailer physics
export const TRAILER_FOLLOW_SMOOTHNESS = 0.1;
export const TRAILER_MAX_ANGLE = 60; // Max angle between truck and trailer

// Collision
export const COLLISION_SLOWDOWN = 0.5;
export const COLLISION_PUSHBACK = 50;

// Mission
export const MISSION_TIME_LIMIT = 120; // seconds
export const POINTS_PER_SECOND = 10;
export const COLLISION_PENALTY = 50;
export const SPEED_BONUS_THRESHOLD = 90; // Complete under 90 seconds for bonus
export const PERFECT_DELIVERY_BONUS = 500; // No collisions bonus

// Mission Types
export const MISSION_TYPES = {
  STANDARD: 'standard', // Basic pickup and delivery
  TIME_TRIAL: 'time_trial', // Complete as fast as possible
  CAREFUL: 'careful', // Minimize collisions
  MULTI_STOP: 'multi_stop', // Multiple pickups/deliveries
  PARKING: 'parking' // Precision parking challenge
};

// Levels
export const LEVELS = {
  LEVEL_1: {
    name: 'Level 1: City Streets',
    difficulty: 'Easy',
    mapWidth: 1600,
    mapHeight: 900,
    pickupZone: { x: 200, y: 200, width: 80, height: 80 },
    deliveryZone: { x: 1200, y: 600, width: 100, height: 100 },
    obstacles: [
      { x: 400, y: 400, w: 80, h: 80 },
      { x: 600, y: 150, w: 60, h: 60 },
      { x: 700, y: 300, w: 40, h: 80 },
      { x: 300, y: 500, w: 80, h: 40 },
      { x: 900, y: 200, w: 50, h: 50 },
      { x: 800, y: 650, w: 60, h: 60 },
      { x: 1100, y: 400, w: 70, h: 50 },
      { x: 1300, y: 250, w: 50, h: 70 },
      { x: 200, y: 700, w: 60, h: 40 },
      { x: 1400, y: 750, w: 80, h: 60 }
    ],
    spawnX: 150,
    spawnY: 150
  },
  LEVEL_2: {
    name: 'Level 2: Industrial Zone',
    difficulty: 'Medium',
    mapWidth: 1800,
    mapHeight: 1000,
    pickupZone: { x: 1500, y: 150, width: 90, height: 90 },
    deliveryZone: { x: 300, y: 800, width: 110, height: 110 },
    obstacles: [
      { x: 500, y: 200, w: 100, h: 60 },
      { x: 700, y: 400, w: 80, h: 80 },
      { x: 900, y: 250, w: 70, h: 100 },
      { x: 1100, y: 500, w: 90, h: 70 },
      { x: 400, y: 600, w: 60, h: 90 },
      { x: 800, y: 700, w: 100, h: 50 },
      { x: 1300, y: 600, w: 80, h: 80 },
      { x: 600, y: 100, w: 70, h: 70 },
      { x: 200, y: 400, w: 60, h: 100 },
      { x: 1000, y: 800, w: 90, h: 60 },
      { x: 1500, y: 450, w: 70, h: 90 },
      { x: 300, y: 200, w: 80, h: 60 },
      { x: 1200, y: 150, w: 60, h: 70 }
    ],
    spawnX: 100,
    spawnY: 100
  },
  LEVEL_3: {
    name: 'Mission 3: Port Terminal',
    difficulty: 'Medium+',
    mapWidth: 2000,
    mapHeight: 1100,
    pickupZone: { x: 250, y: 880, width: 100, height: 100 },
    deliveryZone: { x: 1650, y: 180, width: 120, height: 120 },
    obstacles: [
      { x: 450, y: 760, w: 100, h: 80 },
      { x: 700, y: 860, w: 130, h: 60 },
      { x: 980, y: 710, w: 90, h: 90 },
      { x: 1240, y: 820, w: 120, h: 70 },
      { x: 1470, y: 620, w: 80, h: 130 },
      { x: 300, y: 470, w: 80, h: 110 },
      { x: 640, y: 520, w: 140, h: 70 },
      { x: 920, y: 470, w: 110, h: 60 },
      { x: 1500, y: 400, w: 140, h: 80 },
      { x: 1720, y: 540, w: 70, h: 100 },
      { x: 360, y: 170, w: 90, h: 90 },
      { x: 760, y: 210, w: 110, h: 80 },
      { x: 1150, y: 150, w: 130, h: 70 }
    ],
    spawnX: 180,
    spawnY: 930
  },
  LEVEL_4: {
    name: 'Mission 4: Mountain Road',
    difficulty: 'Hard',
    mapWidth: 2100,
    mapHeight: 1200,
    pickupZone: { x: 1760, y: 930, width: 100, height: 100 },
    deliveryZone: { x: 240, y: 180, width: 120, height: 120 },
    obstacles: [
      { x: 1680, y: 760, w: 110, h: 80 },
      { x: 1400, y: 900, w: 90, h: 120 },
      { x: 1160, y: 760, w: 120, h: 70 },
      { x: 980, y: 930, w: 130, h: 80 },
      { x: 760, y: 760, w: 90, h: 140 },
      { x: 540, y: 920, w: 120, h: 90 },
      { x: 360, y: 720, w: 80, h: 120 },
      { x: 440, y: 500, w: 150, h: 80 },
      { x: 700, y: 360, w: 120, h: 80 },
      { x: 960, y: 500, w: 90, h: 120 },
      { x: 1210, y: 360, w: 120, h: 70 },
      { x: 1460, y: 470, w: 100, h: 90 },
      { x: 1740, y: 350, w: 100, h: 110 },
      { x: 900, y: 170, w: 130, h: 70 }
    ],
    spawnX: 1860,
    spawnY: 980
  },
  LEVEL_5: {
    name: 'Mission 5: Night Logistics',
    difficulty: 'Expert',
    mapWidth: 2300,
    mapHeight: 1300,
    pickupZone: { x: 260, y: 1020, width: 110, height: 110 },
    deliveryZone: { x: 1970, y: 240, width: 130, height: 130 },
    obstacles: [
      { x: 420, y: 860, w: 140, h: 70 },
      { x: 620, y: 1040, w: 100, h: 120 },
      { x: 880, y: 900, w: 130, h: 80 },
      { x: 1110, y: 1090, w: 80, h: 110 },
      { x: 1340, y: 930, w: 140, h: 90 },
      { x: 1570, y: 1080, w: 100, h: 90 },
      { x: 1790, y: 860, w: 120, h: 120 },
      { x: 1980, y: 1030, w: 90, h: 120 },
      { x: 580, y: 640, w: 130, h: 90 },
      { x: 840, y: 530, w: 100, h: 100 },
      { x: 1090, y: 650, w: 120, h: 80 },
      { x: 1370, y: 510, w: 90, h: 120 },
      { x: 1620, y: 630, w: 130, h: 70 },
      { x: 1880, y: 500, w: 90, h: 110 },
      { x: 430, y: 320, w: 110, h: 80 },
      { x: 760, y: 240, w: 130, h: 70 },
      { x: 1160, y: 200, w: 110, h: 90 },
      { x: 1470, y: 180, w: 130, h: 70 }
    ],
    spawnX: 180,
    spawnY: 1100
  }
};

// Zones (Legacy - use LEVELS instead)
export const PICKUP_ZONE = { x: 200, y: 200, width: 80, height: 80 };
export const DELIVERY_ZONE = { x: 1200, y: 600, width: 100, height: 100 };

// Additional mission zones
export const MISSION_ZONES = {
  ZONE_A: { x: 200, y: 200, width: 80, height: 80, color: 0x00ff00 },
  ZONE_B: { x: 1200, y: 600, width: 100, height: 100, color: 0xff0000 },
  ZONE_C: { x: 800, y: 150, width: 90, height: 90, color: 0xffaa00 },
  ZONE_D: { x: 400, y: 700, width: 85, height: 85, color: 0x00aaff }
};

// Map
export const MAP_WIDTH = 1600;
export const MAP_HEIGHT = 900;

// Controls
export const CONTROLS = {
  FORWARD: ['W', 'Z'],
  BACKWARD: ['S'],
  LEFT: ['A', 'Q'],
  RIGHT: ['D'],
  HANDBRAKE: ['SPACE'],
  RESET: ['R'],
  PAUSE: ['ESC']
};

// Colors
export const COLORS = {
  PICKUP_ZONE: 0x6bbf7a,
  DELIVERY_ZONE: 0xbf6b6b,
  ROAD: 0x4e5357,
  GRASS: 0x415b41,
  OBSTACLE: 0x6e5a48,
  LEVEL1_GRASS: 0x415b41,
  LEVEL2_GRASS: 0x4d5e3a
};
