import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datapackDir = path.join(__dirname, '..', 'datapack');
const assetsDir = path.join(__dirname, '..', 'public', 'assets', 'sprites');

// Ensure directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

/**
 * Resize an image using nearest-neighbor interpolation
 */
function resizeImage(inputPath, outputPath, targetWidth, targetHeight) {
  return new Promise((resolve, reject) => {
    // Read the source image
    fs.createReadStream(inputPath)
      .pipe(new PNG())
      .on('parsed', function() {
        const srcWidth = this.width;
        const srcHeight = this.height;
        
        // Create a new PNG for the resized image
        const resized = new PNG({ width: targetWidth, height: targetHeight });
        
        // Calculate scale ratios
        const scaleX = srcWidth / targetWidth;
        const scaleY = srcHeight / targetHeight;
        
        // Nearest-neighbor interpolation
        for (let y = 0; y < targetHeight; y++) {
          for (let x = 0; x < targetWidth; x++) {
            // Find the nearest pixel in the source image
            const srcX = Math.floor(x * scaleX);
            const srcY = Math.floor(y * scaleY);
            
            // Calculate positions in the buffer
            const srcIdx = (srcWidth * srcY + srcX) << 2;
            const dstIdx = (targetWidth * y + x) << 2;
            
            // Copy RGBA values
            resized.data[dstIdx] = this.data[srcIdx];       // R
            resized.data[dstIdx + 1] = this.data[srcIdx + 1]; // G
            resized.data[dstIdx + 2] = this.data[srcIdx + 2]; // B
            resized.data[dstIdx + 3] = this.data[srcIdx + 3]; // A
          }
        }
        
        // Write the resized image
        resized.pack().pipe(fs.createWriteStream(outputPath))
          .on('finish', () => resolve())
          .on('error', (err) => reject(err));
      })
      .on('error', (err) => reject(err));
  });
}

async function main() {
  try {
    console.log('Resizing custom sprites from datapack...');
    
    // Resize truck sprite (Jamy_truck.png) to 32x32
    const truckInput = path.join(datapackDir, 'Jamy_truck.png');
    const truckOutput = path.join(assetsDir, 'truck.png');
    
    if (fs.existsSync(truckInput)) {
      await resizeImage(truckInput, truckOutput, 32, 32);
      console.log('✓ Resized Jamy_truck.png to 32x32 and saved as truck.png');
    } else {
      console.warn('⚠ Jamy_truck.png not found in datapack/');
    }
    
    // Resize trailer sprite (Jamy_remo.png) to 16x48
    const trailerInput = path.join(datapackDir, 'Jamy_remo.png');
    const trailerOutput = path.join(assetsDir, 'trailer.png');
    
    if (fs.existsSync(trailerInput)) {
      await resizeImage(trailerInput, trailerOutput, 16, 48);
      console.log('✓ Resized Jamy_remo.png to 16x48 and saved as trailer.png');
    } else {
      console.warn('⚠ Jamy_remo.png not found in datapack/');
    }
    
    console.log('✓ Custom sprites integrated successfully!');
    
  } catch (error) {
    console.error('Error processing images:', error);
    process.exit(1);
  }
}

main();
