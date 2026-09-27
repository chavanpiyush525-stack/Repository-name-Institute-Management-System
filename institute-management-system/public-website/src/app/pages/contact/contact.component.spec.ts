import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ContactComponent } from './contact.component';
import { ApiService } from '../../services/api.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ContactForm } from '../../models/contact-form.model';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockAnalyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiService', ['submitContactForm']);
    mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', [
      'trackCtaClick',
      'trackFormSubmission'
    ]);

    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.contactForm.get('name')?.value).toBe('');
    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('subject')?.value).toBe('');
    expect(component.contactForm.get('message')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const nameControl = component.contactForm.get('name');
    const emailControl = component.contactForm.get('email');
    const subjectControl = component.contactForm.get('subject');
    const messageControl = component.contactForm.get('message');

    expect(nameControl?.hasError('required')).toBeTruthy();
    expect(emailControl?.hasError('required')).toBeTruthy();
    expect(subjectControl?.hasError('required')).toBeTruthy();
    expect(messageControl?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate name with custom validator', () => {
    const nameControl = component.contactForm.get('name');
    
    nameControl?.setValue('John123');
    expect(nameControl?.hasError('invalidCharacters')).toBeTruthy();
    
    nameControl?.setValue('John Doe');
    expect(nameControl?.hasError('invalidCharacters')).toBeFalsy();
  });

  it('should validate phone with custom validator', () => {
    const phoneControl = component.contactForm.get('phone');
    
    phoneControl?.setValue('invalid-phone!');
    expect(phoneControl?.hasError('invalidPhone')).toBeTruthy();
    
    phoneControl?.setValue('+1-234-567-8900');
    expect(phoneControl?.hasError('invalidPhone')).toBeFalsy();
  });

  it('should submit form successfully', () => {
    const mockResponse = { success: true, message: 'Form submitted successfully' };
    mockApiService.submitContactForm.and.returnValue(of(mockResponse));

    // Fill form with valid data
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message content'
    });

    component.onSubmit();

    expect(mockApiService.submitContactForm).toHaveBeenCalled();
    expect(mockAnalyticsService.trackCtaClick).toHaveBeenCalledWith(
      'contact_form_submit',
      'contact_page',
      jasmine.any(Object)
    );
    expect(component.submitSuccess).toBeTruthy();
    expect(component.isSubmitting).toBeFalsy();
  });

  it('should handle form submission error', () => {
    const mockError = new Error('Submission failed');
    mockApiService.submitContactForm.and.returnValue(throwError(() => mockError));

    // Fill form with valid data
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message content'
    });

    component.onSubmit();

    expect(component.submitError).toBeTruthy();
    expect(component.isSubmitting).toBeFalsy();
    expect(mockAnalyticsService.trackFormSubmission).toHaveBeenCalledWith(
      'contact_form',
      'contact_page',
      false
    );
  });

  it('should not submit invalid form', () => {
    component.onSubmit();

    expect(mockApiService.submitContactForm).not.toHaveBeenCalled();
    expect(component.contactForm.touched).toBeTruthy();
  });

  it('should sanitize input data', () => {
    const mockResponse = { success: true, message: 'Form submitted successfully' };
    mockApiService.submitContactForm.and.returnValue(of(mockResponse));

    // Fill form with potentially malicious data
    component.contactForm.patchValue({
      name: 'John<script>alert("xss")</script>',
      email: 'john@example.com',
      subject: 'Test javascript: alert("xss")',
      message: 'Test message with onclick=alert("xss")'
    });

    component.onSubmit();

    const submittedData = mockApiService.submitContactForm.calls.mostRecent().args[0] as ContactForm;
    expect(submittedData.name).toBe('Johnalert("xss")');
    expect(submittedData.subject).toBe('Test  alert("xss")');
    expect(submittedData.message).toBe('Test message with alert("xss")');
  });

  it('should reset form', () => {
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com'
    });
    component.submitSuccess = true;
    component.submitError = true;

    component.resetForm();

    expect(component.contactForm.get('name')?.value).toBe(null);
    expect(component.contactForm.get('email')?.value).toBe(null);
    expect(component.submitSuccess).toBeFalsy();
    expect(component.submitError).toBeFalsy();
  });

  it('should get field error messages', () => {
    const nameControl = component.contactForm.get('name');
    nameControl?.markAsTouched();

    expect(component.getFieldError('name')).toBe('Name is required');

    nameControl?.setValue('a');
    expect(component.getFieldError('name')).toContain('must be at least');

    nameControl?.setValue('John123');
    expect(component.getFieldError('name')).toBe('Name can only contain letters, spaces, hyphens, and apostrophes');
  });

  it('should handle contact method clicks', () => {
    spyOnProperty(window.location, 'href', 'set');
    spyOn(window, 'open');

    component.handleContactClick('email');
    expect(window.location.href).toBe('mailto:info@institute.edu');

    component.handleContactClick('phone');
    expect(window.location.href).toBe('tel:+15551234567');

    component.handleContactClick('address');
    expect(window.open).toHaveBeenCalledWith(
      jasmine.stringContaining('maps.google.com'),
      '_blank'
    );

    expect(mockAnalyticsService.trackCtaClick).toHaveBeenCalledTimes(3);
  });

  it('should schedule visit and pre-fill form', () => {
    const mockElement = { scrollIntoView: jasmine.createSpy() };
    spyOn(document, 'querySelector').and.returnValue(mockElement as any);

    component.scheduleVisit();

    expect(component.contactForm.get('subject')?.value).toBe('Campus Visit Scheduling Request');
    expect(component.contactForm.get('message')?.value).toContain('schedule a visit');
    expect(mockAnalyticsService.trackCtaClick).toHaveBeenCalledWith(
      'schedule_visit',
      'contact_page',
      { source: 'location_section' }
    );
  });
});