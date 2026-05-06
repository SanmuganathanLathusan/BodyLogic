'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HeartPulse, Loader2, UserRound, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    experience: '',
    consultationFee: '',
  });

  const inputClassName =
    'appearance-none block w-full rounded-xl border-2 border-zinc-200/90 bg-white/70 px-4 py-3.5 text-sm shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 dark:border-zinc-800 dark:bg-zinc-950/60 dark:focus:bg-zinc-900';
  const labelClassName = 'block text-sm font-semibold text-[var(--foreground)]';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role,
          experience: formData.experience ? parseInt(formData.experience) : undefined,
          consultationFee: formData.consultationFee ? parseInt(formData.consultationFee) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Registration failed');
      } else {
        toast.success('Registration successful. Please login.');
        router.push('/login');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-linear-to-b from-white via-zinc-50 to-white px-4 py-12 pt-6 sm:pt-10 lg:pt-16 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute top-32 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between rounded-4xl border border-zinc-200/70 bg-white/80 p-8 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/75 sm:p-10"
        >
          <div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-white shadow-lg shadow-(--color-primary)/20">
              <HeartPulse className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-(--foreground)">
              Create your account
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-(--muted)">
              Set up your Bodylogic profile and get started with a cleaner, more polished onboarding flow.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-zinc-200/70 bg-zinc-50/80 p-5 text-sm text-(--muted) dark:border-zinc-800 dark:bg-zinc-900/60">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </div>
        </motion.aside>

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="rounded-4xl border border-zinc-200/70 bg-white/85 p-5 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8 dark:border-zinc-800 dark:bg-zinc-950/75"
        >
          <div className="mb-6 flex rounded-2xl border border-zinc-200/70 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900/70">
                    <button
                      type="button"
                      onClick={() => setRole('patient')}
                      className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${role === 'patient' ? 'bg-white text-(--foreground) shadow-sm dark:bg-zinc-800' : 'text-(--muted) hover:text-(--foreground)'}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <UserRound className="h-4 w-4" /> Patient
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('doctor')}
                      className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${role === 'doctor' ? 'bg-white text-(--foreground) shadow-sm dark:bg-zinc-800' : 'text-(--muted) hover:text-(--foreground)'}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" /> Doctor
                      </span>
                    </button>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <label className={labelClassName}>Full name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={inputClassName}
                          placeholder="Aisha Rahman"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className={labelClassName}>Email address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={inputClassName}
                          placeholder="you@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={labelClassName}>Phone number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className={inputClassName}
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={labelClassName}>Address</label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className={inputClassName}
                          placeholder="Street, city, country"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={labelClassName}>Password</label>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className={inputClassName}
                          placeholder="Create a secure password"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={labelClassName}>Confirm password</label>
                        <input
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className={inputClassName}
                          placeholder="Repeat your password"
                        />
                      </div>
                    </div>

                    {role === 'doctor' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-5 overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
                      >
                        <div className="space-y-2">
                          <label className={labelClassName}>Specialization</label>
                          <input
                            type="text"
                            required={role === 'doctor'}
                            value={formData.specialization}
                            placeholder="e.g. Cardiologist"
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            className={inputClassName}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className={labelClassName}>Experience (yrs)</label>
                            <input
                              type="number"
                              required={role === 'doctor'}
                              min="0"
                              value={formData.experience}
                              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                              className={inputClassName}
                              placeholder="8"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className={labelClassName}>Consultation fee ($)</label>
                            <input
                              type="number"
                              required={role === 'doctor'}
                              min="0"
                              value={formData.consultationFee}
                              onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                              className={inputClassName}
                              placeholder="120"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-xl hover:shadow-[var(--color-primary)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create account'}
                      </button>
                    </div>
                  </form>
                </motion.section>
      </div>
    </div>
  );
}
