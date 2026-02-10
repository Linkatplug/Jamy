import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '..', 'public', 'assets', 'sprites');

// Ensure directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

/**
 * Generate truck sprite (32x32 pixel art)
 */
function generateTruck() {
  const canvas = createCanvas(32, 32);
  const ctx = canvas.getContext('2d');
  
  // Transparent background
  ctx.clearRect(0, 0, 32, 32);
  
  // Truck cab (blue)
  ctx.fillStyle = '#4169E1';
  ctx.fillRect(18, 8, 10, 16);
  
  // Truck cab outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.strokeRect(18, 8, 10, 16);
  
  // Windshield (light blue)
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(24, 10, 3, 6);
  
  // Truck body/container (red)
  ctx.fillStyle = '#DC143C';
  ctx.fillRect(4, 10, 14, 12);
  
  // Body outline
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(4, 10, 14, 12);
  
  // Wheels (black circles)
  ctx.fillStyle = '#000000';
  
  // Front wheel
  ctx.beginPath();
  ctx.arc(23, 24, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Back wheel 1
  ctx.beginPath();
  ctx.arc(13, 24, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Back wheel 2
  ctx.beginPath();
  ctx.arc(8, 24, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Wheel rims (gray)
  ctx.fillStyle = '#808080';
  
  ctx.beginPath();
  ctx.arc(23, 24, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(13, 24, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(8, 24, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'truck.png'), buffer);
  console.log('✓ Generated truck.png');
}

/**
 * Generate trailer sprite (16x48 pixel art)
 */
function generateTrailer() {
  const canvas = createCanvas(16, 48);
  const ctx = canvas.getContext('2d');
  
  // Transparent background
  ctx.clearRect(0, 0, 16, 48);
  
  // Trailer body (gray)
  ctx.fillStyle = '#A9A9A9';
  ctx.fillRect(2, 4, 12, 36);
  
  // Body outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.strokeRect(2, 4, 12, 36);
  
  // Trailer details (darker gray stripes)
  ctx.fillStyle = '#696969';
  ctx.fillRect(2, 12, 12, 2);
  ctx.fillRect(2, 24, 12, 2);
  ctx.fillRect(2, 36, 12, 2);
  
  // Wheels (black)
  ctx.fillStyle = '#000000';
  
  // Back wheels
  ctx.beginPath();
  ctx.arc(5, 42, 3, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(11, 42, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Wheel rims (gray)
  ctx.fillStyle = '#808080';
  
  ctx.beginPath();
  ctx.arc(5, 42, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(11, 42, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Connection point (top)
  ctx.fillStyle = '#000000';
  ctx.fillRect(6, 0, 4, 4);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'trailer.png'), buffer);
  console.log('✓ Generated trailer.png');
}

/**
 * Generate tiles sprite sheet (simple grass and road tiles)
 */
function generateTiles() {
  const tileSize = 32;
  const tilesPerRow = 4;
  const canvas = createCanvas(tileSize * tilesPerRow, tileSize * 2);
  const ctx = canvas.getContext('2d');
  
  // Transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Grass tile (0,0)
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, tileSize, tileSize);
  
  // Add some grass variation
  ctx.fillStyle = '#32CD32';
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * tileSize;
    const y = Math.random() * tileSize;
    ctx.fillRect(x, y, 2, 2);
  }
  
  // Road tile (1,0)
  ctx.fillStyle = '#444444';
  ctx.fillRect(tileSize, 0, tileSize, tileSize);
  
  // Road markings
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(tileSize + 14, 2, 4, 8);
  ctx.fillRect(tileSize + 14, 14, 4, 8);
  ctx.fillRect(tileSize + 14, 26, 4, 4);
  
  // Dirt tile (2,0)
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(tileSize * 2, 0, tileSize, tileSize);
  
  // Dirt texture
  ctx.fillStyle = '#A0522D';
  for (let i = 0; i < 15; i++) {
    const x = tileSize * 2 + Math.random() * tileSize;
    const y = Math.random() * tileSize;
    ctx.fillRect(x, y, 1, 1);
  }
  
  // Water tile (3,0)
  ctx.fillStyle = '#1E90FF';
  ctx.fillRect(tileSize * 3, 0, tileSize, tileSize);
  
  // Water waves
  ctx.strokeStyle = '#4169E1';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(tileSize * 3, i * 10 + 5);
    ctx.lineTo(tileSize * 4, i * 10 + 5);
    ctx.stroke();
  }
  
  // Concrete/parking tile (0,1)
  ctx.fillStyle = '#696969';
  ctx.fillRect(0, tileSize, tileSize, tileSize);
  
  // Parking lines
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, tileSize + 2, tileSize - 4, tileSize - 4);
  
  // Sand tile (1,1)
  ctx.fillStyle = '#F4A460';
  ctx.fillRect(tileSize, tileSize, tileSize, tileSize);
  
  // Gravel tile (2,1)
  ctx.fillStyle = '#808080';
  ctx.fillRect(tileSize * 2, tileSize, tileSize, tileSize);
  
  // Gravel texture
  ctx.fillStyle = '#696969';
  for (let i = 0; i < 30; i++) {
    const x = tileSize * 2 + Math.random() * tileSize;
    const y = tileSize + Math.random() * tileSize;
    ctx.fillRect(x, y, 1, 1);
  }
  
  // Building/obstacle tile (3,1)
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(tileSize * 3, tileSize, tileSize, tileSize);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeRect(tileSize * 3, tileSize, tileSize, tileSize);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'tiles.png'), buffer);
  console.log('✓ Generated tiles.png');
}

// Generate all assets
console.log('Generating game assets...');
generateTruck();
generateTrailer();
generateTiles();
console.log('✓ All assets generated successfully!');
