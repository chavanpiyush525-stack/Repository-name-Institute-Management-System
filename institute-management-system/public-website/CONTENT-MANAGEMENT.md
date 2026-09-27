# Public Website Content Management Guide

## Overview

This guide explains how to manage and update content on the Institute Management System's public website. The website is designed to be easily maintainable through configuration files and structured content management.

## Content Structure

### Configuration Files
The website content is managed through several configuration files located in the `src/assets/config/` directory:

```
src/assets/config/
├── institute-info.json     # Institute basic information
├── courses.json           # Course catalog (synced with backend)
├── testimonials.json      # Student testimonials
├── features.json          # Institute features and highlights
├── team.json             # Faculty and staff information
├── announcements.json    # News and announcements
└── contact-info.json     # Contact information and locations
```

## Content Management

### 1. Institute Information (`institute-info.json`)

```json
{
  "name": "Your Institute Name",
  "tagline": "Excellence in Education",
  "description": "Brief description of your institute...",
  "mission": "Our mission statement...",
  "vision": "Our vision statement...",
  "founded": "2020",
  "location": "City, Country",
  "accreditation": ["Accreditation 1", "Accreditation 2"],
  "statistics": {
    "students": 1500,
    "courses": 50,
    "instructors": 25,
    "graduates": 800
  }
}
```

**How to Update:**
1. Edit the `src/assets/config/institute-info.json` file
2. Update the relevant fields
3. Rebuild and redeploy the application

### 2. Course Information

Course information is automatically synchronized with the backend admin system. However, you can manage course display settings:

**Backend Management:**
- Log into the admin dashboard
- Navigate to "Courses" section
- Add, edit, or remove courses
- Changes will automatically appear on the public website

**Display Configuration:**
Edit `src/app/pages/courses/courses.component.ts` to modify:
- Number of courses per page
- Default sorting options
- Filter categories
- Course card layout

### 3. Testimonials (`testimonials.json`)

```json
{
  "testimonials": [
    {
      "id": 1,
      "name": "Student Name",
      "course": "Course Name",
      "image": "assets/images/testimonials/student1.jpg",
      "rating": 5,
      "text": "Testimonial text...",
      "date": "2024-01-15",
      "featured": true
    }
  ]
}
```

**Adding New Testimonials:**
1. Add student photo to `src/assets/images/testimonials/`
2. Update `testimonials.json` with new entry
3. Set `featured: true` for homepage display
4. Rebuild application

### 4. Institute Features (`features.json`)

```json
{
  "features": [
    {
      "id": 1,
      "title": "Expert Faculty",
      "description": "Learn from industry experts...",
      "icon": "school",
      "image": "assets/images/features/faculty.jpg",
      "order": 1,
      "active": true
    }
  ]
}
```

### 5. Team Information (`team.json`)

```json
{
  "team": [
    {
      "id": 1,
      "name": "Dr. John Smith",
      "position": "Director",
      "department": "Administration",
      "image": "assets/images/team/director.jpg",
      "bio": "Brief biography...",
      "qualifications": ["PhD in Education", "MBA"],
      "experience": "15 years",
      "email": "director@institute.com",
      "linkedin": "https://linkedin.com/in/johnsmith"
    }
  ]
}
```

### 6. Contact Information (`contact-info.json`)

```json
{
  "locations": [
    {
      "id": 1,
      "name": "Main Campus",
      "address": "123 Education Street",
      "city": "City Name",
      "state": "State",
      "zipCode": "12345",
      "country": "Country",
      "phone": "+1-555-0123",
      "email": "info@institute.com",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      },
      "hours": {
        "monday": "9:00 AM - 6:00 PM",
        "tuesday": "9:00 AM - 6:00 PM",
        "wednesday": "9:00 AM - 6:00 PM",
        "thursday": "9:00 AM - 6:00 PM",
        "friday": "9:00 AM - 5:00 PM",
        "saturday": "10:00 AM - 2:00 PM",
        "sunday": "Closed"
      }
    }
  ],
  "socialMedia": {
    "facebook": "https://facebook.com/yourinstitute",
    "twitter": "https://twitter.com/yourinstitute",
    "linkedin": "https://linkedin.com/company/yourinstitute",
    "instagram": "https://instagram.com/yourinstitute",
    "youtube": "https://youtube.com/yourinstitute"
  }
}
```

## Image Management

### Image Guidelines
- **Format:** Use WebP for best performance, with JPEG/PNG fallbacks
- **Size:** Optimize images before uploading
  - Hero images: 1920x1080px
  - Course thumbnails: 400x300px
  - Team photos: 300x300px
  - Testimonial photos: 150x150px
- **Naming:** Use descriptive, lowercase names with hyphens

