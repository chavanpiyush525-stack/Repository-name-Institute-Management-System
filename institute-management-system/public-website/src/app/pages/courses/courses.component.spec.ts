import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CoursesComponent } from './courses.component';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Course } from '../../models/course.model';
import { FilterValues } from '../../shared/components/course-filters/course-filters.component';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;

  const mockCourses: Course[] = [
    {
      id: 1,
      name: 'Angular Fundamentals',
      description: 'Learn Angular basics',
      category: 'Web Development',
      level: 'Beginner',
      duration: '4 weeks',
      price: 299,
      rating: 4.5,
      studentsEnrolled: 150,
      instructor: 'John Doe'
    },
    {
      id: 2,
      name: 'Advanced React',
      description: 'Master React concepts',
      category: 'Web Development',
      level: 'Advanced',
      duration: '6 weeks',
      price: 399,
      rating: 4.8,
      studentsEnrolled: 200,
      instructor: 'Jane Smith'
    },
    {
      id: 3,
      name: 'Python for Data Science',
      description: 'Data analysis with Python',
      category: 'Data Science',
      level: 'Intermediate',
      duration: '8 weeks',
      price: 499,
      rating: 4.6,
      studentsEnrolled: 120,
      instructor: 'Bob Johnson'
    }
  ];

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getCourses']);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', ['showError']);

    await TestBed.configureTestingModule({
      imports: [CoursesComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ErrorHandlerService, useValue: mockErrorHandler }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load courses on init', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    
    fixture.detectChanges();

    expect(mockApiService.getCourses).toHaveBeenCalled();
    expect(mockLoadingService.show).toHaveBeenCalledWith('Loading courses...');
    expect(mockLoadingService.hide).toHaveBeenCalled();
    expect(component.allCourses).toEqual(mockCourses);
    expect(component.filteredCourses).toEqual(mockCourses);
  });

  it('should handle loading error', () => {
    const error = new Error('Failed to load');
    mockApiService.getCourses.and.returnValue(throwError(() => error));
    
    fixture.detectChanges();

    expect(component.error).toBe('Failed to load');
    expect(mockErrorHandler.showError).toHaveBeenCalledWith('Failed to load');
    expect(mockLoadingService.hide).toHaveBeenCalled();
  });

  it('should extract filter options from courses', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    
    fixture.detectChanges();

    expect(component.filterOptions.categories).toEqual(['Web Development', 'Data Science']);
    expect(component.filterOptions.durations).toEqual(['4 weeks', '6 weeks', '8 weeks']);
    expect(component.filterOptions.levels).toEqual(['Beginner', 'Intermediate', 'Advanced']);
  });

  it('should filter courses by search term', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    fixture.detectChanges();

    component.onSearchChange('Angular');

    expect(component.filteredCourses.length).toBe(1);
    expect(component.filteredCourses[0].name).toBe('Angular Fundamentals');
  });

  it('should filter courses by category', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    fixture.detectChanges();

    const filterValues: FilterValues = {
      searchTerm: '',
      selectedCategory: 'Data Science',
      selectedLevel: '',
      selectedDuration: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };

    component.onFilterChange(filterValues);

    expect(component.filteredCourses.length).toBe(1);
    expect(component.filteredCourses[0].category).toBe('Data Science');
  });

  it('should filter courses by level', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    fixture.detectChanges();

    const filterValues: FilterValues = {
      searchTerm: '',
      selectedCategory: '',
      selectedLevel: 'Advanced',
      selectedDuration: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };

    component.onFilterChange(filterValues);

    expect(component.filteredCourses.length).toBe(1);
    expect(component.filteredCourses[0].level).toBe('Advanced');
  });

  it('should sort courses by price', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    fixture.detectChanges();

    const filterValues: FilterValues = {
      searchTerm: '',
      selectedCategory: '',
      selectedLevel: '',
      selectedDuration: '',
      sortBy: 'price',
      sortOrder: 'asc'
    };

    component.onFilterChange(filterValues);

    expect(component.filteredCourses[0].price).toBe(299);
    expect(component.filteredCourses[2].price).toBe(499);
  });

  it('should clear all filters', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    fixture.detectChanges();

    // Apply some filters first
    component.filterValues.searchTerm = 'Angular';
    component.filterValues.selectedCategory = 'Web Development';
    
    component.onClearFilters();

    expect(component.filterValues.searchTerm).toBe('');
    expect(component.filterValues.selectedCategory).toBe('');
    expect(component.filteredCourses).toEqual(mockCourses);
  });

  it('should handle pagination correctly', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    component.itemsPerPage = 2;
    fixture.detectChanges();

    expect(component.totalPages).toBe(2);
    expect(component.displayedCourses.length).toBe(2);

    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.displayedCourses.length).toBe(1);

    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should generate search suggestions', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    fixture.detectChanges();

    const suggestions = component.getFilteredSuggestions('Angular');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(s => s.label.includes('Angular'))).toBeTruthy();
  });

  it('should handle suggestion selection', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    fixture.detectChanges();

    const courseSuggestion = {
      type: 'course' as const,
      value: 'Angular Fundamentals',
      label: 'Angular Fundamentals',
      count: 1
    };

    component.onSuggestionSelect(courseSuggestion);
    expect(component.filterValues.searchTerm).toBe('Angular Fundamentals');

    const categorySuggestion = {
      type: 'category' as const,
      value: 'Web Development',
      label: 'Web Development',
      count: 2
    };

    component.onSuggestionSelect(categorySuggestion);
    expect(component.filterValues.selectedCategory).toBe('Web Development');
    expect(component.filterValues.searchTerm).toBe('');
  });

  it('should calculate page numbers correctly', () => {
    mockApiService.getCourses.and.returnValue(of(mockCourses));
    component.itemsPerPage = 1;
    fixture.detectChanges();

    component.currentPage = 2;
    const pageNumbers = component.getPageNumbers();
    
    expect(pageNumbers).toContain(1);
    expect(pageNumbers).toContain(2);
    expect(pageNumbers).toContain(3);
  });
});