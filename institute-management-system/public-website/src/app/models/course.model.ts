export interface Course {
  id?: number;
  name: string;
  description: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: string;
  price?: number;
  prerequisites?: string; // Backend sends as string, can be parsed to array if needed
  features?: string; // Backend sends as string, can be parsed to array if needed
  instructor?: string;
  rating?: number;
  studentsEnrolled?: number;
}

// Helper functions to work with string-based prerequisites and features
export function parsePrerequisites(prerequisites?: string): string[] {
  if (!prerequisites) return [];
  return prerequisites.split(',').map(p => p.trim()).filter(p => p.length > 0);
}

export function parseFeatures(features?: string): string[] {
  if (!features) return [];
  return features.split(',').map(f => f.trim()).filter(f => f.length > 0);
}