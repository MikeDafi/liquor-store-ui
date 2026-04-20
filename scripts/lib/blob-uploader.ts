import { put } from '@vercel/blob';

const BLOB_PREFIX = 'product-images/';

/**
 * Upload a compressed image to Vercel Blob.
 * URL will be: {blob-store}/product-images/{upc}.webp
 */
export async function uploadImage(upc: string, imageBuffer: Buffer): Promise<string> {
  const blob = await put(`${BLOB_PREFIX}${upc}.webp`, imageBuffer, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'image/webp',
  });
  return blob.url;
}
