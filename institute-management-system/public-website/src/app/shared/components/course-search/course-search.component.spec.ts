import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CourseSearchComponent, SearchSuggestion } from './course-search.component';

describe('CourseSearchComponent', () => {
  let component: CourseSearchComponent;
  let fixture: ComponentFixture<CourseSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSearchComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search change with debounce', (done) => {
    spyOn(component.searchChange, 'emit');
    
    const mockEvent = {
      target: { value: 'test search' }
    } as any;
    
    component.onSearchInput(mockEvent);
    
    setTimeout(() => {
      expect(component.searchChange.emit).toHaveBeenCalledWith('test search');
      done();
    }, 350);
  });

  it('should show suggestions when search term exists', () => {
    component.searchTerm = 'test';
    component.showSuggestions = true;
    component.suggestions = [
      { type: 'course', value: 'Test Course', label: 'Test Course' } as SearchSuggestion
    ];
    
    component.onSearchFocus();
    expect(component.showSuggestionsList).toBe(true);
  });

  it('should select suggestion correctly', () => {
    const suggestion: SearchSuggestion = { type: 'course', value: 'Test Course', label: 'Test Course' };
    spyOn(component.suggestionSelect, 'emit');
    
    component.selectSuggestion(suggestion);
    
    expect(component.searchTerm).toBe('Test Course');
    expect(component.showSuggestionsList).toBe(false);
    expect(component.suggestionSelect.emit).toHaveBeenCalledWith(suggestion);
  });

  it('should clear search correctly', () => {
    component.searchTerm = 'test';
    component.showSuggestionsList = true;
    
    spyOn(component.searchChange, 'emit');
    component.clearSearch();
    
    expect(component.searchTerm).toBe('');
    expect(component.showSuggestionsList).toBe(false);
  });

  it('should get correct suggestion icon', () => {
    expect(component.getSuggestionIcon('course')).toBe('📚');
    expect(component.getSuggestionIcon('category')).toBe('🏷️');
    expect(component.getSuggestionIcon('instructor')).toBe('👨‍🏫');
    expect(component.getSuggestionIcon('unknown')).toBe('🔍');
  });
});