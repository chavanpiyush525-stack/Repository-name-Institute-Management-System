import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ContentConfig, PageContent, ContentSection, MediaItem } from '../models/content-config.model';

@Injectable({
  providedIn: 'root'
})
export class ContentConfigService {
  private contentConfigSubject = new BehaviorSubject<ContentConfig | null>(null);
  public contentConfig$ = this.contentConfigSubject.asObservable();

  // Default content configuration
  private defaultConfig: ContentConfig = {
    pages: {
      about: {
        pageId: 'about',
        title: 'About Us',
        description: 'Learn more about our institute, mission, and team',
        sections: [
          {
            id: 'hero',
            type: 'text',
            title: 'Welcome to Our Institute',
            subtitle: 'Excellence in Education',
            content: 'We are committed to providing quality education and training to help students achieve their career goals.',
            visible: true,
            order: 1
          },
          {
            id: 'mission',
            type: 'text',
            title: 'Our Mission',
            content: 'To provide high-quality education and training that empowers students to achieve their professional goals and contribute meaningfully to society.',
            visible: true,
            order: 2
          },
          {
            id: 'vision',
            type: 'text',
            title: 'Our Vision',
            content: 'To be a leading educational institution recognized for excellence in teaching, innovation, and student success.',
            visible: true,
            order: 3
          },
          {
            id: 'stats',
            type: 'stats',
            title: 'Our Impact',
            metadata: {
              stats: [
                { label: 'Years of Excellence', value: '15+' },
                { label: 'Students Trained', value: '5000+' },
                { label: 'Courses Offered', value: '50+' },
                { label: 'Success Rate', value: '95%' }
              ]
            },
            visible: true,
            order: 4
          },
          {
            id: 'cta',
            type: 'cta',
            title: 'Ready to Start Your Journey?',
            content: 'Join thousands of students who have transformed their careers with our comprehensive courses.',
            link: {
              url: '/courses',
              text: 'Explore Courses'
            },
            visible: true,
            order: 5
          }
        ],
        lastUpdated: new Date()
      },
      home: {
        pageId: 'home',
        title: 'Home',
        description: 'Welcome to our institute',
        sections: [
          {
            id: 'hero',
            type: 'text',
            title: 'Transform Your Career',
            subtitle: 'Professional Training Institute',
            content: 'Join our comprehensive courses and unlock your potential with industry-leading education.',
            link: {
              url: '/courses',
              text: 'View Courses'
            },
            visible: true,
            order: 1
          }
        ],
        lastUpdated: new Date()
      }
    },
    globalSettings: {
      siteName: 'Professional Training Institute',
      tagline: 'Excellence in Education',
      contactInfo: {
        email: 'info@institute.com',
        phone: '+1 (555) 123-4567',
        address: '123 Education Street, Learning City, LC 12345'
      },
      socialMedia: {
        facebook: 'https://facebook.com/institute',
        twitter: 'https://twitter.com/institute',
        linkedin: 'https://linkedin.com/company/institute',
        instagram: 'https://instagram.com/institute'
      }
    },
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#3b82f6',
      accentColor: '#fbbf24',
      fontFamily: 'Inter, sans-serif'
    }
  };

  constructor() {
    this.loadContentConfig();
  }

  /**
   * Load content configuration from local storage or use default
   */
  private loadContentConfig(): void {
    try {
      const savedConfig = localStorage.getItem('content-config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        // Ensure dates are properly parsed
        Object.values(config.pages).forEach((page: any) => {
          page.lastUpdated = new Date(page.lastUpdated);
        });
        this.contentConfigSubject.next(config);
      } else {
        this.contentConfigSubject.next(this.defaultConfig);
      }
    } catch (error) {
      console.error('Error loading content config:', error);
      this.contentConfigSubject.next(this.defaultConfig);
    }
  }

  /**
   * Save content configuration to local storage
   */
  private saveContentConfig(config: ContentConfig): void {
    try {
      localStorage.setItem('content-config', JSON.stringify(config));
    } catch (error) {
      console.error('Error saving content config:', error);
    }
  }

  /**
   * Get current content configuration
   */
  getContentConfig(): ContentConfig | null {
    return this.contentConfigSubject.value;
  }

  /**
   * Get page content by page ID
   */
  getPageContent(pageId: string): Observable<PageContent | null> {
    const config = this.contentConfigSubject.value;
    if (config && config.pages[pageId]) {
      return of(config.pages[pageId]);
    }
    return of(null);
  }

  /**
   * Get visible sections for a page, sorted by order
   */
  getPageSections(pageId: string): Observable<ContentSection[]> {
    const config = this.contentConfigSubject.value;
    if (config && config.pages[pageId]) {
      const sections = config.pages[pageId].sections
        .filter(section => section.visible)
        .sort((a, b) => a.order - b.order);
      return of(sections);
    }
    return of([]);
  }

  /**
   * Update page content
   */
  updatePageContent(pageId: string, content: Partial<PageContent>): void {
    const config = this.contentConfigSubject.value;
    if (config) {
      if (!config.pages[pageId]) {
        config.pages[pageId] = {
          pageId,
          title: content.title || 'Untitled Page',
          sections: [],
          lastUpdated: new Date()
        };
      }

      config.pages[pageId] = {
        ...config.pages[pageId],
        ...content,
        lastUpdated: new Date()
      };

      this.saveContentConfig(config);
      this.contentConfigSubject.next(config);
    }
  }

  /**
   * Add or update a section in a page
   */
  updatePageSection(pageId: string, section: ContentSection): void {
    const config = this.contentConfigSubject.value;
    if (config) {
      if (!config.pages[pageId]) {
        config.pages[pageId] = {
          pageId,
          title: 'Untitled Page',
          sections: [],
          lastUpdated: new Date()
        };
      }

      const existingIndex = config.pages[pageId].sections.findIndex(s => s.id === section.id);
      if (existingIndex >= 0) {
        config.pages[pageId].sections[existingIndex] = section;
      } else {
        config.pages[pageId].sections.push(section);
      }

      config.pages[pageId].lastUpdated = new Date();
      this.saveContentConfig(config);
      this.contentConfigSubject.next(config);
    }
  }

  /**
   * Remove a section from a page
   */
  removePageSection(pageId: string, sectionId: string): void {
    const config = this.contentConfigSubject.value;
    if (config && config.pages[pageId]) {
      config.pages[pageId].sections = config.pages[pageId].sections.filter(s => s.id !== sectionId);
      config.pages[pageId].lastUpdated = new Date();
      this.saveContentConfig(config);
      this.contentConfigSubject.next(config);
    }
  }

  /**
   * Update global settings
   */
  updateGlobalSettings(settings: Partial<ContentConfig['globalSettings']>): void {
    const config = this.contentConfigSubject.value;
    if (config) {
      config.globalSettings = { ...config.globalSettings, ...settings };
      this.saveContentConfig(config);
      this.contentConfigSubject.next(config);
    }
  }

  /**
   * Update theme settings
   */
  updateTheme(theme: Partial<ContentConfig['theme']>): void {
    const config = this.contentConfigSubject.value;
    if (config) {
      config.theme = { ...config.theme, ...theme };
      this.saveContentConfig(config);
      this.contentConfigSubject.next(config);
    }
  }

  /**
   * Reset to default configuration
   */
  resetToDefault(): void {
    localStorage.removeItem('content-config');
    this.contentConfigSubject.next(this.defaultConfig);
  }

  /**
   * Export configuration as JSON
   */
  exportConfig(): string {
    const config = this.contentConfigSubject.value;
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  importConfig(configJson: string): boolean {
    try {
      const config = JSON.parse(configJson);
      // Basic validation
      if (config.pages && config.globalSettings && config.theme) {
        // Ensure dates are properly parsed
        Object.values(config.pages).forEach((page: any) => {
          page.lastUpdated = new Date(page.lastUpdated);
        });
        this.saveContentConfig(config);
        this.contentConfigSubject.next(config);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing config:', error);
      return false;
    }
  }
}