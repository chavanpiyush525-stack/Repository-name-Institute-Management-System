export interface Achievement {
  title: string;
  description: string;
  year?: number;
  icon?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating?: number;
  image?: string;
  course?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  officeHours?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface InstituteInfo {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  achievements?: Achievement[];
  testimonials?: Testimonial[];
  contactInfo: ContactInfo;
  establishedYear?: number;
  statistics?: {
    totalStudents: number;
    totalCourses: number;
    yearsOfExperience: number;
    successRate: number;
  };
}

// Backend response structure
export interface InstituteInfoResponse {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    officeHours: string;
  };
  statistics: {
    totalStudents: number;
    totalCourses: number;
    yearsOfExperience: number;
    successRate: number;
  };
}