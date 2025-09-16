'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import './dashboard.css';
import { Cause } from '../../types';
import Sidebar from './components/Sidebar';
import FullScreenEditor from './FullScreenEditor';
import { useCauses } from './hooks/useCauses';
import CausesSection from './components/CausesSection';
import EventsSection from './components/EventsSection';
import GallerySection from './components/GallerySection';
import TeamsSection from './components/TeamsSection';
import DonationsSection from './components/DonationsSection';
import ProfileSection from './components/ProfileSection';

// Loading Components
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
  </div>
);

const AuthLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Checking authentication...</p>
    </div>
  </div>
);

// Auth Error Component
const AuthError = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center max-w-md mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-600 text-lg font-semibold mb-2">Authentication Error</div>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  </div>
);

// Error Components
const ErrorMessage = ({ error }: { error: string }) => (
  <div className="error-message">{error}</div>
);

// Dashboard Content Renderer
const DashboardContent = ({
  activeComponent,
  causes,
  loading,
  error,
  onEditCause,
  onDeleteCause,
  onCreateNewCause
}: {
  activeComponent: string;
  causes: Cause[];
  loading: boolean;
  error: string | null;
  onEditCause: (cause: Cause) => void;
  onDeleteCause: (id: string) => Promise<boolean>;
  onCreateNewCause: () => void;
}) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  switch (activeComponent) {
    case 'causes':
      return (
        <CausesSection
          causes={causes}
          onEdit={onEditCause}
          onDelete={onDeleteCause}
          onCreateNew={onCreateNewCause}
        />
      );
    case 'events':
      return <EventsSection />;
    case 'gallery':
      return <GallerySection />;
    case 'teams':
      return <TeamsSection />;
    case 'donations':
      return <DonationsSection />;
    case 'profile':
      return <ProfileSection />;
    default:
      return <div>Select a section from the sidebar</div>;
  }
};

// Main Dashboard Component
export default function Dashboard() {
  // Authentication state
  const { user, isAuthenticated, isLoading: isAuthLoading, error: authError } = useAuth();
  const router = useRouter();

  // Dashboard state
  const [activeComponent, setActiveComponent] = useState('causes');
  const [editingCause, setEditingCause] = useState<Cause | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const {
    causes,
    loading,
    error,
    createCause,
    deleteCause,
    updateCause
  } = useCauses();

  // Auth effects
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthLoading, isAuthenticated, router]);
  // Cause handlers
  const handleCreateCause = async (formData: FormData) => {
    const success = await createCause(formData);
    if (success) setIsCreating(false);
  };

  const handleEditCause = async (formData: FormData) => {
    if (!editingCause?.id) return;
    const success = await updateCause(editingCause.id, formData);
    if (success) setEditingCause(null);
  };

  // Render auth states
  if (isAuthLoading) return <AuthLoadingSpinner />;
  if (authError) return <AuthError error={authError} />;
  if (!isAuthenticated) return <AuthError error="Please log in to access the dashboard" />;
  if (!user) return null;

  return (
    <>
      {/* Main Content Dashboard */}
      <div className="dashboard-container">
        <Sidebar 
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />

        <div className="main-content">
          <DashboardContent
            activeComponent={activeComponent}
            causes={causes}
            loading={loading}
            error={error}
            onEditCause={setEditingCause}
            onDeleteCause={deleteCause}
            onCreateNewCause={() => setIsCreating(true)}
          />
        </div>

        {editingCause && (
          <FullScreenEditor
            cause={editingCause}
            onSave={handleEditCause}
            onClose={() => setEditingCause(null)}
          />
        )}        {isCreating && (
          <FullScreenEditor
            cause={{
              id: '',
              title: '',
              description: '',
              category: '',
              goal: 0,
              imageUrls: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }}
            onSave={handleCreateCause}
            onClose={() => setIsCreating(false)}
          />
        )}
      </div>
    </>
  );
}