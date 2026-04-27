'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mb-4">
            Get in <span className="text-[var(--color-primary)]">Touch</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Have questions about our services or need help booking an appointment? Our team is here to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center hover:border-[var(--color-primary)] transition-colors"
          >
            <div className="w-14 h-14 bg-sky-50 dark:bg-sky-900/30 text-[var(--color-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6">
               <Phone className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Phone</h3>
            <p className="text-[var(--muted)]">+1 (555) 123-4567</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center hover:border-[var(--color-primary)] transition-colors"
          >
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6">
               <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Email</h3>
            <p className="text-[var(--muted)]">hello@bodylogic.com</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center hover:border-[var(--color-primary)] transition-colors"
          >
             <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Office</h3>
            <p className="text-[var(--muted)]">123 Wellness Ave, Suite 100<br/>San Francisco, CA 94103</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto glass-card p-8 md:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800"
        >
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">First Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Last Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Email</label>
              <input required type="email" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Message</label>
              <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
