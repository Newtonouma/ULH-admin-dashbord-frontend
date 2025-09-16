import { apiClient, API_CONFIG } from '../lib/api-client';
import {
  Cause,
  CreateCauseData,
  UpdateCauseData,
  Event,
  CreateEventData,
  UpdateEventData,
  TeamMember,
  CreateTeamMemberData,
  UpdateTeamMemberData,
  GalleryItem,
  CreateGalleryItemData,
  UpdateGalleryItemData,
  Donation,
  CreateDonationData,
  UpdateDonationData,
} from '../types';

// Causes API
export class CausesApi {
  static async getAll(): Promise<Cause[]> {
    return apiClient.get<Cause[]>(API_CONFIG.ENDPOINTS.CAUSES);
  }

  static async getById(id: string): Promise<Cause> {
    return apiClient.get<Cause>(`${API_CONFIG.ENDPOINTS.CAUSES}/${id}`);
  }

  static async create(data: CreateCauseData): Promise<Cause> {
    return apiClient.post<Cause>(API_CONFIG.ENDPOINTS.CAUSES, data);
  }

  static async update(id: string, data: UpdateCauseData): Promise<Cause> {
    return apiClient.patch<Cause>(`${API_CONFIG.ENDPOINTS.CAUSES}/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.CAUSES}/${id}`);
  }
}

// Events API
export class EventsApi {
  static async getAll(): Promise<Event[]> {
    return apiClient.get<Event[]>(API_CONFIG.ENDPOINTS.EVENTS);
  }

  static async getById(id: string): Promise<Event> {
    return apiClient.get<Event>(`${API_CONFIG.ENDPOINTS.EVENTS}/${id}`);
  }

  static async create(data: CreateEventData): Promise<Event> {
    return apiClient.post<Event>(API_CONFIG.ENDPOINTS.EVENTS, data);
  }

  static async update(id: string, data: UpdateEventData): Promise<Event> {
    return apiClient.patch<Event>(`${API_CONFIG.ENDPOINTS.EVENTS}/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.EVENTS}/${id}`);
  }
}

// Teams API
export class TeamsApi {
  static async getAll(): Promise<TeamMember[]> {
    return apiClient.get<TeamMember[]>(API_CONFIG.ENDPOINTS.TEAMS);
  }

  static async getById(id: string): Promise<TeamMember> {
    return apiClient.get<TeamMember>(`${API_CONFIG.ENDPOINTS.TEAMS}/${id}`);
  }

  static async create(data: CreateTeamMemberData): Promise<TeamMember> {
    return apiClient.post<TeamMember>(API_CONFIG.ENDPOINTS.TEAMS, data);
  }

  static async update(id: string, data: UpdateTeamMemberData): Promise<TeamMember> {
    return apiClient.patch<TeamMember>(`${API_CONFIG.ENDPOINTS.TEAMS}/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.TEAMS}/${id}`);
  }
}

// Gallery API
export class GalleryApi {
  static async getAll(): Promise<GalleryItem[]> {
    return apiClient.get<GalleryItem[]>(API_CONFIG.ENDPOINTS.GALLERY);
  }

  static async getById(id: string): Promise<GalleryItem> {
    return apiClient.get<GalleryItem>(`${API_CONFIG.ENDPOINTS.GALLERY}/${id}`);
  }

  static async create(data: CreateGalleryItemData | FormData): Promise<GalleryItem> {
    return apiClient.post<GalleryItem>(API_CONFIG.ENDPOINTS.GALLERY, data);
  }

  static async update(id: string, data: UpdateGalleryItemData | FormData): Promise<GalleryItem> {
    return apiClient.patch<GalleryItem>(`${API_CONFIG.ENDPOINTS.GALLERY}/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.GALLERY}/${id}`);
  }
}

// Donations API
export class DonationsApi {
  static async getAll(): Promise<Donation[]> {
    return apiClient.get<Donation[]>(API_CONFIG.ENDPOINTS.DONATIONS);
  }

  static async getById(id: string): Promise<Donation> {
    return apiClient.get<Donation>(`${API_CONFIG.ENDPOINTS.DONATIONS}/${id}`);
  }

  static async create(data: CreateDonationData): Promise<Donation> {
    return apiClient.post<Donation>(API_CONFIG.ENDPOINTS.DONATIONS, data);
  }

  static async update(id: string, data: UpdateDonationData): Promise<Donation> {
    return apiClient.patch<Donation>(`${API_CONFIG.ENDPOINTS.DONATIONS}/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.DONATIONS}/${id}`);
  }
}

// Health Check API
export class HealthApi {
  static async check(): Promise<{ status: string; timestamp: string }> {
    return apiClient.get<{ status: string; timestamp: string }>(API_CONFIG.ENDPOINTS.HEALTH);
  }
}