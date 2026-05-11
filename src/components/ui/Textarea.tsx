import React from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error,
      label,
      hint,
      maxLength,
      showCharCount = false,
      className,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          className={clsx(
            'textarea-base',
            error && 'input-error',
            disabled && 'input-disabled',
            className
          )}
          {...props}
        />

        <div className="flex justify-between items-start mt-2">
          <div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {hint && !error && <p className="text-sm text-[var(--muted)]">{hint}</p>}
          </div>
          {showCharCount && maxLength && (
            <p className="text-xs text-[var(--muted)]">
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
