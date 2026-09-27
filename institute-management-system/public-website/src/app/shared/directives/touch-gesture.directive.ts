import { Directive, ElementRef, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';

export interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  duration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

@Directive({
  selector: '[appTouchGesture]',
  standalone: true
})
export class TouchGestureDirective implements OnInit, OnDestroy {
  @Input() swipeThreshold: number = 50; // Minimum distance for swipe
  @Input() swipeTimeout: number = 500; // Maximum time for swipe (ms)
  @Input() enableSwipe: boolean = true;
  @Input() enableTap: boolean = true;
  @Input() enableLongPress: boolean = false;
  @Input() longPressDelay: number = 500; // Long press duration (ms)

  @Output() swipe = new EventEmitter<SwipeEvent>();
  @Output() tap = new EventEmitter<TouchEvent>();
  @Output() longPress = new EventEmitter<TouchEvent>();
  @Output() touchStart = new EventEmitter<TouchEvent>();
  @Output() touchEnd = new EventEmitter<TouchEvent>();

  private startX: number = 0;
  private startY: number = 0;
  private startTime: number = 0;
  private longPressTimer: any = null;
  private isSwiping: boolean = false;
  private isLongPressing: boolean = false;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.setupTouchListeners();
  }

  ngOnDestroy(): void {
    this.clearLongPressTimer();
  }

  private setupTouchListeners(): void {
    const element = this.elementRef.nativeElement;

    // Touch events
    element.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    element.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    element.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
    element.addEventListener('touchcancel', this.onTouchCancel.bind(this), { passive: false });

    // Mouse events for desktop testing
    element.addEventListener('mousedown', this.onMouseDown.bind(this));
    element.addEventListener('mousemove', this.onMouseMove.bind(this));
    element.addEventListener('mouseup', this.onMouseUp.bind(this));
    element.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    // Add swipeable class for CSS
    if (this.enableSwipe) {
      element.classList.add('swipeable');
    }
  }

  private onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.handleStart(touch.clientX, touch.clientY, event);
  }

  private onTouchMove(event: TouchEvent): void {
    if (this.isSwiping) {
      event.preventDefault(); // Prevent scrolling while swiping
    }
    
    const touch = event.touches[0];
    this.handleMove(touch.clientX, touch.clientY);
  }

  private onTouchEnd(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    this.handleEnd(touch.clientX, touch.clientY, event);
  }

  private onTouchCancel(event: TouchEvent): void {
    this.handleCancel();
  }

  private onMouseDown(event: MouseEvent): void {
    this.handleStart(event.clientX, event.clientY, event);
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.startTime > 0) {
      this.handleMove(event.clientX, event.clientY);
    }
  }

  private onMouseUp(event: MouseEvent): void {
    if (this.startTime > 0) {
      this.handleEnd(event.clientX, event.clientY, event);
    }
  }

  private onMouseLeave(event: MouseEvent): void {
    this.handleCancel();
  }

  private handleStart(x: number, y: number, event: TouchEvent | MouseEvent): void {
    this.startX = x;
    this.startY = y;
    this.startTime = Date.now();
    this.isSwiping = false;
    this.isLongPressing = false;

    this.touchStart.emit(event as TouchEvent);

    // Start long press timer
    if (this.enableLongPress) {
      this.longPressTimer = setTimeout(() => {
        if (!this.isSwiping) {
          this.isLongPressing = true;
          this.longPress.emit(event as TouchEvent);
        }
      }, this.longPressDelay);
    }
  }

  private handleMove(x: number, y: number): void {
    if (this.startTime === 0) return;

    const deltaX = Math.abs(x - this.startX);
    const deltaY = Math.abs(y - this.startY);
    const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If movement is significant, consider it a swipe
    if (totalDistance > 10) {
      this.isSwiping = true;
      this.clearLongPressTimer();
    }
  }

  private handleEnd(x: number, y: number, event: TouchEvent | MouseEvent): void {
    if (this.startTime === 0) return;

    const endTime = Date.now();
    const duration = endTime - this.startTime;
    const deltaX = x - this.startX;
    const deltaY = y - this.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    this.touchEnd.emit(event as TouchEvent);

    // Check for swipe
    if (this.enableSwipe && this.isSwiping && distance >= this.swipeThreshold && duration <= this.swipeTimeout) {
      const swipeEvent: SwipeEvent = {
        direction: this.getSwipeDirection(deltaX, deltaY),
        distance,
        duration,
        startX: this.startX,
        startY: this.startY,
        endX: x,
        endY: y
      };
      
      this.swipe.emit(swipeEvent);
    }
    // Check for tap (if not swiping and not long pressing)
    else if (this.enableTap && !this.isSwiping && !this.isLongPressing && duration < this.longPressDelay) {
      this.tap.emit(event as TouchEvent);
    }

    this.reset();
  }

  private handleCancel(): void {
    this.reset();
  }

  private getSwipeDirection(deltaX: number, deltaY: number): 'left' | 'right' | 'up' | 'down' {
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  private clearLongPressTimer(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private reset(): void {
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.isSwiping = false;
    this.isLongPressing = false;
    this.clearLongPressTimer();
  }
}