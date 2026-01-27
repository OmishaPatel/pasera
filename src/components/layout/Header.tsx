'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Menu, X, Search } from 'lucide-react';

/**
 * Header Component - App Navigation
 *
 * Primary navigation header with authentication states and responsive behavior.
 *
 * Features:
 * - Desktop: Horizontal nav with user menu or login/signup buttons
 * - Mobile: Hamburger menu with slide-out drawer
 * - Optional search bar
 * - Sticky or fixed positioning
 * - Transparent or solid background variants
 *
 * @example
 * const navItems = [
 *   { label: 'Browse Events', href: '/events' },
 *   { label: 'Create Event', href: '/events/create' },
 *   { label: 'My Events', href: '/my-events' },
 * ];
 *
 * const currentUser = {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   initials: 'JD',
 * };
 *
 * <Header
 *   navItems={navItems}
 *   user={currentUser}
 *   onLogout={handleLogout}
 *   showSearch
 *   position="sticky"
 * />
 */

// Single navigation item
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// User information for authenticated state
export interface User {
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
}

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Navigation items for main menu */
  navItems: NavItem[];

  /** Current authenticated user (null if not logged in) */
  user?: User | null;

  /** Login handler (unauthenticated state) */
  onLogin?: () => void;

  /** Signup handler (unauthenticated state) */
  onSignup?: () => void;

  /** Logout handler (authenticated state) */
  onLogout?: () => void;

  /** Profile click handler */
  onProfileClick?: () => void;

  /** Search handler (optional) */
  onSearch?: (query: string) => void;

  /** Custom logo/brand component */
  logo?: React.ReactNode;

  /**
   * Header variant
   * - solid: White background with border and shadow (default)
   * - transparent: No background (for hero pages)
   */
  variant?: 'solid' | 'transparent';

  /**
   * Positioning style
   * - static: Normal flow
   * - sticky: Sticks to top on scroll (default)
   * - fixed: Fixed to top of viewport
   */
  position?: 'static' | 'sticky' | 'fixed';

  /** Show search bar (optional) */
  showSearch?: boolean;
}

export function Header({
  navItems,
  user = null,
  onLogin,
  onSignup,
  onLogout,
  onProfileClick,
  onSearch,
  logo,
  variant = 'solid',
  position = 'sticky',
  showSearch = false,
  className,
  ...props
}: HeaderProps) {

  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Close mobile menu when navigating
   * Called when user clicks a navigation link
   */
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  /**
   * Handle search form submission
   * Prevents default form behavior and calls onSearch callback
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  // Variant styles
  const variantStyles = {
    solid: 'bg-white border-b border-[var(--color-gray-200)] shadow-[var(--shadow-sm)]',
    transparent: 'bg-transparent',
  };

  // Position styles
  const positionStyles = {
    static: 'static',
    sticky: 'sticky top-0 z-40',
    fixed: 'fixed top-0 left-0 right-0 z-40',
  };

  // Default OutdoorPath logo
  const defaultLogo = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-[var(--color-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
        <span className="text-white font-bold text-lg">O</span>
      </div>
      <span className="text-xl font-bold text-[var(--color-gray-900)]">
        OutdoorPath
      </span>
    </div>
  );

  return (
    <header
      className={cn(
        'w-full transition-all duration-200',
        variantStyles[variant],
        positionStyles[position],
        className,
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex-shrink-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2 rounded-[var(--radius-sm)]"
          >
            {logo || defaultLogo}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-[var(--color-gray-700)] hover:text-[var(--color-primary)]',
                  'font-medium transition-colors duration-200',
                  'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                  'rounded-[var(--radius-sm)] px-2 py-1',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar (optional, desktop only) */}
          {showSearch && (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]"
                  size={20}
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-4 py-2',
                    'border border-[var(--color-gray-300)] rounded-[var(--radius-md)]',
                    'text-[var(--color-gray-900)] placeholder:text-[var(--color-gray-400)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
                    'transition-all duration-200',
                  )}
                  aria-label="Search events"
                />
              </div>
            </form>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              // Authenticated state: User menu
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={cn(
                    'flex items-center gap-2 p-1 rounded-[var(--radius-md)]',
                    'hover:bg-[var(--color-gray-100)] transition-colors duration-200',
                    'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                  )}
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <Avatar
                    alt={user.name}
                    src={user.avatar}
                    initials={user.initials}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-[var(--color-gray-700)]">
                    {user.name}
                  </span>
                </button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div
                    className={cn(
                      'absolute right-0 top-full mt-2 w-56',
                      'bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]',
                      'border border-[var(--color-gray-200)]',
                      'py-2',
                    )}
                  >
                    {/* User info section */}
                    <div className="px-4 py-2 border-b border-[var(--color-gray-200)]">
                      <p className="text-sm font-medium text-[var(--color-gray-900)]">
                        {user.name}
                      </p>
                      <p className="text-xs text-[var(--color-gray-500)] mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onProfileClick?.();
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm text-[var(--color-gray-700)]',
                        'hover:bg-[var(--color-gray-100)] transition-colors duration-150',
                      )}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout?.();
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm text-[var(--color-danger)]',
                        'hover:bg-[var(--color-gray-100)] transition-colors duration-150',
                      )}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Unauthenticated state: Login/Signup buttons
              <>
                <Button variant="ghost" size="sm" onClick={onLogin}>
                  Log In
                </Button>
                <Button variant="primary" size="sm" onClick={onSignup}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'md:hidden p-2 rounded-[var(--radius-md)]',
              'text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)]',
              'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
              'transition-colors duration-200',
            )}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--color-gray-200)] py-4">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-2 mb-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3',
                    'text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)]',
                    'font-medium rounded-[var(--radius-md)] transition-colors duration-200',
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Search (if enabled) */}
            {showSearch && (
              <form onSubmit={handleSearchSubmit} className="px-4 mb-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-4 py-2',
                      'border border-[var(--color-gray-300)] rounded-[var(--radius-md)]',
                      'text-[var(--color-gray-900)] placeholder:text-[var(--color-gray-400)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
                    )}
                    aria-label="Search events"
                  />
                </div>
              </form>
            )}

            {/* Mobile Actions */}
            <div className="px-4 pt-4 border-t border-[var(--color-gray-200)]">
              {user ? (
                // Authenticated state
                <div className="space-y-3">
                  {/* User info */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-gray-200)]">
                    <Avatar
                      alt={user.name}
                      src={user.avatar}
                      initials={user.initials}
                      size="md"
                    />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-gray-900)]">
                        {user.name}
                      </p>
                      <p className="text-xs text-[var(--color-gray-500)]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onProfileClick?.();
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout?.();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                // Unauthenticated state
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogin?.();
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onSignup?.();
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Display name for React DevTools
Header.displayName = 'Header';
