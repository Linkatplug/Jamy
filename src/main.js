import Phaser from 'phaser';
import { gameConfig } from './game/config.js';

// Import scenes
import BootScene from './game/scenes/BootScene.js';
import MenuScene from './game/scenes/MenuScene.js';
import GameScene from './game/scenes/GameScene.js';
import EndScene from './game/scenes/EndScene.js';
import LeaderboardScene from './game/scenes/LeaderboardScene.js';

// Add scenes to config
gameConfig.scene = [BootScene, MenuScene, GameScene, EndScene, LeaderboardScene];

// Create and start the game
const game = new Phaser.Game(gameConfig);

// Handle window focus/blur for pause
window.addEventListener('blur', () => {
  if (game.scene.isActive('GameScene')) {
    game.scene.pause('GameScene');
  }
});

window.addEventListener('focus', () => {
  if (game.scene.isPaused('GameScene')) {
    // Don't auto-resume, let player press ESC
  }
});

export default game;
