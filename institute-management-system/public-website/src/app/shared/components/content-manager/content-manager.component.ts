import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentConfigService } from '../../../services/content-config.service';
import { ContentSection, ContentConfig } from '../../../models/content-config.model';

@Component({
  selector: 'app-content-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-manager.component.html',
  styleUrl: './content-manager.component.scss'
})
export class ContentManagerComponent implements OnInit {
  private readonly contentConfigService = inject(ContentConfigService);

  isVisible = false;
  currentConfig: ContentConfig | null = null;
  selectedPageId = 'about';
  selectedSectionId: string | null = null;
  
  // Form data for editing sections
  editingSection: Partial<ContentSection> = {};
  
  // Available section types
  sectionTypes = [
    { value: 'text', label: 'Text Content' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'gallery', label: 'Image Gallery' },
    { value: 'stats', label: 'Statistics' },
    { value: 'cta', label: 'Call to Action' },
    { value: 'testimonial', label: 'Testimonial' }
  ];

  ngOnInit() {
    this.loadConfig();
  }

  /**
   * Load current configuration
   */
  loadConfig() {
    this.currentConfig = this.contentConfigService.getContentConfig();
  }

  /**
   * Toggle content manager visibility
   */
  toggle() {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this.loadConfig();
    }
  }

  /**
   * Get sections for selected page
   */
  getPageSections(): ContentSection[] {
    if (!this.currentConfig || !this.currentConfig.pages[this.selectedPageId]) {
      return [];
    }
    return this.currentConfig.pages[this.selectedPageId].sections.sort((a, b) => a.order - b.order);
  }

  /**
   * Start editing a section
   */
  editSection(section: ContentSection) {
    this.selectedSectionId = section.id;
    this.editingSection = { 
      ...section,
      link: section.link ? { ...section.link } : { url: '', text: '' }
    };
  }

  /**
   * Start creating a new section
   */
  createNewSection() {
    this.selectedSectionId = 'new';
    this.editingSection = {
      id: `section-${Date.now()}`,
      type: 'text',
      title: '',
      content: '',
      visible: true,
      order: this.getPageSections().length + 1,
      link: { url: '', text: '' }
    };
  }

  /**
   * Save section changes
   */
  saveSection() {
    if (!this.editingSection.id || !this.editingSection.type) {
      return;
    }

    const section: ContentSection = {
      id: this.editingSection.id,
      type: this.editingSection.type as any,
      title: this.editingSection.title,
      subtitle: this.editingSection.subtitle,
      content: this.editingSection.content,
      imageUrl: this.editingSection.imageUrl,
      videoUrl: this.editingSection.videoUrl,
      images: this.editingSection.images,
      link: this.editingSection.link,
      metadata: this.editingSection.metadata,
      visible: this.editingSection.visible ?? true,
      order: this.editingSection.order ?? 1
    };

    this.contentConfigService.updatePageSection(this.selectedPageId, section);
    this.cancelEdit();
    this.loadConfig();
  }

  /**
   * Cancel editing
   */
  cancelEdit() {
    this.selectedSectionId = null;
    this.editingSection = {};
  }

  /**
   * Delete a section
   */
  deleteSection(sectionId: string) {
    if (confirm('Are you sure you want to delete this section?')) {
      this.contentConfigService.removePageSection(this.selectedPageId, sectionId);
      this.loadConfig();
    }
  }

  /**
   * Toggle section visibility
   */
  toggleSectionVisibility(section: ContentSection) {
    const updatedSection = { ...section, visible: !section.visible };
    this.contentConfigService.updatePageSection(this.selectedPageId, updatedSection);
    this.loadConfig();
  }

  /**
   * Move section up in order
   */
  moveSectionUp(section: ContentSection) {
    const sections = this.getPageSections();
    const currentIndex = sections.findIndex(s => s.id === section.id);
    if (currentIndex > 0) {
      const updatedSection = { ...section, order: section.order - 1 };
      const previousSection = { ...sections[currentIndex - 1], order: sections[currentIndex - 1].order + 1 };
      
      this.contentConfigService.updatePageSection(this.selectedPageId, updatedSection);
      this.contentConfigService.updatePageSection(this.selectedPageId, previousSection);
      this.loadConfig();
    }
  }

  /**
   * Move section down in order
   */
  moveSectionDown(section: ContentSection) {
    const sections = this.getPageSections();
    const currentIndex = sections.findIndex(s => s.id === section.id);
    if (currentIndex < sections.length - 1) {
      const updatedSection = { ...section, order: section.order + 1 };
      const nextSection = { ...sections[currentIndex + 1], order: sections[currentIndex + 1].order - 1 };
      
      this.contentConfigService.updatePageSection(this.selectedPageId, updatedSection);
      this.contentConfigService.updatePageSection(this.selectedPageId, nextSection);
      this.loadConfig();
    }
  }

  /**
   * Export configuration
   */
  exportConfig() {
    const config = this.contentConfigService.exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-config.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Import configuration
   */
  importConfig(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (this.contentConfigService.importConfig(content)) {
          alert('Configuration imported successfully!');
          this.loadConfig();
        } else {
          alert('Failed to import configuration. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  }

  /**
   * Reset to default configuration
   */
  resetToDefault() {
    if (confirm('Are you sure you want to reset to default configuration? This will lose all your changes.')) {
      this.contentConfigService.resetToDefault();
      this.loadConfig();
    }
  }
}