'use client';

import { Container } from '@/components/layout/Container';
import { EventCard } from '@/components/events/EventCard';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { mockEvents } from '@/lib/mock';
import { CalendarDays, MapPin, Users, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // TODO: Phase 5 - Replace with Supabase query
  // Filter events where user is attending or organizing
  const myEvents = mockEvents.filter(
    event => event.organizer_id === user?.id ||
    event.id === 'event-1' || // Mock: user is attending event-1
    event.id === 'event-2'    // Mock: user is attending event-2
  ).slice(0, 6);

  const organizingEvents = myEvents.filter(event => event.organizer_id === user?.id);
  const attendingEvents = myEvents.filter(event => event.organizer_id !== user?.id);

  const upcomingEvents = myEvents.filter(
    event => new Date(event.event_date) > new Date()
  );

  const pastEvents = myEvents.filter(
    event => new Date(event.event_date) <= new Date()
  );

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)] py-8">
      <Container>
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-2">
            Welcome back, {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-[var(--color-gray-600)]">
            Manage your outdoor adventures and discover new events.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[var(--color-primary-light)] rounded-lg">
                  <CalendarDays className="text-[var(--color-primary)]" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-gray-900)]">
                    {upcomingEvents.length}
                  </p>
                  <p className="text-sm text-[var(--color-gray-600)]">Upcoming Events</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[var(--color-accent-light)] rounded-lg">
                  <Users className="text-[var(--color-accent)]" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-gray-900)]">
                    {organizingEvents.length}
                  </p>
                  <p className="text-sm text-[var(--color-gray-600)]">Organizing</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MapPin className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-gray-900)]">
                    {attendingEvents.length}
                  </p>
                  <p className="text-sm text-[var(--color-gray-600)]">Attending</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/events/create">
            <Button variant="primary" size="md">
              <Plus size={20} />
              Create Event
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary" size="md">
              Browse Events
            </Button>
          </Link>
        </div>

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 ? (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-gray-900)]">
                  Upcoming Events
                </h2>
                <p className="text-sm text-[var(--color-gray-600)] mt-1">
                  Your scheduled outdoor adventures
                </p>
              </div>
              <Link href="/my-events">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <div key={event.id} className="relative">
                  <EventCard event={event} />
                  {event.organizer_id === user?.id && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="success" size="sm">
                        Organizing
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : (
          <Card className="mb-12">
            <CardBody>
              <div className="text-center py-12">
                <CalendarDays
                  size={48}
                  className="mx-auto text-[var(--color-gray-400)] mb-4"
                />
                <h3 className="text-xl font-semibold text-[var(--color-gray-900)] mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-[var(--color-gray-600)] mb-6">
                  You don't have any upcoming events. Start exploring!
                </p>
                <Link href="/events">
                  <Button variant="primary" size="md">
                    Browse Events
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-gray-900)]">
                  Past Events
                </h2>
                <p className="text-sm text-[var(--color-gray-600)] mt-1">
                  Your adventure history
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => (
                <div key={event.id} className="opacity-75">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Organizer Section - Only show if user is organizing events */}
        {organizingEvents.length > 0 && (
          <section className="mt-12">
            <Card>
              <CardHeader
                title="Your Events"
                subtitle="Manage your organized events"
              />
              <CardBody>
                <div className="space-y-4">
                  {organizingEvents.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 bg-[var(--color-gray-50)] rounded-lg hover:bg-[var(--color-gray-100)] transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-[var(--color-gray-900)]">
                            {event.title}
                          </h3>
                          <Badge
                            variant={
                              event.status === 'active' ? 'success' :
                              event.status === 'full' ? 'warning' :
                              'danger'
                            }
                            size="sm"
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[var(--color-gray-600)]">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={16} />
                            {new Date(event.event_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={16} />
                            {event.current_capacity}/{event.max_capacity} attending
                          </span>
                        </div>
                      </div>
                      <Link href={`/events/${event.id}/manage`}>
                        <Button variant="secondary" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </section>
        )}
      </Container>
    </div>
  );
}
