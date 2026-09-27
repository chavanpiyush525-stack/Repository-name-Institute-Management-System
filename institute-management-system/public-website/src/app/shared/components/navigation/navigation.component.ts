import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  private router = inject(Router);
  
  protected readonly isMobileMenuOpen = signal(false);
  protected readonly currentRoute = signal('');
  
  protected readonly navigationItems = [
    { label: 'Home', route: '/', fragment: null },
    { label: 'Courses', route: '/courses', fragment: null },
    { label: 'About', route: '/about', fragment: null },
    { label: 'Contact', route: '/contact', fragment: null }
  ];

  constructor() {
    // Track current route for active highlighting
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
      });
  }

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected isActiveRoute(route: string): boolean {
    const current = this.currentRoute();
    if (route === '/') {
      return current === '/' || current === '';
    }
    return current.startsWith(route);
  }

  protected scrollToSection(fragment: string): void {
    if (fragment) {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    this.closeMobileMenu();
  }
}