'use client';

// Login Page - User authentication
// Client Component for form handling

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/forms/FormError';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader
          title="Welcome Back"
          subtitle="Sign in to your OutdoorPath account"
        />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <FormError error={error} />}

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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />

            <div className="text-sm text-right">
              <Link
                href="/forgot-password"
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              <LogIn size={18} />
              Sign In
            </Button>
          </form>

          {/* Demo credentials helper */}
          <div className="mt-6 p-4 bg-[var(--color-info)]/10 border border-[var(--color-info)]/20 rounded-[var(--radius-md)]">
            <p className="text-xs text-[var(--color-gray-700)] font-semibold mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-[var(--color-gray-600)]">
              Email: <code className="bg-white px-1 py-0.5 rounded">john.doe@example.com</code>
            </p>
            <p className="text-xs text-[var(--color-gray-600)]">
              Password: <code className="bg-white px-1 py-0.5 rounded">any password</code>
            </p>
          </div>
        </CardBody>
        <CardFooter className="text-center">
          <p className="text-sm text-[var(--color-gray-600)]">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium transition-colors"
            >
              Sign up
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
