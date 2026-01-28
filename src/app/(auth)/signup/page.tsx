'use client';

// Signup Page - User registration
// Client Component for form handling

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/forms/FormError';
import { UserPlus } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await signup(email, password, fullName);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader
          title="Create Account"
          subtitle="Join OutdoorPath and start exploring"
        />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <FormError error={error} />}

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              disabled={loading}
            />

            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
              helperText="Must be at least 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
            />

            <div className="text-xs text-[var(--color-gray-600)] leading-relaxed">
              By signing up, you agree to our{' '}
              <Link
                href="/terms"
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              <UserPlus size={18} />
              Create Account
            </Button>
          </form>

          {/* OAuth placeholder (for Phase 5) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-gray-300)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-[var(--color-gray-500)]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled
                className="opacity-50 cursor-not-allowed"
              >
                Google
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled
                className="opacity-50 cursor-not-allowed"
              >
                Facebook
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled
                className="opacity-50 cursor-not-allowed"
              >
                Apple
              </Button>
            </div>
            <p className="text-xs text-center text-[var(--color-gray-500)] mt-2">
              OAuth coming in Phase 5
            </p>
          </div>
        </CardBody>
        <CardFooter className="text-center">
          <p className="text-sm text-[var(--color-gray-600)]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Back to home link */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="text-sm text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
