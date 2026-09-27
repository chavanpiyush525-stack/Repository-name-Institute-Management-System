import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appResponsiveImage]',
  standalone: true
})
export class ResponsiveImageDirective implements OnInit, OnDestroy {
  @Input() appResponsiveImage: string = '';
  @Input() alt: string = '';
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() sizes: string = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  private observer: IntersectionObserver | null = null;
  private isLoaded = false;

  constructor(private elementRef: ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    this.setupResponsiveImage();
    this.setupLazyLoading();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupResponsiveImage(): void {
    const img = this.elementRef.nativeElement;
    
    // Set basic attributes
    img.alt = this.alt;
    img.loading = this.loading;
    img.sizes = this.sizes;
    
    // Add responsive image classes
    img.classList.add('responsive-image');
    
    // Generate srcset for different screen sizes
    if (this.appResponsiveImage) {
      this.generateSrcSet();
    }
  }

  private generateSrcSet(): void {
    const img = this.elementRef.nativeElement;
    const baseSrc = this.appResponsiveImage;
    
    // Extract file extension and name
    const lastDotIndex = baseSrc.lastIndexOf('.');
    const extension = baseSrc.substring(lastDotIndex);
    const nameWithoutExtension = baseSrc.substring(0, lastDotIndex);
    
    // Generate srcset for different widths
    const widths = [320, 640, 768, 1024, 1280, 1536];
    const srcsetEntries = widths.map(width => {
      // For now, we'll use the same image but in a real implementation,
      // you would have different sized versions of the image
      return `${nameWithoutExtension}${extension} ${width}w`;
    });
    
    img.srcset = srcsetEntries.join(', ');
    img.src = baseSrc; // Fallback src
  }

  private setupLazyLoading(): void {
    if (this.loading === 'lazy' && 'IntersectionObserver' in window) {
      const img = this.elementRef.nativeElement;
      
      // Create placeholder while loading
      this.createPlaceholder();
      
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.isLoaded) {
              this.loadImage();
            }
          });
        },
        {
          rootMargin: '50px'
        }
      );
      
      this.observer.observe(img);
    }
  }

  private createPlaceholder(): void {
    const img = this.elementRef.nativeElement;
    
    // Add loading skeleton
    img.classList.add('skeleton');
    
    // Set a temporary background while loading
    img.style.backgroundColor = 'var(--color-neutral-200)';
    img.style.minHeight = '200px';
  }

  private loadImage(): void {
    const img = this.elementRef.nativeElement;
    
    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Remove skeleton and set the actual image
      img.classList.remove('skeleton');
      img.style.backgroundColor = '';
      img.style.minHeight = '';
      
      // Add fade-in animation
      img.classList.add('animate-fade-in');
      
      this.isLoaded = true;
      
      if (this.observer) {
        this.observer.unobserve(img);
      }
    };
    
    imageLoader.onerror = () => {
      // Handle error - show placeholder or error image
      img.classList.remove('skeleton');
      img.alt = 'Image failed to load';
      img.style.backgroundColor = 'var(--color-neutral-100)';
      img.style.minHeight = '200px';
      
      if (this.observer) {
        this.observer.unobserve(img);
      }
    };
    
    // Start loading the image
    imageLoader.src = img.src;
    if (img.srcset) {
      imageLoader.srcset = img.srcset;
    }
  }
}