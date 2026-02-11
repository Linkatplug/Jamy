import Phaser from 'phaser';
import AudioSystem from '../systems/AudioSystem.js';
import { LEVELS } from '../utils/constants.js';

/**
 * LevelSelectScene - Choose between Level 1 and Level 2
 */
export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Initialize audio
    this.audioSystem = new AudioSystem(this);
    
    // Background
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x1a3a2e);
    this.tweens.add({
      targets: bg,
      fillColor: { from: 0x1a3a2e, to: 0x2a4a3e },
      duration: 3000,
      yoyo: true,
      repeat: -1
    });
    
    // Title
    const title = this.add.text(width / 2, 50, '🗺️ SELECT LEVEL', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.05 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Level 1 button
    const level1Y = height / 2 - 40;
    const level1Button = this.createLevelButton(width / 2, level1Y, 'Level 1', 'LEVEL_1');
    
    // Level 2 button
    const level2Y = height / 2 + 60;
    const level2Button = this.createLevelButton(width / 2, level2Y, 'Level 2', 'LEVEL_2');
    
    // Level 2 might be locked initially
    const level1Complete = localStorage.getItem('jamy_level1_complete') === 'true';
    if (!level1Complete) {
      level2Button.button.setStyle({ backgroundColor: '#444444', color: '#888888' });
      level2Button.button.removeInteractive();
      
      this.add.text(width / 2, level2Y + 50, '🔒 Complete Level 1 to unlock', {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#888888'
      }).setOrigin(0.5);
    }
    
    // Back button
    const backButton = this.add.text(width / 2, height - 50, '← BACK', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#006400',
      padding: { x: 25, y: 10 },
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive();
    
    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#008000' });
      this.audioSystem.playClick();
      this.tweens.add({ targets: backButton, scale: 1.1, duration: 100 });
    });
    
    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#006400' });
      this.tweens.add({ targets: backButton, scale: 1, duration: 100 });
    });
    
    backButton.on('pointerdown', () => {
      this.audioSystem.playPickup();
      this.cameras.main.fade(200, 0, 0, 0);
      this.time.delayedCall(200, () => {
        this.audioSystem.destroy();
        this.scene.start('MenuScene');
      });
    });
    
    // ESC to go back
    this.input.keyboard.once('keydown-ESC', () => {
      this.audioSystem.destroy();
      this.scene.start('MenuScene');
    });
  }

  createLevelButton(x, y, label, levelKey) {
    const level = LEVELS[levelKey];
    
    // Button background
    const buttonBg = this.add.rectangle(x, y, 400, 100, 0x006400, 0.8);
    buttonBg.setStrokeStyle(3, 0xFFD700);
    
    // Level name
    const button = this.add.text(x, y - 20, label, {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive();
    
    // Level details
    const details = this.add.text(x, y + 15, 
      `${level.name} - ${level.difficulty}`, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#cccccc'
    }).setOrigin(0.5);
    
    // Interactive
    const elements = [buttonBg, button, details];
    
    button.on('pointerover', () => {
      buttonBg.setFillStyle(0x008000, 0.9);
      this.audioSystem.playClick();
      this.tweens.add({
        targets: elements,
        scale: 1.05,
        duration: 100
      });
    });
    
    button.on('pointerout', () => {
      buttonBg.setFillStyle(0x006400, 0.8);
      this.tweens.add({
        targets: elements,
        scale: 1,
        duration: 100
      });
    });
    
    button.on('pointerdown', () => {
      this.audioSystem.playPickup();
      this.cameras.main.flash(200, 255, 255, 255);
      this.time.delayedCall(200, () => {
        this.audioSystem.destroy();
        // Pass level data to GameScene
        this.scene.start('GameScene', { levelKey });
      });
    });
    
    return { button, buttonBg, details };
  }
}
