'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HeartPulse, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[var(--color-primary)]/10 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] bg-[var(--color-secondary)]/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 transform rotate-3 hover:-rotate-3 transition-transform">
              <HeartPulse className="h-10 w-10 text-[var(--color-primary)]" />
            </div>
          </motion.div>
          <h2 className="text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
            Welcome back
          </h2>
          <p className="mt-3 text-[var(--muted)] text-lg">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] underline-offset-4 hover:underline transition-all">
              Sign up for free
            </Link>
          </p>
        </div>

        <div className="glass-card sm:rounded-[2rem] p-8 sm:p-10 shadow-2xl border border-white/50 dark:border-zinc-700/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none block w-full px-4 py-3.5 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-0 focus:border-[var(--color-primary)] sm:text-md bg-white/50 dark:bg-zinc-900/50 transition-colors shadow-sm"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none block w-full px-4 py-3.5 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-0 focus:border-[var(--color-primary)] sm:text-md bg-white/50 dark:bg-zinc-900/50 transition-colors shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-md font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
