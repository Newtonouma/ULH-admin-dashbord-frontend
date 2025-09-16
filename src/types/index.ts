// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User related types
export interface User {
  id: string;
  username: string;
  email: string;
}

// Auth related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Cause types
export interface Cause extends BaseEntity {
  title: string;
  goal: number;
  raised?: number;
  category: string;
  description: string;
  imageUrls: string[]; // Changed to array of image URLs
}

export interface CreateCauseData {
  title: string;
  goal: number;
  category: string;
  description: string;
  imageUrls: string[]; // Changed to array of image URLs
}

export interface UpdateCauseData {
  title?: string;
  goal?: number;
  raised?: number;
  category?: string;
  description?: string;
  imageUrls?: string[]; // Changed to array of image URLs
}

// Event types
export interface Event extends BaseEntity {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrls: string[]; // Array of image URLs
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrls?: string[]; // Array of image URLs
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  imageUrls?: string[]; // Array of image URLs
}

// Team Member types
export interface TeamMember extends BaseEntity {
  name: string;
  position: string;
  bio: string;
  imageUrls: string[]; // Changed to array of image URLs
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
}

export interface CreateTeamMemberData {
  name: string;
  position: string;
  bio: string;
  imageUrls: string[]; // Changed to array of image URLs
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
}

export interface UpdateTeamMemberData {
  name?: string;
  position?: string;
  bio?: string;
  imageUrls?: string[]; // Changed to array of image URLs
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
}

// Gallery types
export interface GalleryItem extends BaseEntity {
  title: string;
  description: string;
  imageUrls: string[]; // Changed to array of image URLs
  type: 'photo' | 'video';
}

export interface CreateGalleryItemData {
  title: string;
  description: string;
  imageUrls: string[]; // Changed to array of image URLs
  type: 'photo' | 'video';
}

export interface UpdateGalleryItemData {
  title?: string;
  description?: string;
  imageUrls?: string[]; // Changed to array of image URLs
  type?: 'photo' | 'video';
}

// Donation types
export interface Donation extends BaseEntity {
  amount: number;
  currency: string;
  donorEmail: string;
  donorName: string;
  causeId?: string;
  message?: string;
  status?: 'pending' | 'completed' | 'failed';
}

export interface CreateDonationData {
  amount: number;
  currency: string;
  donorEmail: string;
  donorName: string;
  causeId?: string;
  message?: string;
}

export interface UpdateDonationData {
  amount?: number;
  currency?: string;
  donorEmail?: string;
  donorName?: string;
  causeId?: string;
  message?: string;
  status?: 'pending' | 'completed' | 'failed';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types for UI components
export interface CauseFormData {
  title: string;
  goal: string; // String for form input, converted to number
  category: string;
  description: string;
  images: File[]; // Changed to File array for form uploads
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  endTime: string;
  location: string;
  imageUrl: string;
}

export interface TeamMemberFormData {
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  email: string;
  phone: string;
}

export interface GalleryItemFormData {
  title: string;
  description: string;
  imageUrl: string;
  type: 'photo' | 'video';
}

// Dashboard state types
export interface DashboardState {
  activeSection: 'causes' | 'events' | 'teams' | 'gallery' | 'donations';
  isLoading: boolean;
  error: string | null;
}

// Auth state types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}