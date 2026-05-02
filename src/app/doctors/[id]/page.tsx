'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { formatDate } from '../../../lib/formatDate';
import { Stethoscope, Star, CheckCircle, Clock, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { use } from 'react';

// Helper function to convert 24-hour time to 12-hour AM/PM format
const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
};

export default function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const p = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form State
  const [selectedDate, setSelectedDate] = useState(''); // ISO yyyy-mm-dd
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors/${p.id}`);
        if (res.ok) {
          const data = await res.json();
          setDoctor(data);
        } else {
          toast.error('Doctor not found');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [p.id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please log in to book an appointment');
      router.push('/login');
      return;
    }
    if (session.user.role !== 'patient') {
      toast.error('Only patients can book appointments');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.userId._id,
          date: selectedDate,
          time: selectedTime,
          doctorName: doctor.userId?.name,
          doctorSpecialization: doctor.specialization,
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to process payment');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBookWithoutPayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please log in to book an appointment');
      router.push('/login');
      return;
    }
    if (session.user.role !== 'patient') {
      toast.error('Only patients can book appointments');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.userId._id,
          date: selectedDate,
          time: selectedTime,
          message: 'Booked without online payment - pay at clinic',
        })
      });

      if (res.ok) {
        toast.success('Appointment booked. Please pay at the clinic.');
        setTimeout(() => router.push('/dashboard/patient'), 1500);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  if (!doctor) return null;

  // Flatten available times logic for simplicity
  const availableTimes = doctor.availability?.find((a: any) => {
    if (!selectedDate) return false;
    const date = new Date(selectedDate);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    return a.day === day;
  })?.slots || [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/doctors" className="inline-flex items-center text-sm font-medium text-(--muted) hover:text-(--foreground) mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to specialists
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Profile Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="h-24 w-24 bg-linear-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md shrink-0 overflow-hidden">
                  {doctor.userId?.image ? (
                    <img src={doctor.userId.image} alt={doctor.userId.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{doctor.userId?.name?.charAt(0) || 'D'}</span>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-(--foreground) mb-2">Dr. {doctor.userId?.name}</h1>
                  <p className="inline-flex items-center px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-primary rounded-full text-sm font-medium">
                    <Stethoscope className="w-4 h-4 mr-1" /> {doctor.specialization}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="text-sm text-(--muted) mb-1">Experience</p>
                  <p className="font-semibold text-(--foreground)">{doctor.experience} Years</p>
                </div>
                <div>
                  <p className="text-sm text-(--muted) mb-1">Consultation Fee</p>
                  <p className="font-semibold text-(--foreground)">LKR {doctor.consultationFee?.toLocaleString('en-US')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-(--muted) mb-1">Status</p>
                  <p className="font-semibold text-(--foreground) flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Accepting New Patients
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-(--foreground) mb-4">About the Doctor</h3>
                <p className="text-(--muted) leading-relaxed">
                  {doctor.bio || `Dr. ${doctor.userId?.name} is a renowned ${doctor.specialization} with over ${doctor.experience} years of experience in providing comprehensive wellness and medical care.`}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Widget Area */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-(--foreground) mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Book Appointment
              </h3>
              
              <form onSubmit={handleBooking} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-(--foreground) mb-2">Select Date</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(''); // Reset time when date changes
                    }}
                    className="block w-full px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  />
                  {selectedDate && (
                    <div className="mt-2 text-sm text-(--muted)">Selected: {formatDate(selectedDate, { weekday: true, month: 'short' })}</div>
                  )}
                </div>

                {selectedDate && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-sm font-medium text-(--foreground) mb-2">Select Time</label>
                    {availableTimes.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimes.map((time: string) => (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 text-sm font-medium rounded-xl border transition-all ${selectedTime === time ? 'border-primary bg-teal-50 dark:bg-teal-900/40 text-primary shadow-md' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-(--foreground)'}`}
                          >
                            {convertTo12Hour(time)}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-(--muted) bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
                        No slots available on this day.
                      </p>
                    )}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={!selectedDate || !selectedTime || bookingLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all mt-4"
                >
                  {bookingLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Pay LKR 1,650 & Book'}
                </button>
                <button
                  type="button"
                  onClick={handleBookWithoutPayment}
                  disabled={!selectedDate || !selectedTime || bookingLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border rounded-xl shadow-sm text-sm font-bold text-primary bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all mt-3"
                >
                  {bookingLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Book without payment (Pay at clinic)'}
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
