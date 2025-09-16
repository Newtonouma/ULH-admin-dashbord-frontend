'use client';

import { useState } from 'react';
import { TeamMember } from '../../../types';
import { useTeamMembers } from '../hooks/useTeamMembers';
import TeamCard from './TeamCard';
import TeamEditor from './TeamEditor';
import styles from "./TeamsPanel.module.css";

interface TeamFormData {
  name: string;
  bio: string;
  contact: string;
  email: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  tiktok: string;
  formData?: FormData;
  existingImages?: string[];
}

export default function TeamsPanel() {
  const [selectedTeam, setSelectedTeam] = useState<TeamMember | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const { teamMembers, loading, error, saveTeamMember, deleteTeamMember } = useTeamMembers();

  const handleCreate = () => {
    setSelectedTeam(undefined);
    setIsEditorOpen(true);
  };

  const handleEdit = (team: TeamMember) => {
    setSelectedTeam(team);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      await deleteTeamMember(id);
    }
  };
  
  const handleSave = async (data: TeamFormData): Promise<boolean> => {
    let success: boolean;
    
    // Extract data and files from the TeamFormData
    const teamData = {
      name: data.name,
      bio: data.bio,
      contact: {
        phone: data.contact,
        email: data.email
      },
      socialMedia: {
        facebook: data.facebook,
        linkedin: data.linkedin,
        twitter: data.twitter,
        instagram: data.tiktok
      },
      imageUrls: data.existingImages || []
    };
    
    // Extract files from FormData
    const files: File[] = [];
    if (data.formData) {
      const formDataFiles = data.formData.getAll('images') as File[];
      files.push(...formDataFiles);
    }
    const existingImages: string[] = data.existingImages || [];

    if (selectedTeam && selectedTeam.id) {
      success = await saveTeamMember(teamData, files, existingImages, [], selectedTeam.id);
    } else {
      success = await saveTeamMember(teamData, files, existingImages);
    }
    
    if (success) {
      setIsEditorOpen(false);
      setSelectedTeam(undefined);
    }
    
    return success;
  };

  const handleClose = () => {
    setIsEditorOpen(false);
    setSelectedTeam(undefined);
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            ⚠️ {error}
          </p>
        </div>
      )}

      <div className={styles.sectionHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Team Members</h1>
          <p className={styles.subtitle}>Meet the amazing people behind our mission</p>
        </div>
        <button 
          className={styles.createButton}
          onClick={handleCreate}
          disabled={loading}
        >
          ✨ Add Team Member
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No Team Members Yet</h3>
          <p>Build your team by adding the amazing people who make your mission possible. Every great cause starts with great people.</p>
          <button 
            className={styles.emptyActionButton}
            onClick={handleCreate}
          >
            Add Your First Team Member
          </button>
        </div>
      ) : (
        <div className={`${styles.cardGrid} ${loading ? styles.loading : ''}`}>
          {teamMembers.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isEditorOpen && (
        <TeamEditor
          team={selectedTeam}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}