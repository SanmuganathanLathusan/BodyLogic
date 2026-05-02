import { Suspense } from 'react';
import PaymentSuccessClient from './payment-success-client';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
