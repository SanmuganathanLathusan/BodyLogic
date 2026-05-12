'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Activity, CalendarCheck, ShieldCheck, HeartPulse, Clock, Search, 
  Users, Award, ArrowRight, CheckCircle, Star, Zap 
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 } 
    }
  };

  const features = [
    { 
      icon: <ShieldCheck className="h-8 w-8 text-white" />, 
      title: 'Verified Experts', 
      desc: 'Every doctor is thoroughly vetted for quality & trust',
      bg: 'from-purple-500 to-purple-600' 
    },
    { 
      icon: <CalendarCheck className="h-8 w-8 text-white" />, 
      title: 'Easy Scheduling', 
      desc: 'Book appointments in just a few clicks',
      bg: 'from-pink-500 to-pink-600' 
    },
    { 
      icon: <Activity className="h-8 w-8 text-white" />, 
      title: 'Health Tracking', 
      desc: 'Keep all your medical history secure & organized',
      bg: 'from-cyan-500 to-cyan-600' 
    },
  ];

  const stats = [
    { value: '25M+', label: 'Happy Patients', color: 'from-white to-white/80' },
    { value: '99%', label: 'Satisfaction Rate', color: 'from-white to-white/80' },
    { value: '100+', label: 'Expert Doctors', color: 'from-white to-white/80' },
  ];

  const steps = [
    { icon: <Search className="w-6 h-6 text-white" />, title: 'Find Doctors', desc: 'Search specialists by name or expertise' },
    { icon: <Clock className="w-6 h-6 text-white" />, title: 'Book Appointment', desc: 'Choose your preferred time slot' },
    { icon: <HeartPulse className="w-6 h-6 text-white" />, title: 'Get Care', desc: 'Consult & receive expert healthcare' },
  ];

  const benefits = [
    { icon: <Award className="h-8 w-8" />, title: 'Premium Quality', desc: 'Top-tier healthcare professionals' },
    { icon: <Zap className="h-8 w-8" />, title: 'Lightning Fast', desc: 'Instant booking & confirmations' },
    { icon: <ShieldCheck className="h-8 w-8" />, title: 'Secure & Private', desc: 'Enterprise-grade data protection' },
    { icon: <Users className="h-8 w-8" />, title: 'Community Driven', desc: 'Support from thousands of patients' },
  ];

  return (
    <div className="flex flex-col">
      {/* New Modern Hero Section */}
      <HeroSection />

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-purple-50/40 dark:from-zinc-900 dark:to-purple-950/20 border-t border-zinc-100/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">Simple & Secure Process</h2>
            <p className="text-base sm:text-lg text-[var(--muted)] max-w-2xl mx-auto">Get expert healthcare in three easy steps</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative"
          >
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-[10%] right-[10%] h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent" />

            {steps.map((step, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="relative flex flex-col items-center text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="w-28 h-28 rounded-full bg-white dark:bg-zinc-800 border-4 border-zinc-100 dark:border-zinc-700 flex items-center justify-center mb-8 shadow-xl relative z-10 transition-all group-hover:shadow-2xl"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                    {step.icon}
                  </div>
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-3">{step.title}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-zinc-900 border-t border-zinc-100/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">Why Choose Bodylogic?</h2>
            <p className="text-base sm:text-lg text-[var(--muted)] max-w-2xl mx-auto">Experience healthcare that truly revolves around you</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="card hover:shadow-2xl transition-all overflow-hidden group"
              >
                <div className={`h-40 bg-gradient-to-br ${feature.bg}`} />
                <div className="p-8 -mt-14 relative">
                  <div className="w-24 h-24 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${feature.bg} flex items-center justify-center`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-3">{feature.title}</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-purple-50/40 to-white dark:from-purple-950/20 dark:to-zinc-900 border-t border-zinc-100/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">What Sets Us Apart</h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="card p-6 md:p-8 flex gap-5 md:gap-6 items-start hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex-shrink-0 flex items-center justify-center text-[var(--color-primary)]">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-[var(--foreground)] mb-2">{benefit.title}</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-zinc-900 border-t border-zinc-100/50 dark:border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">Ready to Get Started?</h2>
            <p className="text-base sm:text-lg text-[var(--muted)] mb-10 max-w-2xl mx-auto leading-relaxed">Join thousands of patients who trust Bodylogic for their healthcare needs.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/register"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-lg font-semibold shadow-lg shadow-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/50 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Create Your Account
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent rounded-lg font-semibold hover:bg-[var(--color-primary)]/5 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
