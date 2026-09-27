# Institute Management System - Frontend

This is the Angular frontend for the Institute Management System.

## Features

- **Dashboard**: Overview of courses, students, and messages
- **Course Management**: Create, read, update, and delete courses
- **Student Management**: View student information
- **Message Management**: View messages from students and visitors

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Architecture

- **Components**: Organized by feature (courses, students, messages, dashboard)
- **Services**: HTTP services for API communication
- **Models**: TypeScript interfaces for data structures
- **Routing**: Lazy-loaded components for better performance
- **Material Design**: Angular Material for consistent UI

## API Integration

The frontend communicates with the Spring Boot backend running on `http://localhost:8080`.

### Endpoints Used

- `GET /admin/courses` - Get all courses
- `POST /admin/courses` - Create new course
- `GET /admin/courses/{id}` - Get course by ID
- `PUT /admin/courses/{id}` - Update course
- `DELETE /admin/courses/{id}` - Delete course
- `GET /admin/students` - Get all students
- `GET /admin/students/{id}` - Get student by ID
- `GET /admin/messages` - Get all messages
- `GET /admin/messages/{id}` - Get message by ID