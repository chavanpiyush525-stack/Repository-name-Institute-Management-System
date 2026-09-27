import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { ConversionTrackingService } from './conversion-tracking.service';
import { MonitoringService } from './monitoring.service';
import { PerformanceService } from './performance.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsInitService {
  constructor(
    private analytics: AnalyticsService,
    private conversionTracking: ConversionTrackingService,
    private monitoring: MonitoringService,
    private performance: PerformanceService
  ) {
    this.initializeAnalytics();
  }

  private initializeAnalytics(): void {
    // Set user properties
    this.setUserProperties();
    
    // Track initial page load
    this.trackInitialPageLoad();
    
    // Set up custom dimensions
    this.setupCustomDimensions();
    
    // Track user engagement
    this.setupEngagementTracking();
    
    // Track scroll depth
    this.setupScrollDepthTracking();
    
    // Track time on page
    this.setupTimeOnPageTracking();
  }

  private setUserProperties(): void {
    // Device information
    this.analytics.setUserProperty('device_type', this.getDeviceType());
    this.analytics.setUserProperty('browser', this.getBrowser());
    this.analytics.setUserProperty('screen_resolution', `${screen.width}x${screen.height}`);
    
    // Connection information
    const connection = (navigator as any).connection;
    if (connection) {
      this.analytics.setUserProperty('connection_type', connection.effectiveType || 'unknown');
    }
    
    // Timezone
    this.analytics.setUserProperty('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    // Language
    this.analytics.setUserProperty('language', navigator.language);
  }

  private trackInitialPageLoad(): void {
    // Track page load with additional context
    this.analytics.trackEvent({
      action: 'page_load',
      category: 'navigation',
      label: window.location.pathname,
      custom_parameters: {
        referrer: document.referrer,
        load_time: performance.now(),
        page_title: document.title
      }
    });
  }

  private setupCustomDimensions(): void {
    // Set up custom dimensions for segmentation
    this.analytics.setCustomDimension(1, this.getDeviceType());
    this.analytics.setCustomDimension(2, this.getTrafficSource());
    this.analytics.setCustomDimension(3, this.getVisitorType());
  }

  private setupEngagementTracking(): void {
    let engagementStartTime = Date.now();
    let isEngaged = false;
    
    // Track engagement events
    const engagementEvents = ['click', 'scroll', 'keydown', 'mousemove'];
    
    engagementEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {
        if (!isEngaged) {
          isEngaged = true;
          this.analytics.trackEvent({
            action: 'user_engaged',
            category: 'engagement',
            label: eventType,
            custom_parameters: {
              time_to_engagement: Date.now() - engagementStartTime
            }
          });
        }
      }, { once: true });
    });
    
    // Track idle time
    let idleTimer: number;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        this.analytics.trackEvent({
          action: 'user_idle',
          category: 'engagement',
          label: '30_seconds',
          custom_parameters: {
            idle_duration: 30000
          }
        });
      }, 30000);
    };
    
    engagementEvents.forEach(eventType => {
      document.addEventListener(eventType, resetIdleTimer);
    });
    
    resetIdleTimer();
  }

  private setupScrollDepthTracking(): void {
    const scrollDepthMarkers = [25, 50, 75, 90, 100];
    const trackedMarkers = new Set<number>();
    
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      scrollDepthMarkers.forEach(marker => {
        if (scrollPercent >= marker && !trackedMarkers.has(marker)) {
          trackedMarkers.add(marker);
          this.analytics.trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: `${marker}%`,
            value: marker,
            custom_parameters: {
              page_url: window.location.href,
              scroll_percent: scrollPercent
            }
          });
        }
      });
    };
    
    let scrollTimeout: number;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(trackScrollDepth, 100);
    });
  }

  private setupTimeOnPageTracking(): void {
    const startTime = Date.now();
    
    // Track time on page at intervals
    const timeIntervals = [30, 60, 120, 300, 600]; // seconds
    
    timeIntervals.forEach(interval => {
      setTimeout(() => {
        this.analytics.trackEvent({
          action: 'time_on_page',
          category: 'engagement',
          label: `${interval}_seconds`,
          value: interval,
          custom_parameters: {
            page_url: window.location.href,
            time_spent: interval
          }
        });
      }, interval * 1000);
    });
    
    // Track time on page when user leaves
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      this.analytics.trackEvent({
        action: 'page_exit',
        category: 'engagement',
        label: 'time_spent',
        value: timeSpent,
        custom_parameters: {
          page_url: window.location.href,
          total_time_spent: timeSpent
        }
      });
    });
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    
    return 'desktop';
  }

  private getBrowser(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Unknown';
  }

  private getTrafficSource(): string {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for UTM parameters
    if (urlParams.get('utm_source')) {
      return urlParams.get('utm_source') || 'unknown';
    }
    
    // Check referrer
    if (referrer) {
      if (referrer.includes('google')) return 'google';
      if (referrer.includes('facebook')) return 'facebook';
      if (referrer.includes('twitter')) return 'twitter';
      if (referrer.includes('linkedin')) return 'linkedin';
      return 'referral';
    }
    
    return 'direct';
  }

  private getVisitorType(): string {
    // Simple visitor type detection based on localStorage
    const hasVisited = localStorage.getItem('has_visited');
    
    if (!hasVisited) {
      localStorage.setItem('has_visited', 'true');
      return 'new';
    }
    
    return 'returning';
  }
}