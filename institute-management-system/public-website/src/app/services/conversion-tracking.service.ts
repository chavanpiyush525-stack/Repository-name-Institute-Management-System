import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

export interface ConversionGoal {
  id: string;
  name: string;
  value?: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConversionTrackingService {
  private conversionGoals: ConversionGoal[] = [
    { id: 'contact_form', name: 'Contact Form Submission', value: 10, category: 'lead_generation' },
    { id: 'course_inquiry', name: 'Course Inquiry', value: 15, category: 'lead_generation' },
    { id: 'newsletter_signup', name: 'Newsletter Signup', value: 5, category: 'engagement' },
    { id: 'course_view', name: 'Course Detail View', value: 2, category: 'engagement' },
    { id: 'phone_click', name: 'Phone Number Click', value: 8, category: 'lead_generation' },
    { id: 'email_click', name: 'Email Click', value: 8, category: 'lead_generation' }
  ];

  constructor(private analytics: AnalyticsService) {}

  trackConversion(goalId: string, additionalData?: any): void {
    const goal = this.conversionGoals.find(g => g.id === goalId);
    if (!goal) {
      console.warn(`Conversion goal ${goalId} not found`);
      return;
    }

    // Track in Google Analytics
    this.analytics.trackConversion({
      event_name: 'conversion',
      value: goal.value,
      currency: 'USD',
      items: [{
        item_id: goal.id,
        item_name: goal.name,
        item_category: goal.category,
        quantity: 1,
        price: goal.value
      }]
    });

    // Track as custom event
    this.analytics.trackEvent({
      action: 'conversion',
      category: goal.category,
      label: goal.name,
      value: goal.value,
      custom_parameters: {
        goal_id: goalId,
        goal_name: goal.name,
        ...additionalData
      }
    });

    console.log(`Conversion tracked: ${goal.name}`, additionalData);
  }

  // Form-specific conversions
  trackFormConversion(formType: string, formData?: any): void {
    let goalId = 'contact_form';
    
    if (formType.includes('course')) {
      goalId = 'course_inquiry';
    }

    this.trackConversion(goalId, {
      form_type: formType,
      form_data: formData
    });
  }

  // CTA-specific conversions
  trackCTAClick(ctaType: string, location: string, courseId?: string): void {
    let goalId = 'course_view';
    
    if (ctaType.includes('phone')) {
      goalId = 'phone_click';
    } else if (ctaType.includes('email')) {
      goalId = 'email_click';
    }

    this.trackConversion(goalId, {
      cta_type: ctaType,
      location,
      course_id: courseId
    });
  }

  // Funnel tracking
  trackFunnelStep(funnelName: string, stepName: string, stepNumber: number): void {
    this.analytics.trackEvent({
      action: 'funnel_step',
      category: 'conversion_funnel',
      label: `${funnelName}_${stepName}`,
      value: stepNumber,
      custom_parameters: {
        funnel_name: funnelName,
        step_name: stepName,
        step_number: stepNumber
      }
    });
  }

  // A/B test tracking
  trackABTest(testName: string, variant: string, conversionGoalId?: string): void {
    this.analytics.trackEvent({
      action: 'ab_test',
      category: 'experimentation',
      label: `${testName}_${variant}`,
      custom_parameters: {
        test_name: testName,
        variant,
        conversion_goal: conversionGoalId
      }
    });

    // Set as custom dimension for segmentation
    this.analytics.setCustomDimension(1, `${testName}:${variant}`);
  }

  // User journey tracking
  trackUserJourney(touchpoint: string, source: string, medium: string): void {
    this.analytics.trackEvent({
      action: 'user_journey',
      category: 'customer_journey',
      label: touchpoint,
      custom_parameters: {
        touchpoint,
        source,
        medium,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Lead scoring
  calculateLeadScore(actions: string[]): number {
    let score = 0;
    
    actions.forEach(action => {
      switch (action) {
        case 'course_view':
          score += 2;
          break;
        case 'multiple_course_views':
          score += 5;
          break;
        case 'contact_form_start':
          score += 8;
          break;
        case 'contact_form_submit':
          score += 15;
          break;
        case 'phone_click':
          score += 12;
          break;
        case 'email_click':
          score += 10;
          break;
        case 'return_visitor':
          score += 3;
          break;
        default:
          score += 1;
      }
    });

    return score;
  }

  trackLeadScore(score: number, userId?: string): void {
    this.analytics.trackEvent({
      action: 'lead_score',
      category: 'lead_qualification',
      label: this.getLeadScoreCategory(score),
      value: score,
      custom_parameters: {
        lead_score: score,
        user_id: userId,
        score_category: this.getLeadScoreCategory(score)
      }
    });
  }

  private getLeadScoreCategory(score: number): string {
    if (score >= 30) return 'hot';
    if (score >= 15) return 'warm';
    if (score >= 5) return 'cold';
    return 'visitor';
  }
}