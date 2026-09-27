import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="status-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>monitor_heart</mat-icon>
          System Status
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="status-item">
          <mat-icon [class]="backendStatus.class">{{ backendStatus.icon }}</mat-icon>
          <span>Backend API</span>
          <span class="status-text">{{ backendStatus.text }}</span>
        </div>
        
        <div class="status-item">
          <mat-icon [class]="frontendStatus.class">{{ frontendStatus.icon }}</mat-icon>
          <span>Frontend</span>
          <span class="status-text">{{ frontendStatus.text }}</span>
        </div>
        
        <div class="status-item">
          <mat-icon [class]="corsStatus.class">{{ corsStatus.icon }}</mat-icon>
          <span>CORS Configuration</span>
          <span class="status-text">{{ corsStatus.text }}</span>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="checkStatus()">
          <mat-icon>refresh</mat-icon>
          Refresh Status
        </button>
        <button mat-button (click)="testCourseCreation()">
          <mat-icon>science</mat-icon>
          Test Course API
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .status-card {
      margin: 20px;
      max-width: 500px;
    }
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .status-item:last-child {
      border-bottom: none;
    }
    
    .status-text {
      margin-left: auto;
      font-weight: 500;
    }
    
    .status-ok {
      color: #4caf50;
    }
    
    .status-error {
      color: #f44336;
    }
    
    .status-warning {
      color: #ff9800;
    }
  `]
})
export class SystemStatusComponent implements OnInit {
  backendStatus = { icon: 'help', class: 'status-warning', text: 'Checking...' };
  frontendStatus = { icon: 'check_circle', class: 'status-ok', text: 'Running' };
  corsStatus = { icon: 'help', class: 'status-warning', text: 'Checking...' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkStatus();
  }

  checkStatus(): void {
    // Check backend
    this.http.get('http://localhost:8080/admin/courses').subscribe({
      next: () => {
        this.backendStatus = { icon: 'check_circle', class: 'status-ok', text: 'Connected' };
        this.checkCORS();
      },
      error: (error) => {
        this.backendStatus = { icon: 'error', class: 'status-error', text: 'Offline' };
        this.corsStatus = { icon: 'error', class: 'status-error', text: 'Cannot test' };
      }
    });
  }

  checkCORS(): void {
    // Test CORS by making a request with Origin header
    const headers = { 'Origin': 'http://localhost:4200' };
    this.http.get('http://localhost:8080/admin/courses', { headers }).subscribe({
      next: () => {
        this.corsStatus = { icon: 'check_circle', class: 'status-ok', text: 'Configured' };
      },
      error: () => {
        this.corsStatus = { icon: 'error', class: 'status-error', text: 'Blocked' };
      }
    });
  }

  testCourseCreation(): void {
    const testCourse = {
      name: 'System Test Course',
      description: 'This is a test course created by the system status checker'
    };

    this.http.post('http://localhost:8080/admin/courses', testCourse).subscribe({
      next: (response) => {
        alert('✅ Course creation test successful! Course created: ' + JSON.stringify(response));
      },
      error: (error) => {
        alert('❌ Course creation test failed: ' + error.message);
      }
    });
  }
}