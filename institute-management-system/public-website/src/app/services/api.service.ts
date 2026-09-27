import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, retry, catchError, timeout, BehaviorSubject, timer, switchMap, shareReplay } from 'rxjs';
import { Course, ContactForm, InstituteInfo, InstituteInfoResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly publicUrl = environment.publicApiUrl;
  private readonly requestTimeout = 10000; // 10 seconds
  private readonly retryAttempts = 2;
  
  // Real-time data synchronization
  private readonly coursesCache$ = new BehaviorSubject<Course[]>([]);
  private readonly instituteInfoCache$ = new BehaviorSubject<InstituteInfo | null>(null);
  private readonly lastCoursesFetch = signal<number>(0);
  private readonly lastInstituteInfoFetch = signal<number>(0);
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  // Connection status
  private readonly connectionStatus = signal<'online' | 'offline' | 'error'>('online');

  // Public readonly signals
  readonly courses$ = this.coursesCache$.asObservable();
  readonly instituteInfo$ = this.instituteInfoCache$.asObservable();
  readonly isOnline = this.connectionStatus.asReadonly();

  // Course-related API calls with caching and real-time sync
  getCourses(forceRefresh: boolean = false): Observable<Course[]> {
    const now = Date.now();
    const lastFetch = this.lastCoursesFetch();
    const shouldRefresh = forceRefresh || (now - lastFetch) > this.cacheTimeout;
    
    if (!shouldRefresh && this.coursesCache$.value.length > 0) {
      return this.coursesCache$.asObservable();
    }

    return this.http.get<Course[]>(`${this.publicUrl}/courses`).pipe(
      timeout(this.requestTimeout),
      retry(this.retryAttempts),
      catchError(error => {
        // If we have cached data, return it on error
        if (this.coursesCache$.value.length > 0) {
          console.warn('Using cached courses due to API error:', error);
          return this.coursesCache$.asObservable();
        }
        return this.handleError(error);
      }),
      shareReplay(1)
    );
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.publicUrl}/courses/${id}`).pipe(
      timeout(this.requestTimeout),
      retry(this.retryAttempts),
      catchError(this.handleError)
    );
  }

  // Refresh courses data and update cache
  refreshCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.publicUrl}/courses`).pipe(
      timeout(this.requestTimeout),
      retry(this.retryAttempts),
      catchError(error => {
        console.error('Failed to refresh courses:', error);
        // Return cached data if available
        if (this.coursesCache$.value.length > 0) {
          return this.coursesCache$.asObservable();
        }
        return this.handleError(error);
      }),
      shareReplay(1)
    );
  }

  // Contact form submission with enhanced error handling
  submitContactForm(contactForm: ContactForm): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(`${this.publicUrl}/contact`, contactForm).pipe(
      timeout(this.requestTimeout),
      catchError(this.handleError)
    );
  }

  // Institute information with caching
  getInstituteInfo(forceRefresh: boolean = false): Observable<InstituteInfo> {
    const now = Date.now();
    const lastFetch = this.lastInstituteInfoFetch();
    const shouldRefresh = forceRefresh || (now - lastFetch) > this.cacheTimeout;
    
    if (!shouldRefresh && this.instituteInfoCache$.value) {
      return this.instituteInfoCache$.asObservable().pipe(
        switchMap(info => info ? [info] : [])
      );
    }

    return this.http.get<InstituteInfoResponse>(`${this.publicUrl}/institute-info`).pipe(
      timeout(this.requestTimeout),
      retry(this.retryAttempts),
      switchMap(response => {
        // Transform backend response to frontend model
        const instituteInfo: InstituteInfo = {
          name: response.name,
          tagline: response.tagline,
          description: response.description,
          mission: response.mission,
          vision: response.vision,
          contactInfo: {
            email: response.contactInfo.email,
            phone: response.contactInfo.phone,
            address: response.contactInfo.address,
            city: '', // Not provided by backend
            country: '', // Not provided by backend
            officeHours: response.contactInfo.officeHours
          },
          statistics: response.statistics
        };
        return [instituteInfo];
      }),
      catchError(error => {
        // If we have cached data, return it on error
        if (this.instituteInfoCache$.value) {
          console.warn('Using cached institute info due to API error:', error);
          return this.instituteInfoCache$.asObservable().pipe(
            switchMap(info => info ? [info] : [])
          );
        }
        return this.handleError(error);
      }),
      shareReplay(1)
    );
  }

  // Health check for connection monitoring
  checkHealth(): Observable<{status: string, timestamp: string}> {
    return this.http.get<{status: string, timestamp: string}>(`${this.publicUrl}/health`).pipe(
      timeout(5000), // Shorter timeout for health checks
      catchError(error => {
        this.connectionStatus.set('error');
        return throwError(() => error);
      })
    );
  }

  // Initialize real-time synchronization
  initializeSync(): void {
    // Set up periodic health checks
    timer(0, 30000).subscribe(() => { // Check every 30 seconds
      this.checkHealth().subscribe({
        next: () => this.connectionStatus.set('online'),
        error: () => this.connectionStatus.set('offline')
      });
    });

    // Set up periodic data refresh
    timer(0, this.cacheTimeout).subscribe(() => {
      // Refresh courses
      this.refreshCourses().subscribe({
        next: courses => {
          this.coursesCache$.next(courses);
          this.lastCoursesFetch.set(Date.now());
        },
        error: error => {
          console.warn('Failed to refresh courses during sync:', error);
        }
      });

      // Refresh institute info
      this.getInstituteInfo(true).subscribe({
        next: info => {
          this.instituteInfoCache$.next(info);
          this.lastInstituteInfoFetch.set(Date.now());
        },
        error: error => {
          console.warn('Failed to refresh institute info during sync:', error);
        }
      });
    });
  }

  // Enhanced error handling with connection status updates
  private handleError(error: HttpErrorResponse | any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    // Update connection status based on error type
    if (error.status === 0 || error.name === 'TimeoutError') {
      this.connectionStatus.set('offline');
    } else {
      this.connectionStatus.set('error');
    }
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network Error: ${error.error.message}`;
    } else if (error.name === 'TimeoutError') {
      errorMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error instanceof HttpErrorResponse) {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Invalid request. Please check your input.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          errorMessage = `Server Error (${error.status}): ${error.error?.message || error.message}`;
      }
    }
    
    console.error('API Error:', {
      status: error.status,
      message: error.message,
      url: error.url,
      timestamp: new Date().toISOString()
    });
    
    return throwError(() => new Error(errorMessage));
  }

  // Utility methods for cache management
  clearCache(): void {
    this.coursesCache$.next([]);
    this.instituteInfoCache$.next(null);
    this.lastCoursesFetch.set(0);
    this.lastInstituteInfoFetch.set(0);
  }

  getCachedCourses(): Course[] {
    return this.coursesCache$.value;
  }

  getCachedInstituteInfo(): InstituteInfo | null {
    return this.instituteInfoCache$.value;
  }
}