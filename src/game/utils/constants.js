// Game constants

// Screen dimensions (internal resolution - will be upscaled)
export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 360;

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

// Zones
export const PICKUP_ZONE = { x: 200, y: 200, width: 80, height: 80 };
export const DELIVERY_ZONE = { x: 1200, y: 600, width: 100, height: 100 };

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
  PICKUP_ZONE: 0x00ff00,
  DELIVERY_ZONE: 0xff0000,
  ROAD: 0x444444,
  GRASS: 0x228B22,
  OBSTACLE: 0x8B4513
};
