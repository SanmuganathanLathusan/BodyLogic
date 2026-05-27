'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Stethoscope, Search, Clock, Award, Star } from 'lucide-react';

function DoctorsList() {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Doctors');

  useEffect(() => {
    const term = searchParams.get('search') || '';
    setSearch(term);
  }, [searchParams]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const categories = [
    'All Doctors',
    ...Array.from(new Set(doctors.map(d => d.specialization))).sort((a, b) => a.localeCompare(b))
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.userId?.name.toLowerCase().includes(search.toLowerCase()) || 
                         doctor.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All Doctors' || doctor.specialization === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="mb-16 text-center max-w-3xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-[var(--foreground)] mb-6 tracking-tight"
        >
          Find Your Specialist
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[var(--muted)]"
        >
          Browse our network of verified wellness experts and book your consultation instantly.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 relative max-w-xl mx-auto group"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-zinc-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-12 pr-6 py-4 text-lg border-2 border-transparent glass-card rounded-xl leading-5 bg-white/80 dark:bg-zinc-900/80 shadow-lg hover:shadow-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 focus:bg-white dark:focus:bg-zinc-900 sm:text-lg text-[var(--foreground)] transition-all placeholder:text-zinc-500"
          />
        </motion.div>

        {/* See All Specialists Button */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.25 }}
           className="mt-10 flex justify-center"
        >
          <button
            onClick={() => setSelectedCategory('All Doctors')}
            className={`px-12 py-4 rounded-2xl text-base font-black transition-all duration-300 border-2 uppercase tracking-widest shadow-xl flex items-center gap-3 ${
              selectedCategory === 'All Doctors'
                ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-[var(--color-primary)]/40 scale-105'
                : 'bg-white dark:bg-zinc-900 border-white dark:border-zinc-800 text-slate-500 hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]'
            }`}
          >
            <Star className={`w-5 h-5 ${selectedCategory === 'All Doctors' ? 'fill-white' : 'text-zinc-400'}`} />
            See All Specialists
          </button>
        </motion.div>
      </div>

      {/* Full-Width Specialty Slider (Breaks out of container) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-20 -mx-4 sm:-mx-6 lg:-mx-8 relative group"
      >
        <div className="flex items-center justify-start overflow-x-auto pb-10 pt-6 no-scrollbar scroll-smooth">
          <div className="flex gap-6 shrink-0 px-12 sm:px-20 lg:px-32">
            {categories.filter(c => c !== 'All Doctors').map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-14 py-4 rounded-full text-base font-black transition-all duration-300 border-2 whitespace-nowrap shrink-0 select-none ${
                    isActive
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-2xl shadow-[var(--color-primary)]/40 scale-110 translate-y-[-4px]'
                      : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-500 hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Visual Cues for Sliding */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none" />
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-t-4 border-[var(--color-primary)] animate-spin opacity-80"></div>
            <div className="absolute inset-2 rounded-full border-r-4 border-[var(--color-secondary)] animate-spin animation-delay-2000 opacity-80"></div>
          </div>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-2xl p-1.5 shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col group border-2 border-white/50 dark:border-zinc-700/40"
              >
                <div className="bg-white dark:bg-zinc-900/80 rounded-[1.8rem] flex-1 flex flex-col h-full">
                  <div className="p-8 flex-1">
                    <div className="flex items-start justify-between mb-6">
                      <div className="h-20 w-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-md transform rotate-3 group-hover:-rotate-3 transition-transform overflow-hidden">
                        {doctor.userId?.image ? (
                          <img src={doctor.userId.image} alt={doctor.userId.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{doctor.userId?.name?.charAt(0) || 'D'}</span>
                        )}
                      </div>
                      <div className="flex bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] px-3 py-1 rounded-full text-sm font-semibold items-center gap-1">
                        <Star className="w-4 h-4 fill-current" /> 4.9
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[var(--foreground)] truncate mb-2">
                      Dr. {doctor.userId?.name}
                    </h3>
                    <p className="text-[var(--color-primary)] font-semibold flex items-center gap-2 mb-6 text-lg">
                      <Stethoscope className="w-5 h-5" /> {doctor.specialization}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-[var(--muted)] font-medium">
                        <Clock className="w-5 h-5 mr-3 text-zinc-400" /> {doctor.experience} Years Exp.
                      </div>
                      <div className="flex items-center text-[var(--muted)] font-medium">
                        <Award className="w-5 h-5 mr-3 text-zinc-400" /> Fee: <span className="text-[var(--foreground)] ml-1 font-bold">LKR {doctor.consultationFee?.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-zinc-100 dark:border-zinc-800/50">
                    <Link href={`/doctors/${doctor._id}`} className="flex items-center justify-center w-full py-3 rounded-lg btn-premium bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 dark:from-[var(--color-primary)]/20 dark:to-[var(--color-secondary)]/20 text-[var(--color-primary)] group-hover:from-[var(--color-primary)] group-hover:to-[var(--color-secondary)] group-hover:text-white font-bold transition-all shadow-sm hover:shadow-lg text-base border border-[var(--color-primary)]/20">
                      View Profile
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredDoctors.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-24"
            >
              <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">No Specialists Found</h3>
              <p className="text-[var(--muted)] text-lg">We couldn't find anyone matching your search criteria.</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
}

export default function DoctorsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Suspense fallback={<div className="text-center py-24 font-bold text-lg">Loading специалисты...</div>}>
          <DoctorsList />
        </Suspense>
      </div>
    </div>
  );
}
