import Phaser from 'phaser';
import AudioSystem from '../systems/AudioSystem.js';

/**
 * EndScene - Enhanced results screen with detailed stats and bonuses
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
    
    // Initialize audio
    this.audioSystem = new AudioSystem(this);
    
    // Animated background
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);
    
    // Mission result title
    const success = this.missionData.success;
    const titleText = success ? '🏆 MISSION SUCCESS! 🏆' : '❌ MISSION FAILED';
    const titleColor = success ? '#00ff00' : '#ff0000';
    
    const title = this.add.text(width / 2, 50, titleText, {
      fontSize: '42px',
      fontFamily: 'Arial',
      color: titleColor,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Title animation
    if (success) {
      this.tweens.add({
        targets: title,
        scale: { from: 0.8, to: 1.1 },
        duration: 500,
        yoyo: true,
        repeat: 1,
        ease: 'Back.easeOut'
      });
      this.audioSystem.playDeliver();
    }
    
    let yPos = 110;
    
    // Mission name
    if (this.missionData.missionName) {
      this.add.text(width / 2, yPos, this.missionData.missionName, {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#ffaa00',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);
      yPos += 35;
    }
    
    // Score with animation
    if (success) {
      const scoreText = this.add.text(width / 2, yPos, `SCORE: ${this.missionData.score}`, {
        fontSize: '36px',
        fontFamily: 'Arial',
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);
      
      // Animated score counter
      this.tweens.addCounter({
        from: 0,
        to: this.missionData.score,
        duration: 1500,
        onUpdate: (tween) => {
          const value = Math.floor(tween.getValue());
          scoreText.setText(`SCORE: ${value}`);
        }
      });
      
      yPos += 50;
    }
    
    // Stats section
    const statsBox = this.add.rectangle(width / 2, yPos + 50, width - 100, 130, 0x333333, 0.8);
    statsBox.setStrokeStyle(2, success ? 0x00ff00 : 0xff0000);
    
    const statsY = yPos + 10;
    const lineHeight = 25;
    
    // Time stats
    const minutes = Math.floor(this.missionData.timeRemaining / 60);
    const seconds = Math.floor(this.missionData.timeRemaining % 60);
    const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const elapsedMins = Math.floor((this.missionData.elapsedTime || 0) / 60);
    const elapsedSecs = Math.floor((this.missionData.elapsedTime || 0) % 60);
    const elapsedText = `${elapsedMins}:${elapsedSecs.toString().padStart(2, '0')}`;
    
    const stats = [
      { label: '⏱️ Time Remaining:', value: timeText, color: '#00ffff' },
      { label: '🕐 Completed in:', value: elapsedText, color: '#00ffff' },
      { label: '💥 Collisions:', value: this.missionData.collisions, color: '#ff6666' },
    ];
    
    // Perfect delivery indicator
    if (this.missionData.perfectDelivery) {
      stats.push({ label: '✨ Status:', value: 'PERFECT!', color: '#ffd700' });
    }
    
    stats.forEach((stat, index) => {
      this.add.text(width / 2 - 150, statsY + (index * lineHeight), stat.label, {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#ffffff'
      });
      
      this.add.text(width / 2 + 50, statsY + (index * lineHeight), String(stat.value), {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: stat.color,
        fontStyle: 'bold'
      });
    });
    
    yPos += 150;
    
    // Bonuses section
    if (success && this.missionData.bonuses && this.missionData.bonuses.length > 0) {
      this.add.text(width / 2, yPos, '🎁 BONUSES', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#ffd700',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);
      
      yPos += 30;
      
      this.missionData.bonuses.forEach((bonus, index) => {
        const bonusText = this.add.text(width / 2, yPos + (index * 22), 
          `${bonus.name}: +${bonus.value}`, {
          fontSize: '16px',
          fontFamily: 'Arial',
          color: '#00ff88',
          backgroundColor: '#00000066',
          padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setAlpha(0);
        
        // Staggered animation for bonuses
        this.tweens.add({
          targets: bonusText,
          alpha: 1,
          x: width / 2 + 10,
          duration: 300,
          delay: index * 200,
          ease: 'Back.easeOut'
        });
      });
      
      yPos += (this.missionData.bonuses.length * 22) + 20;
    }
    
    // Buttons
    const buttonY = Math.min(yPos + 20, height - 80);
    
    const restartButton = this.add.text(width / 2 - 100, buttonY, '🔄 RESTART', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#006400',
      padding: { x: 25, y: 10 },
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive();
    
    const menuButton = this.add.text(width / 2 + 100, buttonY, '🏠 MENU', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#006400',
      padding: { x: 25, y: 10 },
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive();
    
    // Button interactions with sound
    restartButton.on('pointerover', () => {
      restartButton.setStyle({ backgroundColor: '#008000' });
      this.audioSystem.playClick();
      this.tweens.add({
        targets: restartButton,
        scale: 1.1,
        duration: 100
      });
    });
    
    restartButton.on('pointerout', () => {
      restartButton.setStyle({ backgroundColor: '#006400' });
      this.tweens.add({
        targets: restartButton,
        scale: 1,
        duration: 100
      });
    });
    
    restartButton.on('pointerdown', () => {
      this.audioSystem.playPickup();
      this.cameras.main.fade(200, 0, 0, 0);
      this.time.delayedCall(200, () => {
        this.audioSystem.destroy();
        this.scene.start('GameScene');
      });
    });
    
    menuButton.on('pointerover', () => {
      menuButton.setStyle({ backgroundColor: '#008000' });
      this.audioSystem.playClick();
      this.tweens.add({
        targets: menuButton,
        scale: 1.1,
        duration: 100
      });
    });
    
    menuButton.on('pointerout', () => {
      menuButton.setStyle({ backgroundColor: '#006400' });
      this.tweens.add({
        targets: menuButton,
        scale: 1,
        duration: 100
      });
    });
    
    menuButton.on('pointerdown', () => {
      this.audioSystem.playPickup();
      this.cameras.main.fade(200, 0, 0, 0);
      this.time.delayedCall(200, () => {
        this.audioSystem.destroy();
        this.scene.start('MenuScene');
      });
    });
    
    // Keyboard shortcuts
    this.input.keyboard.once('keydown-SPACE', () => {
      this.audioSystem.destroy();
      this.scene.start('GameScene');
    });
    
    this.input.keyboard.once('keydown-ESC', () => {
      this.audioSystem.destroy();
      this.scene.start('MenuScene');
    });
    
    // Hint text
    this.add.text(width / 2, height - 20, 'SPACE: Restart | ESC: Menu', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#888888'
    }).setOrigin(0.5);
  }
}
