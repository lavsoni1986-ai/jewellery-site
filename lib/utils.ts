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