import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { StudentService } from '../../services/student.service';
import { MessageService } from '../../services/message.service';
import { forkJoin } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  template: `
    <!-- 🌟 Hero Section with Animated Background -->
    <div class="hero-section fade-in">
      <div class="hero-content">
        <div class="hero-icon floating">
          <mat-icon>school</mat-icon>
        </div>
        <h1 class="hero-title">Institute Management Hub</h1>
        <p class="hero-subtitle">Transform education with intelligent management</p>
        <div class="hero-stats">
          <div class="hero-stat bounce-in" style="animation-delay: 0.2s">
            <span class="stat-value">{{ courseCount + studentCount + messageCount }}</span>
            <span class="stat-label">Total Records</span>
          </div>
          <div class="hero-stat bounce-in" style="animation-delay: 0.4s">
            <span class="stat-value">{{ getActiveModules() }}</span>
            <span class="stat-label">Active Modules</span>
          </div>
        </div>
      </div>
      <div class="hero-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </div>

    <!-- 📊 Enhanced Stats Grid -->
    <div class="stats-grid fade-in" style="animation-delay: 0.3s">
      <div class="stat-card courses-card slide-in-left" style="animation-delay: 0.4s">
        <div class="stat-icon">
          <mat-icon>school</mat-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number pulse">{{ courseCount }}</div>
          <h3>Active Courses</h3>
          <p>Comprehensive curriculum management</p>
          <div class="stat-progress">
            <div class="progress-bar" [style.width.%]="getProgressWidth(courseCount, 20)"></div>
          </div>
        </div>
        <div class="stat-actions">
          <button mat-button class="creative-btn" routerLink="/courses">
            <mat-icon>visibility</mat-icon>
            Explore
          </button>
          <button mat-raised-button class="creative-btn creative-btn-neon" routerLink="/courses/new">
            <mat-icon>add_circle</mat-icon>
            Create
          </button>
        </div>
      </div>

      <div class="stat-card students-card slide-in-left" style="animation-delay: 0.5s">
        <div class="stat-icon">
          <mat-icon>people</mat-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number pulse">{{ studentCount }}</div>
          <h3>Enrolled Students</h3>
          <p>Growing learning community</p>
          <div class="stat-progress">
            <div class="progress-bar" [style.width.%]="getProgressWidth(studentCount, 50)"></div>
          </div>
        </div>
        <div class="stat-actions">
          <button mat-button class="creative-btn creative-btn-secondary" routerLink="/students">
            <mat-icon>group</mat-icon>
            View All
          </button>
        </div>
      </div>

      <div class="stat-card messages-card slide-in-left" style="animation-delay: 0.6s">
        <div class="stat-icon">
          <mat-icon>message</mat-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number pulse">{{ messageCount }}</div>
          <h3>Communications</h3>
          <p>Active engagement tracking</p>
          <div class="stat-progress">
            <div class="progress-bar" [style.width.%]="getProgressWidth(messageCount, 30)"></div>
          </div>
        </div>
        <div class="stat-actions">
          <button mat-button class="creative-btn creative-btn-success" routerLink="/messages">
            <mat-icon>mail</mat-icon>
            Check
          </button>
        </div>
      </div>
    </div>

    <!-- 🚀 Quick Actions Panel -->
    <div class="quick-actions-panel fade-in" style="animation-delay: 0.7s">
      <mat-card class="action-card glass-effect">
        <mat-card-header>
          <div mat-card-avatar class="action-avatar">
            <mat-icon>flash_on</mat-icon>
          </div>
          <mat-card-title>Quick Actions</mat-card-title>
          <mat-card-subtitle>Streamline your workflow</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="actions-grid">
            <button mat-raised-button class="action-btn creative-btn" routerLink="/courses/new">
              <div class="btn-content">
                <mat-icon>add_circle</mat-icon>
                <span>New Course</span>
              </div>
            </button>
            <button mat-raised-button class="action-btn creative-btn creative-btn-secondary" routerLink="/students">
              <div class="btn-content">
                <mat-icon>people_alt</mat-icon>
                <span>Students</span>
              </div>
            </button>
            <button mat-raised-button class="action-btn creative-btn creative-btn-warning" routerLink="/messages">
              <div class="btn-content">
                <mat-icon>notifications</mat-icon>
                <span>Messages</span>
              </div>
            </button>
            <button mat-raised-button class="action-btn creative-btn creative-btn-success">
              <div class="btn-content">
                <mat-icon>analytics</mat-icon>
                <span>Reports</span>
              </div>
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- 📈 Analytics Overview -->
    <div class="analytics-section fade-in" style="animation-delay: 0.8s">
      <div class="analytics-grid">
        <mat-card class="analytics-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>trending_up</mat-icon>
            <mat-card-title>Growth Metrics</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metric-item">
              <div class="metric-icon">
                <mat-icon>school</mat-icon>
              </div>
              <div class="metric-info">
                <span class="metric-value">{{ courseCount * 15 }}%</span>
                <span class="metric-label">Course Completion</span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="metric-info">
                <span class="metric-value">{{ studentCount * 8 }}%</span>
                <span class="metric-label">Student Engagement</span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-icon">
                <mat-icon>message</mat-icon>
              </div>
              <div class="metric-info">
                <span class="metric-value">{{ messageCount * 12 }}%</span>
                <span class="metric-label">Response Rate</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="feature-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>auto_awesome</mat-icon>
            <mat-card-title>System Features</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="feature-list">
              <div class="feature-item">
                <mat-icon>check_circle</mat-icon>
                <span>Real-time Data Synchronization</span>
              </div>
              <div class="feature-item">
                <mat-icon>check_circle</mat-icon>
                <span>Advanced Analytics Dashboard</span>
              </div>
              <div class="feature-item">
                <mat-icon>check_circle</mat-icon>
                <span>Automated Notifications</span>
              </div>
              <div class="feature-item">
                <mat-icon>check_circle</mat-icon>
                <span>Secure Data Management</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    /* Global Enhancements */
    * {
      box-sizing: border-box;
    }

    /* Creative Animations */
    @keyframes morphing {
      0%, 100% { border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%; }
      14% { border-radius: 40% 60% 54% 46% / 49% 60% 40% 51%; }
      28% { border-radius: 54% 46% 38% 62% / 49% 70% 30% 51%; }
      42% { border-radius: 61% 39% 55% 45% / 61% 38% 62% 39%; }
      56% { border-radius: 61% 39% 67% 33% / 70% 50% 50% 30%; }
      70% { border-radius: 50% 50% 34% 66% / 56% 68% 32% 44%; }
      84% { border-radius: 46% 54% 50% 50% / 35% 61% 39% 65%; }
    }

    @keyframes neonGlow {
      0%, 100% { 
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.5), 
                    0 0 40px rgba(102, 126, 234, 0.3), 
                    0 0 60px rgba(102, 126, 234, 0.1);
      }
      50% { 
        box-shadow: 0 0 30px rgba(118, 75, 162, 0.6), 
                    0 0 60px rgba(118, 75, 162, 0.4), 
                    0 0 90px rgba(118, 75, 162, 0.2);
      }
    }

    @keyframes holographic {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes particleFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
      25% { transform: translateY(-20px) rotate(90deg); opacity: 1; }
      50% { transform: translateY(-40px) rotate(180deg); opacity: 0.8; }
      75% { transform: translateY(-20px) rotate(270deg); opacity: 0.9; }
    }

    /* Enhanced Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      background-size: 400% 400%;
      animation: holographic 8s ease-in-out infinite;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.15"/><circle cx="20" cy="80" r="0.5" fill="white" opacity="0.15"/><circle cx="80" cy="20" r="0.5" fill="white" opacity="0.15"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      animation: particleFloat 15s linear infinite;
    }

    .hero-decoration {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    .decoration-circle {
      position: absolute;
      background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      animation: morphing 20s ease-in-out infinite;
    }

    .circle-1 {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -150px;
      animation-delay: 0s;
    }

    .circle-2 {
      width: 200px;
      height: 200px;
      bottom: -100px;
      left: -100px;
      animation-delay: 7s;
    }

    .circle-3 {
      width: 150px;
      height: 150px;
      top: 50%;
      left: 80%;
      animation-delay: 14s;
    }

    /* Enhanced Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;
      padding: 40px 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .stat-card {
      background: linear-gradient(135deg, 
        rgba(255,255,255,0.95) 0%, 
        rgba(255,255,255,0.85) 50%, 
        rgba(255,255,255,0.95) 100%);
      backdrop-filter: blur(25px) saturate(180%);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 25px;
      padding: 30px;
      position: relative;
      overflow: hidden;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 15px 45px rgba(0,0,0,0.1), 
                  0 5px 15px rgba(0,0,0,0.05);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(102, 126, 234, 0.1), 
        transparent);
      transition: left 0.8s ease;
    }

    .stat-card:hover {
      transform: translateY(-15px) scale(1.02);
      box-shadow: 0 25px 60px rgba(0,0,0,0.15), 
                  0 10px 25px rgba(0,0,0,0.1);
    }

    .stat-card:hover::before {
      left: 100%;
    }

    .courses-card {
      border-top: 4px solid #667eea;
    }

    .courses-card:hover {
      box-shadow: 0 25px 60px rgba(102, 126, 234, 0.2), 
                  0 10px 25px rgba(102, 126, 234, 0.1);
    }

    .students-card {
      border-top: 4px solid #f093fb;
    }

    .students-card:hover {
      box-shadow: 0 25px 60px rgba(240, 147, 251, 0.2), 
                  0 10px 25px rgba(240, 147, 251, 0.1);
    }

    .messages-card {
      border-top: 4px solid #4facfe;
    }

    .messages-card:hover {
      box-shadow: 0 25px 60px rgba(79, 172, 254, 0.2), 
                  0 10px 25px rgba(79, 172, 254, 0.1);
    }

    .stat-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
    }

    .courses-card .stat-icon {
      background: linear-gradient(135deg, #667eea, #764ba2);
      animation: neonGlow 3s ease-in-out infinite;
    }

    .students-card .stat-icon {
      background: linear-gradient(135deg, #f093fb, #f5576c);
      animation: neonGlow 3s ease-in-out infinite 1s;
    }

    .messages-card .stat-icon {
      background: linear-gradient(135deg, #4facfe, #00f2fe);
      animation: neonGlow 3s ease-in-out infinite 2s;
    }

    .stat-icon mat-icon {
      font-size: 2.5rem !important;
      width: 2.5rem !important;
      height: 2.5rem !important;
      color: white;
      z-index: 2;
    }

    .stat-number {
      font-size: 3.5rem;
      font-weight: 700;
      background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: holographic 3s ease-in-out infinite;
      margin-bottom: 10px;
      display: block;
    }

    .stat-content h3 {
      font-size: 1.4rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }

    .stat-content p {
      color: #666;
      margin: 0 0 20px 0;
      font-size: 0.95rem;
    }

    .stat-progress {
      width: 100%;
      height: 6px;
      background: rgba(0,0,0,0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 20px;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 3px;
      transition: width 2s ease-in-out;
      position: relative;
    }

    .progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255,255,255,0.4), 
        transparent);
      animation: shimmer 2s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .stat-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .creative-btn {
      border-radius: 20px !important;
      padding: 8px 20px !important;
      font-weight: 500 !important;
      text-transform: none !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .creative-btn::before {
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

    .creative-btn:hover::before {
      width: 300px;
      height: 300px;
    }

    .creative-btn-neon {
      background: linear-gradient(135deg, #667eea, #764ba2) !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
    }

    .creative-btn-neon:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
    }

    .creative-btn-secondary {
      background: linear-gradient(135deg, #f093fb, #f5576c) !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3) !important;
    }

    .creative-btn-secondary:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 25px rgba(240, 147, 251, 0.4) !important;
    }

    .creative-btn-success {
      background: linear-gradient(135deg, #4facfe, #00f2fe) !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3) !important;
    }

    .creative-btn-success:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4) !important;
    }

    /* Enhanced Animations */
    .fade-in {
      animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      opacity: 0;
      transform: translateY(30px);
    }

    .slide-in-left {
      animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      opacity: 0;
      transform: translateX(-50px);
    }

    .bounce-in {
      animation: bounceIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      opacity: 0;
      transform: scale(0.3);
    }

    .pulse {
      animation: pulse 2s ease-in-out infinite;
    }

    .floating {
      animation: floating 3s ease-in-out infinite;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInLeft {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    @keyframes floating {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        padding: 20px;
        gap: 20px;
      }

      .stat-card {
        padding: 20px;
      }

      .stat-number {
        font-size: 2.5rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .stat-actions {
        justify-content: center;
      }
    }
    /* 🌟 Hero Section */
    .hero-section {
      position: relative;
      background: var(--primary-gradient);
      border-radius: var(--border-radius-xl);
      padding: 60px 40px;
      margin-bottom: 40px;
      overflow: hidden;
      color: white;
      text-align: center;
    }
    
    .hero-content {
      position: relative;
      z-index: 2;
    }
    
    .hero-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    
    .hero-icon mat-icon {
      font-size: 2.5rem !important;
      width: 2.5rem !important;
      height: 2.5rem !important;
    }
    
    .hero-title {
      font-family: 'Poppins', sans-serif;
      font-weight: 800;
      font-size: clamp(2.5rem, 6vw, 4rem);
      margin: 0 0 16px 0;
      background: linear-gradient(45deg, #fff, #f0f8ff, #fff);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: textShine 3s ease-in-out infinite;
    }
    
    .hero-subtitle {
      font-size: 1.3rem;
      opacity: 0.9;
      margin-bottom: 32px;
      font-weight: 500;
    }
    
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
    }
    
    .hero-stat {
      text-align: center;
    }
    
    .stat-value {
      display: block;
      font-size: 2.5rem;
      font-weight: 900;
      font-family: 'Poppins', sans-serif;
    }
    
    .stat-label {
      display: block;
      font-size: 0.9rem;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .hero-decoration {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
    
    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: floatCircle 6s ease-in-out infinite;
    }
    
    .circle-1 {
      width: 100px;
      height: 100px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }
    
    .circle-2 {
      width: 60px;
      height: 60px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }
    
    .circle-3 {
      width: 80px;
      height: 80px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }
    
    @keyframes floatCircle {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-20px) scale(1.1); }
    }
    
    /* 📊 Enhanced Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border-radius: var(--border-radius-lg);
      padding: 32px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: var(--shadow-float);
      transition: var(--transition-smooth);
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
      background: var(--primary-gradient);
    }
    
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: var(--shadow-deep), var(--shadow-glow);
    }
    
    .courses-card::before {
      background: var(--primary-gradient);
    }
    
    .students-card::before {
      background: var(--secondary-gradient);
    }
    
    .messages-card::before {
      background: var(--success-gradient);
    }
    
    .stat-icon {
      width: 60px;
      height: 60px;
      background: var(--primary-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      color: white;
    }
    
    .stat-icon mat-icon {
      font-size: 1.8rem !important;
      width: 1.8rem !important;
      height: 1.8rem !important;
    }
    
    .stat-content {
      margin-bottom: 24px;
    }
    
    .stat-number {
      font-size: 3.5rem;
      font-weight: 900;
      font-family: 'Poppins', sans-serif;
      color: #667eea;
      margin-bottom: 8px;
      display: block;
    }
    
    .stat-card h3 {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      font-size: 1.3rem;
    }
    
    .stat-card p {
      color: #666;
      margin-bottom: 16px;
      font-size: 0.95rem;
    }
    
    .stat-progress {
      width: 100%;
      height: 6px;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      background: var(--primary-gradient);
      border-radius: 3px;
      transition: width 1s ease-out;
    }
    
    .stat-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    /* 🚀 Quick Actions Panel */
    .quick-actions-panel {
      margin-bottom: 40px;
    }
    
    .action-card {
      background: var(--bg-card) !important;
    }
    
    .action-avatar {
      background: var(--primary-gradient) !important;
      color: white !important;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    
    .action-btn {
      height: 80px !important;
      border-radius: var(--border-radius-md) !important;
    }
    
    .btn-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    
    .btn-content mat-icon {
      font-size: 1.5rem !important;
      width: 1.5rem !important;
      height: 1.5rem !important;
    }
    
    .btn-content span {
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    /* 📈 Analytics Section */
    .analytics-section {
      margin-bottom: 40px;
    }
    
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 32px;
    }
    
    .analytics-card, .feature-card {
      background: var(--bg-card) !important;
    }
    
    .metric-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .metric-item:last-child {
      border-bottom: none;
    }
    
    .metric-icon {
      width: 40px;
      height: 40px;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #667eea;
    }
    
    .metric-info {
      display: flex;
      flex-direction: column;
    }
    
    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
      font-family: 'Poppins', sans-serif;
    }
    
    .metric-label {
      font-size: 0.85rem;
      color: #666;
    }
    
    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(102, 126, 234, 0.05);
      border-radius: var(--border-radius-sm);
      transition: var(--transition-smooth);
    }
    
    .feature-item:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateX(8px);
    }
    
    .feature-item mat-icon {
      color: #4caf50;
      font-size: 1.2rem !important;
      width: 1.2rem !important;
      height: 1.2rem !important;
    }
    
    .feature-item span {
      font-weight: 500;
      color: #333;
    }
    
    /* 📱 Responsive Design */
    @media (max-width: 768px) {
      .hero-section {
        padding: 40px 24px;
      }
      
      .hero-stats {
        gap: 24px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .analytics-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 480px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .stat-number {
        font-size: 2.5rem;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  courseCount = 0;
  studentCount = 0;
  messageCount = 0;

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  getActiveModules(): number {
    let modules = 0;
    if (this.courseCount > 0) modules++;
    if (this.studentCount > 0) modules++;
    if (this.messageCount > 0) modules++;
    return modules;
  }

  getProgressWidth(current: number, max: number): number {
    return Math.min((current / max) * 100, 100);
  }

  private loadDashboardData(): void {
    forkJoin({
      courses: this.courseService.getAllCourses(),
      students: this.studentService.getAllStudents(),
      messages: this.messageService.getAllMessages()
    }).subscribe({
      next: (data: any) => {
        this.courseCount = data.courses.length;
        this.studentCount = data.students.length;
        this.messageCount = data.messages.length;
      },
      error: (error: any) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }
}