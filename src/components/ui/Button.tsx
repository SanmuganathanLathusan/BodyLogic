import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'base',
      isLoading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn btn-premium';

    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      danger: 'btn-danger',
      success: 'btn-success',
    };

    const sizeClasses = {
      xs: 'btn-xs',
      sm: 'btn-sm',
      base: 'btn-base',
      lg: 'btn-lg',
      xl: 'btn-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          isLoading && 'btn-loading',
          className
        )}
        {...props}
      >
        {isLoading && iconPosition === 'left' && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {!isLoading && icon && iconPosition === 'left' && icon}
        <span>{children}</span>
        {!isLoading && icon && iconPosition === 'right' && icon}
        {isLoading && iconPosition === 'right' && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
