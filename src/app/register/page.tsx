'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HeartPulse, Loader2, UserRound, Stethoscope, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role] = useState<'patient'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative min-h-[500px] lg:min-h-full rounded-4xl overflow-hidden shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)]"
        >
          <img 
            src="/uploads/1779276929652-ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg" 
            alt="Doctor" 
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="relative flex h-full flex-col justify-between p-10 text-white">

            <div className="mt-auto">
              <h1 className="text-4xl font-black tracking-tight leading-tight">
                Join our health <br /> <span className="text-[var(--color-primary)]">Revolution.</span>
              </h1>
              <p className="mt-4 text-slate-200 text-sm leading-relaxed max-w-xs font-medium">
                Connect with verified medical professionals and take control of your well-being today.
              </p>
              
              <div className="mt-8 flex items-center gap-4 text-xs font-bold text-slate-300">
                <div className="flex -space-x-3">
                  {['patient1.png', 'patient2.png', 'patient3.png'].map((img, i) => (
                    <div key={i} className="h-9 w-9 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-lg">
                      <img src={`/uploads/${img}`} alt="User" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <span>Trusted by 10k+ active patients</span>
              </div>
            </div>
          </div>
        </motion.aside>

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="rounded-4xl border border-zinc-200/70 bg-white/85 p-5 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8 dark:border-zinc-800 dark:bg-zinc-950/75"
        >
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create Account</h2>
            <Link href="/login" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
              Already have an account?
            </Link>
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
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`${inputClassName} pr-12`}
                            placeholder="Create a secure password"
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
                        <label className={labelClassName}>Confirm password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={`${inputClassName} pr-12`}
                            placeholder="Repeat your password"
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
                    </div>



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
