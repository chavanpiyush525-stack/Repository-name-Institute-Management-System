import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { Course, InstituteInfo } from './models';

@Component({
  selector: 'app-test-api-integration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>API Integration Test</h2>
      
      <div style="margin: 20px 0;">
        <h3>Connection Status: 
          <span [style.color]="connectionStatus() === 'online' ? 'green' : 'red'">
            {{ connectionStatus() }}
          </span>
        </h3>
      </div>

      <div style="margin: 20px 0;">
        <h3>Health Check</h3>
        <button (click)="testHealthCheck()" [disabled]="loading">Test Health</button>
        <div *ngIf="healthResult">{{ healthResult }}</div>
      </div>

      <div style="margin: 20px 0;">
        <h3>Courses API</h3>
        <button (click)="testCourses()" [disabled]="loading">Load Courses</button>
        <div *ngIf="coursesResult">
          <p>Courses loaded: {{ courses.length }}</p>
          <pre>{{ coursesResult }}</pre>
        </div>
      </div>

      <div style="margin: 20px 0;">
        <h3>Institute Info API</h3>
        <button (click)="testInstituteInfo()" [disabled]="loading">Load Institute Info</button>
        <div *ngIf="instituteInfoResult">
          <pre>{{ instituteInfoResult }}</pre>
        </div>
      </div>

      <div style="margin: 20px 0;">
        <h3>Contact Form API</h3>
        <button (click)="testContactForm()" [disabled]="loading">Test Contact Form</button>
        <div *ngIf="contactResult">{{ contactResult }}</div>
      </div>

      <div *ngIf="error" style="color: red; margin: 20px 0;">
        <h3>Error:</h3>
        <p>{{ error }}</p>
      </div>
    </div>
  `
})
export class TestApiIntegrationComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  loading = false;
  error: string | null = null;
  healthResult: string | null = null;
  coursesResult: string | null = null;
  instituteInfoResult: string | null = null;
  contactResult: string | null = null;
  courses: Course[] = [];

  connectionStatus = this.apiService.isOnline;

  ngOnInit() {
    // Initialize sync
    this.apiService.initializeSync();
    console.log('API Integration Test Component initialized');
  }

  testHealthCheck() {
    this.loading = true;
    this.error = null;
    this.healthResult = null;

    this.apiService.checkHealth().subscribe({
      next: (result) => {
        this.healthResult = JSON.stringify(result, null, 2);
        this.loading = false;
      },
      error: (error) => {
        this.error = `Health check failed: ${error.message}`;
        this.loading = false;
      }
    });
  }

  testCourses() {
    this.loading = true;
    this.error = null;
    this.coursesResult = null;

    this.apiService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.coursesResult = JSON.stringify(courses, null, 2);
        this.loading = false;
      },
      error: (error) => {
        this.error = `Courses API failed: ${error.message}`;
        this.loading = false;
      }
    });
  }

  testInstituteInfo() {
    this.loading = true;
    this.error = null;
    this.instituteInfoResult = null;

    this.apiService.getInstituteInfo().subscribe({
      next: (info) => {
        this.instituteInfoResult = JSON.stringify(info, null, 2);
        this.loading = false;
      },
      error: (error) => {
        this.error = `Institute Info API failed: ${error.message}`;
        this.loading = false;
      }
    });
  }

  testContactForm() {
    this.loading = true;
    this.error = null;
    this.contactResult = null;

    const testForm = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'API Integration Test',
      message: 'This is a test message from the API integration test.'
    };

    this.apiService.submitContactForm(testForm).subscribe({
      next: (result) => {
        this.contactResult = JSON.stringify(result, null, 2);
        this.loading = false;
      },
      error: (error) => {
        this.error = `Contact Form API failed: ${error.message}`;
        this.loading = false;
      }
    });
  }
}