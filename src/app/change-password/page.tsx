'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { HeartPulse, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const inputClassName =
    'appearance-none block w-full rounded-xl border-2 border-zinc-200/90 bg-white/70 px-4 py-4 text-sm shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/20 dark:border-zinc-800 dark:bg-zinc-950/60 dark:focus:bg-zinc-900';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.password }),
      });

      if (res.ok) {
        toast.success('Password changed successfully!');
        // Update session so requiresPasswordChange is false
        await update({ requiresPasswordChange: false });
        
        // redirect based on role
        if (session?.user?.role === 'doctor') {
          router.push('/dashboard/doctor');
        } else {
          router.push('/');
        }
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to change password.');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" /></div>;
  }

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
        <div className="flex flex-col justify-center rounded-4xl border border-zinc-200/70 bg-white/80 p-8 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/75 sm:p-10">
          <div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-white shadow-lg shadow-(--color-primary)/20">
              <HeartPulse className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-(--foreground)">
              Change Password
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-(--muted)">
              {session?.user?.requiresPasswordChange 
                ? "Please change your temporary password to continue."
                : "Update your password below."}
            </p>
          </div>
        </div>

        <div className="rounded-4xl border border-zinc-200/70 bg-white/85 p-6 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8 dark:border-zinc-800 dark:bg-zinc-950/75">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-(--foreground)">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`${inputClassName} pr-12`}
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-(--foreground)">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`${inputClassName} pr-12`}
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-premium inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-xl hover:shadow-[var(--color-primary)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
