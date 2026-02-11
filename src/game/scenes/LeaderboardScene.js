import Phaser from 'phaser';
import LeaderboardSystem from '../systems/LeaderboardSystem.js';
import AudioSystem from '../systems/AudioSystem.js';

/**
 * LeaderboardScene - Displays high scores
 */
export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Initialize systems
    this.leaderboard = new LeaderboardSystem();
    this.audioSystem = new AudioSystem(this);
    
    // Background with gradient
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);
    
    // Title
    const title = this.add.text(width / 2, 40, '🏆 LEADERBOARD 🏆', {
      fontSize: '42px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Pulsing animation
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.05 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Get scores
    const scores = this.leaderboard.getScores();
    
    if (scores.length === 0) {
      // No scores yet
      this.add.text(width / 2, height / 2, 'No scores yet!\nBe the first to set a record!', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#cccccc',
        align: 'center'
      }).setOrigin(0.5);
    } else {
      // Display scores
      this.displayScores(scores, width, height);
    }
    
    // Back button
    const backButton = this.add.text(width / 2, height - 50, '← BACK TO MENU', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#006400',
      padding: { x: 25, y: 10 },
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive();
    
    // Button interactions
    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#008000' });
      this.audioSystem.playClick();
      this.tweens.add({
        targets: backButton,
        scale: 1.1,
        duration: 100
      });
    });
    
    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#006400' });
      this.tweens.add({
        targets: backButton,
        scale: 1,
        duration: 100
      });
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

  displayScores(scores, width, height) {
    const startY = 100;
    const lineHeight = 35;
    
    // Table header
    const headerY = startY;
    this.add.text(width / 2 - 220, headerY, 'RANK', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold'
    });
    
    this.add.text(width / 2 - 140, headerY, 'PLAYER', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold'
    });
    
    this.add.text(width / 2 + 60, headerY, 'SCORE', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold'
    });
    
    this.add.text(width / 2 + 150, headerY, 'MISSION', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold'
    });
    
    // Header line
    const line = this.add.graphics();
    line.lineStyle(2, 0xFFD700, 1);
    line.lineBetween(width / 2 - 240, headerY + 25, width / 2 + 240, headerY + 25);
    
    // Display each score entry
    scores.forEach((entry, index) => {
      const y = startY + 40 + (index * lineHeight);
      const isTopThree = index < 3;
      
      // Medal for top 3
      let medal = '';
      let rankColor = '#ffffff';
      if (index === 0) {
        medal = '🥇';
        rankColor = '#FFD700';
      } else if (index === 1) {
        medal = '🥈';
        rankColor = '#C0C0C0';
      } else if (index === 2) {
        medal = '🥉';
        rankColor = '#CD7F32';
      }
      
      // Rank
      const rankText = this.add.text(width / 2 - 220, y, 
        `${medal} ${index + 1}`, {
        fontSize: isTopThree ? '20px' : '18px',
        fontFamily: 'Arial',
        color: rankColor,
        fontStyle: isTopThree ? 'bold' : 'normal'
      });
      
      // Player name
      const nameText = this.add.text(width / 2 - 140, y, entry.name, {
        fontSize: isTopThree ? '20px' : '18px',
        fontFamily: 'Arial',
        color: isTopThree ? '#00ffff' : '#cccccc',
        fontStyle: isTopThree ? 'bold' : 'normal'
      });
      
      // Score
      const scoreText = this.add.text(width / 2 + 60, y, entry.score.toString(), {
        fontSize: isTopThree ? '20px' : '18px',
        fontFamily: 'Arial',
        color: isTopThree ? '#ffff00' : '#ffffff',
        fontStyle: isTopThree ? 'bold' : 'normal'
      });
      
      // Mission
      const missionText = this.add.text(width / 2 + 150, y, entry.mission || 'Standard', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#888888'
      });
      
      // Fade in animation
      [rankText, nameText, scoreText, missionText].forEach(text => {
        text.setAlpha(0);
        this.tweens.add({
          targets: text,
          alpha: 1,
          duration: 300,
          delay: index * 50,
          ease: 'Power2'
        });
      });
    });
  }
}
