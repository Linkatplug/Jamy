import { angleBetween } from '../utils/math.js';

/**
 * UISystem - Manages HUD display (timer, objective, collisions, direction arrow)
 */
export default class UISystem {
  constructor(scene, missionSystem) {
    this.scene = scene;
    this.missionSystem = missionSystem;
    this.createHUD();
  }

  createHUD() {
    const { width, height } = this.scene.cameras.main;
    
    // Timer text (top center)
    this.timerText = this.scene.add.text(width / 2, 20, '', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

    // Objective text (top left)
    this.objectiveText = this.scene.add.text(20, 20, '', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#f2ebbf',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(100);

    // Collisions counter (top right)
    this.collisionsText = this.scene.add.text(width - 20, 20, '', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#e8a1a1',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.crushScoreText = this.scene.add.text(width - 20, 44, '', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#ff9f9f',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Direction arrow (bottom center) - will point to target
    this.arrowGraphics = this.scene.add.graphics();
    this.arrowGraphics.setScrollFactor(0).setDepth(100);
    this.arrowPosition = { x: width / 2, y: height - 40 };
  }

  update(truck) {
    // Update timer
    const minutes = Math.floor(this.missionSystem.timeRemaining / 60);
    const seconds = Math.floor(this.missionSystem.timeRemaining % 60);
    this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
    
    // Update timer color based on remaining time
    if (this.missionSystem.timeRemaining < 30) {
      this.timerText.setColor('#c97b6d');
    } else if (this.missionSystem.timeRemaining < 60) {
      this.timerText.setColor('#d0a062');
    } else {
      this.timerText.setColor('#ffffff');
    }

    // Update objective
    this.objectiveText.setText(this.missionSystem.getCurrentObjective());

    // Update collisions
    this.collisionsText.setText(`Collisions: ${this.missionSystem.collisions}`);
    this.crushScoreText.setText(`Crush score: ${this.missionSystem.crushScore}`);

    // Update direction arrow
    this.updateDirectionArrow(truck);
  }

  updateDirectionArrow(truck) {
    const target = this.missionSystem.getTargetPosition();
    const angle = angleBetween(truck.x, truck.y, target.x, target.y);
    
    this.arrowGraphics.clear();
    this.arrowGraphics.lineStyle(3, 0xe0d699);
    this.arrowGraphics.fillStyle(0xe0d699);
    
    const arrowLength = 20;
    const arrowWidth = 10;
    
    // Draw arrow pointing to target
    const x = this.arrowPosition.x;
    const y = this.arrowPosition.y;
    
    this.arrowGraphics.save();
    this.arrowGraphics.translateCanvas(x, y);
    this.arrowGraphics.rotateCanvas(angle);
    
    // Arrow body
    this.arrowGraphics.beginPath();
    this.arrowGraphics.moveTo(0, 0);
    this.arrowGraphics.lineTo(arrowLength, 0);
    this.arrowGraphics.strokePath();
    
    // Arrow head
    this.arrowGraphics.beginPath();
    this.arrowGraphics.moveTo(arrowLength, 0);
    this.arrowGraphics.lineTo(arrowLength - arrowWidth, -arrowWidth / 2);
    this.arrowGraphics.lineTo(arrowLength - arrowWidth, arrowWidth / 2);
    this.arrowGraphics.closePath();
    this.arrowGraphics.fillPath();
    
    this.arrowGraphics.restore();
  }

  showPauseOverlay() {
    const { width, height } = this.scene.cameras.main;
    
    // Semi-transparent overlay
    this.pauseOverlay = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setScrollFactor(0)
      .setDepth(200);
    
    // Pause text
    this.pauseText = this.scene.add.text(width / 2, height / 2, 'PAUSED', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
    
    // Resume instruction
    this.resumeText = this.scene.add.text(width / 2, height / 2 + 60, 'Press ESC to resume', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#f2ebbf',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
  }

  hidePauseOverlay() {
    if (this.pauseOverlay) {
      this.pauseOverlay.destroy();
      this.pauseText.destroy();
      this.resumeText.destroy();
      this.pauseOverlay = null;
      this.pauseText = null;
      this.resumeText = null;
    }
  }

  destroy() {
    this.hidePauseOverlay();
  }
}
