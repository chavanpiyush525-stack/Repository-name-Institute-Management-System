import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ContactForm } from '../../models/contact-form.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly analyticsService = inject(AnalyticsService);

  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  submitErrorMessage = '';

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(100),
        this.noSpecialCharactersValidator
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(255)
      ]],
      phone: ['', [
        Validators.maxLength(20),
        this.phoneValidator
      ]],
      subject: ['', [
        Validators.required, 
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      message: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(2000)
      ]],
      courseInterest: ['', [Validators.maxLength(100)]]
    });
  }

  // Custom validators for enhanced security and validation
  private noSpecialCharactersValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    // Allow letters, spaces, hyphens, and apostrophes for names
    const namePattern = /^[a-zA-Z\s\-']+$/;
    return namePattern.test(control.value) ? null : { invalidCharacters: true };
  }

  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    // Allow digits, spaces, hyphens, parentheses, and plus sign
    const phonePattern = /^[\d\s\-\(\)\+]+$/;
    return phonePattern.test(control.value) ? null : { invalidPhone: true };
  }

  // Sanitize input to prevent XSS
  private sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = false;
      this.submitSuccess = false;
      this.submitErrorMessage = '';

      // Sanitize form data before submission
      const rawFormData = this.contactForm.value;
      const formData: ContactForm = {
        name: this.sanitizeInput(rawFormData.name),
        email: this.sanitizeInput(rawFormData.email),
        phone: this.sanitizeInput(rawFormData.phone),
        subject: this.sanitizeInput(rawFormData.subject),
        message: this.sanitizeInput(rawFormData.message),
        courseInterest: this.sanitizeInput(rawFormData.courseInterest)
      };

      // Additional validation after sanitization
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        this.submitError = true;
        this.submitErrorMessage = 'Please fill in all required fields with valid information.';
        this.isSubmitting = false;
        return;
      }

      // Track form submission attempt
      this.analyticsService.trackCtaClick('contact_form_submit', 'contact_page', {
        subject: formData.subject,
        hasPhone: !!formData.phone,
        hasCourseInterest: !!formData.courseInterest
      });

      this.apiService.submitContactForm(formData).subscribe({
        next: (response) => {
          this.submitSuccess = true;
          this.isSubmitting = false;
          this.contactForm.reset();
          
          // Track successful form submission
          this.analyticsService.trackFormSubmission('contact_form', 'contact_page', true);
          
          // Show success message for 5 seconds, then allow new message
          setTimeout(() => {
            if (this.submitSuccess) {
              this.submitSuccess = false;
            }
          }, 5000);
        },
        error: (error) => {
          console.error('Error submitting contact form:', error);
          this.submitError = true;
          this.isSubmitting = false;
          
          // Set specific error message based on error type
          if (error.message.includes('400')) {
            this.submitErrorMessage = 'Please check your input and try again.';
          } else if (error.message.includes('429')) {
            this.submitErrorMessage = 'Too many requests. Please wait a moment before trying again.';
          } else if (error.message.includes('offline') || error.message.includes('network')) {
            this.submitErrorMessage = 'Network error. Please check your connection and try again.';
          } else {
            this.submitErrorMessage = 'An error occurred while sending your message. Please try again later.';
          }
          
          // Track failed form submission
          this.analyticsService.trackFormSubmission('contact_form', 'contact_page', false);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.contactForm.markAllAsTouched();
      
      // Scroll to first error field
      this.scrollToFirstError();
    }
  }

  private scrollToFirstError(): void {
    const firstErrorField = document.querySelector('.form-control.error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (firstErrorField as HTMLElement).focus();
    }
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submitSuccess = false;
    this.submitError = false;
    this.isSubmitting = false;
  }

  sendAnotherMessage(): void {
    this.submitSuccess = false;
    this.submitError = false;
    this.contactForm.reset();
  }

  handleContactClick(type: 'email' | 'phone' | 'address' | 'hours'): void {
    // Track contact method clicks
    this.analyticsService.trackCtaClick(`contact_${type}`, 'contact_page', {
      contactMethod: type
    });

    switch (type) {
      case 'email':
        window.location.href = 'mailto:info@institute.edu';
        break;
      case 'phone':
        window.location.href = 'tel:+15551234567';
        break;
      case 'address':
        // Open in maps application
        const address = encodeURIComponent('123 Education Street, Learning City, LC 12345');
        window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
        break;
      case 'hours':
        // Scroll to hours information or show more details
        this.showOfficeHoursDetails();
        break;
    }
  }

  private showOfficeHoursDetails(): void {
    // This could show a modal or expand details
    // For now, we'll just track the interaction
    console.log('Office hours details requested');
  }

  openInMaps(): void {
    // Track map interaction
    this.analyticsService.trackCtaClick('open_maps', 'contact_page', {
      source: 'location_section'
    });

    // Open in Google Maps with the institute address
    const address = encodeURIComponent('123 Education Street, Learning City, LC 12345');
    const mapsUrl = `https://maps.google.com/maps?q=${address}&hl=en`;
    window.open(mapsUrl, '_blank');
  }

  scheduleVisit(): void {
    // Track schedule visit interaction
    this.analyticsService.trackCtaClick('schedule_visit', 'contact_page', {
      source: 'location_section'
    });

    // Pre-fill contact form with visit scheduling subject
    this.contactForm.patchValue({
      subject: 'Campus Visit Scheduling Request',
      message: 'I would like to schedule a visit to your campus. Please let me know available times and any requirements.'
    });

    // Scroll to contact form
    const contactForm = document.querySelector('.contact-form-section');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Focus on the name field after scrolling
      setTimeout(() => {
        const nameField = document.getElementById('name');
        if (nameField) {
          nameField.focus();
        }
      }, 500);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['invalidCharacters']) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes';
      }
      if (field.errors['invalidPhone']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }
}