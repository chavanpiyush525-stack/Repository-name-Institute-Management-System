import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-test-connection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card style="margin: 20px; max-width: 600px;">
      <mat-card-header>
        <mat-card-title>🔧 Connection Test</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div style="margin: 16px 0;">
          <strong>Backend Status:</strong> {{ backendStatus }}
        </div>
        <div style="margin: 16px 0;">
          <strong>Last Test Result:</strong> {{ lastResult }}
        </div>
        <div style="margin: 16px 0;">
          <strong>Error Details:</strong> {{ errorDetails }}
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="testConnection()">
          Test Backend Connection
        </button>
        <button mat-raised-button color="accent" (click)="testCreateCourse()">
          Test Create Course
        </button>
      </mat-card-actions>
    </mat-card>
  `
})
export class TestConnectionComponent {
  backendStatus = 'Not tested';
  lastResult = 'None';
  errorDetails = 'None';

  constructor(private http: HttpClient) {}

  testConnection() {
    this.backendStatus = 'Testing...';
    this.http.get('http://localhost:8080/admin/courses').subscribe({
      next: (response) => {
        this.backendStatus = '✅ Connected';
        this.lastResult = 'GET /admin/courses successful';
        this.errorDetails = 'None';
        console.log('Backend response:', response);
      },
      error: (error) => {
        this.backendStatus = '❌ Failed';
        this.lastResult = 'Connection failed';
        this.errorDetails = JSON.stringify(error, null, 2);
        console.error('Backend error:', error);
      }
    });
  }

  testCreateCourse() {
    this.lastResult = 'Creating test course...';
    const testCourse = {
      name: 'Frontend Test Course',
      description: 'This course was created by the frontend test component'
    };

    this.http.post('http://localhost:8080/admin/courses', testCourse).subscribe({
      next: (response) => {
        this.lastResult = '✅ Course created successfully';
        this.errorDetails = 'Response: ' + JSON.stringify(response);
        console.log('Course created:', response);
      },
      error: (error) => {
        this.lastResult = '❌ Course creation failed';
        this.errorDetails = JSON.stringify(error, null, 2);
        console.error('Course creation error:', error);
      }
    });
  }
}