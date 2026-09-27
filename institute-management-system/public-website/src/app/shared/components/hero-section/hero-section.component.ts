import { Component, OnInit, OnDestroy, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { LoadingService } from '../../../services/loading.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { ScrollAnimationService } from '../../../services/scroll-animation.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { InstituteInfo } from '../../../models/institute-info.model';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollRevealDirective],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly apiService = inject(ApiService);
  private readonly loadingService = inject(LoadingService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly scrollAnimationService = inject(ScrollAnimationService);

  instituteInfo: InstituteInfo | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.loadInstituteInfo();
  }

  ngAfterViewInit(): void {
    // Initialize scroll animations for all scroll-reveal elements
    this.scrollAnimationService.observeAllScrollRevealElements();
  }

  ngOnDestroy(): void {
    // Cleanup is handled by the scroll animation service
  }

  private loadInstituteInfo(): void {
    this.isLoading = true;
    this.loadingService.show('Loading institute information...');

    this.apiService.getInstituteInfo().subscribe({
      next: (info) => {
        this.instituteInfo = info;
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading institute info:', error);
        // Set default values for demo purposes
        this.instituteInfo = {
          name: 'Excellence Institute',
          tagline: 'Empowering Minds, Shaping Futures',
          description: 'Join thousands of students who have transformed their careers with our comprehensive courses and expert instruction.',
          mission: 'To provide world-class education and training',
          vision: 'To be the leading institute in professional development',
          achievements: [],
          testimonials: [],
          contactInfo: {
            email: 'info@institute.com',
            phone: '+1-234-567-8900',
            address: '123 Education Street',
            city: 'Learning City',
            country: 'Education Country'
          }
        };
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  // Track CTA clicks from hero section
  trackHeroCtaClick(action: string): void {
    this.analyticsService.trackCtaClick(action, 'hero_section', {
      section: 'hero',
      instituteName: this.instituteInfo?.name || 'Excellence Institute'
    });
  }
}