import { Component, signal, inject, OnInit } from '@angular/core';
import { MainLayoutComponent } from './shared/components/layout/main-layout.component';
import { AppInitializationService } from './services/app-initialization.service';
import { AnalyticsInitService } from './services/analytics-init.service';
import { ServiceWorkerService } from './services/service-worker.service';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly appInitService = inject(AppInitializationService);
  private readonly analyticsInitService = inject(AnalyticsInitService);
  private readonly serviceWorkerService = inject(ServiceWorkerService);
  protected readonly title = signal('Institute Public Website');

  ngOnInit() {
    // Initialize analytics and monitoring
    this.initializeAnalytics();
    
    // Initialize API synchronization and data loading
    this.appInitService.initialize().then(() => {
      console.log('App initialization completed');
    }).catch(error => {
      console.error('App initialization failed:', error);
    });
  }

  private initializeAnalytics(): void {
    // Analytics initialization is handled by the AnalyticsInitService constructor
    // Service worker initialization is handled by the ServiceWorkerService constructor
    console.log('Analytics and monitoring services initialized');
  }
}
