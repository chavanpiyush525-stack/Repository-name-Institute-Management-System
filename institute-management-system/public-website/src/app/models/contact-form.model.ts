export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  courseInterest?: string;
}

export interface ContactFormSubmission extends ContactForm {
  timestamp: Date;
  id?: string;
}