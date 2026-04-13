'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, UserRound, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'patient') {
      router.push('/dashboard/doctor');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (status === 'authenticated') {
      fetchAppointments();
    }
  }, [status]);

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (res.ok) {
        toast.success('Appointment cancelled');
        setAppointments(appointments.map(app => app._id === id ? { ...app, status: 'cancelled' } : app));
      }
    } catch {
      toast.error('Failed to cancel appointment');
    }
  };

  if (loading || status === 'loading') {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" /></div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">My Appointments</h1>
          <p className="text-[var(--muted)] mt-2">Manage your upcoming and past consultations.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto w-full flex justify-center mb-4" />
              <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">No Appointments Yet</h3>
              <p className="text-[var(--muted)] mb-6">You haven't scheduled any consultations with our experts.</p>
              <button
                onClick={() => router.push('/doctors')}
                className="inline-flex items-center justify-center py-2 px-6 rounded-full font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Find a Doctor
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {appointments.map((apt, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={apt._id} 
                  className="p-6 sm:flex items-center justify-between gap-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex h-12 w-12 bg-teal-50 dark:bg-teal-900/30 text-[var(--color-primary)] rounded-full items-center justify-center font-bold">
                      {apt.doctorId?.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[var(--foreground)]">Dr. {apt.doctorId?.name}</h4>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-[var(--muted)]">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {apt.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full uppercase tracking-wider
                      ${apt.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {apt.status}
                    </span>

                    {(apt.status === 'pending' || apt.status === 'accepted') && (
                      <button 
                        onClick={() => handleCancel(apt._id)}
                        className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                      >
                         Cancel <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
