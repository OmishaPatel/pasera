'use client';

import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { Camera, Mail, User, MapPin, Calendar, Award } from 'lucide-react';
import { mockEvents } from '@/lib/mock';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    bio: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Phase 5 - Replace with Supabase update
    await updateProfile({
      full_name: formData.full_name,
      email: formData.email,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      email: user?.email || '',
      bio: '',
      location: '',
    });
    setIsEditing(false);
  };

  // TODO: Phase 5 - Replace with Supabase query
  const userStats = {
    eventsOrganized: mockEvents.filter(e => e.organizer_id === user?.id).length,
    eventsAttended: 12, // Mock data
    totalAttendees: 156, // Mock data
    memberSince: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    }) : 'January 2026',
  };

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)] py-8">
      <Container size="md">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar
                  src={user?.avatar_url}
                  alt={user?.full_name || 'User'}
                  initials={user?.full_name}
                  size="xl"
                />
                <button
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-[var(--color-gray-200)] hover:bg-[var(--color-gray-50)] transition-colors"
                  aria-label="Change profile picture"
                >
                  <Camera size={16} className="text-[var(--color-gray-600)]" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-[var(--color-gray-900)]">
                    {user?.full_name}
                  </h1>
                  <Badge
                    variant={user?.role === 'organizer' ? 'success' : 'default'}
                    size="sm"
                  >
                    {user?.role === 'organizer' ? 'Organizer' : 'Member'}
                  </Badge>
                </div>
                <p className="text-[var(--color-gray-600)] mb-4">
                  {user?.email}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-[var(--color-gray-600)]">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    Joined {userStats.memberSince}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)] mb-1">
                  {userStats.eventsOrganized}
                </p>
                <p className="text-sm text-[var(--color-gray-600)]">Events Organized</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--color-accent)] mb-1">
                  {userStats.eventsAttended}
                </p>
                <p className="text-sm text-[var(--color-gray-600)]">Events Attended</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 mb-1">
                  {userStats.totalAttendees}
                </p>
                <p className="text-sm text-[var(--color-gray-600)]">People Reached</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Profile Form */}
        {isEditing ? (
          <Card>
            <CardHeader
              title="Edit Profile"
              subtitle="Update your personal information"
            />
            <form onSubmit={handleSubmit}>
              <CardBody>
                <div className="space-y-6">
                  <FormField
                    label="Full Name"
                    required
                  >
                    <div className="relative">
                      <User
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]"
                      />
                      <Input
                        id="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="pl-10"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Email Address"
                    required
                  >
                    <div className="relative">
                      <Mail
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]"
                      />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Bio"
                    helperText="Tell others about yourself and your outdoor interests"
                  >
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-4 py-3 border border-[var(--color-gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                      rows={4}
                      placeholder="I love hiking, camping, and exploring nature..."
                    />
                  </FormField>

                  <FormField
                    label="Location"
                    helperText="Your city or region"
                  >
                    <div className="relative">
                      <MapPin
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]"
                      />
                      <Input
                        id="location"
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="pl-10"
                        placeholder="Los Angeles, CA"
                      />
                    </div>
                  </FormField>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex gap-3 justify-end w-full">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card>
            <CardHeader
              title="About"
              subtitle="Your profile information"
            />
            <CardBody>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-semibold text-[var(--color-gray-600)] mb-1">
                    Bio
                  </dt>
                  <dd className="text-[var(--color-gray-900)]">
                    {formData.bio || 'No bio added yet. Click "Edit Profile" to add one.'}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-semibold text-[var(--color-gray-600)] mb-1">
                    Location
                  </dt>
                  <dd className="text-[var(--color-gray-900)] flex items-center gap-2">
                    <MapPin size={16} />
                    {formData.location || 'Not specified'}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-semibold text-[var(--color-gray-600)] mb-1">
                    Member Since
                  </dt>
                  <dd className="text-[var(--color-gray-900)] flex items-center gap-2">
                    <Calendar size={16} />
                    {userStats.memberSince}
                  </dd>
                </div>
              </dl>
            </CardBody>
          </Card>
        )}

        {/* Account Settings */}
        <Card className="mt-6">
          <CardHeader
            title="Account Settings"
            subtitle="Manage your account preferences"
          />
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[var(--color-gray-200)]">
                <div>
                  <h3 className="font-semibold text-[var(--color-gray-900)]">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-[var(--color-gray-600)]">
                    Receive updates about your events
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[var(--color-gray-200)]">
                <div>
                  <h3 className="font-semibold text-[var(--color-gray-900)]">
                    Privacy Settings
                  </h3>
                  <p className="text-sm text-[var(--color-gray-600)]">
                    Control who can see your profile
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-semibold text-[var(--color-gray-900)]">
                    Change Password
                  </h3>
                  <p className="text-sm text-[var(--color-gray-600)]">
                    Update your account password
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  Update
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Achievements Section */}
        <Card className="mt-6">
          <CardHeader
            title="Achievements"
            subtitle="Your outdoor milestones"
          />
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userStats.eventsOrganized >= 1 && (
                <div className="text-center p-4 bg-[var(--color-gray-50)] rounded-lg">
                  <Award size={32} className="mx-auto text-[var(--color-primary)] mb-2" />
                  <p className="text-sm font-semibold text-[var(--color-gray-900)]">
                    Event Organizer
                  </p>
                  <p className="text-xs text-[var(--color-gray-600)] mt-1">
                    Created your first event
                  </p>
                </div>
              )}

              {userStats.eventsAttended >= 10 && (
                <div className="text-center p-4 bg-[var(--color-gray-50)] rounded-lg">
                  <Award size={32} className="mx-auto text-[var(--color-accent)] mb-2" />
                  <p className="text-sm font-semibold text-[var(--color-gray-900)]">
                    Adventure Seeker
                  </p>
                  <p className="text-xs text-[var(--color-gray-600)] mt-1">
                    Attended 10+ events
                  </p>
                </div>
              )}

              <div className="text-center p-4 bg-[var(--color-gray-50)] rounded-lg opacity-50">
                <Award size={32} className="mx-auto text-[var(--color-gray-400)] mb-2" />
                <p className="text-sm font-semibold text-[var(--color-gray-900)]">
                  Community Builder
                </p>
                <p className="text-xs text-[var(--color-gray-600)] mt-1">
                  Host 10 events
                </p>
              </div>

              <div className="text-center p-4 bg-[var(--color-gray-50)] rounded-lg opacity-50">
                <Award size={32} className="mx-auto text-[var(--color-gray-400)] mb-2" />
                <p className="text-sm font-semibold text-[var(--color-gray-900)]">
                  Trail Blazer
                </p>
                <p className="text-xs text-[var(--color-gray-600)] mt-1">
                  Attend 50 events
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
}
