'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { HeartPulse, UserCircle, LogOut } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 glass w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <HeartPulse className="h-8 w-8 text-[var(--color-primary)] transition-transform group-hover:scale-110" />
              <span className="font-bold text-xl tracking-tight text-[var(--foreground)]">Body<span className="text-[var(--color-primary)]">logic</span></span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/doctors" className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors">
              Find a Doctor
            </Link>
            
            {session ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                <Link
                  href={session.user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'}
                  className="flex items-center gap-2 text-sm font-medium hover:text-[var(--color-primary)] transition-colors"
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                <Link href="/login" className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-medium bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm ml-2">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
