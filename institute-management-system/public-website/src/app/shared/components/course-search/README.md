# Course Search Component

An advanced search component with intelligent suggestions and real-time search capabilities for the course catalog.

## Features

### Search Capabilities
- **Real-time Search**: Debounced search with 300ms delay for optimal performance
- **Multi-field Search**: Searches across course names, descriptions, categories, and instructors
- **Intelligent Suggestions**: Context-aware suggestions based on search input
- **Search Highlighting**: Highlights matching text in suggestions

### Suggestion System
- **Course Suggestions**: Direct course matches with course names
- **Category Suggestions**: Category-based suggestions with course counts
- **Instructor Suggestions**: Instructor-based suggestions with course counts
- **Suggestion Types**: Visual icons to distinguish suggestion types

### User Experience
- **Keyboard Navigation**: Full keyboard support (Arrow keys, Enter, Escape)
- **Auto-complete**: Click or keyboard selection of suggestions
- **Clear Search**: Easy one-click search clearing
- **Loading States**: Visual feedback during search operations
- **No Results Handling**: Helpful messaging when no suggestions found

### Accessibility
- **ARIA Compliance**: Proper ARIA attributes for screen readers
- **Keyboard Navigation**: Complete keyboard accessibility
- **Focus Management**: Clear focus indicators and logical navigation
- **Screen Reader Support**: Descriptive labels and announcements

## Usage

```typescript
<app-course-search
  [searchTerm]="searchTerm"
  [suggestions]="suggestions"
  [isLoading]="isLoading"
  [showSuggestions]="true"
  [placeholder]="'Search courses...'"
  (searchChange)="onSearchChange($event)"
  (suggestionSelect)="onSuggestionSelect($event)"
  (searchFocus)="onSearchFocus()"
  (searchBlur)="onSearchBlur()"
></app-course-search>
```

## Input Properties

- `searchTerm`: Current search term
- `suggestions`: Array of search suggestions
- `isLoading`: Loading state indicator
- `showSuggestions`: Whether to show suggestion dropdown
- `placeholder`: Input placeholder text

## Output Events

- `searchChange`: Emitted when search term changes (debounced)
- `suggestionSelect`: Emitted when a suggestion is selected
- `searchFocus`: Emitted when search input gains focus
- `searchBlur`: Emitted when search input loses focus

## Interfaces

```typescript
interface SearchSuggestion {
  type: 'course' | 'category' | 'instructor';
  value: string;
  label: string;
  count?: number;
}
```

## Suggestion Types

### Course Suggestions
- **Icon**: 📚
- **Purpose**: Direct course matches
- **Behavior**: Sets search term to course name

### Category Suggestions
- **Icon**: 🏷️
- **Purpose**: Category-based filtering
- **Behavior**: Sets category filter and clears search

### Instructor Suggestions
- **Icon**: 👨‍🏫
- **Purpose**: Instructor-based search
- **Behavior**: Sets search term to instructor name

## Keyboard Navigation

- **Arrow Down**: Navigate to next suggestion
- **Arrow Up**: Navigate to previous suggestion
- **Enter**: Select current suggestion
- **Escape**: Close suggestions dropdown
- **Tab**: Move to next focusable element

## Performance Features

- **Debounced Input**: 300ms delay to prevent excessive searches
- **Suggestion Limiting**: Maximum 8 suggestions for optimal performance
- **Efficient Filtering**: Optimized suggestion generation
- **Memory Management**: Proper cleanup of subscriptions and timers

## Responsive Design

- **Mobile Optimized**: Touch-friendly interface
- **Flexible Layout**: Adapts to container width
- **Scalable Text**: Responsive font sizes
- **Touch Targets**: Appropriately sized for mobile interaction

## Customization

The component supports extensive customization through:
- **CSS Custom Properties**: Easy theming
- **SCSS Variables**: Design system integration
- **Template Slots**: Custom suggestion rendering
- **Event Handlers**: Custom behavior implementation