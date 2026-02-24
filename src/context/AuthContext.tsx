'use client';

// Supabase authentication context for Phase 5
// Supports OAuth (Google, Facebook, Apple)

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types/user';

interface AuthContextType {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  isOrganizer: boolean;
  signInWithOAuth: (provider: 'google' | 'facebook' | 'apple', redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Profile doesn't exist - wait a bit and retry (trigger might be creating it)
        if (error.code === 'PGRST116') {
          console.log('Profile not found, waiting for trigger to create it...');

          // Wait a moment for the database trigger to create the profile
          await new Promise(resolve => setTimeout(resolve, 500));

          // Retry fetching the profile
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (retryError) {
            // If still not found, try to create it manually
            if (retryError.code === 'PGRST116') {
              console.log('Profile still not found after retry, creating manually...');
              const { data: { user: authUser } } = await supabase.auth.getUser();

              if (authUser) {
                const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    id: authUser.id,
                    email: authUser.email,
                    full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                    avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
                  })
                  .select()
                  .single();

                if (createError) {
                  console.error('Error creating profile:', {
                    message: createError.message,
                    code: createError.code,
                    details: createError.details,
                    hint: createError.hint,
                  });
                  setLoading(false);
                  return;
                }

                if (newProfile) {
                  setUser(newProfile);
                }
              }
            } else {
              console.error('Error fetching profile on retry:', {
                message: retryError.message,
                code: retryError.code,
                details: retryError.details,
              });
            }
            setLoading(false);
            return;
          }

          if (retryData) {
            setUser(retryData);
          }
        } else {
          console.error('Error fetching profile:', {
            message: error.message,
            code: error.code,
            details: error.details,
          });
        }
        setLoading(false);
        return;
      }

      if (data) {
        setUser(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setLoading(false);
    }
  };

  const signInWithOAuth = async (
    provider: 'google' | 'facebook' | 'apple',
    redirectTo?: string
  ) => {
    // Use explicit URL for better Firefox compatibility
    const baseUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;
    const callbackUrl = redirectTo
      ? `${baseUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`
      : `${baseUrl}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error('OAuth sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) {
      console.error('Update profile error:', error);
      throw error;
    }

    setUser({ ...user, ...data });
  };

  const isOrganizer = user?.role === 'organizer';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isOrganizer,
        signInWithOAuth,
        signOut,
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
