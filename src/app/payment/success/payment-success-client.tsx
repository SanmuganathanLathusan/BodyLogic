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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 max-w-md w-full text-center"
      >
        {loading ? (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-(--foreground) mb-2">Processing Payment</h2>
            <p className="text-(--muted)">Please wait while we confirm your payment...</p>
          </>
        ) : success ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            <h2 className="text-3xl font-bold text-(--foreground) mb-2">Payment Successful!</h2>
            <p className="text-(--muted) mb-6">Your appointment has been confirmed. A confirmation email will be sent to you shortly.</p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">✓ Payment completed</p>
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mt-1">✓ Appointment confirmed</p>
            </div>
            <p className="text-sm text-(--muted) mb-6">Redirecting to your dashboard in 3 seconds...</p>
            <Link href="/dashboard/patient" className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all">
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">✕</span>
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