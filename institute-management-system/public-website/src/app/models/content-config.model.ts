export interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'gallery' | 'testimonial' | 'stats' | 'cta';
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  images?: string[];
  link?: {
    url: string;
    text: string;
    external?: boolean;
  };
  metadata?: Record<string, any>;
  visible: boolean;
  order: number;
}

export interface PageContent {
  pageId: string;
  title: string;
  description?: string;
  sections: ContentSection[];
  lastUpdated: Date;
}

export interface ContentConfig {
  pages: Record<string, PageContent>;
  globalSettings: {
    siteName: string;
    tagline: string;
    logo?: string;
    favicon?: string;
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
    contactInfo?: {
      email: string;
      phone: string;
      address: string;
    };
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadDate: Date;
  alt?: string;
  caption?: string;
}