import { Injectable, signal } from '@angular/core';

export interface AppError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  autoHide?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private readonly errors = signal<AppError[]>([]);
  
  // Public readonly signal
  readonly currentErrors = this.errors.asReadonly();

  showError(message: string, autoHide: boolean = true): void {
    this.addError({
      id: this.generateId(),
      message,
      type: 'error',
      timestamp: new Date(),
      autoHide
    });
  }

  showWarning(message: string, autoHide: boolean = true): void {
    this.addError({
      id: this.generateId(),
      message,
      type: 'warning',
      timestamp: new Date(),
      autoHide
    });
  }

  showInfo(message: string, autoHide: boolean = true): void {
    this.addError({
      id: this.generateId(),
      message,
      type: 'info',
      timestamp: new Date(),
      autoHide
    });
  }

  showSuccess(message: string, autoHide: boolean = true): void {
    this.addError({
      id: this.generateId(),
      message,
      type: 'success',
      timestamp: new Date(),
      autoHide
    });
  }

  removeError(id: string): void {
    this.errors.update(errors => errors.filter(error => error.id !== id));
  }

  clearAll(): void {
    this.errors.set([]);
  }

  private addError(error: AppError): void {
    this.errors.update(errors => [...errors, error]);
    
    if (error.autoHide) {
      setTimeout(() => {
        this.removeError(error.id);
      }, 5000); // Auto-hide after 5 seconds
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}