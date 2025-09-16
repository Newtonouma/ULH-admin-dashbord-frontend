import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { TeamMember } from '../../../types';

// Backend team structure
interface BackendTeam {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  contact?: string;
  email?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  linkedin?: string;
  createdAt: string;
  updatedAt: string;
}

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const rawData = await apiClient.get<BackendTeam[]>('/teams');
      
      // Transform backend data to frontend TeamMember structure
      const transformedData: TeamMember[] = rawData.map(team => ({
        id: team.id,
        name: team.name,
        position: '', // Backend doesn't have position, set default
        bio: team.description || '', // Map description to bio
        imageUrls: team.imageUrls || [],
        contact: {
          email: team.email,
          phone: team.contact
        },
        socialMedia: {
          linkedin: team.linkedin,
          twitter: team.twitter,
          facebook: team.facebook,
          instagram: team.tiktok // Map tiktok to instagram
        },
        createdAt: team.createdAt,
        updatedAt: team.updatedAt
      }));
      
      setTeamMembers(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch team members';
      setError(errorMessage);
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveTeamMember = async (
    memberData: Partial<TeamMember>,
    files: File[] = [],
    existingImages: string[] = [],
    imagesToDelete: string[] = [],
    memberId?: string
  ): Promise<boolean> => {
    try {
      setError(null);
      
      // Create FormData
      const formData = new FormData();
      
      // Add text fields
      if (memberData.name) formData.append('name', memberData.name);
      if (memberData.bio) formData.append('bio', memberData.bio);
      if (memberData.contact?.phone) formData.append('contact', memberData.contact.phone);
      if (memberData.contact?.email) formData.append('email', memberData.contact.email);
      if (memberData.socialMedia?.facebook) formData.append('facebook', memberData.socialMedia.facebook);
      if (memberData.socialMedia?.instagram) formData.append('tiktok', memberData.socialMedia.instagram);
      if (memberData.socialMedia?.twitter) formData.append('twitter', memberData.socialMedia.twitter);
      if (memberData.socialMedia?.linkedin) formData.append('linkedin', memberData.socialMedia.linkedin);
      
      // Add file attachments
      files.forEach(file => {
        formData.append('images', file);
      });
      
      // Add existing images and deletion info
      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));

      let savedMember: BackendTeam; // Backend response
      
      if (memberId) {
        // Update existing team member
        savedMember = await apiClient.patch<BackendTeam>(`/teams/${memberId}`, formData);
        
        // Transform backend response to frontend structure
        const transformedMember: TeamMember = {
          id: savedMember.id,
          name: savedMember.name,
          position: '', // Backend doesn't have position
          bio: savedMember.description || '',
          imageUrls: savedMember.imageUrls || [],
          contact: {
            email: savedMember.email,
            phone: savedMember.contact
          },
          socialMedia: {
            linkedin: savedMember.linkedin,
            twitter: savedMember.twitter,
            facebook: savedMember.facebook,
            instagram: savedMember.tiktok
          },
          createdAt: savedMember.createdAt,
          updatedAt: savedMember.updatedAt
        };
        
        setTeamMembers(prev => prev.map(member => 
          member.id === memberId ? transformedMember : member
        ));
      } else {
        // Create new team member
        savedMember = await apiClient.post<BackendTeam>('/teams', formData);
        
        // Transform backend response to frontend structure
        const transformedMember: TeamMember = {
          id: savedMember.id,
          name: savedMember.name,
          position: '', // Backend doesn't have position
          bio: savedMember.description || '',
          imageUrls: savedMember.imageUrls || [],
          contact: {
            email: savedMember.email,
            phone: savedMember.contact
          },
          socialMedia: {
            linkedin: savedMember.linkedin,
            twitter: savedMember.twitter,
            facebook: savedMember.facebook,
            instagram: savedMember.tiktok
          },
          createdAt: savedMember.createdAt,
          updatedAt: savedMember.updatedAt
        };
        
        setTeamMembers(prev => [...prev, transformedMember]);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save team member';
      setError(errorMessage);
      console.error('Error saving team member:', err);
      return false;
    }
  };

  const deleteTeamMember = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await apiClient.delete(`/teams/${id}`);
      setTeamMembers(prev => prev.filter(member => member.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete team member';
      setError(errorMessage);
      console.error('Error deleting team member:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    error,
    saveTeamMember,
    deleteTeamMember,
    refetch: fetchTeamMembers,
  };
}