'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function DoctorRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    registrationNumber: '',
    specialization: '',
    hospitalName: '',
    experience: '',
    notes: '',
    licenseUrl: '',
  });

  const inputClasses = "w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all";
  const labelClasses = "text-[10px] font-black tracking-widest text-zinc-400 uppercase ml-1 mb-1.5 block";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, licenseUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.licenseUrl) {
      toast.error('Please upload your medical license');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/doctor-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        toast.success('Registration request submitted successfully!');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to submit request');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-10 shadow-2xl text-center space-y-6 border border-zinc-200 dark:border-zinc-800"
        >
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Request Received</h1>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            Thank you for applying to join BodyLogic. Our medical compliance team will review your credentials and get back to you via email within 24-48 hours.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-black/10"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
          <div />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
          <div className="p-8 md:p-12 space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Apply for General Physician <br /><span className="text-[var(--color-primary)]">Access</span></h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-xl">
                Join our network of elite medical practitioners. Please fill out the form below with your professional details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className={labelClasses}>Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={inputClasses}
                    placeholder="Dr. Alexander Wright"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClasses}>Professional Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                    placeholder="awright@hospital.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClasses}>Mobile Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className={inputClasses}
                    placeholder="+94 77 123 4567"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClasses}>Medical Registration ID</label>
                  <input
                    required
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className={inputClasses}
                    placeholder="SLMC-45920"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClasses}>Specialization</label>
                  <input
                    required
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className={inputClasses}
                    placeholder="Cardiologist"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClasses}>Experience (Years)</label>
                  <input
                    required
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className={inputClasses}
                    placeholder="12"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClasses}>Affiliated Hospital/Clinic</label>
                <input
                  required
                  type="text"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className={inputClasses}
                  placeholder="Mount Elizabeth Medical Centre"
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClasses}>Medical License (PDF/Image Mandotory)</label>
                <div className="relative group">
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl group-hover:border-[var(--color-primary)] transition-colors bg-zinc-50/50 dark:bg-zinc-950/30">
                      <div className="text-center">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{formData.licenseUrl ? 'File Selected ✓' : 'Upload Document'}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">PDF or Image up to 5MB</p>
                      </div>
                   </div>
                  <input
                    required
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="relative w-full h-32 opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClasses}>Additional Statement</label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className={`${inputClasses} resize-none`}
                  placeholder="Tell us about your practice..."
                ></textarea>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Registration Application'}
                </button>
              </div>
            </form>
          </div>

          <div className="p-8 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800/50">
            <div className="flex gap-4 items-start max-w-2xl">
               <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 text-[10px] font-bold">!</div>
               <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
                 By submitting this application, you agree to our Medical Practitioner Terms of Service. All credentials will be verified against the official medical council database.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
