'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, Stethoscope, CheckCircle, XCircle, Trash2, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Doctor Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', specialization: '', experience: 0, consultationFee: 100
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      const [statsRes, docsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/doctors')
      ]);
      
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      if (docsRes.ok) {
        setDoctors(await docsRes.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchData();
    }
  }, [status, session]);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/doctors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      if (res.ok) {
        toast.success(`Doctor ${!currentStatus ? 'Approved' : 'Revoked'}`);
        fetchData();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Doctor removed');
        fetchData();
      } else {
        toast.error('Failed to delete doctor');
      }
    } catch {
      toast.error('Failed to delete doctor');
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Doctor created successfully');
        setShowAddForm(false);
        setFormData({ name: '', email: '', password: '', specialization: '', experience: 0, consultationFee: 100 });
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to create doctor');
      }
    } catch {
      toast.error('Failed to create doctor');
    }
  };

  if (loading || status === 'loading') {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" /></div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Admin Dashboard</h1>
            <p className="text-[var(--muted)] mt-2">Manage the BodyLogic platform</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/20"
          >
            {showAddForm ? <XCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showAddForm ? 'Cancel' : 'Add New Doctor'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-sm font-medium text-[var(--muted)] mb-1">Total Patients</p>
              <h3 className="text-3xl font-bold text-[var(--foreground)]">{stats.patients}</h3>
            </div>
            <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/40 text-sky-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-sm font-medium text-[var(--muted)] mb-1">Total Doctors</p>
              <h3 className="text-3xl font-bold text-[var(--foreground)]">{stats.doctors}</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500 rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-sm font-medium text-[var(--muted)] mb-1">Total Appointments</p>
              <h3 className="text-3xl font-bold text-[var(--foreground)]">{stats.appointments}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-500 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="glass-card p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Create Doctor Profile</h2>
                <form onSubmit={handleAddDoctor} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--foreground)]">Full Name</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Dr. Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--foreground)]">Email Address</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="jane@clinic.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--foreground)]">Temporary Password</label>
                      <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--foreground)]">Specialization</label>
                      <input required type="text" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" placeholder="Cardiologist" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--foreground)]">Years of Experience</label>
                      <input required type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" min="0" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--foreground)]">Consultation Fee ($)</label>
                      <input required type="number" value={formData.consultationFee} onChange={e => setFormData({...formData, consultationFee: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" min="0" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/20 font-medium">
                      Create Doctor
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Manage Verified Doctors</h2>
          </div>
          
          {doctors.length === 0 ? (
            <div className="p-12 text-center text-[var(--muted)]">No doctors found in the system.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Doctor</th>
                    <th className="px-6 py-4 font-medium">Specialization</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center font-bold">
                            {doctor.userId?.name?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <p className="font-medium text-[var(--foreground)]">{doctor.userId?.name}</p>
                            <p className="text-xs text-[var(--muted)]">{doctor.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--muted)]">{doctor.specialization}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.isApproved ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {doctor.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => handleToggleApproval(doctor._id, doctor.isApproved)}
                          className={`text-sm font-medium ${doctor.isApproved ? 'text-amber-500 hover:text-amber-600' : 'text-green-500 hover:text-green-600'}`}
                        >
                          {doctor.isApproved ? 'Revoke Approval' : 'Approve'}
                        </button>
                        <button 
                          onClick={() => handleDeleteDoctor(doctor._id)}
                          className="text-sm font-medium text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
