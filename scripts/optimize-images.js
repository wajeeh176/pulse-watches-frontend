const fs = require('fs').promises;
const path = require('path');
// Sharp is commented out until installed
// const sharp = require('sharp');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Configuration
const IMAGE_QUALITY = 80;
const MAX_WIDTH = 1200;

async function optimizeImages() {
  try {
    console.log('Starting image optimization...');
    
    // Get all image files
    const files = await fs.readdir(IMAGES_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    // Process each image
    for (const file of imageFiles) {
      const inputPath = path.join(IMAGES_DIR, file);
      const fileExt = path.extname(file).toLowerCase();
      const fileName = path.basename(file, fileExt);
      const outputPath = path.join(IMAGES_DIR, `${fileName}${fileExt}`);
      
      // Skip if output already exists and is newer than input
      try {
        const inputStat = await fs.stat(inputPath);
        const outputStat = await fs.stat(outputPath);
        
        if (outputStat.mtimeMs > inputStat.mtimeMs) {
          console.log(`Skipping ${file} (already optimized)`);
          continue;
        }
      } catch (err) {
        // Output doesn't exist, continue with optimization
      }
      
      console.log(`Optimizing ${file}...`);
      
      // Create a Sharp instance
      let image = sharp(inputPath);
      
      // Get image metadata
      const metadata = await image.metadata();
      
      // Resize if larger than MAX_WIDTH
      if (metadata.width > MAX_WIDTH) {
        image = image.resize(MAX_WIDTH);
      }
      
      // Format-specific output options
      if (fileExt === '.jpg' || fileExt === '.jpeg') {
        await image
          .jpeg({ quality: IMAGE_QUALITY, mozjpeg: true })
          .toFile(outputPath);
      } else if (fileExt === '.png') {
        await image
          .png({ quality: IMAGE_QUALITY, compressionLevel: 9 })
          .toFile(outputPath);
      } else if (fileExt === '.webp') {
        await image
          .webp({ quality: IMAGE_QUALITY })
          .toFile(outputPath);
      }
      
      // Generate WebP version for non-webp images
      if (fileExt !== '.webp') {
        const webpOutputPath = path.join(IMAGES_DIR, `${fileName}.webp`);
        await image
          .webp({ quality: IMAGE_QUALITY })
          .toFile(webpOutputPath);
        
        console.log(`Created WebP version: ${fileName}.webp`);
      }
    }
    
    console.log('Image optimization completed successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
