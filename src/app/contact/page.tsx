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
            className="card-hover glass-card p-8 rounded-2xl border-2 border-pink-200/50 dark:border-pink-700/30 text-center hover:border-[var(--color-secondary)] transition-all"
          >
            <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/30 text-[var(--color-secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--color-secondary)]/20">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">Phone</h3>
            <p className="text-[var(--muted)] font-medium">+94778412323</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-hover glass-card p-8 rounded-2xl border-2 border-purple-200/50 dark:border-purple-700/30 text-center hover:border-[var(--color-primary)] transition-all"
          >
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 text-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--color-primary)]/20">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">Email</h3>
            <p className="text-[var(--muted)] font-medium">bodylogic@gmail.com</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-hover glass-card p-8 rounded-2xl border-2 border-cyan-200/50 dark:border-cyan-700/30 text-center hover:border-[var(--color-accent)] transition-all"
          >
            <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-900/30 text-[var(--color-accent)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--color-accent)]/20">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">Office</h3>
            <p className="text-[var(--muted)] font-medium">
              25 Galle Road, Colombo 03<br />
              Colombo, Sri Lanka
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto glass-card p-10 md:p-12 rounded-2xl border-2 border-purple-200/50 dark:border-purple-700/30"
        >
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-[var(--foreground)]">First Name</label>
                <input required type="text" className="w-full px-4 py-3.5 rounded-lg border-2 border-zinc-200/90 bg-white/70 dark:bg-zinc-950/60 dark:border-zinc-800 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 outline-none transition-all" placeholder="John" />
              </div>
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-[var(--foreground)]">Last Name</label>
                <input required type="text" className="w-full px-4 py-3.5 rounded-lg border-2 border-zinc-200/90 bg-white/70 dark:bg-zinc-950/60 dark:border-zinc-800 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 outline-none transition-all" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-[var(--foreground)]">Email</label>
              <input required type="email" className="w-full px-4 py-3.5 rounded-lg border-2 border-zinc-200/90 bg-white/70 dark:bg-zinc-950/60 dark:border-zinc-800 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 outline-none transition-all" placeholder="john@example.com" />
            </div>
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-[var(--foreground)]">Message</label>
              <textarea required rows={5} className="w-full px-4 py-3.5 rounded-lg border-2 border-zinc-200/90 bg-white/70 dark:bg-zinc-950/60 dark:border-zinc-800 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="btn-premium w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-primary-dark)] hover:to-[var(--color-secondary-dark)] text-white font-semibold py-4 rounded-lg transition-all shadow-lg shadow-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/50 flex items-center justify-center gap-2.5 text-base">
              <Send className="w-5 h-5" /> Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
