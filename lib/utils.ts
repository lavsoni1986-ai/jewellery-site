// Utility functions for the application

/**
 * Optimizes Cloudinary URLs by adding f_auto and q_auto parameters
 * for automatic format selection and quality optimization
 */
export function optimizeCloudinaryUrl(url: string): string {
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Check if already optimized
  if (url.includes('f_auto,q_auto')) {
    return url;
  }

  // Insert f_auto,q_auto after /upload/
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}

/**
 * Enhances jewellery images with AI transformations for professional look
 * Includes background removal, auto color correction, and padding
 */
export const enhanceJewelleryImage = (url: string) => {
  if (!url) return "";

  // Cloudinary AI Transformations:
  // 1. e_bgremoval: Removes background (requires Cloudinary AI add-on)
  // 2. e_improve: Auto color and lighting correction
  // 3. c_pad,b_white: Centers image on white background
  // 4. f_auto: Auto format (WebP etc)
  // 5. q_auto: Auto quality

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  // This transformation turns photos into professional 'Product Shot'
  const transformation = "e_improve,e_bgremoval,f_auto,q_auto,c_pad,h_800,w_800,b_white";

  return `${parts[0]}/upload/${transformation}/${parts[1]}`;
};

/**
 * Basic enhancement without background removal (free tier)
 */
export const enhanceJewelleryImageBasic = (url: string) => {
  if (!url) return "";

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const transformation = "e_improve,f_auto,q_auto,c_pad,h_800,w_800,b_white";

  return `${parts[0]}/upload/${transformation}/${parts[1]}`;
};