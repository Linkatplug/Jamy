import Phaser from 'phaser';
import { TRAILER_FOLLOW_SMOOTHNESS, TRAILER_MAX_ANGLE } from '../utils/constants.js';
import { lerp, angleDifference, degToRad, normalizeAngle } from '../utils/math.js';

/**
 * Trailer - Follows truck with stable hitch alignment and jump flip effect
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

    this.textureAngleOffset = -Math.PI / 2;
    this.flipSpinRemaining = 0;
    this.wasTruckJumping = false;

    this.updatePosition(16);
  }

  updatePosition(delta) {
    if (!this.truck) return;

    const deltaSeconds = Math.max(delta / 1000, 0.016);
    const smoothness = Math.min(TRAILER_FOLLOW_SMOOTHNESS + deltaSeconds * 0.45, 0.2);

    const hitchX = this.truck.x - Math.cos(this.truck.rotation) * this.hitchOffset;
    const hitchY = this.truck.y - Math.sin(this.truck.rotation) * this.hitchOffset;

    const targetX = hitchX - Math.cos(this.truck.rotation) * this.connectionDistance;
    const targetY = hitchY - Math.sin(this.truck.rotation) * this.connectionDistance;

    this.x = lerp(this.x, targetX, smoothness);
    this.y = lerp(this.y, targetY, smoothness);

    const hitchAngle = Math.atan2(hitchY - this.y, hitchX - this.x);

    let articulation = angleDifference(this.truck.rotation * 180 / Math.PI, hitchAngle * 180 / Math.PI);
    articulation = Math.max(-TRAILER_MAX_ANGLE, Math.min(TRAILER_MAX_ANGLE, articulation));

    if (this.truck.isJumping && !this.wasTruckJumping) {
      this.flipSpinRemaining = Math.PI * 2.4;
    }
    this.wasTruckJumping = this.truck.isJumping;

    const desiredAngle = this.truck.rotation + degToRad(articulation);

    if (this.flipSpinRemaining > 0) {
      const spinStep = Math.min(this.flipSpinRemaining, Math.PI * 6 * deltaSeconds);
      this.flipSpinRemaining -= spinStep;
      this.rotation += spinStep;
    }

    this.rotation = lerp(this.rotation, desiredAngle + this.textureAngleOffset, smoothness * 1.35);

    const rotDeg = normalizeAngle(this.rotation * 180 / Math.PI);
    this.rotation = rotDeg * Math.PI / 180;
  }

  reset(x, y, rotation) {
    this.setPosition(x, y);
    this.setRotation(rotation + this.textureAngleOffset);
    this.flipSpinRemaining = 0;
    this.wasTruckJumping = false;
  }
}
