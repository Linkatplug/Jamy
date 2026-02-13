import Phaser from 'phaser';
import {
  TRUCK_ACCELERATION,
  TRUCK_MAX_SPEED,
  TRUCK_REVERSE_SPEED,
  TRUCK_FRICTION,
  TRUCK_TURN_SPEED,
  TRUCK_MIN_TURN_SPEED
} from '../utils/constants.js';
import { degToRad } from '../utils/math.js';

/**
 * Truck - Main vehicle controlled by player
 */
export default class Truck extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'truck');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setDrag(100);

    this.speed = 0;
    this.turnAngle = 0;
    this.spawnX = x;
    this.spawnY = y;
    this.spawnRotation = this.rotation;

    this.isJumping = false;
    this.jumpTimer = 0;
    this.jumpCooldown = 0;

    this.dirtLevel = 0;
    this.bloodLevel = 0;

    this.setDepth(10);
  }

  handleInput(input, delta) {
    const deltaSeconds = delta / 1000;

    if (input.jump) {
      this.startJump();
    }

    if (input.forward) {
      this.speed = Math.min(this.speed + TRUCK_ACCELERATION * deltaSeconds, TRUCK_MAX_SPEED);
    } else if (input.backward) {
      if (this.speed > 0) {
        this.speed = Math.max(this.speed - TRUCK_ACCELERATION * 1.5 * deltaSeconds, 0);
      } else {
        this.speed = Math.max(this.speed - TRUCK_ACCELERATION * deltaSeconds, TRUCK_REVERSE_SPEED);
      }
    } else {
      this.speed *= TRUCK_FRICTION;
      if (Math.abs(this.speed) < 5) {
        this.speed = 0;
      }
    }

    if (input.handbrake) {
      this.speed *= 0.85;
    }

    const speedFactor = Math.abs(this.speed) / TRUCK_MAX_SPEED;
    if (speedFactor > TRUCK_MIN_TURN_SPEED) {
      if (input.left) {
        this.turnAngle = -TRUCK_TURN_SPEED * speedFactor;
      } else if (input.right) {
        this.turnAngle = TRUCK_TURN_SPEED * speedFactor;
      } else {
        this.turnAngle = 0;
      }

      const rotationDelta = degToRad(this.turnAngle * deltaSeconds);
      if (this.speed < 0) {
        this.rotation -= rotationDelta;
      } else {
        this.rotation += rotationDelta;
      }
    }

    const velocityX = Math.cos(this.rotation) * this.speed;
    const velocityY = Math.sin(this.rotation) * this.speed;
    this.setVelocity(velocityX, velocityY);

    this.updateJump(deltaSeconds);
    this.updateDirt(deltaSeconds);
    this.updateAppearance();
  }

  startJump() {
    if (this.isJumping || this.jumpCooldown > 0) return;

    this.isJumping = true;
    this.jumpTimer = 0.9;
    this.jumpCooldown = 1.35;

    this.scene.tweens.add({
      targets: this,
      scaleX: 1.38,
      scaleY: 1.38,
      duration: 160,
      yoyo: true,
      ease: 'Sine.easeOut'
    });
  }

  updateJump(deltaSeconds) {
    if (this.jumpCooldown > 0) {
      this.jumpCooldown = Math.max(0, this.jumpCooldown - deltaSeconds);
    }

    if (this.isJumping) {
      this.jumpTimer -= deltaSeconds;
      this.setAlpha(0.72);
      this.setDepth(14);
      if (this.jumpTimer <= 0) {
        this.isJumping = false;
        this.setAlpha(1);
        this.setDepth(10);
      }
    }
  }

  updateDirt(deltaSeconds) {
    const movementGain = Math.min(1, Math.abs(this.speed) / TRUCK_MAX_SPEED) * 0.06 * deltaSeconds;
    this.dirtLevel = Math.min(1, this.dirtLevel + movementGain);
    this.bloodLevel = Math.max(0, this.bloodLevel - 0.008 * deltaSeconds);
  }

  updateAppearance() {
    const dirt = this.dirtLevel;
    const blood = this.bloodLevel;

    const baseR = 255 * (1 - dirt) + 132 * dirt;
    const baseG = 255 * (1 - dirt) + 110 * dirt;
    const baseB = 255 * (1 - dirt) + 86 * dirt;

    const r = Math.floor(Math.min(255, baseR + 70 * blood));
    const g = Math.floor(Math.max(0, baseG - 95 * blood));
    const b = Math.floor(Math.max(0, baseB - 95 * blood));

    this.setTint((r << 16) | (g << 8) | b);
  }

  addDirt(amount = 0.12) {
    this.dirtLevel = Math.min(1, this.dirtLevel + amount);
  }

  addBlood(amount = 0.2) {
    this.bloodLevel = Math.min(1, this.bloodLevel + amount);
  }

  resetPosition() {
    this.setPosition(this.spawnX, this.spawnY);
    this.setRotation(this.spawnRotation);
    this.speed = 0;
    this.setVelocity(0, 0);
    this.setAlpha(1);
    this.setScale(1);
    this.setDepth(10);
    this.isJumping = false;
    this.jumpTimer = 0;
  }

  handleCollision() {
    this.speed *= 0.3;
    this.setVelocity(this.body.velocity.x * 0.3, this.body.velocity.y * 0.3);
    this.addDirt(0.14);
  }

  getSpeed() {
    return this.speed;
  }

  getPosition() {
    return { x: this.x, y: this.y, rotation: this.rotation };
  }
}
