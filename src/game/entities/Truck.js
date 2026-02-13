import Phaser from 'phaser';
import { 
  TRUCK_ACCELERATION, 
  TRUCK_MAX_SPEED, 
  TRUCK_REVERSE_SPEED,
  TRUCK_FRICTION,
  TRUCK_TURN_SPEED,
  TRUCK_MIN_TURN_SPEED
} from '../utils/constants.js';
import { clamp, degToRad } from '../utils/math.js';

/**
 * Truck - Main vehicle controlled by player
 */
export default class Truck extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'truck');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Physics properties
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setDrag(100);
    
    // Custom properties
    this.speed = 0;
    this.turnAngle = 0;
    this.spawnX = x;
    this.spawnY = y;
    this.spawnRotation = this.rotation;
    
    // Make sure truck is on top
    this.setDepth(10);
  }

  handleInput(input, delta) {
    const deltaSeconds = delta / 1000;
    
    // Acceleration/Braking
    if (input.forward) {
      this.speed = Math.min(this.speed + TRUCK_ACCELERATION * deltaSeconds, TRUCK_MAX_SPEED);
    } else if (input.backward) {
      if (this.speed > 0) {
        // Braking
        this.speed = Math.max(this.speed - TRUCK_ACCELERATION * 1.5 * deltaSeconds, 0);
      } else {
        // Reversing
        this.speed = Math.max(this.speed - TRUCK_ACCELERATION * deltaSeconds, TRUCK_REVERSE_SPEED);
      }
    } else {
      // Friction
      this.speed *= TRUCK_FRICTION;
      if (Math.abs(this.speed) < 5) {
        this.speed = 0;
      }
    }
    
    // Handbrake
    if (input.handbrake) {
      this.speed *= 0.9;
    }
    
    // Turning (only works when moving)
    const speedFactor = Math.abs(this.speed) / TRUCK_MAX_SPEED;
    if (speedFactor > TRUCK_MIN_TURN_SPEED) {
      if (input.left) {
        this.turnAngle = -TRUCK_TURN_SPEED * speedFactor;
      } else if (input.right) {
        this.turnAngle = TRUCK_TURN_SPEED * speedFactor;
      } else {
        this.turnAngle = 0;
      }
      
      // Apply rotation based on turn angle and direction
      const rotationDelta = degToRad(this.turnAngle * deltaSeconds);
      if (this.speed < 0) {
        // Reverse turning direction when going backwards
        this.rotation -= rotationDelta;
      } else {
        this.rotation += rotationDelta;
      }
    }
    
    // Apply velocity
    const velocityX = Math.cos(this.rotation) * this.speed;
    const velocityY = Math.sin(this.rotation) * this.speed;
    this.setVelocity(velocityX, velocityY);
  }

  resetPosition() {
    this.setPosition(this.spawnX, this.spawnY);
    this.setRotation(this.spawnRotation);
    this.speed = 0;
    this.setVelocity(0, 0);
  }

  handleCollision() {
    // Push back and slow down on collision
    this.speed *= 0.3;
    this.setVelocity(this.body.velocity.x * 0.3, this.body.velocity.y * 0.3);
  }

  getSpeed() {
    return this.speed;
  }

  getPosition() {
    return { x: this.x, y: this.y, rotation: this.rotation };
  }
}
