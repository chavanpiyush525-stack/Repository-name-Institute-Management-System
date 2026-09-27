import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultSEO: SEOData = {
    title: 'Institute Management System - Quality Education & Training',
    description: 'Discover comprehensive courses and training programs at our institute. Expert instructors, modern facilities, and career-focused education.',
    keywords: 'institute, education, training, courses, learning, career development',
    image: '/assets/images/og-image.jpg',
    siteName: 'Institute Management System',
    type: 'website',
    author: 'Institute Management System'
  };

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateSEO(seoData: Partial<SEOData>): void {
    const data = { ...this.defaultSEO, ...seoData };

    // Update title
    if (data.title) {
      this.title.setTitle(data.title);
    }

    // Update meta tags
    this.updateMetaTag('description', data.description);
    this.updateMetaTag('keywords', data.keywords);
    this.updateMetaTag('author', data.author);

    // Open Graph tags
    this.updateMetaTag('og:title', data.title, 'property');
    this.updateMetaTag('og:description', data.description, 'property');
    this.updateMetaTag('og:image', data.image, 'property');
    this.updateMetaTag('og:url', data.url, 'property');
    this.updateMetaTag('og:type', data.type, 'property');
    this.updateMetaTag('og:site_name', data.siteName, 'property');

    // Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary_large_image', 'name');
    this.updateMetaTag('twitter:title', data.title, 'name');
    this.updateMetaTag('twitter:description', data.description, 'name');
    this.updateMetaTag('twitter:image', data.image, 'name');

    // Article specific tags
    if (data.publishedTime) {
      this.updateMetaTag('article:published_time', data.publishedTime, 'property');
    }
    if (data.modifiedTime) {
      this.updateMetaTag('article:modified_time', data.modifiedTime, 'property');
    }
  }

  private updateMetaTag(name: string, content?: string, attribute: string = 'name'): void {
    if (content) {
      if (this.meta.getTag(`${attribute}="${name}"`)) {
        this.meta.updateTag({ [attribute]: name, content });
      } else {
        this.meta.addTag({ [attribute]: name, content });
      }
    }
  }

  addStructuredData(data: StructuredData): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  removeStructuredData(): void {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => script.remove());
  }

  generateOrganizationSchema(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      'name': 'Institute Management System',
      'description': 'Quality education and training institute offering comprehensive courses',
      'url': window.location.origin,
      'logo': `${window.location.origin}/assets/images/logo.png`,
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+1-234-567-8900',
        'contactType': 'customer service',
        'email': 'info@institute.com'
      },
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '123 Education Street',
        'addressLocality': 'Learning City',
        'addressRegion': 'Education State',
        'postalCode': '12345',
        'addressCountry': 'US'
      },
      'sameAs': [
        'https://facebook.com/institute',
        'https://twitter.com/institute',
        'https://linkedin.com/company/institute'
      ]
    };
  }

  generateCourseSchema(course: any): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': course.name,
      'description': course.description,
      'provider': {
        '@type': 'EducationalOrganization',
        'name': 'Institute Management System',
        'url': window.location.origin
      },
      'courseCode': course.id?.toString(),
      'educationalLevel': course.level || 'Beginner',
      'timeRequired': course.duration || 'P4W',
      'offers': course.price ? {
        '@type': 'Offer',
        'price': course.price,
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock'
      } : undefined
    };
  }

  generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': `${window.location.origin}${item.url}`
      }))
    };
  }
}