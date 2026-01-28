'use client';
// Landing Page - Marketing hero page

import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { EventCard } from '@/components/events/EventCard';
import { Badge } from '@/components/ui/Badge';
import { mockEvents } from '@/lib/mock';
import { Mountain, Users, Calendar, Shield, Search } from 'lucide-react';

export default function LandingPage() {
  // Get 3 featured upcoming events
  const featuredEvents = mockEvents
    .filter(e => e.status === 'active')
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[var(--color-secondary)] text-white py-20 md:py-32">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Discover Your Next
              <br />
              Outdoor Adventure
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Join thousands of outdoor enthusiasts exploring hiking, camping, climbing,
              and biking events in your area. Create memories, make friends, and push your limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse Events
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </Container>

        {/* Decorative gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-gray-50)] to-transparent"></div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-[var(--color-gray-50)]">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-gray-900)] mb-4">
              Featured Events
            </h2>
            <p className="text-lg text-[var(--color-gray-600)] max-w-2xl mx-auto">
              Discover upcoming adventures curated by our community of outdoor enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                showOrganizer
                showCapacity
                showImage
                onClick={() => {}}
                onRSVP={() => {}}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/events">
              <Button variant="primary" size="lg">
                View All Events
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-gray-900)] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[var(--color-gray-600)] max-w-2xl mx-auto">
              Getting started with OutdoorPath is easy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-gray-900)] mb-3">
                1. Find Events
              </h3>
              <p className="text-[var(--color-gray-600)]">
                Browse outdoor events in your area. Filter by activity type, difficulty level,
                and date to find the perfect adventure.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-gray-900)] mb-3">
                2. RSVP & Connect
              </h3>
              <p className="text-[var(--color-gray-600)]">
                Reserve your spot with a simple RSVP. See who else is going and connect
                with fellow adventurers before the event.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-gray-900)] mb-3">
                3. Go Adventure
              </h3>
              <p className="text-[var(--color-gray-600)]">
                Show up and enjoy the outdoors! Make new friends, challenge yourself,
                and create unforgettable memories.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-[var(--color-gray-50)]">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-gray-900)] mb-4">
              Explore Activities
            </h2>
            <p className="text-lg text-[var(--color-gray-600)] max-w-2xl mx-auto">
              Find your next adventure by activity type
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Hiking', icon: '🥾' },
              { name: 'Camping', icon: '⛺' },
              { name: 'Biking', icon: '🚴' },
              { name: 'Climbing', icon: '🧗' },
              { name: 'Kayaking', icon: '🛶' },
              { name: 'More', icon: '🌲' },
            ].map(category => (
              <Link
                key={category.name}
                href={`/events?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="bg-white rounded-[var(--radius-lg)] p-6 text-center hover:shadow-[var(--shadow-lg)] transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-[var(--color-gray-900)] group-hover:text-[var(--color-primary)] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-gray-900)] mb-4">
              Why Choose OutdoorPath
            </h2>
            <p className="text-lg text-[var(--color-gray-600)] max-w-2xl mx-auto">
              The best platform for outdoor enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-[var(--color-success)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-gray-900)] mb-2">
                Active Community
              </h3>
              <p className="text-sm text-[var(--color-gray-600)]">
                Join thousands of outdoor enthusiasts
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[var(--color-info)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-[var(--color-info)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-gray-900)] mb-2">
                Verified Organizers
              </h3>
              <p className="text-sm text-[var(--color-gray-600)]">
                Events hosted by trusted community members
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[var(--color-warning)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-[var(--color-warning)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-gray-900)] mb-2">
                Easy Scheduling
              </h3>
              <p className="text-sm text-[var(--color-gray-600)]">
                Simple RSVP and calendar sync
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-gray-900)] mb-2">
                All Skill Levels
              </h3>
              <p className="text-sm text-[var(--color-gray-600)]">
                From beginners to experts
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join our community today and discover amazing outdoor events near you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/events">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
