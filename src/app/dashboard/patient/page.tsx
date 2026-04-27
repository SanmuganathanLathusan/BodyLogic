'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, UserRound, XCircle, CheckCircle, Loader2, Activity, Save, Camera, Mail, Phone, MapPin, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientDashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'profile'>('appointments');

  // Profile Form State
  const [profile, setProfile] = useState({ name: '', email: '', phoneNumber: '', address: '', image: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'patient') {
      router.push('/dashboard/doctor');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes, profileRes] = await Promise.all([
          fetch('/api/appointments'),
          fetch('/api/profile')
        ]);
        if (apptsRes.ok) {
          setAppointments(await apptsRes.json());
        }
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile({
            name: profileData.name || '',
            email: profileData.email || '',
            phoneNumber: profileData.phoneNumber || '',
            address: profileData.address || '',
            image: profileData.image || ''
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (status === 'authenticated' && session?.user?.role === 'patient') {
      fetchData();
    }
  }, [status, session]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        toast.success('Profile updated successfully');
        // Update next-auth session data if name modified
        if (session && session.user.name !== profile.name) {
          await update({ name: profile.name });
        }
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('An error occurred while saving');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading || status === 'loading') {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" /></div>;
  }

  const upcomingCount = appointments.filter(a => a.status === 'accepted' || a.status === 'pending').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Welcome back, {session?.user?.name}</h1>
            <p className="text-[var(--muted)] mt-2">Manage your health profile and upcoming consultations.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl flex sm:w-fit w-full">
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appointments' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
            >
              My Appointments
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
            >
              My Profile
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'appointments' && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-medium text-[var(--muted)] mb-1">Upcoming</p>
                    <h3 className="text-3xl font-bold text-[var(--foreground)]">{upcomingCount}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 text-blue-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div className="glass-card p-6 rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-medium text-[var(--muted)] mb-1">Completed</p>
                    <h3 className="text-3xl font-bold text-[var(--foreground)]">{completedCount}</h3>
                  </div>
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/40 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
                <div className="glass-card p-6 rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-medium text-[var(--muted)] mb-1">Total Bookings</p>
                    <h3 className="text-3xl font-bold text-[var(--foreground)]">{appointments.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/40 text-purple-500 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
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
                      <div key={apt._id} className="p-6 sm:flex items-center justify-between gap-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6 md:p-8"
            >
              <div className="max-w-2xl mx-auto flex flex-col gap-8">
                
                {/* Profile Image Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-950 shadow-lg">
                      {profile.image ? (
                        <img src={profile.image} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-zinc-400">
                          <UserRound className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:bg-[var(--color-primary-dark)] transition-transform hover:scale-110"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                     accept="image/jpeg, image/png, image/webp" 
                      onChange={handleImageChange} 
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">{profile.name}</h2>
                </div>

                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>

                {/* Profile Form */}
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-2"><UserRound className="w-4 h-4"/> Full Name</label>
                       <input 
                         type="text" 
                         required 
                         className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all text-[var(--foreground)]"
                         value={profile.name} 
                         onChange={e => setProfile({...profile, name: e.target.value})} 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-2"><Mail className="w-4 h-4"/> Email Address</label>
                       <input 
                         type="email" 
                         disabled 
                         className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 text-[var(--muted)] cursor-not-allowed"
                         value={profile.email} 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-2"><Phone className="w-4 h-4"/> Phone Number</label>
                       <input 
                         type="tel" 
                         className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all text-[var(--foreground)]"
                         value={profile.phoneNumber} 
                         onChange={e => setProfile({...profile, phoneNumber: e.target.value})} 
                         placeholder="Add your phone number"
                       />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-2"><MapPin className="w-4 h-4"/> Address</label>
                       <input 
                         type="text" 
                         className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all text-[var(--foreground)]"
                         value={profile.address} 
                         onChange={e => setProfile({...profile, address: e.target.value})} 
                         placeholder="Add your living address"
                       />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={savingProfile}
                      className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {savingProfile ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
                      {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
