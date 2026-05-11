import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'base' | 'lg' | 'xl';
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'base',
  fullScreen = false,
  message,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    base: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4" {...props}>
      <Loader2 className={clsx('animate-spin', sizeClasses[size], className)} />
      {message && <p className="text-[var(--muted)] text-sm">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/10 dark:bg-black/40 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
