import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  private baseUrl = window.location.origin;

  constructor(private apiService: ApiService) {}

  generateSitemap(): Observable<string> {
    return this.apiService.getCourses().pipe(
      map(courses => {
        const urls: SitemapUrl[] = [
          // Static pages
          {
            loc: this.baseUrl,
            changefreq: 'weekly',
            priority: 1.0,
            lastmod: new Date().toISOString().split('T')[0]
          },
          {
            loc: `${this.baseUrl}/courses`,
            changefreq: 'daily',
            priority: 0.9,
            lastmod: new Date().toISOString().split('T')[0]
          },
          {
            loc: `${this.baseUrl}/about`,
            changefreq: 'monthly',
            priority: 0.8,
            lastmod: new Date().toISOString().split('T')[0]
          },
          {
            loc: `${this.baseUrl}/contact`,
            changefreq: 'monthly',
            priority: 0.7,
            lastmod: new Date().toISOString().split('T')[0]
          }
        ];

        // Add course pages
        courses.forEach(course => {
          urls.push({
            loc: `${this.baseUrl}/courses/${course.id}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: new Date().toISOString().split('T')[0]
          });
        });

        return this.generateXML(urls);
      })
    );
  }

  private generateXML(urls: SitemapUrl[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${url.loc}</loc>\n`;
      if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }
      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }
      if (url.priority !== undefined) {
        xml += `    <priority>${url.priority}</priority>\n`;
      }
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin paths (if any)
Disallow: /admin/
Disallow: /api/admin/

# Allow important paths
Allow: /courses/
Allow: /about
Allow: /contact
`;
  }
}