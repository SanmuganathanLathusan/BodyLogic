'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const bulletPoints = [
    'Verified & Trusted Doctors',
    'Instant Appointment Booking',
    'Secure Medical Records'
  ];

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Desktop Background - Fixed parallax effect */}
      <div className="absolute inset-0 hidden md:block pointer-events-none">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('/uploads/doctercover.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>

      {/* Mobile Background - Cover without fixed */}
      <div 
        className="absolute inset-0 md:hidden pointer-events-none"
        style={{
          backgroundImage: `url('/uploads/doctercover.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content - positioned on top, full height centering */}
      <div className="relative z-10 w-full h-full flex items-center">
        {/* Text overlay for readability */}
        <div className="absolute inset-0 md:block hidden bg-gradient-to-r from-black/50 via-black/25 to-transparent pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative z-20 max-w-2xl w-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 w-fit mb-6 md:mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-white">Healthcare Innovation</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-4 md:mb-6"
          >
            Your Health,<br className="md:hidden" /> Our{' '}
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] text-transparent bg-clip-text">
              Priority
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-white/90 max-w-xl leading-relaxed font-light mb-6 md:mb-8"
          >
            Connect with verified healthcare professionals instantly. Book appointments, access medical records, and receive expert care all in one place.
          </motion.p>

          {/* Bullet Points */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10"
          >
            {bulletPoints.map((point, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white/85">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)] flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base font-medium">{point}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            {/* Primary Button */}
            <Link href="/register" className="group relative">
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-secondary-dark)] opacity-75 group-hover:opacity-100 blur transition-all duration-300 -z-10" />
              <button className="relative w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-secondary-dark)] shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105 group-active:scale-95">
                Get Started
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            {/* Secondary Button */}
            <Link href="/doctors" className="group">
              <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-white bg-white/10 backdrop-blur-md border border-white/40 hover:bg-white/20 hover:border-white/60 shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105 group-active:scale-95">
                Browse Doctors
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
