'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, CalendarCheck, ShieldCheck, Star } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-50 dark:bg-[#080d17] pt-24 pb-32">
        <div className="absolute inset-x-0 top-0 h-96 overflow-hidden">
          <div className="absolute left-1/2 -ml-[40rem] w-[80rem] bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/10 blur-3xl opacity-30 h-[40rem] rounded-full dark:opacity-20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--foreground)] mb-6"
            >
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Our Priority.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-xl text-[var(--muted)] mb-10 leading-relaxed"
            >
              Bodylogic connects you with top-rated medical experts and wellness specialists. Book appointments effortlessly and take control of your well-being today.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center gap-4"
            >
              <Link href="/doctors" className="px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                Find a Specialist
              </Link>
              <Link href="/register" className="px-8 py-3.5 bg-white dark:bg-zinc-800 text-[var(--foreground)] border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 rounded-full font-semibold shadow-sm hover:shadow-md transition-all">
                Join as Doctor
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--foreground)]">Why Choose Bodylogic?</h2>
            <p className="mt-4 text-[var(--muted)] max-w-2xl mx-auto">Experience healthcare that revolves around you, bringing seamless connectivity and trusted care.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <ShieldCheck className="h-8 w-8 text-[var(--color-primary)]" />, title: 'Verified Experts', desc: 'Every doctor on our platform is thoroughly vetted for maximum quality and trust.' },
              { icon: <CalendarCheck className="h-8 w-8 text-[var(--color-secondary)]" />, title: 'Easy Scheduling', desc: 'Book, reschedule, or manage your appointments in just a few clicks.' },
              { icon: <Activity className="h-8 w-8 text-rose-500" />, title: 'Health Tracking', desc: 'Keep your visit history and prescriptions securely organized in one place.' },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">{feature.title}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="py-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-[var(--muted)]">
          <p>&copy; {new Date().getFullYear()} Bodylogic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
