import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CourseFiltersComponent } from './course-filters.component';

describe('CourseFiltersComponent', () => {
  let component: CourseFiltersComponent;
  let fixture: ComponentFixture<CourseFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFiltersComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filter change when category changes', () => {
    spyOn(component.filterChange, 'emit');
    component.onCategoryChange('Programming');
    expect(component.filterChange.emit).toHaveBeenCalled();
  });

  it('should detect active filters correctly', () => {
    component.filterValues.searchTerm = 'test';
    expect(component.hasActiveFilters()).toBe(true);
    
    component.filterValues.searchTerm = '';
    expect(component.hasActiveFilters()).toBe(false);
  });

  it('should count active filters correctly', () => {
    component.filterValues.searchTerm = 'test';
    component.filterValues.selectedCategory = 'Programming';
    expect(component.getActiveFilterCount()).toBe(2);
  });

  it('should clear all filters', () => {
    component.filterValues.searchTerm = 'test';
    component.filterValues.selectedCategory = 'Programming';
    
    spyOn(component.clearFilters, 'emit');
    component.onClearFilters();
    
    expect(component.filterValues.searchTerm).toBe('');
    expect(component.filterValues.selectedCategory).toBe('');
    expect(component.clearFilters.emit).toHaveBeenCalled();
  });
});