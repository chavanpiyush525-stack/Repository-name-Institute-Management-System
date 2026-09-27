import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { ContentConfigService } from '../../services/content-config.service';
import { InstituteInfo, Achievement } from '../../models/institute-info.model';
import { ContentSection } from '../../models/content-config.model';
import { ContentSectionComponent } from '../../shared/components/content-section/content-section.component';
import { ContentManagerComponent } from '../../shared/components/content-manager/content-manager.component';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  qualifications?: string[];
  experience?: string;
}

interface CoreValue {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, ContentSectionComponent, ContentManagerComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly loadingService = inject(LoadingService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly contentConfigService = inject(ContentConfigService);

  instituteInfo: InstituteInfo | null = null;
  isLoading = false;
  error: string | null = null;
  
  // Dynamic content sections
  contentSections: ContentSection[] = [];
  showDynamicContent = true;

  // Team members data
  teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'Director & Lead Instructor',
      bio: 'With over 15 years of experience in education and technology, Dr. Johnson leads our institute with passion and expertise.',
      qualifications: ['Ph.D. Computer Science', 'MBA Education Management', 'Certified Project Manager'],
      experience: '15+ years'
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      role: 'Senior Technical Instructor',
      bio: 'Former software architect with extensive industry experience, specializing in modern web technologies and software development.',
      qualifications: ['M.S. Software Engineering', 'AWS Certified Solutions Architect', 'Google Cloud Professional'],
      experience: '12+ years'
    },
    {
      id: '3',
      name: 'Ms. Emily Rodriguez',
      role: 'Career Counselor & Student Success Manager',
      bio: 'Dedicated to helping students achieve their career goals through personalized guidance and industry connections.',
      qualifications: ['M.A. Career Counseling', 'Certified Career Coach', 'HR Management Certification'],
      experience: '8+ years'
    },
    {
      id: '4',
      name: 'Mr. David Kumar',
      role: 'Industry Relations Manager',
      bio: 'Maintains strong relationships with industry partners to ensure our curriculum stays current and relevant.',
      qualifications: ['MBA Business Development', 'Industry Partnership Specialist', 'Corporate Training Expert'],
      experience: '10+ years'
    }
  ];

  // Core values data
  coreValues: CoreValue[] = [
    {
      title: 'Excellence',
      description: 'We strive for the highest standards in education, ensuring every student receives quality training.',
      icon: 'icon-star'
    },
    {
      title: 'Innovation',
      description: 'We embrace new technologies and teaching methods to provide cutting-edge education.',
      icon: 'icon-lightbulb'
    },
    {
      title: 'Integrity',
      description: 'We maintain honesty and transparency in all our interactions with students and partners.',
      icon: 'icon-shield'
    },
    {
      title: 'Student Success',
      description: 'Our primary focus is on helping every student achieve their career goals and aspirations.',
      icon: 'icon-graduation-cap'
    },
    {
      title: 'Community',
      description: 'We foster a supportive learning environment where students and faculty collaborate and grow together.',
      icon: 'icon-users'
    },
    {
      title: 'Continuous Learning',
      description: 'We believe in lifelong learning and continuously update our knowledge and teaching methods.',
      icon: 'icon-book'
    }
  ];

  // Achievements data (fallback if not provided by API)
  achievements: Achievement[] = [
    {
      title: 'Excellence in Education Award',
      description: 'Recognized by the State Education Board for outstanding contribution to technical education.',
      year: 2023,
      icon: 'icon-award'
    },
    {
      title: '95% Job Placement Rate',
      description: 'Consistently maintained high placement rates for our graduates across all programs.',
      year: 2023,
      icon: 'icon-briefcase'
    },
    {
      title: 'Industry Partnership Program',
      description: 'Established partnerships with over 50 leading companies for internships and job placements.',
      year: 2022,
      icon: 'icon-handshake'
    },
    {
      title: 'Digital Learning Innovation',
      description: 'Pioneered hybrid learning models that combine online and in-person instruction effectively.',
      year: 2021,
      icon: 'icon-monitor'
    }
  ];

  ngOnInit() {
    this.loadInstituteInfo();
    this.loadDynamicContent();
  }

  loadInstituteInfo() {
    this.isLoading = true;
    this.error = null;
    this.loadingService.show('Loading institute information...');

    this.apiService.getInstituteInfo().subscribe({
      next: (info) => {
        this.instituteInfo = info;
        
        // Use API achievements if available, otherwise use fallback
        if (info.achievements && info.achievements.length > 0) {
          this.achievements = info.achievements;
        }
        
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        this.error = error instanceof Error ? error.message : 'Failed to load institute information';
        this.errorHandler.showError(this.error);
        console.error('Error loading institute info:', error);
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  /**
   * Load dynamic content sections from content configuration
   */
  loadDynamicContent() {
    this.contentConfigService.getPageSections('about').subscribe({
      next: (sections) => {
        this.contentSections = sections;
        
        // Update sections with API data if available
        if (this.instituteInfo) {
          this.updateSectionsWithApiData();
        }
      },
      error: (error) => {
        console.error('Error loading dynamic content:', error);
        // Fallback to static content if dynamic content fails
        this.showDynamicContent = false;
      }
    });
  }

  /**
   * Update dynamic content sections with data from API
   */
  private updateSectionsWithApiData() {
    if (!this.instituteInfo) return;

    this.contentSections = this.contentSections.map(section => {
      switch (section.id) {
        case 'hero':
          return {
            ...section,
            title: this.instituteInfo!.name || section.title,
            subtitle: this.instituteInfo!.tagline || section.subtitle,
            content: this.instituteInfo!.description || section.content
          };
        case 'mission':
          return {
            ...section,
            content: this.instituteInfo!.mission || section.content
          };
        case 'vision':
          return {
            ...section,
            content: this.instituteInfo!.vision || section.content
          };
        case 'stats':
          if (this.instituteInfo!.statistics) {
            return {
              ...section,
              metadata: {
                ...section.metadata,
                stats: [
                  { label: 'Years of Excellence', value: `${this.instituteInfo!.statistics.yearsOfExperience}+` },
                  { label: 'Students Trained', value: `${this.instituteInfo!.statistics.totalStudents}+` },
                  { label: 'Courses Offered', value: `${this.instituteInfo!.statistics.totalCourses}+` },
                  { label: 'Success Rate', value: `${this.instituteInfo!.statistics.successRate}%` }
                ]
              }
            };
          }
          return section;
        default:
          return section;
      }
    });
  }

  /**
   * Toggle between dynamic and static content display
   */
  toggleContentMode() {
    this.showDynamicContent = !this.showDynamicContent;
  }

  /**
   * Check if we have dynamic content to show
   */
  hasDynamicContent(): boolean {
    return this.contentSections.length > 0;
  }
}