'use client';

// Dashboard layout for authenticated pages
// Includes auth check, redirect to login if not authenticated
// Header + Footer + BottomNav

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { Home, Search, Plus, User, Calendar } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-gray-50)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--color-gray-600)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content until user is loaded
  if (!user) {
    return null;
  }

  // Navigation items for header
  const navItems = [
    { label: 'Browse Events', href: '/events', icon: <Search size={18} /> },
    { label: 'My Dashboard', href: '/dashboard', icon: <Home size={18} /> },
    { label: 'Create Event', href: '/events/create', icon: <Plus size={18} /> },
  ];

  // Bottom navigation for mobile
  const bottomNavItems = [
    { label: 'Home', href: '/', icon: <Home size={24} /> },
    { label: 'Browse', href: '/events', icon: <Search size={24} /> },
    { label: 'Create', href: '/events/create', icon: <Plus size={24} /> },
    { label: 'Dashboard', href: '/dashboard', icon: <Calendar size={24} /> },
    { label: 'Profile', href: '/profile', icon: <User size={24} /> },
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

  return (
    <>
      <Header
        navItems={navItems}
        user={{
          name: user.full_name || user.email,
          email: user.email,
          initials: (user.full_name || user.email)
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
        }}
        onLogout={logout}
        onProfileClick={() => router.push('/profile')}
        variant="solid"
        position="sticky"
      />
      <main className="min-h-screen bg-[var(--color-gray-50)] pb-16 md:pb-0">
        {children}
      </main>
      <Footer variant="full" sections={footerSections} socialLinks={socialLinks} />
      <BottomNav items={bottomNavItems} />
    </>
  );
}
