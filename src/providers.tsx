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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              borderRadius: '16px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#eff6ff',
              },
            },
            error: {
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#eff6ff',
              },
              // Overriding standard error styles to follow the "all light blue" request
              style: {
                background: '#eff6ff',
                color: '#1e40af',
                border: '1px solid #bfdbfe',
              }
            },
          }}
        />
        {children}
      </SessionHandler>
    </SessionProvider>
  );
}
