import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOptions {
  categories: string[];
  levels: string[];
  durations: string[];
}

export interface FilterValues {
  searchTerm: string;
  selectedCategory: string;
  selectedLevel: string;
  selectedDuration: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

@Component({
  selector: 'app-course-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-filters.component.html',
  styleUrl: './course-filters.component.scss'
})
export class CourseFiltersComponent {
  @Input() filterOptions: FilterOptions = {
    categories: [],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    durations: []
  };

  @Input() filterValues: FilterValues = {
    searchTerm: '',
    selectedCategory: '',
    selectedLevel: '',
    selectedDuration: '',
    sortBy: 'name',
    sortOrder: 'asc'
  };

  @Input() totalResults = 0;
  @Input() filteredResults = 0;
  @Input() isLoading = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<FilterValues>();
  @Output() clearFilters = new EventEmitter<void>();

  // Search debounce timer
  private searchTimeout: any;

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value;
    
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Debounce search input for better performance
    this.searchTimeout = setTimeout(() => {
      this.filterValues.searchTerm = searchTerm;
      this.searchChange.emit(searchTerm);
      this.emitFilterChange();
    }, 300);
  }

  onCategoryChange(category: string) {
    this.filterValues.selectedCategory = category;
    this.emitFilterChange();
  }

  onLevelChange(level: string) {
    this.filterValues.selectedLevel = level;
    this.emitFilterChange();
  }

  onDurationChange(duration: string) {
    this.filterValues.selectedDuration = duration;
    this.emitFilterChange();
  }

  onSortChange(sortBy: string) {
    this.filterValues.sortBy = sortBy;
    this.emitFilterChange();
  }

  toggleSortOrder() {
    this.filterValues.sortOrder = this.filterValues.sortOrder === 'asc' ? 'desc' : 'asc';
    this.emitFilterChange();
  }

  clearSearch() {
    // Clear search timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.filterValues.searchTerm = '';
    this.searchChange.emit('');
    this.emitFilterChange();
  }

  onClearFilters() {
    // Clear search timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Reset all filter values
    this.filterValues = {
      searchTerm: '',
      selectedCategory: '',
      selectedLevel: '',
      selectedDuration: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };

    this.clearFilters.emit();
  }

  private emitFilterChange() {
    this.filterChange.emit({ ...this.filterValues });
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filterValues.searchTerm ||
      this.filterValues.selectedCategory ||
      this.filterValues.selectedLevel ||
      this.filterValues.selectedDuration
    );
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.filterValues.searchTerm) count++;
    if (this.filterValues.selectedCategory) count++;
    if (this.filterValues.selectedLevel) count++;
    if (this.filterValues.selectedDuration) count++;
    return count;
  }
}