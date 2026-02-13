import Phaser from 'phaser';
import { TRAILER_FOLLOW_SMOOTHNESS, TRAILER_MAX_ANGLE } from '../utils/constants.js';
import { lerp, angleDifference, degToRad, normalizeAngle } from '../utils/math.js';

/**
 * Trailer - Follows truck with realistic pivot mechanics
 */
export default class Trailer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, truck) {
    super(scene, truck.x, truck.y, 'trailer');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.truck = truck;
    this.pivotDistance = 52; // Distance behind truck where trailer connects
    this.hitchOffset = 18; // keeps trailer visually aligned with truck hitch
    
    this.setCollideWorldBounds(true);
    this.setDepth(9); // Behind truck
    
    // Start at truck's initial position
    this.updatePosition(0);
  }

  updatePosition(delta) {
    if (!this.truck) return;

    const deltaSeconds = delta / 1000;

    // Hitch point behind the truck cab
    const hitchX = this.truck.x - Math.cos(this.truck.rotation) * this.hitchOffset;
    const hitchY = this.truck.y - Math.sin(this.truck.rotation) * this.hitchOffset;

    // Trailer center target from hitch point
    const targetX = hitchX - Math.cos(this.rotation) * this.pivotDistance;
    const targetY = hitchY - Math.sin(this.rotation) * this.pivotDistance;

    // Smoothly move trailer to target position
    const smoothness = Math.min(TRAILER_FOLLOW_SMOOTHNESS + deltaSeconds * 0.7, 0.22);
    this.x = lerp(this.x, targetX, smoothness);
    this.y = lerp(this.y, targetY, smoothness);

    // Trailer should face toward the hitch point
    const dx = hitchX - this.x;
    const dy = hitchY - this.y;
    const targetRotation = Math.atan2(dy, dx);

    // Limit articulation angle between truck and trailer
    let angleDiff = angleDifference(this.truck.rotation * 180 / Math.PI, targetRotation * 180 / Math.PI);
    angleDiff = Math.max(-TRAILER_MAX_ANGLE, Math.min(TRAILER_MAX_ANGLE, angleDiff));

    const limitedRotation = this.truck.rotation + degToRad(angleDiff);

    // Smoothly rotate trailer
    this.rotation = lerp(this.rotation, limitedRotation, smoothness * 1.7);

    // Normalize rotation
    const rotDeg = normalizeAngle(this.rotation * 180 / Math.PI);
    this.rotation = rotDeg * Math.PI / 180;
  }

  reset(x, y, rotation) {
    this.setPosition(x, y);
    this.setRotation(rotation);
  }
}
