'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HeartPulse, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const inputClassName =
    'appearance-none block w-full rounded-xl border-2 border-zinc-200/90 bg-white/70 px-4 py-4 text-sm shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/20 dark:border-zinc-800 dark:bg-zinc-950/60 dark:focus:bg-zinc-900';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Logged in successfully!');
        
        // Fetch session to determine role
        const session = await getSession();
        const role = session?.user?.role;
        
        if (role === 'admin') {
          router.push('/dashboard/admin');
        } else if (role === 'doctor') {
          router.push('/dashboard/doctor');
        } else {
          router.push('/dashboard/patient');
        }
        
        router.refresh();
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (res.ok) {
        toast.success('Password reset email sent! Check your inbox.');
        setForgotEmail('');
        setShowForgotPassword(false);
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to send reset email');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-linear-to-b from-white via-zinc-50 to-white px-4 py-12 pt-6 sm:pt-10 lg:pt-16 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute bottom-0 right-[-5rem] h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="flex flex-col justify-between rounded-4xl border border-zinc-200/70 bg-white/80 p-8 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/75 sm:p-10">
          <div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-white shadow-lg shadow-(--color-primary)/20">
              <HeartPulse className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-(--foreground)">
              Welcome back
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-(--muted)">
              Sign in to manage appointments, doctors, and your care history from one secure place.
            </p>
          </div>

          {role === 'patient' ? (
            <div className="mt-8 rounded-3xl border border-zinc-200/70 bg-zinc-50/80 p-5 text-sm text-(--muted) dark:border-zinc-800 dark:bg-zinc-900/60">
              New here?{' '}
              <Link href="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
                Create an account
              </Link>
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-zinc-200/70 bg-zinc-50/80 p-5 text-sm text-(--muted) dark:border-zinc-800 dark:bg-zinc-900/60">
              {role === 'doctor' ? 'Doctors' : 'Administrators'} are registered internally by the system administrators.
            </div>
          )}
        </div>

        <div className="rounded-4xl border border-zinc-200/70 bg-white/85 p-6 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8 dark:border-zinc-800 dark:bg-zinc-950/75">
          {showForgotPassword ? (
            <form className="space-y-5" onSubmit={handleForgotPassword}>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-(--foreground)">Email address</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={inputClassName}
                  placeholder="you@example.com"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="btn-premium inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-xl hover:shadow-[var(--color-primary)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {forgotLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Send Reset Link'}
                </button>
              </div>
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm font-semibold text-(--muted) hover:text-(--foreground)"
                >
                  Back to login
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="mb-6 flex rounded-2xl border border-zinc-200/70 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900/70">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`flex-1 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${role === 'patient' ? 'bg-white text-(--foreground) shadow-sm dark:bg-zinc-800' : 'text-(--muted) hover:text-(--foreground)'}`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex-1 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${role === 'doctor' ? 'bg-white text-(--foreground) shadow-sm dark:bg-zinc-800' : 'text-(--muted) hover:text-(--foreground)'}`}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${role === 'admin' ? 'bg-white text-(--foreground) shadow-sm dark:bg-zinc-800' : 'text-(--muted) hover:text-(--foreground)'}`}
              >
                Admin
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-(--foreground)">Email or Username</label>
              <input
                type="text"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClassName}
                placeholder="you@example.com or username"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-(--foreground)">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClassName}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-premium inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-xl hover:shadow-[var(--color-primary)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Sign In'}
              </button>
            </div>
          </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
