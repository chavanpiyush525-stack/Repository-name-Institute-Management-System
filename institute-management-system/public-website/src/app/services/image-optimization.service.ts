import { Injectable } from '@angular/core';

export interface OptimizedImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcset?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private readonly supportedFormats = ['webp', 'avif'];
  private readonly breakpoints = [320, 640, 768, 1024, 1280, 1536];

  constructor() {}

  /**
   * Generate optimized image configuration with responsive srcset
   */
  optimizeImage(config: OptimizedImageConfig): OptimizedImageConfig {
    const optimized = { ...config };

    // Generate responsive srcset if not provided
    if (!optimized.srcset && optimized.width) {
      optimized.srcset = this.generateSrcSet(optimized.src, optimized.width);
    }

    // Generate sizes attribute if not provided
    if (!optimized.sizes && optimized.width) {
      optimized.sizes = this.generateSizes(optimized.width);
    }

    // Default to lazy loading
    if (!optimized.loading) {
      optimized.loading = 'lazy';
    }

    return optimized;
  }

  /**
   * Generate srcset for responsive images
   */
  private generateSrcSet(src: string, maxWidth: number): string {
    const relevantBreakpoints = this.breakpoints.filter(bp => bp <= maxWidth * 2);
    
    return relevantBreakpoints
      .map(width => {
        const optimizedSrc = this.getOptimizedImageUrl(src, width);
        return `${optimizedSrc} ${width}w`;
      })
      .join(', ');
  }

  /**
   * Generate sizes attribute for responsive images
   */
  private generateSizes(maxWidth: number): string {
    const sizes = [
      '(max-width: 640px) 100vw',
      '(max-width: 768px) 50vw',
      '(max-width: 1024px) 33vw',
      `${maxWidth}px`
    ];

    return sizes.join(', ');
  }

  /**
   * Get optimized image URL (placeholder for actual image optimization service)
   */
  private getOptimizedImageUrl(src: string, width: number, format?: string): string {
    // In a real implementation, this would integrate with an image optimization service
    // like Cloudinary, ImageKit, or a custom solution
    const extension = format || this.getBestSupportedFormat();
    const baseName = src.replace(/\.[^/.]+$/, '');
    
    return `${baseName}_w${width}.${extension}`;
  }

  /**
   * Detect the best supported image format
   */
  private getBestSupportedFormat(): string {
    // Check for modern format support
    if (this.supportsWebP()) {
      return 'webp';
    }
    
    return 'jpg'; // Fallback
  }

  /**
   * Check if browser supports WebP
   */
  private supportsWebP(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Preload critical images
   */
  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Preload multiple critical images
   */
  preloadImages(sources: string[]): Promise<void[]> {
    return Promise.all(sources.map(src => this.preloadImage(src)));
  }

  /**
   * Create intersection observer for lazy loading
   */
  createLazyLoadObserver(callback: (entries: IntersectionObserverEntry[]) => void): IntersectionObserver | null {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return null;
    }

    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
  }

  /**
   * Get placeholder image for lazy loading
   */
  getPlaceholderImage(width: number, height: number): string {
    // Generate a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="14">
          Loading...
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Calculate image dimensions maintaining aspect ratio
   */
  calculateDimensions(originalWidth: number, originalHeight: number, maxWidth: number, maxHeight?: number): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;
    
    let width = Math.min(originalWidth, maxWidth);
    let height = width / aspectRatio;
    
    if (maxHeight && height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }
}