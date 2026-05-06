'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, CalendarCheck, ShieldCheck, HeartPulse, Clock, Search, Users, Award } from 'lucide-react';

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
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const doctors = [
    { name: 'Dr. Sarah Williams', specialty: 'Cardiologist', img: '👩‍⚕️' },
    { name: 'Dr. James Mitchell', specialty: 'Neurologist', img: '👨‍⚕️' },
    { name: 'Dr. Emily Chen', specialty: 'Orthopedist', img: '👩‍⚕️' }
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-950 pt-32 pb-32 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-primary)]/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob dark:opacity-20" />
          <div className="absolute top-40 -left-40 w-96 h-96 bg-[var(--color-secondary)]/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 dark:opacity-20" />
          <div className="absolute -bottom-40 right-20 w-96 h-96 bg-[var(--color-accent)]/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000 dark:opacity-20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="text-center lg:text-left lg:w-1/2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--foreground)] mb-6 leading-tight"
            >
              Discover Our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]">Mission and Values</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[var(--muted)] mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              We are dedicated to providing exceptional healthcare through a compassionate, patient-centered approach. Your wellness is our commitment.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            >
              <Link href="/doctors" className="btn-premium px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-lg font-semibold shadow-xl shadow-[var(--color-primary)]/40 hover:shadow-2xl hover:shadow-[var(--color-primary)]/50">
                Explore Doctors
              </Link>
              <Link href="/register" className="btn-premium px-8 py-4 glass-card text-[var(--foreground)] rounded-lg font-semibold border-2 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/50 flex items-center justify-center gap-2">
                Get Started <HeartPulse className="w-4 h-4 text-[var(--color-secondary)]" />
              </Link>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 w-full mt-12 lg:mt-0 relative">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-3 gap-4 md:gap-6"
            >
              {/* Trust Indicator Cards */}
              <div className="col-span-3 md:col-span-1 p-8 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-950 border-2 border-purple-200 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center">
                  <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-700">25M+</p>
                  <p className="text-sm font-semibold text-[var(--muted)] mt-3">Happy Patients</p>
                </div>
              </div>
              <div className="col-span-3 md:col-span-1 p-8 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-950 border-2 border-pink-200 dark:border-pink-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center">
                  <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] to-pink-700">99%</p>
                  <p className="text-sm font-semibold text-[var(--muted)] mt-3">Satisfaction Rate</p>
                </div>
              </div>
              <div className="col-span-3 md:col-span-1 p-8 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-900/30 dark:to-cyan-950 border-2 border-cyan-200 dark:border-cyan-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center">
                  <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-cyan-700">1000+</p>
                  <p className="text-sm font-semibold text-[var(--muted)] mt-3">Expert Doctors</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-gradient-to-b from-white to-purple-50/40 dark:from-zinc-900 dark:to-purple-950/20 border-t border-purple-100 dark:border-purple-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">Very Fast and Accurate Service</h2>
            <p className="mt-4 text-[var(--muted)] max-w-2xl mx-auto">Get the care you need in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-700 to-transparent z-0"></div>
            
            {[
              { icon: <Search className="w-6 h-6 text-white" />, title: 'Find Doctors', desc: 'Search for doctors by specialty or name.' },
              { icon: <Clock className="w-6 h-6 text-white" />, title: 'Book Appointment', desc: 'Choose an available time slot that suits you.' },
              { icon: <HeartPulse className="w-6 h-6 text-white" />, title: 'Get Care', desc: 'Attend your appointment and feel better.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-white dark:bg-zinc-800 border-4 border-purple-50 dark:border-purple-900 flex items-center justify-center mb-6 shadow-xl relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
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
      <section className="py-24 bg-white dark:bg-zinc-900 border-t border-purple-100 dark:border-purple-900">
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
              { icon: <ShieldCheck className="h-8 w-8 text-white" />, title: 'Verified Experts', desc: 'Every doctor on our platform is thoroughly vetted for maximum quality and trust.', bg: 'from-purple-500 to-purple-600' },
              { icon: <CalendarCheck className="h-8 w-8 text-white" />, title: 'Easy Scheduling', desc: 'Book, reschedule, or manage your appointments in just a few clicks.', bg: 'from-pink-500 to-pink-600' },
              { icon: <Activity className="h-8 w-8 text-white" />, title: 'Health Tracking', desc: 'Keep your visit history and prescriptions securely organized in one place.', bg: 'from-cyan-500 to-cyan-600' },
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants} 
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2rem] glass-card group cursor-pointer border border-white/50 dark:border-zinc-700/50"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bg} flex items-center justify-center shadow-lg mb-8 transform group-hover:rotate-6 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">{feature.title}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Expert Doctors Section */}
      <section className="py-24 bg-gradient-to-b from-purple-50/40 to-white dark:from-purple-950/20 dark:to-zinc-900 border-t border-purple-100 dark:border-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">Meet Our Expert Doctors</h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">All our doctors are highly qualified and experienced in their respective fields</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {doctors.map((doctor, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="card-hover bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-lg border-2 border-purple-100/50 dark:border-purple-800/30"
              >
                <div className={`h-36 bg-gradient-to-r ${i === 0 ? 'from-purple-500 via-pink-500 to-purple-600' : i === 1 ? 'from-pink-500 via-cyan-500 to-pink-600' : 'from-cyan-500 via-purple-500 to-cyan-600'}`}></div>
                <div className="p-8 text-center relative -mt-16">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-6xl mx-auto mb-6 border-4 border-white dark:border-zinc-800 shadow-lg">
                    {doctor.img}
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{doctor.name}</h3>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] font-bold mb-6">{doctor.specialty}</p>
                  <Link href="/doctors" className="btn-premium inline-block px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-lg text-sm font-semibold shadow-lg shadow-[var(--color-primary)]/30">
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link href="/doctors" className="btn-premium inline-block px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-lg font-semibold shadow-xl shadow-[var(--color-primary)]/40 hover:shadow-2xl hover:shadow-[var(--color-primary)]/50">
              Browse All Doctors
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Trust & Security Section */}
      <section className="py-24 bg-white dark:bg-zinc-900 border-t border-purple-100 dark:border-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">Your Trust is Our Foundation</h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">We prioritize your privacy and security above all else</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <Award className="h-8 w-8" />, title: 'Building Trust', desc: 'Maintaining integrity through transparent practices and consistent excellence.' },
              { icon: <Users className="h-8 w-8" />, title: 'Community Engagement', desc: 'Supporting local healthcare initiatives and patient education programs.' },
              { icon: <ShieldCheck className="h-8 w-8" />, title: 'Security and Privacy', desc: 'Your health data is protected with enterprise-grade encryption and compliance.' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{item.title}</h3>
                <p className="text-[var(--muted)]">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 bg-gradient-to-br from-zinc-900 to-purple-950 dark:from-zinc-950 dark:to-purple-950 border-t border-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
                  <HeartPulse className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl">Body<span className="text-[var(--color-secondary)]">logic</span></span>
              </div>
              <p className="text-gray-300 text-sm">Your trusted partner in healthcare.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/doctors" className="hover:text-[var(--color-secondary)] transition">Find Doctors</Link></li>
                <li><Link href="/" className="hover:text-[var(--color-secondary)] transition">Book Appointment</Link></li>
                <li><Link href="/" className="hover:text-[var(--color-secondary)] transition">Health Tracking</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/" className="hover:text-[var(--color-secondary)] transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[var(--color-secondary)] transition">Contact</Link></li>
                <li><Link href="/" className="hover:text-[var(--color-secondary)] transition">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/" className="hover:text-[var(--color-secondary)] transition">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-[var(--color-secondary)] transition">Terms of Service</Link></li>
                <li><Link href="/" className="hover:text-[var(--color-secondary)] transition">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-800 pt-8 text-center text-gray-300 text-sm">
            <p>&copy; {new Date().getFullYear()} Bodylogic. All rights reserved. | Designed for Your Wellness</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
