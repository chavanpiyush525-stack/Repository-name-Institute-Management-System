import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appLazyLoadImage]',
  standalone: true
})
export class LazyLoadImageDirective implements OnInit, OnDestroy {
  @Input() appLazyLoadImage!: string;
  @Input() placeholder?: string;
  @Input() errorImage?: string;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLImageElement>) {}

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
    
    // Set placeholder if provided
    if (this.placeholder) {
      img.src = this.placeholder;
    }

    // Add loading class
    img.classList.add('lazy-loading');

    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage();
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    this.observer.observe(img);
  }

  private loadImage(): void {
    const img = this.el.nativeElement;
    
    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      img.src = this.appLazyLoadImage;
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      
      // Disconnect observer after loading
      if (this.observer) {
        this.observer.unobserve(img);
      }
    };

    imageLoader.onerror = () => {
      if (this.errorImage) {
        img.src = this.errorImage;
      }
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');
      
      // Disconnect observer after error
      if (this.observer) {
        this.observer.unobserve(img);
      }
    };

    imageLoader.src = this.appLazyLoadImage;
  }
}