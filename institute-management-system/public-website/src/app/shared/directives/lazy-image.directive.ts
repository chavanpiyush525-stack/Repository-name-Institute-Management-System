import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ImageOptimizationService } from '../../services/image-optimization.service';

@Directive({
  selector: 'img[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit, OnDestroy {
  @Input() appLazyImage!: string;
  @Input() placeholder?: string;
  @Input() errorImage?: string;

  private observer?: IntersectionObserver;
  private loaded = false;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2,
    private imageOptimization: ImageOptimizationService
  ) {}

  ngOnInit(): void {
    this.setupLazyLoading();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupLazyLoading(): void {
    const img = this.el.nativeElement;
    
    // Set placeholder image
    if (this.placeholder) {
      this.renderer.setAttribute(img, 'src', this.placeholder);
    } else {
      const width = img.getAttribute('width') || '300';
      const height = img.getAttribute('height') || '200';
      const placeholderSrc = this.imageOptimization.getPlaceholderImage(+width, +height);
      this.renderer.setAttribute(img, 'src', placeholderSrc);
    }

    // Add loading class
    this.renderer.addClass(img, 'lazy-loading');

    // Create intersection observer
    const observer = this.imageOptimization.createLazyLoadObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.loaded) {
          this.loadImage();
        }
      });
    });
    
    if (observer) {
      this.observer = observer;
    }

    if (this.observer) {
      this.observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage();
    }
  }

  private loadImage(): void {
    const img = this.el.nativeElement;
    this.loaded = true;

    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      this.renderer.setAttribute(img, 'src', this.appLazyImage);
      this.renderer.removeClass(img, 'lazy-loading');
      this.renderer.addClass(img, 'lazy-loaded');
      
      // Disconnect observer after loading
      if (this.observer) {
        this.observer.unobserve(img);
      }
    };

    imageLoader.onerror = () => {
      if (this.errorImage) {
        this.renderer.setAttribute(img, 'src', this.errorImage);
      }
      this.renderer.removeClass(img, 'lazy-loading');
      this.renderer.addClass(img, 'lazy-error');
    };

    imageLoader.src = this.appLazyImage;
  }
}