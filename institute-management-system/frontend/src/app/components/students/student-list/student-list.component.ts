import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="creative-header fade-in">
      <h1>👥 Student Directory</h1>
      <p>Explore and manage your institute's student community</p>
    </div>

    <div class="student-stats fade-in" style="animation-delay: 0.1s">
      <div class="stat-card">
        <div class="stat-icon">
          <mat-icon>people</mat-icon>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ students.length }}</span>
          <span class="stat-label">Total Students</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <mat-icon>school</mat-icon>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ getActiveStudents() }}</span>
          <span class="stat-label">Active Learners</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <mat-icon>email</mat-icon>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ getUniqueEmails() }}</span>
          <span class="stat-label">Email Contacts</span>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="loading-spinner fade-in">
      <mat-spinner diameter="60"></mat-spinner>
      <p class="loading-text">Loading student directory...</p>
    </div>

    <div *ngIf="!loading && students.length === 0" class="no-data fade-in">
      <mat-card class="empty-state-card">
        <mat-card-content>
          <div class="empty-state-content">
            <mat-icon class="no-data-icon">people_outline</mat-icon>
            <h3>No Students Registered</h3>
            <p>The student directory is currently empty. Students will appear here once they register through the system or are added by administrators.</p>
            <div class="info-note">
              <mat-icon>info</mat-icon>
              <span>This is a read-only view. Student registration is handled through separate enrollment processes.</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <div class="students-container fade-in" *ngIf="!loading && students.length > 0" style="animation-delay: 0.2s">
      <!-- View Toggle -->
      <div class="view-controls">
        <button mat-button class="view-toggle-btn" (click)="toggleView()">
          <mat-icon>{{ showCards ? 'table_view' : 'view_module' }}</mat-icon>
          {{ showCards ? 'Table View' : 'Card View' }}
        </button>
      </div>

      <!-- Card View -->
      <div class="students-grid" *ngIf="showCards">
        <div class="student-card slide-in-left" 
             *ngFor="let student of students; let i = index"
             [style.animation-delay]="(i * 0.1) + 's'">
          <div class="student-header">
            <div class="student-avatar">
              <mat-icon>person</mat-icon>
            </div>
            <div class="student-info">
              <h3>{{ student.name }}</h3>
              <span class="student-id">ID: {{ student.id }}</span>
            </div>
            <div class="student-status">
              <div class="status-indicator active"></div>
            </div>
          </div>
          
          <div class="student-details">
            <div class="detail-item">
              <mat-icon>email</mat-icon>
              <span>{{ student.email }}</span>
            </div>
            <div class="detail-item">
              <mat-icon>school</mat-icon>
              <span>Active Student</span>
            </div>
          </div>
          
          <div class="student-actions">
            <button mat-button class="action-btn">
              <mat-icon>visibility</mat-icon>
              View Profile
            </button>
            <button mat-button class="action-btn">
              <mat-icon>email</mat-icon>
              Contact
            </button>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <mat-card class="table-container" *ngIf="!showCards">
        <mat-card-content>
          <table mat-table [dataSource]="students" class="students-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>
                <div class="header-content">
                  <mat-icon>tag</mat-icon>
                  <span>Student ID</span>
                </div>
              </th>
              <td mat-cell *matCellDef="let student">
                <span class="student-id-badge">{{ student.id }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>
                <div class="header-content">
                  <mat-icon>person</mat-icon>
                  <span>Full Name</span>
                </div>
              </th>
              <td mat-cell *matCellDef="let student">
                <div class="student-name-cell">
                  <div class="name-avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div class="name-info">
                    <span class="name">{{ student.name }}</span>
                    <span class="status">Active Student</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>
                <div class="header-content">
                  <mat-icon>email</mat-icon>
                  <span>Email Address</span>
                </div>
              </th>
              <td mat-cell *matCellDef="let student">
                <div class="email-cell">
                  <mat-icon>email</mat-icon>
                  <span>{{ student.email }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>
                <div class="header-content">
                  <mat-icon>settings</mat-icon>
                  <span>Actions</span>
                </div>
              </th>
              <td mat-cell *matCellDef="let student">
                <div class="table-actions">
                  <button mat-icon-button class="action-btn view-btn">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button class="action-btn contact-btn">
                    <mat-icon>email</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumnsWithActions"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumnsWithActions;" class="table-row"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .student-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(102, 126, 234, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
    }
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .stat-icon mat-icon {
      font-size: 1.8rem !important;
      width: 1.8rem !important;
      height: 1.8rem !important;
    }
    
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    
    .stat-number {
      font-size: 2.2rem;
      font-weight: 700;
      color: #333;
      font-family: 'Poppins', sans-serif;
      line-height: 1;
    }
    
    .stat-label {
      color: #666;
      font-size: 0.95rem;
      font-weight: 500;
      margin-top: 4px;
    }
    
    .empty-state-card {
      background: rgba(255, 255, 255, 0.95) !important;
      border-radius: 25px !important;
      border: 2px dashed rgba(102, 126, 234, 0.3) !important;
    }
    
    .empty-state-content {
      text-align: center;
      padding: 60px 40px;
    }
    
    .info-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 20px;
      padding: 12px 20px;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 12px;
      color: #667eea;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .info-note mat-icon {
      font-size: 1.2rem !important;
      width: 1.2rem !important;
      height: 1.2rem !important;
    }
    
    .view-controls {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }
    
    .view-toggle-btn {
      background: rgba(102, 126, 234, 0.1) !important;
      color: #667eea !important;
      border-radius: 20px !important;
      padding: 8px 20px !important;
      font-weight: 500 !important;
    }
    
    .view-toggle-btn:hover {
      background: rgba(102, 126, 234, 0.2) !important;
    }
    
    .students-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }
    
    .student-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(102, 126, 234, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .student-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .student-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    }
    
    .student-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .student-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .student-avatar mat-icon {
      font-size: 1.8rem !important;
      width: 1.8rem !important;
      height: 1.8rem !important;
    }
    
    .student-info {
      flex: 1;
    }
    
    .student-info h3 {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
      font-size: 1.3rem;
    }
    
    .student-id {
      color: #666;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .student-status {
      display: flex;
      align-items: center;
    }
    
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #4caf50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
      animation: pulse 2s infinite;
    }
    
    .student-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 10px;
      color: #666;
    }
    
    .detail-item mat-icon {
      color: #667eea;
      font-size: 1.2rem !important;
      width: 1.2rem !important;
      height: 1.2rem !important;
    }
    
    .student-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    
    .action-btn {
      background: rgba(102, 126, 234, 0.1) !important;
      color: #667eea !important;
      border-radius: 15px !important;
      padding: 8px 16px !important;
      font-size: 0.9rem !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
    }
    
    .action-btn:hover {
      background: rgba(102, 126, 234, 0.2) !important;
      transform: translateY(-2px);
    }
    
    .table-container {
      background: rgba(255, 255, 255, 0.95) !important;
      border-radius: 20px !important;
    }
    
    .students-table {
      width: 100%;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600 !important;
    }
    
    .header-content mat-icon {
      font-size: 1.2rem !important;
      width: 1.2rem !important;
      height: 1.2rem !important;
    }
    
    .student-id-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.85rem;
    }
    
    .student-name-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .name-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .name-info {
      display: flex;
      flex-direction: column;
    }
    
    .name {
      font-weight: 600;
      color: #333;
      font-size: 1.1rem;
    }
    
    .status {
      color: #4caf50;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .email-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }
    
    .email-cell mat-icon {
      color: #667eea;
      font-size: 1.1rem !important;
      width: 1.1rem !important;
      height: 1.1rem !important;
    }
    
    .table-actions {
      display: flex;
      gap: 8px;
    }
    
    .view-btn {
      background: rgba(102, 126, 234, 0.1) !important;
      color: #667eea !important;
    }
    
    .contact-btn {
      background: rgba(76, 175, 80, 0.1) !important;
      color: #4caf50 !important;
    }
    
    .table-row {
      transition: all 0.3s ease;
    }
    
    .table-row:hover {
      background-color: rgba(102, 126, 234, 0.05) !important;
    }
    
    @media (max-width: 768px) {
      .student-stats {
        grid-template-columns: 1fr;
      }
      
      .students-grid {
        grid-template-columns: 1fr;
      }
      
      .student-actions {
        flex-direction: column;
      }
      
      .view-controls {
        justify-content: center;
      }
    }
  `]
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  loading = false;
  showCards = true;
  displayedColumns: string[] = ['id', 'name', 'email'];
  displayedColumnsWithActions: string[] = ['id', 'name', 'email', 'actions'];

  constructor(
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  toggleView(): void {
    this.showCards = !this.showCards;
  }

  getActiveStudents(): number {
    return this.students.length; // All students are considered active for now
  }

  getUniqueEmails(): number {
    const uniqueEmails = new Set(this.students.map(s => s.email));
    return uniqueEmails.size;
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAllStudents().subscribe({
      next: (students: Student[]) => {
        this.students = students;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading students:', error);
        this.snackBar.open('Error loading students', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}