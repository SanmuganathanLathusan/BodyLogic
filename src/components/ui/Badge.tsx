import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'base' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'base',
  icon,
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    base: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={clsx(
        'badge',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
