import Phaser from 'phaser';
import AudioSystem from '../systems/AudioSystem.js';
import { LEVELS } from '../utils/constants.js';

/**
 * LevelSelectScene - Mission selection screen
 */
export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    this.audioSystem = new AudioSystem(this);

    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x1f2b26);
    this.tweens.add({
      targets: bg,
      fillColor: { from: 0x1f2b26, to: 0x29372f },
      duration: 3500,
      yoyo: true,
      repeat: -1
    });

    this.add.text(width / 2, 48, 'SELECT MISSION', {
      fontSize: '42px',
      fontFamily: 'Arial',
      color: '#efe5c8',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    const levelEntries = Object.entries(LEVELS);
    const startY = 130;
    const stepY = 108;

    levelEntries.forEach(([levelKey, level], index) => {
      const y = startY + index * stepY;
      this.createLevelButton(width / 2, y, `Mission ${index + 1}`, level, levelKey);
    });

    const backButton = this.add.text(width / 2, height - 36, '← BACK', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#3c4f45',
      padding: { x: 20, y: 8 },
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive();

    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#4f685b' });
      this.audioSystem.playClick();
    });

    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#3c4f45' });
    });

    backButton.on('pointerdown', () => {
      this.audioSystem.playPickup();
      this.audioSystem.destroy();
      this.scene.start('MenuScene');
    });

    this.input.keyboard.once('keydown-ESC', () => {
      this.audioSystem.destroy();
      this.scene.start('MenuScene');
    });
  }

  createLevelButton(x, y, label, level, levelKey) {
    const buttonBg = this.add.rectangle(x, y, 700, 88, 0x314339, 0.95);
    buttonBg.setStrokeStyle(2, 0x7f8f86);

    const button = this.add.text(x - 250, y, label, {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#f4efde',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5).setInteractive();

    const details = this.add.text(x - 40, y, `${level.name} · ${level.difficulty}`, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#c5d0c9'
    }).setOrigin(0, 0.5);

    const elements = [buttonBg, button, details];

    button.on('pointerover', () => {
      buttonBg.setFillStyle(0x3d5448, 0.95);
      this.audioSystem.playClick();
      this.tweens.add({ targets: elements, scaleX: 1.01, scaleY: 1.01, duration: 100 });
    });

    button.on('pointerout', () => {
      buttonBg.setFillStyle(0x314339, 0.95);
      this.tweens.add({ targets: elements, scaleX: 1, scaleY: 1, duration: 100 });
    });

    button.on('pointerdown', () => {
      this.audioSystem.playPickup();
      this.audioSystem.destroy();
      this.scene.start('GameScene', { levelKey });
    });
  }
}
