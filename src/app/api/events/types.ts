// Import types from the main types file to maintain consistency
export type { Event, CreateEventData, UpdateEventData } from '../../../types/index';
import type { UpdateEventData } from '../../../types/index';

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString();
}

export function validateEventData(data: UpdateEventData): string | null {
  if (data.imageUrls && data.imageUrls.length > 0) {
    for (const url of data.imageUrls) {
      if (!isValidUrl(url)) {
        return 'All image URLs must be valid URL addresses';
      }
    }
  }
  
  // For date validation, accept both ISO strings and simple date strings
  if (data.date) {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      return 'Date must be a valid date string';
    }
  }
  
  // For endTime, accept time strings (HH:MM) or ISO strings
  if (data.endTime) {
    // Check if it's a time string (HH:MM format)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.endTime) && !isValidISODate(data.endTime)) {
      return 'End time must be in HH:MM format or a valid ISO date string';
    }
  }
  
  return null;
}