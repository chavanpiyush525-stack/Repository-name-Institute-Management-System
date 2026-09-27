import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Testimonial } from '../../../models/institute-info.model';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss'
})
export class TestimonialsSectionComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ApiService);
  
  testimonials: Testimonial[] = [];
  currentSlide = 0;
  isLoading = false;
  autoSlideInterval: any;
  
  // Default testimonials for demo purposes
  defaultTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Software Developer',
      content: 'The courses here completely transformed my career. The instructors are incredibly knowledgeable and the hands-on approach made learning enjoyable and effective.',
      rating: 5,
      image: '',
      course: 'Full Stack Development'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Data Analyst',
      content: 'I was able to transition from marketing to data science thanks to their comprehensive curriculum. The support from instructors and career services was outstanding.',
      rating: 5,
      image: '',
      course: 'Data Science Bootcamp'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      content: 'The design thinking approach and practical projects helped me build a strong portfolio. I landed my dream job just two months after completing the course.',
      rating: 5,
      image: '',
      course: 'UX/UI Design'
    },
    {
      id: '4',
      name: 'David Thompson',
      role: 'DevOps Engineer',
      content: 'The cloud computing course was exactly what I needed to advance my career. The real-world scenarios and lab exercises were incredibly valuable.',
      rating: 5,
      image: '',
      course: 'Cloud Computing'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      role: 'Product Manager',
      content: 'The business analysis course gave me the skills and confidence to move into product management. The instructors really care about student success.',
      rating: 5,
      image: '',
      course: 'Business Analysis'
    },
    {
      id: '6',
      name: 'James Miller',
      role: 'Cybersecurity Specialist',
      content: 'The cybersecurity program is top-notch. The hands-on labs and real-world simulations prepared me for the challenges in the field.',
      rating: 5,
      image: '',
      course: 'Cybersecurity'
    }
  ];

  ngOnInit(): void {
    this.loadTestimonials();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  private loadTestimonials(): void {
    this.isLoading = true;
    
    this.apiService.getInstituteInfo().subscribe({
      next: (info) => {
        this.testimonials = info.testimonials && info.testimonials.length > 0 
          ? info.testimonials 
          : this.defaultTestimonials;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading testimonials:', error);
        this.testimonials = this.defaultTestimonials;
        this.isLoading = false;
      }
    });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
    this.resetAutoSlide();
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 
      ? this.testimonials.length - 1 
      : this.currentSlide - 1;
    this.resetAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetAutoSlide();
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  private resetAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  getVisibleTestimonials(): Testimonial[] {
    if (this.testimonials.length === 0) return [];
    
    const visible = [];
    const total = this.testimonials.length;
    
    // Show 3 testimonials at a time on desktop, 1 on mobile
    for (let i = 0; i < 3; i++) {
      const index = (this.currentSlide + i) % total;
      visible.push(this.testimonials[index]);
    }
    
    return visible;
  }
}