import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Home - Institute'
  },
  {
    path: 'courses',
    loadComponent: () => import('./pages/courses/courses.component').then(m => m.CoursesComponent),
    title: 'Courses - Institute'
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./pages/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent),
    title: 'Course Details - Institute'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'About - Institute'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact - Institute'
  },
  {
    path: 'test-api',
    loadComponent: () => import('./test-api-integration.component').then(m => m.TestApiIntegrationComponent),
    title: 'API Integration Test - Institute'
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found - Institute'
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
