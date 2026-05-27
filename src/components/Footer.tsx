'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, HeartPulse, ShieldCheck, Award, ArrowRight, Activity } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111827] text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Brand and Description */}
          <div className="col-span-1 lg:col-span-1 flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-white/10 shadow-lg transition-transform group-hover:scale-110 overflow-hidden">
                <img src="/brand/logo.png" alt="BodyLogic Logo" className="w-full h-full object-contain scale-[1.9] translate-y-1" />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Body<span className="text-[var(--color-primary)]">Logic</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The BodyLogic Foundation - leading the way in digital healthcare. Providing secure, reliable, and accessible medical services for everyone, everywhere.
            </p>
            {/* Accreditation Logos like in reference */}
            <div className="flex items-center gap-4 mt-2">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-8">
            <h3 className="font-bold text-lg tracking-tight border-b border-white/10 pb-2 w-fit pr-8">Useful links</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/#how-we-help" className="text-slate-400 hover:text-[var(--color-primary)] transition-colors text-sm">About us</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-[var(--color-primary)] transition-colors text-sm">Contact us</Link></li>
              <li><Link href="/doctors" className="text-slate-400 hover:text-[var(--color-primary)] transition-colors text-sm">Find a doctor</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-[var(--color-primary)] transition-colors text-sm">Privacy policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-[var(--color-primary)] transition-colors text-sm">Terms of service</Link></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="flex flex-col gap-8">
            <h3 className="font-bold text-lg tracking-tight border-b border-white/10 pb-2 w-fit pr-8">Get in touch</h3>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-[var(--color-primary)] shrink-0" />
                <span className="text-slate-400 text-sm">25 Galle Road, Colombo 03
                  Colombo, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-[var(--color-primary)] shrink-0" />
                <span className="text-slate-400 text-sm">+94778412323</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-[var(--color-primary)] shrink-0" />
                <span className="text-slate-400 text-sm">bodylogic@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Socials & Newsletter */}
          <div className="flex flex-col gap-8">
            <h3 className="font-bold text-lg tracking-tight border-b border-white/10 pb-2 w-fit pr-8">Stay Updated</h3>
            <p className="text-slate-400 text-sm">Subscribe to our newsletter for health tips and updates.</p>
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] w-full"
              />
              <button className="bg-[var(--color-primary)] p-2 rounded-full hover:bg-[var(--color-primary-dark)] transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2">
              {[1, 2, 3, 4].map(i => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[var(--color-primary)] hover:text-white transition-all">
                  <Activity className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © {currentYear} BodyLogic Foundation. All rights reserved. Registered Charity No. 12345678.
          </p>
          <div className="flex items-center gap-8">
            <div className="text-slate-600 text-[10px] font-bold tracking-widest uppercase">Premium Care</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
