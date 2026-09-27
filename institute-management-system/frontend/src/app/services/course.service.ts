import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/admin/courses';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to server. Please check if the backend is running on port 8080.';
          break;
        case 400:
          errorMessage = 'Invalid course data. Please check your input.';
          break;
        case 404:
          errorMessage = 'Course not found or API endpoint unavailable.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('CourseService Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, this.httpOptions)
      .pipe(
        timeout(10000), // 10 second timeout
        retry(2), // Retry up to 2 times
        catchError(this.handleError)
      );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        timeout(10000),
        retry(1),
        catchError(this.handleError)
      );
  }

  createCourse(course: Course): Observable<Course> {
    console.log('Creating course:', course);
    console.log('API URL:', this.apiUrl);
    
    return this.http.post<Course>(this.apiUrl, course, this.httpOptions)
      .pipe(
        timeout(15000), // Longer timeout for create operations
        catchError(this.handleError)
      );
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    console.log('Updating course:', id, course);
    
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course, this.httpOptions)
      .pipe(
        timeout(15000),
        catchError(this.handleError)
      );
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        timeout(10000),
        catchError(this.handleError)
      );
  }
}