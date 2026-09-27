import { Component, OnInit, inject, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { InstituteInfo } from '../../../models/institute-info.model';

interface Feature {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

interface Statistic {
  value: string;
  label: string;
  icon: string;
  animated?: boolean;
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.scss'
})
export class FeaturesSectionComponent implements OnInit {
  @ViewChildren('statNumber') statNumbers!: QueryList<ElementRef>;
  
  private readonly apiService = inject(ApiService);
  
  instituteInfo: InstituteInfo | null = null;
  isLoading = false;
  
  features: Feature[] = [
    {
      icon: '🎓',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of real-world experience and proven track records.',
      highlight: true
    },
    {
      icon: '📚',
      title: 'Comprehensive Curriculum',
      description: 'Our courses cover everything from fundamentals to advanced topics, ensuring complete skill development.'
    },
    {
      icon: '💻',
      title: 'Hands-on Learning',
      description: 'Practice with real projects and case studies that prepare you for actual workplace challenges.'
    },
    {
      icon: '🏆',
      title: 'Industry Recognition',
      description: 'Our certificates are recognized by leading companies and help boost your career prospects.'
    },
    {
      icon: '🤝',
      title: 'Career Support',
      description: 'Get personalized career guidance, resume reviews, and job placement assistance.'
    },
    {
      icon: '⚡',
      title: 'Flexible Learning',
      description: 'Study at your own pace with online and offline options that fit your schedule.'
    }
  ];
  
  statistics: Statistic[] = [
    {
      value: '5000+',
      label: 'Students Trained',
      icon: '👥',
      animated: false
    },
    {
      value: '50+',
      label: 'Courses Available',
      icon: '📖',
      animated: false
    },
    {
      value: '95%',
      label: 'Success Rate',
      icon: '📈',
      animated: false
    },
    {
      value: '25+',
      label: 'Expert Instructors',
      icon: '👨‍🏫',
      animated: false
    }
  ];

  ngOnInit(): void {
    this.loadInstituteInfo();
    this.setupIntersectionObserver();
  }

  private loadInstituteInfo(): void {
    this.isLoading = true;
    
    this.apiService.getInstituteInfo().subscribe({
      next: (info) => {
        this.instituteInfo = info;
        this.updateStatisticsFromInfo(info);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading institute info:', error);
        this.isLoading = false;
      }
    });
  }

  private updateStatisticsFromInfo(info: InstituteInfo): void {
    if (info.statistics) {
      this.statistics[0].value = `${info.statistics.totalStudents}+`;
      this.statistics[1].value = `${info.statistics.totalCourses}+`;
      this.statistics[2].value = `${info.statistics.successRate}%`;
      // Keep the default instructor count since it's not in the backend response
    }
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    // Observe the statistics section
    setTimeout(() => {
      const statsSection = document.querySelector('.statistics-grid');
      if (statsSection) {
        observer.observe(statsSection);
      }
    }, 100);
  }

  private animateCounters(): void {
    this.statistics.forEach((stat, index) => {
      if (stat.value.includes('%')) {
        this.animatePercentage(index, parseInt(stat.value));
      } else if (stat.value.includes('+')) {
        const number = parseInt(stat.value.replace(/\D/g, ''));
        this.animateNumber(index, number);
      }
    });
  }

  private animateNumber(index: number, target: number): void {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      this.statistics[index].value = `${Math.floor(current)}+`;
      this.statistics[index].animated = true;
    }, duration / steps);
  }

  private animatePercentage(index: number, target: number): void {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      this.statistics[index].value = `${Math.floor(current)}%`;
      this.statistics[index].animated = true;
    }, duration / steps);
  }
}