import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: { [key: string]: any };
}

export interface ConversionEvent {
  event_name: string;
  currency?: string;
  value?: number;
  transaction_id?: string;
  items?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isInitialized = false;
  private gaId = 'GA_MEASUREMENT_ID'; // Replace with actual GA4 Measurement ID

  constructor(private router: Router) {
    this.initializeGoogleAnalytics();
    this.trackPageViews();
  }

  private initializeGoogleAnalytics(): void {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    script.onload = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function() {
        (window as any).dataLayer.push(arguments);
      };

      gtag('js', new Date());
      gtag('config', this.gaId, {
        page_title: document.title,
        page_location: window.location.href
      });

      this.isInitialized = true;
    };
  }

  private trackPageViews(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (this.isInitialized) {
          gtag('config', this.gaId, {
            page_path: event.urlAfterRedirects,
            page_title: document.title,
            page_location: window.location.href
          });
        }
      });
  }

  trackEvent(event: AnalyticsEvent): void {
    if (this.isInitialized) {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }
  }

  trackConversion(conversion: ConversionEvent): void {
    if (this.isInitialized) {
      gtag('event', conversion.event_name, {
        currency: conversion.currency,
        value: conversion.value,
        transaction_id: conversion.transaction_id,
        items: conversion.items
      });
    }
  }

  // Course-specific tracking
  trackCourseView(courseId: string, courseName: string): void {
    this.trackEvent({
      action: 'view_course',
      category: 'courses',
      label: courseName,
      custom_parameters: {
        course_id: courseId,
        course_name: courseName
      }
    });
  }

  trackCourseInterest(courseId: string, courseName: string): void {
    this.trackEvent({
      action: 'show_interest',
      category: 'courses',
      label: courseName,
      custom_parameters: {
        course_id: courseId,
        course_name: courseName
      }
    });
  }

  // Contact form tracking
  trackContactFormSubmission(formType: string): void {
    this.trackEvent({
      action: 'form_submit',
      category: 'contact',
      label: formType
    });

    // Track as conversion
    this.trackConversion({
      event_name: 'generate_lead',
      value: 1
    });
  }

  trackContactFormStart(formType: string): void {
    this.trackEvent({
      action: 'form_start',
      category: 'contact',
      label: formType
    });
  }

  // Search tracking
  trackSearch(searchTerm: string, resultsCount: number): void {
    this.trackEvent({
      action: 'search',
      category: 'site_search',
      label: searchTerm,
      value: resultsCount,
      custom_parameters: {
        search_term: searchTerm,
        results_count: resultsCount
      }
    });
  }

  // Navigation tracking
  trackNavigation(destination: string, source: string): void {
    this.trackEvent({
      action: 'navigate',
      category: 'navigation',
      label: `${source} -> ${destination}`,
      custom_parameters: {
        destination,
        source
      }
    });
  }

  // Performance tracking
  trackPerformance(metricName: string, value: number, unit: string = 'ms'): void {
    this.trackEvent({
      action: 'performance_metric',
      category: 'performance',
      label: metricName,
      value: Math.round(value),
      custom_parameters: {
        metric_name: metricName,
        metric_value: value,
        unit
      }
    });
  }

  // Error tracking
  trackError(error: string, location: string, severity: 'low' | 'medium' | 'high' = 'medium'): void {
    this.trackEvent({
      action: 'error',
      category: 'errors',
      label: error,
      custom_parameters: {
        error_message: error,
        error_location: location,
        severity
      }
    });
  }

  // User engagement tracking
  trackEngagement(action: string, element: string, duration?: number): void {
    this.trackEvent({
      action: 'engagement',
      category: 'user_engagement',
      label: `${action}_${element}`,
      value: duration,
      custom_parameters: {
        engagement_action: action,
        element,
        duration
      }
    });
  }

  // CTA click tracking (alias for trackEngagement)
  trackCtaClick(action: string, location: string, metadata?: any): void {
    this.trackEvent({
      action: 'cta_click',
      category: 'cta',
      label: `${action}_${location}`,
      custom_parameters: {
        cta_action: action,
        location,
        ...metadata
      }
    });
  }

  // Form submission tracking
  trackFormSubmission(formType: string, location: string, formData?: any): void {
    this.trackEvent({
      action: 'form_submit',
      category: 'forms',
      label: `${formType}_${location}`,
      custom_parameters: {
        form_type: formType,
        location,
        form_data: formData
      }
    });
  }

  // Conversion metrics (placeholder)
  getConversionMetrics(): any {
    return {
      totalConversions: 0,
      conversionRate: 0,
      topConversions: []
    };
  }

  // Custom dimensions
  setCustomDimension(index: number, value: string): void {
    if (this.isInitialized) {
      gtag('config', this.gaId, {
        [`custom_map.dimension${index}`]: value
      });
    }
  }

  // User properties
  setUserProperty(propertyName: string, value: string): void {
    if (this.isInitialized) {
      gtag('set', { [propertyName]: value });
    }
  }
}