'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserCircle, LogOut, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch latest profile image from DB whenever session changes
  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/profile')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.image) {
            setProfileImage(data.image);
          } else {
            setProfileImage(session.user.image || null);
          }
        })
        .catch(() => {
          setProfileImage(session?.user?.image || null);
        });
    } else {
      setProfileImage(null);
    }
  }, [session]);

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
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled 
          ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm' 
          : 'bg-white/50 backdrop-blur-sm border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white border border-slate-100 shadow-sm transition-all duration-300 group-hover:scale-110 overflow-hidden">
                <img src="/brand/logo.png" alt="BodyLogic Logo" className="w-full h-full object-contain scale-[1.9] translate-y-1" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Body<span className="text-[var(--color-primary)]">Logic</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-medium text-sm text-slate-600 hover:text-[var(--color-primary)] transition-colors">
                Home
              </Link>
              <Link href="/doctors" className="font-medium text-sm text-slate-600 hover:text-[var(--color-primary)] transition-colors">
                Find Doctors
              </Link>
              <Link href="/contact" className="font-medium text-sm text-slate-600 hover:text-[var(--color-primary)] transition-colors">
                Contact
              </Link>
            </div>

            {/* Search Bar - Reference Style */}
            <div className="relative hidden xl:block">
              <form onSubmit={(e) => {
                e.preventDefault();
                const term = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                if (term) {
                  router.push(`/doctors?search=${encodeURIComponent(term)}`);
                }
              }}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  name="search"
                  type="text"
                  placeholder="Search..."
                  className="block w-48 pl-10 pr-3 py-1.5 border border-slate-200 rounded-full bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all w-full max-w-[200px]"
                />
              </form>
            </div>
            
            {session ? (
              <div className="flex items-center gap-5 border-l border-slate-200 pl-6">
                <Link
                  href={session.user.role === 'admin' ? '/dashboard/admin' : session.user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'}
                  className="group flex items-center gap-3"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-none">Dashboard</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[var(--color-primary)] transition-colors">
                      {session.user.name?.split(' ')[0]}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 shadow-sm overflow-hidden transition-transform group-hover:scale-110 group-hover:border-[var(--color-primary)]">
                      {profileImage ? (
                        <img src={profileImage} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-full h-full p-1 text-slate-400" />
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full"></div>
                  </div>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 group-hover:scale-110" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
                <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-[var(--color-primary)] transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-semibold bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-full shadow-md hover:bg-[var(--color-primary-dark)] hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 p-2 rounded-md hover:bg-slate-100 transition-colors"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <Link onClick={() => setMobileMenuOpen(false)} href="/" className="font-medium text-slate-700 p-2 rounded-md hover:bg-slate-50">
                Home
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/doctors" className="font-medium text-slate-700 p-2 rounded-md hover:bg-slate-50">
                Find Doctors
              </Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/contact" className="font-medium text-slate-700 p-2 rounded-md hover:bg-slate-50">
                Contact
              </Link>
              
              <div className="relative mt-2">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const term = (e.currentTarget.elements.namedItem('search-mobile') as HTMLInputElement).value;
                  if (term) {
                    setMobileMenuOpen(false);
                    router.push(`/doctors?search=${encodeURIComponent(term)}`);
                  }
                }}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    name="search-mobile"
                    type="text"
                    placeholder="Search doctors..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
                  />
                </form>
              </div>
              
              <div className="h-px bg-slate-100 w-full mt-2"></div>
              
              {session ? (
                <>
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    href={session.user.role === 'admin' ? '/dashboard/admin' : session.user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient'}
                    className="flex items-center gap-3 font-medium text-slate-700 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 border overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-full h-full p-1 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase">Dashboard</div>
                      <div className="text-sm font-bold text-slate-900">{session.user.name}</div>
                    </div>
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                    className="flex items-center gap-2 font-medium text-red-500 p-2 rounded-md hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link onClick={() => setMobileMenuOpen(false)} href="/login" className="w-full text-center font-semibold border border-slate-200 text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-50">
                    Log in
                  </Link>
                  <Link onClick={() => setMobileMenuOpen(false)} href="/register" className="w-full text-center font-semibold bg-[var(--color-primary)] text-white px-4 py-3 rounded-xl shadow-lg">
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
