# Public Website Module - Design Document

## Overview

The Public Website Module is a modern, responsive web application that serves as the public face of the Institute Management System. Built with Angular and integrated with the existing backend, it provides visitors with comprehensive information about the institute and its offerings.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Public Web    │    │   Shared API    │    │   Admin Panel   │
│   (Angular)     │◄──►│   (Spring Boot) │◄──►│   (Angular)     │
│   Port: 4300    │    │   Port: 8080    │    │   Port: 4200    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**
- Angular 17 (Standalone Components)
- Angular Material for UI components
- Angular Animations for smooth transitions
- RxJS for reactive programming
- TypeScript for type safety

**Backend Integration:**
- Shared Spring Boot API (existing)
- RESTful endpoints for course data
- Contact form integration with message system

**Styling:**
- SCSS with custom design system
- Responsive design with CSS Grid/Flexbox
- Modern animations and transitions
- Mobile-first approach

## Components and Interfaces

### Core Components

#### 1. Landing Page Component
```typescript
@Component({
  selector: 'app-landing',
  template: `
    <app-hero-section></app-hero-section>
    <app-features-section></app-features-section>
    <app-testimonials-section></app-testimonials-section>
    <app-cta-section></app-cta-section>
  `
})
```

#### 2. Course Catalog Component
```typescript
@Component({
  selector: 'app-course-catalog',
  template: `
    <app-course-filters></app-course-filters>
    <app-course-grid [courses]="courses"></app-course-grid>
    <app-course-pagination></app-course-pagination>
  `
})
```

#### 3. Course Detail Component
```typescript
@Component({
  selector: 'app-course-detail',
  template: `
    <app-course-header [course]="course"></app-course-header>
    <app-course-content [course]="course"></app-course-content>
    <app-enrollment-cta [course]="course"></app-enrollment-cta>
  `
})
```

#### 4. Contact Component
```typescript
@Component({
  selector: 'app-contact',
  template: `
    <app-contact-form></app-contact-form>
    <app-contact-info></app-contact-info>
    <app-location-map></app-location-map>
  `
})
```

### Shared Components

#### 1. Navigation Component
- Responsive navigation bar
- Mobile hamburger menu
- Smooth scroll to sections
- Active route highlighting

#### 2. Footer Component
- Institute information
- Quick links
- Social media links
- Contact details

#### 3. Hero Section Component
- Eye-catching banner
- Call-to-action buttons
- Animated background
- Responsive design

## Data Models

### Course Model (Shared with Admin)
```typescript
interface Course {
  id: number;
  name: string;
  description: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: string;
  price?: number;
  prerequisites?: string[];
  features?: string[];
}
```

### Contact Form Model
```typescript
interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  courseInterest?: string;
}
```

### Institute Info Model
```typescript
interface InstituteInfo {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  achievements: Achievement[];
  testimonials: Testimonial[];
  contactInfo: ContactInfo;
}
```

## Page Structure

### 1. Homepage (/)
- **Hero Section**: Institute branding and main CTA
- **Features Section**: Key highlights and benefits
- **Popular Courses**: Featured course cards
- **Testimonials**: Student success stories
- **Statistics**: Numbers and achievements
- **Call-to-Action**: Enrollment encouragement

### 2. Courses (/courses)
- **Course Grid**: All available courses
- **Filters**: Category, level, duration filters
- **Search**: Course search functionality
- **Sorting**: Price, popularity, alphabetical
- **Pagination**: Course list pagination

### 3. Course Detail (/courses/:id)
- **Course Header**: Title, price, rating
- **Course Content**: Description, curriculum
- **Prerequisites**: Required knowledge
- **Instructor Info**: Teacher details
- **Enrollment CTA**: Sign up button

### 4. About (/about)
- **Institute Story**: History and mission
- **Team Section**: Faculty and staff
- **Achievements**: Awards and recognition
- **Facilities**: Campus and resources
- **Values**: Core principles

### 5. Contact (/contact)
- **Contact Form**: Inquiry submission
- **Contact Information**: Phone, email, address
- **Location Map**: Interactive map
- **Office Hours**: Availability information
- **FAQ Section**: Common questions

## Error Handling

### Error Pages
- **404 Not Found**: Custom page with navigation
- **500 Server Error**: Friendly error message
- **Network Error**: Offline/connection issues
- **Form Validation**: Real-time field validation

### Error Recovery
- Retry mechanisms for API calls
- Graceful degradation for missing data
- Loading states and skeletons
- User-friendly error messages

## Testing Strategy

### Unit Testing
- Component testing with Angular Testing Utilities
- Service testing with mocked dependencies
- Pipe and utility function testing
- Form validation testing

### Integration Testing
- API integration testing
- Route navigation testing
- Component interaction testing
- End-to-end user flows

### Performance Testing
- Page load speed optimization
- Image optimization and lazy loading
- Bundle size analysis
- Lighthouse performance audits

## SEO and Performance

### SEO Optimization
- Meta tags for all pages
- Structured data markup
- Open Graph tags for social sharing
- XML sitemap generation
- Robots.txt configuration

### Performance Optimization
- Lazy loading for routes and images
- Code splitting and tree shaking
- Service worker for caching
- CDN integration for assets
- Minification and compression

## Deployment Strategy

### Development Environment
- Local development server (ng serve)
- Hot reload for rapid development
- Development API integration
- Debug tools and logging

### Production Deployment
- Build optimization (ng build --prod)
- Docker containerization
- CI/CD pipeline integration
- Environment-specific configurations
- Monitoring and analytics setup

## Integration Points

### Backend API Integration
- **GET /api/public/courses**: Fetch course catalog
- **GET /api/public/courses/:id**: Get course details
- **POST /api/public/contact**: Submit contact form
- **GET /api/public/institute-info**: Get institute information

### Admin System Integration
- Shared course data model
- Contact form messages in admin dashboard
- Consistent branding and styling
- Synchronized content updates

## Security Considerations

### Data Protection
- Input sanitization for contact forms
- XSS protection
- CSRF protection for form submissions
- Rate limiting for API calls

### Privacy Compliance
- Cookie consent management
- Privacy policy implementation
- Data retention policies
- GDPR compliance measures

## Accessibility

### WCAG 2.1 Compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

### Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Flexible layouts
- Scalable typography
- Optimized images for all devices