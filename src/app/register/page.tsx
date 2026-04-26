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
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col justify-center py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <HeartPulse className="h-12 w-12 text-[var(--color-primary)]" />
        </motion.div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--foreground)]">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">
            Log in
          </Link>
        </p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="glass py-8 px-4 sm:rounded-2xl sm:px-10 shadow-xl">
          
          <div className="flex mb-6 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${role === 'patient' ? 'bg-white dark:bg-zinc-700 shadow text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
            >
              <UserRound className="w-4 h-4" /> Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${role === 'doctor' ? 'bg-white dark:bg-zinc-700 shadow text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
            >
               <Stethoscope className="w-4 h-4" /> Doctor
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Full Name</label>
              <input
                type="text" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-900 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Email address</label>
              <input
                type="email" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-900 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Phone Number</label>
                <input
                  type="tel" required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-900 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Address</label>
                <input
                  type="text" required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-900 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Password</label>
                <input
                  type="password" required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-900 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">Confirm Password</label>
                <input
                  type="password" required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-900 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                />
              </div>
            </div>

            {role === 'doctor' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-4 overflow-hidden pt-2 border-t border-zinc-200 dark:border-zinc-800"
              >
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)]">Specialization</label>
                  <input
                    type="text" required={role==='doctor'}
                    value={formData.specialization} placeholder="e.g. Cardiologist"
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-900 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)]">Experience (yrs)</label>
                    <input
                      type="number" required={role==='doctor'} min="0"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-900 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)]">Consultation Fee ($)</label>
                    <input
                      type="number" required={role==='doctor'} min="0"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm bg-white dark:bg-zinc-900 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
