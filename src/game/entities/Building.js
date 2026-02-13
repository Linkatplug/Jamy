import Phaser from 'phaser';

/**
 * Building - Decorative building structures for the map
 * Includes houses, shops, and other urban structures
 */
export default class Building extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, type = 'house') {
    super(scene, x, y);
    
    this.buildingType = type;
    this.width = width;
    this.height = height;
    
    scene.add.existing(this);
    
    // Draw building based on type
    this.drawBuilding();
    
    this.setDepth(4);
  }
  
  drawBuilding() {
    const graphics = this.scene.add.graphics();
    
    switch(this.buildingType) {
      case 'house':
        this.drawHouse(graphics);
        break;
      case 'shop':
        this.drawShop(graphics);
        break;
      case 'apartment':
        this.drawApartment(graphics);
        break;
      case 'warehouse':
        this.drawWarehouse(graphics);
        break;
      default:
        this.drawHouse(graphics);
    }
    
    // Generate texture and apply it (use shared key to reduce memory usage)
    const textureKey = `building_${this.buildingType}_${this.width}x${this.height}`;
    
    // Only generate if texture doesn't exist
    if (!this.scene.textures.exists(textureKey)) {
      graphics.generateTexture(textureKey, this.width, this.height);
    }
    graphics.destroy();
    
    const sprite = this.scene.add.sprite(0, 0, textureKey);
    sprite.setOrigin(0.5);
    this.add(sprite);
  }
  
  drawHouse(graphics) {
    // Main building body (walls)
    const wallColors = [0x8b7355, 0xa0826d, 0xc4a57b, 0x9d8b7c];
    const wallColor = Phaser.Utils.Array.GetRandom(wallColors);
    
    graphics.fillStyle(wallColor, 1);
    graphics.fillRect(-this.width / 2, -this.height / 2 + 15, this.width, this.height - 15);
    
    // Roof (triangular)
    const roofColors = [0x8b4513, 0xa0522d, 0xb8860b, 0x654321];
    const roofColor = Phaser.Utils.Array.GetRandom(roofColors);
    
    graphics.fillStyle(roofColor, 1);
    graphics.fillTriangle(
      -this.width / 2 - 5, -this.height / 2 + 15,
      this.width / 2 + 5, -this.height / 2 + 15,
      0, -this.height / 2
    );
    
    // Windows
    graphics.fillStyle(0x4a6b8a, 1);
    const windowSize = Math.min(this.width, this.height) * 0.15;
    const windowSpacing = this.width * 0.3;
    
    // Two windows
    graphics.fillRect(-windowSpacing / 2 - windowSize / 2, -5, windowSize, windowSize);
    graphics.fillRect(windowSpacing / 2 - windowSize / 2, -5, windowSize, windowSize);
    
    // Door
    graphics.fillStyle(0x654321, 1);
    const doorWidth = this.width * 0.25;
    const doorHeight = this.height * 0.35;
    graphics.fillRect(-doorWidth / 2, this.height / 2 - doorHeight, doorWidth, doorHeight);
    
    // Outlines
    graphics.lineStyle(2, 0x000000, 1);
    graphics.strokeRect(-this.width / 2, -this.height / 2 + 15, this.width, this.height - 15);
  }
  
  drawShop(graphics) {
    // Shop body
    graphics.fillStyle(0xe6c9a8, 1);
    graphics.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    // Awning
    graphics.fillStyle(0xff6b6b, 1);
    graphics.fillRect(-this.width / 2, -this.height / 2, this.width, this.height * 0.15);
    
    // Large shop window
    graphics.fillStyle(0x87ceeb, 1);
    const windowWidth = this.width * 0.7;
    const windowHeight = this.height * 0.4;
    graphics.fillRect(-windowWidth / 2, -windowHeight / 2, windowWidth, windowHeight);
    
    // Door
    graphics.fillStyle(0x654321, 1);
    const doorWidth = this.width * 0.2;
    graphics.fillRect(-doorWidth / 2, this.height / 2 - this.height * 0.4, doorWidth, this.height * 0.4);
    
    // Outlines
    graphics.lineStyle(2, 0x000000, 1);
    graphics.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
  
  drawApartment(graphics) {
    // Taller building
    graphics.fillStyle(0x9b9b9b, 1);
    graphics.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    // Multiple rows of windows
    graphics.fillStyle(0xffeb99, 1);
    const windowSize = Math.min(this.width, this.height) * 0.12;
    const rows = Math.floor(this.height / (windowSize * 1.8));
    const cols = Math.floor(this.width / (windowSize * 1.5));
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const wx = -this.width / 2 + (col + 0.5) * (this.width / cols);
        const wy = -this.height / 2 + (row + 0.5) * (this.height / rows);
        graphics.fillRect(wx - windowSize / 2, wy - windowSize / 2, windowSize * 0.8, windowSize * 0.8);
      }
    }
    
    // Outlines
    graphics.lineStyle(2, 0x000000, 1);
    graphics.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
  
  drawWarehouse(graphics) {
    // Industrial warehouse
    graphics.fillStyle(0x6e7f80, 1);
    graphics.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    // Corrugated metal texture (horizontal lines)
    graphics.lineStyle(1, 0x556668, 1);
    for (let i = 0; i < this.height; i += 8) {
      graphics.strokeLineShape(
        new Phaser.Geom.Line(-this.width / 2, -this.height / 2 + i, this.width / 2, -this.height / 2 + i)
      );
    }
    
    // Large garage door
    graphics.fillStyle(0x4a5759, 1);
    const doorWidth = this.width * 0.6;
    const doorHeight = this.height * 0.5;
    graphics.fillRect(-doorWidth / 2, this.height / 2 - doorHeight, doorWidth, doorHeight);
    
    // Small windows at top
    graphics.fillStyle(0x333333, 1);
    const windowWidth = this.width * 0.15;
    graphics.fillRect(-this.width * 0.3, -this.height * 0.35, windowWidth, windowWidth * 0.6);
    graphics.fillRect(this.width * 0.15, -this.height * 0.35, windowWidth, windowWidth * 0.6);
    
    // Outlines
    graphics.lineStyle(2, 0x000000, 1);
    graphics.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
}
