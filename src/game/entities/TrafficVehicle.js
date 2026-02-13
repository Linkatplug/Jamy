import Phaser from 'phaser';

/**
 * TrafficVehicle - AI-controlled vehicles on roads
 * Can be crashed into for Carmageddon-style carnage
 */
export default class TrafficVehicle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'car', direction = 'horizontal') {
    super(scene, x, y, null);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.vehicleType = type;
    this.direction = direction;
    this.speed = Phaser.Math.Between(30, 60);
    this.isCrushed = false;
    
    // Determine dimensions based on type
    this.setDimensions();
    
    // Draw the vehicle
    this.drawVehicle();
    
    // Set physics properties
    this.body.setSize(this.vehicleWidth, this.vehicleHeight);
    this.body.setMass(this.mass);
    this.body.setDrag(10);
    
    // Set initial velocity
    this.setInitialVelocity();
    
    this.setDepth(6);
  }
  
  setDimensions() {
    switch(this.vehicleType) {
      case 'car':
        this.vehicleWidth = 28;
        this.vehicleHeight = 40;
        this.mass = 1;
        break;
      case 'sedan':
        this.vehicleWidth = 30;
        this.vehicleHeight = 48;
        this.mass = 1.2;
        break;
      case 'van':
        this.vehicleWidth = 32;
        this.vehicleHeight = 52;
        this.mass = 1.5;
        break;
      case 'bus':
        this.vehicleWidth = 35;
        this.vehicleHeight = 70;
        this.mass = 3;
        break;
      default:
        this.vehicleWidth = 28;
        this.vehicleHeight = 40;
        this.mass = 1;
    }
    
    // Swap dimensions if moving horizontally
    if (this.direction === 'horizontal') {
      [this.vehicleWidth, this.vehicleHeight] = [this.vehicleHeight, this.vehicleWidth];
    }
  }
  
  drawVehicle() {
    const graphics = this.scene.add.graphics();
    const isVertical = this.direction === 'vertical';
    
    // Vehicle colors based on type
    const carColors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0x5f9df7];
    const bodyColor = Phaser.Utils.Array.GetRandom(carColors);
    
    const width = this.vehicleWidth;
    const height = this.vehicleHeight;
    
    // Vehicle body
    graphics.fillStyle(bodyColor, 1);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 4);
    
    // Windows (darker blue)
    graphics.fillStyle(0x2c3e50, 1);
    
    if (this.vehicleType === 'bus') {
      // Multiple windows for bus
      const windowCount = isVertical ? 4 : 3;
      const windowSpacing = (isVertical ? height : width) / (windowCount + 1);
      for (let i = 1; i <= windowCount; i++) {
        if (isVertical) {
          graphics.fillRect(-width * 0.3, -height / 2 + i * windowSpacing - 6, width * 0.25, 10);
          graphics.fillRect(width * 0.05, -height / 2 + i * windowSpacing - 6, width * 0.25, 10);
        } else {
          graphics.fillRect(-width / 2 + i * windowSpacing - 6, -height * 0.3, 10, height * 0.25);
          graphics.fillRect(-width / 2 + i * windowSpacing - 6, height * 0.05, 10, height * 0.25);
        }
      }
    } else {
      // Regular windshield
      if (isVertical) {
        graphics.fillRect(-width * 0.35, -height * 0.35, width * 0.7, height * 0.15);
      } else {
        graphics.fillRect(-width * 0.35, -height * 0.35, width * 0.15, height * 0.7);
      }
    }
    
    // Lights
    graphics.fillStyle(0xffeb99, 1);
    if (isVertical) {
      graphics.fillRect(-width * 0.3, -height / 2 + 3, width * 0.2, 4);
      graphics.fillRect(width * 0.1, -height / 2 + 3, width * 0.2, 4);
    } else {
      graphics.fillRect(-width / 2 + 3, -height * 0.3, 4, height * 0.2);
      graphics.fillRect(-width / 2 + 3, height * 0.1, 4, height * 0.2);
    }
    
    // Outline
    graphics.lineStyle(2, 0x000000, 1);
    graphics.strokeRoundedRect(-width / 2, -height / 2, width, height, 4);
    
    // Generate texture (use shared key to avoid memory leaks)
    const textureKey = `traffic_${this.vehicleType}_${this.direction}_${width}x${height}`;
    
    // Only generate if texture doesn't exist
    if (!this.scene.textures.exists(textureKey)) {
      graphics.generateTexture(textureKey, width, height);
    }
    graphics.destroy();
    
    this.setTexture(textureKey);
    this.setDisplaySize(width, height);
  }
  
  setInitialVelocity() {
    if (this.direction === 'horizontal') {
      // Randomly go left or right
      const goingRight = Math.random() > 0.5;
      this.body.setVelocityX(goingRight ? this.speed : -this.speed);
      if (!goingRight) {
        this.setFlipX(true);
      }
    } else {
      // Randomly go up or down
      const goingDown = Math.random() > 0.5;
      this.body.setVelocityY(goingDown ? this.speed : -this.speed);
      if (!goingDown) {
        this.setFlipY(true);
      }
    }
  }
  
  update(mapWidth, mapHeight) {
    // Check if vehicle went off screen, respawn on opposite side
    if (this.direction === 'horizontal') {
      if (this.x < -50) {
        this.x = mapWidth + 50;
      } else if (this.x > mapWidth + 50) {
        this.x = -50;
      }
    } else {
      if (this.y < -50) {
        this.y = mapHeight + 50;
      } else if (this.y > mapHeight + 50) {
        this.y = -50;
      }
    }
  }
  
  crush() {
    if (this.isCrushed) return;
    
    this.isCrushed = true;
    
    // Spin and fade out
    this.scene.tweens.add({
      targets: this,
      angle: Phaser.Math.Between(-180, 180),
      alpha: 0,
      scale: 0.5,
      duration: 1000,
      onComplete: () => {
        this.destroy();
      }
    });
    
    // Stop moving
    this.body.setVelocity(0, 0);
  }
}
