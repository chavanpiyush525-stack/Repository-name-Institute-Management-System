import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private observer: IntersectionObserver | null = null;
  private animatedElements = new Set<Element>();

  constructor() {
    this.initializeObserver();
  }

  private initializeObserver(): void {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return; // Don't initialize animations if user prefers reduced motion
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            entry.target.classList.add('revealed');
            this.animatedElements.add(entry.target);
            
            // Optionally unobserve the element after animation
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  /**
   * Observe an element for scroll animations
   */
  observeElement(element: ElementRef<HTMLElement> | HTMLElement): void {
    if (!this.observer) return;

    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    
    if (htmlElement) {
      this.observer.observe(htmlElement);
    }
  }

  /**
   * Observe multiple elements for scroll animations
   */
  observeElements(elements: (ElementRef<HTMLElement> | HTMLElement)[]): void {
    elements.forEach(element => this.observeElement(element));
  }

  /**
   * Stop observing an element
   */
  unobserveElement(element: ElementRef<HTMLElement> | HTMLElement): void {
    if (!this.observer) return;

    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    
    if (htmlElement) {
      this.observer.unobserve(htmlElement);
      this.animatedElements.delete(htmlElement);
    }
  }

  /**
   * Observe all elements with scroll-reveal classes on the page
   */
  observeAllScrollRevealElements(): void {
    if (!this.observer) return;

    const scrollRevealElements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
    );

    scrollRevealElements.forEach(element => {
      this.observer!.observe(element);
    });
  }

  /**
   * Add staggered animation to child elements
   */
  addStaggeredAnimation(container: ElementRef<HTMLElement> | HTMLElement, delay: number = 100): void {
    const containerElement = container instanceof ElementRef ? container.nativeElement : container;
    
    if (!containerElement) return;

    const children = Array.from(containerElement.children);
    
    children.forEach((child, index) => {
      (child as HTMLElement).style.animationDelay = `${index * delay}ms`;
      child.classList.add('animate-fade-in');
    });
  }

  /**
   * Trigger a custom animation on an element
   */
  triggerAnimation(element: ElementRef<HTMLElement> | HTMLElement, animationClass: string): void {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    
    if (!htmlElement) return;

    // Remove existing animation classes
    htmlElement.classList.remove(
      'animate-fade-in', 'animate-fade-out', 'animate-slide-up', 'animate-slide-down',
      'animate-slide-left', 'animate-slide-right', 'animate-scale-in', 'animate-scale-out'
    );

    // Add new animation class
    htmlElement.classList.add(animationClass);

    // Remove animation class after animation completes
    const animationDuration = this.getAnimationDuration(htmlElement);
    setTimeout(() => {
      htmlElement.classList.remove(animationClass);
    }, animationDuration);
  }

  /**
   * Get animation duration from CSS custom properties
   */
  private getAnimationDuration(element: HTMLElement): number {
    const computedStyle = getComputedStyle(element);
    const duration = computedStyle.animationDuration;
    
    if (duration.includes('ms')) {
      return parseFloat(duration);
    } else if (duration.includes('s')) {
      return parseFloat(duration) * 1000;
    }
    
    return 500; // Default duration
  }

  /**
   * Create a smooth scroll to element
   */
  scrollToElement(element: ElementRef<HTMLElement> | HTMLElement | string, offset: number = 0): void {
    let targetElement: HTMLElement | null = null;

    if (typeof element === 'string') {
      targetElement = document.querySelector(element);
    } else if (element instanceof ElementRef) {
      targetElement = element.nativeElement;
    } else {
      targetElement = element;
    }

    if (!targetElement) return;

    const elementPosition = targetElement.offsetTop - offset;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Add parallax effect to an element
   */
  addParallaxEffect(element: ElementRef<HTMLElement> | HTMLElement, speed: number = 0.5): void {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    
    if (!htmlElement) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * speed;
      htmlElement.style.transform = `translateY(${parallax}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Cleanup observer when service is destroyed
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.animatedElements.clear();
  }
}