import Phaser from 'phaser';

/**
 * Scène de démarrage du jeu
 * Pour l'instant, affiche juste un écran de boot simple
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Préchargement des assets ici (à venir)
  }

  create() {
    // Configuration de l'affichage
    const { width, height } = this.scale;
    
    // Texte de bienvenue
    const titleText = this.add.text(
      width / 2, 
      height / 2 - 20, 
      'JAMY', 
      {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5);

    const subtitleText = this.add.text(
      width / 2, 
      height / 2 + 20, 
      'Jeu de Camion Pixel Art', 
      {
        fontSize: '12px',
        color: '#cccccc',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5);

    const instructionText = this.add.text(
      width / 2, 
      height / 2 + 50, 
      'Projet initialisé avec succès!', 
      {
        fontSize: '10px',
        color: '#888888',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5);

    // Animation de clignotement pour le texte
    this.tweens.add({
      targets: instructionText,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    console.log('✅ Jamy - Boot scene initialized');
    console.log('📦 Phaser version:', Phaser.VERSION);
    console.log('🎮 Canvas size:', width, 'x', height);
  }
}
