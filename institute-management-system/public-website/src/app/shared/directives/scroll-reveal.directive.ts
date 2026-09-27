import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() appScrollReveal: 'up' | 'down' | 'left' | 'right' | 'scale' | '' = '';
  @Input() delay: number = 0;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private scrollAnimationService: ScrollAnimationService
  ) {}

  ngOnInit(): void {
    this.setupScrollReveal();
  }

  ngOnDestroy(): void {
    this.scrollAnimationService.unobserveElement(this.elementRef);
  }

  private setupScrollReveal(): void {
    const element = this.elementRef.nativeElement;
    
    // Add appropriate scroll reveal class based on direction
    switch (this.appScrollReveal) {
      case 'left':
        element.classList.add('scroll-reveal-left');
        break;
      case 'right':
        element.classList.add('scroll-reveal-right');
        break;
      case 'scale':
        element.classList.add('scroll-reveal-scale');
        break;
      default:
        element.classList.add('scroll-reveal');
        break;
    }

    // Add delay if specified
    if (this.delay > 0) {
      element.style.transitionDelay = `${this.delay}ms`;
    }

    // Start observing the element
    this.scrollAnimationService.observeElement(this.elementRef);
  }
}