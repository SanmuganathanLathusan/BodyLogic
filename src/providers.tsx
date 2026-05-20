'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function SessionHandler({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.requiresPasswordChange) {
      if (pathname !== '/change-password') {
        router.push('/change-password');
      }
    }
  }, [status, session, pathname, router]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionHandler>
        <Toaster position="top-right" />
        {children}
      </SessionHandler>
    </SessionProvider>
  );
}
