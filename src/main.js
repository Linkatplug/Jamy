import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';

// Configuration du jeu avec canvas pixel-perfect low-res upscale
const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 320,  // Résolution native basse (pixel art)
  height: 240,
  zoom: 3,     // Upscale x3 pour affichage = 960x720
  pixelArt: true,  // Active le rendu pixel-perfect
  roundPixels: true,  // Arrondit les positions des pixels
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },  // Pas de gravité pour un jeu top-down
      debug: false
    }
  },
  scene: [BootScene]
};

// Création de l'instance du jeu
const game = new Phaser.Game(config);

export default game;
