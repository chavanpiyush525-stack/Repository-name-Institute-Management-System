import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import('./components/public/homepage/homepage.component').then(m => m.HomepageComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./components/public/about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'courses',
        loadComponent: () => import('./components/courses/course-list/course-list.component').then(m => m.CourseListComponent)
    },
    {
        path: 'courses/new',
        loadComponent: () => import('./components/courses/course-form/course-form.component').then(m => m.CourseFormComponent)
    },
    {
        path: 'courses/edit/:id',
        loadComponent: () => import('./components/courses/course-form/course-form.component').then(m => m.CourseFormComponent)
    },
    {
        path: 'students',
        loadComponent: () => import('./components/students/student-list/student-list.component').then(m => m.StudentListComponent)
    },
    {
        path: 'messages',
        loadComponent: () => import('./components/messages/message-list/message-list.component').then(m => m.MessageListComponent)
    },
    {
        path: 'contact',
        loadComponent: () => import('./components/public/contact-form/contact-form.component').then(m => m.ContactFormComponent)
    }
];