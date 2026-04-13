'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, Star, Search, MapPin, Clock } from 'lucide-react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredDoctors = doctors.filter(doctor => 
    doctor.userId?.name.toLowerCase().includes(search.toLowerCase()) || 
    doctor.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Find a Specialist</h1>
          <p className="text-[var(--muted)]">Browse our network of verified wellness experts and book your consultation.</p>
          
          <div className="mt-8 relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-zinc-200 dark:border-zinc-800 rounded-full leading-5 bg-white dark:bg-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm text-[var(--foreground)] transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor, idx) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-xl border border-zinc-100 dark:border-zinc-800 transition-all overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
                      {doctor.userId?.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--foreground)] truncate">
                        Dr. {doctor.userId?.name}
                      </h3>
                      <p className="text-[var(--color-primary)] text-sm font-medium flex items-center gap-1">
                        <Stethoscope className="w-4 h-4" /> {doctor.specialization}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-6">
                    <div className="flex items-center text-sm text-[var(--muted)]">
                      <Clock className="w-4 h-4 mr-2" /> {doctor.experience} Years Experience
                    </div>
                    <div className="flex items-center text-sm text-[var(--muted)]">
                      <span className="font-medium mr-1">Fee:</span> ${doctor.consultationFee} 
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <Link href={`/doctors/${doctor._id}`} className="block w-full text-center py-2 px-4 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-medium transition-colors">
                    View Profile & Book
                  </Link>
                </div>
              </motion.div>
            ))}

            {filteredDoctors.length === 0 && (
              <div className="col-span-full text-center py-12 text-[var(--muted)]">
                No doctors found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
