import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  screenReaderMode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private document = inject(DOCUMENT);
  
  private preferencesSubject = new BehaviorSubject<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    screenReaderMode: false
  });

  public preferences$ = this.preferencesSubject.asObservable();
  
  private focusHistory: HTMLElement[] = [];
  private skipLinksContainer?: HTMLElement;

  constructor() {
    this.initializeAccessibilityFeatures();
    this.detectUserPreferences();
    this.setupKeyboardNavigation();
  }

  private initializeAccessibilityFeatures(): void {
    // Create skip links
    this.createSkipLinks();
    
    // Set up focus management
    this.setupFocusManagement();
    
    // Monitor for accessibility preference changes
    this.monitorPreferenceChanges();
  }

  private createSkipLinks(): void {
    const skipLinks = this.document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.setAttribute('aria-label', 'Skip navigation links');
    
    const skipToMain = this.document.createElement('a');
    skipToMain.href = '#main-content';
    skipToMain.className = 'skip-link';
    skipToMain.textContent = 'Skip to main content';
    skipToMain.setAttribute('aria-label', 'Skip to main content');
    
    const skipToNav = this.document.createElement('a');
    skipToNav.href = '#main-navigation';
    skipToNav.className = 'skip-link';
    skipToNav.textContent = 'Skip to navigation';
    skipToNav.setAttribute('aria-label', 'Skip to navigation');
    
    skipLinks.appendChild(skipToMain);
    skipLinks.appendChild(skipToNav);
    
    this.document.body.insertBefore(skipLinks, this.document.body.firstChild);
    this.skipLinksContainer = skipLinks;
  }

  private setupFocusManagement(): void {
    // Track focus for better navigation
    fromEvent(this.document, 'focusin')
      .pipe(debounceTime(100))
      .subscribe((event: Event) => {
        const target = event.target as HTMLElement;
        if (target && this.isFocusable(target)) {
          this.addToFocusHistory(target);
        }
      });
  }

  private setupKeyboardNavigation(): void {
    fromEvent<KeyboardEvent>(this.document, 'keydown').subscribe((event: KeyboardEvent) => {
      // Handle escape key for modal/dropdown closing
      if (event.key === 'Escape') {
        this.handleEscapeKey();
      }
      
      // Handle tab navigation improvements
      if (event.key === 'Tab') {
        this.handleTabNavigation(event);
      }
    });
  }

  private detectUserPreferences(): void {
    const preferences: Partial<AccessibilityPreferences> = {};
    
    // Detect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      preferences.reducedMotion = true;
    }
    
    // Detect high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      preferences.highContrast = true;
    }
    
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('accessibility-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        Object.assign(preferences, parsed);
      } catch (error) {
        console.warn('Failed to parse saved accessibility preferences');
      }
    }
    
    this.updatePreferences(preferences);
  }

  private monitorPreferenceChanges(): void {
    // Monitor system preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)')
      .addEventListener('change', (e) => {
        this.updatePreferences({ reducedMotion: e.matches });
      });
    
    window.matchMedia('(prefers-contrast: high)')
      .addEventListener('change', (e) => {
        this.updatePreferences({ highContrast: e.matches });
      });
  }

  public updatePreferences(updates: Partial<AccessibilityPreferences>): void {
    const current = this.preferencesSubject.value;
    const updated = { ...current, ...updates };
    
    this.preferencesSubject.next(updated);
    this.applyPreferences(updated);
    
    // Save to localStorage
    localStorage.setItem('accessibility-preferences', JSON.stringify(updated));
  }

  private applyPreferences(preferences: AccessibilityPreferences): void {
    const body = this.document.body;
    
    // Apply reduced motion
    body.classList.toggle('reduce-motion', preferences.reducedMotion);
    
    // Apply high contrast
    body.classList.toggle('high-contrast', preferences.highContrast);
    
    // Apply font size
    body.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    body.classList.add(`font-${preferences.fontSize}`);
    
    // Apply screen reader mode
    body.classList.toggle('screen-reader-mode', preferences.screenReaderMode);
  }

  public focusElement(element: HTMLElement | string): void {
    const target = typeof element === 'string' 
      ? this.document.getElementById(element) || this.document.querySelector(element)
      : element;
    
    if (target) {
      target.focus();
      this.addToFocusHistory(target as HTMLElement);
    }
  }

  public focusFirstFocusableElement(container: HTMLElement): void {
    const focusable = this.getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  public focusLastFocusableElement(container: HTMLElement): void {
    const focusable = this.getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus();
    }
  }

  public trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (this.document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (this.document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  public announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = this.document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    this.document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      this.document.body.removeChild(announcement);
    }, 1000);
  }

  public getFocusableElements(container: HTMLElement = this.document.body): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => this.isFocusable(element as HTMLElement)) as HTMLElement[];
  }

  private isFocusable(element: HTMLElement): boolean {
    if (!element || element.offsetParent === null) return false;
    if (element.hasAttribute('disabled')) return false;
    if (element.getAttribute('aria-hidden') === 'true') return false;
    if (element.tabIndex < 0) return false;
    
    return true;
  }

  private addToFocusHistory(element: HTMLElement): void {
    this.focusHistory = this.focusHistory.filter(el => el !== element);
    this.focusHistory.push(element);
    
    // Keep only last 10 focused elements
    if (this.focusHistory.length > 10) {
      this.focusHistory.shift();
    }
  }

  private handleEscapeKey(): void {
    // Close any open dropdowns, modals, etc.
    const openDropdowns = this.document.querySelectorAll('[aria-expanded="true"]');
    openDropdowns.forEach(dropdown => {
      if (dropdown instanceof HTMLElement) {
        dropdown.setAttribute('aria-expanded', 'false');
        dropdown.click(); // Trigger close
      }
    });
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    // Improve tab navigation by ensuring proper focus order
    const activeElement = this.document.activeElement as HTMLElement;
    
    if (activeElement && activeElement.classList.contains('skip-link')) {
      // Handle skip link activation
      event.preventDefault();
      const targetId = activeElement.getAttribute('href')?.substring(1);
      if (targetId) {
        const target = this.document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }

  public getAccessibilityReport(): any {
    return {
      preferences: this.preferencesSubject.value,
      focusableElementsCount: this.getFocusableElements().length,
      skipLinksPresent: !!this.skipLinksContainer,
      focusHistoryLength: this.focusHistory.length
    };
  }
}