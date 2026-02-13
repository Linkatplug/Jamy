// Generate simple pixel art sprites programmatically using Canvas-like drawing
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '..', 'public', 'assets', 'sprites');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Function to create a simple PNG with raw pixel data
function createPNG(width, height, pixelData) {
  // This creates a minimal valid PNG file
  const png = new PNG({ width, height });
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const pixel = pixelData(x, y);
      png.data[idx] = pixel.r;
      png.data[idx + 1] = pixel.g;
      png.data[idx + 2] = pixel.b;
      png.data[idx + 3] = pixel.a;
    }
  }
  
  return PNG.sync.write(png);
}

// Generate truck (32x32)
const truckBuffer = createPNG(32, 32, (x, y) => {
  // Background transparent
  let color = { r: 0, g: 0, b: 0, a: 0 };
  
  // Truck body (red container)
  if (x >= 4 && x < 18 && y >= 10 && y < 22) {
    color = { r: 220, g: 20, b: 60, a: 255 }; // Red
  }
  
  // Truck cab (blue)
  if (x >= 18 && x < 28 && y >= 8 && y < 24) {
    color = { r: 65, g: 105, b: 225, a: 255 }; // Blue
  }
  
  // Windshield
  if (x >= 24 && x < 27 && y >= 10 && y < 16) {
    color = { r: 135, g: 206, b: 235, a: 255 }; // Light blue
  }
  
  // Wheels
  const wheel1 = Math.sqrt((x - 8) ** 2 + (y - 24) ** 2) < 3;
  const wheel2 = Math.sqrt((x - 13) ** 2 + (y - 24) ** 2) < 3;
  const wheel3 = Math.sqrt((x - 23) ** 2 + (y - 24) ** 2) < 3;
  
  if (wheel1 || wheel2 || wheel3) {
    color = { r: 0, g: 0, b: 0, a: 255 }; // Black wheels
  }
  
  return color;
});

fs.writeFileSync(path.join(assetsDir, 'truck.png'), truckBuffer);
console.log('✓ Generated truck.png');

// Generate trailer (16x48)
const trailerBuffer = createPNG(16, 48, (x, y) => {
  let color = { r: 0, g: 0, b: 0, a: 0 };
  
  // Trailer body (gray)
  if (x >= 2 && x < 14 && y >= 4 && y < 40) {
    color = { r: 169, g: 169, b: 169, a: 255 };
  }
  
  // Wheels
  const wheel1 = Math.sqrt((x - 5) ** 2 + (y - 42) ** 2) < 3;
  const wheel2 = Math.sqrt((x - 11) ** 2 + (y - 42) ** 2) < 3;
  
  if (wheel1 || wheel2) {
    color = { r: 0, g: 0, b: 0, a: 255 };
  }
  
  return color;
});

fs.writeFileSync(path.join(assetsDir, 'trailer.png'), trailerBuffer);
console.log('✓ Generated trailer.png');

// Generate tiles (128x64)
const tilesBuffer = createPNG(128, 64, (x, y) => {
  const tileX = Math.floor(x / 32);
  const tileY = Math.floor(y / 32);
  
  // Grass tile
  if (tileX === 0 && tileY === 0) {
    return { r: 34, g: 139, b: 34, a: 255 };
  }
  // Road tile
  if (tileX === 1 && tileY === 0) {
    return { r: 68, g: 68, b: 68, a: 255 };
  }
  // Dirt tile
  if (tileX === 2 && tileY === 0) {
    return { r: 139, g: 69, b: 19, a: 255 };
  }
  // Water tile
  if (tileX === 3 && tileY === 0) {
    return { r: 30, g: 144, b: 255, a: 255 };
  }
  
  return { r: 100, g: 100, b: 100, a: 255 };
});

fs.writeFileSync(path.join(assetsDir, 'tiles.png'), tilesBuffer);
console.log('✓ Generated tiles.png');

console.log('✓ All assets generated successfully!');
