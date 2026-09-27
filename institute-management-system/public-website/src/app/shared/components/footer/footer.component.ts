import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
  
  protected readonly quickLinks = [
    { label: 'Home', route: '/' },
    { label: 'Courses', route: '/courses' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' }
  ];

  protected readonly socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: 'facebook'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: 'twitter'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: 'linkedin'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: 'instagram'
    }
  ];

  protected readonly contactInfo = {
    address: '123 Education Street, Learning City, LC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@institute.edu',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM'
  };
}