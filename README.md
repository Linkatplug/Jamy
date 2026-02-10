# Jamy 🚚

Jeu de conduite de camion vue du dessus en pixel art (navigateur web)

## Description

Jamy est un jeu HTML5 top-down de conduite de camion avec un style pixel art. Le jeu utilise Phaser 3 pour le moteur de jeu et Vite pour le bundling et le développement.

## Technologies

- **JavaScript** - Langage de programmation
- **Phaser 3** - Moteur de jeu HTML5
- **Vite** - Build tool et dev server

## Caractéristiques

- ✨ Canvas pixel-perfect avec rendu low-res upscalé (320x240 -> 960x720)
- 🎮 Phaser 3 configuré pour les jeux pixel art
- ⚡ Hot Module Replacement avec Vite
- 📦 Build optimisé pour la production

## Structure du projet

```
jamy/
├── src/
│   ├── main.js           # Point d'entrée du jeu
│   └── scenes/
│       └── BootScene.js  # Scène de démarrage
├── index.html            # Page HTML principale
├── vite.config.js        # Configuration Vite
├── package.json          # Dépendances et scripts
└── README.md            # Ce fichier
```

## Installation

```bash
npm install
```

## Développement

Pour lancer le serveur de développement :

```bash
npm run dev
```

Le jeu sera accessible sur `http://localhost:3000` et se rechargera automatiquement à chaque modification.

## Build

Pour créer une version de production :

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

## Preview

Pour prévisualiser le build de production :

```bash
npm run preview
```

## Licence

MIT - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Auteur

LinkAtPlug
