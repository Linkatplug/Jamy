import Phaser from 'phaser';

/**
 * Pedestrian - NPC civilians walking around (evade vehicle on contact)
 */
export default class Pedestrian extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, variant = {}) {
    const texture = variant.wheelchair ? 'pedestrian_wheelchair' : 'pedestrian';
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.variant = variant;
    this.baseSpeed = variant.wheelchair ? Phaser.Math.Between(35, 55) : Phaser.Math.Between(45, 70);
    this.turnTimer = Phaser.Math.Between(900, 2400);

    this.setDepth(8);
    this.setCollideWorldBounds(true);
    this.setBounce(1, 1);

    if (variant.hairColor !== undefined) {
      this.setTint(variant.hairColor);
    }

    this.pickNewDirection();
  }

  pickNewDirection(runFromX = null, runFromY = null) {
    let angle;

    if (runFromX !== null && runFromY !== null) {
      angle = Phaser.Math.Angle.Between(runFromX, runFromY, this.x, this.y) + Phaser.Math.FloatBetween(-0.5, 0.5);
      this.baseSpeed = this.variant.wheelchair ? Phaser.Math.Between(70, 95) : Phaser.Math.Between(85, 120);
    } else {
      angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      this.baseSpeed = this.variant.wheelchair ? Phaser.Math.Between(35, 55) : Phaser.Math.Between(45, 70);
    }

    this.setVelocity(Math.cos(angle) * this.baseSpeed, Math.sin(angle) * this.baseSpeed);
    this.setFlipX(Math.cos(angle) < 0);
    this.turnTimer = Phaser.Math.Between(900, 2400);
  }

  update(delta) {
    this.turnTimer -= delta;
    if (this.turnTimer <= 0) {
      this.pickNewDirection();
    }
  }
}
