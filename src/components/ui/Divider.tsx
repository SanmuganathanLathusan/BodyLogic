import React from 'react';
import clsx from 'clsx';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  margin?: 'none' | 'sm' | 'md' | 'lg';
  label?: string;
}

const Divider: React.FC<DividerProps> = ({
  direction = 'horizontal',
  margin = 'md',
  label,
  className,
  ...props
}) => {
  const marginClasses = {
    none: '',
    sm: direction === 'horizontal' ? 'my-2' : 'mx-2',
    md: direction === 'horizontal' ? 'my-4' : 'mx-4',
    lg: direction === 'horizontal' ? 'my-8' : 'mx-8',
  };

  if (direction === 'vertical') {
    return (
      <div
        className={clsx('divider-vertical', marginClasses[margin], className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        className={clsx('flex items-center gap-3', marginClasses[margin])}
        {...props}
      >
        <div className="flex-1 border-t border-[var(--border)]" />
        <span className="text-sm text-[var(--muted)] font-medium px-2">{label}</span>
        <div className="flex-1 border-t border-[var(--border)]" />
      </div>
    );
  }

  return (
    <div
      className={clsx('divider', marginClasses[margin], className)}
      {...props}
    />
  );
};

export default Divider;
