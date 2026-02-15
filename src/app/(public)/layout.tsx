'use client';

// Public layout for non-authenticated pages
// Includes Header + Footer + BottomNav

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { Home, Search, Plus, User, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  // Navigation items for header
  const navItems = [
    { label: 'Browse Events', href: '/events', icon: <Search size={18} /> },
    { label: 'About', href: '/about', icon: <Home size={18} /> },
  ];

  // Bottom navigation for mobile - changes based on auth state
  const bottomNavItems = user ? [
    { label: 'Home', href: '/', icon: <Home size={24} /> },
    { label: 'Browse', href: '/events', icon: <Search size={24} /> },
    { label: 'Create', href: '/events/create', icon: <Plus size={24} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <Calendar size={24} /> },
    { label: 'Profile', href: '/profile', icon: <User size={24} /> },
  ] : [
    { label: 'Home', href: '/', icon: <Home size={24} /> },
    { label: 'Browse', href: '/events', icon: <Search size={24} /> },
    { label: 'Sign In', href: '/login', icon: <User size={24} /> },
  ];

  // Footer sections
  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Safety Guidelines', href: '/safety' },
        { label: 'Community Rules', href: '/rules' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  // Social links
  const socialLinks = [
    { platform: 'facebook' as const, href: 'https://facebook.com/outdoorpath' },
    { platform: 'twitter' as const, href: 'https://twitter.com/outdoorpath' },
    { platform: 'instagram' as const, href: 'https://instagram.com/outdoorpath' },
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Header
        navItems={navItems}
        user={loading ? null : user ? {
          name: user.full_name || user.email,
          email: user.email,
          avatar: user.avatar_url,
          initials: (user.full_name || user.email)
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
        } : null}
        onLogin={() => router.push('/login')}
        onSignup={() => router.push('/signup')}
        onLogout={handleLogout}
        onProfileClick={() => router.push('/profile')}
        variant="solid"
        position="sticky"
      />
      <main className="min-h-screen bg-[var(--color-gray-50)]">{children}</main>
      <Footer variant="full" sections={footerSections} socialLinks={socialLinks} />
      <BottomNav items={bottomNavItems} />
    </>
  );
}
