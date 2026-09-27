import { Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loadingState = signal<boolean>(false);
  private readonly loadingMessage = signal<string>('Loading...');
  
  // Public readonly signals
  readonly isLoading = this.loadingState.asReadonly();
  readonly message = this.loadingMessage.asReadonly();

  show(message: string = 'Loading...'): void {
    this.loadingMessage.set(message);
    this.loadingState.set(true);
  }

  hide(): void {
    this.loadingState.set(false);
    this.loadingMessage.set('Loading...');
  }

  // Utility method to wrap observables with loading state
  withLoading<T>(message: string = 'Loading...') {
    return (source: any) => {
      this.show(message);
      return source.pipe(
        // Using finalize operator to ensure loading is hidden regardless of success/error
        finalize(() => this.hide())
      );
    };
  }
}