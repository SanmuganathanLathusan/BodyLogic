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
    <div className="flex flex-col bg-white">
      {/* New Modern Hero Section */}
      <HeroSection />

      {/* How It Works - Reference Style */}
      <section id="how-we-help" className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-sm font-bold text-[var(--color-primary)] tracking-[0.2em] uppercase mb-4">Our Process</h2>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">How We Can Help You</h2>
            <div className="w-20 h-1 bg-[var(--color-primary)] mx-auto rounded-full" />
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative"
          >
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="relative flex flex-col items-center text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-8 relative z-10 border border-slate-100 group-hover:border-[var(--color-primary)]/50 transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                    0{i + 1}
                  </div>
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 group-hover:text-[var(--color-primary)] transition-colors">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-4">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Reference Style Cards */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-16 md:mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h2 className="text-sm font-bold text-[var(--color-primary)] tracking-[0.2em] uppercase mb-4">Why BodyLogic</h2>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">Experience Premium Healthcare</h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/doctors" className="flex items-center gap-2 text-[var(--color-primary)] font-bold hover:gap-3 transition-all duration-300">
                Explore All Services <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-[var(--color-primary)] flex items-center justify-center mb-8 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-500">
                  {i === 0 ? <ShieldCheck className="w-8 h-8" /> : i === 1 ? <CalendarCheck className="w-8 h-8" /> : <Activity className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{feature.desc}</p>
                <div className="w-12 h-[2px] bg-slate-100 group-hover:w-full group-hover:bg-[var(--color-primary)] transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">Latest news and events</h2>
            <div className="w-20 h-1 bg-[var(--color-primary)] mx-auto rounded-full" />
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 md:p-10 rounded-[3rem] flex flex-col sm:flex-row gap-8 items-center sm:items-start hover:shadow-xl transition-all border border-slate-100"
              >
                <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary)]/5 flex-shrink-0 flex items-center justify-center text-[var(--color-primary)]">
                  {i === 0 ? <Award className="w-10 h-10" /> : i === 1 ? <Zap className="w-10 h-10" /> : i === 2 ? <ShieldCheck className="w-10 h-10" /> : <Users className="w-10 h-10" />}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{benefit.desc}</p>
                  <button className="text-[var(--color-primary)] text-sm font-bold flex items-center gap-2 mx-auto sm:mx-0 hover:gap-3 transition-all">
                    Find out more <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Reference Style */}
      <section className="py-24 md:py-32 bg-[var(--color-primary)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">Stay updated!</h2>
            <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              We are supporting healthcare innovation to make a difference. Keep informed of our progress and how you can become part of the transformation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                href="/register"
                className="px-10 py-5 bg-white text-[var(--color-primary)] rounded-full font-bold shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Sign up for our Newsletter <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
