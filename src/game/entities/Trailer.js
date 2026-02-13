import Phaser from 'phaser';
import { TRAILER_FOLLOW_SMOOTHNESS, TRAILER_MAX_ANGLE } from '../utils/constants.js';
import { lerp, angleDifference, degToRad, normalizeAngle } from '../utils/math.js';

/**
 * Trailer - Follows truck with stable hitch alignment
 */
export default class Trailer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, truck) {
    super(scene, truck.x, truck.y, 'trailer');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.truck = truck;
    this.hitchOffset = 16;
    this.connectionDistance = 30;

    this.setCollideWorldBounds(true);
    this.setDepth(9);

    // Most trailer sprites are drawn vertically, compensate once.
    this.textureAngleOffset = -Math.PI / 2;

    this.updatePosition(16);
  }

  updatePosition(delta) {
    if (!this.truck) return;

    const deltaSeconds = Math.max(delta / 1000, 0.016);
    const smoothness = Math.min(TRAILER_FOLLOW_SMOOTHNESS + deltaSeconds * 0.45, 0.2);

    // Hitch point right behind truck
    const hitchX = this.truck.x - Math.cos(this.truck.rotation) * this.hitchOffset;
    const hitchY = this.truck.y - Math.sin(this.truck.rotation) * this.hitchOffset;

    // Keep trailer center behind hitch along truck direction to avoid detaching
    const targetX = hitchX - Math.cos(this.truck.rotation) * this.connectionDistance;
    const targetY = hitchY - Math.sin(this.truck.rotation) * this.connectionDistance;

    this.x = lerp(this.x, targetX, smoothness);
    this.y = lerp(this.y, targetY, smoothness);

    // Trailer nose should face hitch point
    const hitchAngle = Math.atan2(hitchY - this.y, hitchX - this.x);

    // Clamp articulation angle vs truck
    let articulation = angleDifference(this.truck.rotation * 180 / Math.PI, hitchAngle * 180 / Math.PI);
    articulation = Math.max(-TRAILER_MAX_ANGLE, Math.min(TRAILER_MAX_ANGLE, articulation));

    const desiredAngle = this.truck.rotation + degToRad(articulation);
    this.rotation = lerp(this.rotation, desiredAngle + this.textureAngleOffset, smoothness * 1.5);

    const rotDeg = normalizeAngle(this.rotation * 180 / Math.PI);
    this.rotation = rotDeg * Math.PI / 180;
  }

  reset(x, y, rotation) {
    this.setPosition(x, y);
    this.setRotation(rotation + this.textureAngleOffset);
  }
}
