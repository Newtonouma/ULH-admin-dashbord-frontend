import { useState, useEffect } from 'react';
import { TeamsApi } from '../../../services/api';
import { TeamMember, CreateTeamMemberData, UpdateTeamMemberData } from '../../../types';

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TeamsApi.getAll();
      setTeamMembers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch team members';
      setError(errorMessage);
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTeamMember = async (memberData: Partial<TeamMember>): Promise<boolean> => {
    try {
      setError(null);
      const createData: CreateTeamMemberData = {
        name: memberData.name || '',
        position: memberData.position || '',
        bio: memberData.bio || '',
        imageUrl: memberData.imageUrl || '',
        socialMedia: memberData.socialMedia,
        contact: memberData.contact,
      };
      
      const newMember = await TeamsApi.create(createData);
      setTeamMembers(prev => [...prev, newMember]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create team member';
      setError(errorMessage);
      console.error('Error creating team member:', err);
      return false;
    }
  };

  const updateTeamMember = async (id: string, memberData: Partial<TeamMember>): Promise<boolean> => {
    try {
      setError(null);
      const updateData: UpdateTeamMemberData = {
        name: memberData.name,
        position: memberData.position,
        bio: memberData.bio,
        imageUrl: memberData.imageUrl,
        socialMedia: memberData.socialMedia,
        contact: memberData.contact,
      };
      
      const updatedMember = await TeamsApi.update(id, updateData);
      setTeamMembers(prev => prev.map(member => 
        member.id === id ? updatedMember : member
      ));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update team member';
      setError(errorMessage);
      console.error('Error updating team member:', err);
      return false;
    }
  };

  const deleteTeamMember = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await TeamsApi.delete(id);
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
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refetch: fetchTeamMembers,
  };
}