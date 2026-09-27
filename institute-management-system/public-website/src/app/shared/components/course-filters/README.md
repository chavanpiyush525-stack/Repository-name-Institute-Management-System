# Course Filters Component

A comprehensive filtering system for the course catalog with advanced search capabilities and real-time filtering.

## Features

### Filter Options
- **Category Filter**: Filter courses by category (Programming, Design, Business, etc.)
- **Level Filter**: Filter by difficulty level (Beginner, Intermediate, Advanced)
- **Duration Filter**: Filter by course duration (e.g., "4 weeks", "2 months")
- **Sort Options**: Sort by name, price, rating, or popularity
- **Sort Order**: Toggle between ascending and descending order

### Search Functionality
- **Real-time Search**: Debounced search with 300ms delay for optimal performance
- **Multi-field Search**: Searches across course name, description, category, and instructor
- **Search Suggestions**: Intelligent suggestions based on available courses, categories, and instructors
- **Keyboard Navigation**: Arrow keys to navigate suggestions, Enter to select, Escape to close

### User Experience
- **Active Filter Display**: Shows currently applied filters with individual remove options
- **Filter Count**: Displays number of active filters
- **Clear All**: One-click option to reset all filters
- **Results Summary**: Shows filtered vs total results count
- **No Results Handling**: Helpful message and suggestion to clear filters when no results found

### Accessibility
- **ARIA Labels**: Proper ARIA attributes for screen readers
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Focus Management**: Clear focus indicators and logical tab order
- **High Contrast Support**: Optimized for high contrast mode
- **Reduced Motion**: Respects user's motion preferences

## Usage

```typescript
<app-course-filters
  [filterOptions]="filterOptions"
  [filterValues]="filterValues"
  [totalResults]="allCourses.length"
  [filteredResults]="filteredCourses.length"
  [isLoading]="isLoading"
  (filterChange)="onFilterChange($event)"
  (clearFilters)="onClearFilters()"
></app-course-filters>
```

## Input Properties

- `filterOptions`: Available filter options (categories, levels, durations)
- `filterValues`: Current filter values
- `totalResults`: Total number of courses
- `filteredResults`: Number of courses after filtering
- `isLoading`: Loading state

## Output Events

- `filterChange`: Emitted when any filter changes
- `clearFilters`: Emitted when all filters are cleared

## Interfaces

```typescript
interface FilterOptions {
  categories: string[];
  levels: string[];
  durations: string[];
}

interface FilterValues {
  searchTerm: string;
  selectedCategory: string;
  selectedLevel: string;
  selectedDuration: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
```

## Performance Optimizations

- **Debounced Search**: Prevents excessive API calls during typing
- **Efficient Filtering**: Optimized filter algorithms for large datasets
- **Lazy Loading**: Components load only when needed
- **Memory Management**: Proper cleanup of subscriptions and timers

## Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Flexible Layout**: Adapts to different screen sizes
- **Touch Friendly**: Large touch targets for mobile interaction
- **Collapsible Filters**: Filters stack vertically on smaller screens