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
    this.load.image('squirrel', '/assets/sprites/squirrel.png');
    this.load.image('pedestrian', '/assets/sprites/pedestrian.png');
    this.load.image('pedestrian_wheelchair', '/assets/sprites/pedestrian_wheelchair.png');
    
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
    this.add.text(width / 2, height / 2 - 100, 'JAMY Pro Skater\nTruckmagedon', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(width / 2, height / 2 - 50, 'Pro Skater Truckmagedon', {
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
    

    // Check if squirrel texture exists
    if (!this.textures.exists('squirrel')) {
      const graphics = this.add.graphics();

      // Body
      graphics.fillStyle(0x9b6a43, 1);
      graphics.fillEllipse(18, 14, 18, 12);

      // Tail
      graphics.fillStyle(0xb67c4e, 1);
      graphics.fillEllipse(10, 8, 12, 16);
      graphics.fillStyle(0x8c5f3c, 1);
      graphics.fillEllipse(8, 6, 8, 10);

      // Head
      graphics.fillStyle(0xa26e45, 1);
      graphics.fillCircle(25, 10, 5);

      // Ear
      graphics.fillStyle(0x8c5f3c, 1);
      graphics.fillTriangle(24, 4, 27, 2, 26, 6);

      // Eye
      graphics.fillStyle(0x111111, 1);
      graphics.fillCircle(27, 9, 1);

      graphics.generateTexture('squirrel', 32, 24);
      graphics.destroy();
    }


    // Check if pedestrian texture exists
    if (!this.textures.exists('pedestrian')) {
      const graphics = this.add.graphics();

      // Body
      graphics.fillStyle(0x2f4f6f, 1);
      graphics.fillRect(12, 12, 8, 12);

      // Head
      graphics.fillStyle(0xf0c7a1, 1);
      graphics.fillCircle(16, 8, 4);

      // Rainbow flag
      const stripes = [0xff3b30, 0xff9500, 0xffd60a, 0x34c759, 0x007aff, 0xaf52de];
      stripes.forEach((c, i) => {
        graphics.fillStyle(c, 1);
        graphics.fillRect(20, 10 + i, 8, 1);
      });
      graphics.lineStyle(1, 0x222222, 1);
      graphics.strokeLineShape(new Phaser.Geom.Line(20, 8, 20, 18));

      graphics.generateTexture('pedestrian', 32, 32);
      graphics.destroy();
    }

    if (!this.textures.exists('pedestrian_wheelchair')) {
      const graphics = this.add.graphics();

      // Body and head
      graphics.fillStyle(0x444f8a, 1);
      graphics.fillRect(12, 12, 8, 10);
      graphics.fillStyle(0xf0c7a1, 1);
      graphics.fillCircle(16, 8, 4);

      // Wheelchair
      graphics.fillStyle(0x2a2a2a, 1);
      graphics.fillCircle(10, 23, 4);
      graphics.fillCircle(22, 23, 4);
      graphics.lineStyle(2, 0x888888, 1);
      graphics.strokeLineShape(new Phaser.Geom.Line(10, 23, 22, 23));

      // Tiny rainbow pennant
      graphics.fillStyle(0xff3b30, 1); graphics.fillRect(22, 10, 5, 1);
      graphics.fillStyle(0xff9500, 1); graphics.fillRect(22, 11, 5, 1);
      graphics.fillStyle(0xffd60a, 1); graphics.fillRect(22, 12, 5, 1);
      graphics.fillStyle(0x34c759, 1); graphics.fillRect(22, 13, 5, 1);
      graphics.fillStyle(0x007aff, 1); graphics.fillRect(22, 14, 5, 1);
      graphics.fillStyle(0xaf52de, 1); graphics.fillRect(22, 15, 5, 1);

      graphics.generateTexture('pedestrian_wheelchair', 32, 32);
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
