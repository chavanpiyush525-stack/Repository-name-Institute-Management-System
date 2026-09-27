import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatDividerModule,
    RouterModule
  ],
  template: `
    <mat-toolbar class="main-toolbar">
      <div class="toolbar-content">
        <!-- Logo -->
        <div class="logo" routerLink="/">
          <mat-icon class="logo-icon">school</mat-icon>
          <span class="logo-text">Excellence Institute</span>
        </div>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav" *ngIf="!isMobile">
          <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon>home</mat-icon>
            Home
          </a>
          
          <a mat-button routerLink="/courses" routerLinkActive="active">
            <mat-icon>library_books</mat-icon>
            Courses
          </a>
          
          <a mat-button routerLink="/about" routerLinkActive="active">
            <mat-icon>info</mat-icon>
            About Us
          </a>
          
          <a mat-button routerLink="/contact" routerLinkActive="active">
            <mat-icon>contact_mail</mat-icon>
            Contact
          </a>

          <!-- Admin Menu -->
          <button mat-button [matMenuTriggerFor]="adminMenu" class="admin-menu-trigger">
            <mat-icon>admin_panel_settings</mat-icon>
            Admin
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          
          <mat-menu #adminMenu="matMenu" class="admin-menu">
            <button mat-menu-item routerLink="/dashboard">
              <mat-icon>dashboard</mat-icon>
              Dashboard
            </button>
            <button mat-menu-item routerLink="/students">
              <mat-icon>people</mat-icon>
              Students
            </button>
            <button mat-menu-item routerLink="/messages">
              <mat-icon>message</mat-icon>
              Messages
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/admin/settings">
              <mat-icon>settings</mat-icon>
              Settings
            </button>
          </mat-menu>
        </nav>

        <!-- Mobile Menu Button -->
        <button mat-icon-button *ngIf="isMobile" (click)="toggleMobileMenu()" class="mobile-menu-btn">
          <mat-icon>menu</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <!-- Mobile Navigation Drawer -->
    <mat-sidenav-container class="mobile-nav-container" *ngIf="isMobile">
      <mat-sidenav #drawer class="mobile-nav" mode="over" [opened]="mobileMenuOpen" (closed)="mobileMenuOpen = false">
        <div class="mobile-nav-header">
          <div class="mobile-logo">
            <mat-icon>school</mat-icon>
            <span>Excellence Institute</span>
          </div>
          <button mat-icon-button (click)="drawer.close()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <nav class="mobile-nav-links">
          <a mat-button routerLink="/" (click)="drawer.close()" class="mobile-nav-link">
            <mat-icon>home</mat-icon>
            Home
          </a>
          
          <a mat-button routerLink="/courses" (click)="drawer.close()" class="mobile-nav-link">
            <mat-icon>library_books</mat-icon>
            Courses
          </a>
          
          <a mat-button routerLink="/about" (click)="drawer.close()" class="mobile-nav-link">
            <mat-icon>info</mat-icon>
            About Us
          </a>
          
          <a mat-button routerLink="/contact" (click)="drawer.close()" class="mobile-nav-link">
            <mat-icon>contact_mail</mat-icon>
            Contact
          </a>

          <div class="mobile-admin-section">
            <div class="admin-section-title">
              <mat-icon>admin_panel_settings</mat-icon>
              Admin Panel
            </div>
            
            <a mat-button routerLink="/dashboard" (click)="drawer.close()" class="mobile-nav-link admin-link">
              <mat-icon>dashboard</mat-icon>
              Dashboard
            </a>
            
            <a mat-button routerLink="/students" (click)="drawer.close()" class="mobile-nav-link admin-link">
              <mat-icon>people</mat-icon>
              Students
            </a>
            
            <a mat-button routerLink="/messages" (click)="drawer.close()" class="mobile-nav-link admin-link">
              <mat-icon>message</mat-icon>
              Messages
            </a>
          </div>
        </nav>
      </mat-sidenav>
    </mat-sidenav-container>
  `,
  styles: [`
    .main-toolbar {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      border-bottom: 1px solid rgba(102, 126, 234, 0.2) !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 1000 !important;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .main-toolbar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
      background-size: 300% 100%;
      animation: gradientMove 3s ease-in-out infinite;
    }

    @keyframes gradientMove {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .toolbar-content {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .logo::before {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
      border-radius: 15px;
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05) rotate(2deg);
    }

    .logo:hover::before {
      opacity: 0.1;
    }

    .logo-icon {
      font-size: 2rem !important;
      width: 2rem !important;
      height: 2rem !important;
      color: #667eea;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .desktop-nav a,
    .desktop-nav button {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      padding: 10px 18px !important;
      border-radius: 25px !important;
      font-weight: 500 !important;
      text-transform: none !important;
      color: #333 !important;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .desktop-nav a::before,
    .desktop-nav button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
      transition: left 0.5s ease;
    }

    .desktop-nav a:hover,
    .desktop-nav button:hover {
      background: rgba(102, 126, 234, 0.1) !important;
      color: #667eea !important;
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
    }

    .desktop-nav a:hover::before,
    .desktop-nav button:hover::before {
      left: 100%;
    }

    .desktop-nav a.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      transform: translateY(-2px);
    }

    .desktop-nav a.active::before {
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    }

    .admin-menu-trigger {
      background: rgba(102, 126, 234, 0.1) !important;
      color: #667eea !important;
    }

    .admin-menu {
      margin-top: 8px;
      border-radius: 12px !important;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
    }

    .mobile-menu-btn {
      color: #667eea !important;
    }

    /* Mobile Navigation */
    .mobile-nav-container {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
      pointer-events: none;
    }

    .mobile-nav {
      width: 280px !important;
      background: white !important;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1) !important;
      pointer-events: all;
    }

    .mobile-nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .mobile-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .mobile-nav-links {
      display: flex;
      flex-direction: column;
      padding: 20px 0;
    }

    .mobile-nav-link {
      display: flex !important;
      align-items: center !important;
      gap: 16px !important;
      padding: 16px 24px !important;
      text-align: left !important;
      justify-content: flex-start !important;
      color: #333 !important;
      font-weight: 500 !important;
      text-transform: none !important;
      border-radius: 0 !important;
      transition: all 0.3s ease !important;
    }

    .mobile-nav-link:hover {
      background: rgba(102, 126, 234, 0.1) !important;
      color: #667eea !important;
    }

    .mobile-admin-section {
      margin-top: 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding-top: 20px;
    }

    .admin-section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      font-weight: 600;
      color: #667eea;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .admin-link {
      padding-left: 48px !important;
      background: rgba(102, 126, 234, 0.05) !important;
    }

    .admin-link:hover {
      background: rgba(102, 126, 234, 0.15) !important;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .toolbar-content {
        padding: 0 16px;
      }

      .logo-text {
        font-size: 1.3rem;
      }
    }

    @media (max-width: 480px) {
      .logo-text {
        display: none;
      }
    }
  `]
})
export class NavigationComponent {
  isMobile = false;
  mobileMenuOpen = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
      if (!this.isMobile) {
        this.mobileMenuOpen = false;
      }
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}