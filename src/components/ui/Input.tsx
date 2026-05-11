import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      label,
      hint,
      icon,
      iconPosition = 'left',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={clsx(
              'input-premium',
              icon && iconPosition === 'left' && 'pl-11',
              icon && iconPosition === 'right' && 'pr-11',
              error && 'input-error',
              disabled && 'input-disabled',
              className
            )}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none">
              {icon}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        {hint && !error && <p className="text-sm text-[var(--muted)] mt-2">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
