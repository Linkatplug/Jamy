import Phaser from 'phaser';
import AudioSystem from '../systems/AudioSystem.js';

/**
 * MenuScene - Enhanced main menu with animations and sound
 */
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Initialize audio system
    this.audioSystem = new AudioSystem(this);
    
    // Static, softer background (no flashing)
    this.add.rectangle(width / 2, height / 2, width, height, 0x30453a);
    
    // Title with shadow effect
    const titleShadow = this.add.text(width / 2 + 3, height / 2 - 97, 'JAMY', {
      fontSize: '72px',
      fontFamily: 'Arial',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0.3);
    
    const title = this.add.text(width / 2, height / 2 - 100, 'JAMY', {
      fontSize: '72px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#d6c99a',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Pulsing animation for title
    this.tweens.add({
      targets: [title, titleShadow],
      scale: { from: 1, to: 1.05 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const subtitle = this.add.text(width / 2, height / 2 - 40, '🚚 Professional Truck Simulator', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#e6ddb7',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Animated subtitle
    this.tweens.add({
      targets: subtitle,
      alpha: { from: 0.7, to: 1 },
      duration: 2000,
      yoyo: true,
      repeat: -1
    });
    
    // Enhanced start button with glow effect
    const startButtonGlow = this.add.rectangle(width / 2, height / 2 + 40, 200, 60, 0x6bbf7a, 0.3);
    startButtonGlow.setVisible(false);
    
    const startButton = this.add.text(width / 2, height / 2 + 40, '▶ START', {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#3e5246',
      padding: { x: 40, y: 15 },
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive();
    
    // Leaderboard button
    const leaderboardButton = this.add.text(width / 2, height / 2 + 110, '🏆 LEADERBOARD', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#394b59',
      padding: { x: 30, y: 12 },
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive();
    
    // Button hover effects with sound
    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#4f6758', scale: 1.1 });
      startButtonGlow.setVisible(true);
      this.audioSystem.playClick();
      this.tweens.add({
        targets: startButton,
        scale: 1.1,
        duration: 100
      });
    });
    
    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#3e5246' });
      startButtonGlow.setVisible(false);
      this.tweens.add({
        targets: startButton,
        scale: 1,
        duration: 100
      });
    });
    
    startButton.on('pointerdown', () => {
      this.audioSystem.playPickup();
      this.audioSystem.destroy();
      this.scene.start('LevelSelectScene');
    });
    
    // Leaderboard button interactions
    leaderboardButton.on('pointerover', () => {
      leaderboardButton.setStyle({ backgroundColor: '#4c6172' });
      this.audioSystem.playClick();
      this.tweens.add({
        targets: leaderboardButton,
        scale: 1.1,
        duration: 100
      });
    });
    
    leaderboardButton.on('pointerout', () => {
      leaderboardButton.setStyle({ backgroundColor: '#394b59' });
      this.tweens.add({
        targets: leaderboardButton,
        scale: 1,
        duration: 100
      });
    });
    
    leaderboardButton.on('pointerdown', () => {
      this.audioSystem.playPickup();
      this.cameras.main.fade(200, 0, 0, 0);
      this.time.delayedCall(200, () => {
        this.audioSystem.destroy();
        this.scene.start('LeaderboardScene');
      });
    });
    
    // Idle animation for buttons
    this.tweens.add({
      targets: startButton,
      y: height / 2 + 40 + 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.tweens.add({
      targets: leaderboardButton,
      y: height / 2 + 110 + 5,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 200
    });
    
    // Controls section with better layout
    const controlsY = height / 2 + 180;
    
    const controlsTitle = this.add.text(width / 2, controlsY, '⌨️ CONTROLS', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    const controls = [
      { key: 'W/Z', action: 'Forward' },
      { key: 'S', action: 'Brake/Reverse' },
      { key: 'A/Q', action: 'Turn Left' },
      { key: 'D', action: 'Turn Right' },
      { key: 'R', action: 'Reset' },
      { key: 'ESC', action: 'Pause' }
    ];
    
    controls.forEach((control, index) => {
      const y = controlsY + 30 + (index * 22);
      
      // Key display
      this.add.text(width / 2 - 80, y, control.key, {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#d6c99a',
        fontStyle: 'bold',
        backgroundColor: '#333333',
        padding: { x: 6, y: 2 }
      }).setOrigin(0.5);
      
      // Separator
      this.add.text(width / 2 - 20, y, '→', {
        fontSize: '14px',
        color: '#888888'
      }).setOrigin(0.5);
      
      // Action
      this.add.text(width / 2 + 40, y, control.action, {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#cccccc'
      }).setOrigin(0.5);
    });
    
    // Mission briefing with icon
    const missionText = this.add.text(width / 2, height - 60, 
      '🎯 MISSION: Pick up cargo and deliver before time runs out!', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#e6ddb7',
      stroke: '#000000',
      strokeThickness: 3,
      backgroundColor: '#00000066',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
    
    // Blinking effect for mission text
    this.tweens.add({
      targets: missionText,
      alpha: { from: 0.8, to: 1 },
      duration: 1500,
      yoyo: true,
      repeat: -1
    });
    
    // Version info
    this.add.text(10, height - 10, 'v1.0 - GOTY Edition', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#888888'
    }).setOrigin(0, 1);
    
    // Keyboard shortcut to start
    this.input.keyboard.once('keydown-SPACE', () => {
      this.audioSystem.playPickup();
      this.cameras.main.flash(200);
      this.time.delayedCall(200, () => {
        this.audioSystem.destroy();
        this.scene.start('LevelSelectScene');
      });
    });
  }
}
