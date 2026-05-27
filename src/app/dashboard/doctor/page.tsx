'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, UserRound, XCircle, CheckCircle, Loader2, Users, Activity, Camera, Save, Mail, Phone, MapPin, Plus, Trash2 } from 'lucide-react';
import { formatDate } from '../../../lib/formatDate';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'profile' | 'schedule'>('appointments');

  const [profile, setProfile] = useState({ name: '', email: '', phoneNumber: '', address: '', image: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [availability, setAvailability] = useState<{ day: string, slots: string[] }[]>([]);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'doctor') {
      router.push('/dashboard/patient');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes, profileRes, availRes] = await Promise.all([
          fetch('/api/appointments'),
          fetch('/api/profile'),
          fetch('/api/doctor/availability')
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
        if (availRes.ok) {
          setAvailability(await availRes.json());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (status === 'authenticated' && session?.user?.role === 'doctor') {
      fetchData();
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

  const handleAddDay = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const usedDays = availability.map(a => a.day);
    const nextDay = days.find(d => !usedDays.includes(d));
    if (!nextDay) {
      toast.error('All days already added');
      return;
    }
    setAvailability([...availability, { day: nextDay, slots: ['09:00', '10:00'] }]);
  };

  const handleRemoveDay = (day: string) => {
    setAvailability(availability.filter(a => a.day !== day));
  };

  const handleAddSlot = (day: string) => {
    setAvailability(availability.map(a => {
      if (a.day === day) {
        const lastSlot = a.slots[a.slots.length - 1] || '08:00';
        const [hours, minutes] = lastSlot.split(':').map(Number);
        const nextTime = `${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        return { ...a, slots: [...a.slots, nextTime] };
      }
      return a;
    }));
  };

  const handleUpdateSlot = (day: string, slotIdx: number, value: string) => {
    setAvailability(availability.map(a => {
      if (a.day === day) {
        const newSlots = [...a.slots];
        newSlots[slotIdx] = value;
        return { ...a, slots: newSlots };
      }
      return a;
    }));
  };

  const handleRemoveSlot = (day: string, slotIdx: number) => {
    setAvailability(availability.map(a => {
      if (a.day === day) {
        return { ...a, slots: a.slots.filter((_, i) => i !== slotIdx) };
      }
      return a;
    }));
  };

  const handleSaveSchedule = async () => {
    setSavingSchedule(true);
    try {
      const res = await fetch('/api/doctor/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability })
      });
      if (res.ok) {
        toast.success('Schedule updated successfully');
      } else {
        toast.error('Failed to update schedule');
      }
    } catch {
      toast.error('An error occurred while saving');
    } finally {
      setSavingSchedule(false);
    }
  };

  if (loading || status === 'loading') {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" /></div>;
  }

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const upcomingCount = appointments.filter(a => a.status === 'accepted' || a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Welcome, Dr. {session?.user?.name}</h1>
            <p className="text-[var(--muted)] mt-2">Manage your patient requests and profile.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl flex sm:w-fit w-full">
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appointments' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
            >
              Patient Requests
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'schedule' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
            >
              My Schedule
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
                    <p className="text-sm font-medium text-[var(--muted)] mb-1">Pending Requests</p>
                    <h3 className="text-3xl font-bold text-[var(--foreground)]">{pendingCount}</h3>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/40 text-amber-500 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div className="glass-card p-6 rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-medium text-[var(--muted)] mb-1">Upcoming Consults</p>
                    <h3 className="text-3xl font-bold text-[var(--foreground)]">{upcomingCount}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 text-blue-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div className="glass-card p-6 rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-medium text-[var(--muted)] mb-1">Total Completed</p>
                    <h3 className="text-3xl font-bold text-[var(--foreground)]">{completedCount}</h3>
                  </div>
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/40 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {appointments.length === 0 ? (
                  <div className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4 flex justify-center" />
                    <h3 className="text-xl font-medium text-[var(--foreground)] mb-2 mt-4">No Appointments</h3>
                    <p className="text-[var(--muted)]">You have no upcoming patient requests.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {appointments.map((apt, idx) => (
                      <div key={apt._id} className="p-6 sm:flex items-center justify-between gap-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="hidden sm:flex h-12 w-12 bg-sky-50 dark:bg-sky-900/30 text-[var(--color-secondary)] rounded-full items-center justify-center font-bold">
                            {apt.patientId?.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-[var(--foreground)]">{apt.patientId?.name}</h4>
                            <p className="text-sm text-[var(--muted)]">{apt.patientId?.email}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-[var(--muted)] font-medium">
                              <span className="flex items-center gap-1 text-[var(--color-primary)]"><Calendar className="w-4 h-4" /> {formatDate(apt.date, { weekday: true, month: 'short' })}</span>
                              <span className="flex items-center gap-1 text-[var(--color-primary)]"><Clock className="w-4 h-4" /> {apt.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-end gap-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full uppercase tracking-wider
                            ${apt.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              apt.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                              apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
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
                          
                          {(apt.status === 'accepted' || apt.status === 'confirmed') && (
                             <button 
                              onClick={() => handleUpdateStatus(apt._id, 'completed')}
                              className="px-4 py-1.5 text-sm font-medium text-[var(--foreground)] border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                              Mark Completed
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

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6 md:p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Availability Schedule</h2>
                    <p className="text-sm text-[var(--muted)]">Set the days and times you are available for consultations.</p>
                  </div>
                  <button 
                    onClick={handleAddDay}
                    className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Day
                  </button>
                </div>

                <div className="space-y-6">
                  {availability.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
                      <Clock className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                      <p className="text-[var(--muted)]">No availability set yet. Click "Add Day" to start.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {availability.map((item, idx) => (
                        <div key={item.day} className="p-6 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <select 
                                value={item.day}
                                onChange={(e) => {
                                  const newAvail = [...availability];
                                  newAvail[idx].day = e.target.value;
                                  setAvailability(newAvail);
                                }}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 font-bold text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                              >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                  <option key={d} value={d} disabled={availability.some(a => a.day === d && a.day !== item.day)}>{d}</option>
                                ))}
                              </select>
                              <span className="text-xs font-medium text-[var(--muted)] bg-white dark:bg-zinc-900 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">{item.slots.length} Slots</span>
                            </div>
                            <button 
                              onClick={() => handleRemoveDay(item.day)}
                              className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 items-center">
                            {item.slots.map((slot, sIdx) => (
                              <div key={sIdx} className="group relative flex items-center">
                                <input 
                                  type="time" 
                                  value={slot}
                                  onChange={(e) => handleUpdateSlot(item.day, sIdx, e.target.value)}
                                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                                <button 
                                  onClick={() => handleRemoveSlot(item.day, sIdx)}
                                  className="absolute -top-2 -right-2 bg-white dark:bg-zinc-800 text-red-500 rounded-full shadow-md border border-zinc-200 dark:border-zinc-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <XCircle className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => handleAddSlot(item.day)}
                              className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={handleSaveSchedule}
                    disabled={savingSchedule}
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {savingSchedule ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
                    {savingSchedule ? 'Saving...' : 'Update Availability Schedule'}
                  </button>
                </div>
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
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Dr. {profile.name}</h2>
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
                         placeholder="Add your consulting phone"
                       />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-2"><MapPin className="w-4 h-4"/> Clinic/Office Address</label>
                       <input 
                         type="text" 
                         className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all text-[var(--foreground)]"
                         value={profile.address} 
                         onChange={e => setProfile({...profile, address: e.target.value})} 
                         placeholder="Add your clinic address"
                       />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                      type="button"
                      onClick={() => router.push('/change-password')}
                      className="text-[var(--color-primary)] hover:underline font-medium text-sm"
                    >
                      Change Password
                    </button>
                    <button 
                      type="submit" 
                      disabled={savingProfile}
                      className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2 disabled:opacity-70 w-full sm:w-auto"
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
