import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { AccessibilityService } from '../../services/accessibility.service';

@Directive({
  selector: '[appKeyboardNavigation]',
  standalone: true
})
export class KeyboardNavigationDirective {
  private accessibilityService = inject(AccessibilityService);
  private elementRef = inject(ElementRef);
  
  @Input() navigationMode: 'grid' | 'list' | 'menu' = 'list';
  @Input() wrapNavigation: boolean = true;
  @Input() orientation: 'horizontal' | 'vertical' | 'both' = 'vertical';

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const container = this.elementRef.nativeElement;
    const focusableElements = this.accessibilityService.getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    
    if (currentIndex === -1) return;

    let targetIndex = currentIndex;
    let handled = false;

    switch (event.key) {
      case 'ArrowDown':
        if (this.orientation === 'vertical' || this.orientation === 'both') {
          targetIndex = this.getNextIndex(currentIndex, focusableElements.length, 1);
          handled = true;
        }
        break;
        
      case 'ArrowUp':
        if (this.orientation === 'vertical' || this.orientation === 'both') {
          targetIndex = this.getNextIndex(currentIndex, focusableElements.length, -1);
          handled = true;
        }
        break;
        
      case 'ArrowRight':
        if (this.orientation === 'horizontal' || this.orientation === 'both') {
          targetIndex = this.getNextIndex(currentIndex, focusableElements.length, 1);
          handled = true;
        }
        break;
        
      case 'ArrowLeft':
        if (this.orientation === 'horizontal' || this.orientation === 'both') {
          targetIndex = this.getNextIndex(currentIndex, focusableElements.length, -1);
          handled = true;
        }
        break;
        
      case 'Home':
        targetIndex = 0;
        handled = true;
        break;
        
      case 'End':
        targetIndex = focusableElements.length - 1;
        handled = true;
        break;
        
      case 'PageDown':
        targetIndex = Math.min(currentIndex + 10, focusableElements.length - 1);
        handled = true;
        break;
        
      case 'PageUp':
        targetIndex = Math.max(currentIndex - 10, 0);
        handled = true;
        break;
    }

    if (handled && targetIndex !== currentIndex) {
      event.preventDefault();
      focusableElements[targetIndex].focus();
    }
  }

  private getNextIndex(currentIndex: number, totalLength: number, direction: number): number {
    let nextIndex = currentIndex + direction;
    
    if (this.wrapNavigation) {
      if (nextIndex < 0) {
        nextIndex = totalLength - 1;
      } else if (nextIndex >= totalLength) {
        nextIndex = 0;
      }
    } else {
      nextIndex = Math.max(0, Math.min(nextIndex, totalLength - 1));
    }
    
    return nextIndex;
  }
}