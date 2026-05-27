'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />,
      title: "Information Collection",
      content: "We collect information that you provide directly to us, including personal data such as name, email address, and medical information when you register for an account or book an appointment. We also automatically collect certain technical information when you visit our platform."
    },
    {
      icon: <Lock className="w-6 h-6 text-[var(--color-primary)]" />,
      title: "Data Security",
      content: "BodyLogic implements industry-standard security measures including AES-256 encryption and SOC-2 compliant protocols to protect your sensitive healthcare data from unauthorized access, alteration, or destruction. Your trust is our foundation."
    },
    {
      icon: <Eye className="w-6 h-6 text-[var(--color-primary)]" />,
      title: "Information Usage",
      content: "The data we collect is used to provide and improve our services, facilitate appointments, and ensure compliance with healthcare regulations. We do not sell your personal data to third parties. Your data is used strictly for your healthcare journey."
    },
    {
      icon: <FileText className="w-6 h-6 text-[var(--color-primary)]" />,
      title: "Your Rights",
      content: "Under GDPR and HIPAA-aligned standards, you have the right to access, correct, or delete your personal information. You can manage your privacy settings directly from your dashboard or by contacting our data protection officer."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[var(--color-primary)] transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Privacy <span className="text-[var(--color-primary)]">Policy</span></h1>
          <p className="text-slate-500 font-medium">Last updated: May 27, 2026. Your privacy and data security are our highest priorities.</p>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12"
        >
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.section 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16 group"
              >
                <div className="absolute left-0 top-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors group-hover:text-white text-slate-400">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h2>
                <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                  {section.content}
                </p>
              </motion.section>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-slate-50">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Our Privacy Team</h3>
            <p className="text-slate-500 text-sm mb-6">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
            <div className="inline-flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[var(--color-primary)]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Privacy Officer</p>
                <p className="text-slate-900 font-bold">privacy@bodylogic.com</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
