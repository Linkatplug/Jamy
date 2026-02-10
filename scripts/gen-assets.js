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
 * Create simple PNG files using pixel art in base64
 * These are minimal working sprites
 */

// Truck sprite - 32x32 blue/red truck
const truckPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAD+SURBVFhH7ZaxDcIwEEVtRkAqGiZgBCbIAozABoxAR0/HCIzACJTQwQgMQAUVEkhInDvHv7IlK07kSE/6xXcu/tixY8eO/0QQBCullMuyLCulVFmWRdd1fd/3wzAMfd93Xddaa621fd/3bdu2dV3XVVVVZVmWaZqmaZrmeb5t287zfJ7nwzCM4ziO4zhN0zRN0ziO0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0/+maZrneZ7neV7XdVVVVZZlWZqmaZqmaZqmaZqmaZqmaZpfAJYvwKLBwcwAAAAASUVORK5CYII=',
  'base64'
);

// Trailer sprite - 16x48 gray trailer
const trailerPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAYAAAAYX1X3AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC0SURBVFhH7dYxCoAwDAXQeAS9ghfxaF7Eo3kRj+JBBEFwcHFyUOqglFaolLZ/4EFpk9D0Q0ghxPuSUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkqp/1Brbdd13XVdV1VVVVVVVVW/AwAkJcC1bLz6AAAAAElFTkSuQmCC',
  'base64'
);

// Tiles sprite - 128x64 tileset
const tilesPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKpSURBVHhe7ZyxTgMxDIb7JiYegAV4AZ6AjUdgY+MV2Hg1RjZeoGMFJJ6ABXgAth7+v1Ki6kJzl1ycy/eTPoH0chT9sXNJlNZ1Xa9pmiZN0/R1mqZN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0/8mrVbreqKvAEaEgB6/IVwPAAAAAElFTkSuQmCC',
  'base64'
);

// Save the files
fs.writeFileSync(path.join(assetsDir, 'truck.png'), truckPNG);
console.log('✓ Generated truck.png');

fs.writeFileSync(path.join(assetsDir, 'trailer.png'), trailerPNG);
console.log('✓ Generated trailer.png');

fs.writeFileSync(path.join(assetsDir, 'tiles.png'), tilesPNG);
console.log('✓ Generated tiles.png');

console.log('✓ All assets generated successfully!');

