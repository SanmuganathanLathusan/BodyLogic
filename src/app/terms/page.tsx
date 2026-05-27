'use client';

import { motion } from 'framer-motion';
import { Scale, Users, CheckCircle, AlertTriangle, ArrowLeft, HeartPulse } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  const terms = [
    {
      icon: <CheckCircle className="w-6 h-6 text-[var(--color-primary)]" />,
      title: "Agreement to Terms",
      content: "By accessing or using the BodyLogic platform, you agree to be bound by these Terms of Service. If you do not agree to all terms, you are prohibited from using our services. These terms constitute a legally binding agreement between you and BodyLogic Foundation."
    },
    {
      icon: <Users className="w-6 h-6 text-[var(--color-primary)]" />,
      title: "User Responsibilities",
      content: "Users are responsible for maintaining the confidentiality of their account credentials and for providing accurate medical history. You must be at least 18 years old or under guardian supervision to use our healthcare booking services."
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-[var(--color-primary)]" />,
      title: "Medical Services",
      content: "BodyLogic is a facilitator of medical appointments. While we verify our healthcare providers, the medical advice and treatment given by doctors are their professional responsibility. In case of a medical emergency, please call your local emergency services immediately."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-[var(--color-primary)]" />,
      title: "Limitation of Liability",
      content: "BodyLogic shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. We strive for 99.9% uptime but do not guarantee uninterrupted service during technical maintenance."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[var(--color-primary)] transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Terms of <span className="text-[var(--color-primary)]">Service</span></h1>
              <p className="text-slate-500 font-medium">Please review our standards of care and platform usage.</p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300">
                <Scale className="w-10 h-10" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs/Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {terms.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 bg-slate-50 rounded-[35px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {term.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{term.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {term.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-10 bg-[var(--color-primary)] rounded-[40px] text-white overflow-hidden relative"
        >
          {/* Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Acceptance of Standards</h3>
            <p className="text-white/80 text-sm leading-relaxed max-w-2xl mb-8">
              By using BodyLogic, you acknowledge that you have read and understood our Terms of Service. These guidelines are in place to ensure a professional and safe environment for both patients and healthcare providers.
            </p>
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[var(--color-primary)] rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all"
            >
              Get Started <Users className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
