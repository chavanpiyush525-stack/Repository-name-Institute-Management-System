import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../services/analytics.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-dashboard.component.html',
  styleUrl: './analytics-dashboard.component.scss'
})
export class AnalyticsDashboardComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);

  metrics: any = {};
  isVisible = false;
  environment = environment;
  Object = Object;

  ngOnInit(): void {
    this.loadMetrics();
    
    // Show dashboard only in development mode or for admin users
    this.isVisible = !environment.production || this.isAdminUser();
  }

  private loadMetrics(): void {
    this.metrics = this.analyticsService.getConversionMetrics();
  }

  private isAdminUser(): boolean {
    // In a real implementation, this would check user permissions
    // For now, we'll show it in development mode only
    return false;
  }

  refreshMetrics(): void {
    this.loadMetrics();
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }
}