'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!orderId) {
        toast.error('Invalid payment token');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId })
        });

        if (res.ok) {
          await res.json();
          setSuccess(true);
          toast.success('Appointment booked successfully!');
          setTimeout(() => {
            router.push('/dashboard/patient');
          }, 3000);
        } else {
          const data = await res.json();
          toast.error(data.message || 'Failed to confirm payment');
          setSuccess(false);
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred');
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-purple-50/30 dark:from-zinc-950 dark:to-purple-950/20 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl shadow-2xl border-2 border-white/50 dark:border-zinc-700/50 p-10 max-w-md w-full text-center"
      >
        {loading ? (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Processing Payment</h2>
            <p className="text-[var(--muted)]">Please wait while we confirm your payment...</p>
          </>
        ) : success ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500 drop-shadow-lg" />
            </motion.div>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-3">Payment Successful!</h2>
            <p className="text-[var(--muted)] mb-8">Your appointment has been confirmed. A confirmation email will be sent to you shortly.</p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800/50 rounded-lg p-5 mb-8 space-y-2">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">✓ Payment completed</p>
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">✓ Appointment confirmed</p>
            </div>
            <p className="text-sm text-[var(--muted)] mb-8">Redirecting to your dashboard in 3 seconds...</p>
            <Link href="/dashboard/patient" className="btn-premium inline-block px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-lg font-semibold shadow-lg shadow-[var(--color-primary)]/40 hover:shadow-xl">
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center border-2 border-red-200 dark:border-red-800">
                <span className="text-3xl font-bold text-red-600">✕</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-(--foreground) mb-2">Payment Failed</h2>
            <p className="text-(--muted) mb-6">There was an issue confirming your payment. Please try again.</p>
            <Link href="/doctors" className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all">
              Back to Doctors
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}