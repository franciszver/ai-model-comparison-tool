import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export interface ImageData {
  url: string;
  localPath: string;
  base64?: string;
}

/**
 * Download image from URL and save to local path
 */
export async function downloadImage(url: string, savePath: string): Promise<string> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 30000,
    maxRedirects: 5,
    validateStatus: (status) => status >= 200 && status < 400,
  });

  // Ensure directory exists
  const dir = path.dirname(savePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Validate that we got image data
  if (!response.data || response.data.length === 0) {
    throw new Error('Downloaded image is empty');
  }

  fs.writeFileSync(savePath, response.data);
  return savePath;
}

/**
 * Convert image file to base64 string for OpenRouter vision API
 */
export function imageToBase64(imagePath: string): string {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');
  
  // Determine MIME type from file extension
  const ext = path.extname(imagePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  
  const mimeType = mimeTypes[ext] || 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Process multiple images: download and convert to base64
 */
export async function processImages(
  imageUrls: string[],
  outputDir: string
): Promise<ImageData[]> {
  const imagesDir = path.join(outputDir, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const processedImages: ImageData[] = [];

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    if (!url || url.trim() === '') {
      console.warn(`Skipping empty image URL at index ${i}`);
      continue;
    }

    try {
      // Handle URL parsing more safely
      let ext = '.jpg';
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        ext = path.extname(pathname) || '.jpg';
      } catch {
        // If URL parsing fails, default to .jpg
        ext = '.jpg';
      }

      const filename = `image_${i + 1}${ext}`;
      const localPath = path.join(imagesDir, filename);

      await downloadImage(url, localPath);
      const base64 = imageToBase64(localPath);

      processedImages.push({
        url,
        localPath,
        base64,
      });
    } catch (error) {
      console.warn(`Failed to download image ${url}:`, error instanceof Error ? error.message : error);
      // Continue with other images
    }
  }

  return processedImages;
}

