import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface SearchSuggestion {
  type: 'course' | 'category' | 'instructor';
  value: string;
  label: string;
  count?: number;
}

@Component({
  selector: 'app-course-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-search.component.html',
  styleUrl: './course-search.component.scss'
})
export class CourseSearchComponent implements OnDestroy {
  @Input() searchTerm = '';
  @Input() suggestions: SearchSuggestion[] = [];
  @Input() isLoading = false;
  @Input() showSuggestions = true;
  @Input() placeholder = 'Search courses...';

  @Output() searchChange = new EventEmitter<string>();
  @Output() suggestionSelect = new EventEmitter<SearchSuggestion>();
  @Output() searchFocus = new EventEmitter<void>();
  @Output() searchBlur = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  showSuggestionsList = false;
  selectedSuggestionIndex = -1;

  constructor() {
    // Setup debounced search
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.searchChange.emit(searchTerm);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchTerm = value;
    this.searchSubject.next(value);
    
    // Show suggestions if there's a search term
    this.showSuggestionsList = value.length > 0 && this.showSuggestions;
    this.selectedSuggestionIndex = -1;
  }

  onSearchFocus() {
    this.searchFocus.emit();
    if (this.searchTerm.length > 0 && this.showSuggestions) {
      this.showSuggestionsList = true;
    }
  }

  onSearchBlur() {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      this.showSuggestionsList = false;
      this.selectedSuggestionIndex = -1;
      this.searchBlur.emit();
    }, 200);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.showSuggestionsList || this.suggestions.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          this.suggestions.length - 1
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.max(
          this.selectedSuggestionIndex - 1,
          -1
        );
        break;

      case 'Enter':
        event.preventDefault();
        if (this.selectedSuggestionIndex >= 0) {
          this.selectSuggestion(this.suggestions[this.selectedSuggestionIndex]);
        }
        break;

      case 'Escape':
        this.showSuggestionsList = false;
        this.selectedSuggestionIndex = -1;
        break;
    }
  }

  selectSuggestion(suggestion: SearchSuggestion) {
    this.searchTerm = suggestion.value;
    this.showSuggestionsList = false;
    this.selectedSuggestionIndex = -1;
    this.suggestionSelect.emit(suggestion);
    this.searchSubject.next(suggestion.value);
  }

  clearSearch() {
    this.searchTerm = '';
    this.showSuggestionsList = false;
    this.selectedSuggestionIndex = -1;
    this.searchSubject.next('');
  }

  getSuggestionIcon(type: string): string {
    switch (type) {
      case 'course':
        return '📚';
      case 'category':
        return '🏷️';
      case 'instructor':
        return '👨‍🏫';
      default:
        return '🔍';
    }
  }

  highlightMatch(text: string, searchTerm: string): string {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}