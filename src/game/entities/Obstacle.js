import Phaser from 'phaser';

/**
 * Obstacle - Static collidable object on the map
 */
export default class Obstacle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, width = 40, height = 40, color = 0x8B4513) {
    // Create a simple rectangle as obstacle
    super(scene, x, y, null);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Make it immovable
    this.body.setImmovable(true);
    
    // Draw the obstacle
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRect(-width / 2, -height / 2, width, height);
    graphics.lineStyle(2, 0x000000, 1);
    graphics.strokeRect(-width / 2, -height / 2, width, height);
    
    // Generate texture from graphics
    graphics.generateTexture('obstacle_' + x + '_' + y, width, height);
    graphics.destroy();
    
    // Set the texture
    this.setTexture('obstacle_' + x + '_' + y);
    this.setDisplaySize(width, height);
    this.body.setSize(width, height);
    
    this.setDepth(5);
  }
}
