'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, UserRound, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'doctor') {
      router.push('/dashboard/patient');
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
    if (status === 'authenticated' && session?.user?.role === 'doctor') {
      fetchAppointments();
    }
  }, [status, session]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Appointment ${newStatus}`);
        setAppointments(appointments.map(app => app._id === id ? { ...app, status: newStatus } : app));
      } else {
         toast.error('Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading || status === 'loading') {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" /></div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Welcome, Dr. {session?.user?.name}</h1>
          <p className="text-[var(--muted)] mt-2">Manage your patient requests and schedule.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">No Appointments</h3>
              <p className="text-[var(--muted)]">You have no upcoming patient requests.</p>
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
                    <div className="hidden sm:flex h-12 w-12 bg-sky-50 dark:bg-sky-900/30 text-[var(--color-secondary)] rounded-full items-center justify-center font-bold">
                      {apt.patientId?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[var(--foreground)]">{apt.patientId?.name}</h4>
                      <p className="text-sm text-[var(--muted)]">{apt.patientId?.email}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-[var(--muted)] font-medium">
                        <span className="flex items-center gap-1 text-[var(--color-primary)]"><Calendar className="w-4 h-4" /> {apt.date}</span>
                        <span className="flex items-center gap-1 text-[var(--color-primary)]"><Clock className="w-4 h-4" /> {apt.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-end gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full uppercase tracking-wider
                      ${apt.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {apt.status}
                    </span>

                    {apt.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(apt._id, 'accepted')}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" /> Accept
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(apt._id, 'rejected')}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                    
                    {apt.status === 'accepted' && (
                       <button 
                        onClick={() => handleUpdateStatus(apt._id, 'completed')}
                        className="px-4 py-1.5 text-sm font-medium text-[var(--foreground)] border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        Mark Completed
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
