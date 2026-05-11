import React from 'react';
import clsx from 'clsx';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'avatar' | 'button' | 'card' | 'line';
  width?: string;
  height?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  ...props
}) => {
  const variantClasses = {
    text: 'skeleton-text h-4 w-full',
    avatar: 'skeleton-avatar w-12 h-12 rounded-full',
    button: 'skeleton-button h-10 w-24 rounded-lg',
    card: 'skeleton-card h-48 w-full rounded-xl',
    line: 'skeleton h-3 w-full rounded',
  };

  return (
    <div
      className={clsx(
        'skeleton',
        variantClasses[variant],
        className
      )}
      style={{
        width: width || undefined,
        height: height || undefined,
      }}
      {...props}
    />
  );
};

export default Skeleton;
