import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HeroSectionComponent } from '../../shared/components/hero-section/hero-section.component';
import { FeaturesSectionComponent } from '../../shared/components/features-section/features-section.component';
import { TestimonialsSectionComponent } from '../../shared/components/testimonials-section/testimonials-section.component';
import { CtaSectionComponent } from '../../shared/components/cta-section/cta-section.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HeroSectionComponent,
        FeaturesSectionComponent,
        TestimonialsSectionComponent,
        CtaSectionComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all required sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('app-hero-section')).toBeTruthy();
    expect(compiled.querySelector('app-features-section')).toBeTruthy();
    expect(compiled.querySelector('app-testimonials-section')).toBeTruthy();
    expect(compiled.querySelector('app-cta-section')).toBeTruthy();
  });

  it('should have proper component structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('app-hero-section, app-features-section, app-testimonials-section, app-cta-section');
    
    expect(sections.length).toBe(4);
  });
});