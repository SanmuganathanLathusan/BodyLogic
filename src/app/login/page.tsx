'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HeartPulse, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const inputClassName =
    'appearance-none block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/15';

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
        const session = await getSession();
        const userRole = session?.user?.role;
        if (userRole === 'admin') {
          router.push('/dashboard/admin');
        } else if (userRole === 'doctor') {
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      {/* Subtle background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[var(--color-primary)]/8 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[var(--color-primary)]/6 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_1.1fr]"
      >
        {/* ── Left Side: Image Panel ── */}
        <div className="hidden lg:flex flex-col rounded-3xl overflow-hidden shadow-2xl relative min-h-[640px] bg-slate-900">
          {/* Single clear image for both roles */}
          <img
            src="/uploads/doctercover.png"
            alt="BodyLogic Healthcare"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Gradient overlay — stronger at bottom for text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />

          {/* Top: Logo */}
          <div className="relative z-10 p-8">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              
              <span className="font-bold text-xl text-white tracking-tight drop-shadow">
                Body<span className="text-[var(--color-primary-light)]">Logic</span>
              </span>
            </Link>
          </div>

          {/* Bottom: Role-aware minimal tagline */}
          <div className="relative z-10 mt-auto p-8 space-y-3">
            <AnimatePresence mode="wait">
              {role === 'patient' ? (
                <motion.div
                  key="patient-label"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-light)] mb-2">
                    Patient Portal
                  </span>
                  <h2 className="text-3xl font-black text-white leading-tight drop-shadow-lg">
                    Your Health,<br />Our Priority.
                  </h2>
                </motion.div>
              ) : (
                <motion.div
                  key="doctor-label"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-light)] mb-2">
                    Doctor Portal
                  </span>
                  <h2 className="text-3xl font-black text-white leading-tight drop-shadow-lg">
                    Empowering<br />Expert Care.
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Register / access note */}
            <div className="pt-1 text-sm font-medium text-white/70">
              {role === 'patient' ? (
                <>
                  New here?{' '}
                  <Link href="/register" className="font-bold text-white hover:text-[var(--color-primary-light)] transition-colors underline underline-offset-4">
                    Create an account
                  </Link>
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Verified Doctor Access Point
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Side: Login Form ── */}
        <div className="rounded-3xl bg-white p-6 md:p-10 shadow-xl border border-slate-100">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center justify-center gap-2.5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm overflow-hidden">
              <img src="/brand/logo.png" alt="BodyLogic Logo" className="w-full h-full object-contain scale-[1.9] translate-y-1" />
            </div>
            <span className="font-bold text-xl text-slate-900">Body<span className="text-[var(--color-primary)]">Logic</span></span>
          </div>

          {showForgotPassword ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                <p className="text-sm text-slate-500 mt-1">Enter your email and we'll send you a reset link.</p>
              </div>
              <form className="space-y-5" onSubmit={handleForgotPassword}>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={inputClassName}
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/30 transition-all hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {forgotLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm font-bold text-slate-500 hover:text-[var(--color-primary)] transition-colors"
                  >
                    Back to login
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Login</h2>
                <p className="text-sm text-slate-500 mt-1">Access your portal to continue.</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Role Tabs */}
                <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-300 ${
                      role === 'patient'
                        ? 'bg-white text-slate-900 shadow-md'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-300 ${
                      role === 'doctor'
                        ? 'bg-white text-slate-900 shadow-md'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Doctor
                  </button>
                </div>

                {/* Fields */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email or Username</label>
                    <input
                      type="text"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClassName}
                      placeholder="you@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`${inputClassName} pr-12`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {role === 'patient' && (
                  <div className="flex justify-end -mt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs font-bold text-[var(--color-primary)] hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/30 transition-all hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)] active:scale-95 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Log In to Dashboard'}
                </button>

                {role === 'doctor' && (
                  <div className="pt-2">
                    <div className="relative flex items-center justify-center mb-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Verification Required</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-xs text-slate-500 mb-4 font-medium">New medical practitioners must undergo identity verification before access is granted.</p>
                      <Link
                        href="/doctor-registration"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 text-white py-3.5 text-sm font-bold transition-all hover:bg-slate-700 active:scale-95"
                      >
                        Request Doctor Access
                      </Link>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
