import fs from 'node:fs';
import path from 'node:path';
import { compress as compressWoff2 } from 'wawoff2';

export interface ConversionResult {
  woff2Buffer: Buffer;
  originalSize: number;
  woff2Size: number;
  compressionRatio: string;
}

/**
 * Converts a TTF or OTF font binary to modern WOFF2 using Google Brotli (wawoff2)
 */
export async function convertToWoff2(inputFilePath: string): Promise<ConversionResult> {
  const inputBuffer = fs.readFileSync(inputFilePath);
  const originalSize = inputBuffer.length;

  const woff2Uint8 = await compressWoff2(inputBuffer);
  const woff2Buffer = Buffer.from(woff2Uint8);
  const woff2Size = woff2Buffer.length;

  const ratio = ((1 - woff2Size / originalSize) * 100).toFixed(1) + '%';

  return {
    woff2Buffer,
    originalSize,
    woff2Size,
    compressionRatio: ratio
  };
}

/**
 * Converts and writes the WOFF2 file to the target destination
 */
export async function convertAndSaveWoff2(inputFilePath: string, outputFilePath: string): Promise<ConversionResult> {
  const result = await convertToWoff2(inputFilePath);
  const dir = path.dirname(outputFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputFilePath, result.woff2Buffer);
  return result;
}
