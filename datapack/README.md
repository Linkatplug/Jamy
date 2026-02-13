# Custom Sprites Integration

This directory contains custom artwork for the JAMY truck and trailer.

## Files

- **Jamy_truck.png** - Custom truck (tracteur) artwork (728x535px original)
- **Jamy_remo.png** - Custom trailer (remorque) artwork (863x479px original)

## Integration

These custom sprites are automatically resized and integrated into the game using the resize script.

### How to Use

1. Place your custom truck and trailer images in the `datapack/` directory:
   - Truck image should be named `Jamy_truck.png`
   - Trailer image should be named `Jamy_remo.png`

2. Run the integration script:
   ```bash
   npm run integrate-sprites
   ```

3. The script will automatically:
   - Resize `Jamy_truck.png` to 32x32 pixels (game truck sprite size)
   - Resize `Jamy_remo.png` to 16x48 pixels (game trailer sprite size)
   - Save the resized images to `public/assets/sprites/`
   - Use nearest-neighbor interpolation to preserve pixel art quality

4. Start the game to see your custom sprites:
   ```bash
   npm run dev
   ```

## Technical Details

- **Truck sprite**: Resized to 32x32 pixels (width × height)
- **Trailer sprite**: Resized to 16x48 pixels (width × height)
- **Interpolation**: Nearest-neighbor algorithm to maintain crisp pixel art
- **Format**: PNG with alpha channel support

## Original Images

The original high-resolution images are preserved in this directory and are never modified. The resize script creates new files in the game's sprite directory.

## Script Location

The resize script is located at: `scripts/resize-custom-sprites.js`

It uses the `pngjs` library for image processing with Node.js.
