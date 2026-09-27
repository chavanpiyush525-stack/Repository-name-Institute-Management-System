import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatSnackBarModule
  ],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
        
        <!-- Particle Effects -->
        <div class="particles">
          <div class="particle" *ngFor="let i of [1,2,3,4,5,6,7,8,9,10]" 
               [style.animation-delay]="(i * 0.5) + 's'"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Excellence Institute</h1>
          <p class="hero-subtitle">Empowering Minds, Shaping Futures</p>
          <p class="hero-description">
            Transform your career with our world-class courses in technology, business, and innovation. 
            Join thousands of successful graduates who have achieved their dreams with us.
          </p>
          <div class="hero-actions">
            <button mat-raised-button color="primary" class="cta-button" routerLink="/courses">
              <mat-icon>school</mat-icon>
              Explore Courses
            </button>
            <button mat-button class="secondary-button" routerLink="/contact">
              <mat-icon>contact_mail</mat-icon>
              Get in Touch
            </button>
          </div>
        </div>
        
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">{{ instituteInfo?.statistics?.totalStudents || 1500 }}</div>
            <div class="stat-label">Happy Students</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ instituteInfo?.statistics?.totalCourses || 25 }}</div>
            <div class="stat-label">Expert Courses</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ instituteInfo?.statistics?.yearsOfExperience || 15 }}</div>
            <div class="stat-label">Years Experience</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ instituteInfo?.statistics?.successRate || 95 }}%</div>
            <div class="stat-label">Success Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>Why Choose Excellence Institute?</h2>
          <p>We provide comprehensive education solutions with modern teaching methods</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" *ngFor="let feature of features">
            <div class="feature-icon">
              <mat-icon>{{ feature.icon }}</mat-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Courses Preview Section -->
    <section class="courses-preview-section">
      <div class="container">
        <div class="section-header">
          <h2>Popular Courses</h2>
          <p>Discover our most sought-after programs designed for career success</p>
        </div>
        
        <div class="courses-grid">
          <mat-card class="course-card" *ngFor="let course of popularCourses">
            <div class="course-image">
              <mat-icon>{{ course.icon }}</mat-icon>
            </div>
            <mat-card-content>
              <h3>{{ course.name }}</h3>
              <p>{{ course.shortDescription }}</p>
              <div class="course-meta">
                <span class="duration">
                  <mat-icon>schedule</mat-icon>
                  {{ course.duration }}
                </span>
                <span class="level">
                  <mat-icon>trending_up</mat-icon>
                  {{ course.level }}
                </span>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" (click)="learnMore(course)">Learn More</button>
              <button mat-raised-button color="primary" (click)="enrollNow(course)">Enroll Now</button>
            </mat-card-actions>
          </mat-card>
        </div>
        
        <div class="view-all-courses">
          <button mat-raised-button color="primary" routerLink="/courses" class="view-all-btn">
            <mat-icon>library_books</mat-icon>
            View All Courses
          </button>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2>What Our Students Say</h2>
          <p>Real stories from our successful graduates</p>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card" *ngFor="let testimonial of testimonials">
            <div class="testimonial-content">
              <p>"{{ testimonial.content }}"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <mat-icon>person</mat-icon>
              </div>
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <span>{{ testimonial.course }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of students who have transformed their careers with us</p>
          <div class="cta-actions">
            <button mat-raised-button color="primary" class="cta-button" routerLink="/contact">
              <mat-icon>rocket_launch</mat-icon>
              Get Started Today
            </button>
            <button mat-button class="secondary-button" routerLink="/courses">
              <mat-icon>explore</mat-icon>
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: white;
      animation: gradientShift 10s ease-in-out infinite;
    }

    @keyframes gradientShift {
      0%, 100% { background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); }
      25% { background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%); }
      50% { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #667eea 100%); }
      75% { background: linear-gradient(135deg, #764ba2 0%, #667eea 50%, #f093fb 100%); }
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }

    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      animation: float 20s infinite ease-in-out;
    }

    .shape-1 {
      width: 300px;
      height: 300px;
      top: 10%;
      left: 10%;
      border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 200px;
      height: 200px;
      top: 60%;
      right: 15%;
      border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
      animation-delay: 7s;
    }

    .shape-3 {
      width: 150px;
      height: 150px;
      bottom: 20%;
      left: 60%;
      border-radius: 49% 51% 48% 52% / 62% 44% 56% 38%;
      animation-delay: 14s;
    }

    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg) scale(1);
        border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
      }
      25% { 
        transform: translateY(-30px) rotate(90deg) scale(1.1);
        border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
      }
      50% { 
        transform: translateY(-60px) rotate(180deg) scale(0.9);
        border-radius: 49% 51% 48% 52% / 62% 44% 56% 38%;
      }
      75% { 
        transform: translateY(-30px) rotate(270deg) scale(1.05);
        border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
      }
    }

    /* Particle Effects */
    .particles {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      animation: particleFloat 15s linear infinite;
    }

    .particle:nth-child(1) { left: 10%; animation-duration: 12s; }
    .particle:nth-child(2) { left: 20%; animation-duration: 18s; }
    .particle:nth-child(3) { left: 30%; animation-duration: 14s; }
    .particle:nth-child(4) { left: 40%; animation-duration: 16s; }
    .particle:nth-child(5) { left: 50%; animation-duration: 13s; }
    .particle:nth-child(6) { left: 60%; animation-duration: 17s; }
    .particle:nth-child(7) { left: 70%; animation-duration: 15s; }
    .particle:nth-child(8) { left: 80%; animation-duration: 19s; }
    .particle:nth-child(9) { left: 90%; animation-duration: 11s; }
    .particle:nth-child(10) { left: 95%; animation-duration: 20s; }

    @keyframes particleFloat {
      0% {
        transform: translateY(100vh) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) scale(1);
        opacity: 0;
      }
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }

    .hero-title {
      font-size: 4rem;
      font-weight: 700;
      margin: 0 0 20px 0;
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(45deg, #fff, #f0f0f0, #fff, #e0e0e0);
      background-size: 400% 400%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s ease-in-out infinite;
      text-shadow: 0 4px 8px rgba(0,0,0,0.3);
      position: relative;
    }

    .hero-title::before {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shine 2s linear infinite;
    }

    @keyframes shimmer {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes shine {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin: 0 0 20px 0;
      opacity: 0.9;
      font-weight: 300;
    }

    .hero-description {
      font-size: 1.1rem;
      line-height: 1.6;
      margin: 0 0 40px 0;
      opacity: 0.8;
    }

    .hero-actions {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .cta-button {
      padding: 12px 32px !important;
      font-size: 1.1rem !important;
      border-radius: 25px !important;
      font-weight: 600 !important;
      text-transform: none !important;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
    }

    .secondary-button {
      padding: 12px 32px !important;
      font-size: 1.1rem !important;
      border-radius: 25px !important;
      font-weight: 600 !important;
      text-transform: none !important;
      border: 2px solid rgba(255,255,255,0.3) !important;
      color: white !important;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .stat-item {
      text-align: center;
      padding: 30px 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .stat-item::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
      transform: rotate(45deg);
      transition: all 0.6s ease;
      opacity: 0;
    }

    .stat-item:hover {
      transform: translateY(-10px) scale(1.05);
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .stat-item:hover::before {
      opacity: 1;
      animation: sweep 1.5s ease-in-out;
    }

    @keyframes sweep {
      0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 10px;
      font-family: 'Poppins', sans-serif;
    }

    .stat-label {
      font-size: 1rem;
      opacity: 0.8;
    }

    /* Features Section */
    .features-section {
      padding: 100px 0;
      background: #f8f9ff;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 20px 0;
      font-family: 'Poppins', sans-serif;
    }

    .section-header p {
      font-size: 1.2rem;
      color: #666;
      margin: 0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
    }

    .feature-card {
      text-align: center;
      padding: 40px 30px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 30px auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .feature-icon mat-icon {
      font-size: 2.5rem !important;
      width: 2.5rem !important;
      height: 2.5rem !important;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 20px 0;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    /* Courses Preview Section */
    .courses-preview-section {
      padding: 100px 0;
      background: white;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }

    .course-card {
      border-radius: 20px !important;
      overflow: hidden !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
      transition: transform 0.3s ease, box-shadow 0.3s ease !important;
    }

    .course-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
    }

    .course-image {
      height: 200px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .course-image mat-icon {
      font-size: 4rem !important;
      width: 4rem !important;
      height: 4rem !important;
    }

    .course-card h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 15px 0;
    }

    .course-card mat-card-actions {
      padding: 16px 24px !important;
      gap: 12px !important;
      display: flex !important;
      justify-content: space-between !important;
    }

    .course-card button {
      border-radius: 20px !important;
      font-weight: 500 !important;
      text-transform: none !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .course-card button::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transition: all 0.3s ease;
      transform: translate(-50%, -50%);
    }

    .course-card button:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .course-card button:hover::before {
      width: 300px;
      height: 300px;
    }

    .course-card button:active {
      transform: translateY(0) scale(0.98);
    }

    .course-card p {
      color: #666;
      line-height: 1.5;
      margin: 0 0 20px 0;
    }

    .course-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .course-meta span {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #666;
      font-size: 0.9rem;
    }

    .course-meta mat-icon {
      font-size: 1.2rem !important;
      width: 1.2rem !important;
      height: 1.2rem !important;
    }

    .view-all-courses {
      text-align: center;
    }

    .view-all-btn {
      padding: 15px 40px !important;
      font-size: 1.1rem !important;
      border-radius: 25px !important;
      font-weight: 600 !important;
      text-transform: none !important;
    }

    /* Testimonials Section */
    .testimonials-section {
      padding: 100px 0;
      background: #f8f9ff;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;
    }

    .testimonial-card {
      background: white;
      padding: 40px 30px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .testimonial-card:hover {
      transform: translateY(-5px);
    }

    .testimonial-content {
      margin-bottom: 30px;
    }

    .testimonial-content p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #333;
      font-style: italic;
      margin: 0;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .author-avatar {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .author-info h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-weight: 600;
    }

    .author-info span {
      color: #666;
      font-size: 0.9rem;
    }

    /* CTA Section */
    .cta-section {
      padding: 100px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .cta-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 20px 0;
      font-family: 'Poppins', sans-serif;
    }

    .cta-content p {
      font-size: 1.2rem;
      margin: 0 0 40px 0;
      opacity: 0.9;
    }

    .cta-actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-stats {
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      .stat-number {
        font-size: 2rem;
      }

      .section-header h2 {
        font-size: 2rem;
      }

      .features-grid,
      .courses-grid,
      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .hero-actions,
      .cta-actions {
        flex-direction: column;
        align-items: center;
      }

      .cta-button,
      .secondary-button {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class HomepageComponent implements OnInit {
  instituteInfo: any = null;
  
  features = [
    {
      icon: 'school',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of real-world experience and proven track records.'
    },
    {
      icon: 'schedule',
      title: 'Flexible Learning',
      description: 'Study at your own pace with our flexible scheduling options and online learning platforms.'
    },
    {
      icon: 'workspace_premium',
      title: 'Industry Certification',
      description: 'Earn recognized certifications that boost your career prospects and validate your skills.'
    },
    {
      icon: 'support_agent',
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated student support team available around the clock.'
    },
    {
      icon: 'trending_up',
      title: 'Career Growth',
      description: 'Access our career services including job placement assistance and professional networking opportunities.'
    },
    {
      icon: 'devices',
      title: 'Modern Technology',
      description: 'Learn using cutting-edge tools and technologies that are currently used in the industry.'
    }
  ];

  popularCourses = [
    {
      name: 'Full Stack Web Development',
      shortDescription: 'Master modern web development with React, Node.js, and cloud technologies.',
      duration: '6 months',
      level: 'Intermediate',
      icon: 'code'
    },
    {
      name: 'Data Science & Analytics',
      shortDescription: 'Learn Python, machine learning, and data visualization for data-driven insights.',
      duration: '8 months',
      level: 'Advanced',
      icon: 'analytics'
    },
    {
      name: 'Digital Marketing',
      shortDescription: 'Comprehensive digital marketing including SEO, social media, and content strategy.',
      duration: '4 months',
      level: 'Beginner',
      icon: 'campaign'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      course: 'Web Development Graduate',
      content: 'The course completely transformed my career. I went from having no coding experience to landing a job as a full-stack developer at a tech startup. The instructors were amazing and the curriculum was very practical.'
    },
    {
      name: 'Michael Chen',
      course: 'Data Science Graduate',
      content: 'Excellence Institute provided me with the skills and confidence I needed to transition into data science. The hands-on projects and real-world applications made all the difference in my learning journey.'
    },
    {
      name: 'Emily Rodriguez',
      course: 'Digital Marketing Graduate',
      content: 'I was able to start my own digital marketing agency after completing the course. The knowledge I gained about SEO, social media marketing, and analytics has been invaluable for my business success.'
    }
  ];

  constructor(
    private http: HttpClient, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInstituteInfo();
  }

  loadInstituteInfo(): void {
    this.http.get('http://localhost:8080/api/public/institute-info').subscribe({
      next: (info) => {
        this.instituteInfo = info;
      },
      error: (error) => {
        console.error('Error loading institute info:', error);
        // Use default values if API fails
      }
    });
  }

  learnMore(course: any): void {
    // Show course information in a snackbar
    console.log('Learn more about:', course.name);
    this.snackBar.open(
      `📚 ${course.name} - ${course.duration} (${course.level}) | ${course.shortDescription}`, 
      'Contact Us', 
      {
        duration: 8000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['course-info-snackbar']
      }
    ).onAction().subscribe(() => {
      this.router.navigate(['/contact'], { 
        queryParams: { 
          course: course.name,
          action: 'learn-more' 
        } 
      });
    });
  }

  enrollNow(course: any): void {
    // Show enrollment confirmation and navigate to contact form
    console.log('Enroll in:', course.name);
    this.snackBar.open(
      `🚀 Great choice! Redirecting you to enrollment form for ${course.name}`, 
      'OK', 
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['enrollment-snackbar']
      }
    );
    
    // Navigate after a short delay for better UX
    setTimeout(() => {
      this.router.navigate(['/contact'], { 
        queryParams: { 
          course: course.name,
          action: 'enroll' 
        } 
      });
    }, 1000);
  }
}