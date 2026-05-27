'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, HeartPulse } from 'lucide-react';

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
    <section className="relative w-full min-h-[90vh] flex items-center bg-white overflow-hidden pt-20">
      {/* Background Decorative Elements - Subtle gradients/shapes like reference */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-6 transform origin-top-right -z-10" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {/* Badge - Simple like reference */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm tracking-wide uppercase"
            >
              <div className="w-8 h-[2px] bg-[var(--color-primary)]" />
              Empowering Healthcare
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight"
            >
              Your Health,<br />
              Our <span className="text-[var(--color-primary)]">Priority</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-600 max-w-lg leading-relaxed"
            >
              Connecting you with world-class healthcare professionals. Access expert medical care, digital prescriptions, and personalized health tracking in one secure platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mt-4"
            >
              <Link href="/register">
                <button className="px-8 py-4 bg-[var(--color-primary)] text-white font-bold rounded-full shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-xl hover:bg-[var(--color-primary-dark)] transition-all hover:-translate-y-1 active:scale-95">
                  Get Started Now
                </button>
              </Link>
              <Link href="/doctors">
                <button className="px-8 py-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all hover:-translate-y-1 active:scale-95">
                  Find a Doctor
                </button>
              </Link>
            </motion.div>

            {/* Trust Badges / Stats (Subtle) */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-6 mt-8 pt-8 border-t border-slate-100"
            >
              <div className="flex -space-x-3">
                {[
                  '/uploads/patient1.png',
                  '/uploads/patient2.png',
                  '/uploads/patient3.png',
                  '/uploads/patient2.png',
                ].map((src, i) => (
                  <div key={i} className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-sm bg-slate-100">
                    <img src={src} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-11 h-11 rounded-full border-2 border-white bg-[var(--color-primary)] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                  10k+
                </div>
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-900">10,000+</span> Trusting Patients
              </p>
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/uploads/doctercover.png" 
                alt="Health Professionals" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Floating Info Cards like in reference */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status</p>
                <p className="text-sm font-bold text-slate-900">100% Secure</p>
              </div>
            </motion.div>

            
          </motion.div>

        </div>
      </div>
    </section>
  );
}
