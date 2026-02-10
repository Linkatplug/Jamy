import Phaser from 'phaser';

/**
 * MenuScene - Main menu with start button
 */
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x228B22);
    
    // Title
    this.add.text(width / 2, height / 2 - 100, 'JAMY', {
      fontSize: '72px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    this.add.text(width / 2, height / 2 - 40, 'Truck Driving Game', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Start button
    const startButton = this.add.text(width / 2, height / 2 + 60, 'START', {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#006400',
      padding: { x: 40, y: 15 },
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive();
    
    // Button hover effects
    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#008000' });
    });
    
    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#006400' });
    });
    
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
    
    // Controls instructions
    const controlsY = height / 2 + 140;
    const lineHeight = 25;
    
    this.add.text(width / 2, controlsY, 'CONTROLS', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const controls = [
      'W/Z: Forward',
      'S: Brake/Reverse',
      'A/Q: Turn Left',
      'D: Turn Right',
      'R: Reset Position',
      'ESC: Pause'
    ];
    
    controls.forEach((text, index) => {
      this.add.text(width / 2, controlsY + 30 + (index * lineHeight), text, {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#cccccc'
      }).setOrigin(0.5);
    });
    
    // Mission objective
    this.add.text(width / 2, height - 60, 'Mission: Pick up cargo and deliver it before time runs out!', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    // Keyboard shortcut to start
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
