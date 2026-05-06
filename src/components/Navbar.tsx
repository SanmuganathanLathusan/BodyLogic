'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { HeartPulse, UserCircle, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [mobileMenuOpen]);

  return (
    <nav 
      className={clsx(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled 
          ? "glass shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg shadow-[var(--color-primary)]/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[var(--color-primary)]/50">
                <HeartPulse className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[var(--foreground)]">Body<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">logic</span></span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className="relative font-medium text-[var(--foreground)] hover:text-[var(--color-primary)] transition-colors group px-3 py-2 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
              Home
              <span className="absolute inset-x-0 bottom-1 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded-full"></span>
            </Link>
            <Link href="/doctors" className="relative font-medium text-[var(--foreground)] hover:text-[var(--color-primary)] transition-colors group px-3 py-2 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
              All Doctors
              <span className="absolute inset-x-0 bottom-1 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded-full"></span>
            </Link>
            <Link href="/contact" className="relative font-medium text-[var(--foreground)] hover:text-[var(--color-primary)] transition-colors group px-3 py-2 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
              Contact
              <span className="absolute inset-x-0 bottom-1 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded-full"></span>
            </Link>
            
            {session ? (
              <div className="flex items-center gap-3 ml-4 pl-6 border-l border-zinc-200 dark:border-zinc-800">
                <Link
                  href={session.user.role === 'admin' ? '/dashboard/admin' : session.user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--color-primary)] transition-colors group px-3 py-2 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                >
                  <UserCircle className="h-5 w-5 text-zinc-500 group-hover:text-[var(--color-primary)] transition-colors" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors px-3.5 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-6 border-l border-zinc-200 dark:border-zinc-800">
                <Link href="/login" className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--color-primary)] transition-colors px-4 py-2 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-semibold btn-premium bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-secondary-dark)] text-white px-5 py-2.5 rounded-lg shadow-lg shadow-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/50">
                  Create account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[var(--foreground)] p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <Link onClick={() => setMobileMenuOpen(false)} href="/" className="font-medium text-[var(--foreground)] p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Home
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/doctors" className="font-medium text-[var(--foreground)] p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                All Doctors
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/contact" className="font-medium text-[var(--foreground)] p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Contact
              </Link>
              
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full"></div>
              
              {session ? (
                <>
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    href={session.user.role === 'admin' ? '/dashboard/admin' : session.user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'}
                    className="flex items-center gap-2 font-medium text-[var(--foreground)] p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                    className="flex items-center gap-2 font-medium text-red-500 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link onClick={() => setMobileMenuOpen(false)} href="/login" className="w-full text-center font-semibold border-2 border-zinc-300 dark:border-zinc-700 text-[var(--foreground)] px-4 py-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all transform hover:scale-105">
                    Log in
                  </Link>
                  <Link onClick={() => setMobileMenuOpen(false)} href="/register" className="w-full text-center font-semibold btn-premium bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-secondary-dark)] text-white px-4 py-3 rounded-lg shadow-lg shadow-[var(--color-primary)]/40">
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
