import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Course, ContactForm, InstituteInfo, InstituteInfoResponse } from '../models';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const publicUrl = environment.publicApiUrl;

  const mockCourses: Course[] = [
    {
      id: 1,
      name: 'Angular Fundamentals',
      description: 'Learn Angular basics',
      category: 'Web Development',
      level: 'Beginner',
      duration: '4 weeks',
      price: 299
    },
    {
      id: 2,
      name: 'Advanced React',
      description: 'Master React concepts',
      category: 'Web Development',
      level: 'Advanced',
      duration: '6 weeks',
      price: 399
    }
  ];

  const mockInstituteInfoResponse: InstituteInfoResponse = {
    name: 'Test Institute',
    tagline: 'Excellence in Education',
    description: 'Leading institute for technical education',
    mission: 'To provide quality education',
    vision: 'To be the best institute',
    contactInfo: {
      email: 'test@institute.edu',
      phone: '+1234567890',
      address: '123 Test St',
      officeHours: '9 AM - 5 PM'
    },
    statistics: {
      yearsOfExperience: 10,
      totalStudents: 1000,
      totalCourses: 50,
      successRate: 95
    }
  };

  const mockContactForm: ContactForm = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'Test message'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    service.clearCache();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCourses', () => {
    it('should fetch courses from API', () => {
      service.getCourses().subscribe(courses => {
        expect(courses).toEqual(mockCourses);
      });

      const req = httpMock.expectOne(`${publicUrl}/courses`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCourses);
    });

    it('should return cached courses when not forcing refresh', () => {
      // First call to populate cache
      service.getCourses().subscribe();
      const req1 = httpMock.expectOne(`${publicUrl}/courses`);
      req1.flush(mockCourses);

      // Second call should use cache
      service.getCourses().subscribe(courses => {
        expect(courses).toEqual(mockCourses);
      });

      // No additional HTTP request should be made
      httpMock.expectNone(`${publicUrl}/courses`);
    });

    it('should force refresh when requested', () => {
      // First call to populate cache
      service.getCourses().subscribe();
      const req1 = httpMock.expectOne(`${publicUrl}/courses`);
      req1.flush(mockCourses);

      // Force refresh should make new HTTP request
      service.getCourses(true).subscribe(courses => {
        expect(courses).toEqual(mockCourses);
      });

      const req2 = httpMock.expectOne(`${publicUrl}/courses`);
      expect(req2.request.method).toBe('GET');
      req2.flush(mockCourses);
    });

    it('should handle API errors gracefully', () => {
      service.getCourses().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Server Error');
        }
      });

      const req = httpMock.expectOne(`${publicUrl}/courses`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getCourse', () => {
    it('should fetch single course by id', () => {
      const courseId = 1;
      const mockCourse = mockCourses[0];

      service.getCourse(courseId).subscribe(course => {
        expect(course).toEqual(mockCourse);
      });

      const req = httpMock.expectOne(`${publicUrl}/courses/${courseId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCourse);
    });

    it('should handle 404 error for non-existent course', () => {
      const courseId = 999;

      service.getCourse(courseId).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('The requested resource was not found.');
        }
      });

      const req = httpMock.expectOne(`${publicUrl}/courses/${courseId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('submitContactForm', () => {
    it('should submit contact form successfully', () => {
      const mockResponse = { success: true, message: 'Form submitted successfully' };

      service.submitContactForm(mockContactForm).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${publicUrl}/contact`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockContactForm);
      req.flush(mockResponse);
    });

    it('should handle form submission errors', () => {
      service.submitContactForm(mockContactForm).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Invalid request');
        }
      });

      const req = httpMock.expectOne(`${publicUrl}/contact`);
      req.flush('Validation Error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getInstituteInfo', () => {
    it('should fetch and transform institute info', () => {
      service.getInstituteInfo().subscribe(info => {
        expect(info.name).toBe(mockInstituteInfoResponse.name);
        expect(info.tagline).toBe(mockInstituteInfoResponse.tagline);
        expect(info.contactInfo.email).toBe(mockInstituteInfoResponse.contactInfo.email);
        expect(info.statistics).toEqual(mockInstituteInfoResponse.statistics);
      });

      const req = httpMock.expectOne(`${publicUrl}/institute-info`);
      expect(req.request.method).toBe('GET');
      req.flush(mockInstituteInfoResponse);
    });

    it('should return cached institute info when not forcing refresh', () => {
      // First call to populate cache
      service.getInstituteInfo().subscribe();
      const req1 = httpMock.expectOne(`${publicUrl}/institute-info`);
      req1.flush(mockInstituteInfoResponse);

      // Second call should use cache
      service.getInstituteInfo().subscribe(info => {
        expect(info.name).toBe(mockInstituteInfoResponse.name);
      });

      // No additional HTTP request should be made
      httpMock.expectNone(`${publicUrl}/institute-info`);
    });
  });

  describe('checkHealth', () => {
    it('should check API health', () => {
      const mockHealthResponse = { status: 'OK', timestamp: '2023-01-01T00:00:00Z' };

      service.checkHealth().subscribe(response => {
        expect(response).toEqual(mockHealthResponse);
      });

      const req = httpMock.expectOne(`${publicUrl}/health`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHealthResponse);
    });

    it('should handle health check failures', () => {
      service.checkHealth().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeDefined();
        }
      });

      const req = httpMock.expectOne(`${publicUrl}/health`);
      req.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    });
  });

  describe('refreshCourses', () => {
    it('should refresh courses data', () => {
      service.refreshCourses().subscribe(courses => {
        expect(courses).toEqual(mockCourses);
      });

      const req = httpMock.expectOne(`${publicUrl}/courses`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCourses);
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      // Populate cache first
      service.getCourses().subscribe();
      const req = httpMock.expectOne(`${publicUrl}/courses`);
      req.flush(mockCourses);

      expect(service.getCachedCourses()).toEqual(mockCourses);

      // Clear cache
      service.clearCache();
      expect(service.getCachedCourses()).toEqual([]);
      expect(service.getCachedInstituteInfo()).toBeNull();
    });

    it('should get cached courses', () => {
      service.getCourses().subscribe();
      const req = httpMock.expectOne(`${publicUrl}/courses`);
      req.flush(mockCourses);

      expect(service.getCachedCourses()).toEqual(mockCourses);
    });

    it('should get cached institute info', () => {
      service.getInstituteInfo().subscribe();
      const req = httpMock.expectOne(`${publicUrl}/institute-info`);
      req.flush(mockInstituteInfoResponse);

      const cachedInfo = service.getCachedInstituteInfo();
      expect(cachedInfo?.name).toBe(mockInstituteInfoResponse.name);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', () => {
      service.getCourses().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Unable to connect to server');
        }
      });

      const req = httpMock.expectOne(`${publicUrl}/courses`);
      req.error(new ErrorEvent('Network error'), { status: 0 });
    });

    it('should handle timeout errors', () => {
      service.getCourses().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Request timed out');
        }
      });

      const req = httpMock.expectOne(`${publicUrl}/courses`);
      req.error(new ErrorEvent('Timeout'), { status: 0 });
    });

    it('should handle rate limiting', () => {
      service.getCourses().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Too many requests');
        }
      });

      const req = httpMock.expectOne(`${publicUrl}/courses`);
      req.flush('Rate Limited', { status: 429, statusText: 'Too Many Requests' });
    });
  });
});