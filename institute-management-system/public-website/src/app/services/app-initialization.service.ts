import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializationService {
  private readonly apiService = inject(ApiService);

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      // Initialize API synchronization
      this.apiService.initializeSync();
      
      // Perform initial data load
      this.apiService.getCourses().subscribe({
        next: () => {
          console.log('Initial course data loaded');
        },
        error: (error) => {
          console.warn('Failed to load initial course data:', error);
        },
        complete: () => {
          resolve();
        }
      });
    });
  }
}