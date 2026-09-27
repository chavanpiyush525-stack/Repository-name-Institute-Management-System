import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Course } from '../../models/course.model';
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { CourseFiltersComponent, FilterOptions, FilterValues } from '../../shared/components/course-filters/course-filters.component';
import { CourseSearchComponent, SearchSuggestion } from '../../shared/components/course-search/course-search.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CourseFiltersComponent, CourseSearchComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly loadingService = inject(LoadingService);
  private readonly errorHandler = inject(ErrorHandlerService);

  // Course data
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  displayedCourses: Course[] = [];

  // Filter and search
  filterOptions: FilterOptions = {
    categories: [],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    durations: []
  };

  filterValues: FilterValues = {
    searchTerm: '',
    selectedCategory: '',
    selectedLevel: '',
    selectedDuration: '',
    sortBy: 'name',
    sortOrder: 'asc'
  };

  // Search suggestions
  searchSuggestions: SearchSuggestion[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;

  // Loading and error states
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.error = null;
    this.loadingService.show('Loading courses...');

    this.apiService.getCourses().subscribe({
      next: (courses) => {
        this.allCourses = courses || [];
        this.extractFilterOptions();
        this.generateSearchSuggestions();
        this.applyFilters();
        this.isLoading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        this.error = error instanceof Error ? error.message : 'Failed to load courses';
        this.errorHandler.showError(this.error);
        console.error('Error loading courses:', error);
        this.isLoading = false;
        this.loadingService.hide();
      }
    });
  }

  private extractFilterOptions() {
    // Extract unique categories
    this.filterOptions.categories = [...new Set(this.allCourses
      .map(course => course.category)
      .filter(category => category)
    )] as string[];

    // Extract unique durations
    this.filterOptions.durations = [...new Set(this.allCourses
      .map(course => course.duration)
      .filter(duration => duration)
    )] as string[];
  }

  private generateSearchSuggestions() {
    const suggestions: SearchSuggestion[] = [];

    // Add course suggestions
    this.allCourses.forEach(course => {
      suggestions.push({
        type: 'course',
        value: course.name,
        label: course.name,
        count: 1
      });
    });

    // Add category suggestions
    this.filterOptions.categories.forEach(category => {
      const count = this.allCourses.filter(course => course.category === category).length;
      suggestions.push({
        type: 'category',
        value: category,
        label: category,
        count
      });
    });

    // Add instructor suggestions
    const instructors = [...new Set(this.allCourses
      .map(course => course.instructor)
      .filter(instructor => instructor)
    )] as string[];

    instructors.forEach(instructor => {
      const count = this.allCourses.filter(course => course.instructor === instructor).length;
      suggestions.push({
        type: 'instructor',
        value: instructor,
        label: instructor,
        count
      });
    });

    this.searchSuggestions = suggestions;
  }

  onSearchChange(searchTerm: string) {
    this.filterValues.searchTerm = searchTerm;
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(filterValues: FilterValues) {
    this.filterValues = { ...filterValues };
    this.currentPage = 1;
    this.applyFilters();
  }

  onClearFilters() {
    this.filterValues = {
      searchTerm: '',
      selectedCategory: '',
      selectedLevel: '',
      selectedDuration: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    this.currentPage = 1;
    this.applyFilters();
  }

  onSuggestionSelect(suggestion: SearchSuggestion) {
    // Handle different suggestion types
    switch (suggestion.type) {
      case 'course':
        this.filterValues.searchTerm = suggestion.value;
        break;
      case 'category':
        this.filterValues.selectedCategory = suggestion.value;
        this.filterValues.searchTerm = '';
        break;
      case 'instructor':
        this.filterValues.searchTerm = suggestion.value;
        break;
    }
    this.currentPage = 1;
    this.applyFilters();
  }

  getFilteredSuggestions(searchTerm: string): SearchSuggestion[] {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const searchLower = searchTerm.toLowerCase();
    return this.searchSuggestions
      .filter(suggestion => 
        suggestion.label.toLowerCase().includes(searchLower)
      )
      .slice(0, 8); // Limit to 8 suggestions
  }

  private applyFilters() {
    let filtered = [...this.allCourses];

    // Apply search filter
    if (this.filterValues.searchTerm.trim()) {
      const searchLower = this.filterValues.searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.category?.toLowerCase().includes(searchLower) ||
        course.instructor?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (this.filterValues.selectedCategory) {
      filtered = filtered.filter(course => course.category === this.filterValues.selectedCategory);
    }

    // Apply level filter
    if (this.filterValues.selectedLevel) {
      filtered = filtered.filter(course => course.level === this.filterValues.selectedLevel);
    }

    // Apply duration filter
    if (this.filterValues.selectedDuration) {
      filtered = filtered.filter(course => course.duration === this.filterValues.selectedDuration);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (this.filterValues.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'studentsEnrolled':
          aValue = a.studentsEnrolled || 0;
          bValue = b.studentsEnrolled || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return this.filterValues.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.filterValues.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredCourses = filtered;
    this.updatePagination();
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedCourses = this.filteredCourses.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }


}