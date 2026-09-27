import { Injectable, ErrorHandler, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AnalyticsService } from './analytics.service';
import { PerformanceService } from './performance.service';

export interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  timestamp: Date;
  userAgent: string;
  userId?: string;
}

export interface PerformanceReport {
  metrics: any;
  url: string;
  timestamp: Date;
  userAgent: string;
  connectionType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringService implements ErrorHandler {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly enableErrorTracking = environment.enableErrorTracking;
  private readonly enableAnalytics = environment.enableAnalytics;
  private readonly version = environment.version;
  
  private errorQueue: ErrorReport[] = [];
  private performanceQueue: PerformanceReport[] = [];
  private maxQueueSize = 50;
  private sessionId: string;

  constructor(
    private analytics: AnalyticsService,
    private performance: PerformanceService
  ) {
    this.sessionId = this.generateSessionId();
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
    });

    // Performance monitoring
    this.startPerformanceMonitoring();

    // Send queued data periodically
    setInterval(() => {
      this.flushQueues();
    }, 30000); // Every 30 seconds
  }

  handleError(error: any): void {
    const errorReport: ErrorReport = {
      message: error.message || error.toString(),
      stack: error.stack,
      url: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    };

    this.queueError(errorReport);
    
    // Track in analytics
    this.analytics.trackError(
      errorReport.message,
      errorReport.url,
      this.getErrorSeverity(errorReport.message)
    );

    // Log to console in development
    if (!this.isProduction()) {
      console.error('Error caught by monitoring service:', error);
    }
  }

  private queueError(error: ErrorReport): void {
    this.errorQueue.push(error);
    
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }
  }

  private startPerformanceMonitoring(): void {
    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const metrics = this.performance.getMetrics();
        this.queuePerformanceReport({
          metrics,
          url: window.location.href,
          timestamp: new Date(),
          userAgent: navigator.userAgent,
          connectionType: this.getConnectionType()
        });

        // Track key metrics in analytics
        if (metrics.ttfb) {
          this.analytics.trackPerformance('time_to_first_byte', metrics.ttfb);
        }
        
        if (metrics.fcp) {
          this.analytics.trackPerformance('first_contentful_paint', metrics.fcp);
        }
        
        if (metrics.lcp) {
          this.analytics.trackPerformance('largest_contentful_paint', metrics.lcp);
        }
      }, 1000);
    });

    // Monitor resource performance
    setInterval(() => {
      this.performance.measureResourceTiming();
    }, 60000); // Every minute
  }

  private queuePerformanceReport(report: PerformanceReport): void {
    this.performanceQueue.push(report);
    
    if (this.performanceQueue.length > this.maxQueueSize) {
      this.performanceQueue.shift(); // Remove oldest report
    }
  }

  private flushQueues(): void {
    if (this.errorQueue.length > 0) {
      this.sendErrorReports([...this.errorQueue]);
      this.errorQueue = [];
    }

    if (this.performanceQueue.length > 0) {
      this.sendPerformanceReports([...this.performanceQueue]);
      this.performanceQueue = [];
    }
  }

  private sendErrorReports(errors: ErrorReport[]): void {
    if (!this.enableErrorTracking) return;

    // Send to backend monitoring service
    const errorData = {
      errors: errors.map(error => ({
        ...error,
        sessionId: this.sessionId,
        version: this.version,
        severity: this.getErrorSeverity(error.message)
      })),
      timestamp: new Date().toISOString()
    };

    this.http.post(`${this.apiUrl}/monitoring/errors/batch`, errorData).pipe(
      catchError(err => {
        console.error('Failed to send error reports to backend:', err);
        // Fallback to local storage
        this.storeErrorsLocally(errors);
        return of(null);
      })
    ).subscribe({
      next: () => {
        console.log(`Sent ${errors.length} error reports to monitoring service`);
      }
    });

    // Also track in analytics if enabled
    if (this.enableAnalytics) {
      errors.forEach(error => {
        this.analytics.trackEvent({
          action: 'error_report',
          category: 'monitoring',
          label: error.message,
          custom_parameters: {
            stack: error.stack,
            url: error.url,
            line_number: error.lineNumber,
            column_number: error.columnNumber,
            timestamp: error.timestamp.toISOString(),
            user_agent: error.userAgent,
            session_id: this.sessionId,
            version: this.version
          }
        });
      });
    }
  }

  private sendPerformanceReports(reports: PerformanceReport[]): void {
    // Send to backend monitoring service
    const performanceData = {
      reports: reports.map(report => ({
        ...report,
        sessionId: this.sessionId,
        version: this.version
      })),
      timestamp: new Date().toISOString()
    };

    this.http.post(`${this.apiUrl}/monitoring/performance/batch`, performanceData).pipe(
      catchError(err => {
        console.error('Failed to send performance reports to backend:', err);
        return of(null);
      })
    ).subscribe({
      next: () => {
        console.log(`Sent ${reports.length} performance reports to monitoring service`);
      }
    });

    // Also track in analytics if enabled
    if (this.enableAnalytics) {
      reports.forEach(report => {
        this.analytics.trackEvent({
          action: 'performance_report',
          category: 'monitoring',
          label: 'page_performance',
          custom_parameters: {
            metrics: report.metrics,
            url: report.url,
            timestamp: report.timestamp.toISOString(),
            user_agent: report.userAgent,
            connection_type: report.connectionType,
            session_id: this.sessionId,
            version: this.version
          }
        });
      });
    }
  }

  private getErrorSeverity(message: string): 'low' | 'medium' | 'high' {
    const highSeverityKeywords = ['uncaught', 'fatal', 'critical', 'security'];
    const mediumSeverityKeywords = ['error', 'exception', 'failed', 'timeout'];

    const lowerMessage = message.toLowerCase();
    
    if (highSeverityKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'high';
    }
    
    if (mediumSeverityKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  private getConnectionType(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection ? connection.effectiveType || connection.type || 'unknown' : 'unknown';
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
  }

  // Public methods for manual tracking
  trackCustomError(message: string, context?: any): void {
    this.handleError({
      message,
      stack: new Error().stack,
      context
    });
  }

  trackPerformanceMetric(name: string, value: number): void {
    this.analytics.trackPerformance(name, value);
  }

  getErrorReports(): ErrorReport[] {
    return [...this.errorQueue];
  }

  getPerformanceReports(): PerformanceReport[] {
    return [...this.performanceQueue];
  }

  clearQueues(): void {
    this.errorQueue = [];
    this.performanceQueue = [];
  }

  // Data consistency monitoring
  trackDataConsistency(dataType: string, localCount: number, serverCount: number): void {
    if (localCount !== serverCount) {
      const consistencyData = {
        dataType,
        localCount,
        serverCount,
        discrepancy: Math.abs(localCount - serverCount),
        timestamp: new Date().toISOString(),
        url: window.location.href,
        sessionId: this.sessionId,
        version: this.version
      };

      this.http.post(`${this.apiUrl}/monitoring/data-consistency`, consistencyData).pipe(
        catchError(err => {
          console.error('Failed to send data consistency report:', err);
          return of(null);
        })
      ).subscribe();

      console.warn('Data consistency issue detected:', consistencyData);
    }
  }

  // API response monitoring
  trackApiResponse(endpoint: string, responseTime: number, status: number, success: boolean): void {
    const apiData = {
      endpoint,
      responseTime,
      status,
      success,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      version: this.version
    };

    this.http.post(`${this.apiUrl}/monitoring/api-performance`, apiData).pipe(
      catchError(err => {
        console.error('Failed to send API performance data:', err);
        return of(null);
      })
    ).subscribe();
  }

  // System health check
  checkSystemHealth(): void {
    const healthData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      connectionType: this.getConnectionType(),
      onlineStatus: navigator.onLine,
      sessionId: this.sessionId,
      version: this.version,
      buildTimestamp: environment.buildTimestamp
    };

    this.http.post(`${this.apiUrl}/monitoring/health`, healthData).pipe(
      catchError(err => {
        console.error('Failed to send health data:', err);
        return of(null);
      })
    ).subscribe();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private storeErrorsLocally(errors: ErrorReport[]): void {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('pendingErrors') || '[]');
      const updatedErrors = [...storedErrors, ...errors];
      // Keep only last 20 errors to prevent storage overflow
      if (updatedErrors.length > 20) {
        updatedErrors.splice(0, updatedErrors.length - 20);
      }
      localStorage.setItem('pendingErrors', JSON.stringify(updatedErrors));
    } catch (e) {
      console.error('Failed to store errors locally:', e);
    }
  }

  // Send pending errors when connection is restored
  sendPendingErrors(): void {
    try {
      const errors = JSON.parse(localStorage.getItem('pendingErrors') || '[]');
      if (errors.length > 0) {
        this.sendErrorReports(errors);
        localStorage.removeItem('pendingErrors');
      }
    } catch (e) {
      console.error('Failed to send pending errors:', e);
    }
  }
}