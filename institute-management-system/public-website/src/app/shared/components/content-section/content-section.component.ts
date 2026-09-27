import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentSection } from '../../../models/content-config.model';

@Component({
  selector: 'app-content-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './content-section.component.html',
  styleUrl: './content-section.component.scss'
})
export class ContentSectionComponent implements OnInit {
  @Input() section!: ContentSection;
  @Input() containerClass: string = 'container';

  ngOnInit() {
    if (!this.section) {
      console.warn('ContentSectionComponent: No section provided');
    }
  }

  /**
   * Check if section has valid content to display
   */
  hasContent(): boolean {
    if (!this.section) return false;
    
    switch (this.section.type) {
      case 'text':
        return !!(this.section.title || this.section.content);
      case 'image':
        return !!this.section.imageUrl;
      case 'video':
        return !!this.section.videoUrl;
      case 'gallery':
        return !!(this.section.images && this.section.images.length > 0);
      case 'stats':
        return !!(this.section.metadata?.['stats'] && this.section.metadata['stats'].length > 0);
      case 'cta':
        return !!(this.section.title || this.section.content);
      default:
        return false;
    }
  }

  /**
   * Get stats data from metadata
   */
  getStats(): any[] {
    return this.section.metadata?.['stats'] || [];
  }

  /**
   * Check if link is external
   */
  isExternalLink(): boolean {
    return this.section.link?.external || false;
  }

  /**
   * Get link target attribute
   */
  getLinkTarget(): string {
    return this.isExternalLink() ? '_blank' : '_self';
  }

  /**
   * Get link rel attribute for external links
   */
  getLinkRel(): string {
    return this.isExternalLink() ? 'noopener noreferrer' : '';
  }
}