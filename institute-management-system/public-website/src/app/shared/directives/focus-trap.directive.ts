import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { AccessibilityService } from '../../services/accessibility.service';

@Directive({
  selector: '[appFocusTrap]',
  standalone: true
})
export class FocusTrapDirective implements OnInit, OnDestroy {
  private accessibilityService = inject(AccessibilityService);
  private elementRef = inject(ElementRef);
  
  @Input() appFocusTrap: boolean = true;
  @Input() autoFocus: boolean = true;
  
  private cleanupFocusTrap?: () => void;
  private previousActiveElement?: HTMLElement;

  ngOnInit(): void {
    if (this.appFocusTrap) {
      this.setupFocusTrap();
    }
  }

  ngOnDestroy(): void {
    this.cleanupFocusTrap?.();
    this.restorePreviousFocus();
  }

  private setupFocusTrap(): void {
    const container = this.elementRef.nativeElement;
    
    // Store the previously focused element
    this.previousActiveElement = document.activeElement as HTMLElement;
    
    // Set up focus trap
    this.cleanupFocusTrap = this.accessibilityService.trapFocus(container);
    
    // Auto-focus first element if requested
    if (this.autoFocus) {
      setTimeout(() => {
        this.accessibilityService.focusFirstFocusableElement(container);
      }, 0);
    }
  }

  private restorePreviousFocus(): void {
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
    }
  }
}