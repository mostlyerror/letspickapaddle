/**
 * Paddle Adapter
 *
 * Converts current Paddle model to generic Product model
 * for use with the generic recommendation engine.
 */

import { Product } from '../core/engine/types';

interface Paddle {
  id: string;
  name: string;
  brand: string;
  priceCents: number;
  weightOz: number | null;
  gripCircumference: number | null;
  coreMaterial: string | null;
  faceMaterial: string | null;
  shape: string | null;
  powerRating: number | null;
  controlRating: number | null;
  spinRating: number | null;
  sweetSpotSize: string | null;
  imageUrl: string | null;
  affiliateUrls: string | null; // JSON string
}

/**
 * Convert Paddle to generic Product model
 */
export function paddleToProduct(paddle: Paddle): Product {
  // Parse affiliate URLs
  let affiliateUrls: Record<string, string> = {};
  if (paddle.affiliateUrls) {
    try {
      affiliateUrls = JSON.parse(paddle.affiliateUrls);
    } catch (e) {
      console.error('Failed to parse affiliate URLs:', e);
    }
  }

  return {
    id: paddle.id,
    workspaceId: 'pickleball', // Static workspace for paddle quiz
    name: paddle.name,
    brand: paddle.brand,
    priceCents: paddle.priceCents,
    imageUrl: paddle.imageUrl,
    affiliateUrls,

    // All paddle-specific fields go into attributes
    attributes: {
      weightOz: paddle.weightOz,
      gripCircumference: paddle.gripCircumference,
      coreMaterial: paddle.coreMaterial,
      faceMaterial: paddle.faceMaterial,
      shape: paddle.shape,
      powerRating: paddle.powerRating,
      controlRating: paddle.controlRating,
      spinRating: paddle.spinRating,
      sweetSpotSize: paddle.sweetSpotSize,

      // Also include priceCents in attributes for rules to access
      priceCents: paddle.priceCents,
    },
  };
}

/**
 * Convert array of Paddles to Products
 */
export function paddlesToProducts(paddles: Paddle[]): Product[] {
  return paddles.map(paddleToProduct);
}

/**
 * Convert Product back to Paddle response format
 * (for backward compatibility with existing API consumers)
 */
export function productToPaddleResponse(
  product: Product,
  score: number,
  matchReasons: string[]
) {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    priceCents: product.priceCents,
    powerRating: product.attributes.powerRating,
    controlRating: product.attributes.controlRating,
    spinRating: product.attributes.spinRating,
    weightOz: product.attributes.weightOz,
    coreMaterial: product.attributes.coreMaterial,
    faceMaterial: product.attributes.faceMaterial,
    shape: product.attributes.shape,
    sweetSpotSize: product.attributes.sweetSpotSize,
    imageUrl: product.imageUrl,
    score,
    matchReasons,
    affiliateUrls: product.affiliateUrls,
  };
}
