'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, CalendarCheck, ShieldCheck, HeartPulse, Stethoscope, Clock, Search } from 'lucide-react';
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
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-zinc-50 dark:bg-zinc-950 pt-32 pb-32 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:opacity-20" />
          <div className="absolute top-40 -left-40 w-96 h-96 bg-[var(--color-secondary)]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 dark:opacity-20" />
          <div className="absolute -bottom-40 right-20 w-96 h-96 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 dark:bg-emerald-900/20 dark:opacity-20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="text-center lg:text-left lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium text-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
              </span>
              Over 1,000 Verified Specialists
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--foreground)] mb-6 leading-tight"
            >
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Our Priority.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[var(--muted)] mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Bodylogic connects you with top-rated medical experts and wellness specialists. Book appointments effortlessly and take control of your well-being today.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            >
              <Link href="/doctors" className="px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-full font-semibold shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-xl hover:shadow-[var(--color-primary)]/40 transition-all transform hover:-translate-y-1">
                Find a Specialist
              </Link>
              <Link href="/register" className="px-8 py-4 glass-card text-[var(--foreground)] rounded-full font-semibold hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Join as Doctor <HeartPulse className="w-4 h-4 text-[var(--color-primary)]" />
              </Link>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 w-full mt-12 lg:mt-0 relative hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full aspect-square max-w-lg mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 rounded-3xl transform rotate-6 scale-105"></div>
              <div className="absolute inset-0 glass-card rounded-3xl overflow-hidden border border-white/20 dark:border-zinc-700/50 flex flex-col p-6 shadow-2xl">
                <div className="flex-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-700 pb-4">
                     <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-xl">D</div>
                     <div>
                       <h3 className="font-bold text-[var(--foreground)]">Dr. Sarah Jenkins</h3>
                       <p className="text-sm text-[var(--color-primary)]">Cardiologist</p>
                     </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="w-full h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
                    <div className="w-3/4 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
                    <div className="mt-auto px-4 py-3 bg-[var(--color-primary)] text-white text-center rounded-xl font-medium">Available Today</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">Seamless Healthcare Experience</h2>
            <p className="mt-4 text-[var(--muted)] max-w-2xl mx-auto">Get the care you need in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent z-0"></div>
            
            {[
              { icon: <Search className="w-6 h-6 text-white" />, title: 'Find', desc: 'Search for doctors by specialty or name.' },
              { icon: <Clock className="w-6 h-6 text-white" />, title: 'Book', desc: 'Choose an available time slot that suits you.' },
              { icon: <HeartPulse className="w-6 h-6 text-white" />, title: 'Heal', desc: 'Attend your appointment and feel better.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-zinc-50 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 flex items-center justify-center mb-6 shadow-xl relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{step.title}</h3>
                <p className="text-[var(--muted)]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">Why Choose Bodylogic?</h2>
            <p className="text-[var(--muted)] max-w-2xl">Experience healthcare that revolves around you, bringing seamless connectivity and trusted care.</p>
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
              <motion.div 
                key={i} 
                variants={itemVariants} 
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2rem] glass-card group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800/80 flex items-center justify-center shadow-sm mb-8 transform group-hover:rotate-6 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">{feature.title}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="py-12 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-[var(--muted)]">
          <div className="flex justify-center items-center gap-2 mb-4">
            <HeartPulse className="h-6 w-6 text-[var(--color-primary)]" />
            <span className="font-bold text-xl text-[var(--foreground)]">Body<span className="text-[var(--color-primary)]">logic</span></span>
          </div>
          <p>&copy; {new Date().getFullYear()} Bodylogic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
