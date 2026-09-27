import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  template: `
    <div class="header">
      <h1>Courses</h1>
      <button mat-raised-button color="primary" routerLink="/courses/new">
        <mat-icon>add</mat-icon>
        Add Course
      </button>
    </div>

    <mat-card>
      <mat-card-content>
        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="!loading && courses.length === 0" class="no-data">
          <p>No courses found. <a routerLink="/courses/new">Create your first course</a></p>
        </div>

        <table mat-table [dataSource]="courses" *ngIf="!loading && courses.length > 0">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let course">{{ course.id }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let course">{{ course.name }}</td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let course">{{ course.description }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let course">
              <button mat-icon-button [routerLink]="['/courses/edit', course.id]" color="primary">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteCourse(course)" color="warn">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    
    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    
    .mat-mdc-table {
      width: 100%;
    }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  showTable = false;
  searchTerm = '';
  selectedCategory = 'all';
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading courses:', error);
        this.snackBar.open('Error loading courses', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deleteCourse(course: Course): void {
    if (confirm(`Are you sure you want to delete "${course.name}"?`)) {
      this.courseService.deleteCourse(course.id!).subscribe({
        next: () => {
          this.snackBar.open('Course deleted successfully', 'Close', { duration: 3000 });
          this.loadCourses();
        },
        error: (error: any) => {
          console.error('Error deleting course:', error);
          this.snackBar.open('Error deleting course', 'Close', { duration: 3000 });
        }
      });
    }
  }
}