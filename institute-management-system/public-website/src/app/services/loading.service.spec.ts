import { TestBed } from '@angular/core/testing';
import { of, throwError, delay } from 'rxjs';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with loading false', () => {
    expect(service.isLoading()).toBeFalsy();
    expect(service.message()).toBe('Loading...');
  });

  it('should show loading with default message', () => {
    service.show();
    
    expect(service.isLoading()).toBeTruthy();
    expect(service.message()).toBe('Loading...');
  });

  it('should show loading with custom message', () => {
    const customMessage = 'Fetching data...';
    service.show(customMessage);
    
    expect(service.isLoading()).toBeTruthy();
    expect(service.message()).toBe(customMessage);
  });

  it('should hide loading and reset message', () => {
    service.show('Custom message');
    expect(service.isLoading()).toBeTruthy();
    
    service.hide();
    
    expect(service.isLoading()).toBeFalsy();
    expect(service.message()).toBe('Loading...');
  });

  it('should wrap observable with loading state on success', (done) => {
    const testData = { test: 'data' };
    const source$ = of(testData).pipe(delay(10));
    
    // Initially not loading
    expect(service.isLoading()).toBeFalsy();
    
    source$.pipe(
      service.withLoading('Testing...')
    ).subscribe({
      next: (data) => {
        expect(data).toEqual(testData);
      },
      complete: () => {
        // Should be hidden after completion
        setTimeout(() => {
          expect(service.isLoading()).toBeFalsy();
          done();
        }, 0);
      }
    });
    
    // Should be loading immediately after subscription
    expect(service.isLoading()).toBeTruthy();
    expect(service.message()).toBe('Testing...');
  });

  it('should wrap observable with loading state on error', (done) => {
    const error = new Error('Test error');
    const source$ = throwError(() => error).pipe(delay(10));
    
    // Initially not loading
    expect(service.isLoading()).toBeFalsy();
    
    source$.pipe(
      service.withLoading('Testing error...')
    ).subscribe({
      error: (err) => {
        expect(err).toEqual(error);
        // Should be hidden after error
        setTimeout(() => {
          expect(service.isLoading()).toBeFalsy();
          done();
        }, 0);
      }
    });
    
    // Should be loading immediately after subscription
    expect(service.isLoading()).toBeTruthy();
    expect(service.message()).toBe('Testing error...');
  });

  it('should handle multiple show/hide calls correctly', () => {
    service.show('First message');
    expect(service.isLoading()).toBeTruthy();
    expect(service.message()).toBe('First message');
    
    service.show('Second message');
    expect(service.isLoading()).toBeTruthy();
    expect(service.message()).toBe('Second message');
    
    service.hide();
    expect(service.isLoading()).toBeFalsy();
    expect(service.message()).toBe('Loading...');
  });

  it('should use default message when withLoading called without message', (done) => {
    const source$ = of('test').pipe(delay(10));
    
    source$.pipe(
      service.withLoading()
    ).subscribe({
      complete: () => {
        done();
      }
    });
    
    expect(service.message()).toBe('Loading...');
  });
});