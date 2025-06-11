import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, AdminProfile, PasswordResetRequest } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (profile: Partial<AdminProfile>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  getProfile: () => AdminProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem('taskManager_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication - in production, this would be a real API call
    const storedProfile = localStorage.getItem('taskManager_adminProfile');
    let adminProfile: AdminProfile;

    if (storedProfile) {
      adminProfile = JSON.parse(storedProfile);
      // Check credentials against stored profile
      if (username === adminProfile.username && password === 'admin123') {
        const userData: User = {
          id: adminProfile.id,
          username: adminProfile.username,
          fullName: adminProfile.fullName,
          email: adminProfile.email,
          role: 'admin',
          lastLogin: new Date().toISOString(),
          createdAt: adminProfile.createdAt,
          updatedAt: new Date().toISOString(),
        };
        
        // Update last login
        adminProfile.lastLogin = new Date().toISOString();
        localStorage.setItem('taskManager_adminProfile', JSON.stringify(adminProfile));
        
        setUser(userData);
        localStorage.setItem('taskManager_user', JSON.stringify(userData));
        return true;
      }
    } else {
      // Default admin credentials
      if (username === 'admin' && password === 'admin123') {
        adminProfile = {
          id: '1',
          username: 'admin',
          fullName: 'مدير النظام',
          email: 'admin@taskmanager.com',
          role: 'admin',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const userData: User = {
          id: '1',
          username: 'admin',
          fullName: 'مدير النظام',
          email: 'admin@taskmanager.com',
          role: 'admin',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        localStorage.setItem('taskManager_adminProfile', JSON.stringify(adminProfile));
        setUser(userData);
        localStorage.setItem('taskManager_user', JSON.stringify(userData));
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskManager_user');
  };

  const getProfile = (): AdminProfile | null => {
    const storedProfile = localStorage.getItem('taskManager_adminProfile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  };

  const updateProfile = async (profileUpdates: Partial<AdminProfile>): Promise<boolean> => {
    try {
      const currentProfile = getProfile();
      if (!currentProfile) return false;

      const updatedProfile: AdminProfile = {
        ...currentProfile,
        ...profileUpdates,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('taskManager_adminProfile', JSON.stringify(updatedProfile));

      // Update current user session
      if (user) {
        const updatedUser: User = {
          ...user,
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          username: updatedProfile.username,
          updatedAt: updatedProfile.updatedAt,
        };
        setUser(updatedUser);
        localStorage.setItem('taskManager_user', JSON.stringify(updatedUser));
      }

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // In a real app, you would verify the current password against the stored hash
      // For this demo, we'll assume the current password is correct if it's 'admin123'
      if (currentPassword !== 'admin123') {
        return false;
      }

      // In a real app, you would hash the new password and store it
      // For this demo, we'll just update the timestamp
      const currentProfile = getProfile();
      if (!currentProfile) return false;

      const updatedProfile: AdminProfile = {
        ...currentProfile,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('taskManager_adminProfile', JSON.stringify(updatedProfile));
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      const currentProfile = getProfile();
      if (!currentProfile || currentProfile.email !== email) {
        return false;
      }

      // Generate a reset token
      const resetRequest: PasswordResetRequest = {
        email,
        token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
        used: false,
      };

      // Store the reset request
      localStorage.setItem('taskManager_passwordReset', JSON.stringify(resetRequest));

      // In a real app, you would send an email with the reset link
      console.log('Password reset token:', resetRequest.token);
      
      return true;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      const storedReset = localStorage.getItem('taskManager_passwordReset');
      if (!storedReset) return false;

      const resetRequest: PasswordResetRequest = JSON.parse(storedReset);
      
      // Verify token and expiration
      if (resetRequest.token !== token || resetRequest.used || new Date() > new Date(resetRequest.expiresAt)) {
        return false;
      }

      // Mark token as used
      resetRequest.used = true;
      localStorage.setItem('taskManager_passwordReset', JSON.stringify(resetRequest));

      // Update profile
      const currentProfile = getProfile();
      if (!currentProfile) return false;

      const updatedProfile: AdminProfile = {
        ...currentProfile,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('taskManager_adminProfile', JSON.stringify(updatedProfile));
      
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      updateProfile, 
      changePassword, 
      requestPasswordReset, 
      resetPassword, 
      getProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
