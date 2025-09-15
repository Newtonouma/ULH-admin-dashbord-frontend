'use client';

import { useState } from 'react';
import { TeamMember } from '../../../types';
import { useTeamMembers } from '../hooks/useTeamMembers';
import TeamCard from './TeamCard';
import TeamEditor from './TeamEditor';
import styles from "./TeamsPanel.module.css";

export default function TeamsPanel() {
  const [selectedTeam, setSelectedTeam] = useState<TeamMember | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const { teamMembers, loading, error, createTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();

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
  
  const handleSave = async (teamData: Partial<TeamMember>): Promise<void> => {
    if (selectedTeam && selectedTeam.id) {
      await updateTeamMember(selectedTeam.id, teamData);
    } else {
      await createTeamMember(teamData);
    }
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