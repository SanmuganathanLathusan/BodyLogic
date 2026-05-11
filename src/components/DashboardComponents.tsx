'use client';

import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  icon?: React.ReactNode;
  title: string;
  value?: string | number;
  subtitle?: string;
  gradient?: string;
  children?: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  gradient = 'from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10',
  children,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={clsx(
        'card p-6 bg-gradient-to-br',
        gradient,
        className
      )}
    >
      {icon && (
        <div className="mb-4 inline-flex p-3 rounded-lg bg-white/50 dark:bg-zinc-800/50">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-[var(--muted)] mb-1">{title}</h3>
      {value !== undefined && (
        <p className="text-3xl font-bold text-[var(--foreground)] mb-1">{value}</p>
      )}
      {subtitle && <p className="text-xs text-[var(--muted)]">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  );
};

interface DashboardLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  description,
  children,
  actions,
}) => {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">{title}</h1>
            {description && (
              <p className="text-[var(--muted)] mt-2">{description}</p>
            )}
          </div>
          {actions && <div className="flex gap-3">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
};
