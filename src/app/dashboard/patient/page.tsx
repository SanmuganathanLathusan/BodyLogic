'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, UserRound, XCircle, CheckCircle, Loader2, Activity, Save, Camera, Mail, Phone, MapPin, Edit3, ArrowRight, Heart, Shield, Bell, Settings, FileText } from 'lucide-react';
import { formatDate } from '../../../lib/formatDate';
import toast from 'react-hot-toast';

export default function PatientDashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'profile'>('appointments');
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState(''); // ISO
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [savingReschedule, setSavingReschedule] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');

  // Profile Form State
  const [profile, setProfile] = useState({ name: '', email: '', phoneNumber: '', address: '', image: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else if (session?.user?.role === 'admin') {
        router.push('/dashboard/admin');
      }
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
        body: JSON.stringify({ action: 'cancel' })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Appointment cancelled');
        setAppointments(appointments.map(app => app._id === id ? { ...app, status: 'cancelled', paymentStatus: data.refundEligible ? 'refunded' : app.paymentStatus } : app));
      } else {
        toast.error(data.message || 'Failed to cancel appointment');
      }
    } catch {
      toast.error('Failed to cancel appointment');
    }
  };

  const openReschedule = (appointment: any) => {
    setRescheduleId(appointment._id);
    setRescheduleDate(appointment.date);
    setRescheduleTime(appointment.time);
  };

  const handleReschedule = async (id: string) => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error('Please choose a new date and time');
      return;
    }

    setSavingReschedule(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reschedule', date: rescheduleDate, time: rescheduleTime })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Appointment rescheduled');
        setAppointments(appointments.map(app => app._id === id ? { ...app, date: rescheduleDate, time: rescheduleTime } : app));
        setRescheduleId(null);
      } else {
        toast.error(data.message || 'Failed to reschedule appointment');
      }
    } catch {
      toast.error('Failed to reschedule appointment');
    } finally {
      setSavingReschedule(false);
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
        // Update next-auth session data
        await update({ name: profile.name, image: profile.image });
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

  const upcomingCount = appointments.filter(a => ['accepted', 'pending', 'confirmed'].includes(a.status)).length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const cancelledCount = appointments.filter(a => ['cancelled', 'rejected'].includes(a.status)).length;

  const filteredAppointments = appointments.filter(apt => {
    if (appointmentFilter === 'All') return true;
    if (appointmentFilter === 'Upcoming') return ['accepted', 'pending', 'confirmed'].includes(apt.status);
    if (appointmentFilter === 'Completed') return apt.status === 'completed';
    if (appointmentFilter === 'Cancelled') return ['cancelled', 'rejected'].includes(apt.status);
    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative shrink-0"
            >
               <div className="w-20 h-20 rounded-[28px] bg-slate-50 dark:bg-zinc-900 flex items-center justify-center border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden group">
                 {profile.image ? (
                   <img src={profile.image} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                 ) : (
                   <UserRound className="w-8 h-8 text-slate-400" />
                 )}
               </div>
            </motion.div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {session?.user?.name?.split(' ')[0]}
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm mt-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" /> Secure health portal
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800/50 p-1.5 rounded-3xl flex shadow-xl shadow-slate-200/20 dark:shadow-none">
              <button 
                onClick={() => setActiveTab('appointments')}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'appointments' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-[1.02]' : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'profile' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-[1.02]' : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'}`}
              >
                Profile & Settings
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'appointments' && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                
                {/* Stats & Quick Actions Column */}
                <div className="xl:col-span-1 space-y-8">
                  {/* Health Score Card */}
                  <div className="p-6 bg-slate-900 dark:bg-zinc-900 rounded-[30px] text-white shadow-lg overflow-hidden flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">Vitality Score</p>
                      <h3 className="text-4xl font-black">94%</h3>
                      <p className="text-green-500 text-xs font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" /> Optimal
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Upcoming</p>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">{upcomingCount}</h4>
                    </div>
                    <div className="p-5 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Success</p>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">{completedCount}</h4>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[30px] shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Calendar, label: 'Book', color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-zinc-800', path: '/doctors' },
                        { icon: Heart, label: 'Vitals', color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-zinc-800', path: '#' },
                        { icon: FileText, label: 'Results', color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-zinc-800', path: '#' },
                        { icon: Settings, label: 'Settings', color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-zinc-800', path: '#' },
                      ].map((item, idx) => (
                        <button 
                          key={idx}
                          onClick={() => item.path !== '#' && router.push(item.path)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                        >
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 tracking-tight">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Appointments List */}
                <div className="xl:col-span-2">
                  <div className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 rounded-[30px] shadow-sm overflow-hidden h-full">
                    <div className="p-6 border-b border-slate-100 dark:border-zinc-900">
                       <div className="flex items-center justify-between mb-6">
                         <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                           {appointmentFilter === 'All' ? 'Full Consultation History' : `${appointmentFilter} Appointments`}
                         </h3>
                         <span className="text-[10px] font-black bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded text-slate-500 uppercase">{filteredAppointments.length} Found</span>
                       </div>
                       
                       <div className="flex flex-wrap gap-2">
                         {[
                           { id: 'All', count: appointments.length },
                           { id: 'Upcoming', count: upcomingCount },
                           { id: 'Completed', count: completedCount },
                           { id: 'Cancelled', count: cancelledCount }
                         ].map((tab) => (
                           <button
                             key={tab.id}
                             onClick={() => setAppointmentFilter(tab.id as any)}
                             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                               appointmentFilter === tab.id 
                                 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md' 
                                 : 'bg-white dark:bg-zinc-800 text-slate-500 border-slate-100 dark:border-zinc-700 hover:border-slate-300'
                             }`}
                           >
                             {tab.id} ({tab.count})
                           </button>
                         ))}
                       </div>
                    </div>
                    
                        {filteredAppointments.length === 0 ? (
                      <div className="p-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-[32px] flex items-center justify-center mb-8 relative">
                          <Calendar className="w-10 h-10 text-slate-300 dark:text-zinc-600" />
                          <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                          {appointmentFilter === 'All' ? 'No Appointments Found' : `No ${appointmentFilter} Appointments`}
                        </h3>
                        <p className="text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mb-10 font-medium">
                          {appointmentFilter === 'All' 
                            ? "Your health journey is just beginning. Book your first consultation today." 
                            : `You don't have any appointments marked as ${appointmentFilter.toLowerCase()} at the moment.`}
                        </p>
                        {appointmentFilter === 'All' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/doctors')}
                            className="inline-flex items-center justify-center py-4 px-10 rounded-2xl font-black text-white bg-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/20 hover:bg-[var(--color-primary-dark)] transition-all uppercase tracking-widest text-xs"
                          >
                            Find a Specialist
                          </motion.button>
                        )}
                      </div>
                    ) : (
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {filteredAppointments.map((apt, idx) => (
                        <div key={apt._id} className="p-8 sm:flex items-center justify-between gap-8 hover:bg-slate-50 dark:hover:bg-zinc-800/20 transition-all duration-300 group">
                          <div className="flex items-center gap-6">
                            <div className="hidden sm:flex h-16 w-16 bg-gradient-to-br from-teal-500 to-[var(--color-primary)] text-white rounded-3xl items-center justify-center font-black text-2xl shadow-lg shadow-teal-500/20 transform group-hover:rotate-6 transition-transform">
                              {apt.doctorId?.name?.charAt(0) || 'D'}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Dr. {apt.doctorId?.name}</h4>
                              <div className="flex flex-wrap gap-5 mt-2 text-sm text-slate-500 dark:text-zinc-400 font-medium">
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[var(--color-primary)]" /> {formatDate(apt.date, { weekday: true, month: 'short' })}</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[var(--color-primary)]" /> {apt.time}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-5">
                            <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm
                              ${apt.status === 'accepted' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                                apt.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                                apt.status === 'confirmed' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                                apt.status === 'completed' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                                'bg-red-500/10 text-red-600 border border-red-500/20'
                              }`}
                            >
                              {apt.status}
                            </span>

                            {['pending', 'accepted', 'confirmed'].includes(apt.status) && (
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => openReschedule(apt)}
                                  className="text-xs font-black text-[var(--color-primary)] hover:opacity-80 transition-all uppercase tracking-widest flex items-center gap-1.5"
                                >
                                  Reschedule <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800"></div>
                                <button 
                                  onClick={() => handleCancel(apt._id)}
                                  className="text-xs font-black text-rose-500 hover:text-rose-600 transition-all uppercase tracking-widest flex items-center gap-1.5"
                                >
                                   Cancel <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Health Tips Section */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-400 dark:text-zinc-500 mb-6 flex items-center gap-2 uppercase tracking-widest">
                <Heart className="w-4 h-4" /> Health Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 rounded-2xl flex gap-5">
                  <div className="w-10 h-10 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Hydration</h4>
                    <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">Daily target reached 80%. Stay hydrated.</p>
                    <div className="mt-3 h-1.5 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-[var(--color-primary)] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 rounded-2xl flex gap-5">
                  <div className="w-10 h-10 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Quarterly Review</h4>
                    <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">Scheduled for next month. Review documents.</p>
                    <button className="mt-2 text-[var(--color-primary)] font-bold text-xs flex items-center gap-1">Prepare <ArrowRight className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[30px] shadow-sm p-8 sticky top-32">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative group mb-6">
                      <div className="h-32 w-32 rounded-[28px] overflow-hidden bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm transition-transform duration-500">
                        {profile.image ? (
                          <img src={profile.image} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-300">
                            <UserRound className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-lg transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </motion.button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/jpeg, image/png, image/webp" 
                        onChange={handleImageChange} 
                      />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{profile.name}</h2>
                    <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Member ID: BL-2024-XP</p>
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800 w-full space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-zinc-400 font-medium">Joined</span>
                        <span className="text-slate-900 dark:text-white font-bold">May 2024</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-zinc-400 font-medium">Status</span>
                        <span className="text-green-500 font-bold">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[30px] shadow-sm p-8 overflow-hidden relative">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-slate-400" /> Account Settings
                  </h3>
                  
                  <form onSubmit={handleSaveProfile} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                      <div className="space-y-3">
                         <label className="text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-[2px] ml-1">Full Identity</label>
                         <div className="relative">
                            <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                              type="text" 
                              required 
                              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] outline-none transition-all text-slate-900 dark:text-white font-bold"
                              value={profile.name} 
                              onChange={e => setProfile({...profile, name: e.target.value})} 
                            />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-[2px] ml-1">Email Connection</label>
                         <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                              type="email" 
                              disabled 
                              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800/50 text-slate-400 cursor-not-allowed font-bold"
                              value={profile.email} 
                            />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-[2px] ml-1">Secure Phone</label>
                         <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                              type="tel" 
                              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] outline-none transition-all text-slate-900 dark:text-white font-bold"
                              value={profile.phoneNumber} 
                              onChange={e => setProfile({...profile, phoneNumber: e.target.value})} 
                              placeholder="+1 (555) 000-0000"
                            />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-[2px] ml-1">Current Address</label>
                         <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                              type="text" 
                              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] outline-none transition-all text-slate-900 dark:text-white font-bold"
                              value={profile.address} 
                              onChange={e => setProfile({...profile, address: e.target.value})} 
                              placeholder="City, State, Zip"
                            />
                         </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex justify-end items-center gap-6">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Update profile information</p>
                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={savingProfile}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
                      >
                        {savingProfile ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                        {savingProfile ? 'Saving...' : 'Save Profile'}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-[30px] shadow-2xl p-8 max-w-md w-full border border-slate-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Reschedule Appointment</h3>
                <button onClick={() => setRescheduleId(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Choose New Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] outline-none transition-all font-bold text-slate-900 dark:text-white"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">New Time Slot</label>
                  <input 
                    type="time" 
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] outline-none transition-all font-bold text-slate-900 dark:text-white"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  />
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => setRescheduleId(null)}
                    disabled={savingReschedule}
                    className="flex-1 py-4 px-6 rounded-xl font-bold text-slate-600 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all border border-slate-100 dark:border-zinc-800"
                  >
                    Keep Current
                  </button>
                  <button 
                    onClick={() => handleReschedule(rescheduleId)}
                    disabled={savingReschedule}
                    className="flex-1 py-4 px-6 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {savingReschedule ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Change'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
