'use client';

// Mock authentication context for Phase 4 development
// TODO: Phase 5 - Replace with Supabase auth

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Profile } from '@/types/user';
import { mockCurrentUser, getUserByEmail } from '@/lib/mock';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isOrganizer: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: Profile | null;
}) {
  const [user, setUser] = useState<Profile | null>(initialUser);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on mount (simulate session persistence)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('mock_auth_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user:', e);
          localStorage.removeItem('mock_auth_user');
        }
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation: Check if user exists in mock data
    const foundUser = getUserByEmail(email);

    if (!foundUser) {
      setLoading(false);
      throw new Error('Invalid email or password');
    }

    // Mock password check (in Phase 4, accept any password)
    if (!password || password.length < 1) {
      setLoading(false);
      throw new Error('Password is required');
    }

    setUser(foundUser);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_auth_user', JSON.stringify(foundUser));
    }

    setLoading(false);
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Basic validation
    if (!email || !email.includes('@')) {
      setLoading(false);
      throw new Error('Invalid email address');
    }

    if (!password || password.length < 6) {
      setLoading(false);
      throw new Error('Password must be at least 6 characters');
    }

    if (!fullName || fullName.trim().length < 2) {
      setLoading(false);
      throw new Error('Full name is required');
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      setLoading(false);
      throw new Error('An account with this email already exists');
    }

    // Create new mock user
    const newUser: Profile = {
      id: `user-${Date.now()}`,
      email,
      full_name: fullName,
      avatar_url: undefined,
      role: 'member',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(newUser);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_auth_user', JSON.stringify(newUser));
    }

    setLoading(false);
  };

  const logout = () => {
    setUser(null);

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_auth_user');
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!user) {
      setLoading(false);
      throw new Error('No user logged in');
    }

    const updatedUser = {
      ...user,
      ...data,
      updated_at: new Date().toISOString(),
    };

    setUser(updatedUser);

    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_auth_user', JSON.stringify(updatedUser));
    }

    setLoading(false);
  };

  const isOrganizer = user?.role === 'organizer';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isOrganizer,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
