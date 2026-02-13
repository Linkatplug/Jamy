import Phaser from 'phaser';

/**
 * Squirrel - Decorative wildlife running around the map
 */
export default class Squirrel extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'squirrel');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.baseSpeed = Phaser.Math.Between(55, 95);
    this.turnTimer = Phaser.Math.Between(700, 1800);

    this.setDepth(8);
    this.setScale(0.8);
    this.setCollideWorldBounds(true);
    this.setBounce(1, 1);

    this.pickNewDirection();
  }

  pickNewDirection(runFromX = null, runFromY = null) {
    let angle;

    if (runFromX !== null && runFromY !== null) {
      angle = Phaser.Math.Angle.Between(runFromX, runFromY, this.x, this.y);
      angle += Phaser.Math.FloatBetween(-0.45, 0.45);
      this.baseSpeed = Phaser.Math.Between(90, 140);
    } else {
      angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      this.baseSpeed = Phaser.Math.Between(55, 95);
    }

    this.setVelocity(Math.cos(angle) * this.baseSpeed, Math.sin(angle) * this.baseSpeed);
    this.setFlipX(Math.cos(angle) < 0);
    this.rotation = angle;
    this.turnTimer = Phaser.Math.Between(800, 2200);
  }

  update(delta) {
    this.turnTimer -= delta;

    if (this.turnTimer <= 0) {
      this.pickNewDirection();
    }

    if (this.body) {
      const speed = this.body.velocity.length();
      if (speed > 5) {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
      }
    }
  }
}
