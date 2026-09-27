import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { map, startWith, distinctUntilChanged, debounceTime } from 'rxjs/operators';

export interface ViewportSize {
    width: number;
    height: number;
}

export interface Breakpoints {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isLarge: boolean;
    isXL: boolean;
    isXXL: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ViewportService {
    private readonly breakpoints = {
        mobile: 640,
        tablet: 768,
        desktop: 1024,
        large: 1280,
        xl: 1536
    };

    private viewportSize$ = new BehaviorSubject<ViewportSize>(this.getCurrentViewportSize());
    private breakpoints$ = new BehaviorSubject<Breakpoints>(this.getCurrentBreakpoints());

    constructor() {
        this.initializeViewportTracking();
    }

    /**
     * Get current viewport size as observable
     */
    getViewportSize(): Observable<ViewportSize> {
        return this.viewportSize$.asObservable();
    }

    /**
     * Get current breakpoints as observable
     */
    getBreakpoints(): Observable<Breakpoints> {
        return this.breakpoints$.asObservable();
    }

    /**
     * Get current viewport width
     */
    getCurrentWidth(): number {
        return this.viewportSize$.value.width;
    }

    /**
     * Get current viewport height
     */
    getCurrentHeight(): number {
        return this.viewportSize$.value.height;
    }

    /**
     * Check if current viewport matches a specific breakpoint
     */
    isMobile(): boolean {
        return this.breakpoints$.value.isMobile;
    }

    isTablet(): boolean {
        return this.breakpoints$.value.isTablet;
    }

    isDesktop(): boolean {
        return this.breakpoints$.value.isDesktop;
    }

    isLarge(): boolean {
        return this.breakpoints$.value.isLarge;
    }

    isXL(): boolean {
        return this.breakpoints$.value.isXL;
    }

    isXXL(): boolean {
        return this.breakpoints$.value.isXXL;
    }

    /**
     * Check if viewport is mobile or tablet (touch devices)
     */
    isTouchDevice(): boolean {
        return this.isMobile() || this.isTablet();
    }

    /**
     * Check if viewport supports hover interactions
     */
    supportsHover(): boolean {
        return window.matchMedia('(hover: hover)').matches;
    }

    /**
     * Check if user prefers reduced motion
     */
    prefersReducedMotion(): boolean {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Get device pixel ratio
     */
    getDevicePixelRatio(): number {
        return window.devicePixelRatio || 1;
    }

    /**
     * Check if device is in landscape orientation
     */
    isLandscape(): boolean {
        return window.innerWidth > window.innerHeight;
    }

    /**
     * Check if device is in portrait orientation
     */
    isPortrait(): boolean {
        return window.innerHeight > window.innerWidth;
    }

    /**
     * Get safe area insets (for devices with notches)
     */
    getSafeAreaInsets(): { top: number; right: number; bottom: number; left: number } {
        const computedStyle = getComputedStyle(document.documentElement);

        return {
            top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0,
            right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)')) || 0,
            bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
            left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)')) || 0
        };
    }

    /**
     * Observable that emits when orientation changes
     */
    getOrientationChange(): Observable<'portrait' | 'landscape'> {
        return fromEvent(window, 'orientationchange').pipe(
            startWith(null),
            map(() => this.isLandscape() ? 'landscape' : 'portrait'),
            distinctUntilChanged()
        );
    }

    /**
     * Observable that emits when breakpoint changes
     */
    getBreakpointChange(): Observable<string> {
        return this.breakpoints$.pipe(
            map(breakpoints => {
                if (breakpoints.isXXL) return 'xxl';
                if (breakpoints.isXL) return 'xl';
                if (breakpoints.isLarge) return 'large';
                if (breakpoints.isDesktop) return 'desktop';
                if (breakpoints.isTablet) return 'tablet';
                return 'mobile';
            }),
            distinctUntilChanged()
        );
    }

    private initializeViewportTracking(): void {
        if (typeof window === 'undefined') return;

        // Track viewport size changes
        fromEvent(window, 'resize').pipe(
            debounceTime(100),
            startWith(null)
        ).subscribe(() => {
            const newSize = this.getCurrentViewportSize();
            const newBreakpoints = this.getCurrentBreakpoints();

            this.viewportSize$.next(newSize);
            this.breakpoints$.next(newBreakpoints);
        });

        // Track orientation changes
        fromEvent(window, 'orientationchange').pipe(
            debounceTime(100)
        ).subscribe(() => {
            // Delay to ensure viewport size is updated after orientation change
            setTimeout(() => {
                const newSize = this.getCurrentViewportSize();
                const newBreakpoints = this.getCurrentBreakpoints();

                this.viewportSize$.next(newSize);
                this.breakpoints$.next(newBreakpoints);
            }, 100);
        });
    }

    private getCurrentViewportSize(): ViewportSize {
        if (typeof window === 'undefined') {
            return { width: 1024, height: 768 }; // Default for SSR
        }

        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    private getCurrentBreakpoints(): Breakpoints {
        const width = this.getCurrentViewportSize().width;

        return {
            isMobile: width < this.breakpoints.mobile,
            isTablet: width >= this.breakpoints.mobile && width < this.breakpoints.desktop,
            isDesktop: width >= this.breakpoints.desktop && width < this.breakpoints.large,
            isLarge: width >= this.breakpoints.large && width < this.breakpoints.xl,
            isXL: width >= this.breakpoints.xl,
            isXXL: width >= this.breakpoints.xl
        };
    }
}