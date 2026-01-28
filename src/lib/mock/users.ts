// Mock user data for Phase 4 development
// TODO: Phase 5 - Replace with Supabase queries

import { Profile } from '@/types/user';

export const mockUsers: Profile[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    avatar_url: undefined,
    role: 'organizer',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    full_name: 'Jane Smith',
    avatar_url: undefined,
    role: 'member',
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'mike.johnson@example.com',
    full_name: 'Mike Johnson',
    avatar_url: undefined,
    role: 'organizer',
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'user-4',
    email: 'sarah.williams@example.com',
    full_name: 'Sarah Williams',
    avatar_url: undefined,
    role: 'member',
    created_at: '2026-01-12T00:00:00Z',
    updated_at: '2026-01-12T00:00:00Z',
  },
  {
    id: 'user-5',
    email: 'tom.brown@example.com',
    full_name: 'Tom Brown',
    avatar_url: undefined,
    role: 'member',
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'user-6',
    email: 'alice.cooper@example.com',
    full_name: 'Alice Cooper',
    avatar_url: undefined,
    role: 'member',
    created_at: '2026-01-18T00:00:00Z',
    updated_at: '2026-01-18T00:00:00Z',
  },
  {
    id: 'user-7',
    email: 'bob.wilson@example.com',
    full_name: 'Bob Wilson',
    avatar_url: undefined,
    role: 'member',
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z',
  },
  {
    id: 'user-8',
    email: 'emma.davis@example.com',
    full_name: 'Emma Davis',
    avatar_url: undefined,
    role: 'organizer',
    created_at: '2026-01-22T00:00:00Z',
    updated_at: '2026-01-22T00:00:00Z',
  },
];

// Current authenticated user for mock auth
export const mockCurrentUser: Profile = mockUsers[0];

// Utility functions
export const getUserById = (id: string): Profile | undefined =>
  mockUsers.find(u => u.id === id);

export const getUserByEmail = (email: string): Profile | undefined =>
  mockUsers.find(u => u.email === email);

// Simulate async user fetching (for Phase 5 transition)
export const fetchUserById = async (id: string): Promise<Profile | null> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return getUserById(id) || null;
};
