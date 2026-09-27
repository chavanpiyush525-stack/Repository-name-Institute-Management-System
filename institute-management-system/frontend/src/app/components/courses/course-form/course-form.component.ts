import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="creative-form-container">
      <!-- Animated Background -->
      <div class="background-animation">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>

      <!-- Header Section -->
      <div class="creative-header fade-in">
        <div class="header-content">
          <div class="header-icon">
            <mat-icon>{{ isEditMode ? 'edit_note' : 'add_circle_outline' }}</mat-icon>
          </div>
          <div class="header-text">
            <h1>{{ isEditMode ? '✏️ Edit Course' : '🚀 Create New Course' }}</h1>
            <p>{{ isEditMode ? 'Update course information and make it shine' : 'Build amazing learning experiences for your students' }}</p>
          </div>
        </div>
        <div class="progress-indicator">
          <div class="step" [class.active]="true">
            <mat-icon>info</mat-icon>
            <span>Details</span>
          </div>
          <div class="step" [class.active]="courseForm.valid">
            <mat-icon>check_circle</mat-icon>
            <span>Review</span>
          </div>
          <div class="step" [class.active]="submitting">
            <mat-icon>save</mat-icon>
            <span>Save</span>
          </div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="form-wrapper fade-in" style="animation-delay: 0.2s">
        <mat-card class="ultra-modern-card">
          <!-- Card Header -->
          <div class="card-header">
            <div class="header-gradient"></div>
            <div class="header-content-inner">
              <div class="course-icon">
                <mat-icon>school</mat-icon>
              </div>
              <div class="header-info">
                <h2>Course Information</h2>
                <p>Fill in the details to {{ isEditMode ? 'update' : 'create' }} your course</p>
              </div>
            </div>
          </div>
          
          <!-- Form Content -->
          <mat-card-content class="form-content">
            <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="ultra-form">
              
              <!-- Course Name Field -->
              <div class="form-section slide-in-left" style="animation-delay: 0.3s">
                <div class="field-header">
                  <mat-icon>title</mat-icon>
                  <span>Course Name</span>
                </div>
                <mat-form-field appearance="outline" class="ultra-field">
                  <mat-label>Course Name</mat-label>
                  <input 
                    matInput 
                    formControlName="name" 
                    placeholder="e.g., Advanced JavaScript Programming"
                    (input)="onFieldChange()">
                  <mat-icon matSuffix class="field-icon">school</mat-icon>
                  <mat-error *ngIf="courseForm.get('name')?.hasError('required')">
                    <mat-icon>error</mat-icon>
                    Course name is required
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Description Field -->
              <div class="form-section slide-in-right" style="animation-delay: 0.4s">
                <div class="field-header">
                  <mat-icon>description</mat-icon>
                  <span>Course Description</span>
                </div>
                <mat-form-field appearance="outline" class="ultra-field">
                  <mat-label>Course Description</mat-label>
                  <textarea 
                    matInput 
                    formControlName="description" 
                    rows="6" 
                    placeholder="Describe what students will learn, course objectives, prerequisites, and key topics covered..."
                    (input)="onFieldChange()">
                  </textarea>
                  <mat-icon matSuffix class="field-icon">article</mat-icon>
                  <mat-error *ngIf="courseForm.get('description')?.hasError('required')">
                    <mat-icon>error</mat-icon>
                    Description is required
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Live Preview Section -->
              <div class="preview-section fade-in" 
                   *ngIf="courseForm.get('name')?.value || courseForm.get('description')?.value"
                   style="animation-delay: 0.5s">
                <div class="preview-header">
                  <mat-icon>preview</mat-icon>
                  <h3>Live Preview</h3>
                  <div class="preview-badge">Real-time</div>
                </div>
                <div class="preview-card">
                  <div class="preview-course-header">
                    <div class="preview-avatar">
                      <mat-icon>school</mat-icon>
                    </div>
                    <div class="preview-info">
                      <h4>{{ courseForm.get('name')?.value || 'Course Name Preview' }}</h4>
                      <span class="preview-meta">{{ isEditMode ? 'Updated Course' : 'New Course' }}</span>
                    </div>
                    <div class="preview-status">
                      <mat-icon [class]="courseForm.valid ? 'status-valid' : 'status-invalid'">
                        {{ courseForm.valid ? 'check_circle' : 'radio_button_unchecked' }}
                      </mat-icon>
                    </div>
                  </div>
                  <div class="preview-description">
                    <p>{{ courseForm.get('description')?.value || 'Course description will appear here as you type...' }}</p>
                  </div>
                  <div class="preview-footer">
                    <div class="preview-stats">
                      <div class="stat">
                        <mat-icon>schedule</mat-icon>
                        <span>Duration: TBD</span>
                      </div>
                      <div class="stat">
                        <mat-icon>people</mat-icon>
                        <span>Students: 0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="action-section fade-in" style="animation-delay: 0.6s">
                <div class="form-validation-status">
                  <div class="validation-item" [class.valid]="courseForm.get('name')?.valid">
                    <mat-icon>{{ courseForm.get('name')?.valid ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    <span>Course Name</span>
                  </div>
                  <div class="validation-item" [class.valid]="courseForm.get('description')?.valid">
                    <mat-icon>{{ courseForm.get('description')?.valid ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    <span>Description</span>
                  </div>
                </div>
                
                <div class="action-buttons">
                  <button 
                    mat-button 
                    type="button" 
                    class="cancel-btn ultra-btn" 
                    (click)="onCancel()">
                    <mat-icon>cancel</mat-icon>
                    <span>Cancel</span>
                  </button>
                  
                  <button 
                    mat-raised-button 
                    type="submit" 
                    class="submit-btn ultra-btn ultra-btn-primary"
                    [disabled]="courseForm.invalid || submitting"
                    [class.loading]="submitting">
                    
                    <div class="btn-content" *ngIf="!submitting">
                      <mat-icon>{{ isEditMode ? 'update' : 'add_circle' }}</mat-icon>
                      <span>{{ isEditMode ? 'Update Course' : 'Create Course' }}</span>
                    </div>
                    
                    <div class="btn-loading" *ngIf="submitting">
                      <mat-spinner diameter="20"></mat-spinner>
                      <span>{{ isEditMode ? 'Updating...' : 'Creating...' }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .creative-form-container {
      position: relative;
      min-height: 100vh;
      padding: 20px;
      overflow: hidden;
    }

    /* Animated Background */
    .background-animation {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      animation: float 20s infinite ease-in-out;
    }

    .shape-1 {
      width: 300px;
      height: 300px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 200px;
      height: 200px;
      top: 60%;
      right: 10%;
      animation-delay: 5s;
    }

    .shape-3 {
      width: 150px;
      height: 150px;
      bottom: 20%;
      left: 20%;
      animation-delay: 10s;
    }

    .shape-4 {
      width: 250px;
      height: 250px;
      top: 30%;
      right: 30%;
      animation-delay: 15s;
    }

    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg) scale(1);
        opacity: 0.3;
      }
      25% { 
        transform: translateY(-30px) rotate(90deg) scale(1.1);
        opacity: 0.5;
      }
      50% { 
        transform: translateY(-60px) rotate(180deg) scale(0.9);
        opacity: 0.7;
      }
      75% { 
        transform: translateY(-30px) rotate(270deg) scale(1.05);
        opacity: 0.4;
      }
    }

    /* Header Styles */
    .creative-header {
      max-width: 1000px;
      margin: 0 auto 40px auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 25px;
      padding: 40px;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
    }

    .creative-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: headerFloat 8s ease-in-out infinite;
    }

    @keyframes headerFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 30px;
      position: relative;
      z-index: 2;
    }

    .header-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .header-icon mat-icon {
      font-size: 2.5rem !important;
      width: 2.5rem !important;
      height: 2.5rem !important;
    }

    .header-text h1 {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 2.5rem;
      margin: 0 0 8px 0;
      text-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    .header-text p {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
      font-weight: 300;
    }

    .progress-indicator {
      display: flex;
      justify-content: center;
      gap: 40px;
      position: relative;
      z-index: 2;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      opacity: 0.5;
      transition: all 0.3s ease;
    }

    .step.active {
      opacity: 1;
      transform: scale(1.1);
    }

    .step mat-icon {
      font-size: 1.8rem !important;
      width: 1.8rem !important;
      height: 1.8rem !important;
    }

    .step span {
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Form Wrapper */
    .form-wrapper {
      max-width: 1000px;
      margin: 0 auto;
    }

    .ultra-modern-card {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(20px) !important;
      border-radius: 30px !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.1) !important;
      overflow: hidden !important;
    }

    .card-header {
      position: relative;
      padding: 0;
      margin-bottom: 40px;
    }

    .header-gradient {
      height: 120px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      position: relative;
    }

    .header-gradient::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 30px;
      background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1));
    }

    .header-content-inner {
      position: absolute;
      bottom: -30px;
      left: 40px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .course-icon {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      border: 4px solid white;
    }

    .course-icon mat-icon {
      font-size: 2rem !important;
      width: 2rem !important;
      height: 2rem !important;
      color: #667eea;
    }

    .header-info h2 {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
      font-size: 1.8rem;
    }

    .header-info p {
      color: #666;
      margin: 0;
      font-size: 1rem;
    }

    /* Form Content */
    .form-content {
      padding: 60px 40px 40px 40px !important;
    }

    .ultra-form {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    .form-section {
      position: relative;
    }

    .field-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      color: #667eea;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .field-header mat-icon {
      font-size: 1.3rem !important;
      width: 1.3rem !important;
      height: 1.3rem !important;
    }

    .ultra-field {
      width: 100% !important;
      margin-bottom: 0 !important;
    }

    .ultra-field .mat-mdc-text-field-wrapper {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05)) !important;
      border-radius: 15px !important;
      border: 2px solid transparent !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .ultra-field.mat-focused .mat-mdc-text-field-wrapper {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)) !important;
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
      transform: translateY(-2px);
    }

    .field-icon {
      color: #667eea !important;
      opacity: 0.7;
      transition: all 0.3s ease;
    }

    .ultra-field.mat-focused .field-icon {
      opacity: 1;
      transform: scale(1.1);
    }

    .mat-mdc-form-field-error {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      color: #f5576c !important;
      font-weight: 500 !important;
    }

    /* Preview Section */
    .preview-section {
      background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
      border-radius: 20px;
      padding: 30px;
      border: 2px dashed rgba(102, 126, 234, 0.3);
      position: relative;
      overflow: hidden;
    }

    .preview-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
      animation: previewFloat 6s ease-in-out infinite;
    }

    @keyframes previewFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(180deg); }
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      position: relative;
      z-index: 2;
    }

    .preview-header mat-icon {
      color: #667eea;
      font-size: 1.5rem !important;
      width: 1.5rem !important;
      height: 1.5rem !important;
    }

    .preview-header h3 {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      color: #333;
      margin: 0;
      flex: 1;
    }

    .preview-badge {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }

    .preview-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 2;
      border: 1px solid rgba(102, 126, 234, 0.1);
    }

    .preview-course-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .preview-avatar {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .preview-info {
      flex: 1;
    }

    .preview-info h4 {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
      font-size: 1.3rem;
    }

    .preview-meta {
      color: #666;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .preview-status mat-icon {
      font-size: 1.8rem !important;
      width: 1.8rem !important;
      height: 1.8rem !important;
    }

    .status-valid {
      color: #4caf50 !important;
      animation: checkmark 0.5s ease-in-out;
    }

    .status-invalid {
      color: #ddd !important;
    }

    @keyframes checkmark {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    .preview-description p {
      color: #666;
      line-height: 1.6;
      margin: 0;
      font-style: italic;
      min-height: 48px;
    }

    .preview-footer {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .preview-stats {
      display: flex;
      gap: 24px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 0.9rem;
    }

    .stat mat-icon {
      font-size: 1.1rem !important;
      width: 1.1rem !important;
      height: 1.1rem !important;
      color: #667eea;
    }

    /* Action Section */
    .action-section {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding-top: 30px;
    }

    .form-validation-status {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
      justify-content: center;
    }

    .validation-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      background: rgba(0, 0, 0, 0.05);
      color: #666;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .validation-item.valid {
      background: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    .validation-item mat-icon {
      font-size: 1.2rem !important;
      width: 1.2rem !important;
      height: 1.2rem !important;
    }

    .action-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
    }

    .ultra-btn {
      border-radius: 25px !important;
      padding: 12px 32px !important;
      font-weight: 600 !important;
      font-size: 1rem !important;
      text-transform: none !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      position: relative !important;
      overflow: hidden !important;
      min-width: 160px !important;
      height: 48px !important;
    }

    .cancel-btn {
      background: rgba(0, 0, 0, 0.05) !important;
      color: #666 !important;
      border: 2px solid rgba(0, 0, 0, 0.1) !important;
    }

    .cancel-btn:hover {
      background: rgba(0, 0, 0, 0.1) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .ultra-btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border: none !important;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
    }

    .ultra-btn-primary:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4) !important;
    }

    .ultra-btn-primary:disabled {
      opacity: 0.6 !important;
      transform: none !important;
      cursor: not-allowed !important;
    }

    .btn-content, .btn-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
    }

    .ultra-btn.loading {
      pointer-events: none;
    }

    .btn-loading mat-spinner {
      margin-right: 8px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .creative-form-container {
        padding: 16px;
      }

      .creative-header {
        padding: 24px;
        border-radius: 20px;
      }

      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .header-text h1 {
        font-size: 2rem;
      }

      .progress-indicator {
        gap: 20px;
      }

      .form-content {
        padding: 40px 20px 20px 20px !important;
      }

      .header-content-inner {
        position: static;
        flex-direction: column;
        text-align: center;
        margin-top: 20px;
      }

      .preview-stats {
        flex-direction: column;
        gap: 12px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .ultra-btn {
        width: 100% !important;
      }

      .form-validation-status {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  courseId: number | null = null;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.courseId = +id;
      this.loadCourse();
    }
  }

  loadCourse(): void {
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course) => {
          this.courseForm.patchValue({
            name: course.name,
            description: course.description
          });
        },
        error: (error) => {
          console.error('Error loading course:', error);
          this.errorHandler.handleError(error, 'Failed to load course details');
          this.router.navigate(['/courses']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.submitting = true;
      const courseData: Course = this.courseForm.value;

      const operation = this.isEditMode
        ? this.courseService.updateCourse(this.courseId!, courseData)
        : this.courseService.createCourse(courseData);

      operation.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Course updated successfully! 🎉' : 'Course created successfully! 🚀';
          this.errorHandler.showSuccess(message);
          this.router.navigate(['/courses']);
        },
        error: (error) => {
          console.error('Error saving course:', error);
          this.errorHandler.handleError(error, 'Failed to save course. Please check your connection and try again.');
          this.submitting = false;
        }
      });
    }
  }

  onFieldChange(): void {
    // Trigger any field change animations or validations
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
  }
}