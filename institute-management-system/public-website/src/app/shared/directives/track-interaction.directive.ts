import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { ConversionTrackingService } from '../../services/conversion-tracking.service';

@Directive({
  selector: '[appTrackInteraction]',
  standalone: true
})
export class TrackInteractionDirective implements OnInit, OnDestroy {
  @Input() appTrackInteraction!: string; // Event name
  @Input() trackCategory: string = 'user_interaction';
  @Input() trackLabel?: string;
  @Input() trackValue?: number;
  @Input() conversionGoal?: string;
  @Input() trackHover: boolean = false;
  @Input() trackScroll: boolean = false;

  private clickListener?: () => void;
  private hoverListener?: () => void;
  private scrollListener?: () => void;
  private intersectionObserver?: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private analytics: AnalyticsService,
    private conversionTracking: ConversionTrackingService
  ) {}

  ngOnInit(): void {
    this.setupEventListeners();
    
    if (this.trackScroll) {
      this.setupScrollTracking();
    }
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupEventListeners(): void {
    const element = this.el.nativeElement;

    // Click tracking
    this.clickListener = () => {
      this.trackInteraction('click');
      
      if (this.conversionGoal) {
        this.conversionTracking.trackConversion(this.conversionGoal, {
          element_type: element.tagName.toLowerCase(),
          element_text: element.textContent?.trim(),
          page_url: window.location.href
        });
      }
    };
    element.addEventListener('click', this.clickListener);

    // Hover tracking
    if (this.trackHover) {
      this.hoverListener = () => {
        this.trackInteraction('hover');
      };
      element.addEventListener('mouseenter', this.hoverListener);
    }
  }

  private removeEventListeners(): void {
    const element = this.el.nativeElement;

    if (this.clickListener) {
      element.removeEventListener('click', this.clickListener);
    }

    if (this.hoverListener) {
      element.removeEventListener('mouseenter', this.hoverListener);
    }
  }

  private setupScrollTracking(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackInteraction('scroll_into_view');
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.intersectionObserver.observe(this.el.nativeElement);
  }

  private trackInteraction(interactionType: string): void {
    const element = this.el.nativeElement;
    
    this.analytics.trackEvent({
      action: this.appTrackInteraction,
      category: this.trackCategory,
      label: this.trackLabel || `${interactionType}_${element.tagName.toLowerCase()}`,
      value: this.trackValue,
      custom_parameters: {
        interaction_type: interactionType,
        element_type: element.tagName.toLowerCase(),
        element_text: element.textContent?.trim(),
        element_id: element.id,
        element_class: element.className,
        page_url: window.location.href,
        timestamp: new Date().toISOString()
      }
    });
  }
}