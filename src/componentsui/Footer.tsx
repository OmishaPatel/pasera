'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

/**
 * Footer Component - Application Footer
 *
 * Multi-column footer with links, social media icons, and copyright information.
 * Supports two variants:
 * - 'full': Multi-column grid layout with link sections (4 cols → 2 cols → 1 col)
 * - 'simple': Single row layout with logo, copyright, and social icons
 *
 * @example
 * // Full footer with link sections
 * <Footer
 *   variant="full"
 *   sections={footerSections}
 *   socialLinks={socialLinks}
 * />
 *
 * @example
 * // Simple footer (minimal)
 * <Footer
 *   variant="simple"
 *   socialLinks={socialLinks}
 * />
 */

// Link in a footer section
export interface FooterLink {
  label: string;
  href: string;
}

// Section with title and multiple links
export interface FooterSection {
  title: string;
  links: FooterLink[];
}

// Social media link with platform type
export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'github';
  href: string;
  label?: string; // Accessibility label (defaults to "Follow us on {platform}")
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Footer variant
   * - full: Multi-column layout with link sections (default)
   * - simple: Single row with logo, copyright, social
   */
  variant?: 'full' | 'simple';

  /** Link sections for 'full' variant (e.g., Company, Resources, Legal) */
  sections?: FooterSection[];

  /** Social media links (Facebook, Twitter, Instagram, etc.) */
  socialLinks?: SocialLink[];

  /** Copyright text (defaults to current year + "OutdoorPath") */
  copyrightText?: string;

  /** Custom logo component (defaults to OutdoorPath logo) */
  logo?: React.ReactNode;
}

// Map platform names to lucide-react icon components
const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
};

export function Footer({
  variant = 'full',
  sections = [],
  socialLinks = [],
  copyrightText = `© ${new Date().getFullYear()} OutdoorPath. All rights reserved.`,
  logo,
  className,
  ...props
}: FooterProps) {

  // Default OutdoorPath logo
  const defaultLogo = (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-[var(--color-primary)] rounded-[var(--radius-sm)] flex items-center justify-center">
        <span className="text-white font-bold text-sm">O</span>
      </div>
      <span className="text-lg font-bold text-[var(--color-gray-900)]">
        OutdoorPath
      </span>
    </div>
  );

  // Simple variant: Single row layout
  if (variant === 'simple') {
    return (
      <footer
        className={cn(
          'w-full border-t border-[var(--color-gray-200)] bg-white',
          'py-6',
          className,
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              {logo || defaultLogo}
            </div>

            {/* Copyright */}
            <p className="text-sm text-[var(--color-gray-500)] text-center">
              {copyrightText}
            </p>

            {/* Social links (if provided) */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <Link
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label || `Follow us on ${social.platform}`}
                      className={cn(
                        'text-[var(--color-gray-500)] hover:text-[var(--color-primary)]',
                        'transition-colors duration-200',
                        'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                        'rounded-[var(--radius-sm)]',
                      )}
                    >
                      <Icon size={20} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  }

  // Full variant: Multi-column layout
  return (
    <footer
      className={cn(
        'w-full border-t border-[var(--color-gray-200)] bg-white',
        'pt-12 pb-6',
        className,
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Main footer content - Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand section (column 1) */}
          <div className="col-span-1">
            {/* Logo */}
            <div className="mb-4">
              {logo || defaultLogo}
            </div>

            {/* Description */}
            <p className="text-sm text-[var(--color-gray-600)] mb-4 leading-relaxed">
              Discover and join outdoor adventures. Connect with nature enthusiasts and explore the great outdoors together.
            </p>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <Link
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label || `Follow us on ${social.platform}`}
                      className={cn(
                        'text-[var(--color-gray-500)] hover:text-[var(--color-primary)]',
                        'transition-colors duration-200',
                        'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                        'rounded-[var(--radius-sm)]',
                      )}
                    >
                      <Icon size={20} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Link sections (columns 2-4) */}
          {sections.map((section) => (
            <div key={section.title}>
              {/* Section title */}
              <h3 className="text-sm font-semibold text-[var(--color-gray-900)] uppercase tracking-wider mb-4">
                {section.title}
              </h3>

              {/* Section links */}
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'text-sm text-[var(--color-gray-600)] hover:text-[var(--color-primary)]',
                        'transition-colors duration-200',
                        'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
                        'rounded-[var(--radius-sm)]',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar - Copyright */}
        <div className="pt-6 border-t border-[var(--color-gray-200)]">
          <p className="text-sm text-center text-[var(--color-gray-500)]">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}

// Display name for React DevTools
Footer.displayName = 'Footer';
