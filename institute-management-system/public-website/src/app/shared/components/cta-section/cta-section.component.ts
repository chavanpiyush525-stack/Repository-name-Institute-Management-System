import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.scss'
})
export class CtaSectionComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly analyticsService = inject(AnalyticsService);
  
  popularCourses: Course[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadPopularCourses();
  }

  private loadPopularCourses(): void {
    this.isLoading = true;
    
    this.apiService.getCourses().subscribe({
      next: (courses) => {
        // Get first 3 courses as popular courses
        this.popularCourses = courses.slice(0, 3);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        // Set default popular courses for demo
        this.popularCourses = [
          {
            id: 1,
            name: 'Full Stack Development',
            description: 'Master modern web development with React, Node.js, and databases',
            duration: '12 weeks',
            level: 'Intermediate',
            price: 999
          },
          {
            id: 2,
            name: 'Data Science Bootcamp',
            description: 'Learn Python, machine learning, and data visualization',
            duration: '16 weeks',
            level: 'Beginner',
            price: 1299
          },
          {
            id: 3,
            name: 'UX/UI Design',
            description: 'Create beautiful and user-friendly digital experiences',
            duration: '10 weeks',
            level: 'Beginner',
            price: 799
          }
        ];
        this.isLoading = false;
      }
    });
  }

  // Track CTA clicks for conversion analytics
  trackCtaClick(action: string, location: string, metadata?: Record<string, any>): void {
    this.analyticsService.trackCtaClick(action, location, metadata);
  }
}