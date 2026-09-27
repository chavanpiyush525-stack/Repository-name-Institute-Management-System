import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { App } from './app';
import { AppInitializationService } from './services/app-initialization.service';
import { AnalyticsInitService } from './services/analytics-init.service';
import { ServiceWorkerService } from './services/service-worker.service';

// Mock components
@Component({
  selector: 'app-main-layout',
  template: '<div>Mock Main Layout</div>'
})
class MockMainLayoutComponent {}

describe('App', () => {
  let mockAppInitService: jasmine.SpyObj<AppInitializationService>;
  let mockAnalyticsInitService: jasmine.SpyObj<AnalyticsInitService>;
  let mockServiceWorkerService: jasmine.SpyObj<ServiceWorkerService>;

  beforeEach(async () => {
    // Create spies for services
    mockAppInitService = jasmine.createSpyObj('AppInitializationService', ['initialize']);
    mockAnalyticsInitService = jasmine.createSpyObj('AnalyticsInitService', ['init']);
    mockServiceWorkerService = jasmine.createSpyObj('ServiceWorkerService', ['init']);

    // Setup service method returns
    mockAppInitService.initialize.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AppInitializationService, useValue: mockAppInitService },
        { provide: AnalyticsInitService, useValue: mockAnalyticsInitService },
        { provide: ServiceWorkerService, useValue: mockServiceWorkerService }
      ]
    })
    .overrideComponent(App, {
      remove: { imports: [] },
      add: { imports: [MockMainLayoutComponent] }
    })
    .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have correct title', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app['title']()).toBe('Institute Public Website');
  });

  it('should initialize services on ngOnInit', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    spyOn(console, 'log');
    
    await app.ngOnInit();
    
    expect(mockAppInitService.initialize).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Analytics and monitoring services initialized');
  });

  it('should handle app initialization failure', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    const error = new Error('Initialization failed');
    mockAppInitService.initialize.and.returnValue(Promise.reject(error));
    
    spyOn(console, 'error');
    
    await app.ngOnInit();
    
    expect(console.error).toHaveBeenCalledWith('App initialization failed:', error);
  });

  it('should render main layout component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-main-layout')).toBeTruthy();
  });
});