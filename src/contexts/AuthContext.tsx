import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { usersService, invitationsService } from '../services/firestore';
import { User } from '../types';
import { ROLES, getRolePermissions } from '../utils/permissions';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isRole: (role: string) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signUpWithInvitation: (email: string, password: string, userData: Partial<User>, invitationId: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Load user profile from Firestore
        try {
          const profile = await usersService.getById(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Check if there's a pending invitation
    const invitation = await invitationsService.getByEmail(email);
    const role = invitation ? invitation.role : ROLES.MEMBER;
    const permissions = getRolePermissions(role);
    
    // Create user profile in Firestore
    await usersService.createWithId(user.uid, {
      email: user.email!,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone,
      favoriteTeamId: userData.favoriteTeamId,
      role,
      permissions,
      status: 'active',
      assignedBy: invitation?.invitedBy
    });
    
    // Mark invitation as accepted if it exists
    if (invitation) {
      await invitationsService.updateStatus(invitation.id, 'accepted');
    }
  };

  const signUpWithInvitation = async (email: string, password: string, userData: Partial<User>, invitationId: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Get invitation details
    const invitation = await invitationsService.getByEmail(email);
    if (!invitation) {
      throw new Error('Invalid invitation');
    }
    
    const permissions = getRolePermissions(invitation.role);
    
    // Create user profile in Firestore
    await usersService.createWithId(user.uid, {
      email: user.email!,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone,
      favoriteTeamId: userData.favoriteTeamId,
      role: invitation.role,
      permissions,
      status: 'active',
      assignedBy: invitation.invitedBy
    });
    
    // Mark invitation as accepted
    await invitationsService.updateStatus(invitation.id, 'accepted');
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Permission checking functions
  const hasPermission = (permission: string): boolean => {
    if (!userProfile) return false;
    return userProfile.permissions?.includes(permission) || 
           userProfile.permissions?.includes('system:admin') || 
           false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!userProfile) return false;
    return permissions.some(permission => hasPermission(permission));
  };

  const isRole = (role: string): boolean => {
    return userProfile?.role === role;
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    hasPermission,
    hasAnyPermission,
    isRole,
    signIn,
    signUp,
    signUpWithInvitation,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};