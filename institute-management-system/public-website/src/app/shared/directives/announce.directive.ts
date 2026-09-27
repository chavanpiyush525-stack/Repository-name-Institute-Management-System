import { Directive, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { AccessibilityService } from '../../services/accessibility.service';

@Directive({
  selector: '[appAnnounce]',
  standalone: true
})
export class AnnounceDirective implements OnChanges {
  private accessibilityService = inject(AccessibilityService);
  
  @Input() appAnnounce: string = '';
  @Input() announcePriority: 'polite' | 'assertive' = 'polite';
  @Input() announceDelay: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appAnnounce'] && this.appAnnounce) {
      if (this.announceDelay > 0) {
        setTimeout(() => {
          this.makeAnnouncement();
        }, this.announceDelay);
      } else {
        this.makeAnnouncement();
      }
    }
  }

  private makeAnnouncement(): void {
    if (this.appAnnounce.trim()) {
      this.accessibilityService.announceToScreenReader(
        this.appAnnounce,
        this.announcePriority
      );
    }
  }
}