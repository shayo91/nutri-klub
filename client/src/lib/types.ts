// Common types used across the application

// Contact form data
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  privacyAgreed: boolean;
}

// BMI calculator data
export interface BMIFormData {
  weight: number;
  weightUnit: 'kg' | 'lb';
  height: number;
  heightUnit: 'cm' | 'in';
  age: number;
  gender: 'male' | 'female';
}

export interface BMIResult {
  bmi: number;
  category: string;
  indicatorPosition: number;
  message: string;
}

// Blog post
export interface BlogPost {
  id: number | string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  categories?: string[];
  image: string;
  date: string;
  slug: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

// Testimonial
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

// Newsletter subscription
export interface NewsletterSubscription {
  email: string;
}
