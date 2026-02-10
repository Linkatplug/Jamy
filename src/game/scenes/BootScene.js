import Phaser from 'phaser';

/**
 * BootScene - Preloads all game assets and shows loading progress
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    this.createLoadingBar();
    
    // Load game assets
    this.load.image('truck', '/assets/sprites/truck.png');
    this.load.image('trailer', '/assets/sprites/trailer.png');
    this.load.image('tiles', '/assets/sprites/tiles.png');
    
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
    // Small delay before transitioning to menu
    this.time.delayedCall(500, () => {
      this.scene.start('MenuScene');
    });
  }
}