### Image Locations
```
src/assets/images/
├── hero/              # Homepage hero images
├── courses/           # Course thumbnails
├── team/             # Faculty and staff photos
├── testimonials/     # Student photos
├── features/         # Feature section images
├── gallery/          # Institute gallery
└── logos/            # Institute logos and branding
```

### Adding New Images
1. Optimize images using tools like TinyPNG or ImageOptim
2. Place images in appropriate directory
3. Update corresponding JSON configuration file
4. Test image loading in development environment

## Styling and Branding

### Color Scheme
Edit `src/styles/_variables.scss` to update:
```scss
// Primary colors
$primary-color: #2c3e50;
$secondary-color: #3498db;
$accent-color: #e74c3c;

// Neutral colors
$text-color: #333333;
$background-color: #ffffff;
$light-gray: #f8f9fa;
```

### Typography
Update fonts in `src/styles/_typography.scss`:
```scss
// Import Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

// Font variables
$font-family-primary: 'Roboto', sans-serif;
$font-family-heading: 'Roboto', sans-serif;
```

### Logo Updates
1. Replace logo files in `src/assets/images/logos/`
2. Update logo references in navigation component
3. Ensure logos are available in multiple formats (SVG, PNG)

## SEO Management

### Meta Tags
Edit `src/index.html` for global meta tags:
```html
<meta name="description" content="Your institute description">
<meta name="keywords" content="education, courses, institute">
<meta property="og:title" content="Institute Name">
<meta property="og:description" content="Institute description">
<meta property="og:image" content="assets/images/og-image.jpg">
```

### Page-Specific SEO
Each page component includes SEO configuration:
```typescript
// In component constructor
this.titleService.setTitle('Page Title - Institute Name');
this.metaService.updateTag({ name: 'description', content: 'Page description' });
```

### Structured Data
Update structured data in `src/app/services/seo.service.ts` for:
- Organization information
- Course listings
- Contact information
- Reviews and ratings

## Content Publishing Workflow

### Development Environment
1. Make content changes in configuration files
2. Test changes locally: `npm start`
3. Verify all content displays correctly
4. Check responsive design on mobile devices

### Staging Environment
1. Deploy changes to staging: `npm run build:staging`
2. Review changes on staging server
3. Test all functionality
4. Get approval from stakeholders

### Production Deployment
1. Deploy to production: `npm run build:prod`
2. Verify deployment success
3. Test critical functionality
4. Monitor for any issues

## Maintenance Tasks

### Regular Content Updates
- **Weekly:** Review and update announcements
- **Monthly:** Update course information and pricing
- **Quarterly:** Review testimonials and team information
- **Annually:** Update institute statistics and achievements

### Content Backup
- Configuration files are version-controlled in Git
- Images should be backed up separately
- Database content (courses) is backed up with the backend system

### Performance Monitoring
- Monitor page load speeds after content updates
- Optimize images if performance degrades
- Use browser developer tools to check for issues

## Troubleshooting

### Common Issues

#### Images Not Loading
1. Check file path in configuration
2. Verify image exists in assets directory
3. Check image file permissions
4. Clear browser cache

#### Content Not Updating
1. Verify configuration file syntax (valid JSON)
2. Check for typos in file names
3. Ensure application rebuild after changes
4. Clear browser cache and service worker cache

#### Styling Issues
1. Check CSS syntax in style files
2. Verify class names match between HTML and CSS
3. Test in different browsers
4. Check for conflicting styles

### Getting Help
- Check browser console for error messages
- Review application logs for server-side issues
- Contact technical support: support@yourinstitute.com
- Refer to Angular documentation for framework-specific issues

## Best Practices

### Content Guidelines
- Keep text concise and engaging
- Use consistent tone and voice
- Ensure all content is accurate and up-to-date
- Include relevant keywords for SEO
- Make content accessible to all users

### Image Guidelines
- Always include alt text for accessibility
- Use high-quality, professional images
- Maintain consistent visual style
- Optimize for web performance
- Respect copyright and licensing

### Technical Guidelines
- Test changes in development before production
- Keep configuration files properly formatted
- Use version control for all changes
- Document any custom modifications
- Follow established naming conventions

## Advanced Customization

### Custom Components
For advanced content needs, you can create custom Angular components:

1. Generate new component: `ng generate component custom-content`
2. Add component to appropriate page
3. Style component with SCSS
4. Test thoroughly before deployment

### Dynamic Content
For frequently changing content, consider:
- Integration with headless CMS
- Database-driven content management
- API-based content updates
- Automated content synchronization

### Multilingual Support
To add multiple languages:
1. Install Angular i18n: `ng add @angular/localize`
2. Extract text for translation: `ng extract-i18n`
3. Create translation files
4. Configure build for multiple locales
5. Update deployment process

This guide should be updated as new features are added or processes change. For technical assistance, contact the development team.