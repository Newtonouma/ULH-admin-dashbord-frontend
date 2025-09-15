'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../lib/api-client';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('AuthContext: Starting auth check...');
        console.log('AuthContext: isAuthenticated?', apiClient.isAuthenticated());
        
        if (apiClient.isAuthenticated()) {
          console.log('AuthContext: Token exists, validating...');
          
          // Validate token and get user data
          try {
            const user = await apiClient.getCurrentUser();
            console.log('AuthContext: User data fetched:', user);
            
            setState(prev => ({
              ...prev,
              user,
              isAuthenticated: true,
              isLoading: false,
            }));
          } catch (error) {
            // Token is invalid or expired
            console.log('AuthContext: Token validation failed:', error);
            apiClient.clearAuth();
            setState(prev => ({
              ...prev,
              isAuthenticated: false,
              isLoading: false,
              error: 'Session expired. Please log in again.',
            }));
          }
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        apiClient.clearAuth();
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication check failed',
        }));
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('AuthContext: Starting login...');
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiClient.login(credentials);
      console.log('AuthContext: Login successful, response:', response);
      
      setState(prev => ({
        ...prev,
        user: response.user || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
      console.log('AuthContext: State updated, user authenticated');
    } catch (error) {
      console.log('AuthContext: Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await apiClient.register(data);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await apiClient.logout();
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
      apiClient.clearAuth();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await apiClient.changePassword(currentPassword, newPassword);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password change failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await apiClient.forgotPassword(email);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await apiClient.resetPassword(token, newPassword);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}