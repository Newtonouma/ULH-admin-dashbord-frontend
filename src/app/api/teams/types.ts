// Import types from the main types file to maintain consistency
export type { TeamMember, CreateTeamMemberData, UpdateTeamMemberData } from '../../../types/index';
import type { TeamMember, UpdateTeamMemberData } from '../../../types/index';

// Type alias for creating teams (excludes auto-generated fields)
export type CreateTeamDto = Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;

// Type alias for updating teams (excludes auto-generated fields and allows partial updates)
export type UpdateTeamDto = Partial<Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>>;

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateTeamData(data: UpdateTeamMemberData): string | null {
  if (data.imageUrls && data.imageUrls.length > 0) {
    for (const url of data.imageUrls) {
      if (!isValidUrl(url)) {
        return 'All image URLs must be valid URL addresses';
      }
    }
  }
  if (data.contact?.email && !isValidEmail(data.contact.email)) {
    return 'Email must be a valid email address';
  }
  if (data.socialMedia?.facebook && !isValidUrl(data.socialMedia.facebook)) {
    return 'Facebook URL must be a valid URL address';
  }
  if (data.socialMedia?.linkedin && !isValidUrl(data.socialMedia.linkedin)) {
    return 'LinkedIn URL must be a valid URL address';
  }
  if (data.socialMedia?.twitter && !isValidUrl(data.socialMedia.twitter)) {
    return 'Twitter URL must be a valid URL address';
  }
  if (data.socialMedia?.instagram && !isValidUrl(data.socialMedia.instagram)) {
    return 'Instagram URL must be a valid URL address';
  }
  return null;
}