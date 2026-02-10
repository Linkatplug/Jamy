import Phaser from 'phaser';

/**
 * EndScene - Shows mission results and score
 */
export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  init(data) {
    this.missionData = data;
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);
    
    // Mission result title
    const success = this.missionData.success;
    const titleText = success ? 'MISSION SUCCESS!' : 'MISSION FAILED';
    const titleColor = success ? '#00ff00' : '#ff0000';
    
    this.add.text(width / 2, height / 2 - 120, titleText, {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: titleColor,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Score
    if (success) {
      this.add.text(width / 2, height / 2 - 40, `Score: ${this.missionData.score}`, {
        fontSize: '36px',
        fontFamily: 'Arial',
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);
    }
    
    // Stats
    const statsY = height / 2 + 20;
    const lineHeight = 30;
    
    const minutes = Math.floor(this.missionData.timeRemaining / 60);
    const seconds = Math.floor(this.missionData.timeRemaining % 60);
    const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const stats = [
      `Time Remaining: ${timeText}`,
      `Collisions: ${this.missionData.collisions}`
    ];
    
    stats.forEach((text, index) => {
      this.add.text(width / 2, statsY + (index * lineHeight), text, {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#ffffff'
      }).setOrigin(0.5);
    });
    
    // Buttons
    const restartButton = this.add.text(width / 2 - 100, height / 2 + 120, 'RESTART', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#006400',
      padding: { x: 30, y: 10 },
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive();
    
    const menuButton = this.add.text(width / 2 + 100, height / 2 + 120, 'MENU', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#006400',
      padding: { x: 30, y: 10 },
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive();
    
    // Button interactions
    restartButton.on('pointerover', () => {
      restartButton.setStyle({ backgroundColor: '#008000' });
    });
    
    restartButton.on('pointerout', () => {
      restartButton.setStyle({ backgroundColor: '#006400' });
    });
    
    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
    
    menuButton.on('pointerover', () => {
      menuButton.setStyle({ backgroundColor: '#008000' });
    });
    
    menuButton.on('pointerout', () => {
      menuButton.setStyle({ backgroundColor: '#006400' });
    });
    
    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
    
    // Keyboard shortcuts
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
    
    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
  }
}
