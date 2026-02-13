import Phaser from 'phaser';

/**
 * BootScene - Preloads all game assets and shows loading progress
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.failedAssetKeys = new Set();

    // Create loading bar
    this.createLoadingBar();
    
    // Try to load game assets
    this.load.image('truck', '/assets/sprites/truck.png');
    this.load.image('trailer', '/assets/sprites/trailer.png');
    this.load.image('tiles', '/assets/sprites/tiles.png');
    
    // Handle load errors - create fallback textures
    this.load.on('loaderror', (fileObj) => {
      this.failedAssetKeys.add(fileObj.key);
      console.warn(`Failed to load ${fileObj.key}, will create fallback`);
    });
    
    // Loading progress events
    this.load.on('progress', this.updateLoadingBar, this);
    this.load.on('complete', this.onLoadComplete, this);
  }

  createLoadingBar() {
    const { width, height } = this.cameras.main;
    
    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x222222);
    
    // Title
    this.add.text(width / 2, height / 2 - 100, 'JAMY', {
      fontSize: '64px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(width / 2, height / 2 - 50, 'Truck Driving Game', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#aaaaaa'
    }).setOrigin(0.5);
    
    // Loading bar background
    const barWidth = 400;
    const barHeight = 30;
    this.loadingBarBg = this.add.rectangle(width / 2, height / 2 + 50, barWidth, barHeight, 0x444444);
    
    // Loading bar fill
    this.loadingBarFill = this.add.rectangle(
      width / 2 - barWidth / 2,
      height / 2 + 50,
      0,
      barHeight - 4,
      0x00ff00
    );
    this.loadingBarFill.setOrigin(0, 0.5);
    
    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 + 100, 'Loading... 0%', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  updateLoadingBar(progress) {
    const barWidth = 400;
    this.loadingBarFill.width = (barWidth - 4) * progress;
    this.loadingText.setText(`Loading... ${Math.round(progress * 100)}%`);
  }

  onLoadComplete() {
    // Create fallback textures for any missing assets
    this.createFallbackTextures();
    
    // Small delay before transitioning to menu
    this.time.delayedCall(500, () => {
      this.scene.start('MenuScene');
    });
  }

  createFallbackTextures() {
    // If Phaser registered a broken texture after a decode/load error,
    // remove it so we can recreate a valid fallback texture.
    this.failedAssetKeys.forEach((assetKey) => {
      if (this.textures.exists(assetKey)) {
        this.textures.remove(assetKey);
      }
    });

    // Create pixel texture for particles
    if (!this.textures.exists('pixel')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(0, 0, 4, 4);
      graphics.generateTexture('pixel', 4, 4);
      graphics.destroy();
    }
    
    // Check if truck texture exists, if not create it
    if (!this.textures.exists('truck')) {
      const graphics = this.add.graphics();
      
      // Truck body (red)
      graphics.fillStyle(0xDC143C, 1);
      graphics.fillRect(4, 10, 14, 12);
      
      // Truck cab (blue)
      graphics.fillStyle(0x4169E1, 1);
      graphics.fillRect(18, 8, 10, 16);
      
      // Windshield (light blue)
      graphics.fillStyle(0x87CEEB, 1);
      graphics.fillRect(24, 10, 3, 6);
      
      // Wheels (black)
      graphics.fillStyle(0x000000, 1);
      graphics.fillCircle(8, 24, 3);
      graphics.fillCircle(13, 24, 3);
      graphics.fillCircle(23, 24, 3);
      
      graphics.generateTexture('truck', 32, 32);
      graphics.destroy();
    }
    
    // Check if trailer texture exists
    if (!this.textures.exists('trailer')) {
      const graphics = this.add.graphics();
      
      // Trailer body (gray)
      graphics.fillStyle(0xA9A9A9, 1);
      graphics.fillRect(2, 4, 12, 36);
      
      // Wheels (black)
      graphics.fillStyle(0x000000, 1);
      graphics.fillCircle(5, 42, 3);
      graphics.fillCircle(11, 42, 3);
      
      graphics.generateTexture('trailer', 16, 48);
      graphics.destroy();
    }
    
    // Check if tiles texture exists
    if (!this.textures.exists('tiles')) {
      const graphics = this.add.graphics();
      
      // Simple colored tiles
      graphics.fillStyle(0x228B22, 1);
      graphics.fillRect(0, 0, 32, 32);
      
      graphics.fillStyle(0x444444, 1);
      graphics.fillRect(32, 0, 32, 32);
      
      graphics.fillStyle(0x8B4513, 1);
      graphics.fillRect(64, 0, 32, 32);
      
      graphics.fillStyle(0x1E90FF, 1);
      graphics.fillRect(96, 0, 32, 32);
      
      graphics.generateTexture('tiles', 128, 64);
      graphics.destroy();
    }
  }
}
