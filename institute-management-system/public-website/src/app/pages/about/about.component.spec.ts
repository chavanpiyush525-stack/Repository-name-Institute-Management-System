import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AboutComponent } from './about.component';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { ContentConfigService } from '../../services/content-config.service';
import { InstituteInfo } from '../../models/institute-info.model';
import { ContentSection } from '../../models/content-config.model';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;
  let mockContentConfigService: jasmine.SpyObj<ContentConfigService>;

  const mockInstituteInfo: InstituteInfo = {
    name: 'Test Institute',
    tagline: 'Excellence in Education',
    description: 'Leading institute for technical education',
    mission: 'To provide quality education',
    vision: 'To be the best institute',
    achievements: [
      {
        title: 'Best Institute Award',
        description: 'Awarded for excellence',
        year: 2023,
        icon: 'icon-award'
      }
    ],
    testimonials: [],
    contactInfo: {
      email: 'test@institute.edu',
      phone: '+1234567890',
      address: '123 Test St',
      city: 'Test City',
      country: 'Test Country'
    },
    statistics: {
      yearsOfExperience: 10,
      totalStudents: 1000,
      totalCourses: 50,
      successRate: 95
    }
  };

  const mockContentSections: ContentSection[] = [
    {
      id: 'hero',
      type: 'text',
      title: 'About Us',
      subtitle: 'Learn more about our institute',
      content: 'We are a leading educational institution',
      order: 1,
      visible: true
    },
    {
      id: 'mission',
      type: 'text',
      title: 'Our Mission',
      content: 'Default mission statement',
      order: 2,
      visible: true
    }
  ];

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getInstituteInfo']);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', ['showError']);
    mockContentConfigService = jasmine.createSpyObj('ContentConfigService', ['getPageSections']);

    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        { provide: ContentConfigService, useValue: mockContentConfigService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load institute info on init', () => {
    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();

    expect(mockApiService.getInstituteInfo).toHaveBeenCalled();
    expect(mockLoadingService.show).toHaveBeenCalledWith('Loading institute information...');
    expect(mockLoadingService.hide).toHaveBeenCalled();
    expect(component.instituteInfo).toEqual(mockInstituteInfo);
  });

  it('should handle loading error', () => {
    const error = new Error('Failed to load');
    mockApiService.getInstituteInfo.and.returnValue(throwError(() => error));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();

    expect(component.error).toBe('Failed to load');
    expect(mockErrorHandler.showError).toHaveBeenCalledWith('Failed to load');
    expect(mockLoadingService.hide).toHaveBeenCalled();
  });

  it('should load dynamic content sections', () => {
    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();

    expect(mockContentConfigService.getPageSections).toHaveBeenCalledWith('about');
    expect(component.contentSections).toEqual(jasmine.any(Array));
  });

  it('should use API achievements when available', () => {
    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();

    expect(component.achievements).toEqual(mockInstituteInfo.achievements!);
  });

  it('should use fallback achievements when API achievements are empty', () => {
    const infoWithoutAchievements = { ...mockInstituteInfo, achievements: [] };
    mockApiService.getInstituteInfo.and.returnValue(of(infoWithoutAchievements));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();

    expect(component.achievements.length).toBeGreaterThan(0);
    expect(component.achievements[0].title).toBe('Excellence in Education Award');
  });

  it('should update content sections with API data', () => {
    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();

    const heroSection = component.contentSections.find(s => s.id === 'hero');
    const missionSection = component.contentSections.find(s => s.id === 'mission');
    
    expect(heroSection?.title).toBe(mockInstituteInfo.name);
    expect(heroSection?.subtitle).toBe(mockInstituteInfo.tagline);
    expect(missionSection?.content).toBe(mockInstituteInfo.mission);
  });

  it('should handle dynamic content loading error', () => {
    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(throwError(() => new Error('Content error')));
    
    spyOn(console, 'error');
    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Error loading dynamic content:', jasmine.any(Error));
    expect(component.showDynamicContent).toBeFalsy();
  });

  it('should toggle content mode', () => {
    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();
    
    const initialMode = component.showDynamicContent;
    component.toggleContentMode();
    
    expect(component.showDynamicContent).toBe(!initialMode);
  });

  it('should check if has dynamic content', () => {
    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();

    expect(component.hasDynamicContent()).toBeTruthy();
    
    component.contentSections = [];
    expect(component.hasDynamicContent()).toBeFalsy();
  });

  it('should have predefined team members', () => {
    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();

    expect(component.teamMembers.length).toBe(4);
    expect(component.teamMembers[0].name).toBe('Dr. Sarah Johnson');
    expect(component.teamMembers[0].role).toBe('Director & Lead Instructor');
  });

  it('should have predefined core values', () => {
    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(of(mockContentSections));
    
    fixture.detectChanges();

    expect(component.coreValues.length).toBe(6);
    expect(component.coreValues[0].title).toBe('Excellence');
    expect(component.coreValues[1].title).toBe('Innovation');
  });

  it('should update stats section with API statistics', () => {
    const sectionsWithStats: ContentSection[] = [
      ...mockContentSections,
      {
        id: 'stats',
        type: 'stats' as const,
        title: 'Our Statistics',
        content: '',
        order: 3,
        visible: true,
        metadata: { stats: [] }
      }
    ];

    mockApiService.getInstituteInfo.and.returnValue(of(mockInstituteInfo));
    mockContentConfigService.getPageSections.and.returnValue(of(sectionsWithStats));
    
    fixture.detectChanges();

    const statsSection = component.contentSections.find(s => s.id === 'stats');
    expect(statsSection?.metadata?.['stats']).toBeDefined();
    expect(statsSection?.metadata?.['stats'].length).toBe(4);
    expect(statsSection?.metadata?.['stats'][0].label).toBe('Years of Excellence');
    expect(statsSection?.metadata?.['stats'][0].value).toBe('10+');
  });
});